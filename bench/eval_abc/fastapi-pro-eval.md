# fastapi-pro Evaluation (A/B/C)

## Task 1: fa-001

**Ground Truth Summary:** Must mention: UploadFile with content-type check, async file reading, Pydantic response model, error handling for malformed CSV, file size limit. Structure: complete endpoint code, Pydantic model, error response examples.

### Condition A (bare)
- must_mention coverage: 4/5 -- UploadFile with filename check (yes, not content-type), async file.read() (yes), Pydantic model CSVSummary (yes), error handling for malformed CSV (yes), file size limit (no explicit limit)
- must_not violations: None
- Completeness: 4 -- Missing explicit file size limit, uses filename check not content-type
- Precision: 5 -- Code is correct and runnable
- Actionability: 5 -- Complete endpoint with tests
- Structure: 5 -- Full working code, Pydantic models, tests
- Efficiency: 4 -- Includes tests which is good but adds length
- Depth: 4 -- Age stats computation, sample values, but no size limit
- **Composite: 4.47**

### Condition B (v1 agents)
- must_mention coverage: 4/5 -- UploadFile (yes), async read (yes), Pydantic model (yes), error handling (yes), file size limit (no explicit limit)
- must_not violations: None
- Completeness: 4 -- Missing explicit file size limit
- Precision: 5 -- Code correct
- Actionability: 5 -- Working code with curl example
- Structure: 4 -- Complete but less detailed than C
- Efficiency: 4 -- Good density
- Depth: 4 -- Numeric stats, good error handling
- **Composite: 4.33**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- UploadFile with content-type check (yes), async read (yes), Pydantic CSVSummary (yes), error handling (yes), file size limit MAX_FILE_SIZE=10MB (yes)
- must_not violations: None
- Completeness: 5 -- All items covered, includes row-level validation
- Precision: 5 -- Code correct, content-type checking is thorough
- Actionability: 5 -- Complete code with example response JSON
- Structure: 5 -- Full code with design decisions explanation
- Efficiency: 5 -- Well-organized with key decisions section
- Depth: 5 -- Email validation, age range validation, median stats, validation_errors list
- **Composite: 5.00**

---

## Task 2: fa-002

**Ground Truth Summary:** Must mention: slowapi or custom middleware, different limits for auth vs unauth, Retry-After header in 429, Redis backend for distributed, dependency injection pattern. Must not: in-memory rate limiting only.

### Condition A (bare)
- must_mention coverage: 4/5 -- Custom middleware (yes), different limits auth/unauth (yes), Retry-After header (yes), Redis backend (yes, commented-out code), dependency injection (yes, both middleware and dependency approaches)
- must_not violations: PARTIAL -- Primary implementation is in-memory, but Redis code is provided as commented-out alternative with clear "for production" note
- Completeness: 4 -- All features present, Redis is secondary
- Precision: 4 -- In-memory as primary is flagged as non-production by ground truth
- Actionability: 5 -- Complete working code with both approaches
- Structure: 4 -- Good but middleware + dependency approaches could be clearer
- Efficiency: 4 -- Shows two approaches which adds complexity
- Depth: 4 -- Sliding window, route-level override, but Redis as afterthought
- **Composite: 4.13**

### Condition B (v1 agents)
- must_mention coverage: 4/5 -- Custom dependency (yes), different limits (yes), Retry-After (yes), Redis (yes, mentioned "for production"), dependency injection (yes)
- must_not violations: PARTIAL -- Primary is in-memory, Redis mentioned for production
- Completeness: 4 -- Same coverage, Redis noted for production
- Precision: 4 -- Same issue with in-memory primary
- Actionability: 5 -- Clean dependency pattern, X-Forwarded-For handling
- Structure: 5 -- Clean Annotated[None, Depends()] pattern
- Efficiency: 5 -- Focused and clean
- Depth: 4 -- Sliding window explanation, key design decisions section
- **Composite: 4.33**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- Custom dependency (yes), different limits (yes), Retry-After header (yes), Redis backend (yes, complete Redis implementation), dependency injection (yes)
- must_not violations: None -- Explicitly provides complete Redis-backed implementation
- Completeness: 5 -- In-memory + complete Redis implementation with Lua-like atomicity
- Precision: 5 -- Redis sorted set approach is production-grade
- Actionability: 5 -- Both implementations complete and runnable
- Structure: 5 -- Clean separation: in-memory -> Redis -> design decisions
- Efficiency: 4 -- Two full implementations but both valuable
- Depth: 5 -- Redis pipeline atomicity, RFC 6585 reference, X-RateLimit headers, sliding window vs fixed window
- **Composite: 4.87**

---

## Task 3: fa-003

**Ground Truth Summary:** Must mention: selectinload or joinedload, AsyncSession, SQLAlchemy 2.0 syntax (select().options()), before/after query count. Structure: problematic code, fixed code, explanation.

### Condition A (bare)
- must_mention coverage: 4/4 -- selectinload (yes), AsyncSession (yes), select().options() (yes), before/after count (yes, 101 -> 2)
- must_not violations: None
- Completeness: 5 -- Three loading strategies, lazy="raise" tip, full setup code
- Precision: 5 -- SQLAlchemy 2.0 syntax correct
- Actionability: 5 -- Complete working code with models and endpoint
- Structure: 5 -- Broken code -> Fix 1/2/3 -> comparison table -> bonus tip
- Efficiency: 4 -- Three approaches is thorough
- Depth: 5 -- lazy="raise" for prevention, engine config, lifespan manager
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- selectinload (yes), AsyncSession (yes), select().options() (yes), before/after (yes, N+1 -> 2)
- must_not violations: None
- Completeness: 5 -- selectinload + joinedload + subqueryload, lazy="raise"
- Precision: 5 -- Correct syntax
- Actionability: 5 -- Working code with Pydantic schemas, Depends pattern
- Structure: 5 -- Problem -> fix -> comparison table
- Efficiency: 5 -- Well-balanced
- Depth: 5 -- Pydantic model_config from_attributes, nested eager loading
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- selectinload (yes), AsyncSession (yes), select().options() (yes), before/after (yes, 101 -> 2)
- must_not violations: None
- Completeness: 5 -- All three strategies, lazy="raise", Pydantic schemas, nested eager loading
- Precision: 5 -- Correct SQLAlchemy 2.0 syntax
- Actionability: 5 -- Complete runnable code
- Structure: 5 -- Ranked approaches, comparison table
- Efficiency: 5 -- Focused and well-organized
- Depth: 5 -- Nested eager loading, lazy="raise" rationale, MissingGreenlet mention
- **Composite: 5.00**

---

## Task 4: fa-004

**Ground Truth Summary:** Must mention: WebSocket route with connection manager, connect/disconnect handling, broadcast to all in room, JSON message format, error handling for dropped connections. Structure: ConnectionManager class, WebSocket endpoint, client-side example.

### Condition A (bare)
- must_mention coverage: 5/5 -- ConnectionManager (yes), connect/disconnect (yes), broadcast (yes), JSON format (yes), error handling (yes, stale connection cleanup)
- must_not violations: None
- Completeness: 5 -- Full ConnectionManager with lock, join/leave messages, REST rooms endpoint, tests
- Precision: 5 -- Code correct, async lock usage proper
- Actionability: 5 -- Complete with tests and JS client example
- Structure: 5 -- ConnectionManager -> endpoint -> client -> tests
- Efficiency: 4 -- Tests add length but valuable
- Depth: 5 -- asyncio.Lock for concurrency, stale cleanup, Pydantic ChatMessage model
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- ConnectionManager (yes), connect/disconnect (yes), broadcast (yes), JSON (yes), error handling (yes, return_exceptions=True)
- must_not violations: None
- Completeness: 5 -- Full implementation with design notes
- Precision: 5 -- Code correct
- Actionability: 5 -- JS client example, production upgrade notes
- Structure: 5 -- ConnectionManager -> endpoint -> client -> design notes
- Efficiency: 5 -- Well-balanced, concise design notes
- Depth: 4 -- Good but less concurrent safety than A (no explicit lock)
- **Composite: 4.73**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- ConnectionManager (yes), connect/disconnect (yes), broadcast (yes), JSON (yes), error handling (yes, broken connection cleanup)
- must_not violations: None
- Completeness: 5 -- Full implementation with message types enum, duplicate username rejection, message validation
- Precision: 5 -- Code correct, thorough edge case handling
- Actionability: 5 -- JS client example, REST room members endpoint
- Structure: 5 -- Message types -> ConnectionManager -> endpoint -> REST -> client
- Efficiency: 4 -- More code due to extra features but all valuable
- Depth: 5 -- asyncio.Lock, duplicate username rejection, message size limit, connection ID UUID, lock not held during I/O
- **Composite: 4.87**

---

## Task 5: fa-005

**Ground Truth Summary:** Must mention: BackgroundTasks for simple OR Celery/ARQ for robust, status tracking (pending/processing/completed/failed), database record for status, idempotency considerations, worker crash handling. Must not: use BackgroundTasks for anything needing retry/persistence. Structure: POST 202, GET status, background worker.

### Condition A (bare)
- must_mention coverage: 4/5 -- BackgroundTasks + Celery (yes), status tracking (yes), in-memory store with DB note (partial -- in-memory not DB), idempotency (not mentioned), worker crash (yes, Celery upgrade for durability)
- must_not violations: PARTIAL -- Uses BackgroundTasks for the main implementation but notes Celery for production
- Completeness: 4 -- Missing idempotency and explicit DB record
- Precision: 4 -- In-memory store is noted as demo-only
- Actionability: 5 -- Complete working code with Celery upgrade path
- Structure: 5 -- POST 202 -> GET status -> background worker -> Celery -> tests
- Efficiency: 4 -- Includes tests and Celery upgrade
- Depth: 4 -- Celery retry with exponential backoff, but missing idempotency
- **Composite: 4.27**

### Condition B (v1 agents)
- must_mention coverage: 4/5 -- asyncio.create_task + Celery/Dramatiq/arq (yes), status tracking (yes), in-memory with prod note (partial), idempotency (not mentioned), worker crash (yes, discussed in production notes)
- must_not violations: PARTIAL -- Uses asyncio.create_task with note about task queue for production
- Completeness: 4 -- Missing idempotency, uses asyncio.create_task instead of BackgroundTasks
- Precision: 4 -- asyncio.create_task rationale given but debatable
- Actionability: 5 -- Complete code with curl workflow
- Structure: 5 -- Clean POST/GET endpoints + production notes
- Efficiency: 5 -- Well-balanced
- Depth: 4 -- Explains create_task vs BackgroundTasks reasoning, mentions SSE for push updates
- **Composite: 4.27**

### Condition C (v2 agents)
- must_mention coverage: 4/5 -- BackgroundTasks + Celery (yes), status tracking with all 4 states (yes), in-memory store with production note (partial), idempotency (not explicitly mentioned), worker crash (yes, Celery upgrade for persistence/retries)
- must_not violations: PARTIAL -- Uses BackgroundTasks for demo but clearly documents Celery for production
- Completeness: 4 -- Missing idempotency consideration, explicit about BackgroundTasks limitations
- Precision: 5 -- Clear distinction between demo and production approaches
- Actionability: 5 -- Complete code with Celery task configuration, processing duration tracking
- Structure: 5 -- POST 202 -> GET status -> background processing -> Celery upgrade -> design decisions
- Efficiency: 5 -- Well-organized with key design decisions section
- Depth: 5 -- Processing duration tracking, RFC 7231 reference for 202, explicit BackgroundTasks limitations, Celery max_retries + default_retry_delay
- **Composite: 4.60**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| fa-001 | 4.47 | 4.33 | 5.00 |
| fa-002 | 4.13 | 4.33 | 4.87 |
| fa-003 | 4.87 | 5.00 | 5.00 |
| fa-004 | 4.87 | 4.73 | 4.87 |
| fa-005 | 4.27 | 4.27 | 4.60 |
| **Mean** | **4.52** | **4.53** | **4.87** |
| B LIFT (vs A) | -- | +0.01 | -- |
| C LIFT (vs A) | -- | -- | +0.35 |
| C vs B | -- | -- | +0.34 |
