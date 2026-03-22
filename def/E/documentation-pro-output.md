## Task 1

## `POST /api/v1/orders`

Create a new order for a product.

**Auth:** Bearer token required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | string | yes | Unique product identifier (UUID format) |
| `quantity` | number | yes | Number of units to order (integer, minimum 1) |
| `shipping_address` | object | yes | Destination address for the order |
| `shipping_address.street` | string | yes | Street address including unit/apt number |
| `shipping_address.city` | string | yes | City name |
| `shipping_address.state` | string | yes | State or province code |
| `shipping_address.postal_code` | string | yes | ZIP or postal code |
| `shipping_address.country` | string | yes | ISO 3166-1 alpha-2 country code (e.g., `"US"`) |

**Response:** `201 Created`

```json
{
  "id": "ord_8f14e45f-ceea-467f-a83c-01b54c4a5732",
  "product_id": "prod_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "quantity": 2,
  "status": "confirmed",
  "shipping_address": {
    "street": "742 Evergreen Terrace",
    "city": "Springfield",
    "state": "IL",
    "postal_code": "62704",
    "country": "US"
  },
  "total_cents": 5998,
  "created_at": "2026-03-22T10:30:00Z"
}
```

**Errors:**

| Status | Code | Meaning |
|--------|------|---------|
| 400 | `validation_error` | Missing required fields or invalid values |
| 401 | `unauthorized` | Bearer token is missing or invalid |
| 409 | `out_of_stock` | Requested quantity exceeds available inventory |

**Error response shape:**

```json
{
  "error": {
    "code": "out_of_stock",
    "message": "Product prod_a1b2c3d4 has 0 units available; 2 requested."
  }
}
```

**Example:**

```bash
curl -X POST https://api.example.com/api/v1/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "quantity": 2,
    "shipping_address": {
      "street": "742 Evergreen Terrace",
      "city": "Springfield",
      "state": "IL",
      "postal_code": "62704",
      "country": "US"
    }
  }'
```

**Related endpoints:**
- `GET /api/v1/orders/:id` -- Retrieve a single order by ID
- `GET /api/v1/products/:id` -- Check product details and stock before ordering

---

## Task 2

# Getting Started with datapipe

**Prerequisites:** Node.js >= 14, npm >= 6
**Time:** 2 minutes

### 1. Install datapipe

```bash
npm install -g datapipe
```

Confirm the installation:

```bash
datapipe --version
```

### 2. Prepare a sample CSV file

```bash
cat <<'EOF' > input.csv
name,age,city
Alice,30,Tokyo
Bob,25,Osaka
Charlie,35,Kyoto
EOF
```

### 3. Transform CSV to JSON

```bash
datapipe transform input.csv --format json
```

Output:

```json
[
  { "name": "Alice", "age": "30", "city": "Tokyo" },
  { "name": "Bob", "age": "25", "city": "Osaka" },
  { "name": "Charlie", "age": "35", "city": "Kyoto" }
]
```

### 4. Create a config file (optional)

```bash
cat <<'EOF' > ~/.datapiperc
{
  "defaultFormat": "json",
  "delimiter": ","
}
EOF
```

With the config file, this uses JSON output by default:

```bash
datapipe transform input.csv
```

### 5. Verify

```bash
datapipe transform input.csv --format json > output.json
cat output.json
```

### Next Steps

- **Supported formats:** `datapipe transform --help` for all output formats
- **Filtering rows:** `datapipe transform input.csv --filter "age > 28"`
- **Piping data:** `cat input.csv | datapipe transform --format json`
- **Config reference:** Full `~/.datapiperc` options in the configuration guide

---

## Task 3

### `retry(fn, max_attempts=3, backoff_factor=2, exceptions=(Exception,))`

Call a function repeatedly until it succeeds or max attempts are exhausted. Sleeps with exponential backoff between failures.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fn` | `Callable[[], T]` | (required) | Zero-argument callable. Wrap functions that take arguments with `lambda` or `functools.partial`. |
| `max_attempts` | `int` | `3` | Total attempts before exception propagates. `1` = no retries. |
| `backoff_factor` | `int \| float` | `2` | Base for exponential sleep. Sleep on attempt *n* = `backoff_factor ** n` seconds. |
| `exceptions` | `tuple[type[Exception], ...]` | `(Exception,)` | Exception types that trigger retry. Others propagate immediately. |

**Returns:** Return value of `fn()` on first successful call.

**Raises:** Last caught exception if all attempts exhausted.

**Backoff schedule (defaults):**

| Attempt | Sleep before next |
|---------|-------------------|
| 1 (fail) | 2 seconds |
| 2 (fail) | 4 seconds |
| 3 (fail) | Exception raised |

**Usage:**

```python
result = retry(
    lambda: requests.get("https://api.example.com/data").json(),
    max_attempts=3,
    backoff_factor=2,
    exceptions=(ConnectionError,),
)
```

**Note:** `fn` must take zero arguments:

```python
# Wrong
retry(requests.get, "https://example.com")

# Correct
retry(lambda: requests.get("https://example.com"))
```

---

## Task 4

# Troubleshooting Guide

### "Connection refused" when starting the application

**Cause:** Server not running or port already in use.

1. Check if another process occupies the port: `lsof -i :3000`
2. If found, stop the conflicting process: `kill -9 <PID>`
3. Check logs for startup errors: `tail -100 app.log | grep -i "error\|EADDRINUSE"`
4. Confirm backing services (database, Redis) are reachable
5. Restart the application

**Verify:** `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health` -- expect `200`

### "Token expired" errors after login

**Cause:** JWT access token lifetime elapsed; client not refreshing.

1. Check token expiration setting: `grep -i "token.*expir" config.env`
2. If too short, increase: `ACCESS_TOKEN_TTL=3600`
3. Restart application
4. If TTL is acceptable, confirm refresh endpoint works:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refresh_token": "<value>"}'
   ```

### Slow page loads (> 5 seconds)

**Cause:** Unoptimized queries, missing indexes, or memory pressure.

1. Find slow endpoints: `awk '$NF > 5000' access.log | tail -20`
2. Enable slow query logging: `ALTER SYSTEM SET log_min_duration_statement = 1000;`
3. Review slow queries and add indexes
4. Check memory/CPU: `top -b -n 1 | grep <app>`

**Verify:** `curl -s -o /dev/null -w "Response time: %{time_total}s\n" http://localhost:3000/`

### File upload fails for large files

**Cause:** Request body size limit smaller than uploaded file.

1. Check limits: `grep -i "max.*body\|upload.*limit" config.env nginx.conf`
2. Increase app limit: `MAX_FILE_SIZE=104857600` (100 MB)
3. Increase nginx: `client_max_body_size 100M;`
4. Reload services
5. Confirm disk space: `df -h /uploads`

**Verify:** Upload a test file with curl and confirm success.

---

## Task 5

# Changelog

## 2.5.0 -- 2026-03-22

### Added

- **WebSocket support for real-time updates.** Clients can connect to `ws://<host>/ws` to receive live event streams for order status changes, notifications, and data sync. See the WebSocket integration guide for connection details and message formats.

### Fixed

- **Memory leak in cache module** ([#1234](https://github.com/example/repo/issues/1234)). The in-memory cache did not release expired entries during eviction cycles, causing heap growth under sustained load. The eviction loop now correctly removes stale entries on each sweep.

### Deprecated

- **`/api/v1/legacy` endpoint.** Scheduled for removal in version 3.0.0. Migrate to `/api/v2/resource` before upgrading. See the migration guide for field-by-field mapping.

### Breaking Changes

- **Minimum Node.js version is now 18.** Node.js 16 reached end-of-life. Update your runtime before upgrading:
  ```bash
  node --version
  # Must output v18.x.x or higher
  ```
