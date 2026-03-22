# websocket-engineer Evaluation (D/E/F) -- Full

## Task 1: ws-001

**Ground Truth Summary:** Design WebSocket architecture for collaborative editor (500 concurrent users/doc). Must mention OT or CRDT, connection management (heartbeat, reconnection, state sync), horizontal scaling (sticky sessions or pub/sub), message ordering guarantees. Should include architecture diagram and tech recommendations.

### Condition D
- must_mention coverage: 4/4 -- OT and CRDT explained with Yjs recommendation, connection management (heartbeat, reconnection, backpressure), horizontal scaling (sticky sessions + Redis pub/sub), message ordering via CRDT causal ordering
- must_not violations: none
- Completeness: 5 -- Architecture diagram, 6 challenge areas, persistence strategy, security reference
- Precision: 5 -- Yjs details accurate, binary encoding claim correct, awareness protocol real
- Actionability: 5 -- Specific technology recommendation (Yjs), concrete parameters (50-100ms batching)
- Structure: 5 -- ASCII architecture diagram, numbered challenges, clear sections
- Efficiency: 4 -- Thorough, well-organized
- Depth: 5 -- Backpressure strategy, delta compression, awareness throttling, persistence snapshotting
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- CRDT (Yjs) + OT alternative, connection management (rooms, Redis, reconnection), multi-server scaling (Redis pub/sub, sticky sessions), message contract table with rates
- must_not violations: none
- Completeness: 4 -- Covers key areas, message contract table is unique addition
- Precision: 5 -- Accurate
- Actionability: 4 -- Technology recommendations, message contract, but less concrete on implementation
- Structure: 5 -- Message contract table is excellent, clean numbered sections
- Efficiency: 5 -- Very concise while hitting all points
- Depth: 4 -- Good but less detail on persistence, backpressure
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- CRDT (Yjs) + OT mentioned, connection management (sticky sessions, reconnection), horizontal scaling (Redis pub/sub), message ordering via CRDT
- must_not violations: none
- Completeness: 5 -- Architecture diagram, Yjs code example, persistence strategy, summary table
- Precision: 5 -- Accurate, includes actual Yjs code
- Actionability: 5 -- Working code example with Yjs, specific technology recommendations table
- Structure: 5 -- ASCII diagram, code example, summary table
- Efficiency: 4 -- Thorough
- Depth: 4 -- Good Yjs implementation detail but less on backpressure/failure modes
- **Composite: 4.73**

---

## Task 2: ws-002

**Ground Truth Summary:** WebSocket drops after 60s idle. Must mention ping/pong frames, proxy/LB timeout settings (nginx proxy_read_timeout), client-side reconnection with backoff, specific config examples. Must not only say "add keepalive" without details.

### Condition D
- must_mention coverage: 4/4 -- ping/pong with ws library code, nginx proxy_read_timeout + AWS ALB, client reconnection with exponential backoff + jitter, full config examples
- must_not violations: none
- Completeness: 5 -- Server heartbeat, proxy config, client reconnection, root cause explanation
- Precision: 5 -- Correct identification of intermediary as culprit, accurate defaults
- Actionability: 5 -- Full server code, nginx config, AWS CLI command, client reconnection code
- Structure: 5 -- Root cause -> server fix -> proxy fix -> client fix
- Efficiency: 4 -- Thorough
- Depth: 5 -- Explains why browser auto-responds to pings, application-level fallback for proxy stripping, jitter in reconnection
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- ping/pong code, proxy timeout (nginx), reconnection with backoff, config examples
- must_not violations: none
- Completeness: 4 -- Server + proxy + implicit client reconnection
- Precision: 5 -- Accurate
- Actionability: 4 -- Code provided but less detailed on client-side reconnection
- Structure: 4 -- Fix 1 / Fix 2 / Apply both
- Efficiency: 5 -- Very concise
- Depth: 3 -- Less depth on why proxies strip frames, no AWS ALB config, no jitter
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- ping/pong code, proxy timeout (nginx), client reconnection, config examples
- must_not violations: none
- Completeness: 5 -- Server, client, proxy all covered with code
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code for all three sides
- Structure: 4 -- Clean sections
- Efficiency: 4 -- Good balance
- Depth: 4 -- Client-side dead server detection, but less on AWS ALB or frame stripping
- **Composite: 4.53**

---

## Task 3: ws-003

**Ground Truth Summary:** Authenticate WebSocket with JWT. Must mention token in upgrade request (query param or header), validate during upgrade handshake (not after), handle token expiration mid-connection, security warning about token in URL + logs. Should include code example.

### Condition D
- must_mention coverage: 4/4 -- Token in query/protocol header, validates during upgrade (401 if fails), token refresh mid-connection, security warning about URL logging
- must_not violations: none
- Completeness: 5 -- Three auth options (query, protocol header, post-connect timeout), token refresh, security considerations
- Precision: 5 -- Correct handling of Sec-WebSocket-Protocol for token passing, accurate security notes
- Actionability: 5 -- Full server code for all three approaches, client code
- Structure: 5 -- Options clearly separated, security section at end
- Efficiency: 4 -- Three full approaches is thorough
- Depth: 5 -- Short-lived tokens for URL, TLS requirement, close code conventions (4000-4999), post-connect auth as alternative
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Token in query param, validate during upgrade, token refresh, URL security risk mitigation
- must_not violations: none
- Completeness: 4 -- Core approach with mitigation strategies, token refresh
- Precision: 5 -- Accurate
- Actionability: 5 -- Code for both client and server, dedicated WS ticket endpoint
- Structure: 4 -- Clean sections
- Efficiency: 5 -- Very focused
- Depth: 4 -- Short-lived dedicated WS token is a good pattern, but fewer alternatives
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- Token in query param, validate during upgrade, token refresh, security note about logs
- must_not violations: none
- Completeness: 5 -- Query param approach with one-time ticket pattern, token refresh
- Precision: 5 -- Accurate, includes note about Authorization header not supported in browser WebSocket API
- Actionability: 5 -- Full code including dedicated ws-ticket REST endpoint
- Structure: 5 -- Clear sections with security note
- Efficiency: 4 -- Good balance
- Depth: 5 -- One-time ticket pattern, short-lived tokens (60s), dedicated endpoint, custom close code 4401
- **Composite: 4.73**

---

## Task 4: ws-004

**Ground Truth Summary:** Scale Socket.IO beyond single process. Must mention Redis adapter (@socket.io/redis-adapter), sticky sessions with LB, horizontal scaling (PM2 cluster or K8s pods), room/namespace considerations across nodes. Must not suggest rewriting as first option.

### Condition D
- must_mention coverage: 4/4 -- @socket.io/redis-adapter with code, sticky sessions (nginx ip_hash + cookie), PM2 cluster + multiple hosts, room/namespace via Redis pub/sub
- must_not violations: none
- Completeness: 5 -- Full 4-step solution, capacity planning, Redis Streams alternative
- Precision: 5 -- Accurate, good note about HTTP long-polling requiring sticky sessions
- Actionability: 5 -- Full code for Redis adapter, cluster module, nginx config
- Structure: 5 -- Step-by-step, capacity planning section
- Efficiency: 4 -- Thorough
- Depth: 5 -- Redis Streams adapter alternative, cookie vs ip_hash stickiness, event loop monitoring, transports config
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Redis adapter, sticky sessions (nginx), PM2, room state externalization
- must_not violations: none
- Completeness: 4 -- Covers main steps, includes WebSocket-only transport trick
- Precision: 5 -- Accurate
- Actionability: 4 -- Code snippets, PM2 command, nginx config
- Structure: 4 -- Step-by-step
- Efficiency: 5 -- Very concise with capacity estimate
- Depth: 3 -- Less depth on failure modes, no Redis Streams alternative
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- Redis adapter with code, sticky sessions (nginx), PM2 command, rooms via Redis
- must_not violations: none
- Completeness: 4 -- Steps 1-4 with capacity planning table
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code, PM2 command, nginx config
- Structure: 5 -- Clean steps with capacity table
- Efficiency: 5 -- Concise and effective
- Depth: 3 -- Less depth on Redis Streams, failure handling, transport options
- **Composite: 4.33**

---

## Task 5: ws-005

**Ground Truth Summary:** Rate limit WebSocket messages (10/sec). Must mention token bucket or sliding window per connection, server-side enforcement, graceful handling (warning before disconnect), per-user vs per-connection consideration. Should include algorithm reasoning and code sketch.

### Condition D
- must_mention coverage: 4/4 -- Token bucket with reasoning, server-side enforcement, graduated violation handling (warning -> disconnect), per-user vs per-connection + per-message-type
- must_not violations: none
- Completeness: 5 -- Full TokenBucket class, server integration, violation escalation, client-side queue, additional considerations
- Precision: 5 -- Token bucket implementation correct
- Actionability: 5 -- Full working code for both server and client
- Structure: 5 -- Algorithm -> integration -> escalation table -> client-side -> considerations
- Efficiency: 4 -- Thorough, client-side queue adds value
- Depth: 5 -- Per-message-type differentiation, WeakMap cleanup, gradual violation decay, ws.pause() warning
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Token bucket, server-side enforcement, escalation (warn -> mute -> disconnect), per-user via Redis for multi-instance
- must_not violations: none
- Completeness: 4 -- RateLimiter class, violation table, client courtesy throttle mention
- Precision: 5 -- Accurate
- Actionability: 4 -- Code provided, escalation table
- Structure: 5 -- Escalation table is clear
- Efficiency: 5 -- Concise
- Depth: 4 -- Multi-instance Redis mention, mute level, but less detail on per-message-type
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- Token bucket, server-side enforcement, escalation (warning -> cooldown -> disconnect), per-connection with WeakMap
- must_not violations: none
- Completeness: 4 -- TokenBucket class, server integration with cooldown, escalation table
- Precision: 5 -- Accurate, burst capacity (15) is a nice touch
- Actionability: 5 -- Full working code
- Structure: 5 -- Clean escalation table, WeakMap cleanup note
- Efficiency: 5 -- Concise
- Depth: 3 -- Less detail on per-user vs per-connection, no per-message-type, no client-side queue
- **Composite: 4.33**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| ws-001 | 4.87 | 4.53 | 4.73 |
| ws-002 | 4.87 | 4.20 | 4.53 |
| ws-003 | 4.87 | 4.53 | 4.73 |
| ws-004 | 4.87 | 4.20 | 4.33 |
| ws-005 | 4.87 | 4.53 | 4.33 |
| **Mean** | **4.87** | **4.40** | **4.53** |
| E LIFT (vs D) | -- | -0.47 | -- |
| F LIFT (vs D) | -- | -- | -0.34 |
| F vs E | -- | -- | +0.13 |
