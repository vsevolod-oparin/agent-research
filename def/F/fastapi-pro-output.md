## Task 1

**File Upload with CSV Validation and Summary**

```python
import csv
import io
import statistics
from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel

app = FastAPI()

REQUIRED_COLUMNS = {"name", "email", "age"}


class ColumnStats(BaseModel):
    age_min: float
    age_max: float
    age_mean: float
    age_median: float
    unique_emails: int
    unique_names: int


class CSVSummary(BaseModel):
    row_count: int
    columns: list[str]
    stats: ColumnStats


@app.post("/upload-csv", response_model=CSVSummary)
async def upload_csv(file: UploadFile):
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV.")

    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be UTF-8 encoded.")

    reader = csv.DictReader(io.StringIO(text))
    if reader.fieldnames is None:
        raise HTTPException(status_code=400, detail="CSV has no headers.")

    columns = set(reader.fieldnames)
    missing = REQUIRED_COLUMNS - columns
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required columns: {', '.join(sorted(missing))}",
        )

    ages: list[float] = []
    emails: set[str] = set()
    names: set[str] = set()
    row_count = 0

    for i, row in enumerate(reader, start=2):
        row_count += 1
        try:
            age = float(row["age"])
            if age < 0 or age > 150:
                raise ValueError
            ages.append(age)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=422, detail=f"Invalid age on row {i}: {row['age']!r}"
            )
        emails.add(row["email"].strip().lower())
        names.add(row["name"].strip())

    if row_count == 0:
        raise HTTPException(status_code=422, detail="CSV contains no data rows.")

    return CSVSummary(
        row_count=row_count,
        columns=sorted(reader.fieldnames),
        stats=ColumnStats(
            age_min=min(ages),
            age_max=max(ages),
            age_mean=round(statistics.mean(ages), 2),
            age_median=round(statistics.median(ages), 2),
            unique_emails=len(emails),
            unique_names=len(names),
        ),
    )
```

---

## Task 2

**Rate Limiting with Per-User and Per-IP Buckets**

```python
import time
from collections import defaultdict
from dataclasses import dataclass, field
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()


@dataclass
class TokenBucket:
    capacity: int
    refill_rate: float  # tokens per second
    tokens: float = field(init=False)
    last_refill: float = field(init=False)

    def __post_init__(self):
        self.tokens = float(self.capacity)
        self.last_refill = time.monotonic()

    def consume(self) -> tuple[bool, float]:
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

        if self.tokens >= 1.0:
            self.tokens -= 1.0
            return True, 0.0

        wait = (1.0 - self.tokens) / self.refill_rate
        return False, round(wait, 1)


class RateLimiter:
    def __init__(self):
        self._auth_buckets: dict[str, TokenBucket] = defaultdict(
            lambda: TokenBucket(capacity=100, refill_rate=100 / 60)
        )
        self._anon_buckets: dict[str, TokenBucket] = defaultdict(
            lambda: TokenBucket(capacity=20, refill_rate=20 / 60)
        )

    def check(self, *, user_id: str | None, ip: str) -> tuple[bool, float]:
        if user_id:
            return self._auth_buckets[user_id].consume()
        return self._anon_buckets[ip].consume()


limiter = RateLimiter()


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        user_id = None
        auth = request.headers.get("authorization", "")
        if auth.startswith("Bearer "):
            user_id = auth[7:]  # In production, decode JWT here

        ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or (
            request.client.host if request.client else "unknown"
        )
        allowed, retry_after = limiter.check(user_id=user_id, ip=ip)

        if not allowed:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded."},
                headers={"Retry-After": str(retry_after)},
            )

        return await call_next(request)


app.add_middleware(RateLimitMiddleware)
```

For production, replace in-process dicts with Redis using a Lua script for atomic increment.

---

## Task 3

**Fixing the N+1 Query with `selectinload`**

```python
# BAD -- 101 queries
@app.get("/users")
async def list_users(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User))
    users = result.scalars().all()          # 1 query
    for user in users:
        _ = user.roles  # each triggers lazy load => 100 more queries
```

**Fix:**

```python
from sqlalchemy.orm import selectinload

@app.get("/users")
async def list_users(session: AsyncSession = Depends(get_session)):
    stmt = (
        select(User)
        .options(selectinload(User.roles))   # THE FIX: 2 queries total
        .limit(100)
    )
    result = await session.execute(stmt)
    users = result.scalars().unique().all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "roles": [r.name for r in u.roles],
        }
        for u in users
    ]
```

Set `lazy="raise"` on the relationship to prevent accidental lazy loading in async code:

```python
class User(Base):
    roles: Mapped[list[Role]] = relationship(secondary=user_roles, lazy="raise")
```

| Strategy | Queries | Best for |
|---|---|---|
| `selectinload` | 2 (users + `WHERE id IN (...)` for roles) | Many-to-many, collections |
| `joinedload` | 1 (LEFT JOIN) | One-to-one, many-to-one |

---

## Task 4

**WebSocket Chat Room**

```python
import asyncio
from dataclasses import dataclass, field
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from datetime import datetime, timezone

app = FastAPI()


@dataclass
class ChatRoom:
    connections: dict[str, WebSocket] = field(default_factory=dict)
    _lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def connect(self, username: str, ws: WebSocket):
        await ws.accept()
        async with self._lock:
            self.connections[username] = ws
        await self.broadcast(
            {"type": "system", "message": f"{username} joined."},
            exclude=username,
        )

    async def disconnect(self, username: str):
        async with self._lock:
            self.connections.pop(username, None)
        await self.broadcast({"type": "system", "message": f"{username} left."})

    async def broadcast(self, message: dict, *, exclude: str | None = None):
        async with self._lock:
            targets = [(n, ws) for n, ws in self.connections.items() if n != exclude]
        stale = []
        for name, ws in targets:
            try:
                await ws.send_json(message)
            except Exception:
                stale.append(name)
        if stale:
            async with self._lock:
                for name in stale:
                    self.connections.pop(name, None)


rooms: dict[str, ChatRoom] = {}


def get_room(room_id: str) -> ChatRoom:
    if room_id not in rooms:
        rooms[room_id] = ChatRoom()
    return rooms[room_id]


@app.websocket("/ws/chat/{room_id}")
async def chat_endpoint(ws: WebSocket, room_id: str, username: str):
    room = get_room(room_id)
    await room.connect(username, ws)

    try:
        while True:
            data = await ws.receive_json()
            await room.broadcast({
                "type": "message",
                "from": username,
                "message": data.get("message", ""),
                "ts": datetime.now(timezone.utc).isoformat(),
            })
    except WebSocketDisconnect:
        await room.disconnect(username)
```

Usage: `ws://localhost:8000/ws/chat/general?username=alice`

---

## Task 5

**Background Order Processing with Status Polling**

```python
import asyncio
import uuid
from datetime import datetime, timezone
from enum import StrEnum
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class OrderStatus(StrEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class OrderRequest(BaseModel):
    product_id: str
    quantity: int
    customer_email: str


class OrderResponse(BaseModel):
    order_id: str
    status: OrderStatus
    created_at: str


class OrderStatusResponse(BaseModel):
    order_id: str
    status: OrderStatus
    detail: str | None = None
    created_at: str
    updated_at: str


_orders: dict[str, dict] = {}


async def process_order(order_id: str):
    _orders[order_id]["status"] = OrderStatus.PROCESSING
    _orders[order_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
    try:
        await asyncio.sleep(3)  # Simulate work
        _orders[order_id]["status"] = OrderStatus.COMPLETED
        _orders[order_id]["detail"] = "Order fulfilled successfully."
    except Exception as exc:
        _orders[order_id]["status"] = OrderStatus.FAILED
        _orders[order_id]["detail"] = str(exc)
    finally:
        _orders[order_id]["updated_at"] = datetime.now(timezone.utc).isoformat()


@app.post("/orders", response_model=OrderResponse, status_code=202)
async def create_order(order: OrderRequest):
    order_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    _orders[order_id] = {
        "order_id": order_id,
        "status": OrderStatus.PENDING,
        "detail": None,
        "payload": order.model_dump(),
        "created_at": now,
        "updated_at": now,
    }
    asyncio.create_task(process_order(order_id))
    return OrderResponse(order_id=order_id, status=OrderStatus.PENDING, created_at=now)


@app.get("/orders/{order_id}/status", response_model=OrderStatusResponse)
async def get_order_status(order_id: str):
    order = _orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return OrderStatusResponse(
        order_id=order["order_id"],
        status=order["status"],
        detail=order.get("detail"),
        created_at=order["created_at"],
        updated_at=order["updated_at"],
    )
```

For production, replace `asyncio.create_task` with a task queue (Celery, Dramatiq, or arq with Redis) and persist orders in a database.
