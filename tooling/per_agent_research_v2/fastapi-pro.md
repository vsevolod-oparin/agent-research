# fastapi-pro: Deep Research Report v2

## Eval Summary
- v1 score: 4.82 (best)
- v4 score: 4.52 (-0.30 regression from v1)
- v2 score: not separately evaluated
- Bare model: 3.67
- Agent instructions uplift: +0.85 over bare (highest uplift among all agents)
- Room for improvement: +0.35 to ceiling

---

## 1. Landscape

**FastAPI dominance confirmed (2025-2026):**
- 38% adoption among professional Python devs (up from 29% in 2023) per JetBrains 2025 State of Python survey. Largest jump among web frameworks. [Source: JetBrains/PSF 2025 survey, byteiota.com]
- 91,700+ GitHub stars by Nov 2025; ~9M monthly PyPI downloads matching Django. [Source: programming-helper.com, byteiota.com]
- 50%+ of Fortune 500 companies running FastAPI in production (Uber, Netflix, Microsoft). Job postings up 150% YoY in 2024-2025. [Source: byteiota.com, rollbar.com]
- 42% of ML engineers use FastAPI for model serving (vs 22% Django, 28% Flask). De facto choice for ML inference endpoints. [Source: byteiota.com]
- Performance: 12,500-20,000+ req/s vs Flask 4,000-4,200 req/s. On par with Node.js/Go for I/O-bound workloads. [Source: kawaldeepsingh/Medium]

**Key ecosystem shifts since prior research:**
- **Pydantic V2 migration nearly complete**: FastAPI 0.126.0 dropped Pydantic V1 support. Python 3.14 (late 2026) will break `pydantic.v1` entirely. `bump-pydantic` tool automates most migration. [Source: fastapi.tiangolo.com/how-to/migrate-from-pydantic-v1-to-pydantic-v2]
- **Lifespan is the only supported pattern**: `@app.on_event("startup")` fully deprecated. `@asynccontextmanager` lifespan is mandatory. [Source: fastapi docs, logiclooptech.dev]
- **SQLAlchemy 2.0 async is production-ready**: `create_async_engine` + `async_sessionmaker` + `expire_on_commit=False` is the standard pattern. MissingGreenlet remains the #1 async SQLAlchemy error. [Source: github.com/AyushKaushik-BD/fastapi-sqlalchemy-async-patterns, dev-faizan.medium.com]
- **MCP integration emerging**: FastAPI + MCP for AI agent tool servers is a growing pattern. Native async + OpenAPI specs align with MCP discovery.
- **Python 3.14 free-threading** (late 2026): No GIL. FastAPI positioned for both async I/O AND parallel CPU execution.
- **Pydantic query parameter models**: Since FastAPI 0.115.0, `Annotated[FilterParams, Query()]` allows Pydantic models for query params. [Source: fastapi.tiangolo.com/tutorial/query-param-models]

---

## 2. Failure Modes

### What AI gets wrong most often (ranked by frequency and impact):

**Tier 1 -- Silent production killers:**

1. **Blocking calls in async endpoints** -- The #1 failure. AI generates `def sync_db_call()` inside `async def endpoint()`, blocking the event loop. FastAPI runs `async def` endpoints on the main event loop; a single blocking call (psycopg2, file I/O, `time.sleep`) stalls ALL concurrent requests. The critical nuance: FastAPI automatically runs `def` (sync) endpoints in a threadpool, but `async def` endpoints run directly on the event loop. [Source: logiclooptech.dev, community reports]

2. **MissingGreenlet errors** -- Accessing lazy-loaded SQLAlchemy relationships in async sessions. AI generates `user.posts` without `selectinload()`. Fix requires eager loading (`selectinload`, `joinedload`, `subqueryload`) or `awaitable_attrs`. This is the #1 reported SQLAlchemy async error in FastAPI projects. [Source: github.com/AyushKaushik-BD, logiclooptech.dev]

3. **DB session leaks** -- Sessions not closed on exception paths. Connection pool exhaustion under load. Must use DI with `async with` or `try/finally`. The `expire_on_commit=False` setting is critical for async (prevents lazy-load errors after commit) but AI often omits it. [Source: dev-faizan.medium.com]

4. **Pydantic V1/V2 confusion** -- AI training data mixes V1 and V2 patterns. `.dict()` vs `.model_dump()`, `@validator` vs `@field_validator`, `class Config:` vs `model_config = ConfigDict()`, `from_orm()` vs `model_validate()`. With Python 3.14 dropping `pydantic.v1`, this is now a hard error, not just style. [Source: fastapi.tiangolo.com migration guide]

**Tier 2 -- Correctness bugs:**

5. **Mutable defaults in Depends** -- `Depends(MyClass())` creates ONE shared instance across all requests. State bleeds between requests. Must use `Depends(MyClass)` (no parens) or a factory. Related: ruff rule B006/B008 catches this but `fastapi.Depends` needs exemption in config. [Source: stackoverflow.com, ruff docs]

6. **Missing `await` on coroutines** -- `RuntimeWarning: coroutine was never awaited`. The call silently does nothing. No data saved, no side effect executed. Extremely hard to debug in production.

7. **Deprecated `@app.on_event`** -- AI generates startup/shutdown with the deprecated decorator instead of lifespan context manager. Works but logs deprecation warnings and lacks proper resource cleanup guarantees.

**Tier 3 -- Performance/architecture:**

8. **N+1 queries** -- ORM relationships without eager loading. Each request triggers O(n) queries. Must add `selectinload()`/`joinedload()` in query options.

9. **No connection pooling config** -- Default pool sizes are inadequate for production. Need explicit `pool_size`, `max_overflow`, `pool_pre_ping=True`, `pool_recycle=3600`.

10. **Business logic in endpoints** -- Endpoints become untestable monoliths. Service layer pattern is the standard.

---

## 3. Best-in-Class Improvements

### What would push this agent toward ceiling (4.82 -> 5.0+):

**High-impact additions (based on what production teams actually need):**

1. **SQLAlchemy 2.0 async session pattern** -- Complete correct pattern including `async_sessionmaker`, `expire_on_commit=False`, lifespan-based engine management, and proper DI. This is the most common real-world task and AI gets it wrong most often.

2. **Lifespan pattern** -- Concrete `@asynccontextmanager` lifespan example replacing deprecated `on_event`. Show engine creation, pool setup, and cleanup.

3. **`def` vs `async def` behavior explanation** -- FastAPI runs `def` endpoints in a threadpool (safe for blocking calls) but `async def` directly on the event loop (blocks everything if you call sync code). This is THE most important concept for FastAPI correctness and most agents explain it poorly.

4. **Testing async endpoints** -- `httpx.AsyncClient` with `ASGITransport`, `pytest-asyncio`, async fixture for DB session override. AI consistently generates outdated test patterns.

5. **Annotated types** -- `Annotated[str, Query()]` is the modern pattern (since FastAPI 0.95). AI still generates the old `q: str = Query()` style.

---

## 4. Main Bottleneck

**The bottleneck is prompt content, not model capability.** Evidence:
- +0.85 uplift over bare (highest of any agent) proves instructions are the dominant lever
- v1 scored 4.82, proving the model CAN reach near-ceiling with the right content
- v4 regressed to 4.52, proving content was REMOVED that mattered

The specific bottleneck is the v1-to-v4 content loss (analyzed in section 5 below). The v4 rewrite traded specificity for conciseness and lost critical guidance that helped the model perform.

---

## 5. CRITICAL: v1 -> v4 Diff Analysis -- What Was Lost

### Structural comparison:
- **v1 (production)**: 171 lines. Generic "capabilities list" format. Broad but shallow.
- **v2**: 124 lines. Structured with Identity, Trigger Conditions, Workflow, Decision Table, etc. Added specificity.
- **v4**: 74 lines. Concise, dense, decision-table-driven. Model-first workflow.

### The paradox: v1 is WORSE structured but SCORES HIGHER

v1 is essentially a capabilities laundry list (bullet points of things the agent "can do") with no actionable workflow, no anti-patterns, no common errors table, and no decision table. v4 has ALL of these and is better organized. Yet v1 scores 0.30 higher.

### What v1 had that v4 removed (the regression candidates):

**1. Explicit section headers for broad domains:**
v1 had named sections for every domain: "Authentication & Security", "Deployment & DevOps", "Observability & Monitoring", "Integration Patterns", "Testing & Quality Assurance", "Advanced Features". v4 collapsed all of this into a compact 74-line file with only the core FastAPI patterns.

**Hypothesis**: The domain headers in v1 acted as **activation triggers**. When the model saw "Authentication & Security" with specific items like "OAuth2 with JWT tokens (python-jose, pyjwt)", "CORS configuration and security headers", "Rate limiting per user/IP", it activated relevant knowledge. v4's concise format may fail to trigger this knowledge for tasks that fall outside the core workflow.

**2. Behavioral Traits section:**
v1 had explicit behavioral directives:
- "Writes async-first code by default"
- "Emphasizes type safety with Pydantic and type hints"
- "Implements comprehensive error handling"
- "Uses dependency injection for clean architecture"
- "Documents APIs thoroughly with OpenAPI"
- "Implements proper logging and monitoring"
- "Follows 12-factor app principles"

v4 has NO behavioral section. The model-first workflow in v4 implies some behaviors but never states them as directives.

**Hypothesis**: Behavioral traits function as **persistent mode-setting**. "Follows 12-factor app principles" causes the model to consider env vars, stateless processes, port binding across ALL generated code. Without it, the model only follows these when explicitly asked.

**3. Response Approach (step-by-step):**
v1 had an 8-step response approach:
1. Analyze requirements for async opportunities
2. Design API contracts with Pydantic models first
3. Implement endpoints with proper error handling
4. Add comprehensive validation using Pydantic
5. Write async tests covering edge cases
6. Optimize for performance with caching and pooling
7. Document with OpenAPI annotations
8. Consider deployment and scaling strategies

v4's workflow is 6 steps and more focused but DROPS steps 6 (performance optimization), 7 (OpenAPI documentation), and 8 (deployment consideration).

**Hypothesis**: Steps 7 and 8 remind the model to add OpenAPI annotations and consider deployment, which it won't do unprompted. The eval tasks may test for documentation quality and production-readiness that v4 doesn't trigger.

**4. Example Interactions:**
v1 had 8 example interactions showing the range of tasks. v4 has none. Examples prime the model for the types of requests it should handle well.

**5. Knowledge Base references:**
v1 listed 10 knowledge areas. v4 has none. These serve as retrieval cues for the model's training data.

**6. Specific technology mentions:**
v1 mentioned: python-jose, pyjwt, Strawberry, Graphene, Motor, Beanie, Celery, Dramatiq, RabbitMQ, Kafka, loguru, structlog, OpenTelemetry, Prometheus, DataDog, New Relic, Sentry, Locust, factory_boy, Faker, pytest-mock, pytest-cov, Helm, Hypercorn, Daphne, MinIO. v4 mentions almost none of these.

**Hypothesis**: Named tool/library mentions activate the model's specific knowledge of those tools. "Use loguru for structured logging" produces better logging code than generic "implement logging".

### What v4 ADDED that v1 lacked (the improvements):

1. **Decision Table** -- Concrete when-to-use guidance for sync/async, BackgroundTasks/Celery, etc.
2. **Anti-Patterns list** -- 6 specific anti-patterns with explanations
3. **Common Errors table** -- 6 errors with cause and fix
4. **Pydantic V2 Migration Gotchas** -- 5 specific V1->V2 mappings
5. **Endpoint Checklist** -- Actionable checklist per endpoint
6. **Performance Patterns** -- 4 specific patterns with implementation
7. **Model-first workflow** -- More structured than v1's generic "Response Approach"

### Root cause of regression:

**v4 optimized for DEPTH on core FastAPI patterns but LOST BREADTH that the eval tasks apparently test.** The eval likely includes tasks spanning auth, deployment, testing, observability, and integrations -- domains where v1's broad headers activated relevant model knowledge. v4's compact 74 lines focus only on the endpoint-building workflow.

The v2 agent (124 lines) was a middle ground but was never evaluated separately. It kept more structure than v4 while adding v4-style specificity.

---

## 6. Winning Patterns

Based on the diff analysis, the winning formula is clear:

**v1's breadth (knowledge activation) + v4's depth (actionable patterns) = optimal agent**

Specifically:

1. **Keep ALL of v4's additions** -- Decision table, anti-patterns, common errors, Pydantic V2 gotchas, endpoint checklist, performance patterns. These are proven-useful structured guidance.

2. **Restore v1's behavioral traits** -- Explicit directives that set the model's default behavior mode. These are cheap (10 lines) and high-impact.

3. **Restore domain activation headers** -- Not the full v1 bullet lists, but concise 1-2 line summaries per domain that trigger relevant model knowledge. Example: instead of 8 bullet points under "Authentication & Security", one line: "Auth: OAuth2+JWT (python-jose), API keys, RBAC, CORS, rate limiting (slowapi)".

4. **Add the missing v4 content** -- SQLAlchemy 2.0 async session pattern, lifespan pattern, `def` vs `async def` behavior explanation, Annotated types.

5. **Restore response approach steps** -- Particularly "Document with OpenAPI annotations" and "Consider deployment and scaling strategies" which v4 dropped.

---

## 7. Specific Recommendations for Restoring v1's Performance

### Architecture: Hybrid v1+v4 at ~120-140 lines

```
Structure:
1. Frontmatter + Identity (5 lines) -- keep v4's concise identity + add "Be thorough" directive
2. Behavioral Directives (12 lines) -- RESTORE from v1, add new ones
3. Workflow (12 lines) -- keep v4's model-first workflow, restore steps 7-8
4. Decision Table (8 lines) -- keep v4 exactly
5. Endpoint Checklist (8 lines) -- keep v4 exactly
6. Pydantic V2 Patterns (8 lines) -- keep v4's migration gotchas, add Annotated types
7. Anti-Patterns (10 lines) -- keep v4, add "catching broad Exception"
8. Common Errors (10 lines) -- keep v4, add RuntimeError no event loop, ValueError pydantic field
9. Performance Patterns (8 lines) -- keep v4, add response caching with Redis
10. SQLAlchemy 2.0 Async Patterns (10 lines) -- NEW: the complete correct pattern
11. Domain Quick-Reference (20 lines) -- NEW: condensed v1 domain activation
12. Testing Patterns (6 lines) -- NEW: async testing specifics
```

### Specific content to add/restore:

**A. Behavioral Directives (restore from v1 + enhance):**
```
## Behavioral Directives
- Async-first only when entire chain is non-blocking; sync `def` is safer default
- Type safety with Pydantic and Python type hints on every function
- Dependency injection for all shared concerns -- no module-level state
- Document APIs with OpenAPI: `summary`, `description`, `response_description`, `Field(description=...)`
- Consider deployment: env config via Pydantic Settings, health endpoints, graceful shutdown
- Follow 12-factor app principles for production code
- Implement structured logging (structlog/loguru) and request ID tracking
```

**B. `def` vs `async def` Explanation (new, critical):**
```
## sync/async Behavior (Critical)
- `def endpoint()`: FastAPI runs in threadpool -- SAFE for blocking calls (sync ORM, file I/O, time.sleep)
- `async def endpoint()`: Runs on event loop -- ANY blocking call stalls ALL concurrent requests
- Rule: Use `async def` ONLY when every call in the chain is `await`-able. When in doubt, use `def`
- Common trap: `async def` + `requests.get()` or `psycopg2` = event loop blocked = production outage
```

**C. SQLAlchemy 2.0 Async Pattern (new):**
```
## SQLAlchemy 2.0 Async Pattern
- Engine: `create_async_engine(url, pool_size=20, max_overflow=10, pool_pre_ping=True, pool_recycle=3600)`
- Session factory: `async_sessionmaker(engine, expire_on_commit=False)` -- expire_on_commit=False prevents lazy-load errors
- DI: `async def get_db(): async with AsyncSessionLocal() as session: yield session`
- Lifespan: Create engine in `@asynccontextmanager async def lifespan(app)`, dispose in cleanup
- Relationships: ALWAYS use `selectinload()`/`joinedload()` -- no lazy loading in async
- Migrations: Alembic with `run_async()` wrapper for async engine
```

**D. Domain Quick-Reference (condensed v1 activation):**
```
## Domain Quick-Reference
- **Auth**: OAuth2+JWT (python-jose/pyjwt), API keys, RBAC, CORS headers, rate limiting (slowapi)
- **Testing**: pytest-asyncio, httpx.AsyncClient + ASGITransport, factory_boy/Faker, pytest-mock, pytest-cov
- **Deployment**: Uvicorn+Gunicorn (`workers=2*CPU+1`), Docker multi-stage, Pydantic Settings for env config
- **Observability**: structlog/loguru, OpenTelemetry tracing, Prometheus metrics, Sentry errors, request ID correlation
- **Integrations**: httpx for external APIs, Celery/ARQ for task queues, Redis for caching, SSE for streaming
- **WebSockets**: ConnectionManager pattern, heartbeat, reconnection, broadcast
- **Background**: BackgroundTasks for <30s fire-and-forget, Celery for retry/monitoring/survivability
```

**E. Testing Patterns (new):**
```
## Testing Patterns
- Async tests: `@pytest.mark.anyio` + `httpx.AsyncClient(transport=ASGITransport(app=app))`
- DB override: `app.dependency_overrides[get_db] = override_get_db` with test database
- Fixtures: async session fixture yielding test DB session, cleanup via transaction rollback
- Coverage: Happy path + validation error (422) + auth failure (401/403) + not found (404) + conflict (409)
```

**F. Lifespan Pattern (add to workflow or separate):**
```
- Lifespan: `@asynccontextmanager async def lifespan(app): engine = create_async_engine(...); yield {"engine": engine}; await engine.dispose()`
- Access via `request.state` or Depends. Never use module-level globals for async resources.
```

### What NOT to restore from v1:
- The verbose capability bullet lists (replaced by domain quick-reference)
- Example Interactions section (low value, consumes tokens)
- Knowledge Base section (model doesn't use this effectively)
- The generic "Purpose" paragraph (v4's identity line is better)

### Estimated impact:
- Restoring behavioral directives: +0.10-0.15 (mode-setting for all output)
- Adding domain quick-reference: +0.10-0.15 (knowledge activation for non-core tasks)
- Adding SQLAlchemy 2.0/lifespan/testing patterns: +0.05-0.10 (correctness on common tasks)
- Restoring response approach steps 7-8: +0.05 (documentation and deployment consideration)
- Total estimated recovery: +0.25-0.40 (bringing v5 to 4.77-4.92 range)

---

## Sources
- JetBrains/PSF 2025 State of Python survey (blog.jetbrains.com/pycharm/2025/09)
- ByteIota FastAPI adoption analysis (byteiota.com/fastapi-adoption-surges-38)
- FastAPI official Pydantic V2 migration guide (fastapi.tiangolo.com/how-to/migrate-from-pydantic-v1-to-pydantic-v2)
- FastAPI SQLAlchemy async patterns (github.com/AyushKaushik-BD/fastapi-sqlalchemy-async-patterns)
- SQLAlchemy 2.0 async patterns guide (dev-faizan.medium.com)
- FastAPI lifespan vs startup events (logiclooptech.dev)
- Ruff B006/B008 mutable default detection (docs.astral.sh/ruff)
- FastAPI query parameter models (fastapi.tiangolo.com/tutorial/query-param-models)
- Rollbar Python backend framework guide 2026 (rollbar.com/blog/python-backend-frameworks)
- MCP Market Python Backend Architect skill (mcpmarket.com/tools/skills/python-backend-architect)
