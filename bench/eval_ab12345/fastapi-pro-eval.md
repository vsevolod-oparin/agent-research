# fastapi-pro Evaluation

## Ground Truth Summary

Five tasks testing FastAPI expertise: (1) CSV upload with UploadFile, async reading, Pydantic response, error handling for malformed CSV, file size limit; (2) Rate limiting with slowapi/middleware, auth vs unauth limits, Retry-After header, Redis backend, dependency injection; must_not: in-memory only; (3) N+1 fix with selectinload/joinedload, AsyncSession, SQLAlchemy 2.0 select().options(), before/after query count; (4) WebSocket chat with ConnectionManager, connect/disconnect handling, broadcast, JSON format, error handling for dropped connections; (5) Background tasks with BackgroundTasks for simple OR Celery/ARQ for robust, status tracking, DB record, idempotency, worker crash handling; must_not: BackgroundTasks for retry/persistence needs.

---

## Per-Task Analysis

### FA-001: CSV File Upload

**must_mention:** UploadFile with content-type check, async file reading, Pydantic response model, error handling for malformed CSV, file size limit

| Cond | UploadFile | Async read | Pydantic model | Error handling | File size limit | Notes |
|------|-----------|-----------|---------------|---------------|----------------|-------|
| a1 | Yes | Yes | Yes | Yes (encoding, columns) | No | Clean, uses csv module |
| a2 | Yes | Yes | Yes (min/max/mean) | Yes (encoding, empty) | No | Good stats with numeric detection |
| a3 | Yes | Yes | Yes | Yes | No | Clean csv module approach |
| a4 | Yes (content-type check) | Yes | Yes | Yes (BOM handling) | Yes (10MB) | Best: content-type, BOM, size limit |
| a5 | Yes | Yes | Yes | Yes (BOM, headers) | Yes (10MB) | Comprehensive validation |
| b1 | Yes | Yes | No (uses pandas, dict response) | Yes (pandas errors) | No | Uses pandas - heavier dependency |
| b2 | Yes | Yes | Yes (Pydantic models) | Yes (pandas errors) | No | Uses pandas, good Pydantic |
| b3 | Yes | Yes | Yes (ColumnStats) | Yes | No | Uses pandas |
| b4 | Yes | Yes | Yes | Yes (pandas errors) | Yes (10MB in b4-alt) | Uses pandas, test included |
| b5 | Yes | Yes | Yes | Yes | No | Uses pandas |

### FA-002: Rate Limiting

**must_mention:** slowapi or custom middleware, different auth vs unauth limits, Retry-After header, Redis backend, dependency injection
**must_not:** in-memory only (doesn't work with multiple workers)

| Cond | slowapi/middleware | Auth vs unauth | Retry-After | Redis | DI pattern | In-memory only? |
|------|-------------------|---------------|------------|-------|-----------|----------------|
| a1 | Both (custom + slowapi) | Yes (100/20) | Yes | Mentioned | Yes (Depends) | No (mentions Redis) |
| a2 | Both (custom + slowapi) | Yes (100/20) | Yes | Yes (code) | Yes | No (Redis code shown) |
| a3 | Both (custom + slowapi) | Yes (100/20) | Yes | Mentioned | Yes | No (mentions Redis) |
| a4 | slowapi primary | Yes (100/20) | Yes | Yes (storage_uri) | Yes | No (Redis storage) |
| a5 | slowapi primary | Yes (dynamic_limit) | Yes | Yes (mentioned) | Yes | No |
| b1 | Both (custom + slowapi) | Yes (100/20) | Yes | Yes (redis.asyncio) | Yes | No (Redis shown) |
| b2 | Both (custom + slowapi) | Yes (100/20) | Yes | Mentioned | Yes | No (mentions Redis) |
| b3 | Custom middleware only | Yes (100/20) | Yes | No | Partial | Partially (custom is in-memory, slowapi mention is brief) |
| b4 | Both (custom + slowapi) | Yes (100/20) | Yes | Yes | Yes | No (Redis) |
| b5 | Custom + slowapi | Yes (100/20) | Yes | Yes (Redis) | Yes | No |

### FA-003: N+1 Query Fix

**must_mention:** selectinload or joinedload, AsyncSession, SQLAlchemy 2.0 select().options(), before/after query count
**structure:** problematic code, fixed code, explain which strategy and why

| Cond | selectinload | AsyncSession | SA 2.0 syntax | Before/after | Why selectin | Notes |
|------|-------------|-------------|--------------|------------|-------------|-------|
| a1 | Yes | Yes | Yes | Yes (bad/good) | Yes (JOIN duplication) | Clean explanation |
| a2 | Yes | Yes | Yes | Yes (bad/good) | Yes (cartesian product) | Full model definitions |
| a3 | Yes | Yes | Yes | Yes (bad/good) | Yes (join multiplication) | Includes FastAPI endpoint |
| a4 | Yes | Yes | Yes | Yes (bad/good) | Yes (cartesian product) | Full models + router |
| a5 | Yes | Yes | Yes | Yes (bad/good) | Yes (de-duplication cost) | lazy="noload" mentioned |
| b1 | Yes | Yes | Yes | Yes | Yes (partially) | Also shows joinedload and explicit JOIN |
| b2 | Yes | Yes | Yes | Yes | Yes (brief) | Shows 4 solutions including Bundle |
| b3 | Yes | Yes | Yes | Yes | Yes (mentioned) | Includes joinedload and explicit JOIN alternatives |
| b4 | Yes | Yes | Yes | Yes | Yes (brief) | Multiple solutions, Pydantic response model |
| b5 | Yes | Yes | Yes | Yes | Yes | Includes array_agg alternative |

### FA-004: WebSocket Chat Room

**must_mention:** WebSocket route with ConnectionManager, connect/disconnect handling, broadcast, JSON message format, error handling for dropped connections
**structure:** ConnectionManager class, WebSocket endpoint, client-side example

| Cond | ConnManager | Connect/disconnect | Broadcast | JSON format | Drop handling | Client example |
|------|-----------|-------------------|-----------|------------|-------------|---------------|
| a1 | Yes (inline) | Yes | Yes | Yes | Yes (try/except in broadcast) | Yes (JS) |
| a2 | Yes (class) | Yes | Yes | Yes | Yes (dead set) | Yes (JS) |
| a3 | Yes (class) | Yes | Yes | Yes | Yes (dead list) | Yes (JS) |
| a4 | Yes (class) | Yes | Yes | Yes | Yes (disconnected set) | Yes (JS) |
| a5 | Yes (class) | Yes | Yes | Yes | Yes (dead set) | Yes (JS) |
| b1 | Yes (class) | Yes | Yes | Yes | Yes (to_remove) | Yes (HTML+JS demo) |
| b2 | Yes (class) | Yes | Yes | Yes | Yes (dead connections) | Yes (JS) |
| b3 | Yes (class) | Yes | Yes | Yes | Yes | Yes (JS + typing indicator) |
| b4 | Yes (class) | Yes | Yes | Yes | Yes | Yes (JS) |
| b5 | Yes (class) | Yes (auth check) | Yes | Yes (Pydantic validation) | Yes | Yes (HTML+JS, auth) |

### FA-005: Background Task Processing

**must_mention:** BackgroundTasks for simple OR Celery/ARQ for robust, status tracking (pending->processing->completed->failed), DB record, idempotency, worker crash handling
**must_not:** use BackgroundTasks for anything needing retry/persistence

| Cond | BG Tasks | Celery/ARQ mention | Status tracking | DB record | Idempotency | Crash handling | BG warning |
|------|---------|-------------------|----------------|----------|------------|---------------|-----------|
| a1 | Yes | Yes (Celery, ARQ) | Yes (4 states) | No (in-memory) | No | No | Yes (production note) |
| a2 | Yes | Yes (Celery, ARQ) | Yes (4 states) | No (in-memory) | No | No | Yes (production note) |
| a3 | Yes | Yes (Celery, ARQ) | Yes (4 states) | No (in-memory) | No | No | Yes (caveat note) |
| a4 | Yes | Yes (Celery, ARQ) | Yes (4 states) | Yes (DB session) | No | No | Yes (important caveat) |
| a5 | Yes | Yes (Celery) | Yes (4 states) | No (in-memory) | No | No | Yes (production note) |
| b1 | Yes | Yes (Celery) | Yes (4 states) | No (in-memory) | No | No | No explicit warning |
| b2 | Yes | Yes (Celery) | Yes (4 states) | No (in-memory) | No | No | Partial |
| b3 | Yes | Yes (Celery) | Yes (4 states) | No (in-memory) | No | No | Yes (production recs) |
| b4 | Yes | Yes (Celery) | Yes (4 states) | Yes (DB model) | No | No | Yes (lifespan+Celery) |
| b5 | Yes | Yes (Celery) | Yes (4 states) | Yes (DB model) | No | No | Yes (Celery alt) |

No condition explicitly addresses idempotency or worker crash handling -- these are universally missed.

---

## Scoring

### a1
- **P: 4.0** - Accurate code, correct patterns
- **C: 3.5** - Missing file size limit T1, no idempotency/crash T5, no DB in T5
- **A: 4.5** - Working code throughout, production notes
- **S: 4.0** - Clean sections
- **E: 4.5** - Very concise, no fluff
- **D: 3.5** - Redis pub/sub mention for T4, but shallow on T5
- **Composite: (8+5.25+4.5+4+4.5+3.5)/7.5 = 3.97**

### a2
- **P: 4.5** - Very accurate, proper Redis rate limiting code
- **C: 4.0** - Redis code shown, good model definitions, datetime tracking
- **A: 4.5** - Working code with webhook mention
- **S: 4.0** - Clean structure
- **E: 4.0** - Good balance
- **D: 4.0** - Production improvements listed, Redis pub/sub
- **Composite: (9+6+4.5+4+4+4)/7.5 = 4.20**

### a3
- **P: 4.0** - Accurate, clean patterns
- **C: 3.5** - No file size limit, in-memory rate limiting shown (slowapi is brief)
- **A: 4.5** - Full working code with models
- **S: 4.0** - Well-organized
- **E: 4.0** - Good length
- **D: 3.5** - Shows alternative approaches but shallow on production concerns
- **Composite: (8+5.25+4.5+4+4+3.5)/7.5 = 3.90**

### a4
- **P: 4.5** - Content-type check, BOM handling, lazy="noload", DB-backed T5
- **C: 4.5** - File size limit, Redis storage_uri, DB session in T5, auth in T4
- **A: 4.5** - Production-ready code patterns
- **S: 4.5** - Clean file-per-concern organization
- **E: 4.0** - Good length
- **D: 4.5** - dynamic_limit function, auth middleware, DB processing
- **Composite: (9+6.75+4.5+4.5+4+4.5)/7.5 = 4.43**

### a5
- **P: 4.5** - BOM handling, 10MB limit, lazy="noload", Celery task example
- **C: 4.0** - File size limit, Redis mentioned, StrEnum, Celery shown
- **A: 4.5** - Production-oriented code
- **S: 4.5** - Clean sections with notes
- **E: 4.0** - Good balance
- **D: 4.0** - Celery with retry_backoff shown
- **Composite: (9+6+4.5+4.5+4+4)/7.5 = 4.27**

### b1
- **P: 3.5** - Uses pandas (heavier than needed), no Pydantic model in T1
- **C: 3.5** - Missing file size limit, no explicit BG Tasks warning, uses pandas
- **A: 4.0** - Working code but pandas dependency is heavy
- **S: 3.5** - HTML demo in T4 is nice but verbose
- **E: 3.0** - Very verbose, HTML client bloat in T4
- **D: 3.5** - Multiple solution variants but too broad
- **Composite: (7+5.25+4+3.5+3+3.5)/7.5 = 3.50**

### b2
- **P: 4.0** - Accurate, 4 solutions for T3 (too many)
- **C: 3.5** - Missing file size limit, no idempotency
- **A: 4.0** - Working code
- **S: 3.5** - Multiple solutions per task makes it hard to follow
- **E: 3.0** - Very verbose, 4 N+1 solutions is excessive
- **D: 3.5** - Breadth over depth
- **Composite: (8+5.25+4+3.5+3+3.5)/7.5 = 3.63**

### b3
- **P: 3.5** - In-memory rate limiting shown prominently, pandas for T1
- **C: 3.5** - Missing file size limit, Redis brief, no DB in T5
- **A: 4.0** - Working code
- **S: 4.0** - Clean
- **E: 3.5** - Some verbose parts
- **D: 3.5** - Typing indicator in T4 is nice
- **Composite: (7+5.25+4+4+3.5+3.5)/7.5 = 3.63**

### b4
- **P: 4.0** - Accurate, DB model for T5
- **C: 4.0** - DB-backed processing, Pydantic models, Redis
- **A: 4.0** - Working code with tests shown
- **S: 4.0** - Clean sections
- **E: 3.0** - Very verbose, multiple solution files per task
- **D: 4.0** - DB models, Celery alt, auth for WS
- **Composite: (8+6+4+4+3+4)/7.5 = 3.87**

### b5
- **P: 4.0** - Accurate, auth for WebSocket, DB model
- **C: 4.0** - DB-backed, Celery alternative, Pydantic validation
- **A: 4.0** - Working code
- **S: 4.0** - Well-organized with file headers
- **E: 3.0** - Extremely verbose, multi-file per task
- **D: 4.0** - WS auth, Pydantic message validation, array_agg
- **Composite: (8+6+4+4+3+4)/7.5 = 3.87**

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| a1 | 4.0 | 3.5 | 4.5 | 4.0 | 4.5 | 3.5 | 3.97 |
| a2 | 4.5 | 4.0 | 4.5 | 4.0 | 4.0 | 4.0 | 4.20 |
| a3 | 4.0 | 3.5 | 4.5 | 4.0 | 4.0 | 3.5 | 3.90 |
| a4 | 4.5 | 4.5 | 4.5 | 4.5 | 4.0 | 4.5 | 4.43 |
| a5 | 4.5 | 4.0 | 4.5 | 4.5 | 4.0 | 4.0 | 4.27 |
| b1 | 3.5 | 3.5 | 4.0 | 3.5 | 3.0 | 3.5 | 3.50 |
| b2 | 4.0 | 3.5 | 4.0 | 3.5 | 3.0 | 3.5 | 3.63 |
| b3 | 3.5 | 3.5 | 4.0 | 4.0 | 3.5 | 3.5 | 3.63 |
| b4 | 4.0 | 4.0 | 4.0 | 4.0 | 3.0 | 4.0 | 3.87 |
| b5 | 4.0 | 4.0 | 4.0 | 4.0 | 3.0 | 4.0 | 3.87 |

**Group Averages:** A-group: 4.15 | B-group: 3.70
