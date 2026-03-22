## Task 1

### CSV File Upload with Validation and Summary

```python
import csv
import io
import statistics
from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel

app = FastAPI()

REQUIRED_COLUMNS = {"name", "email", "age"}


class ColumnStats(BaseModel):
    column: str
    non_null_count: int
    unique_count: int
    min_value: float | None = None
    max_value: float | None = None
    mean_value: float | None = None


class CSVSummary(BaseModel):
    row_count: int
    columns: list[str]
    column_stats: list[ColumnStats]


@app.post("/upload-csv", response_model=CSVSummary)
async def upload_csv(file: UploadFile) -> CSVSummary:
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV.")

    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be UTF-8 encoded.")

    reader = csv.DictReader(io.StringIO(text))
    if reader.fieldnames is None:
        raise HTTPException(status_code=400, detail="CSV file is empty.")

    columns = set(reader.fieldnames)
    missing = REQUIRED_COLUMNS - columns
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required columns: {', '.join(sorted(missing))}",
        )

    rows = list(reader)
    if not rows:
        raise HTTPException(status_code=422, detail="CSV has no data rows.")

    stats: list[ColumnStats] = []
    for col in reader.fieldnames:
        values = [row[col] for row in rows if row.get(col)]
        stat = ColumnStats(
            column=col,
            non_null_count=len(values),
            unique_count=len(set(values)),
        )

        # Compute numeric stats for 'age'
        if col == "age":
            numeric = []
            for v in values:
                try:
                    numeric.append(float(v))
                except (ValueError, TypeError):
                    pass
            if numeric:
                stat.min_value = min(numeric)
                stat.max_value = max(numeric)
                stat.mean_value = round(statistics.mean(numeric), 2)

        stats.append(stat)

    return CSVSummary(
        row_count=len(rows),
        columns=list(reader.fieldnames),
        column_stats=stats,
    )
```

**How it works:**

1. The endpoint accepts a file upload via `UploadFile`.
2. It validates the file extension, encoding, and presence of required columns (`name`, `email`, `age`).
3. It parses all rows and computes per-column statistics: non-null count, unique count, and numeric stats (min, max, mean) for the `age` column.
4. Returns a structured `CSVSummary` response.

**Test with curl:**

```bash
curl -X POST http://localhost:8000/upload-csv \
  -F "file=@data.csv"
```

---

## Task 2

### Rate Limiting with Per-User and Per-IP Limits

```python
import time
from collections import defaultdict
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Request

app = FastAPI()


class RateLimitState:
    """Sliding window rate limiter using sorted request timestamps."""

    def __init__(self) -> None:
        self._requests: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, key: str, limit: int, window_seconds: int = 60) -> tuple[bool, int]:
        """Check if request is allowed. Returns (allowed, retry_after_seconds)."""
        now = time.monotonic()
        cutoff = now - window_seconds

        # Prune old entries
        timestamps = self._requests[key]
        self._requests[key] = [t for t in timestamps if t > cutoff]
        timestamps = self._requests[key]

        if len(timestamps) >= limit:
            oldest_in_window = timestamps[0]
            retry_after = int(oldest_in_window - cutoff) + 1
            return False, max(retry_after, 1)

        timestamps.append(now)
        return True, 0


rate_limiter = RateLimitState()


def get_current_user(request: Request) -> str | None:
    """Extract user from Authorization header. Returns None if unauthenticated."""
    auth = request.headers.get("authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:]
        # In production, decode and validate JWT here.
        # For demonstration, treat the token as the user ID.
        return token
    return None


async def rate_limit_dependency(
    request: Request,
    user: Annotated[str | None, Depends(get_current_user)],
) -> None:
    if user is not None:
        key = f"user:{user}"
        limit = 100
    else:
        forwarded = request.headers.get("x-forwarded-for")
        client_ip = (
            forwarded.split(",")[0].strip()
            if forwarded
            else (request.client.host if request.client else "unknown")
        )
        key = f"ip:{client_ip}"
        limit = 20

    allowed, retry_after = rate_limiter.is_allowed(key, limit, window_seconds=60)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded.",
            headers={"Retry-After": str(retry_after)},
        )


RateLimit = Annotated[None, Depends(rate_limit_dependency)]


@app.get("/resource")
async def get_resource(_: RateLimit) -> dict:
    return {"data": "Here is your resource."}
```

**Key design decisions:**

- **Sliding window** approach tracks individual request timestamps, giving smooth rate limiting without the burst problems of fixed windows.
- **Per-user vs per-IP** is determined by the presence of a valid `Authorization` header. Authenticated users get 100 req/min; anonymous clients get 20 req/min by IP.
- **`Retry-After` header** is included in the 429 response, telling the client how many seconds to wait.
- The `RateLimit` type alias makes it easy to apply rate limiting to any endpoint via `Depends`.

**For production**, replace the in-memory dict with Redis using a Lua script for atomicity, and use a proper JWT decoder in `get_current_user`. A Redis-based approach also works across multiple server instances.

---

## Task 3

### Fixing the N+1 Query Problem with SQLAlchemy Async

**The problem:** Loading 100 users and accessing `user.roles` for each triggers a lazy-load query per user (1 query for users + 100 queries for roles = 101 total).

**The fix:** Use `selectinload` to eagerly load the relationship in a single additional query.

```python
from sqlalchemy import Column, ForeignKey, Integer, String, Table, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, selectinload
from fastapi import Depends, FastAPI
from typing import Annotated

app = FastAPI()

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db", echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


# Many-to-many association table
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
)


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(100))
    roles: Mapped[list[Role]] = relationship(secondary=user_roles, lazy="raise")


async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session


DB = Annotated[AsyncSession, Depends(get_db)]


# BAD - N+1 queries (101 total)
# @app.get("/users-slow")
# async def get_users_slow(db: DB):
#     result = await db.execute(select(User))
#     users = result.scalars().all()          # 1 query
#     return [
#         {
#             "id": u.id,
#             "username": u.username,
#             "roles": [r.name for r in u.roles],  # 1 query PER USER
#         }
#         for u in users
#     ]


# GOOD - 2 queries total
@app.get("/users")
async def get_users(db: DB):
    stmt = (
        select(User)
        .options(selectinload(User.roles))  # Eager load roles in one SELECT ... WHERE user_id IN (...)
        .limit(100)
    )
    result = await db.execute(stmt)
    users = result.scalars().all()

    return [
        {
            "id": u.id,
            "username": u.username,
            "roles": [r.name for r in u.roles],
        }
        for u in users
    ]
```

**Why `selectinload` over `joinedload` for many-to-many:**

| Strategy | Queries | Best For |
|---|---|---|
| `selectinload` | 2 (one `SELECT users`, one `SELECT roles WHERE user_id IN (...)`) | Many-to-many and one-to-many. No row duplication. |
| `joinedload` | 1 (single JOIN) | Many-to-one or small collections. Causes row duplication with many-to-many. |
| `subqueryload` | 2 (subquery-based) | Similar to `selectinload` but uses a correlated subquery. |

For a many-to-many relationship like users-roles, `selectinload` is the best default because it avoids the Cartesian product that `joinedload` creates (if a user has 3 roles, the JOIN returns 3 rows for that user).

**Additional tip:** Set `lazy="raise"` on the relationship (as shown above) to make accidental lazy loading raise an error immediately instead of silently issuing N+1 queries. This turns a performance bug into a loud error during development.

---

## Task 4

### WebSocket Chat Room

```python
import asyncio
from dataclasses import dataclass, field
from datetime import datetime, timezone
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()


@dataclass
class ConnectionManager:
    """Manages WebSocket connections per room."""

    _rooms: dict[str, dict[str, WebSocket]] = field(default_factory=dict)

    async def connect(self, room_id: str, username: str, ws: WebSocket) -> None:
        await ws.accept()
        if room_id not in self._rooms:
            self._rooms[room_id] = {}
        self._rooms[room_id][username] = ws
        await self.broadcast(
            room_id,
            {
                "type": "system",
                "message": f"{username} joined the room.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

    def disconnect(self, room_id: str, username: str) -> None:
        if room_id in self._rooms:
            self._rooms[room_id].pop(username, None)
            if not self._rooms[room_id]:
                del self._rooms[room_id]

    async def broadcast(
        self,
        room_id: str,
        message: dict,
        exclude: str | None = None,
    ) -> None:
        """Send message to all connections in a room, optionally excluding one user."""
        room = self._rooms.get(room_id, {})
        tasks = []
        for uname, ws in room.items():
            if uname != exclude:
                tasks.append(ws.send_json(message))
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)


manager = ConnectionManager()


@app.websocket("/ws/chat/{room_id}")
async def chat_websocket(ws: WebSocket, room_id: str, username: str):
    """
    Connect to a chat room.

    Query param: ?username=alice
    Messages sent as JSON: {"message": "Hello everyone!"}
    """
    await manager.connect(room_id, username, ws)
    try:
        while True:
            data = await ws.receive_json()
            payload = {
                "type": "message",
                "username": username,
                "message": data.get("message", ""),
                "room": room_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            await manager.broadcast(room_id, payload)
    except WebSocketDisconnect:
        manager.disconnect(room_id, username)
        await manager.broadcast(
            room_id,
            {
                "type": "system",
                "message": f"{username} left the room.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )
```

**Usage from JavaScript:**

```javascript
const ws = new WebSocket("ws://localhost:8000/ws/chat/room1?username=alice");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "system") {
        console.log(`[System] ${data.message}`);
    } else {
        console.log(`[${data.username}] ${data.message}`);
    }
};

ws.send(JSON.stringify({ message: "Hello everyone!" }));
```

**Design notes:**

- Each room is an independent namespace. Users connect to `/ws/chat/{room_id}?username=alice`.
- The `ConnectionManager` tracks connections per room and handles broadcast.
- System messages notify when users join or leave.
- `asyncio.gather` with `return_exceptions=True` ensures one broken connection does not prevent delivery to others.
- For production, add authentication (validate tokens before `ws.accept()`), message persistence, and use Redis Pub/Sub for multi-instance broadcasting.

---

## Task 5

### Background Order Processing with Status Polling

```python
import asyncio
import uuid
from datetime import datetime, timezone
from enum import Enum

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class OrderStatus(str, Enum):
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
    created_at: str
    updated_at: str
    detail: str | None = None


# In production, use Redis or a database instead of in-memory dict.
orders: dict[str, dict] = {}


async def process_order(order_id: str) -> None:
    """Simulate async order processing (payment, inventory, shipping)."""
    orders[order_id]["status"] = OrderStatus.PROCESSING
    orders[order_id]["updated_at"] = datetime.now(timezone.utc).isoformat()

    try:
        # Step 1: Validate inventory
        await asyncio.sleep(1)

        # Step 2: Process payment
        await asyncio.sleep(1)

        # Step 3: Send confirmation
        await asyncio.sleep(0.5)

        orders[order_id]["status"] = OrderStatus.COMPLETED
        orders[order_id]["detail"] = "Order processed and confirmation sent."
    except Exception as exc:
        orders[order_id]["status"] = OrderStatus.FAILED
        orders[order_id]["detail"] = str(exc)
    finally:
        orders[order_id]["updated_at"] = datetime.now(timezone.utc).isoformat()


@app.post("/orders", status_code=202, response_model=OrderResponse)
async def create_order(order: OrderRequest) -> OrderResponse:
    order_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    orders[order_id] = {
        "order_id": order_id,
        "status": OrderStatus.PENDING,
        "product_id": order.product_id,
        "quantity": order.quantity,
        "customer_email": order.customer_email,
        "created_at": now,
        "updated_at": now,
        "detail": None,
    }

    # Fire and forget -- the order processes in the background
    asyncio.create_task(process_order(order_id))

    return OrderResponse(
        order_id=order_id,
        status=OrderStatus.PENDING,
        created_at=now,
    )


@app.get("/orders/{order_id}/status", response_model=OrderStatusResponse)
async def get_order_status(order_id: str) -> OrderStatusResponse:
    order = orders.get(order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found.")

    return OrderStatusResponse(
        order_id=order["order_id"],
        status=order["status"],
        created_at=order["created_at"],
        updated_at=order["updated_at"],
        detail=order["detail"],
    )
```

**Why `asyncio.create_task` instead of FastAPI's `BackgroundTasks`:**

FastAPI's `BackgroundTasks` runs tasks *after* the response is sent but still within the request lifecycle. For truly independent background processing, `asyncio.create_task` is more appropriate because:

1. It starts immediately (not tied to response completion).
2. It runs fully independently of the request.
3. It works naturally with async code.

For production workloads, replace `asyncio.create_task` with a proper task queue (Celery, Dramatiq, arq, or Taskiq) backed by Redis or RabbitMQ. This gives you persistence (tasks survive server restarts), retries, dead letter queues, and distributed processing across multiple workers.

**Client workflow:**

```bash
# Submit order -- returns 202 immediately
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{"product_id": "PROD-1", "quantity": 2, "customer_email": "alice@example.com"}'

# Response:
# {"order_id": "abc-123", "status": "pending", "created_at": "..."}

# Poll for status
curl http://localhost:8000/orders/abc-123/status

# Response (while processing):
# {"order_id": "abc-123", "status": "processing", ...}

# Response (when done):
# {"order_id": "abc-123", "status": "completed", "detail": "Order processed and confirmation sent.", ...}
```

For a better user experience, consider adding a WebSocket or SSE endpoint that pushes status updates instead of requiring polling.
