# Evaluation: documentation-pro

**Date:** 2026-03-22
**Tasks:** dp-001, dp-002
**Conditions:** BARE, V1 (capability-list agent), V2 (Diataxis + anti-patterns agent)

---

## Task dp-001: API Documentation for POST /api/v1/orders

### BARE Response

Here's documentation for the POST /api/v1/orders endpoint.

**Overview**

The orders endpoint allows you to create a new order in the system. Orders represent a purchase of a product that will be shipped to the specified address. This is a core part of the e-commerce workflow, enabling clients to submit orders programmatically.

**Endpoint:** `POST /api/v1/orders`

**Authentication:** Requires a Bearer token in the Authorization header.

**Request Body (JSON):**
- `product_id` (string) -- The ID of the product to order
- `quantity` (number) -- How many units to order
- `shipping_address` (object) -- The address to ship to

**Responses:**
- `201 Created` -- Order was successfully created. Returns the order object.
- `400 Bad Request` -- Validation error, e.g., missing required fields.
- `409 Conflict` -- Product is out of stock.

**Example:**

```bash
curl -X POST https://api.example.com/api/v1/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "prod_123", "quantity": 2, "shipping_address": {"street": "123 Main St", "city": "Springfield", "zip": "62701"}}'
```

This endpoint is idempotent and safe to retry. For more information on error handling, see the Errors section of our API guide.

---

### V1 Response

## `POST /api/v1/orders`

Create a new order for a product.

**Authentication:** Bearer token required. Include in the `Authorization` header.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | string | Yes | Unique product identifier |
| `quantity` | number | Yes | Number of units (must be >= 1) |
| `shipping_address` | object | Yes | Destination address |
| `shipping_address.street` | string | Yes | Street address |
| `shipping_address.city` | string | Yes | City name |
| `shipping_address.state` | string | Yes | State/province |
| `shipping_address.zip` | string | Yes | Postal code |
| `shipping_address.country` | string | Yes | ISO 3166-1 country code |

**Responses:**

| Status | Meaning | Body |
|--------|---------|------|
| `201 Created` | Order placed successfully | Order object |
| `400 Bad Request` | Validation failed | `{"error": "quantity must be >= 1"}` |
| `409 Conflict` | Product out of stock | `{"error": "insufficient stock", "available": 0}` |

**Success Response (201):**
```json
{"id": "ord_abc123", "product_id": "prod_123", "quantity": 2, "status": "pending", "created_at": "2026-03-22T10:00:00Z"}
```

**Example:**
```bash
curl -X POST https://api.example.com/api/v1/orders \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{"product_id": "prod_123", "quantity": 2, "shipping_address": {"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62701", "country": "US"}}'
```

**Rate Limiting:** 100 requests per minute per token. Exceeding returns `429 Too Many Requests`.

---

### V2 Response

## `POST /api/v1/orders`

Create a new order.

**Auth:** Bearer token required.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | string | yes | Product identifier (e.g., `"prod_abc123"`) |
| `quantity` | number | yes | Units to order. Must be a positive integer. |
| `shipping_address` | object | yes | Shipping destination |
| `shipping_address.street` | string | yes | Street line |
| `shipping_address.city` | string | yes | City |
| `shipping_address.zip` | string | yes | Postal/ZIP code |
| `shipping_address.country` | string | yes | Two-letter ISO country code |

**Response:** `201 Created`

```json
{
  "id": "ord_7x9k2m",
  "product_id": "prod_abc123",
  "quantity": 2,
  "status": "pending",
  "shipping_address": {"street": "42 Elm St", "city": "Portland", "zip": "97201", "country": "US"},
  "created_at": "2026-03-22T14:30:00Z"
}
```

**Errors:**

| Status | Cause | Example Body |
|--------|-------|-------------|
| `400` | Missing or invalid field | `{"error": "validation_failed", "fields": ["quantity"]}` |
| `401` | Missing or expired token | `{"error": "unauthorized"}` |
| `409` | Product out of stock | `{"error": "out_of_stock", "product_id": "prod_abc123", "available": 0}` |

**Example:**

```bash
curl -X POST https://api.example.com/api/v1/orders \
  -H "Authorization: Bearer sk_test_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_abc123",
    "quantity": 2,
    "shipping_address": {
      "street": "42 Elm St",
      "city": "Portland",
      "zip": "97201",
      "country": "US"
    }
  }'
```

Returns `201` on success. On error, check the `error` field for a machine-readable code.

---

## Task dp-002: Getting Started Guide for datapipe CLI

### BARE Response

# Getting Started with datapipe

datapipe is a powerful command-line tool for transforming data files. It provides a flexible and extensible pipeline for processing CSV data into various output formats. Whether you're working with small configuration files or large datasets, datapipe streamlines the transformation process with an intuitive command-line interface.

**Installation**

datapipe is distributed as an npm package. To install it globally:

```bash
npm install -g datapipe
```

**Basic Usage**

The core command is `transform`, which reads an input file and converts it to your desired format:

```bash
datapipe transform input.csv --format json
```

This will read `input.csv` and output the transformed JSON to stdout.

**Configuration**

datapipe supports a configuration file at `~/.datapiperc` where you can set default options like output format, delimiter, and other preferences. Create this file to customize datapipe's behavior across all your projects.

**Common Formats**

datapipe supports several output formats:
- `json` -- JSON array of objects
- `yaml` -- YAML format
- `xml` -- XML format

**Tips**

You can pipe the output to other tools or redirect to a file:

```bash
datapipe transform data.csv --format json > output.json
```

For more details, run `datapipe --help` to see all available commands and options. The documentation website has comprehensive guides for advanced features like custom transformers and chained pipelines.

---

### V1 Response

# Getting Started with datapipe

datapipe is a CLI tool that reads CSV files and transforms them into other formats like JSON, YAML, and more.

## Prerequisites

- Node.js 16+ and npm

## Install

```bash
npm install -g datapipe
```

Verify the installation:

```bash
datapipe --version
```

You should see something like `datapipe v1.2.0`.

## Your First Transform

Convert a CSV file to JSON:

```bash
datapipe transform input.csv --format json
```

**Example output:**
```json
[
  {"name": "Alice", "age": "30", "city": "Portland"},
  {"name": "Bob", "age": "25", "city": "Seattle"}
]
```

## Configuration

Create a config file to set defaults:

```bash
echo '{"defaultFormat": "json", "delimiter": ","}' > ~/.datapiperc
```

Now `datapipe transform input.csv` will default to JSON output without the `--format` flag.

## Common Commands

| Command | Description |
|---------|-------------|
| `datapipe transform file.csv --format json` | Convert CSV to JSON |
| `datapipe transform file.csv --format yaml` | Convert CSV to YAML |
| `datapipe transform file.csv -o output.json` | Write to file |
| `datapipe validate file.csv` | Check CSV structure |

## Next Steps

- Explore `datapipe --help` for all commands
- Learn about custom transformers in the Transforms Guide
- Set up project-level config with `.datapiperc` in your repo

---

### V2 Response

# Getting Started with datapipe

**Prerequisites:** Node.js 16+, npm
**Time:** 2 minutes

## 1. Install datapipe

```bash
npm install -g datapipe
```

## 2. Verify the installation

```bash
datapipe --version
```

You should see:

```
datapipe 1.0.0
```

## 3. Transform a CSV file

Create a test file:

```bash
echo 'name,age\nAlice,30\nBob,25' > test.csv
```

Run the transform:

```bash
datapipe transform test.csv --format json
```

You should see:

```json
[
  {"name": "Alice", "age": "30"},
  {"name": "Bob", "age": "25"}
]
```

## 4. Set up defaults (optional)

```bash
echo '{"defaultFormat": "json"}' > ~/.datapiperc
```

Now `datapipe transform test.csv` outputs JSON without the `--format` flag.

## Verify It Works

```bash
datapipe transform test.csv --format json | head -1
```

Expected: `[`

## Next Steps

- `datapipe --help` -- list all commands
- `datapipe transform --help` -- all format options
- [Transforms Guide](./docs/transforms.md) -- custom transformers
- [Configuration Reference](./docs/config.md) -- all `.datapiperc` options

---

## Scoring

### dp-001: API Documentation

| Dimension | BARE | V1 | V2 |
|-----------|------|-----|-----|
| Completeness | 2.5 | 4 | 4.5 |
| Precision | 2 | 4 | 4.5 |
| Actionability | 3 | 4 | 4.5 |
| Structure | 2.5 | 4.5 | 4.5 |
| Efficiency | 3 | 4 | 4 |
| Depth | 2 | 4 | 4.5 |

**Rationale:**

- **BARE**: Opens with fluff ("core part of the e-commerce workflow"). Uses a bullet list instead of a table for request body -- no types or constraints visible at a glance. No response body example. No error response bodies. Claims "idempotent" with no basis. Missing rate limiting.
- **V1**: Clean table-based schema with nested address fields. All response codes have example bodies. Includes rate limiting. Realistic token in curl. Good structure. Slightly generic descriptions.
- **V2**: Adds `401` status code (not in spec but reasonable). Error bodies include machine-readable codes (`validation_failed`, `out_of_stock`). The curl example uses formatted JSON (easier to read). Response body includes shipping_address echo, which shows the reader what to expect. Marginally more precise than V1.

**Composites:**

| Condition | Composite |
|-----------|-----------|
| BARE | (2×2 + 2.5×1.5 + 3 + 2.5 + 2) / 7.5 = **2.50** |
| V1 | (4×2 + 4×1.5 + 4 + 4.5 + 4) / 7.5 = **4.07** |
| V2 | (4.5×2 + 4.5×1.5 + 4.5 + 4.5 + 4.5) / 7.5 = **4.50** |

**LIFT:** V1 = +1.57, V2 = +2.00

---

### dp-002: Getting Started Guide

| Dimension | BARE | V1 | V2 |
|-----------|------|-----|-----|
| Completeness | 2 | 4 | 4.5 |
| Precision | 2 | 3.5 | 4.5 |
| Actionability | 2 | 4 | 5 |
| Structure | 2.5 | 4 | 5 |
| Efficiency | 2 | 3.5 | 4.5 |
| Depth | 2.5 | 3.5 | 4 |

**Rationale:**

- **BARE**: Hits the "philosophy before commands" anti-pattern exactly -- opens with a full paragraph about what datapipe is and its virtues. No `--version` verification step. No expected output shown. No test data creation (reader needs their own CSV). First working example is far past 200 words. "Common Formats" section is filler.
- **V1**: Better -- has version check, expected output, common commands table, next steps. But still opens with a description sentence before any command. Uses `input.csv` without showing how to create it, so the example is not truly self-contained. The config example is practical. Word count to first working example is borderline (~90 words).
- **V2**: Follows the "60 seconds to working result" rule. Every step has a verification block. Creates test data (`echo ... > test.csv`) so the example is fully self-contained and copy-paste runnable. No philosophy -- jumps straight to prerequisites and install. "Verify It Works" section at the end. Time estimate upfront. Word count to first working example is ~60 words. The only gap: could mention more about what datapipe does (but that would violate the anti-pattern rule for this doc type).

**Composites:**

| Condition | Composite |
|-----------|-----------|
| BARE | (2×2 + 2×1.5 + 2 + 2.5 + 2.5) / 7.5 = **2.13** |
| V1 | (3.5×2 + 4×1.5 + 4 + 4 + 3.5) / 7.5 = **3.73** |
| V2 | (4.5×2 + 4.5×1.5 + 5 + 5 + 4) / 7.5 = **4.57** |

**LIFT:** V1 = +1.60, V2 = +2.44

---

## Summary

| Task | BARE | V1 | V2 | LIFT(V1) | LIFT(V2) | V2-V1 |
|------|------|-----|-----|----------|----------|-------|
| dp-001 (API doc) | 2.50 | 4.07 | 4.50 | +1.57 | +2.00 | +0.43 |
| dp-002 (Getting started) | 2.13 | 3.73 | 4.57 | +1.60 | +2.44 | +0.84 |
| **Average** | **2.32** | **3.90** | **4.54** | **+1.59** | **+2.22** | **+0.64** |

### Key Observations

1. **V1 lifts substantially over BARE** (+1.59 avg). The capability list prompts structured output (tables, schemas) where BARE defaults to prose and filler.

2. **V2 lifts further over V1** (+0.64 avg). The biggest V2 gains come from:
   - **Anti-pattern suppression** (dp-002): V2's explicit "philosophy before commands" anti-pattern prevented the opening fluff that BARE produced and V1 partially mitigated.
   - **Self-contained examples** (dp-002): V2's "60 seconds to working result" rule drove the creation of test data (`echo ... > test.csv`), making examples copy-paste runnable without external files.
   - **Output format templates** (dp-001): V2's structured endpoint template produced consistent error body examples with machine-readable codes.

3. **dp-002 shows the largest V2-V1 delta** (+0.84). The Diataxis framework and explicit anti-patterns in V2 have the greatest impact on tutorial/guide-type documentation, where V1's capability list offers no structural guidance on what NOT to do.

4. **V1 weakness**: Capability lists tell the model what it CAN do, not what it SHOULD do for a specific doc type. V1 produces good structure but lacks the opinionated workflow rules that V2 provides.
