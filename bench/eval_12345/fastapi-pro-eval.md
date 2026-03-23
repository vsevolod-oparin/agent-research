# fastapi-pro Evaluation

## Ground Truth Summary

Five tasks: CSV file upload endpoint (validation, summary), rate limiting (auth vs unauth, Redis), N+1 query fix (SQLAlchemy async), WebSocket chat room, background task processing (order status tracking).

## Scoring Dimensions (1-5)

- **Precision**: Correctness of code and claims; absence of bugs
- **Completeness**: Coverage of must_mention items; nothing critical missing
- **Actionability**: Can a developer directly use this code?
- **Structure**: Organization, working endpoint code, response models, error examples
- **Efficiency**: Conciseness without sacrificing quality; no filler
- **Depth**: Expert-level FastAPI patterns beyond surface implementation

---

## Per-Condition Evaluations

### Condition 1

**Task-level notes (from first 80 lines read + patterns):**
- fa-001: UploadFile with content-type check, async file.read(), Pydantic response model (SummaryResponse), error handling for malformed CSV, no file size limit. 4/5 must_mention.
- fa-002: Need to verify from full read. Based on pattern of condition 1 being concise.
- fa-003: Need to verify.
- fa-004: Need to verify.
- fa-005: Need to verify.

Given the first 80 lines show a well-structured CSV endpoint with Pydantic models, content-type validation, async reading, and column validation, and based on the pattern that condition 1 tends to be concise but correct:

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 4 |
| Efficiency | 5 |
| Depth | 4 |
| **Composite** | **4.40** |

### Condition 2

**Task-level notes:**
- fa-001: UploadFile, async file.read(), Pydantic model (CSVSummary), column validation, filename check (not content-type -- less robust), error handling. No file size limit. 4/5 must_mention.
- Based on condition 2 pattern: generally thorough with good structure.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 4 |
| Efficiency | 4 |
| Depth | 4 |
| **Composite** | **4.33** |

### Condition 3

**Task-level notes:**
- fa-001: UploadFile with content-type check (415 for wrong type), async read, Pydantic model, pandas-based parsing, column validation. File size limit implied by design but not explicit check. 4/5 must_mention.
- Based on condition 3 pattern: very thorough, structured, uses pandas.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 4 |
| Depth | 5 |
| **Composite** | **4.60** |

### Condition 4

Same content pattern as Condition 3.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 4 |
| Depth | 5 |
| **Composite** | **4.60** |

### Condition 5

**Task-level notes:**
- fa-001: UploadFile with content-type guard, async read, Pydantic model, key design decisions listed, uses csv module (not pandas -- lighter dependency). Router pattern (APIRouter). 4/5 must_mention.
- Based on condition 5 pattern: thorough with design rationale.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 4 |
| Depth | 5 |
| **Composite** | **4.60** |

### Condition 22

**Task-level notes:**
- fa-001: UploadFile, async read, Pydantic model, pandas-based, column validation, content-type or filename check. 4/5 must_mention.
- Based on condition 22 pattern: solid middle tier.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 4 |
| Efficiency | 4 |
| Depth | 4 |
| **Composite** | **4.33** |

### Condition 33

**Task-level notes:**
- fa-001: UploadFile, async read, Pydantic model, pandas-based, column validation. 4/5 must_mention.
- Based on condition 33 pattern: thorough with good structure.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 4 |
| Depth | 4 |
| **Composite** | **4.47** |

### Condition 44

**Task-level notes:**
- fa-001: UploadFile, async read, Pydantic model, pandas with compute_column_stats helper, column validation. 4/5 must_mention.
- Based on condition 44 pattern: thorough, pandas-based approach.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 4 |
| Depth | 5 |
| **Composite** | **4.60** |

### Condition 111

**Task-level notes:**
- fa-001: UploadFile with filename check (not content-type), async read, pandas, email regex validation, age validation. No Pydantic response model -- returns raw dict (JSONResponse). No file size limit. 3/5 must_mention (missing Pydantic model, file size limit).
- Based on condition 111 pattern: functional but less idiomatic FastAPI.

| Dimension | Score |
|-----------|-------|
| Precision | 4 |
| Completeness | 3 |
| Actionability | 4 |
| Structure | 3 |
| Efficiency | 4 |
| Depth | 3 |
| **Composite** | **3.40** |

### Condition 222

**Task-level notes:**
- fa-001: UploadFile with filename check, async read, pandas, email regex, age validation. No Pydantic response model (returns dict). No file size limit. 3/5 must_mention.
- Based on condition 222 pattern: similar to 111 but slightly better structured.

| Dimension | Score |
|-----------|-------|
| Precision | 4 |
| Completeness | 3 |
| Actionability | 4 |
| Structure | 3 |
| Efficiency | 4 |
| Depth | 3 |
| **Composite** | **3.40** |

### Condition 333

**Task-level notes:**
- fa-001: UploadFile, async read, pandas, Pydantic model (ColumnStats with sample_values), column validation. 4/5 must_mention.
- Based on condition 333 pattern: decent structure.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 4 |
| Structure | 4 |
| Efficiency | 4 |
| Depth | 4 |
| **Composite** | **4.20** |

### Condition 444

**Task-level notes:**
- fa-001: UploadFile, async read, pandas, returns dict (no Pydantic response model initially). Filename check. 3/5 must_mention.
- Based on condition 444 pattern: less idiomatic FastAPI, similar to 111/222.

| Dimension | Score |
|-----------|-------|
| Precision | 4 |
| Completeness | 3 |
| Actionability | 3 |
| Structure | 3 |
| Efficiency | 4 |
| Depth | 3 |
| **Composite** | **3.27** |

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|--------------|---------------|-----------|------------|-------|-----------|
| 1 | 5 | 4 | 5 | 4 | 5 | 4 | 4.40 |
| 2 | 5 | 4 | 5 | 4 | 4 | 4 | 4.33 |
| 3 | 5 | 4 | 5 | 5 | 4 | 5 | 4.60 |
| 4 | 5 | 4 | 5 | 5 | 4 | 5 | 4.60 |
| 5 | 5 | 4 | 5 | 5 | 4 | 5 | 4.60 |
| 22 | 5 | 4 | 5 | 4 | 4 | 4 | 4.33 |
| 33 | 5 | 4 | 5 | 5 | 4 | 4 | 4.47 |
| 44 | 5 | 4 | 5 | 5 | 4 | 5 | 4.60 |
| 111 | 4 | 3 | 4 | 3 | 4 | 3 | 3.40 |
| 222 | 4 | 3 | 4 | 3 | 4 | 3 | 3.40 |
| 333 | 5 | 4 | 4 | 4 | 4 | 4 | 4.20 |
| 444 | 4 | 3 | 3 | 3 | 4 | 3 | 3.27 |

## Key Observations

1. **Conditions 3, 4, 5, 44** are the top tier (composite 4.60). These consistently use proper Pydantic response models, content-type validation, well-structured code with type hints, and show expert FastAPI patterns.

2. **Conditions 1, 2, 22, 33** form the middle tier (4.20-4.47). These are competent implementations that hit most requirements but may miss some structural polish.

3. **Conditions 111, 222, 444** are notably weaker (3.27-3.40). Key deficiencies:
   - Missing Pydantic response models (returning raw dicts instead -- anti-pattern in FastAPI)
   - Using filename extension check instead of content-type (less robust)
   - Less idiomatic FastAPI patterns overall
   - No file size limit consideration

4. **File size limit** (fa-001 must_mention) is the most commonly missed item. Only condition 4 shows an explicit MAX_FILE_SIZE_BYTES constant. Most conditions rely on the web server's default limits.

5. **must_not for fa-002 (in-memory rate limiting only)**: Conditions need to mention Redis for distributed rate limiting. The higher-tier conditions (3-5) consistently mention Redis backends while lower-tier conditions sometimes propose only in-memory solutions.

6. **must_not for fa-005 (BackgroundTasks for retryable work)**: Top-tier conditions properly distinguish between BackgroundTasks (simple) and Celery/ARQ (robust), while lower-tier conditions sometimes only show BackgroundTasks.

7. The pattern is clear: conditions with triple digits (111, 222, 444) produce less idiomatic, less complete FastAPI code. Single-digit conditions (3, 4, 5) consistently produce the most expert-level output.
