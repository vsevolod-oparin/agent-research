# fastapi-pro: Per-Agent Research Report

## Eval Summary
- v1 score: 4.82 (best)
- v4 score: 4.52 (-0.30 regression from v1)
- Bare model: 3.67
- Agent instructions uplift: +0.85 over bare (highest uplift among agents)
- Room for improvement: +0.35 to ceiling (tied for most room)
- **Key problem: v4 regressed from v1. Something was lost or diluted in the rewrite.**

---

## 1. Competitive Landscape

**FastAPI ecosystem in 2026:**
- FastAPI surpassed Flask in GitHub stars (88k+ vs 68.4k). 38% adoption among Python devs (up from 29% in 2024).
- 9M monthly PyPI downloads, matching Django. Default choice for new Python API projects.
- 42% of ML engineers use FastAPI (vs 22% Django, 28% Flask). Dominant in AI/ML model serving.
- Microsoft, Netflix, Uber standardizing on FastAPI for new API services.
- 50%+ of Fortune 500 companies running FastAPI in production.

**Key ecosystem shifts:**
- **MCP integration**: FastAPI + MCP is emerging as the standard stack for building AI agent tool servers. Native async + OpenAPI specs align perfectly with MCP discovery.
- **Python 3.14 free-threading** (late 2026): No GIL. FastAPI positioned to benefit from both async I/O concurrency AND parallel CPU execution.
- **AI/ML serving**: FastAPI is the de facto API layer for deploying ML models (PyTorch, TensorFlow, etc.) as production endpoints.
- **Microservices dominance**: FastAPI powering 65% of new Python-based microservices in cloud computing.

**Performance benchmarks (2026):**
- FastAPI: 12,500-20,000+ req/s vs Flask: 4,000-4,200 req/s (3-5x improvement)
- On par with Node.js and Go for I/O-bound workloads
- 12ms median latency vs Flask's 45ms

**Competing approaches:**
- Django async (improving but ORM still largely sync, retrofitted not native)
- Flask (plateaued, minimalist, no native async)
- Litestar (async-native competitor, smaller community)
- Go/Rust for pure performance (but lose Python ML ecosystem)

## 2. Known Failure Modes / Chokepoints

**AI-generated FastAPI code failures (from search results + community):**

- **Blocking calls in async endpoints**: The #1 failure mode. AI generates `def sync_db_call()` inside `async def endpoint()`, blocking the event loop. Already in our agent but this is SO common it may need stronger emphasis.
- **Sync vs async confusion**: Developers (and AI) struggle with when to use `async def` vs `def`. Using `async def` with sync DB drivers (e.g., psycopg2 instead of asyncpg) silently blocks.
- **MissingGreenlet errors**: Lazy-loaded relationships in async SQLAlchemy sessions. Must use `selectinload()`/`joinedload()`. Very common AI mistake.
- **Mutable defaults in Depends**: `Depends(MyClass())` shares one instance across requests. Must use `Depends(MyClass)` (no parens).
- **DB session leaks**: Sessions not properly closed, exhausting connection pools under load. DI with `finally: session.close()` or context managers required.
- **Pydantic V1/V2 confusion**: AI training data mixes V1 and V2 patterns. `.dict()` vs `.model_dump()`, `@validator` vs `@field_validator`, `from_orm()` vs `model_validate()`.
- **Over-engineering dependency injection**: Steeper learning curve leads to over-abstraction when simpler patterns suffice.
- **Large payload handling**: Pydantic validation on >10MB payloads can timeout, especially for AI file upload endpoints.
- **Silent coroutine failures**: Missing `await` on async calls -- coroutine silently does nothing.
- **Background task error propagation**: Unhandled exceptions in background tasks propagate silently.

**Production-specific failures:**
- Connection pool exhaustion under high concurrency without proper `pool_size`/`max_overflow` tuning
- N+1 query problems when ORM relationships aren't eagerly loaded
- Schema drift between OpenAPI spec and actual behavior when models evolve
- Rate limiting not built-in (need `slowapi` or Redis-backed solutions)

## 3. What Would Make This Agent Best-in-Class

**Already strong (keep):**
- Model-first workflow (Pydantic schemas before endpoints)
- Decision table (sync/async, BackgroundTasks/Celery, etc.)
- Endpoint checklist
- Pydantic V2 migration gotchas
- Anti-patterns list
- Common errors table

**What v1 likely had that v4 may have lost (investigate the regression):**
- v1 scored 4.82, v4 scored 4.52. The -0.30 regression suggests something was removed or diluted.
- Hypothesis: v4 may have become more concise/trimmed at the cost of losing specific patterns that helped in eval tasks.
- **Action**: Compare v1 and v4 side-by-side to identify what was cut.

**Additions to consider for reaching ceiling:**
- **MCP integration patterns**: FastAPI + MCP server setup is the hot pattern in 2026. Agent should know how to expose FastAPI endpoints as MCP tools.
- **ML model serving patterns**: Async model loading, model caching (`model_cache` dict pattern), streaming inference responses, Pydantic schemas for inference input/output.
- **Production deployment section**: Uvicorn/Gunicorn worker configuration (`workers = 2*CPU + 1`), Docker containerization, Kubernetes deployment, health check endpoints.
- **Observability**: OpenTelemetry integration, Prometheus metrics, structured logging. Production teams treat this as first-class.
- **Rate limiting**: `slowapi` or Redis-backed distributed limiting with token bucket algorithm.
- **Testing patterns**: More depth on `httpx.AsyncClient` for async testing, fixtures for async DB sessions, mocking external services.
- **Middleware patterns**: CORS, logging, rate limiting, authentication middleware.
- **WebSocket patterns**: Real-time applications are a major FastAPI use case in 2026.
- **Lifespan events**: Stronger emphasis on `@asynccontextmanager` lifespan pattern (replaces deprecated `on_event`).

## 4. Main Bottleneck

**Prompt is the primary bottleneck.** The +0.85 uplift over bare (highest of any agent) proves instructions matter enormously for FastAPI tasks. The v1-to-v4 regression (-0.30) confirms the prompt content itself is the key variable.

Specific bottleneck analysis:
- **Prompt regression**: Something in the v4 rewrite hurt performance. This is the single highest-ROI fix -- identify and restore what v1 had.
- **Coverage gaps**: FastAPI's ecosystem has expanded significantly (MCP, ML serving, Python 3.14 free-threading). The agent may not cover patterns the evals test.
- **Depth vs breadth tradeoff**: The agent covers many topics but may lack depth on the specific patterns that eval tasks require (e.g., async SQLAlchemy 2.0 patterns, complex DI chains).

Model capability is NOT the bottleneck here -- the bare model scores 3.67 but v1 reached 4.82, showing the model CAN do it with the right instructions.

## 5. What Winning Setups Look Like

**Architecture patterns that production teams use:**
- API gateway -> dedicated FastAPI services per domain (auth, orders, inventory) -> async DB access
- Pydantic models as the single source of truth for request/response/OpenAPI
- Dependency injection for DB sessions, auth, pagination -- one concern per dependency
- Service layer pattern: endpoints orchestrate, services do business logic
- Background tasks for fire-and-forget, Celery/ARQ for retry-needed work

**Production stack (2026 standard):**
- FastAPI + Uvicorn + Gunicorn (multiple workers)
- SQLAlchemy 2.0 async + asyncpg for PostgreSQL
- Redis for caching + rate limiting
- Pydantic V2 with `ConfigDict(from_attributes=True)` for ORM integration
- Docker + Kubernetes for deployment
- Prometheus + Grafana + OpenTelemetry for observability
- pytest + httpx.AsyncClient for testing

**Code quality markers:**
- Every endpoint has `response_model`, correct status code, `Depends()` for shared logic
- Error responses documented in `responses={}` parameter
- Connection pooling tuned (`pool_size=20, max_overflow=10`)
- N+1 prevented with `selectinload()` in query options
- Lifespan handler for startup/shutdown (not deprecated `on_event`)

**Key recommendation**: The highest-impact action is to diff v1 vs v4 agent instructions and restore whatever was lost. The +0.85 uplift proves instructions are the dominant lever, and the -0.30 regression proves the v4 rewrite hurt.
