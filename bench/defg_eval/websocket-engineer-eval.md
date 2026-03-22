# websocket-engineer Evaluation (D/E/F/G)

## Task 1: ws-001

**Ground Truth Summary:** Design WebSocket architecture for collaborative editor, 500 concurrent users/doc. Must mention OT or CRDT, connection management (heartbeat, reconnection, state sync), horizontal scaling (sticky sessions or pub/sub), message ordering. Should include architecture diagram and tech recommendations.

### Condition D
- must_mention coverage: 4/4 — OT and CRDT explained (yes), connection management with heartbeat/reconnection/state sync (yes), horizontal scaling with Redis pub/sub and sticky sessions (yes), message ordering via CRDT (yes)
- must_not violations: none
- Completeness: 5 — Covers conflict resolution, fan-out, presence, connection management, persistence, security
- Precision: 5 — Accurate, Yjs recommendation well-justified
- Actionability: 5 — Specific library recommendation (Yjs), architecture diagram, concrete numbers (50-100ms batching)
- Structure: 5 — Architecture diagram, numbered challenges, clear recommendations
- Efficiency: 4 — Thorough
- Depth: 5 — Backpressure handling, delta compression, awareness protocol, snapshot/GC strategy
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — CRDT/OT (yes), connection management (yes, rooms, Redis), scaling (yes, Redis pub/sub, sticky), message ordering via Yjs (yes)
- must_not violations: none
- Completeness: 4 — Covers key points with message contract table
- Precision: 5 — Accurate
- Actionability: 4 — Recommendations but less specific architecture detail
- Structure: 4 — Numbered challenges, message contract table
- Efficiency: 5 — Very concise
- Depth: 4 — Binary encoding, awareness throttling, sync protocol
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/4 — All covered with Yjs code example
- must_not violations: none
- Completeness: 5 — Architecture diagram, Yjs code, persistence, scaling
- Precision: 5 — Accurate, working code example
- Actionability: 5 — Yjs code example, recommendation table
- Structure: 5 — ASCII diagram, code, summary table
- Efficiency: 4 — Good balance
- Depth: 4 — Yjs integration code, debounced persistence, awareness protocol
- **Composite: 4.73**

### Condition G
- must_mention coverage: 4/4 — OT and CRDT compared in depth, connection management, scaling with Redis pub/sub, message ordering
- must_not violations: none
- Completeness: 5 — Six challenges addressed, detailed message contract
- Precision: 5 — Accurate, OT vs CRDT tradeoffs well-explained
- Actionability: 5 — Architecture diagram, message contract, specific recommendations
- Structure: 5 — Challenges and solutions format, architecture diagram, message contract table
- Efficiency: 3 — Most verbose
- Depth: 5 — O(n^2) fan-out analysis, viewport-aware broadcasting, bounded operation log, binary encoding, sequence numbers for reconnect
- **Composite: 4.73**

---

## Task 2: ws-002

**Ground Truth Summary:** WebSocket drops after 60s. Must mention ping/pong frames, proxy/LB timeout settings (nginx proxy_read_timeout), client-side reconnection with backoff, specific config examples. Must NOT only say "add keepalive" without details.

### Condition D
- must_mention coverage: 4/4 — Ping/pong frames (yes, with ws library code), nginx proxy_read_timeout (yes, with config), client reconnection with backoff (yes, with jitter), specific configs (yes)
- must_not violations: none (detailed implementation provided)
- Completeness: 5 — Server heartbeat, client application-level ping, proxy config, reconnection
- Precision: 5 — Accurate, explains why 30s interval
- Actionability: 5 — Complete code for server and client, nginx and AWS ALB configs
- Structure: 5 — Root cause, fix, proxy config, reconnection
- Efficiency: 4 — Thorough
- Depth: 5 — Proxy stripping control frames explanation, AWS ALB config, application-level vs protocol-level pings distinction
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 4 — Heartbeat code, proxy config
- Precision: 5 — Accurate
- Actionability: 4 — Code and nginx config
- Structure: 4 — Two fixes
- Efficiency: 5 — Very concise
- Depth: 3 — Less explanation of why
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 — All covered with reconnection class
- must_not violations: none
- Completeness: 5 — Server ping, client heartbeat class, proxy config
- Precision: 5 — Accurate
- Actionability: 5 — Complete ReconnectingWebSocket class, nginx config, AWS ALB
- Structure: 5 — Root cause, server fix, client fix, proxy config
- Efficiency: 4 — Good detail
- Depth: 5 — Browser pong behavior explained, application-level backup heartbeat, AWS ALB config
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 — All covered with detailed explanation
- must_not violations: none
- Completeness: 5 — Server, client, proxy, explanation of why 30s
- Precision: 5 — Accurate, RFC 6455 reference
- Actionability: 5 — Complete code, configs
- Structure: 5 — Root cause, fix, infrastructure, rationale for 30s
- Efficiency: 3 — Most verbose, includes ReconnectingWebSocket class
- Depth: 5 — RFC reference, explains why server sends pings not client, 30s vs 55s rationale, AWS ALB command, NAT gateway mention
- **Composite: 4.73**

---

## Task 3: ws-003

**Ground Truth Summary:** Authenticate WebSocket with JWT. Must mention token in upgrade request (query or header), validate during handshake (not after), handle token expiration mid-connection, security: don't put token in URL if logs capture query strings. Should include code example.

### Condition D
- must_mention coverage: 4/4 — Token in upgrade request: query param and Sec-WebSocket-Protocol header (yes), validate during handshake (yes), token expiration/refresh (yes), URL logging security concern (yes)
- must_not violations: none
- Completeness: 5 — Three approaches (query, protocol header, post-connect auth), token refresh, security considerations
- Precision: 5 — Accurate
- Actionability: 5 — Complete code for all three approaches
- Structure: 5 — Options clearly separated, security section
- Efficiency: 4 — Three approaches may be more than needed
- Depth: 5 — Post-connect auth with timeout, short-lived tokens, close code conventions (4000-4999), Sec-WebSocket-Protocol trick
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 4 — Query param approach, token refresh, security note
- Precision: 5 — Accurate
- Actionability: 4 — Code example, short-lived token suggestion
- Structure: 4 — Good
- Efficiency: 5 — Concise
- Depth: 4 — WS ticket from REST API, custom close code, Authorization header note
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/4 — All covered with cookie-based alternative
- must_not violations: none
- Completeness: 5 — Query param, cookie, token refresh with periodic check
- Precision: 5 — Accurate
- Actionability: 5 — Complete code for query, cookie, and refresh
- Structure: 5 — Approaches clearly labeled
- Efficiency: 4 — Good balance
- Depth: 5 — Cookie-based auth, periodic expiry check with timeout, token refresh protocol, reverse proxy log config suggestion
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 — All covered with one-time ticket pattern
- must_not violations: none
- Completeness: 5 — Query param with ticket, token refresh, security
- Precision: 5 — Accurate
- Actionability: 5 — Complete code including REST endpoint for ws-ticket
- Structure: 4 — Clear sections
- Efficiency: 4 — Good
- Depth: 5 — One-time WS ticket from REST API (ws-ticket endpoint with 60s expiry), custom close code 4401, Authorization header limitation explained
- **Composite: 4.73**

---

## Task 4: ws-004

**Ground Truth Summary:** Scale Socket.IO beyond single process, 10K connections. Must mention Redis adapter (@socket.io/redis-adapter), sticky sessions with LB, horizontal scaling (PM2 cluster or K8s pods), room/namespace across nodes. Must NOT suggest rewriting as first option.

### Condition D
- must_mention coverage: 4/4 — Redis adapter (yes, with code), sticky sessions (yes, nginx ip_hash), horizontal scaling: cluster module and LB (yes), rooms across nodes via Redis pub/sub (yes)
- must_not violations: none
- Completeness: 5 — Four steps, capacity planning, Redis Streams alternative
- Precision: 5 — Accurate
- Actionability: 5 — npm install, full configuration code, nginx config, cluster code
- Structure: 5 — Numbered steps, capacity planning section
- Efficiency: 4 — Thorough
- Depth: 5 — Redis Streams adapter alternative, transport tuning, cookie-based stickiness mention, capacity numbers
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 4 — Redis adapter, PM2, sticky sessions, state externalization
- Precision: 5 — Accurate
- Actionability: 4 — Code snippets, PM2 command, nginx config
- Structure: 4 — Steps
- Efficiency: 5 — Very concise
- Depth: 4 — WebSocket-only transport to skip sticky, OS tuning, capacity estimate
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/4 — All covered with docker-compose
- must_not violations: none
- Completeness: 5 — Redis adapter, docker-compose, nginx, externalized state, OS tuning
- Precision: 5 — Accurate
- Actionability: 5 — Complete docker-compose, nginx config, Redis state code, OS tuning commands
- Structure: 5 — Six steps, capacity table
- Efficiency: 4 — Detailed
- Depth: 5 — Docker-compose deployment, externalized session state in Redis, OS-level tuning (ulimit, somaxconn, tcp_max_syn_backlog), WebSocket-only option
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 5 — Redis adapter, sticky sessions, PM2, capacity
- Precision: 5 — Accurate
- Actionability: 5 — npm install, code, nginx config, PM2 command
- Structure: 5 — Steps, capacity table
- Efficiency: 4 — Good balance
- Depth: 4 — WebSocket-only transport option, capacity estimates
- **Composite: 4.73**

---

## Task 5: ws-005

**Ground Truth Summary:** Rate limiting WebSocket messages, 10/sec max. Must mention token bucket or sliding window per connection, server-side enforcement, graceful handling (warning before disconnect), per-user vs per-connection. Should include algorithm choice reasoning and code sketch.

### Condition D
- must_mention coverage: 4/4 — Token bucket (yes, with reasoning), server-side enforcement (yes), graceful handling with progressive violations (yes), per-user vs per-connection (yes)
- must_not violations: none
- Completeness: 5 — Token bucket implementation, graduated violation handling, client-side queue, per-user vs per-connection, message-type differentiation
- Precision: 5 — Accurate
- Actionability: 5 — Complete TokenBucket class, server integration, client MessageQueue class
- Structure: 5 — Algorithm, integration, escalation table, considerations
- Efficiency: 4 — Thorough
- Depth: 5 — Progressive violations (3 tiers), client-side courtesy throttle, message-type differentiation, monitoring advice, WeakMap for memory management
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 4 — Token bucket, escalation, multi-instance mention
- Precision: 5 — Accurate
- Actionability: 4 — Code, escalation table
- Structure: 4 — Good
- Efficiency: 5 — Concise
- Depth: 4 — Temporary mute level, Redis INCR for multi-instance, client-side courtesy
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 5 — Token bucket, violations, client-side rate limiting, per-message-type limits
- Precision: 5 — Accurate
- Actionability: 5 — Complete code, escalation ladder, client class, monitoring metrics
- Structure: 5 — Clear sections
- Efficiency: 4 — Good balance
- Depth: 5 — Per-message-type rate limits (chat/cursor/doc), monitoring metrics (prometheus-style), client-side RateLimitedSocket class, violation decay
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 4 — Token bucket, cooldown approach, escalation
- Precision: 5 — Accurate
- Actionability: 5 — Complete code with cooldown mechanism
- Structure: 4 — Escalation table
- Efficiency: 4 — Good
- Depth: 4 — Burst capacity (15 vs 10), cooldown period, WeakMap for cleanup
- **Composite: 4.47**

---

## Summary

| Task | D | E | F | G |
|------|---|---|---|---|
| ws-001 | 4.87 | 4.47 | 4.73 | 4.73 |
| ws-002 | 4.87 | 4.20 | 4.87 | 4.73 |
| ws-003 | 4.87 | 4.47 | 4.87 | 4.73 |
| ws-004 | 4.87 | 4.47 | 4.87 | 4.73 |
| ws-005 | 4.87 | 4.47 | 4.87 | 4.47 |
| **Mean** | **4.87** | **4.42** | **4.84** | **4.68** |
