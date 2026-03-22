## Task 1

### POST /api/v1/orders

Create a new order for a given product.

#### Authentication

This endpoint requires a valid Bearer token in the `Authorization` header.

```
Authorization: Bearer <token>
```

#### Request

**Method:** `POST`
**URL:** `/api/v1/orders`
**Content-Type:** `application/json`

**Body Parameters**

| Parameter          | Type     | Required | Description                                      |
|--------------------|----------|----------|--------------------------------------------------|
| `product_id`       | `string` | Yes      | Unique identifier of the product to order.        |
| `quantity`         | `number` | Yes      | Number of units to order. Must be a positive integer. |
| `shipping_address` | `object` | Yes      | Destination address for the order (see below).    |

**`shipping_address` Object**

| Field     | Type     | Required | Description                        |
|-----------|----------|----------|------------------------------------|
| `street`  | `string` | Yes      | Street address including unit number. |
| `city`    | `string` | Yes      | City name.                         |
| `state`   | `string` | Yes      | State or province code.            |
| `zip`     | `string` | Yes      | Postal or ZIP code.                |
| `country` | `string` | Yes      | ISO 3166-1 alpha-2 country code.   |

#### Example Request

```bash
curl -X POST https://api.example.com/api/v1/orders \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_8v3xK2mN",
    "quantity": 2,
    "shipping_address": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zip": "62701",
      "country": "US"
    }
  }'
```

#### Responses

**201 Created** -- Order successfully placed.

```json
{
  "id": "ord_Qw7pL9xR",
  "product_id": "prod_8v3xK2mN",
  "quantity": 2,
  "status": "confirmed",
  "shipping_address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701",
    "country": "US"
  },
  "total_cents": 5998,
  "created_at": "2026-03-22T10:15:30Z"
}
```

**400 Bad Request** -- The request body failed validation. The response includes details about which fields are invalid.

```json
{
  "error": "validation_error",
  "message": "Request body failed validation.",
  "details": [
    {
      "field": "quantity",
      "issue": "Must be a positive integer."
    }
  ]
}
```

**401 Unauthorized** -- The Bearer token is missing or invalid.

```json
{
  "error": "unauthorized",
  "message": "A valid Bearer token is required."
}
```

**409 Conflict** -- The requested product does not have sufficient stock to fulfill the order.

```json
{
  "error": "out_of_stock",
  "message": "Insufficient stock for product prod_8v3xK2mN. Available: 0."
}
```

---

## Task 2

### Getting Started with datapipe

datapipe is a command-line tool for reading, transforming, and converting CSV data.

#### Prerequisites

- Node.js 16 or later
- npm 8 or later

#### Installation

Install datapipe globally with npm:

```bash
npm install -g datapipe
```

Verify the installation:

```bash
datapipe --version
```

#### Basic Usage

Transform a CSV file to JSON:

```bash
datapipe transform input.csv --format json
```

This reads `input.csv`, applies the default transformation pipeline, and writes JSON to stdout. To save the output to a file, redirect it:

```bash
datapipe transform input.csv --format json > output.json
```

#### Supported Output Formats

| Format   | Flag              | Description                    |
|----------|-------------------|--------------------------------|
| JSON     | `--format json`   | Array of objects, one per row. |
| JSONL    | `--format jsonl`  | One JSON object per line.      |
| TSV      | `--format tsv`    | Tab-separated values.          |
| Markdown | `--format md`     | Markdown table.                |

#### Configuration File

datapipe looks for a configuration file at `~/.datapiperc` on startup. This file uses JSON and lets you set default options so you do not have to repeat them on every invocation.

Create the file:

```bash
touch ~/.datapiperc
```

Example `~/.datapiperc`:

```json
{
  "defaultFormat": "json",
  "delimiter": ",",
  "headers": true,
  "trimWhitespace": true
}
```

| Option           | Type      | Default | Description                              |
|------------------|-----------|---------|------------------------------------------|
| `defaultFormat`  | `string`  | `json`  | Output format when `--format` is omitted. |
| `delimiter`      | `string`  | `","`   | Column delimiter for input CSV.          |
| `headers`        | `boolean` | `true`  | Whether the first row contains headers.   |
| `trimWhitespace` | `boolean` | `false` | Strip leading and trailing whitespace from cell values. |

Command-line flags always override values in `~/.datapiperc`.

#### Common Examples

Select specific columns:

```bash
datapipe transform input.csv --format json --columns name,email
```

Filter rows by a condition:

```bash
datapipe transform input.csv --format json --where "age > 30"
```

Read from stdin via a pipe:

```bash
cat data.csv | datapipe transform - --format jsonl
```

#### Getting Help

List all available commands:

```bash
datapipe --help
```

Get help for a specific command:

```bash
datapipe transform --help
```

---

## Task 3

### `retry(fn, max_attempts=3, backoff_factor=2, exceptions=(Exception,))`

Execute a callable with automatic retry and exponential backoff.

**Module:** Requires `import time` in the containing module.

#### Parameters

| Parameter        | Type                      | Default         | Description |
|------------------|---------------------------|-----------------|-------------|
| `fn`             | `Callable[[], T]`         | (required)      | A zero-argument callable to execute. Wrap functions that need arguments with `functools.partial` or a lambda. |
| `max_attempts`   | `int`                     | `3`             | Total number of attempts before the exception is re-raised. Must be at least 1. |
| `backoff_factor` | `int` or `float`          | `2`             | Base for the exponential delay. The wait before retry *n* is `backoff_factor ** n` seconds (where *n* is the 1-based retry count). |
| `exceptions`     | `tuple[type[Exception]]`  | `(Exception,)`  | Tuple of exception types that trigger a retry. Exceptions not in this tuple propagate immediately. |

#### Returns

The return value of `fn()` on the first successful call.

#### Raises

Re-raises the caught exception if all `max_attempts` are exhausted without success.

#### Backoff Schedule

With the default `backoff_factor=2` and `max_attempts=3`:

| Attempt | Outcome on failure         | Sleep before next attempt |
|---------|----------------------------|---------------------------|
| 1       | Caught, retry scheduled     | 2 s (`2 ** 1`)            |
| 2       | Caught, retry scheduled     | 4 s (`2 ** 2`)            |
| 3       | Exception re-raised         | --                        |

Total maximum wait time: 6 seconds.

#### Examples

Retry an HTTP request up to 3 times, catching only connection errors:

```python
import requests
from requests.exceptions import ConnectionError

response = retry(
    lambda: requests.get("https://api.example.com/data"),
    max_attempts=3,
    exceptions=(ConnectionError,),
)
```

Retry with a custom backoff factor and more attempts:

```python
result = retry(
    lambda: fragile_operation(),
    max_attempts=5,
    backoff_factor=1.5,
)
```

#### Notes

- The callable `fn` must take no arguments. Use `functools.partial` or a lambda to bind arguments.
- The function blocks the calling thread during backoff. For async workloads, consider an async variant.
- There is no jitter applied to the backoff delay. In high-concurrency scenarios, adding random jitter is recommended to avoid thundering-herd problems.

---

## Task 4

### Troubleshooting Guide

#### 1. "Connection refused" on startup

**Symptom:** The application fails to start or logs show `ECONNREFUSED` or `Connection refused`.

**Likely causes and fixes:**

a) **A required service is not running.**
   Check that all dependent services (database, cache, message broker) are running:
   ```bash
   systemctl status postgresql
   systemctl status redis
   ```
   Start any stopped service:
   ```bash
   systemctl start postgresql
   ```

b) **The configured host or port is wrong.**
   Compare the connection settings in your environment file (`.env` or equivalent) against the actual host and port of each service. Common mismatches include `localhost` vs `127.0.0.1` when IPv6 is involved, or a non-default port after a configuration change.

c) **A firewall or security group is blocking the port.**
   Verify that the port is reachable:
   ```bash
   nc -zv localhost 5432
   ```
   If the connection is refused, review firewall rules or cloud security group settings.

d) **The port is already in use by another process.**
   Identify what is occupying the port:
   ```bash
   lsof -i :3000
   ```
   Stop the conflicting process or configure the application to use a different port.

---

#### 2. "Token expired" errors after login

**Symptom:** Users log in successfully but receive `401 Unauthorized` or "Token expired" responses shortly after.

**Likely causes and fixes:**

a) **Server and client clocks are out of sync.**
   JWT validation depends on accurate system time. Check the server clock:
   ```bash
   date -u
   ```
   If the time is skewed, synchronize it with NTP:
   ```bash
   sudo ntpdate pool.ntp.org
   ```

b) **The token lifetime is too short.**
   Review the token expiration setting in your configuration. If access tokens expire in just a few minutes, increase the value to match your use case (for example, `ACCESS_TOKEN_EXPIRE_MINUTES=60`).

c) **The client is not refreshing tokens.**
   Confirm that the client application uses the refresh token endpoint to obtain a new access token before the current one expires. The typical flow is:
   1. Detect a 401 response.
   2. Call the refresh endpoint with the stored refresh token.
   3. Retry the original request with the new access token.

d) **Tokens were issued before a signing secret rotation.**
   If the signing secret or key was recently changed, all previously issued tokens become invalid. Users must log in again. To avoid disruption during planned rotations, support dual-key verification for a transition period.

---

#### 3. Slow page loads (> 5 seconds)

**Symptom:** Pages take more than 5 seconds to render. The browser shows a long wait before content appears.

**Diagnosis and fixes:**

a) **Identify the bottleneck.** Open the browser developer tools (Network tab) and determine whether the delay is in the initial document response (server-side) or in loading subsequent assets (client-side).

b) **Server-side slow response.**
   - Check for slow database queries. Enable query logging and look for queries exceeding 1 second. Add indexes for frequently filtered columns.
   - Look for N+1 query patterns where the application issues one query per item in a list. Use eager loading or batch queries instead.
   - Check whether the server is under memory pressure or high CPU usage:
     ```bash
     top -bn1 | head -20
     ```

c) **Unoptimized assets.**
   - Enable gzip or Brotli compression for text-based assets (HTML, CSS, JavaScript).
   - Serve images in modern formats (WebP or AVIF) at appropriate dimensions.
   - Set `Cache-Control` headers with suitable `max-age` values for static assets.

d) **Missing CDN or reverse proxy caching.**
   If the server delivers static assets directly, place a CDN or caching reverse proxy in front to reduce load and latency for returning visitors.

e) **Third-party scripts blocking rendering.**
   Load analytics and tracking scripts with `async` or `defer` attributes so they do not block the critical rendering path.

---

#### 4. File upload fails for large files

**Symptom:** Uploading files above a certain size results in `413 Payload Too Large`, a timeout, or a connection reset.

**Likely causes and fixes:**

a) **The web server or reverse proxy has a low body size limit.**
   Increase the maximum allowed body size in your server configuration:

   Nginx:
   ```nginx
   client_max_body_size 100M;
   ```

   Apache:
   ```apache
   LimitRequestBody 104857600
   ```

   Restart the server after making changes.

b) **The application framework has its own upload limit.**
   Check the framework-level setting. For example:
   - Express.js: `app.use(express.json({ limit: '100mb' }))`
   - Django: `DATA_UPLOAD_MAX_MEMORY_SIZE = 104857600`

c) **Request timeouts are too short.**
   Large files take longer to transfer. Increase the timeout in both the reverse proxy and the application:

   Nginx:
   ```nginx
   proxy_read_timeout 300s;
   proxy_send_timeout 300s;
   ```

d) **The client is not using multipart/form-data.**
   Ensure file uploads use `multipart/form-data` encoding rather than `application/json` with a base64-encoded body, which inflates the payload by roughly 33%.

e) **Disk space is full on the server.**
   Check available disk space on the upload target partition:
   ```bash
   df -h
   ```
   Free space or expand the volume if the partition is full.

---

## Task 5

### Changelog

## 2.5.0 -- 2026-03-22

### Breaking Changes

- **Minimum Node.js version raised to 18.** Node.js 16 is no longer supported. Update your runtime before upgrading to this release.

### Added

- **WebSocket support for real-time updates.** Clients can now subscribe to live events over a persistent WebSocket connection at `/ws`. See the WebSocket integration guide for details.

### Fixed

- **Memory leak in cache module** ([#1234](https://github.com/example/project/issues/1234)). Long-running instances no longer accumulate unreachable objects when cache entries expire.

### Deprecated

- **`/api/v1/legacy` endpoint.** This endpoint will be removed in version 3.0.0. Migrate to `/api/v2/resource` at your earliest convenience. See the migration guide for field-by-field mapping.
