## Task 1: CSV File Upload with Validation and Summary

### Pydantic Models

```python
from pydantic import BaseModel


class ColumnStats(BaseModel):
    column: str
    non_null_count: int
    unique_count: int
    sample_values: list[str]


class AgeStats(BaseModel):
    min: float
    max: float
    mean: float
    median: float


class CSVSummary(BaseModel):
    row_count: int
    column_count: int
    columns: list[str]
    column_stats: list[ColumnStats]
    age_stats: AgeStats
```

### Endpoint Implementation

```python
import io
import csv
import statistics
from typing import Annotated

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

app = FastAPI()

REQUIRED_COLUMNS = {"name", "email", "age"}


@app.post("/upload/csv", response_model=CSVSummary, status_code=200)
async def upload_csv(
    file: Annotated[UploadFile, File(description="CSV file with name, email, age columns")],
) -> CSVSummary:
    # Validate content type
    if file.content_type not in ("text/csv", "application/vnd.ms-excel", "application/octet-stream"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Expected CSV.",
        )

    # Read file contents
    contents = await file.read()
    try:
        decoded = contents.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File is not valid UTF-8 text.")

    # Parse CSV
    reader = csv.DictReader(io.StringIO(decoded))
    if reader.fieldnames is None:
        raise HTTPException(status_code=400, detail="CSV file appears to be empty.")

    # Normalize headers (strip whitespace, lowercase)
    headers = [h.strip().lower() for h in reader.fieldnames]

    # Validate required columns exist
    missing = REQUIRED_COLUMNS - set(headers)
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required columns: {', '.join(sorted(missing))}. "
                   f"Found columns: {', '.join(headers)}",
        )

    # Collect rows and validate
    rows: list[dict[str, str]] = []
    ages: list[float] = []
    errors: list[str] = []

    for i, row in enumerate(reader, start=2):  # start=2 because row 1 is the header
        # Normalize keys
        normalized = {k.strip().lower(): v.strip() if v else "" for k, v in row.items()}
        rows.append(normalized)

        # Validate age is numeric
        age_val = normalized.get("age", "")
        if age_val:
            try:
                ages.append(float(age_val))
            except ValueError:
                errors.append(f"Row {i}: invalid age value '{age_val}'")

    if not rows:
        raise HTTPException(status_code=422, detail="CSV file contains headers but no data rows.")

    if errors and len(errors) > 10:
        raise HTTPException(
            status_code=422,
            detail=f"Too many validation errors ({len(errors)}). First 5: {errors[:5]}",
        )

    # Build column stats
    column_stats = []
    for col in headers:
        values = [r.get(col, "") for r in rows]
        non_null = [v for v in values if v]
        column_stats.append(
            ColumnStats(
                column=col,
                non_null_count=len(non_null),
                unique_count=len(set(non_null)),
                sample_values=list(set(non_null))[:5],
            )
        )

    # Build age stats
    if ages:
        sorted_ages = sorted(ages)
        age_stats = AgeStats(
            min=sorted_ages[0],
            max=sorted_ages[-1],
            mean=round(statistics.mean(sorted_ages), 2),
            median=round(statistics.median(sorted_ages), 2),
        )
    else:
        age_stats = AgeStats(min=0, max=0, mean=0, median=0)

    return CSVSummary(
        row_count=len(rows),
        column_count=len(headers),
        columns=headers,
        column_stats=column_stats,
        age_stats=age_stats,
    )
```

### Test

```python
import io
import pytest
from httpx import ASGITransport, AsyncClient

@pytest.mark.asyncio
async def test_upload_valid_csv():
    csv_content = "name,email,age\nAlice,alice@test.com,30\nBob,bob@test.com,25\n"
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.post(
            "/upload/csv",
            files={"file": ("data.csv", io.BytesIO(csv_content.encode()), "text/csv")},
        )
    assert resp.status_code == 200
    body = resp.json()
    assert body["row_count"] == 2
    assert body["age_stats"]["min"] == 25
    assert body["age_stats"]["max"] == 30


@pytest.mark.asyncio
async def test_upload_missing_columns():
    csv_content = "name,phone\nAlice,555-1234\n"
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.post(
            "/upload/csv",
            files={"file": ("data.csv", io.BytesIO(csv_content.encode()), "text/csv")},
        )
    assert resp.status_code == 422
    assert "Missing required columns" in resp.json()["detail"]
```

---

## Task 2: Rate Limiting with Per-User and Per-IP Buckets

### Approach

Use an in-memory sliding-window counter backed by Redis in production. The implementation below uses a custom dependency so that rate limit headers are always returned.

### Implementation

```python
import time
import asyncio
from collections import defaultdict
from typing import Annotated

from fastapi import FastAPI, Depends, HTTPException, Request, Response
from pydantic import BaseModel


class RateLimitBucket:
    """Sliding window rate limiter (in-memory). Replace with Redis for production."""

    def __init__(self):
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._lock = asyncio.Lock()

    async def is_allowed(self, key: str, limit: int, window_seconds: int) -> tuple[bool, int, int]:
        """Returns (allowed, remaining, retry_after_seconds)."""
        now = time.time()
        cutoff = now - window_seconds

        async with self._lock:
            # Prune expired entries
            self._requests[key] = [t for t in self._requests[key] if t > cutoff]
            current_count = len(self._requests[key])

            if current_count >= limit:
                oldest = self._requests[key][0]
                retry_after = int(oldest + window_seconds - now) + 1
                return False, 0, retry_after

            self._requests[key].append(now)
            remaining = limit - current_count - 1
            return True, remaining, 0


bucket = RateLimitBucket()


# --- Fake auth dependency for demonstration ---

async def get_current_user_optional(request: Request) -> str | None:
    """Extract user ID from Authorization header if present."""
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth.removeprefix("Bearer ")
        # In production: decode JWT, look up user
        return f"user:{token}"
    return None


# --- Rate limit dependency ---

async def rate_limit(
    request: Request,
    response: Response,
    user_id: Annotated[str | None, Depends(get_current_user_optional)],
) -> None:
    if user_id:
        key = user_id
        limit = 100
    else:
        forwarded = request.headers.get("X-Forwarded-For")
        client_ip = forwarded.split(",")[0].strip() if forwarded else (
            request.client.host if request.client else "unknown"
        )
        key = f"ip:{client_ip}"
        limit = 20

    window = 60  # seconds

    allowed, remaining, retry_after = await bucket.is_allowed(key, limit, window)

    # Always attach rate-limit headers
    response.headers["X-RateLimit-Limit"] = str(limit)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Window"] = "60"

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please slow down.",
            headers={
                "Retry-After": str(retry_after),
                "X-RateLimit-Limit": str(limit),
                "X-RateLimit-Remaining": "0",
            },
        )


# --- Apply as a router-level dependency ---

app = FastAPI(dependencies=[Depends(rate_limit)])


@app.get("/resource")
async def get_resource():
    return {"data": "ok"}
```

### Production-Grade Redis Version

For multi-process / multi-node deployments, replace the in-memory bucket with Redis using a Lua script for atomicity:

```python
import redis.asyncio as redis

redis_client: redis.Redis | None = None

RATE_LIMIT_LUA = """
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local cutoff = now - window

redis.call('ZREMRANGEBYSCORE', key, '-inf', cutoff)
local count = redis.call('ZCARD', key)

if count >= limit then
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local retry_after = tonumber(oldest[2]) + window - now
    return {0, 0, math.ceil(retry_after)}
end

redis.call('ZADD', key, now, tostring(now) .. ':' .. tostring(math.random(1, 1000000)))
redis.call('EXPIRE', key, window + 1)
return {1, limit - count - 1, 0}
"""


async def check_rate_limit_redis(key: str, limit: int, window: int) -> tuple[bool, int, int]:
    import time
    now = time.time()
    result = await redis_client.eval(RATE_LIMIT_LUA, 1, key, limit, window, now)
    allowed, remaining, retry_after = result
    return bool(allowed), int(remaining), int(retry_after)
```

### Test

```python
import pytest
from httpx import ASGITransport, AsyncClient

@pytest.mark.asyncio
async def test_rate_limit_unauthenticated():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        for i in range(20):
            resp = await client.get("/resource")
            assert resp.status_code == 200
            assert "X-RateLimit-Remaining" in resp.headers

        # 21st request should be rejected
        resp = await client.get("/resource")
        assert resp.status_code == 429
        assert "Retry-After" in resp.headers
        assert int(resp.headers["Retry-After"]) > 0


@pytest.mark.asyncio
async def test_rate_limit_authenticated_higher():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        headers = {"Authorization": "Bearer testuser123"}
        for i in range(100):
            resp = await client.get("/resource", headers=headers)
            assert resp.status_code == 200

        resp = await client.get("/resource", headers=headers)
        assert resp.status_code == 429
```

---

## Task 3: Fixing the N+1 Query Problem with SQLAlchemy Async

### The Problem

```python
# BAD: N+1 queries -- 1 query for users + 100 queries for roles
@app.get("/users")
async def get_users(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User))
    users = result.scalars().all()
    # Accessing user.roles triggers a lazy load for EACH user
    return [
        {"id": u.id, "name": u.name, "roles": [r.name for r in u.roles]}
        for u in users
    ]
```

With default `lazy="select"` on the relationship, accessing `user.roles` inside the list comprehension fires one additional SELECT per user. That is 1 + 100 = 101 queries total.

### Models (for reference)

```python
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column

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
    roles: Mapped[list[Role]] = relationship(secondary=user_roles)
```

### Fix 1: Eager Loading with `selectinload` (Recommended)

This reduces the query count from 101 to exactly **2 queries**: one for users, one for all their roles via an `IN` clause.

```python
from sqlalchemy.orm import selectinload
from sqlalchemy import select

@app.get("/users")
async def get_users(session: AsyncSession = Depends(get_session)):
    stmt = (
        select(User)
        .options(selectinload(User.roles))
        .limit(100)
    )
    result = await session.execute(stmt)
    users = result.scalars().all()
    return [
        {"id": u.id, "name": u.name, "roles": [r.name for r in u.roles]}
        for u in users
    ]
```

**How it works:** SQLAlchemy issues `SELECT * FROM users LIMIT 100`, collects all user IDs, then issues `SELECT * FROM roles JOIN user_roles ON ... WHERE user_roles.user_id IN (1,2,3,...,100)`. Two queries total regardless of user count.

### Fix 2: `joinedload` (Single Query with JOIN)

Fetches everything in one query using a LEFT OUTER JOIN. Better for small result sets; worse when the join produces large Cartesian products (e.g., many roles per user).

```python
from sqlalchemy.orm import joinedload

@app.get("/users")
async def get_users(session: AsyncSession = Depends(get_session)):
    stmt = (
        select(User)
        .options(joinedload(User.roles))
        .limit(100)
    )
    result = await session.execute(stmt)
    users = result.unique().scalars().all()  # .unique() is required with joinedload
    return [
        {"id": u.id, "name": u.name, "roles": [r.name for r in u.roles]}
        for u in users
    ]
```

**Important:** You must call `.unique()` when using `joinedload` because the JOIN duplicates user rows (one per role).

### Fix 3: Set Eager Loading at the Model Level

If you always need roles when loading users, set it on the relationship definition:

```python
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(200))
    roles: Mapped[list[Role]] = relationship(
        secondary=user_roles,
        lazy="selectin",  # Always use SELECT IN loading
    )
```

### Comparison Table

| Strategy | Queries | Pros | Cons |
|---|---|---|---|
| Default (lazy) | N+1 (101) | Simple model definition | Terrible at scale; fails with async |
| `selectinload` | 2 | Predictable; works with async; no row duplication | Extra round-trip vs joined |
| `joinedload` | 1 | Single query | Cartesian product; requires `.unique()`; tricky with LIMIT |
| `subqueryload` | 2 | Good for nested structures | Not supported in async mode |

### Recommendation

Use **`selectinload`** as the default strategy for async SQLAlchemy. It is the safest and most predictable option:
- Works correctly with `LIMIT` and `OFFSET` (unlike `joinedload`)
- No row duplication
- Fully supported in async mode
- Predictable performance (always 2 queries)

---

## Task 4: WebSocket Chat Room

### Implementation

```python
import asyncio
import time
from typing import Annotated

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel

app = FastAPI()


class ChatMessage(BaseModel):
    room: str
    sender: str
    content: str
    timestamp: float


class ConnectionManager:
    """Manages WebSocket connections grouped by room."""

    def __init__(self):
        # room_id -> {username: websocket}
        self._rooms: dict[str, dict[str, WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def connect(self, room: str, username: str, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            if room not in self._rooms:
                self._rooms[room] = {}

            # Disconnect existing connection for the same user in the same room
            if username in self._rooms[room]:
                old_ws = self._rooms[room][username]
                try:
                    await old_ws.close(code=1008, reason="Duplicate connection")
                except Exception:
                    pass

            self._rooms[room][username] = websocket

        # Notify room that user joined
        await self.broadcast(
            room,
            ChatMessage(
                room=room,
                sender="system",
                content=f"{username} joined the room.",
                timestamp=time.time(),
            ),
            exclude=username,
        )

        # Send current user list to the newly joined user
        async with self._lock:
            members = list(self._rooms.get(room, {}).keys())
        await websocket.send_json({"type": "members", "members": members})

    async def disconnect(self, room: str, username: str) -> None:
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
                timestamp=time.time(),
            ),
        )

    async def broadcast(
        self, room: str, message: ChatMessage, exclude: str | None = None
    ) -> None:
        async with self._lock:
            connections = dict(self._rooms.get(room, {}))

        payload = {
            "type": "message",
            "room": message.room,
            "sender": message.sender,
            "content": message.content,
            "timestamp": message.timestamp,
        }

        dead_connections: list[str] = []
        for username, ws in connections.items():
            if username == exclude:
                continue
            try:
                await ws.send_json(payload)
            except Exception:
                dead_connections.append(username)

        # Clean up dead connections
        if dead_connections:
            async with self._lock:
                for uname in dead_connections:
                    if room in self._rooms:
                        self._rooms[room].pop(uname, None)

    async def get_rooms(self) -> dict[str, int]:
        async with self._lock:
            return {room: len(members) for room, members in self._rooms.items()}


manager = ConnectionManager()


@app.websocket("/ws/chat/{room}")
async def websocket_chat(
    websocket: WebSocket,
    room: str,
    username: Annotated[str, Query(min_length=1, max_length=50)],
):
    """
    WebSocket chat endpoint.

    Connect: ws://host/ws/chat/{room}?username=alice

    Send JSON messages:
        {"content": "Hello everyone!"}

    Receive JSON messages:
        {"type": "message", "room": "general", "sender": "bob", "content": "Hi!", "timestamp": 1234567890.0}
        {"type": "members", "members": ["alice", "bob"]}
    """
    await manager.connect(room, username, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            content = data.get("content", "").strip()
            if not content:
                continue

            # Enforce max message length
            if len(content) > 2000:
                await websocket.send_json({
                    "type": "error",
                    "detail": "Message too long (max 2000 characters).",
                })
                continue

            msg = ChatMessage(
                room=room,
                sender=username,
                content=content,
                timestamp=time.time(),
            )
            await manager.broadcast(room, msg)
    except WebSocketDisconnect:
        await manager.disconnect(room, username)


@app.get("/rooms")
async def list_rooms():
    """List active rooms and their member counts."""
    return await manager.get_rooms()
```

### Client Usage Example

```javascript
const ws = new WebSocket("ws://localhost:8000/ws/chat/general?username=alice");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "members") {
        console.log("Current members:", data.members);
    } else if (data.type === "message") {
        console.log(`[${data.sender}]: ${data.content}`);
    }
};

ws.onopen = () => {
    ws.send(JSON.stringify({ content: "Hello everyone!" }));
};
```

### Test

```python
import pytest
from starlette.testclient import TestClient

def test_websocket_chat():
    client = TestClient(app)

    with client.websocket_connect("/ws/chat/testroom?username=alice") as ws_alice:
        # Alice should receive member list
        data = ws_alice.receive_json()
        assert data["type"] == "members"
        assert "alice" in data["members"]

        with client.websocket_connect("/ws/chat/testroom?username=bob") as ws_bob:
            # Bob gets member list
            bob_data = ws_bob.receive_json()
            assert bob_data["type"] == "members"

            # Alice should receive "bob joined"
            join_msg = ws_alice.receive_json()
            assert join_msg["type"] == "message"
            assert "bob joined" in join_msg["content"]

            # Bob sends a message
            ws_bob.send_json({"content": "Hello from Bob!"})

            # Alice should receive Bob's message
            msg = ws_alice.receive_json()
            assert msg["sender"] == "bob"
            assert msg["content"] == "Hello from Bob!"

            # Bob should also receive his own message (broadcast to all)
            msg_self = ws_bob.receive_json()
            assert msg_self["sender"] == "bob"
```

### Scaling Notes

For multi-process or multi-node deployments, the in-memory `ConnectionManager` will not work across processes. Use Redis Pub/Sub as a broadcast backplane:

```python
import redis.asyncio as redis

class RedisBackedConnectionManager(ConnectionManager):
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        super().__init__()
        self._redis = redis.from_url(redis_url)
        self._pubsub = self._redis.pubsub()

    async def broadcast(self, room: str, message: ChatMessage, exclude: str | None = None):
        # Publish to Redis channel; all nodes receive and forward to local connections
        await self._redis.publish(f"chat:{room}", message.model_dump_json())

    async def _listen(self, room: str):
        """Background task subscribing to Redis channel and forwarding to local WebSockets."""
        await self._pubsub.subscribe(f"chat:{room}")
        async for msg in self._pubsub.listen():
            if msg["type"] == "message":
                data = ChatMessage.model_validate_json(msg["data"])
                await super().broadcast(room, data)
```

---

## Task 5: Background Order Processing with Status Polling

### Pydantic Models

```python
import uuid
import enum
import time
from pydantic import BaseModel, Field


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class OrderItem(BaseModel):
    product_id: str
    quantity: int = Field(gt=0)
    unit_price: float = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: str
    items: list[OrderItem] = Field(min_length=1)
    shipping_address: str


class OrderResponse(BaseModel):
    order_id: str
    status: OrderStatus
    message: str


class OrderStatusResponse(BaseModel):
    order_id: str
    status: OrderStatus
    created_at: float
    updated_at: float
    total: float | None = None
    error: str | None = None
    steps_completed: list[str] = []
```

### Implementation

```python
import asyncio
import uuid
import time
import logging

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

logger = logging.getLogger(__name__)

# In-memory store. In production, use a database or Redis.
orders: dict[str, dict] = {}

# Background task set for graceful shutdown
_background_tasks: set[asyncio.Task] = set()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    # On shutdown, wait for in-flight background tasks (with timeout)
    if _background_tasks:
        logger.info(f"Waiting for {len(_background_tasks)} background tasks to complete...")
        done, pending = await asyncio.wait(_background_tasks, timeout=30)
        for task in pending:
            task.cancel()


app = FastAPI(lifespan=lifespan)


async def process_order(order_id: str) -> None:
    """
    Simulate async order processing pipeline.
    Each step updates the order status so the client can poll for progress.
    """
    order = orders.get(order_id)
    if not order:
        return

    try:
        order["status"] = OrderStatus.PROCESSING
        order["updated_at"] = time.time()

        # Step 1: Validate inventory
        await asyncio.sleep(1)  # Simulate I/O (DB check, external API)
        order["steps_completed"].append("inventory_validated")
        order["updated_at"] = time.time()

        # Step 2: Process payment
        await asyncio.sleep(1)  # Simulate payment gateway call
        order["steps_completed"].append("payment_processed")
        order["updated_at"] = time.time()

        # Step 3: Calculate total
        total = sum(
            item["quantity"] * item["unit_price"]
            for item in order["items"]
        )
        order["total"] = total
        order["steps_completed"].append("total_calculated")
        order["updated_at"] = time.time()

        # Step 4: Send confirmation
        await asyncio.sleep(0.5)  # Simulate email/notification
        order["steps_completed"].append("confirmation_sent")

        # Mark complete
        order["status"] = OrderStatus.COMPLETED
        order["updated_at"] = time.time()
        logger.info(f"Order {order_id} completed successfully. Total: {total}")

    except Exception as e:
        order["status"] = OrderStatus.FAILED
        order["error"] = str(e)
        order["updated_at"] = time.time()
        logger.error(f"Order {order_id} failed: {e}")


@app.post("/orders", response_model=OrderResponse, status_code=202)
async def create_order(order: OrderCreate) -> JSONResponse:
    order_id = str(uuid.uuid4())
    now = time.time()

    # Store order immediately
    orders[order_id] = {
        "order_id": order_id,
        "customer_id": order.customer_id,
        "items": [item.model_dump() for item in order.items],
        "shipping_address": order.shipping_address,
        "status": OrderStatus.PENDING,
        "created_at": now,
        "updated_at": now,
        "total": None,
        "error": None,
        "steps_completed": [],
    }

    # Launch background processing as an asyncio Task
    task = asyncio.create_task(process_order(order_id))
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)

    return JSONResponse(
        status_code=202,
        content={
            "order_id": order_id,
            "status": OrderStatus.PENDING,
            "message": "Order accepted and is being processed.",
        },
        headers={"Location": f"/orders/{order_id}/status"},
    )


@app.get("/orders/{order_id}/status", response_model=OrderStatusResponse)
async def get_order_status(order_id: str) -> OrderStatusResponse:
    order = orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")

    return OrderStatusResponse(
        order_id=order["order_id"],
        status=order["status"],
        created_at=order["created_at"],
        updated_at=order["updated_at"],
        total=order["total"],
        error=order["error"],
        steps_completed=order["steps_completed"],
    )


@app.get("/orders/{order_id}/status/wait", response_model=OrderStatusResponse)
async def wait_for_order(order_id: str, timeout: float = 30.0) -> OrderStatusResponse:
    """
    Long-poll endpoint: blocks until the order reaches a terminal state
    or the timeout expires. Avoids repeated polling from the client.
    """
    order = orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")

    deadline = time.time() + timeout
    while time.time() < deadline:
        if order["status"] in (OrderStatus.COMPLETED, OrderStatus.FAILED):
            break
        await asyncio.sleep(0.5)

    return OrderStatusResponse(
        order_id=order["order_id"],
        status=order["status"],
        created_at=order["created_at"],
        updated_at=order["updated_at"],
        total=order["total"],
        error=order["error"],
        steps_completed=order["steps_completed"],
    )
```

### Test

```python
import pytest
import asyncio
from httpx import ASGITransport, AsyncClient

@pytest.mark.asyncio
async def test_order_lifecycle():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Submit order
        resp = await client.post("/orders", json={
            "customer_id": "cust-1",
            "items": [{"product_id": "prod-a", "quantity": 2, "unit_price": 29.99}],
            "shipping_address": "123 Main St",
        })
        assert resp.status_code == 202
        order_id = resp.json()["order_id"]
        assert resp.headers.get("Location") == f"/orders/{order_id}/status"

        # Immediately check -- should be pending or processing
        resp = await client.get(f"/orders/{order_id}/status")
        assert resp.status_code == 200
        assert resp.json()["status"] in ("pending", "processing")

        # Wait for completion (use the long-poll endpoint)
        resp = await client.get(f"/orders/{order_id}/status/wait?timeout=10")
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "completed"
        assert body["total"] == 59.98
        assert "payment_processed" in body["steps_completed"]


@pytest.mark.asyncio
async def test_order_not_found():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.get("/orders/nonexistent-id/status")
        assert resp.status_code == 404
```

### Production Considerations

For production deployments, replace the in-memory store and `asyncio.create_task` with a proper task queue:

1. **Celery + Redis/RabbitMQ** -- most mature option for distributed task processing
2. **arq** -- lightweight async-native task queue built on Redis, pairs well with FastAPI
3. **Dramatiq** -- good middle ground between Celery complexity and simplicity

Example with arq:

```python
from arq import create_pool
from arq.connections import RedisSettings

async def process_order_arq(ctx, order_id: str):
    """arq worker function."""
    # Same processing logic, but runs in a separate worker process
    ...

@app.post("/orders", status_code=202)
async def create_order(order: OrderCreate):
    order_id = str(uuid.uuid4())
    # Store in database...
    # Enqueue to arq
    redis_pool = await create_pool(RedisSettings())
    await redis_pool.enqueue_job("process_order_arq", order_id)
    return JSONResponse(
        status_code=202,
        content={"order_id": order_id, "status": "pending", "message": "Order accepted."},
        headers={"Location": f"/orders/{order_id}/status"},
    )
```
