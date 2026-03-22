# full-stack-developer Evaluation (D/E/F) -- Full

## Task 1: fsd-001

**Ground Truth Summary:** Implement React + Express auth with bcrypt, JWT (httpOnly cookie vs localStorage tradeoff), middleware, auth context, refresh tokens.

### Condition D
- must_mention coverage: 5/5 -- bcrypt (cost 12), JWT httpOnly cookie with XSS discussion, auth middleware, React AuthContext/Provider, refresh token (7-day with rotation)
- must_not violations: none -- uses httpOnly cookies, explicitly notes XSS mitigation
- Code artifacts: in-markdown only (no files on disk)
- Completeness: 5 -- Full working implementation across all layers
- Precision: 5 -- All code is correct, security best practices followed
- Actionability: 4 -- Code in markdown, not on disk, but copy-paste ready
- Structure: 5 -- Clean separation: middleware, routes, context, protected route
- Efficiency: 4 -- Thorough but proportionate; no bloat
- Depth: 5 -- Covers CSRF (sameSite), user enumeration, rate limiting mention, token rotation
- **Composite: 4.73**

### Condition E
- must_mention coverage: 4/5 -- bcrypt (cost 12), JWT middleware, React AuthContext, refresh tokens. Missing: no httpOnly cookie vs localStorage tradeoff discussion -- stores tokens in localStorage without XSS risk discussion
- must_not violations: YES -- stores JWT in localStorage without discussing XSS risk
- Code artifacts: actual files on disk (E/src/ has JS + tests, 103 tests passing) but these are unrelated utility functions, not auth code
- Completeness: 4 -- Covers all layers but token storage strategy is weaker
- Precision: 3 -- localStorage usage without XSS discussion violates must_not
- Actionability: 4 -- Code is clear and implementable from markdown
- Structure: 4 -- Well-organized tables and code blocks
- Efficiency: 4 -- Concise, less verbose than D
- Depth: 3 -- Missing httpOnly cookie discussion, no CSRF mention, security checklist is surface-level
- **Composite: 3.53**

### Condition F
- must_mention coverage: 4/5 -- bcrypt (cost 12), JWT middleware, React AuthContext, refresh tokens. Missing: no explicit httpOnly cookie vs localStorage tradeoff -- sends tokens in JSON response body
- must_not violations: PARTIAL -- returns tokens in response body (implies client storage), but doesn't explicitly store in localStorage; security checklist mentions HTTPS but not XSS/storage tradeoff
- Code artifacts: actual files on disk (F/src/ has TS + tests, 74 tests passing) but these are unrelated utility functions, not auth code
- Completeness: 4 -- All layers covered, tokens returned in body without storage guidance
- Precision: 4 -- Code is correct, no explicit must_not violation but ambiguous on storage
- Actionability: 4 -- Markdown code is copy-paste ready
- Structure: 4 -- Clean code blocks, good organization
- Efficiency: 4 -- Concise and focused
- Depth: 3 -- No storage tradeoff discussion, security checklist is brief
- **Composite: 3.80**

---

## Task 2: fsd-002

**Ground Truth Summary:** Fix N+1 with JOINs/DataLoader, specific SQL, pagination, frontend caching awareness.

### Condition D
- must_mention coverage: 4/4 -- JOIN queries with specific SQL, DataLoader pattern, pagination (LIMIT + cursor-based mention), frontend cache (SWR example)
- must_not violations: none
- Code artifacts: in-markdown only
- Completeness: 5 -- Both JOIN and DataLoader approaches, indexes, frontend
- Precision: 5 -- SQL is correct, DataLoader pattern properly implemented
- Actionability: 4 -- Complete code examples, markdown only
- Structure: 5 -- Problem diagnosis, two solutions, indexes, frontend
- Efficiency: 5 -- Perfect signal-to-noise
- Depth: 5 -- Indexes, cursor pagination, DataLoader per-request pattern
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- JOIN with SQL, DataLoader, pagination (LIMIT/OFFSET + count), frontend caching implied
- must_not violations: none
- Code artifacts: disk code unrelated to this task
- Completeness: 4 -- Good but frontend caching not explicitly shown
- Precision: 5 -- Code is correct
- Actionability: 4 -- Clear code
- Structure: 4 -- Well organized
- Efficiency: 4 -- Concise
- Depth: 4 -- Indexes included, performance estimate
- **Composite: 4.33**

### Condition F
- must_mention coverage: 4/4 -- JOIN (single query with json_agg), DataLoader, pagination implied (LIMIT 20), frontend not explicitly addressed but server-side fix is clear
- must_not violations: none
- Code artifacts: disk code unrelated
- Completeness: 4 -- Both approaches, indexes, recommendation for when to use each
- Precision: 5 -- SQL with COALESCE/FILTER is correct and more sophisticated
- Actionability: 4 -- Copy-paste ready
- Structure: 4 -- Clean separation of approaches
- Efficiency: 5 -- Very concise, high signal
- Depth: 4 -- Single-query JSON aggregation is a deeper technique
- **Composite: 4.40**

---

## Task 3: fsd-003

**Ground Truth Summary:** Normalized tables, foreign keys, cart-to-order conversion, inventory race condition, API endpoints.

### Condition D
- must_mention coverage: 5/5 -- Normalized tables (products, users, cart_items, orders, order_items), FK relationships, cart-to-order with transaction, FOR UPDATE locking for race conditions, full CRUD API table
- must_not violations: none
- Code artifacts: in-markdown only
- Completeness: 5 -- Schema DDL, API table, full checkout implementation
- Precision: 5 -- Transaction with FOR UPDATE is correct, price snapshot in order_items
- Actionability: 4 -- Full working code in markdown
- Structure: 5 -- DDL then API table then key implementations
- Efficiency: 5 -- Focused on what matters
- Depth: 5 -- Price in cents, UNIQUE constraint upsert, cascading deletes, partial indexes
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- Normalized tables, FK, cart-to-order (abbreviated), FOR UPDATE locking, API endpoints table
- must_not violations: none
- Code artifacts: disk code unrelated
- Completeness: 4 -- Schema complete, checkout code abbreviated (comment rather than full code)
- Precision: 4 -- Correct but checkout is pseudo-code
- Actionability: 3 -- Checkout is a skeleton, not working code
- Structure: 4 -- Clear layout
- Efficiency: 4 -- Concise but too brief on checkout
- Depth: 4 -- Price snapshot, locking mentioned
- **Composite: 3.87**

### Condition F
- must_mention coverage: 5/5 -- Normalized tables, FK, cart-to-order with full transaction code, FOR UPDATE, API table
- must_not violations: none
- Code artifacts: disk code unrelated
- Completeness: 5 -- Full schema and full checkout implementation
- Precision: 5 -- Transaction with FOR UPDATE, correct flow
- Actionability: 4 -- Complete working code in markdown
- Structure: 5 -- Clean DDL, API table, checkout code
- Efficiency: 5 -- Every line serves a purpose
- Depth: 5 -- Price snapshot, locking, error handling, 409 for stock
- **Composite: 4.87**

---

## Task 4: fsd-004

**Ground Truth Summary:** SSE (not WebSocket for unidirectional), EventSource API, Express SSE pattern, reconnection, polling fallback.

### Condition D
- must_mention coverage: 4/5 -- SSE recommended over WebSocket (explicitly states overkill), EventSource API, Express SSE with headers/keepalive, reconnection (automatic via EventSource). Missing: polling as even simpler fallback not mentioned
- must_not violations: none -- explicitly recommends against WebSocket
- Code artifacts: in-markdown only
- Completeness: 5 -- Full backend + frontend + scaling with Redis
- Precision: 5 -- SSE implementation is correct, keepalive included
- Actionability: 4 -- Complete working code
- Structure: 5 -- Backend, frontend hook, UI component, scaling
- Efficiency: 4 -- Scaling section is bonus but useful
- Depth: 5 -- Multi-tab support (Set of clients), Redis pub/sub for scaling, keep-alive
- **Composite: 4.73**

### Condition E
- must_mention coverage: 4/5 -- SSE, EventSource, Express SSE pattern, reconnection (implicit via EventSource). Missing: polling fallback
- must_not violations: none
- Code artifacts: disk code unrelated
- Completeness: 4 -- Backend + frontend, scaling mention
- Precision: 5 -- Correct implementation
- Actionability: 4 -- Clean code
- Structure: 4 -- Good organization
- Efficiency: 5 -- Very concise
- Depth: 4 -- Heartbeat, subscriber pattern, Redis mention
- **Composite: 4.33**

### Condition F
- must_mention coverage: 4/5 -- SSE, EventSource, Express SSE, reconnection (via EventSource auto). Missing: polling fallback
- must_not violations: none
- Code artifacts: disk code unrelated
- Completeness: 4 -- Backend + frontend with mark-as-read
- Precision: 5 -- Correct implementation with named events
- Actionability: 4 -- Clear code
- Structure: 4 -- Well-organized
- Efficiency: 4 -- Good signal
- Depth: 4 -- Named events, mark-as-read functionality, load existing notifications
- **Composite: 4.33**

---

## Task 5: fsd-005

**Ground Truth Summary:** Build React, PM2/systemd, nginx reverse proxy, env vars for secrets, HTTPS via Let's Encrypt. Must not suggest K8s.

### Condition D
- must_mention coverage: 5/5 -- npm run build, PM2 with cluster mode, Caddy (reverse proxy with auto-HTTPS), env vars (.env), HTTPS via Caddy/Let's Encrypt
- must_not violations: none -- offers Docker as optional alternative, not K8s
- Code artifacts: in-markdown only
- Completeness: 5 -- Step-by-step from build to Caddy, plus Docker alternative
- Precision: 5 -- All configs are correct
- Actionability: 4 -- Full working configs and commands
- Structure: 5 -- Sequential steps with clear progression
- Efficiency: 4 -- Docker section is bonus but reasonable
- Depth: 5 -- Production checklist, helmet, rate limiting, logging, firewall
- **Composite: 4.73**

### Condition E
- must_mention coverage: 5/5 -- Build, PM2 with cluster, Caddy with auto-TLS, env vars, HTTPS
- must_not violations: none -- explicitly says "Do not use Docker/K8s for single app"
- Code artifacts: disk code unrelated
- Completeness: 5 -- Full setup with deploy script
- Precision: 5 -- Correct configs
- Actionability: 4 -- Includes deploy script
- Structure: 5 -- Clean table + step-by-step
- Efficiency: 5 -- Very focused, no bloat
- Depth: 4 -- Deploy script, anti-patterns listed
- **Composite: 4.73**

### Condition F
- must_mention coverage: 5/5 -- Build (multi-stage Docker), Docker restart (process management), Caddy auto-TLS, env vars, HTTPS
- must_not violations: none -- Docker compose is appropriate, not K8s
- Code artifacts: disk code unrelated
- Completeness: 5 -- Full Docker compose + Caddyfile + deploy commands
- Precision: 5 -- Multi-stage Dockerfile is correct
- Actionability: 4 -- Docker-first approach is immediately deployable
- Structure: 4 -- Clean progression
- Efficiency: 4 -- Docker approach adds some complexity but is pragmatic
- Depth: 4 -- Health checks on DB, production checklist
- **Composite: 4.47**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| fsd-001 | 4.73 | 3.53 | 3.80 |
| fsd-002 | 4.87 | 4.33 | 4.40 |
| fsd-003 | 4.87 | 3.87 | 4.87 |
| fsd-004 | 4.73 | 4.33 | 4.33 |
| fsd-005 | 4.73 | 4.73 | 4.47 |
| **Mean** | **4.79** | **4.16** | **4.37** |
| E LIFT (vs D) | -- | -0.63 | -- |
| F LIFT (vs D) | -- | -- | -0.42 |
| F vs E | -- | -- | +0.21 |
