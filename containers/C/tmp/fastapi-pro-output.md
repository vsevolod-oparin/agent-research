## Task 1

### CSV File Upload with Validation and Summary

This endpoint accepts a CSV upload, validates required columns exist, and returns statistical summaries.

```python
# task1_csv_upload.py

import csv
import io
import statistics

from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel

app = FastAPI()

REQUIRED_COLUMNS = {"name", "email", "age"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


class ColumnStats(BaseModel):
    column: str
    non_null_count: int
    unique_count: int
    # Numeric stats (only for age)
    min_value: float | None = None
    max_value: float | None = None
    mean_value: float | None = None
    median_value: float | None = None


class CSVSummary(BaseModel):
    row_count: int
    column_count: int
    columns: list[str]
    column_stats: list[ColumnStats]
    validation_errors: list[str]


def _validate_email_format(email: str) -> bool:
    """Basic email format check without pulling in a heavy dependency."""
    return "@" in email and "." in email.split("@")[-1]


def _compute_column_stats(
    column_name: str, values: list[str]
) -> ColumnStats:
    non_null = [v for v in values if v.strip()]
    unique = set(non_null)

    stats = ColumnStats(
        column=column_name,
        non_null_count=len(non_null),
        unique_count=len(unique),
    )

    if column_name == "age":
        numeric_values: list[float] = []
        for v in non_null:
            try:
                numeric_values.append(float(v))
            except ValueError:
                continue
        if numeric_values:
            stats.min_value = min(numeric_values)
            stats.max_value = max(numeric_values)
            stats.mean_value = round(statistics.mean(numeric_values), 2)
            stats.median_value = round(statistics.median(numeric_values), 2)

    return stats


@app.post("/upload/csv", response_model=CSVSummary)
async def upload_csv(file: UploadFile = File(...)) -> CSVSummary:
    # --- Validate content type ---
    if file.content_type not in (
        "text/csv",
        "application/vnd.ms-excel",
        "application/octet-stream",
    ):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Expected CSV.",
        )

    # --- Read with size guard ---
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum size of {MAX_FILE_SIZE // (1024*1024)} MB.",
        )

    # --- Decode and parse ---
    try:
        text = contents.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File is not valid UTF-8.")

    reader = csv.DictReader(io.StringIO(text))
    if reader.fieldnames is None:
        raise HTTPException(status_code=400, detail="CSV file is empty or has no header.")

    columns = [c.strip().lower() for c in reader.fieldnames]

    # --- Validate required columns ---
    missing = REQUIRED_COLUMNS - set(columns)
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required columns: {', '.join(sorted(missing))}. "
                   f"Found: {', '.join(columns)}.",
        )

    # --- Collect rows and per-column values ---
    rows: list[dict[str, str]] = []
    column_values: dict[str, list[str]] = {c: [] for c in columns}
    validation_errors: list[str] = []

    for i, row in enumerate(reader, start=2):  # row 1 is the header
        # Normalize keys to lowercase
        normalized = {k.strip().lower(): (v or "").strip() for k, v in row.items()}
        rows.append(normalized)

        for col in columns:
            column_values[col].append(normalized.get(col, ""))

        # Row-level validation
        email = normalized.get("email", "")
        if email and not _validate_email_format(email):
            validation_errors.append(f"Row {i}: invalid email '{email}'")

        age_str = normalized.get("age", "")
        if age_str:
            try:
                age = float(age_str)
                if age < 0 or age > 150:
                    validation_errors.append(
                        f"Row {i}: age {age} out of reasonable range (0-150)"
                    )
            except ValueError:
                validation_errors.append(
                    f"Row {i}: age '{age_str}' is not a valid number"
                )

    # --- Build stats ---
    col_stats = [_compute_column_stats(col, column_values[col]) for col in columns]

    return CSVSummary(
        row_count=len(rows),
        column_count=len(columns),
        columns=columns,
        column_stats=col_stats,
        validation_errors=validation_errors,
    )
```

**Key design decisions:**

- **Size guard**: Reads the full file but caps at 10 MB to prevent memory abuse. For very large files, you would stream with `file.read(chunk_size)` instead.
- **Lowercase normalization**: Column names are lowercased so "Name", "NAME", and "name" all match.
- **Validation errors collected, not raised**: The endpoint returns a summary even if individual rows have issues -- the `validation_errors` list lets the caller decide how strict to be.
- **Statistics only for numeric columns**: The `age` column gets min/max/mean/median; string columns get non-null and unique counts.

**Example response:**

```json
{
  "row_count": 3,
  "column_count": 3,
  "columns": ["name", "email", "age"],
  "column_stats": [
    {"column": "name", "non_null_count": 3, "unique_count": 3, "min_value": null, "max_value": null, "mean_value": null, "median_value": null},
    {"column": "email", "non_null_count": 3, "unique_count": 3, "min_value": null, "max_value": null, "mean_value": null, "median_value": null},
    {"column": "age", "non_null_count": 3, "unique_count": 3, "min_value": 25.0, "max_value": 45.0, "mean_value": 33.33, "median_value": 30.0}
  ],
  "validation_errors": []
}
```

---

## Task 2

### Rate Limiting with Per-User and Per-IP Buckets

This implementation uses an in-memory sliding window counter. For production with multiple workers/instances, replace the in-memory store with Redis.

```python
# task2_rate_limiting.py

import time
from dataclasses import dataclass, field
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

app = FastAPI()

# ---------------------------------------------------------------------------
# Sliding window rate limiter
# ---------------------------------------------------------------------------

@dataclass
class RateLimitBucket:
    max_requests: int
    window_seconds: int
    timestamps: list[float] = field(default_factory=list)

    def is_allowed(self) -> tuple[bool, int, int]:
        """Check if a request is allowed.

        Returns:
            (allowed, remaining, retry_after_seconds)
        """
        now = time.monotonic()
        cutoff = now - self.window_seconds

        # Prune expired timestamps
        self.timestamps = [t for t in self.timestamps if t > cutoff]

        if len(self.timestamps) >= self.max_requests:
            # Calculate when the earliest request in the window expires
            retry_after = int(self.timestamps[0] - cutoff) + 1
            remaining = 0
            return False, remaining, retry_after

        self.timestamps.append(now)
        remaining = self.max_requests - len(self.timestamps)
        return True, remaining, 0


class RateLimiter:
    """In-memory rate limiter. Replace with Redis for multi-process deploys."""

    def __init__(self) -> None:
        self._buckets: dict[str, RateLimitBucket] = {}

    def check(
        self, key: str, max_requests: int, window_seconds: int
    ) -> tuple[bool, int, int]:
        if key not in self._buckets:
            self._buckets[key] = RateLimitBucket(
                max_requests=max_requests,
                window_seconds=window_seconds,
            )
        bucket = self._buckets[key]
        return bucket.is_allowed()


# Singleton -- in production, use Redis-backed implementation
rate_limiter = RateLimiter()

# ---------------------------------------------------------------------------
# Auth dependency (simplified)
# ---------------------------------------------------------------------------

optional_bearer = HTTPBearer(auto_error=False)


async def get_optional_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(optional_bearer)
    ] = None,
) -> str | None:
    """Extract user ID from token. Returns None for unauthenticated requests.

    In production, this would decode and verify a JWT.
    """
    if credentials is None:
        return None
    # Simplified: treat the token itself as the user ID
    # Replace with real JWT decoding
    return credentials.credentials


# ---------------------------------------------------------------------------
# Rate limit dependency
# ---------------------------------------------------------------------------

async def rate_limit_check(
    request: Request,
    response: Response,
    user_id: Annotated[str | None, Depends(get_optional_user)],
) -> None:
    if user_id is not None:
        # Authenticated: 100 req/min per user
        key = f"user:{user_id}"
        max_req = 100
        window = 60
    else:
        # Unauthenticated: 20 req/min per IP
        client_ip = request.client.host if request.client else "unknown"
        key = f"ip:{client_ip}"
        max_req = 20
        window = 60

    allowed, remaining, retry_after = rate_limiter.check(key, max_req, window)

    # Always set informational headers
    response.headers["X-RateLimit-Limit"] = str(max_req)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Window"] = f"{window}s"

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please slow down.",
            headers={
                "Retry-After": str(retry_after),
                "X-RateLimit-Limit": str(max_req),
                "X-RateLimit-Remaining": "0",
            },
        )


# ---------------------------------------------------------------------------
# Apply rate limiting globally via dependency or per-route
# ---------------------------------------------------------------------------

@app.get("/public", dependencies=[Depends(rate_limit_check)])
async def public_endpoint() -> dict:
    return {"message": "This endpoint is rate-limited at 20 req/min for anonymous users."}


@app.get("/protected", dependencies=[Depends(rate_limit_check)])
async def protected_endpoint(
    user_id: Annotated[str, Depends(get_optional_user)],
) -> dict:
    return {"message": f"Hello {user_id}, rate-limited at 100 req/min."}
```

**Production upgrade -- Redis-backed limiter:**

```python
# task2_redis_rate_limiter.py

import redis.asyncio as redis


class RedisRateLimiter:
    """Sliding window counter using Redis sorted sets.

    Atomic, works across multiple Uvicorn workers and instances.
    """

    def __init__(self, redis_url: str = "redis://localhost:6379/0") -> None:
        self._redis = redis.from_url(redis_url)

    async def check(
        self, key: str, max_requests: int, window_seconds: int
    ) -> tuple[bool, int, int]:
        import time

        now = time.time()
        window_start = now - window_seconds
        pipe_key = f"ratelimit:{key}"

        async with self._redis.pipeline(transaction=True) as pipe:
            # Remove expired entries
            pipe.zremrangebyscore(pipe_key, 0, window_start)
            # Count current window
            pipe.zcard(pipe_key)
            # Add current request (optimistically)
            pipe.zadd(pipe_key, {str(now): now})
            # Set TTL so keys auto-expire
            pipe.expire(pipe_key, window_seconds)
            results = await pipe.execute()

        current_count = results[1]  # zcard result

        if current_count >= max_requests:
            # Over limit -- remove the optimistic add
            await self._redis.zrem(pipe_key, str(now))
            # Get oldest entry to compute retry-after
            oldest = await self._redis.zrange(pipe_key, 0, 0, withscores=True)
            retry_after = int(oldest[0][1] - window_start) + 1 if oldest else 1
            return False, 0, retry_after

        remaining = max_requests - current_count - 1
        return True, remaining, 0
```

**Key design decisions:**

- **Sliding window** (not fixed window) avoids burst spikes at window boundaries.
- **`HTTPException` with `headers`** ensures the `Retry-After` header is present on 429 responses, which is required by RFC 6585.
- **Dependency injection** makes it trivial to apply rate limiting globally or per-route.
- **Separate keys** for authenticated vs. unauthenticated traffic prevent a single anonymous IP from blocking an authenticated user behind the same NAT.

---

## Task 3

### Fixing the N+1 Query Problem with SQLAlchemy Async

**The problem:** Loading 100 users and accessing `user.roles` in a loop triggers a lazy load for each user -- 1 query for users + 100 queries for roles = 101 total.

```python
# task3_n_plus_1_BROKEN.py  (the problem)

@app.get("/users")
async def get_users(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User))
    users = result.scalars().all()

    # BUG: Each user.roles triggers a lazy load = N+1
    return [
        {
            "id": u.id,
            "name": u.name,
            "roles": [r.name for r in u.roles],  # <-- lazy load here
        }
        for u in users
    ]
```

**The fix -- three approaches ranked by preference:**

### Approach 1: `selectinload` (Recommended)

Two queries total: one for users, one for all related roles.

```python
# task3_n_plus_1_FIX.py

from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
    selectinload,
)
from sqlalchemy import select

from fastapi import Depends, FastAPI
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class Base(DeclarativeBase):
    pass


# Association table for many-to-many
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
)


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)

    roles: Mapped[list[Role]] = relationship(
        secondary=user_roles,
        lazy="raise",  # Prevent accidental lazy loading in async
    )


# ---------------------------------------------------------------------------
# Database setup
# ---------------------------------------------------------------------------

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost:5432/mydb"

engine = create_async_engine(DATABASE_URL, pool_size=20, max_overflow=10)
async_session = async_sessionmaker(engine, expire_on_commit=False)

app = FastAPI()


async def get_session():
    async with async_session() as session:
        yield session


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class RoleOut(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    roles: list[RoleOut]

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Fixed endpoint -- selectinload (2 queries total)
# ---------------------------------------------------------------------------

@app.get("/users", response_model=list[UserOut])
async def get_users(session: AsyncSession = Depends(get_session)):
    stmt = (
        select(User)
        .options(selectinload(User.roles))
        .order_by(User.id)
    )
    result = await session.execute(stmt)
    users = result.scalars().all()
    return users
```

### Approach 2: `joinedload` (Single Query with JOIN)

One query using a LEFT OUTER JOIN. Good for small result sets, but beware of row duplication with large datasets.

```python
from sqlalchemy.orm import joinedload

@app.get("/users/joined", response_model=list[UserOut])
async def get_users_joined(session: AsyncSession = Depends(get_session)):
    stmt = (
        select(User)
        .options(joinedload(User.roles))
        .order_by(User.id)
    )
    result = await session.execute(stmt)
    # unique() is REQUIRED with joinedload to deduplicate rows
    users = result.scalars().unique().all()
    return users
```

### Approach 3: `subqueryload`

Similar to `selectinload` but uses a subquery instead of `WHERE IN`. Useful when the primary query has complex filters.

```python
from sqlalchemy.orm import subqueryload

stmt = select(User).options(subqueryload(User.roles))
```

### Comparison table

| Strategy | Queries | Best For | Caveat |
|----------|---------|----------|--------|
| `selectinload` | 2 | Most cases, especially many-to-many | IN clause can get large (1000+ IDs) |
| `joinedload` | 1 | Small datasets, one-to-one/many | Row duplication, needs `.unique()` |
| `subqueryload` | 2 | Complex filtered queries | Subquery can be slower than IN |

### Critical: Prevent accidental lazy loads in async

```python
# On the relationship, set lazy="raise"
roles: Mapped[list[Role]] = relationship(
    secondary=user_roles,
    lazy="raise",  # Raises InvalidRequestError if you forget eager loading
)
```

This makes the app fail loudly if you forget to add `.options(selectinload(...))` instead of silently issuing N+1 queries (which would actually raise `MissingGreenlet` in async anyway, but `lazy="raise"` makes the intent explicit and gives a clearer error).

### Nested eager loading

If roles had sub-relationships (e.g., permissions), chain them:

```python
stmt = (
    select(User)
    .options(
        selectinload(User.roles).selectinload(Role.permissions)
    )
)
```

---

## Task 4

### WebSocket Chat Room

A production-grade WebSocket chat room supporting multiple rooms, user identification, and broadcast messaging.

```python
# task4_websocket_chat.py

import asyncio
import time
import uuid
from dataclasses import dataclass, field
from enum import StrEnum

from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Any

app = FastAPI()


# ---------------------------------------------------------------------------
# Message types
# ---------------------------------------------------------------------------

class MessageType(StrEnum):
    CHAT = "chat"
    JOIN = "join"
    LEAVE = "leave"
    SYSTEM = "system"
    ERROR = "error"
    MEMBERS = "members"


class ChatMessage(BaseModel):
    type: MessageType
    room: str
    sender: str
    content: str
    timestamp: float
    message_id: str


# ---------------------------------------------------------------------------
# Connection manager
# ---------------------------------------------------------------------------

@dataclass
class RoomMember:
    websocket: WebSocket
    username: str
    joined_at: float = field(default_factory=time.time)


class ConnectionManager:
    """Manages WebSocket connections organized by chat rooms."""

    def __init__(self) -> None:
        # room_id -> {connection_id: RoomMember}
        self._rooms: dict[str, dict[str, RoomMember]] = {}
        self._lock = asyncio.Lock()

    async def connect(
        self, websocket: WebSocket, room_id: str, username: str
    ) -> str:
        """Accept the WebSocket and register the user in a room.

        Returns a unique connection ID.
        """
        await websocket.accept()
        conn_id = str(uuid.uuid4())

        async with self._lock:
            if room_id not in self._rooms:
                self._rooms[room_id] = {}

            # Check for duplicate username in room
            for member in self._rooms[room_id].values():
                if member.username == username:
                    await websocket.send_json(
                        {
                            "type": MessageType.ERROR,
                            "content": f"Username '{username}' is already taken in this room.",
                        }
                    )
                    await websocket.close(code=4001, reason="Username taken")
                    raise ValueError(f"Duplicate username: {username}")

            self._rooms[room_id][conn_id] = RoomMember(
                websocket=websocket,
                username=username,
            )

        # Notify room
        await self.broadcast(
            room_id,
            ChatMessage(
                type=MessageType.JOIN,
                room=room_id,
                sender="system",
                content=f"{username} joined the room.",
                timestamp=time.time(),
                message_id=str(uuid.uuid4()),
            ),
            exclude_conn=conn_id,
        )

        # Send member list to the joiner
        members = await self.get_members(room_id)
        await websocket.send_json(
            {
                "type": MessageType.MEMBERS,
                "room": room_id,
                "members": members,
            }
        )

        return conn_id

    async def disconnect(
        self, conn_id: str, room_id: str, username: str
    ) -> None:
        async with self._lock:
            if room_id in self._rooms:
                self._rooms[room_id].pop(conn_id, None)
                if not self._rooms[room_id]:
                    del self._rooms[room_id]

        await self.broadcast(
            room_id,
            ChatMessage(
                type=MessageType.LEAVE,
                room=room_id,
                sender="system",
                content=f"{username} left the room.",
                timestamp=time.time(),
                message_id=str(uuid.uuid4()),
            ),
        )

    async def broadcast(
        self,
        room_id: str,
        message: ChatMessage,
        exclude_conn: str | None = None,
    ) -> None:
        """Send a message to all members of a room."""
        async with self._lock:
            members = self._rooms.get(room_id, {})
            targets = [
                (cid, m)
                for cid, m in members.items()
                if cid != exclude_conn
            ]

        # Send outside the lock to avoid holding it during I/O
        disconnected: list[str] = []
        for cid, member in targets:
            try:
                await member.websocket.send_json(message.model_dump())
            except Exception:
                disconnected.append(cid)

        # Clean up any broken connections
        if disconnected:
            async with self._lock:
                for cid in disconnected:
                    self._rooms.get(room_id, {}).pop(cid, None)

    async def send_personal(
        self, websocket: WebSocket, message: dict[str, Any]
    ) -> None:
        await websocket.send_json(message)

    async def get_members(self, room_id: str) -> list[str]:
        async with self._lock:
            members = self._rooms.get(room_id, {})
            return [m.username for m in members.values()]


manager = ConnectionManager()


# ---------------------------------------------------------------------------
# WebSocket endpoint
# ---------------------------------------------------------------------------

@app.websocket("/ws/chat/{room_id}")
async def websocket_chat(
    websocket: WebSocket,
    room_id: str,
    username: str = Query(...),
):
    """WebSocket chat endpoint.

    Connect: ws://host/ws/chat/my-room?username=alice

    Send messages as JSON:
        {"content": "Hello everyone!"}

    Receive messages as JSON:
        {"type": "chat", "room": "my-room", "sender": "bob",
         "content": "Hi!", "timestamp": 1234567890.0, "message_id": "..."}
    """
    conn_id: str | None = None
    try:
        conn_id = await manager.connect(websocket, room_id, username)
    except ValueError:
        return  # Username was taken; connection already closed

    try:
        while True:
            data = await websocket.receive_json()
            content = data.get("content", "").strip()

            if not content:
                await manager.send_personal(
                    websocket,
                    {"type": MessageType.ERROR, "content": "Empty message."},
                )
                continue

            if len(content) > 4096:
                await manager.send_personal(
                    websocket,
                    {"type": MessageType.ERROR, "content": "Message too long (max 4096 chars)."},
                )
                continue

            message = ChatMessage(
                type=MessageType.CHAT,
                room=room_id,
                sender=username,
                content=content,
                timestamp=time.time(),
                message_id=str(uuid.uuid4()),
            )

            # Broadcast to everyone including the sender
            await manager.broadcast(room_id, message)

    except WebSocketDisconnect:
        pass
    finally:
        if conn_id is not None:
            await manager.disconnect(conn_id, room_id, username)


# ---------------------------------------------------------------------------
# REST endpoints for room info
# ---------------------------------------------------------------------------

@app.get("/rooms/{room_id}/members")
async def get_room_members(room_id: str) -> dict:
    members = await manager.get_members(room_id)
    return {"room": room_id, "members": members, "count": len(members)}
```

**Key design decisions:**

- **`asyncio.Lock`** protects the shared `_rooms` dict from race conditions during concurrent connects/disconnects.
- **Lock is NOT held during I/O**: The broadcast method copies the target list under the lock, then sends outside it. This prevents one slow client from blocking all room operations.
- **Duplicate username rejection**: Users get a clear error code (4001) and cannot impersonate another room member.
- **Message validation**: Empty and oversized messages are rejected with error frames rather than silently dropped.
- **Broken connection cleanup**: If a send fails during broadcast, that connection is cleaned up automatically.
- **Connection ID**: Each connection gets a UUID, not the username, which allows the same user to reconnect and avoids identity collisions.

**Client example (JavaScript):**

```javascript
const ws = new WebSocket("ws://localhost:8000/ws/chat/general?username=alice");

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    console.log(`[${msg.type}] ${msg.sender}: ${msg.content}`);
};

ws.onopen = () => {
    ws.send(JSON.stringify({ content: "Hello everyone!" }));
};
```

---

## Task 5

### Background Order Processing with Status Polling

This implementation uses an in-memory store for demonstration. For production, swap the store for Redis or a database, and consider Celery/Dramatiq for heavy processing.

```python
# task5_background_orders.py

import asyncio
import logging
import time
import uuid
from enum import StrEnum

from fastapi import BackgroundTasks, FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Order models
# ---------------------------------------------------------------------------

class OrderStatus(StrEnum):
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
    total_amount: float | None = None
    error_message: str | None = None
    items_count: int
    processing_duration_seconds: float | None = None


class OrderRecord(BaseModel):
    order_id: str
    customer_id: str
    items: list[OrderItem]
    shipping_address: str
    status: OrderStatus = OrderStatus.PENDING
    created_at: float = Field(default_factory=time.time)
    updated_at: float = Field(default_factory=time.time)
    total_amount: float | None = None
    error_message: str | None = None
    processing_started_at: float | None = None
    processing_finished_at: float | None = None


# ---------------------------------------------------------------------------
# In-memory store (replace with database/Redis in production)
# ---------------------------------------------------------------------------

orders_store: dict[str, OrderRecord] = {}


# ---------------------------------------------------------------------------
# Background processing logic
# ---------------------------------------------------------------------------

async def process_order(order_id: str) -> None:
    """Simulate order processing pipeline.

    In production this would:
    - Validate inventory
    - Charge payment
    - Reserve stock
    - Notify fulfillment
    - Send confirmation email
    """
    order = orders_store.get(order_id)
    if order is None:
        logger.error(f"Order {order_id} not found for processing")
        return

    order.status = OrderStatus.PROCESSING
    order.processing_started_at = time.time()
    order.updated_at = time.time()

    try:
        # Step 1: Validate inventory
        logger.info(f"Order {order_id}: Validating inventory...")
        await asyncio.sleep(0.5)  # Simulate I/O

        # Step 2: Calculate total
        total = sum(
            item.quantity * item.unit_price for item in order.items
        )
        order.total_amount = round(total, 2)

        # Step 3: Process payment
        logger.info(f"Order {order_id}: Processing payment of ${total:.2f}...")
        await asyncio.sleep(1.0)  # Simulate payment gateway call

        # Step 4: Reserve stock
        logger.info(f"Order {order_id}: Reserving stock...")
        await asyncio.sleep(0.3)

        # Step 5: Send confirmation
        logger.info(f"Order {order_id}: Sending confirmation...")
        await asyncio.sleep(0.2)

        # Mark completed
        order.status = OrderStatus.COMPLETED
        order.processing_finished_at = time.time()
        order.updated_at = time.time()
        logger.info(f"Order {order_id}: Completed successfully.")

    except Exception as exc:
        order.status = OrderStatus.FAILED
        order.error_message = str(exc)
        order.processing_finished_at = time.time()
        order.updated_at = time.time()
        logger.error(f"Order {order_id}: Failed -- {exc}")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.post(
    "/orders",
    response_model=OrderResponse,
    status_code=202,
)
async def create_order(
    order_in: OrderCreate,
    background_tasks: BackgroundTasks,
) -> OrderResponse:
    """Submit a new order. Returns 202 Accepted immediately.

    The order is processed asynchronously in the background.
    Poll GET /orders/{order_id}/status to check progress.
    """
    order_id = str(uuid.uuid4())

    record = OrderRecord(
        order_id=order_id,
        customer_id=order_in.customer_id,
        items=order_in.items,
        shipping_address=order_in.shipping_address,
    )
    orders_store[order_id] = record

    # Schedule background processing
    background_tasks.add_task(process_order, order_id)

    return OrderResponse(
        order_id=order_id,
        status=OrderStatus.PENDING,
        message="Order accepted and queued for processing.",
    )


@app.get(
    "/orders/{order_id}/status",
    response_model=OrderStatusResponse,
)
async def get_order_status(order_id: str) -> OrderStatusResponse:
    """Check the processing status of an order."""
    order = orders_store.get(order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found.")

    duration = None
    if order.processing_started_at is not None:
        end = order.processing_finished_at or time.time()
        duration = round(end - order.processing_started_at, 2)

    return OrderStatusResponse(
        order_id=order.order_id,
        status=order.status,
        created_at=order.created_at,
        updated_at=order.updated_at,
        total_amount=order.total_amount,
        error_message=order.error_message,
        items_count=len(order.items),
        processing_duration_seconds=duration,
    )


@app.get("/orders/{order_id}")
async def get_order(order_id: str) -> OrderRecord:
    """Retrieve full order details."""
    order = orders_store.get(order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order
```

**Production upgrade -- Celery task queue:**

For real applications, `BackgroundTasks` runs in the same process as the web server. If the worker crashes, in-flight tasks are lost. Here is how to upgrade to Celery:

```python
# task5_celery_worker.py

from celery import Celery

celery_app = Celery(
    "orders",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)
celery_app.conf.task_track_started = True


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_order_task(self, order_id: str) -> dict:
    """Celery task with retries and result tracking."""
    try:
        # ... same processing logic but synchronous ...
        return {"order_id": order_id, "status": "completed"}
    except Exception as exc:
        self.retry(exc=exc)


# In the FastAPI endpoint, replace:
#   background_tasks.add_task(process_order, order_id)
# with:
#   task = process_order_task.delay(order_id)
#   record.celery_task_id = task.id
#
# In the status endpoint, check:
#   result = AsyncResult(record.celery_task_id)
#   result.state  -> PENDING, STARTED, SUCCESS, FAILURE
```

**Key design decisions:**

- **202 Accepted** is the correct HTTP status for "accepted for processing" per RFC 7231. The response includes the order ID so the client knows where to poll.
- **Pydantic models** for request, response, and internal record ensure strict validation at every boundary.
- **Processing duration tracking** gives the client useful information about how long their order has been processing.
- **Error capture**: Failed orders store the error message so the status endpoint can explain what went wrong.
- **`BackgroundTasks`** is used for simplicity. The Celery upgrade path is shown because `BackgroundTasks` is unsuitable for production workloads that require durability, retries, or horizontal scaling.
