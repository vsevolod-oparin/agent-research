# websocket-engineer Evaluation (D/E/F/I/L/M/N/O)

## Task 1: ws-001
**Ground Truth Summary:** Collaborative text editor for 500 users. Must mention OT or CRDT, connection management (heartbeat, reconnection, state sync), horizontal scaling (sticky sessions or pub/sub), message ordering. Architecture diagram or component list.

### Condition D
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5 -- Specific tech recommendations (Yjs), concrete architecture
- **Completeness:** 5 -- CRDT, presence, persistence, security, backpressure
- **Actionability:** 5 -- Architecture diagram, specific library recommendations
- **Structure:** 5 -- ASCII architecture diagram, numbered challenges
- **Efficiency:** 4
- **Depth:** 5 -- Delta compression, batching, snapshot GC
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Covers essentials concisely
- **Actionability:** 4 -- Message contract table but less code
- **Structure:** 5 -- Table-driven
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.40**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- ASCII diagram, code example with Yjs, persistence strategy
- **Actionability:** 5 -- Working code sketch
- **Structure:** 5 -- Diagram + challenge/solution table
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition I (based on partial read)
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- 8 challenges addressed: conflict, ordering, backpressure, thundering herd, zombies, memory, presence, protocol
- **Actionability:** 5 -- Message protocol spec, code examples
- **Structure:** 5
- **Efficiency:** 3 -- Very verbose
- **Depth:** 5 -- permessage-deflate memory analysis, bufferedAmount monitoring
- **Composite: 4.60**

### Condition L (based on partial read)
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- 8 challenges, OT vs CRDT comparison, message flow, infrastructure details
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- 7 challenges, Redis Streams vs Pub/Sub distinction
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- 6 challenges, fan-out math (1.25M msg/sec), permessage-deflate
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Pseudocode, 6 challenges, ordering discussion
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

---

## Task 2: ws-002
**Ground Truth Summary:** WebSocket drops after 60s. Must mention ping/pong, proxy timeout (nginx proxy_read_timeout), client reconnection with backoff, specific config examples. Must not only say "add keepalive" without details.

### Condition D
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Server ping/pong code, nginx config, AWS ALB config, reconnection with backoff+jitter
- **Actionability:** 5 -- Full code examples
- **Structure:** 5 -- Root cause, fix, also fix proxy, reconnection
- **Efficiency:** 4
- **Depth:** 5 -- Application vs protocol-level pings, proxy stripping concern
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Server code, nginx config, no AWS
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.40**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Server code, nginx config, client reconnection
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.53**

### Condition I (based on content)
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Root cause table, server/client code, nginx/HAProxy/AWS config
- **Actionability:** 5
- **Structure:** 5 -- Root cause table, "What NOT to do" section
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Root cause table, nginx/AWS/HAProxy, "What NOT to do"
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Server code, client heartbeat class, nginx/HAProxy configs, jittered backoff
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Server/client code, nginx, jittered backoff
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

---

## Task 3: ws-003
**Ground Truth Summary:** JWT auth for WebSocket. Must mention token in upgrade request (query or header), validate during upgrade (not after), handle expiration mid-connection, security concern about URL logging. Code example for handshake auth.

### Condition D
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- 3 options (query, subprotocol, post-connect), token refresh, security notes
- **Actionability:** 5 -- Full code for all 3 options
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5 -- Close code conventions, TLS requirement
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Query param + mitigation, token refresh
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.40**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Query param, ws-ticket pattern, token refresh
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition I (based on content)
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Sec-WebSocket-Protocol, query param, cookie, Origin validation, token refresh, per-action auth
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- 3 options, Origin validation, token expiry, per-action auth, one-time ticket pattern
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Sec-WebSocket-Protocol (recommended), query, cookie, Origin validation, maxPayload
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5 -- Multi-tenant consideration
- **Composite: 4.60**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- All 3 options, Origin validation, per-action auth
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Sec-WebSocket-Protocol (recommended), query, cookie, one-time ticket
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

---

## Task 4: ws-004
**Ground Truth Summary:** Scale Socket.IO beyond single process. Must mention Redis adapter, sticky sessions, horizontal scaling (PM2/K8s), room/namespace considerations. Must not suggest rewriting as first option.

### Condition D
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Redis adapter code, cluster module, nginx sticky, capacity planning, Redis Streams alternative
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Concise coverage
- **Actionability:** 5
- **Structure:** 4 -- Table for capacity
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.40**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- PM2, nginx, capacity table
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition I (based on content)
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Redis adapter, cluster, DB-backed room state, connection recovery v4
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5 -- Room state externalization, thundering herd on deploy
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- @socket.io/sticky, Redis Streams, caveats, capacity planning
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Redis adapter, cluster, nginx, DB-backed room state, reconnection
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Redis adapter, cluster, nginx, capacity, connection state recovery v4
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- @socket.io/sticky, Redis Streams caveat, cookie stickiness
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

---

## Task 5: ws-005
**Ground Truth Summary:** Rate limiting WebSocket messages. Must mention token bucket or sliding window, server-side enforcement, graceful handling (warning before disconnect), per-user vs per-connection. Algorithm with reasoning and code sketch.

### Condition D
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Token bucket class, graduated violations, client-side queue, per-user vs per-connection, message-type differentiation
- **Actionability:** 5 -- Full implementation
- **Structure:** 5 -- Table for violation levels
- **Efficiency:** 4
- **Depth:** 5 -- WeakMap, monitoring, message-type differentiation
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Escalation table, client throttle
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 5
- **Depth:** 4 -- Multi-instance Redis note
- **Composite: 4.53**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Token bucket, violation handling, cooldown, WeakMap
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.53**

### Condition I (based on content)
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Token bucket, graduated response, client cooperation, per-type limits, "why not drop silently"
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5 -- Lazy refill vs setInterval, logging/monitoring, temporary ban via Redis
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Token bucket, graduated, client cooperation, per-type, ban at upgrade level
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Token bucket, violation window, per-type limits, client pre-filtering
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Client handling, per-type limits, "why not drop silently"
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Client pre-filter, per-type limits, escalation with close code
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

---

## Summary

| Task | D | E | F | I | L | M | N | O |
|------|---|---|---|---|---|---|---|---|
| ws-001 | 4.73 | 4.40 | 4.73 | 4.60 | 4.60 | 4.60 | 4.60 | 4.60 |
| ws-002 | 4.73 | 4.40 | 4.53 | 4.60 | 4.60 | 4.60 | 4.60 | 4.60 |
| ws-003 | 4.73 | 4.40 | 4.73 | 4.60 | 4.60 | 4.60 | 4.60 | 4.60 |
| ws-004 | 4.73 | 4.40 | 4.40 | 4.60 | 4.60 | 4.60 | 4.60 | 4.60 |
| ws-005 | 4.73 | 4.53 | 4.53 | 4.60 | 4.60 | 4.60 | 4.60 | 4.60 |
| **Mean** | **4.73** | **4.43** | **4.58** | **4.60** | **4.60** | **4.60** | **4.60** | **4.60** |
