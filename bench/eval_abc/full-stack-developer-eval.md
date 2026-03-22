# full-stack-developer Evaluation (A/B/C)

## Task 1: fsd-001

**Ground Truth Summary:** Must mention: bcrypt password hashing, JWT storage tradeoff (httpOnly cookie vs localStorage), Express middleware for protected routes, React auth context/provider, refresh token strategy. Must not: store passwords in plain text, put JWT in localStorage without discussing XSS risk.

### Condition A (bare)
- must_mention coverage: 5/5 -- bcrypt (yes), httpOnly cookie with XSS discussion (yes), middleware (yes), AuthContext/provider (yes), refresh token (yes)
- must_not violations: None. Explicitly warns against localStorage and explains XSS risk.
- Completeness: 5 -- Covers all required items plus extras (CSRF, rate limiting mention, authFetch wrapper)
- Precision: 5 -- All claims are technically accurate, code is correct
- Actionability: 5 -- Complete working code for every component, ready to integrate
- Structure: 4 -- Well organized with code blocks and sections, though quite long
- Efficiency: 4 -- Thorough but slightly verbose with the authFetch interceptor code
- Depth: 5 -- Discusses XSS risk, user enumeration prevention, CSRF via sameSite
- **Composite: 4.73**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- bcrypt (yes), httpOnly cookie with discussion (yes), middleware (yes), AuthContext (yes), refresh token with rotation (yes)
- must_not violations: None. Security checklist explicitly warns against localStorage.
- Completeness: 5 -- All items covered plus Axios interceptor for token refresh
- Precision: 5 -- Code is correct, security advice sound
- Actionability: 5 -- Complete working code for backend and frontend
- Structure: 5 -- Clean numbered sections, security checklist summary
- Efficiency: 4 -- Very comprehensive but some redundancy in refresh token handling
- Depth: 5 -- Discusses CSRF, XSS, rate limiting, refresh token rotation
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 4/5 -- bcrypt (yes), httpOnly cookie (yes), middleware (yes), AuthContext (yes), refresh token: PARTIAL (uses single long-lived token rather than access+refresh strategy)
- must_not violations: None. Uses httpOnly cookies, warns against localStorage.
- Completeness: 4 -- Missing proper refresh token strategy (uses single 7-day token instead of access+refresh pair)
- Precision: 4 -- Code works but single-token approach is less secure than access+refresh
- Actionability: 5 -- Complete working code, simpler to implement
- Structure: 4 -- Well organized with clear sections
- Efficiency: 4 -- Good density, not overly verbose
- Depth: 4 -- Security checklist present but less nuanced on token strategy
- **Composite: 4.27**

---

## Task 2: fsd-002

**Ground Truth Summary:** Must mention: JOIN queries or dataloader pattern, specific SQL example (LEFT JOIN), pagination, frontend caching. Must not: suggest only frontend caching.

### Condition A (bare)
- must_mention coverage: 4/4 -- JOIN with SQL (yes), DataLoader pattern (yes), pagination via LIMIT (yes), React Query caching (yes)
- must_not violations: None. Problem correctly identified as server-side.
- Completeness: 5 -- Both JOIN and DataLoader approaches plus indexes and frontend caching
- Precision: 5 -- SQL is correct, DataLoader implementation accurate
- Actionability: 5 -- Complete code for both approaches, runnable
- Structure: 5 -- Clear problem/solution/recommendation flow
- Efficiency: 4 -- Shows both approaches which adds length but is valuable
- Depth: 5 -- Explains when to use each approach, includes cursor pagination
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- JOIN with json_agg (yes), DataLoader (yes), pagination with LIMIT (yes), React Query caching (yes)
- must_not violations: None
- Completeness: 5 -- Same breadth as A, adds database indexes
- Precision: 5 -- SQL and code correct
- Actionability: 5 -- Working code examples
- Structure: 5 -- Clean diagnosis -> solutions -> frontend flow
- Efficiency: 5 -- Dense, well-organized without filler
- Depth: 5 -- Explains query count math, includes scaling section
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- JOIN with json_agg (yes), DataLoader/batch (yes), cursor pagination (yes), React frontend caching (yes, though less explicit)
- must_not violations: None
- Completeness: 5 -- Both approaches, indexes, pagination, frontend advice
- Precision: 5 -- Code is correct
- Actionability: 5 -- Complete runnable code
- Structure: 5 -- Problem -> Approach A -> Approach B -> indexes -> frontend -> summary table
- Efficiency: 4 -- Slightly longer than needed
- Depth: 5 -- Includes cursor pagination, comparison table
- **Composite: 4.87**

---

## Task 3: fsd-003

**Ground Truth Summary:** Must mention: normalized tables (products, users, carts, cart_items, orders, order_items), foreign keys, cart-to-order conversion, inventory check with race condition awareness, API endpoints. Structure: schema DDL, API endpoint list.

### Condition A (bare)
- must_mention coverage: 5/5 -- Normalized tables (yes), foreign keys (yes), cart-to-order (yes), race condition with FOR UPDATE (yes), API endpoints table (yes)
- must_not violations: None
- Completeness: 5 -- Full DDL, API table, checkout implementation
- Precision: 5 -- FOR UPDATE locking is correct, transaction handling proper
- Actionability: 5 -- Complete working checkout code with error handling
- Structure: 5 -- DDL -> API table -> implementation code
- Efficiency: 4 -- Comprehensive but lengthy
- Depth: 5 -- Discusses price snapshots, cents-based pricing, FOR UPDATE locks
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- All normalized tables (yes), foreign keys (yes), cart-to-order (yes), race condition with FOR UPDATE (yes), API endpoints (yes)
- must_not violations: None
- Completeness: 5 -- Full DDL, complete API, key design decisions
- Precision: 5 -- Transaction handling and locking correct
- Actionability: 5 -- Complete working code
- Structure: 5 -- Schema DDL -> API table -> code -> design decisions
- Efficiency: 5 -- Well organized without excess
- Depth: 5 -- Price snapshots, UNIQUE constraints, FOR UPDATE, CHECK constraints
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- All tables (yes), FKs (yes), cart-to-order (yes), FOR UPDATE race condition handling (yes), API endpoints (yes)
- must_not violations: None
- Completeness: 5 -- Full schema, API routes, checkout code
- Precision: 5 -- Correct transactional handling
- Actionability: 5 -- Complete working code
- Structure: 5 -- Clean DDL -> API listing -> implementation
- Efficiency: 4 -- Thorough but lengthy code
- Depth: 5 -- Same race condition awareness, price snapshots
- **Composite: 4.87**

---

## Task 4: fsd-004

**Ground Truth Summary:** Must mention: SSE as simplest option (not WebSocket for unidirectional), EventSource API, Express SSE implementation, reconnection handling, polling as fallback. Must not: jump to WebSocket/Socket.IO for unidirectional notifications.

### Condition A (bare)
- must_mention coverage: 4/5 -- SSE (yes), EventSource (yes), Express SSE implementation (yes), reconnection (mentioned as automatic), polling as fallback (not explicitly mentioned)
- must_not violations: None. Explicitly recommends SSE over WebSocket for this use case.
- Completeness: 4 -- Covers SSE thoroughly but misses explicit polling fallback mention
- Precision: 5 -- SSE implementation is correct
- Actionability: 5 -- Complete working code for backend and frontend
- Structure: 5 -- Well-organized with backend, frontend, scaling sections
- Efficiency: 4 -- Multi-server Redis section adds value but is extra
- Depth: 5 -- Covers keep-alive, nginx buffering, Redis pub/sub scaling
- **Composite: 4.67**

### Condition B (v1 agents)
- must_mention coverage: 4/5 -- SSE (yes), EventSource (yes), Express SSE (yes), reconnection (yes, automatic), polling fallback (not explicitly mentioned)
- must_not violations: None. Correctly chose SSE over WebSocket.
- Completeness: 4 -- Strong SSE coverage, missing explicit polling fallback
- Precision: 5 -- Implementation correct
- Actionability: 5 -- Complete working code with UI component
- Structure: 5 -- Clean sections with architecture note
- Efficiency: 4 -- Redis scaling section is thorough
- Depth: 5 -- Keep-alive pings, nginx X-Accel-Buffering, multi-server
- **Composite: 4.67**

### Condition C (v2 agents)
- must_mention coverage: 3/5 -- SSE (yes), EventSource (yes), Express SSE (yes), reconnection (yes), polling fallback (no). BUT: chose Socket.IO initially in comparison section, then pivoted to SSE approach
- must_not violations: PARTIAL -- The output actually recommends SSE, includes a comparison table favoring SSE, does NOT jump to Socket.IO. No violation.
- Completeness: 5 -- SSE with full implementation, database persistence for notifications, mark-as-read API, scaling notes
- Precision: 5 -- Code is correct, SSE comparison table accurate
- Actionability: 5 -- Complete working code with extra features (persistence, read status)
- Structure: 5 -- Why SSE -> Backend -> Frontend -> Scaling
- Efficiency: 4 -- Extra database table and mark-as-read adds scope
- Depth: 5 -- Persistence layer, read status, Redis scaling, comparison table
- **Composite: 4.87**

---

## Task 5: fsd-005

**Ground Truth Summary:** Must mention: build React for production, process manager (PM2/systemd), reverse proxy (nginx), env vars for secrets, HTTPS (Let's Encrypt). Must not: suggest Kubernetes, skip HTTPS.

### Condition A (bare)
- must_mention coverage: 5/5 -- React build (yes), PM2 (yes), Caddy as reverse proxy (yes, alternative to nginx), env vars (yes), HTTPS via Caddy/Let's Encrypt (yes)
- must_not violations: None. No Kubernetes; mentions upgrade path but as future step.
- Completeness: 5 -- All items covered plus deploy script, monitoring, upgrade path
- Precision: 5 -- Caddy setup is correct and arguably simpler than nginx
- Actionability: 5 -- Step-by-step with actual commands
- Structure: 5 -- Architecture diagram -> numbered steps -> upgrade path
- Efficiency: 4 -- Thorough, possibly more than "minimal" implies
- Depth: 5 -- Firewall config, log rotation, incremental upgrade path
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- React build (yes), PM2 (yes), Caddy reverse proxy (yes), env vars (yes), HTTPS via Caddy (yes)
- must_not violations: None
- Completeness: 5 -- Same coverage as A, with architecture diagram
- Precision: 5 -- All commands and configs correct
- Actionability: 5 -- Step-by-step deployment guide
- Structure: 5 -- Clean architecture -> steps -> monitoring
- Efficiency: 5 -- Well paced, not too long
- Depth: 5 -- Firewall, monitoring, upgrade path
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- React build (yes), Docker (process management alternative, yes), nginx in Docker (yes), env vars (yes), HTTPS (yes, via load balancer/Cloudflare)
- must_not violations: BORDERLINE -- Uses Docker Compose which is more complex than needed but NOT Kubernetes. Architecture diagram shows managed services. This is slightly over-engineered for "minimal" but not a K8s violation.
- Completeness: 5 -- Covers everything plus Docker, health checks, multi-stage build
- Precision: 4 -- Docker Compose approach works but may be more than "minimal production setup"
- Actionability: 5 -- Complete Dockerfiles, docker-compose.yml, deploy commands
- Structure: 5 -- Architecture -> Dockerfiles -> compose -> env -> deploy script
- Efficiency: 3 -- Over-scoped for "minimal" production setup
- Depth: 5 -- Non-root users, health checks, multi-stage builds
- **Composite: 4.40**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| fsd-001 | 4.73 | 4.87 | 4.27 |
| fsd-002 | 4.87 | 5.00 | 4.87 |
| fsd-003 | 4.87 | 5.00 | 4.87 |
| fsd-004 | 4.67 | 4.67 | 4.87 |
| fsd-005 | 4.87 | 5.00 | 4.40 |
| **Mean** | **4.80** | **4.91** | **4.65** |
| B LIFT (vs A) | -- | +0.11 | -- |
| C LIFT (vs A) | -- | -- | -0.15 |
| C vs B | -- | -- | -0.26 |
