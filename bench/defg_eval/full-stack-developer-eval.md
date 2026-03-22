# full-stack-developer Evaluation (D/E/F/G/H)

## Task 1: fsd-001

**Ground Truth Summary:** JWT auth for React+Express: must cover bcrypt, JWT storage tradeoffs (httpOnly vs localStorage XSS), Express middleware, React auth context, refresh tokens. Must not store plain passwords or use localStorage without XSS discussion.

### Condition D
- must_mention coverage: 5/5 -- bcrypt (cost 12), httpOnly cookie + XSS discussion, auth middleware, React AuthContext/Provider, refresh token (7d with rotation)
- must_not violations: None
- Code artifacts: No disk code (D=no code)
- Completeness: 5 -- All five must_mention items covered with working code
- Precision: 5 -- Correct bcrypt usage, proper cookie config, accurate security considerations
- Actionability: 5 -- Complete working code for all layers, copy-paste ready
- Structure: 5 -- Clear step-by-step with architecture diagram
- Efficiency: 4 -- Comprehensive but lengthy
- Depth: 5 -- Security considerations section, CSRF, rate limiting mention, user enumeration prevention
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- bcrypt (12 rounds), short-lived access + rotating refresh, middleware, AuthContext, refresh tokens in DB as SHA-256 hashes
- must_not violations: None
- Code artifacts: JS tests in src/ (103 tests); relevant to auth tasks
- Completeness: 5 -- All items covered with TypeScript code
- Precision: 5 -- SHA-256 hashed refresh tokens in DB is excellent practice
- Actionability: 5 -- Complete implementation with Zod validation
- Structure: 5 -- Well-organized with tables and clear sections
- Efficiency: 4 -- Concise yet complete
- Depth: 5 -- Separate refresh_tokens table, DB-hashed tokens, CSRF via sameSite
- **Composite: 4.87**

### Condition F
- must_mention coverage: 4/5 -- bcrypt, localStorage used (XSS risk NOT discussed), middleware, AuthContext, refresh tokens
- must_not violations: YES -- stores JWT in localStorage without discussing XSS risk
- Code artifacts: TS tests (74 tests); relevant
- Completeness: 4 -- Missing XSS discussion for localStorage choice
- Precision: 3 -- localStorage without XSS warning is a must_not violation
- Actionability: 5 -- Complete working code
- Structure: 4 -- Good organization
- Efficiency: 4 -- Reasonably concise
- Depth: 3 -- Security checklist mentions HTTPS but misses XSS risk of localStorage choice
- **Composite: 3.73**

### Condition G
- must_mention coverage: 5/5 -- bcrypt (cost 12), httpOnly cookies (explicitly states "not localStorage -- XSS risk"), requireAuth middleware, AuthContext, refresh tokens with SHA-256 hashing
- must_not violations: None
- Code artifacts: JS tests (68 tests in tmp/); somewhat relevant
- Completeness: 5 -- All items thoroughly covered
- Precision: 5 -- Correct and secure implementation
- Actionability: 5 -- Full TypeScript code with Zod validation, service layer
- Structure: 5 -- Clear numbered sections, good organization
- Efficiency: 4 -- Thorough but lengthy
- Depth: 5 -- DB-hashed refresh tokens, CSRF protection, user enumeration prevention, ProtectedRoute as "UX convenience, not security boundary"
- **Composite: 4.87**

### Condition H
- must_mention coverage: 5/5 -- bcrypt (cost 12), httpOnly cookies (explicit XSS discussion), requireAuth middleware, AuthContext, refresh token rotation with SHA-256 hashing
- must_not violations: None
- Code artifacts: JS tests (105 tests in tmp/); relevant
- Completeness: 5 -- All items covered with extensive code
- Precision: 5 -- Separate access/refresh secrets, token rotation deletes old token
- Actionability: 5 -- Full implementation including LoginPage, rate limiting, security checklist table
- Structure: 5 -- Excellent organization with security checklist table
- Efficiency: 3 -- Very lengthy (most verbose of all conditions)
- Depth: 5 -- Timing attack mention, token reuse detection, DB leak protection, rate limiting code
- **Composite: 4.73**

---

## Task 2: fsd-002

**Ground Truth Summary:** Fix N+1 queries: must mention JOINs/DataLoader, specific SQL example, pagination, frontend caching. Must not suggest only frontend caching.

### Condition D
- must_mention coverage: 4/4 -- JOIN queries with SQL examples, DataLoader pattern, pagination (LIMIT/cursor), frontend SWR caching
- must_not violations: None
- Completeness: 5 -- All items covered with both approaches
- Precision: 5 -- Accurate SQL with json_build_object, proper indexes
- Actionability: 5 -- Complete before/after code
- Structure: 5 -- Problem diagnosis, two solution approaches, indexes, frontend
- Efficiency: 4 -- Thorough
- Depth: 5 -- Database indexes, frontend anti-pattern example
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- JOIN + batch queries, SQL examples, pagination (LIMIT/OFFSET), frontend note
- must_not violations: None
- Completeness: 5 -- Covers all items
- Precision: 5 -- Correct SQL
- Actionability: 5 -- Working code
- Structure: 4 -- Good but less detailed than D
- Efficiency: 5 -- Concise
- Depth: 4 -- Good but less frontend detail
- **Composite: 4.73**

### Condition F
- must_mention coverage: 4/4 -- JOIN (single query with json_agg), DataLoader, pagination implied, no explicit frontend caching mention but overall correct
- must_not violations: None
- Completeness: 4 -- Frontend caching mentioned only briefly
- Precision: 5 -- Advanced single-query approach with json_agg and FILTER
- Actionability: 5 -- Complete code
- Structure: 4 -- Two approaches well-organized
- Efficiency: 5 -- Concise
- Depth: 4 -- Good SQL depth
- **Composite: 4.47**

### Condition G
- must_mention coverage: 4/4 -- JOIN + batch queries, specific SQL, pagination with Zod validation, frontend usePosts hook
- must_not violations: None
- Completeness: 5 -- All items covered
- Precision: 5 -- Correct implementation
- Actionability: 5 -- Complete code with route handler
- Structure: 5 -- Strategy 1/2 clearly separated
- Efficiency: 4 -- Detailed
- Depth: 5 -- Explains why JOIN for 1:1, batch for 1:M
- **Composite: 4.87**

### Condition H
- must_mention coverage: 4/4 -- JOIN + batch approaches, specific SQL, pagination, frontend usePosts hook
- must_not violations: None
- Completeness: 5 -- All items with two full approaches
- Precision: 5 -- Includes query logging/monitoring code
- Actionability: 5 -- Complete with measurement code
- Structure: 5 -- Clear diagnosis, two fixes, indexes, frontend, measurement
- Efficiency: 3 -- Very verbose
- Depth: 5 -- Query count monitoring code is unique and valuable
- **Composite: 4.73**

---

## Task 3: fsd-003

**Ground Truth Summary:** E-commerce cart schema: normalized tables, foreign keys, cart-to-order conversion, inventory race condition, CRUD API endpoints.

### Condition D
- must_mention coverage: 5/5 -- All tables with FKs, cart-to-order with transaction, FOR UPDATE locking, full API table
- must_not violations: None
- Completeness: 5 -- Complete schema + API + checkout code
- Precision: 5 -- Price in cents, UNIQUE constraint, FOR UPDATE
- Actionability: 5 -- Working checkout code with transaction
- Structure: 5 -- DDL, API table, key implementations
- Efficiency: 4 -- Thorough
- Depth: 5 -- Price snapshot, race condition handling
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- All tables, FKs, checkout transaction, FOR UPDATE, API endpoints
- must_not violations: None
- Completeness: 4 -- Checkout code is pseudo-code (comments only for lock/validate/create)
- Precision: 5 -- Correct schema design
- Actionability: 4 -- Checkout logic summarized, not fully implemented
- Structure: 4 -- Good but checkout abbreviated
- Efficiency: 5 -- Concise
- Depth: 4 -- Good design decisions section
- **Composite: 4.40**

### Condition F
- must_mention coverage: 5/5 -- All tables, FKs, full checkout with FOR UPDATE, API table
- must_not violations: None
- Completeness: 5 -- Complete implementation
- Precision: 5 -- Correct locking, stock validation
- Actionability: 5 -- Full checkout code
- Structure: 5 -- Well-organized
- Efficiency: 4 -- Good length
- Depth: 5 -- Race condition explanation at end
- **Composite: 4.87**

### Condition G
- must_mention coverage: 5/5 -- All tables (ENUM type for status), FKs, checkout with FOR UPDATE, API table with auth column, Zod validation schemas
- must_not violations: None
- Completeness: 5 -- Very complete with down migration
- Precision: 5 -- ENUM type, partial index, ISO country code validation
- Actionability: 5 -- Full code with validation schemas
- Structure: 5 -- Excellent organization
- Efficiency: 4 -- Detailed
- Depth: 5 -- Down migration, detailed design decisions, Zod schemas
- **Composite: 4.87**

### Condition H
- must_mention coverage: 5/5 -- All tables, FKs, FOR UPDATE checkout, API table, stock CHECK constraint
- must_not violations: None
- Completeness: 5 -- Complete with add-to-cart upsert and get-cart
- Precision: 5 -- stock_quantity CHECK >= 0 as DB-level guard
- Actionability: 5 -- Full CRUD code including upsert and get cart
- Structure: 5 -- Well-organized with design decisions
- Efficiency: 3 -- Very verbose
- Depth: 5 -- Multiple stock errors reported, detailed design explanations
- **Composite: 4.73**

---

## Task 4: fsd-004

**Ground Truth Summary:** Real-time notifications: SSE (not WebSocket for unidirectional), EventSource API, Express SSE pattern, reconnection, polling fallback. Must not jump to WebSocket/Socket.IO.

### Condition D
- must_mention coverage: 5/5 -- SSE recommended over WebSocket, EventSource, Express SSE implementation, reconnection (auto), polling alternative mentioned
- must_not violations: None -- explicitly says WebSocket is overkill
- Completeness: 5 -- All items covered
- Precision: 5 -- Correct SSE implementation with keepalive
- Actionability: 5 -- Full backend + frontend + notification trigger code
- Structure: 5 -- Backend, frontend hook, component, scaling notes
- Efficiency: 4 -- Thorough
- Depth: 5 -- Redis Pub/Sub scaling, keep-alive, multi-tab support
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/5 -- SSE, EventSource, Express SSE, reconnection; polling fallback not explicitly mentioned
- must_not violations: None
- Completeness: 4 -- Missing explicit polling fallback mention
- Precision: 5 -- Correct implementation
- Actionability: 5 -- Complete code
- Structure: 4 -- Good organization
- Efficiency: 5 -- Concise
- Depth: 4 -- Redis Pub/Sub scaling note
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/5 -- SSE, EventSource, Express SSE, reconnection (auto-reconnect noted); polling not mentioned
- must_not violations: None
- Completeness: 4 -- Missing polling fallback
- Precision: 5 -- Good implementation with named events
- Actionability: 5 -- Complete code with markRead
- Structure: 4 -- Good
- Efficiency: 5 -- Concise
- Depth: 4 -- Named events, mark-read functionality
- **Composite: 4.47**

### Condition G
- must_mention coverage: 4/5 -- SSE, EventSource, Express SSE with X-Accel-Buffering header, reconnection; polling not mentioned
- must_not violations: None
- Completeness: 5 -- Very thorough with notifications table, service layer
- Precision: 5 -- Correct, includes DB persistence
- Actionability: 5 -- Full implementation with notifications table
- Structure: 5 -- Backend, service, DB schema, frontend, component
- Efficiency: 4 -- Detailed
- Depth: 5 -- Notifications persisted to DB for offline users, partial index
- **Composite: 4.73**

### Condition H
- must_mention coverage: 4/5 -- SSE, EventSource, Express SSE, reconnection; polling not explicitly mentioned
- must_not violations: None
- Completeness: 5 -- Thorough with DB persistence
- Precision: 5 -- Correct implementation
- Actionability: 5 -- Full code
- Structure: 5 -- Well-organized
- Efficiency: 3 -- Very verbose
- Depth: 5 -- Notifications table, service layer, X-Accel-Buffering
- **Composite: 4.60**

---

## Task 5: fsd-005

**Ground Truth Summary:** Production deployment: React build, PM2/systemd, nginx reverse proxy, env vars for secrets, HTTPS. Must not suggest K8s or skip HTTPS.

### Condition D
- must_mention coverage: 5/5 -- npm run build, PM2 cluster mode, Caddy (reverse proxy), env vars, HTTPS via Caddy/Let's Encrypt
- must_not violations: None -- Docker mentioned as alternative, not K8s
- Completeness: 5 -- All items covered with Docker alternative
- Precision: 5 -- Caddy is a valid nginx alternative with auto-HTTPS
- Actionability: 5 -- Complete Caddyfile, PM2 commands, deploy steps
- Structure: 5 -- Step-by-step with checklist table
- Efficiency: 4 -- Thorough
- Depth: 5 -- Docker Compose alternative, production checklist, backup cron
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- npm run build, PM2, Caddy, env vars, HTTPS
- must_not violations: None -- says "Do not use Docker/K8s for single app"
- Completeness: 5 -- All items covered
- Precision: 5 -- Correct
- Actionability: 5 -- Deploy script, PM2 config
- Structure: 4 -- Good organization
- Efficiency: 5 -- Concise
- Depth: 4 -- Good "what NOT to do" section
- **Composite: 4.73**

### Condition F
- must_mention coverage: 5/5 -- npm run build (multi-stage Docker), Docker restart (process manager), Caddy, env vars, HTTPS
- must_not violations: None
- Completeness: 5 -- All items via Docker Compose approach
- Precision: 4 -- Docker-first approach is slightly overengineered for "minimal" but valid
- Actionability: 5 -- Complete docker-compose.yml
- Structure: 4 -- Good checklist table
- Efficiency: 4 -- Reasonable length
- Depth: 4 -- Health check, production checklist
- **Composite: 4.40**

### Condition G
- must_mention coverage: 5/5 -- npm run build, PM2, Caddy, env vars (mode 600), HTTPS
- must_not violations: None -- explicitly says "No Docker", "No Kubernetes"
- Completeness: 5 -- All items thoroughly covered
- Precision: 5 -- Managed DB recommendation, rsync deploy script
- Actionability: 5 -- Complete deploy script, Caddyfile, PM2 config
- Structure: 5 -- Step-by-step with checklist
- Efficiency: 4 -- Detailed
- Depth: 5 -- Managed DB advice, trust proxy, CORS config, "What NOT to do yet"
- **Composite: 4.87**

### Condition H
- must_mention coverage: 5/5 -- npm run build, PM2, Caddy, env vars, HTTPS
- must_not violations: None -- "No Docker", "No Kubernetes"
- Completeness: 5 -- All items covered
- Precision: 5 -- Identical quality to G (same content)
- Actionability: 5 -- Complete scripts and configs
- Structure: 5 -- Excellent organization
- Efficiency: 3 -- Very verbose
- Depth: 5 -- Same thorough coverage as G
- **Composite: 4.73**

---

## Summary

| Task | D | E | F | G | H |
|------|---|---|---|---|---|
| fsd-001 | 4.87 | 4.87 | 3.73 | 4.87 | 4.73 |
| fsd-002 | 4.87 | 4.73 | 4.47 | 4.87 | 4.73 |
| fsd-003 | 4.87 | 4.40 | 4.87 | 4.87 | 4.73 |
| fsd-004 | 4.87 | 4.47 | 4.47 | 4.73 | 4.60 |
| fsd-005 | 4.87 | 4.73 | 4.40 | 4.87 | 4.73 |
| **Mean** | **4.87** | **4.64** | **4.39** | **4.84** | **4.70** |
