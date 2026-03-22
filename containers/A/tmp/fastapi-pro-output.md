## Task 1

CSV File Upload with Validation and Summary Statistics

```python
import io
import csv
from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel

app = FastAPI()

REQUIRED_COLUMNS = {"name", "email", "age"}


class ColumnStats(BaseModel):
    column: str
    non_empty_count: int
    empty_count: int
    sample_values: list[str]


class AgeStats(BaseModel):
    min: float
    max: float
    mean: float


class CSVSummary(BaseModel):
    row_count: int
    columns: list[str]
    column_stats: list[ColumnStats]
    age_stats: AgeStats | None = None


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
        raise HTTPException(status_code=400, detail="CSV has no header row.")

    columns = [c.strip().lower() for c in reader.fieldnames]
    missing = REQUIRED_COLUMNS - set(columns)
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required columns: {', '.join(sorted(missing))}",
        )

    rows: list[dict[str, str]] = []
    for row in reader:
        normalized = {k.strip().lower(): v.strip() for k, v in row.items()}
        rows.append(normalized)

    if not rows:
        raise HTTPException(status_code=422, detail="CSV contains no data rows.")

    # Build column stats
    column_stats: list[ColumnStats] = []
    for col in columns:
        values = [r.get(col, "") for r in rows]
        non_empty = [v for v in values if v]
        column_stats.append(
            ColumnStats(
                column=col,
                non_empty_count=len(non_empty),
                empty_count=len(values) - len(non_empty),
                sample_values=non_empty[:5],
            )
        )

    # Age stats
    age_stats = None
    age_values: list[float] = []
    for r in rows:
        try:
            age_values.append(float(r["age"]))
        except (ValueError, KeyError):
            continue

    if age_values:
        age_stats = AgeStats(
            min=min(age_values),
            max=max(age_values),
            mean=round(sum(age_values) / len(age_values), 2),
        )

    return CSVSummary(
        row_count=len(rows),
        columns=columns,
        column_stats=column_stats,
        age_stats=age_stats,
    )
```

**Test it:**

```python
import pytest
from httpx import AsyncClient, ASGITransport
from io import BytesIO

@pytest.mark.anyio
async def test_upload_valid_csv():
    from task1 import app

    csv_content = b"name,email,age\nAlice,alice@example.com,30\nBob,bob@test.com,25\n"
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(
            "/upload-csv",
            files={"file": ("data.csv", BytesIO(csv_content), "text/csv")},
        )
    assert resp.status_code == 200
    data = resp.json()
    assert data["row_count"] == 2
    assert data["age_stats"]["mean"] == 27.5

@pytest.mark.anyio
async def test_upload_missing_columns():
    from task1 import app

    csv_content = b"name,phone\nAlice,555\n"
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(
            "/upload-csv",
            files={"file": ("data.csv", BytesIO(csv_content), "text/csv")},
        )
    assert resp.status_code == 422
    assert "email" in resp.json()["detail"]
```

---

## Task 2

Rate Limiting with Per-User and Per-IP Limits

```python
import time
from collections import defaultdict
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()


class RateLimitStore:
    """Sliding window counter stored in memory. Replace with Redis for production."""

    def __init__(self):
        self._hits: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, key: str, limit: int, window: int = 60) -> tuple[bool, int]:
        now = time.time()
        cutoff = now - window
        # Prune expired entries
        self._hits[key] = [t for t in self._hits[key] if t > cutoff]
        if len(self._hits[key]) >= limit:
            oldest = self._hits[key][0]
            retry_after = int(oldest + window - now) + 1
            return False, retry_after
        self._hits[key].append(now)
        return True, 0


store = RateLimitStore()

# --- For production, use Redis-backed store ---
# import redis.asyncio as redis
#
# class RedisRateLimitStore:
#     def __init__(self, redis_url: str = "redis://localhost:6379"):
#         self.redis = redis.from_url(redis_url)
#
#     async def is_allowed(self, key: str, limit: int, window: int = 60):
#         pipe = self.redis.pipeline()
#         now = time.time()
#         pipe.zremrangebyscore(key, 0, now - window)
#         pipe.zadd(key, {str(now): now})
#         pipe.zcard(key)
#         pipe.expire(key, window)
#         results = await pipe.execute()
#         count = results[2]
#         if count > limit:
#             earliest = await self.redis.zrange(key, 0, 0, withscores=True)
#             retry_after = int(earliest[0][1] + window - now) + 1
#             return False, max(retry_after, 1)
#         return True, 0


def get_client_key(request: Request) -> tuple[str, int]:
    """Return (rate_limit_key, max_requests_per_minute)."""
    # Check for authenticated user (e.g., from a JWT middleware or API key)
    user = getattr(request.state, "user_id", None)
    if user:
        return f"user:{user}", 100
    # Fall back to IP-based limiting
    client_ip = request.client.host if request.client else "unknown"
    return f"ip:{client_ip}", 20


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        key, limit = get_client_key(request)
        allowed, retry_after = store.is_allowed(key, limit)
        if not allowed:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Slow down."},
                headers={"Retry-After": str(retry_after)},
            )
        response = await call_next(request)
        return response


app.add_middleware(RateLimitMiddleware)


# --- Simulated auth dependency (for demonstration) ---
async def optional_auth(request: Request):
    token = request.headers.get("Authorization")
    if token and token.startswith("Bearer "):
        # In production, decode JWT here
        request.state.user_id = token.split(" ")[1]
    return request


@app.get("/resource")
async def get_resource(request: Request = Depends(optional_auth)):
    return {"message": "Here is your resource."}
```

**Alternative: dependency-based rate limiting per route (more granular):**

```python
from functools import wraps

def rate_limit(limit: int = 20, window: int = 60):
    """Dependency factory for per-route rate limiting."""
    async def dependency(request: Request):
        key, _ = get_client_key(request)
        # Override limit with the route-specific value
        allowed, retry_after = store.is_allowed(f"route:{request.url.path}:{key}", limit, window)
        if not allowed:
            raise HTTPException(
                status_code=429,
                detail="Too many requests.",
                headers={"Retry-After": str(retry_after)},
            )
    return Depends(dependency)


@app.get("/expensive", dependencies=[rate_limit(limit=5, window=60)])
async def expensive_operation():
    return {"result": "computed"}
```

---

## Task 3

Fixing the N+1 Query Problem with SQLAlchemy Async

**The problem:** Loading 100 users and then lazily accessing `user.roles` for each one generates 1 query for users + 100 queries for roles = 101 total.

**Broken code (N+1):**

```python
# models.py
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

class Base(DeclarativeBase):
    pass

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
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(200))
    # This causes N+1 when accessed in async context
    roles: Mapped[list[Role]] = relationship(secondary=user_roles, lazy="select")


# BAD endpoint -- 101 queries
@app.get("/users")
async def get_users_bad():
    async with async_session() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        # Each access to user.roles fires a lazy load = N extra queries
        return [
            {"name": u.name, "roles": [r.name for r in u.roles]}  # BOOM: N+1
            for u in users
        ]
```

**Fix 1 -- `selectinload` (recommended for most cases):**

```python
from sqlalchemy.orm import selectinload
from sqlalchemy import select

# 2 queries total: one for users, one for all related roles
@app.get("/users")
async def get_users():
    async with async_session() as session:
        stmt = select(User).options(selectinload(User.roles)).limit(100)
        result = await session.execute(stmt)
        users = result.scalars().all()
        return [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "roles": [{"id": r.id, "name": r.name} for r in u.roles],
            }
            for u in users
        ]
```

`selectinload` emits a second query using `SELECT ... WHERE role_id IN (...)` with all user IDs. Total: 2 queries regardless of user count.

**Fix 2 -- `joinedload` (single query with JOIN):**

```python
from sqlalchemy.orm import joinedload

# 1 query with JOIN -- but returns duplicate user rows that SQLAlchemy deduplicates
@app.get("/users-joined")
async def get_users_joined():
    async with async_session() as session:
        stmt = (
            select(User)
            .options(joinedload(User.roles))
            .limit(100)
            .execution_options(populate_existing=True)
        )
        result = await session.execute(stmt)
        users = result.unique().scalars().all()  # .unique() is required with joinedload
        return [
            {"name": u.name, "roles": [r.name for r in u.roles]}
            for u in users
        ]
```

**Fix 3 -- `subqueryload` (separate subquery):**

```python
from sqlalchemy.orm import subqueryload

stmt = select(User).options(subqueryload(User.roles)).limit(100)
```

**Which to use:**

| Strategy | Queries | Best for |
|----------|---------|----------|
| `selectinload` | 2 | Many-to-many, large result sets (default choice) |
| `joinedload` | 1 | One-to-one, one-to-many with small cardinality |
| `subqueryload` | 2 | Complex filters on the parent query |

**Bonus: prevent lazy loading accidents in async code entirely:**

```python
# In your model, set lazy="raise" to make accidental lazy loads an error
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(200))
    roles: Mapped[list[Role]] = relationship(
        secondary=user_roles,
        lazy="raise",  # Raises an error if accessed without eager loading
    )
```

This forces every query to explicitly declare its loading strategy, making N+1 bugs impossible to introduce silently.

**Full working setup:**

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost:5432/mydb"

engine = create_async_engine(DATABASE_URL, echo=True, pool_size=20, max_overflow=10)
async_session = async_sessionmaker(engine, expire_on_commit=False)

app = FastAPI(lifespan=lifespan)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables (dev only)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: dispose engine
    await engine.dispose()
```

---

## Task 4

WebSocket Chat Room

```python
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from datetime import datetime, timezone

app = FastAPI()


class ChatMessage(BaseModel):
    room: str
    sender: str
    content: str
    timestamp: str


class ConnectionManager:
    """Manages WebSocket connections grouped by room."""

    def __init__(self):
        self._rooms: dict[str, dict[str, WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def join(self, room: str, username: str, ws: WebSocket):
        await ws.accept()
        async with self._lock:
            if room not in self._rooms:
                self._rooms[room] = {}
            self._rooms[room][username] = ws
        await self.broadcast(
            room,
            ChatMessage(
                room=room,
                sender="system",
                content=f"{username} joined the room.",
                timestamp=datetime.now(timezone.utc).isoformat(),
            ),
            exclude=None,
        )

    async def leave(self, room: str, username: str):
        async with self._lock:
            if room in self._rooms:
                self._rooms[room].pop(username, None)
                if not self._rooms[room]:
                    del self._rooms[room]
        await self.broadcast(
            room,
            ChatMessage(
                room=room,
                sender="system",
                content=f"{username} left the room.",
                timestamp=datetime.now(timezone.utc).isoformat(),
            ),
            exclude=None,
        )

    async def broadcast(
        self, room: str, message: ChatMessage, exclude: str | None = None
    ):
        async with self._lock:
            connections = dict(self._rooms.get(room, {}))

        payload = message.model_dump_json()
        stale: list[str] = []
        for user, ws in connections.items():
            if user == exclude:
                continue
            try:
                await ws.send_text(payload)
            except Exception:
                stale.append(user)

        # Clean up broken connections
        if stale:
            async with self._lock:
                for user in stale:
                    self._rooms.get(room, {}).pop(user, None)


manager = ConnectionManager()


@app.websocket("/ws/chat/{room}/{username}")
async def websocket_chat(websocket: WebSocket, room: str, username: str):
    await manager.join(room, username, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = ChatMessage(
                room=room,
                sender=username,
                content=data,
                timestamp=datetime.now(timezone.utc).isoformat(),
            )
            # Broadcast to everyone in the room including sender
            await manager.broadcast(room, msg)
    except WebSocketDisconnect:
        await manager.leave(room, username)


# REST endpoint to see active rooms and user counts
@app.get("/rooms")
async def list_rooms():
    return {
        room: list(users.keys())
        for room, users in manager._rooms.items()
    }
```

**Client usage (JavaScript):**

```javascript
const ws = new WebSocket("ws://localhost:8000/ws/chat/general/alice");

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    console.log(`[${msg.sender}] ${msg.content}`);
};

ws.onopen = () => {
    ws.send("Hello everyone!");
};
```

**Test with pytest:**

```python
import pytest
from httpx import ASGITransport, AsyncClient
from starlette.testclient import TestClient

def test_websocket_chat():
    from task4 import app

    client = TestClient(app)

    with client.websocket_connect("/ws/chat/testroom/alice") as ws_alice:
        # Alice gets her own join message
        join_msg = ws_alice.receive_json()
        assert join_msg["sender"] == "system"
        assert "alice joined" in join_msg["content"]

        with client.websocket_connect("/ws/chat/testroom/bob") as ws_bob:
            # Both see Bob's join
            bob_join_alice = ws_alice.receive_json()
            assert "bob joined" in bob_join_alice["content"]

            bob_join_bob = ws_bob.receive_json()
            assert "bob joined" in bob_join_bob["content"]

            # Alice sends a message
            ws_alice.send_text("Hi Bob!")

            # Both receive it
            msg_alice = ws_alice.receive_json()
            assert msg_alice["content"] == "Hi Bob!"
            assert msg_alice["sender"] == "alice"

            msg_bob = ws_bob.receive_json()
            assert msg_bob["content"] == "Hi Bob!"
```

---

## Task 5

Background Order Processing with Status Polling

```python
import asyncio
import uuid
from enum import Enum
from datetime import datetime, timezone
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class OrderItem(BaseModel):
    product_id: str
    quantity: int = Field(gt=0)
    price: float = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: str
    items: list[OrderItem] = Field(min_length=1)


class Order(BaseModel):
    id: str
    customer_id: str
    items: list[OrderItem]
    status: OrderStatus
    total: float
    created_at: str
    updated_at: str
    error: str | None = None


# In-memory store (use Redis or a database in production)
orders: dict[str, Order] = {}


async def process_order(order_id: str):
    """Simulate async order processing with multiple steps."""
    order = orders.get(order_id)
    if not order:
        return

    try:
        order.status = OrderStatus.PROCESSING
        order.updated_at = datetime.now(timezone.utc).isoformat()

        # Step 1: Validate inventory
        await asyncio.sleep(1)  # Simulate inventory check

        # Step 2: Charge payment
        await asyncio.sleep(1)  # Simulate payment processing

        # Step 3: Create shipment
        await asyncio.sleep(1)  # Simulate shipment creation

        order.status = OrderStatus.COMPLETED
        order.updated_at = datetime.now(timezone.utc).isoformat()

    except Exception as e:
        order.status = OrderStatus.FAILED
        order.error = str(e)
        order.updated_at = datetime.now(timezone.utc).isoformat()


app = FastAPI()


@app.post("/orders", status_code=202, response_model=Order)
async def create_order(payload: OrderCreate, background_tasks: BackgroundTasks):
    order_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    total = sum(item.price * item.quantity for item in payload.items)

    order = Order(
        id=order_id,
        customer_id=payload.customer_id,
        items=payload.items,
        status=OrderStatus.PENDING,
        total=round(total, 2),
        created_at=now,
        updated_at=now,
    )
    orders[order_id] = order

    # Enqueue background processing
    background_tasks.add_task(process_order, order_id)

    return order


@app.get("/orders/{order_id}/status")
async def get_order_status(order_id: str):
    order = orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return {
        "order_id": order.id,
        "status": order.status,
        "updated_at": order.updated_at,
        "error": order.error,
    }


@app.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order
```

**For production, use a task queue (Celery with Redis) instead of BackgroundTasks:**

```python
# tasks.py -- Celery worker
from celery import Celery

celery_app = Celery("orders", broker="redis://localhost:6379/0")

@celery_app.task(bind=True, max_retries=3)
def process_order_task(self, order_id: str):
    """Production-grade order processing with retries."""
    try:
        # Update status to PROCESSING in DB
        # Validate inventory, charge payment, create shipment
        # Update status to COMPLETED
        pass
    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)


# In the endpoint, replace background_tasks with:
# process_order_task.delay(order_id)
```

**Test:**

```python
import pytest
from httpx import AsyncClient, ASGITransport
import asyncio

@pytest.mark.anyio
async def test_order_lifecycle():
    from task5 import app, orders

    orders.clear()
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Submit order
        resp = await client.post("/orders", json={
            "customer_id": "cust-1",
            "items": [{"product_id": "p1", "quantity": 2, "price": 9.99}],
        })
        assert resp.status_code == 202
        order_id = resp.json()["id"]
        assert resp.json()["status"] == "pending"

        # Wait for background processing
        await asyncio.sleep(4)

        # Check status
        resp = await client.get(f"/orders/{order_id}/status")
        assert resp.status_code == 200
        assert resp.json()["status"] == "completed"

        # Get full order
        resp = await client.get(f"/orders/{order_id}")
        assert resp.status_code == 200
        assert resp.json()["total"] == 19.98
```
