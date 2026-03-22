# websocket-engineer Evaluation (D/E/F)

## Task 1: ws-001

**Ground Truth Summary:** Must mention: OT or CRDT for conflict resolution; connection management (heartbeat, reconnection, state sync); horizontal scaling (sticky sessions or pub/sub for cross-server); message ordering guarantees. Structure: architecture diagram or component list; specific technology recommendations.

### Condition D
- must_mention coverage: 4/4 -- Hit all: OT and CRDT with Yjs recommendation, connection management (heartbeat via references to Task 2, reconnection via CRDT merge, state sync), horizontal scaling (Redis Pub/Sub, sticky sessions via consistent hashing), message ordering (via CRDT causal ordering).
- must_not violations: None
- Completeness: 5 -- Covers conflict resolution, fan-out, presence/awareness, connection management, persistence, security references.
- Precision: 5 -- Accurate claims about Yjs, Redis Pub/Sub, CRDT properties.
- Actionability: 5 -- Specific technology choice (Yjs), concrete architecture diagram, delta compression details.
- Structure: 5 -- ASCII architecture diagram, numbered challenges, clear sections.
- Efficiency: 4 -- Thorough; presence/cursor section and persistence section add value but increase length.
- Depth: 5 -- Backpressure handling, delta compression sizes (20-100 bytes), coalescing window (50-100ms), snapshot + append-only log for persistence.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Hit all: CRDT via Yjs (OT mentioned as alternative), connection management (room-based, Redis for state), horizontal scaling (Redis pub/sub, sticky sessions), message ordering (via CRDT state vectors).
- must_not violations: None
- Completeness: 4 -- Covers key points plus message contract table with rate limits. Less detail on reconnection strategy.
- Precision: 5 -- Accurate.
- Actionability: 4 -- Technology recommendations clear; less implementation detail than D.
- Structure: 5 -- Clean sections, message contract table is excellent.
- Efficiency: 5 -- Very dense, message contract table packs a lot of info.
- Depth: 4 -- Good but less detail on backpressure, persistence, and presence protocol.
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- Hit all: CRDT (Yjs/Automerge, OT alternative), connection management (reconnection via state sync), horizontal scaling (Redis Pub/Sub, sticky sessions), message ordering (CRDT causal ordering).
- must_not violations: None
- Completeness: 5 -- Architecture diagram, Yjs code example, delta compression, persistence, multi-node scaling table.
- Precision: 5 -- Accurate, working Yjs code.
- Actionability: 5 -- Actual working Yjs server code snippet; recommendation table.
- Structure: 5 -- ASCII architecture diagram, code example, summary table.
- Efficiency: 4 -- Thorough.
- Depth: 5 -- Actual Yjs code with debounced persistence, broadcastToDoc pattern, snapshot strategy.
- **Composite: 4.87**

---

## Task 2: ws-002

**Ground Truth Summary:** Must mention: ping/pong frames (server-side heartbeat); proxy/load balancer timeout settings (nginx proxy_read_timeout); client-side reconnection logic with backoff; specific config examples. Must NOT: only say "add keepalive" without implementation details.

### Condition D
- must_mention coverage: 4/4 -- Hit all: ping/pong (WebSocket protocol-level + application-level), nginx proxy_read_timeout config, client-side reconnection with exponential backoff and jitter, AWS ALB config example.
- must_not violations: None
- Completeness: 5 -- Server ping/pong, application-level fallback, nginx config, AWS ALB config, reconnection with backoff+jitter.
- Precision: 5 -- Correct ws library ping/pong API, correct nginx directives.
- Actionability: 5 -- Full code for server, client, nginx, and AWS CLI.
- Structure: 5 -- Root cause -> server fix -> proxy fix -> reconnection strategy.
- Efficiency: 4 -- Comprehensive; application-level ping section adds length for proxy-stripping edge case.
- Depth: 5 -- Mentions some proxies strip control frames (justifying app-level pings), AWS ALB CLI command, backoff with jitter formula.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Hit all: server ping/pong, nginx proxy_read_timeout, client reconnection (implicit via combined approach suggestion).
- must_not violations: None
- Completeness: 4 -- Core items covered concisely. Client reconnection less detailed.
- Precision: 5 -- Accurate.
- Actionability: 4 -- Server code and nginx config provided. No explicit client reconnection code.
- Structure: 4 -- Two fixes clearly labeled, "apply both" instruction.
- Efficiency: 5 -- Very concise.
- Depth: 3 -- Less detail on root cause analysis, no AWS config, no backoff formula.
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- Hit all: server ping/pong, nginx proxy_read_timeout, client reconnection with random backoff, specific config examples.
- must_not violations: None
- Completeness: 5 -- Server code, client reconnection code, nginx config.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Full code for server, client, and nginx.
- Structure: 5 -- Server fix -> client fix -> proxy config; clear progression.
- Efficiency: 4 -- Good balance.
- Depth: 4 -- Mentions browser auto-responds to protocol pings. Less detail on AWS/other LBs.
- **Composite: 4.60**

---

## Task 3: ws-003

**Ground Truth Summary:** Must mention: token in initial HTTP upgrade request (query param or header); validate JWT during upgrade handshake (not after); handle token expiration mid-connection; security concern about token in URL if logs capture query strings. Structure: code example showing handshake auth.

### Condition D
- must_mention coverage: 4/4 -- Hit all: token in query param and Sec-WebSocket-Protocol header options, validate during upgrade (before connection), token refresh mid-connection, URL logging security concern with mitigation (short-lived tokens).
- must_not violations: None
- Completeness: 5 -- Three auth options (query, protocol header, post-connect with timeout), token refresh protocol, security considerations (TLS, revocation, close codes).
- Precision: 5 -- Correct use of ws library's noServer/handleUpgrade API, correct HTTP 401 response.
- Actionability: 5 -- Three full code examples, token refresh protocol, custom close codes.
- Structure: 5 -- Options A/B/C, security section.
- Efficiency: 3 -- Three approaches is thorough but verbose; Option C (post-connect auth) somewhat contradicts the "validate during upgrade" guidance.
- Depth: 5 -- Sec-WebSocket-Protocol trick, revocation checking, close code conventions (4000-4999 range), wss:// enforcement.
- **Composite: 4.53**

### Condition E
- must_mention coverage: 4/4 -- Hit all: token in query param, validate during upgrade, token expiry handling (auth:refresh message), URL logging security (short-lived tokens + dedicated WS token endpoint).
- must_not violations: None
- Completeness: 5 -- Query param approach, URL mitigation (dedicated WS token from REST API), token refresh protocol, Authorization header warning.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Code for server upgrade handler, WS ticket REST endpoint, token refresh.
- Structure: 4 -- Clean but single approach rather than options.
- Efficiency: 5 -- Focused on recommended approach, very dense.
- Depth: 5 -- Dedicated short-lived WS ticket endpoint is a best-practice detail; custom close code 4401; Authorization header limitation explained.
- **Composite: 4.87**

### Condition F
- must_mention coverage: 4/4 -- Hit all: token in query param, validate during upgrade handshake, token refresh for long-lived connections, URL logging security (short-lived ticket pattern).
- must_not violations: None
- Completeness: 5 -- One-time ticket pattern from REST API, server upgrade handler, token refresh.
- Precision: 5 -- Accurate code.
- Actionability: 5 -- Full code including REST ticket endpoint and client-side refresh.
- Structure: 5 -- Clean: recommended approach -> security note -> ticket endpoint -> token refresh.
- Efficiency: 5 -- Focused, every section adds value.
- Depth: 5 -- One-time ticket endpoint with 60s expiry and purpose claim is excellent security practice.
- **Composite: 5.00**

---

## Task 4: ws-004

**Ground Truth Summary:** Must mention: Redis adapter (@socket.io/redis-adapter); sticky sessions with load balancer; horizontal scaling with multiple processes (PM2 cluster or K8s pods); room/namespace considerations across nodes. Must NOT: suggest rewriting in a different framework as first option.

### Condition D
- must_mention coverage: 4/4 -- Hit all: @socket.io/redis-adapter, sticky sessions (nginx ip_hash, cookie-based), multiple processes (Node.js cluster + multiple hosts), room considerations (Redis Pub/Sub broadcasts to all nodes for room events).
- must_not violations: None
- Completeness: 5 -- Redis adapter, cluster code, nginx config, capacity planning, Redis Streams alternative.
- Precision: 5 -- Correct npm packages, correct Socket.IO adapter API.
- Actionability: 5 -- Full code for Redis adapter, Node.js cluster, nginx config, AWS sticky sessions.
- Structure: 5 -- Four numbered steps, capacity planning section.
- Efficiency: 4 -- Thorough; cluster code and Redis Streams alternative add length.
- Depth: 5 -- Cookie-based stickiness vs ip_hash, Redis Streams adapter for message ordering, capacity estimates (5K-10K per process).
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Hit all: Redis adapter, sticky sessions (nginx ip_hash), multiple processes (PM2), room/state externalization to Redis.
- must_not violations: None
- Completeness: 4 -- Core items covered; mentions WebSocket-only transport to skip sticky sessions.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Code snippets, PM2 command, nginx config.
- Structure: 4 -- Five steps, capacity estimate.
- Efficiency: 5 -- Very concise.
- Depth: 4 -- WebSocket-only transport trick is useful; OS tuning (ulimit). Less detail on capacity.
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- Hit all: Redis adapter, sticky sessions (nginx ip_hash), multiple processes (PM2), room considerations via Redis adapter.
- must_not violations: None
- Completeness: 4 -- Core items covered; WebSocket-only transport alternative.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Code for adapter, nginx, PM2 command.
- Structure: 5 -- Steps clearly numbered, capacity planning table.
- Efficiency: 5 -- Very concise with useful capacity table.
- Depth: 4 -- Capacity table with per-connection memory estimate is practical.
- **Composite: 4.60**

---

## Task 5: ws-005

**Ground Truth Summary:** Must mention: token bucket or sliding window algorithm per connection; server-side enforcement (not client-side); graceful handling (warning message before disconnect); consider per-user vs per-connection limits. Structure: algorithm choice with reasoning; code sketch or pseudocode.

### Condition D
- must_mention coverage: 4/4 -- Hit all: token bucket algorithm, server-side enforcement, graceful handling (progressive: reject -> warn -> disconnect), per-user vs per-connection discussion.
- must_not violations: None
- Completeness: 5 -- Token bucket class, server integration, graduated violation handling, client-side courtesy throttle, per-user with Redis, message-type differentiation.
- Precision: 5 -- Algorithm implementation correct, WeakMap usage correct.
- Actionability: 5 -- Full TokenBucket class, server integration code, client MessageQueue class.
- Structure: 5 -- Algorithm -> integration -> violation table -> client handling -> considerations.
- Efficiency: 4 -- Client-side MessageQueue and monitoring sections add length.
- Depth: 5 -- Message-type differentiation (different limits for chat vs cursor), gradual violation counter reset, WeakMap for GC, `ws.pause()` anti-pattern warning.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Hit all: token bucket, server-side enforcement, graceful handling (warn -> mute -> disconnect), per-user vs per-connection (Redis INCR for multi-instance).
- must_not violations: None
- Completeness: 5 -- Token bucket, violation escalation table, multi-instance consideration.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Full code for RateLimiter class and integration.
- Structure: 5 -- Clean: algorithm -> integration -> escalation table -> multi-instance.
- Efficiency: 5 -- Very dense, escalation table is clear.
- Depth: 4 -- Mute strategy is interesting; less detail on per-message-type differentiation.
- **Composite: 4.87**

### Condition F
- must_mention coverage: 4/4 -- Hit all: token bucket, server-side enforcement, graceful handling (warning + cooldown -> disconnect), per-connection tracking with WeakMap.
- must_not violations: None
- Completeness: 4 -- Core items covered. Per-user vs per-connection not explicitly discussed.
- Precision: 5 -- Accurate algorithm and integration.
- Actionability: 5 -- Full code.
- Structure: 5 -- Clean: algorithm -> integration -> escalation table.
- Efficiency: 5 -- Concise.
- Depth: 4 -- Cooldown mechanism with silently dropping during cooldown; burst of 15 with refill of 10 shows nuance.
- **Composite: 4.60**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| ws-001 | 4.87 | 4.53 | 4.87 |
| ws-002 | 4.87 | 4.20 | 4.60 |
| ws-003 | 4.53 | 4.87 | 5.00 |
| ws-004 | 4.87 | 4.53 | 4.60 |
| ws-005 | 4.87 | 4.87 | 4.60 |
| **Mean** | **4.80** | **4.60** | **4.73** |
| E LIFT (vs D) | — | -0.20 | — |
| F LIFT (vs D) | — | — | -0.07 |
| F vs E | — | — | +0.13 |
