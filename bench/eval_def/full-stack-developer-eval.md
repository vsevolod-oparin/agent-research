# full-stack-developer Evaluation (D/E/F)

## Task 1: fsd-001

**Ground Truth Summary:** Must mention: bcrypt password hashing, JWT storage tradeoff (httpOnly cookie vs localStorage XSS risk), Express auth middleware, React auth context/provider, refresh token strategy. Must not: store passwords plain text, put JWT in localStorage without discussing XSS risk.

### Condition D
- must_mention coverage: 5/5 -- bcrypt (line 88, cost 12), httpOnly cookie for refresh token with XSS discussion (lines 93-98, 278), Express auth middleware (lines 54-68), React AuthContext/Provider (lines 164-252), refresh token strategy (lines 135-152)
- must_not violations: None. Refresh token is in httpOnly cookie; access token in memory, never localStorage.
- Completeness: 5 -- Covers all required items plus registration, logout, auto-refresh on 401, and security considerations.
- Precision: 5 -- All claims are correct; bcrypt cost 12, httpOnly secure sameSite cookies, proper JWT verification.
- Actionability: 5 -- Complete working code for every layer; copy-paste ready.
- Structure: 5 -- Clear step-by-step with labeled code blocks, architecture diagram, security section.
- Efficiency: 4 -- Very thorough but lengthy; some code could be trimmed.
- Depth: 5 -- Non-obvious details: user enumeration prevention, sameSite CSRF protection, rate limiting suggestion, auto-refresh flow.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- bcrypt (line 56), refresh tokens with DB hash storage (line 79), Express middleware (lines 31-44), React auth context (lines 69-75), refresh token strategy (lines 78-80)
- must_not violations: None. Tokens stored with SHA-256 hash in DB; no localStorage for JWT without XSS discussion.
- Completeness: 4 -- Covers all must-mention items but code is more abbreviated (checkout logic summarized as pseudocode).
- Precision: 5 -- All claims accurate; SHA-256 hashed refresh tokens in DB is a strong security pattern.
- Actionability: 4 -- Key code shown but some parts are skeletal (checkout is pseudocode).
- Structure: 5 -- Clean tables for API endpoints, clear section headers, concise.
- Efficiency: 5 -- Very dense; no filler. Every line adds value.
- Depth: 4 -- Good security decisions (DB-stored hashed refresh tokens, enumeration prevention) but less implementation detail than D.
- **Composite: 4.60**

### Condition F
- must_mention coverage: 4/5 -- bcrypt (line 58), Express middleware (lines 27-38), React auth context (lines 97-133), refresh token strategy (lines 81-91). MISSED: JWT stored in localStorage (lines 109-110) without adequate XSS risk discussion.
- must_not violations: 1 -- Puts both accessToken and refreshToken in localStorage (lines 109-110, 155-156) with only a brief mention of "use HTTPS" but no XSS risk discussion. This is a must_not violation.
- Completeness: 4 -- All functional pieces present but the security tradeoff discussion is absent.
- Precision: 3 -- localStorage for refresh tokens is a security concern that goes unaddressed. The "security checklist" at end mentions HTTPS but not XSS/localStorage risk.
- Actionability: 5 -- Most complete working code of all three; Axios interceptor pattern is production-ready.
- Structure: 4 -- Good organization but less polished than D or E.
- Efficiency: 4 -- Good signal density; some redundancy between code and summary.
- Depth: 3 -- Misses the critical httpOnly cookie vs localStorage tradeoff that the ground truth specifically tests for.
- **Composite: 3.73**

---

## Task 2: fsd-002

**Ground Truth Summary:** Must mention: JOIN queries or dataloader pattern, specific SQL example (LEFT JOIN posts/users/comments), pagination, frontend caching. Must not: suggest only frontend caching.

### Condition D
- must_mention coverage: 4/4 -- JOIN with specific SQL (lines 316-335), DataLoader pattern (lines 359-385), pagination mention (line 409), frontend caching advice (lines 400-408)
- must_not violations: None. Server-side fix is primary; frontend advice is supplementary.
- Completeness: 5 -- Both JOIN and DataLoader approaches with indexes and frontend guidance.
- Precision: 5 -- SQL is correct; DataLoader usage is idiomatic; index choices are sound.
- Actionability: 5 -- Complete working code for both approaches with indexes.
- Structure: 5 -- Problem diagnosis, two solutions, indexes, frontend section, pagination.
- Efficiency: 4 -- Comprehensive but could be slightly more concise.
- Depth: 5 -- Shows problematic code, two fix approaches, database indexes, frontend anti-pattern, scaling note.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- JOIN with SQL (lines 99-113), pagination via LIMIT/OFFSET (line 103), indexes (lines 131-135), frontend caching not explicitly discussed but server returns nested data.
- must_not violations: None.
- Completeness: 4 -- Covers JOINs, indexes, pagination. Frontend caching not explicitly addressed.
- Precision: 5 -- SQL is correct; query count analysis is accurate.
- Actionability: 4 -- Working code but single approach; DataLoader not shown.
- Structure: 4 -- Clean but less comprehensive than D.
- Efficiency: 5 -- Very concise; gets to the point quickly.
- Depth: 3 -- Only one approach; no DataLoader alternative; no frontend guidance.
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- JOIN with specific SQL (lines 209-231), DataLoader pattern (lines 236-258), pagination implicit in LIMIT, frontend not explicitly addressed but server-side fixes are primary.
- must_not violations: None.
- Completeness: 5 -- Both approaches shown with excellent SQL examples including COALESCE and json_agg.
- Precision: 5 -- SQL is correct; single-query JOIN approach with FILTER clause is advanced and accurate.
- Actionability: 5 -- Complete code for both approaches plus indexes.
- Structure: 4 -- Good organization with before/after but less structured than D.
- Efficiency: 5 -- Dense and efficient; clear recommendation at end.
- Depth: 5 -- The single-query JOIN with json_agg/FILTER is a more advanced solution than D's two-query approach.
- **Composite: 4.87**

---

## Task 3: fsd-003

**Ground Truth Summary:** Must mention: normalized tables (products, users, carts, cart_items, orders, order_items), foreign keys, cart-to-order conversion, inventory check with race condition awareness, API endpoints. Structure: schema DDL, API endpoint list.

### Condition D
- must_mention coverage: 5/5 -- All tables with DDL (lines 417-481), foreign keys (REFERENCES throughout), cart-to-order conversion (lines 538-605), race condition handling with FOR UPDATE (line 552), API endpoint table (lines 491-501)
- must_not violations: None.
- Completeness: 5 -- Full DDL, API table, complete checkout implementation with transaction locking.
- Precision: 5 -- FOR UPDATE locking is correct; price snapshot in order_items is proper e-commerce pattern.
- Actionability: 5 -- Production-ready code including upsert for cart, full checkout flow.
- Structure: 5 -- DDL, design decisions, API table, key implementations. Excellent.
- Efficiency: 4 -- Thorough but lengthy.
- Depth: 5 -- Price-in-cents, product snapshot, FOR UPDATE locking, UNIQUE constraint with ON CONFLICT upsert.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- Normalized tables (lines 148-179), foreign keys, cart-to-order conversion (lines 190-203), race condition with row locking mentioned (line 195), API endpoint list not shown as table but implied.
- must_not violations: None.
- Completeness: 4 -- Schema present but checkout is pseudocode; no API endpoint table.
- Precision: 5 -- Schema design is sound; mentions FOR UPDATE locking.
- Actionability: 3 -- Checkout is pseudocode comment, not actual implementation.
- Structure: 4 -- Has DDL and design decisions but missing API endpoint table.
- Efficiency: 4 -- Concise but the checkout pseudocode feels incomplete.
- Depth: 4 -- Good design decisions but lacks the implementation depth of D.
- **Composite: 4.07**

### Condition F
- must_mention coverage: 5/5 -- Full DDL (lines 280-326), foreign keys, cart-to-order (lines 345-388), FOR UPDATE locking (line 354), API table (lines 330-340)
- must_not violations: None.
- Completeness: 5 -- Complete schema, API table, full checkout implementation.
- Precision: 5 -- All code is correct; FOR UPDATE OF p is proper row-level locking.
- Actionability: 5 -- Complete working checkout with transaction, stock validation, and rollback.
- Structure: 5 -- Clean DDL, API table, complete checkout code.
- Efficiency: 5 -- Dense and complete without unnecessary padding.
- Depth: 5 -- Same quality as D: price snapshot, FOR UPDATE, atomic transaction.
- **Composite: 5.00**

---

## Task 4: fsd-004

**Ground Truth Summary:** Must mention: SSE as simplest option (not WebSocket for unidirectional), EventSource API on frontend, Express SSE implementation, reconnection handling, polling as fallback. Must not: jump to WebSocket/Socket.IO as primary recommendation.

### Condition D
- must_mention coverage: 5/5 -- SSE recommended over WebSocket (line 616-617), EventSource API (line 709), Express SSE implementation (lines 630-668), reconnection (line 719: "reconnects automatically"), polling not mentioned but alternative WebSocket discussed.
- must_not violations: None. Explicitly says WebSockets are overkill for notifications.
- Completeness: 5 -- SSE backend, frontend hook, UI component, scaling with Redis Pub/Sub.
- Precision: 5 -- SSE headers correct; keep-alive ping pattern is proper.
- Actionability: 5 -- Complete working code for both backend and frontend.
- Structure: 5 -- Backend, frontend hook, UI component, scaling section.
- Efficiency: 4 -- The UI component (NotificationBell) is nice but adds length.
- Depth: 5 -- Redis Pub/Sub scaling, keep-alive pings, token-via-query-param workaround for EventSource.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/5 -- SSE recommended (line 211-212), EventSource API (line 244), Express SSE implementation (lines 217-233), reconnection not explicitly mentioned. Polling not mentioned.
- must_not violations: None. Clearly states SSE over WebSocket.
- Completeness: 4 -- Core implementation covered but reconnection and polling fallback missing.
- Precision: 5 -- All code is correct.
- Actionability: 4 -- Working code but less complete (no UI component, no scaling detail).
- Structure: 4 -- Clean but brief.
- Efficiency: 5 -- Very concise; high signal density.
- Depth: 3 -- Missing reconnection handling discussion and scaling details are one-liner.
- **Composite: 4.13**

### Condition F
- must_mention coverage: 5/5 -- SSE recommended (line 399), EventSource API (line 449), Express SSE implementation (lines 404-432), reconnection ("auto-reconnects" line 399), polling not explicitly mentioned but SSE is presented as the solution.
- must_not violations: None. Explicitly states WebSocket only for bidirectional.
- Completeness: 5 -- Backend, frontend with mark-read, scaling note, clear WebSocket comparison.
- Precision: 5 -- All code correct; named events (line 430) is a nice SSE detail.
- Actionability: 5 -- Complete code with mark-read functionality.
- Structure: 4 -- Good organization but slightly less polished than D.
- Efficiency: 5 -- Dense and efficient.
- Depth: 4 -- Named SSE events, mark-read, scaling advice. Good but D's Redis Pub/Sub example is more detailed.
- **Composite: 4.73**

---

## Task 5: fsd-005

**Ground Truth Summary:** Must mention: build React for production, process manager (PM2/systemd), reverse proxy (nginx), environment variables for secrets, HTTPS (Let's Encrypt). Must not: suggest Kubernetes, skip HTTPS.

### Condition D
- must_mention coverage: 5/5 -- React build (lines 805-808), PM2 (lines 843-853), reverse proxy with Caddy (lines 868-889), env vars (lines 857-864), HTTPS via Caddy/Let's Encrypt (lines 868-889)
- must_not violations: None. Docker alternative is offered but K8s is not suggested.
- Completeness: 5 -- All items covered plus Docker alternative, PostgreSQL setup, production checklist.
- Precision: 5 -- Caddy auto-TLS is correct; PM2 cluster mode is proper.
- Actionability: 5 -- Complete Caddyfile, PM2 commands, Docker compose, Dockerfile.
- Structure: 5 -- Step-by-step with production checklist table.
- Efficiency: 4 -- Docker alternative adds bulk; could be separate.
- Depth: 5 -- Helmet, compression, firewall rules, health check, backup cron, cost estimate.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- React build implied in deploy script (line 309), PM2 (lines 289-298), Caddy reverse proxy (lines 274-285), env vars (line 318), HTTPS via Caddy (line 270)
- must_not violations: None. Explicitly says "Do not use Docker/K8s for a single app" (line 315).
- Completeness: 5 -- All must-mention items plus deploy script and anti-patterns list.
- Precision: 5 -- All recommendations are sound.
- Actionability: 5 -- Caddyfile, PM2 config, deploy script are production-ready.
- Structure: 5 -- Clean table, clear sections, anti-pattern list.
- Efficiency: 5 -- Very concise and complete; every section adds value.
- Depth: 4 -- Good anti-patterns list but less detail than D (no Docker alternative, no DB setup).
- **Composite: 4.80**

### Condition F
- must_mention coverage: 5/5 -- React build in Dockerfile (lines 481-497), process management via Docker restart (line 507), Caddy reverse proxy (lines 540-546), env vars via .env (line 553), HTTPS via Caddy (line 540)
- must_not violations: None. Docker is used but as a container setup, not K8s.
- Completeness: 5 -- Full Docker Compose stack with Caddy, multi-stage Dockerfile.
- Precision: 4 -- Docker Compose is correct but suggests no non-Docker path. PM2 not mentioned; relies on Docker restart policy.
- Actionability: 5 -- Copy-paste Docker Compose and deploy commands.
- Structure: 5 -- Clean numbered steps, production checklist table.
- Efficiency: 5 -- Focused and complete.
- Depth: 4 -- Multi-stage Docker build, health checks, but no non-Docker alternative for simpler setups.
- **Composite: 4.60**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| fsd-001 | 4.87 | 4.60 | 3.73 |
| fsd-002 | 4.87 | 4.20 | 4.87 |
| fsd-003 | 4.87 | 4.07 | 5.00 |
| fsd-004 | 4.87 | 4.13 | 4.73 |
| fsd-005 | 4.87 | 4.80 | 4.60 |
| **Mean** | **4.87** | **4.36** | **4.59** |
| E LIFT (vs D) | -- | -0.51 | -- |
| F LIFT (vs D) | -- | -- | -0.28 |
| F vs E | -- | -- | +0.23 |
