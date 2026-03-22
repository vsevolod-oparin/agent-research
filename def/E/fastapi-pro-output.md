## Task 1

### CSV File Upload with Validation and Summary

```python
from fastapi import APIRouter, File, UploadFile, HTTPException
import csv
import io

REQUIRED_COLUMNS = {"name", "email", "age"}
router = APIRouter(prefix="/api/v1", tags=["CSV"])


@router.post("/csv/upload", status_code=200)
def upload_csv(file: UploadFile = File(...)):
    if file.content_type not in ("text/csv", "application/octet-stream", None):
        raise HTTPException(status_code=400, detail=f"Expected CSV, got {file.content_type}")

    contents = file.file.read()
    try:
        text = contents.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File is not valid UTF-8.")

    reader = csv.DictReader(io.StringIO(text))
    headers = reader.fieldnames
    if not headers:
        raise HTTPException(status_code=400, detail="CSV is empty or has no header.")

    missing = REQUIRED_COLUMNS - set(h.strip().lower() for h in headers)
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing columns: {sorted(missing)}")

    rows = list(reader)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV has header but no data rows.")

    # Build column stats
    column_stats = []
    for col in headers:
        values = [row.get(col, "") for row in rows]
        non_null = [v for v in values if v.strip()]
        unique = set(non_null)
        column_stats.append({
            "column": col,
            "non_null_count": len(non_null),
            "unique_count": len(unique),
            "sample_values": sorted(unique)[:5],
        })

    # Age stats
    age_stats = None
    age_key = next((h for h in headers if h.strip().lower() == "age"), None)
    if age_key:
        numeric_ages = []
        for row in rows:
            try:
                numeric_ages.append(float(row[age_key]))
            except (ValueError, KeyError):
                continue
        if numeric_ages:
            age_stats = {
                "min": min(numeric_ages),
                "max": max(numeric_ages),
                "mean": round(sum(numeric_ages) / len(numeric_ages), 2),
            }

    return {
        "row_count": len(rows),
        "column_count": len(headers),
        "columns": headers,
        "column_stats": column_stats,
        "age_stats": age_stats,
    }
```

**Key decisions:** Sync endpoint (`def`) because `UploadFile.file` is a sync `SpooledTemporaryFile` and `csv.DictReader` is CPU-bound. Validation in the handler raises HTTPException with 400/422 for clear error semantics.

---

## Task 2

### Rate Limiting with Per-User and Per-IP Buckets

```python
import time
from fastapi import HTTPException, Request, Depends


class TokenBucket:
    def __init__(self):
        self._buckets: dict[str, tuple[float, float]] = {}

    def is_allowed(self, key: str, max_tokens: int, refill_period: float) -> tuple[bool, float]:
        now = time.monotonic()
        tokens, last_refill = self._buckets.get(key, (float(max_tokens), now))
        elapsed = now - last_refill
        tokens = min(max_tokens, tokens + elapsed * (max_tokens / refill_period))
        last_refill = now

        if tokens >= 1.0:
            self._buckets[key] = (tokens - 1.0, last_refill)
            return True, 0.0
        retry_after = (1.0 - tokens) * (refill_period / max_tokens)
        self._buckets[key] = (tokens, last_refill)
        return False, round(retry_after, 1)


_bucket = TokenBucket()


def rate_limit_authenticated(request: Request, current_user=Depends(get_current_user)):
    key = f"auth:{current_user.id}"
    allowed, retry_after = _bucket.is_allowed(key, max_tokens=100, refill_period=60.0)
    if not allowed:
        raise HTTPException(status_code=429, detail="Rate limit exceeded.",
                          headers={"Retry-After": str(int(retry_after))})
    return current_user


def rate_limit_ip(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    allowed, retry_after = _bucket.is_allowed(f"ip:{client_ip}", max_tokens=20, refill_period=60.0)
    if not allowed:
        raise HTTPException(status_code=429, detail="Rate limit exceeded.",
                          headers={"Retry-After": str(int(retry_after))})
```

**Usage:** `@router.get("/protected", dependencies=[Depends(rate_limit_authenticated)])` for authenticated, `dependencies=[Depends(rate_limit_ip)]` for public.

For production, replace in-memory dict with Redis using Lua script for atomic check-and-decrement.

---

## Task 3

### Fixing N+1 Query with SQLAlchemy Async

**Before (101 queries):**
```python
result = await session.execute(select(User))
users = result.scalars().all()
# Accessing user.roles triggers lazy load per user
```

**After (2 queries):**
```python
from sqlalchemy.orm import selectinload

stmt = (
    select(User)
    .options(selectinload(User.roles))
    .limit(100)
)
result = await session.execute(stmt)
users = result.scalars().unique().all()
```

**Why `selectinload` over `joinedload`:**

| Strategy | Queries | Best for |
|----------|---------|----------|
| `selectinload` | 2 (users + `WHERE user_id IN (...)`) | Many-to-many, one-to-many |
| `joinedload` | 1 (JOIN) | One-to-one; creates cartesian product with M2M |
| `subqueryload` | 2 (subquery) | Large IN-clause lists |

For nested relationships: `selectinload(User.roles).selectinload(Role.permissions)` -- one query per level.

Set `lazy="raise"` on relationships during development to catch accidental lazy loads.

---

## Task 4

### WebSocket Chat Room

```python
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from collections import defaultdict

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self._rooms: dict[str, dict[str, WebSocket]] = defaultdict(dict)

    async def connect(self, room_id: str, username: str, ws: WebSocket):
        await ws.accept()
        self._rooms[room_id][username] = ws
        await self.broadcast(room_id, {"type": "system", "content": f"{username} joined."})

    async def disconnect(self, room_id: str, username: str):
        self._rooms[room_id].pop(username, None)
        if not self._rooms[room_id]:
            del self._rooms[room_id]
        else:
            await self.broadcast(room_id, {"type": "system", "content": f"{username} left."})

    async def broadcast(self, room_id: str, message: dict):
        dead = []
        for uname, ws in self._rooms.get(room_id, {}).items():
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(uname)
        for uname in dead:
            self._rooms[room_id].pop(uname, None)

manager = ConnectionManager()


@router.websocket("/ws/chat/{room_id}")
async def chat_websocket(ws: WebSocket, room_id: str, username: str = Query(...)):
    await manager.connect(room_id, username, ws)
    try:
        while True:
            data = await ws.receive_json()
            content = data.get("content", "").strip()
            if not content:
                await ws.send_json({"type": "error", "content": "Empty message."})
                continue
            await manager.broadcast(room_id, {
                "type": "message", "username": username, "content": content,
                "room_id": room_id,
            })
    except WebSocketDisconnect:
        await manager.disconnect(room_id, username)
```

**Connect:** `ws://host/ws/chat/{room_id}?username=alice`
**Send:** `{"content": "Hello!"}`
**Receive:** `{"type": "message", "username": "alice", "content": "Hello!", "room_id": "general"}`

For horizontal scaling, replace `ConnectionManager` with Redis pub/sub backend.

---

## Task 5

### Background Order Processing with Status Polling

```python
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
import uuid, asyncio
from enum import Enum

router = APIRouter(prefix="/api/v1")


class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


_orders: dict[str, dict] = {}


@router.post("/orders", status_code=202)
def submit_order(order: OrderCreate, background_tasks: BackgroundTasks, request: Request):
    order_id = str(uuid.uuid4())
    _orders[order_id] = {
        "order_id": order_id, "status": OrderStatus.PENDING,
        "product_id": order.product_id, "quantity": order.quantity,
    }
    background_tasks.add_task(process_order, order_id)
    base_url = str(request.base_url).rstrip("/")
    return {"order_id": order_id, "status": "pending",
            "status_url": f"{base_url}/api/v1/orders/{order_id}/status"}


@router.get("/orders/{order_id}/status")
def get_order_status(order_id: str):
    order = _orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")
    return order


async def process_order(order_id: str):
    order = _orders.get(order_id)
    if not order:
        return
    order["status"] = OrderStatus.PROCESSING
    try:
        await asyncio.sleep(5)  # Simulate processing
        order["status"] = OrderStatus.COMPLETED
        order["detail"] = "Payment processed, shipment scheduled."
    except Exception as e:
        order["status"] = OrderStatus.FAILED
        order["detail"] = str(e)
```

**Key decisions:**
- `status_code=202` -- correct HTTP semantic for accepted-but-not-complete
- `BackgroundTasks` is appropriate for fire-and-forget tasks under 30s. For production, switch to Celery/ARQ for retry and persistence.
- Response includes `status_url` for client polling (HATEOAS)
- Submit endpoint is sync (`def`) because `create_order` is an in-memory dict write
- For production, store order state in a database table, not in-memory dict
