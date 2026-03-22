# websocket-engineer Evaluation

## Task: ws-001

**Input:** Design a WebSocket architecture for a real-time collaborative text editor supporting 500 concurrent users per document. What are the key challenges and how to address them?

**Ground truth must_mention:** (1) OT or CRDT for conflict resolution, (2) connection management (heartbeat, reconnection, state sync), (3) horizontal scaling (sticky sessions or pub/sub for cross-server), (4) message ordering guarantees

### Bare Response

A real-time collaborative text editor over WebSocket needs to solve several hard problems:

**Conflict Resolution:** Multiple users editing the same document simultaneously will produce conflicting changes. Use CRDTs (Conflict-free Replicated Data Types) like Yjs or Automerge -- they guarantee convergence without a central sequencer. Operational Transformation (OT) is the older approach (Google Docs uses it) but is significantly harder to implement correctly in a distributed setting.

**Connection Management:** Implement server-side ping/pong heartbeats every 30 seconds to keep connections alive through proxies and detect dead clients. Clients need automatic reconnection with exponential backoff. On reconnect, the client must sync missed operations -- send the last known state version and receive a diff.

**Horizontal Scaling:** A single server handles 500 connections easily, but for reliability and multi-document scale you need multiple servers. Two approaches: (a) sticky sessions at the load balancer routing by document ID, or (b) a Redis pub/sub layer so that operations published on one server are broadcast to all servers hosting that document's clients. Option (b) is more resilient.

**Message Ordering:** Even with CRDTs (which are commutative), you need causal ordering so edits make sense contextually. Attach vector clocks or Lamport timestamps. Yjs handles this internally via state vectors. If using OT, the server must act as a central sequencer assigning a total order.

**Tech Stack:** Node.js + `ws` library for the WebSocket server, Yjs for CRDT, Redis for pub/sub and ephemeral state, PostgreSQL for document snapshots. Add a presence/awareness channel for cursor positions and user indicators.

### V1 Response

As a senior WebSocket engineer specializing in real-time communication, here is the architecture for a collaborative text editor supporting 500 concurrent users per document:

**Conflict Resolution:** Use CRDTs (Conflict-free Replicated Data Types) -- specifically Yjs or Automerge -- for concurrent editing. CRDTs are preferred over Operational Transformation (OT) because they work without a central sequencing server and have simpler correctness proofs. OT remains an option but introduces complexity at multi-server scale.

**Connection Management:** Set up server-side ping/pong heartbeats at 30-second intervals to prevent proxy/load balancer idle timeouts. Clients must implement reconnection with exponential backoff (base 1s, cap 30s, with jitter). On reconnect, the client sends its last known state vector, and the server replies with only the missing operations.

**Horizontal Scaling:** For multi-instance deployment, use Redis pub/sub as a cross-server message relay. Operations on one server fan out to all others hosting the same document's clients. Alternatively, configure sticky sessions by document ID at the load balancer. Redis pub/sub is more flexible and eliminates single-server dependency.

**Message Ordering:** CRDTs handle commutativity, but causal ordering still matters for user experience. Yjs uses internal state vectors that track which operations each peer has seen. This provides efficient delta synchronization on reconnect without explicit sequence numbers.

**Stack:** Node.js + `ws` (or uWebSockets.js for performance), Yjs + `y-websocket`, Redis for pub/sub and presence state, PostgreSQL for periodic document snapshots. Batch operation broadcasts every 50ms to reduce message volume. Enable permessage-deflate compression.

### V2 Response

## Real-Time System Design: Collaborative Text Editor

### Transport Decision
- **Protocol:** WebSocket
- **Rationale:** Collaborative editing requires bidirectional, low-latency communication. Per the protocol selection table: "Bidirectional, low-latency (chat, gaming, collaboration) -> WebSocket." Full-duplex is needed -- clients send edits, server relays to peers.

### Message Contract

| Event | Direction | Payload | Auth | Rate Limit |
|-------|-----------|---------|------|------------|
| `doc:op` | client -> server -> room | `{ docId: string, update: Uint8Array, stateVector: Uint8Array }` | Must have edit access to docId | 100 ops/sec |
| `doc:sync-request` | client -> server | `{ docId: string, stateVector: Uint8Array }` | Must have doc access | On reconnect only |
| `doc:sync-response` | server -> client | `{ docId: string, update: Uint8Array }` | Room member | On request |
| `awareness:update` | client -> server -> room | `{ docId: string, user: {id, name, color, cursor: {index, length}} }` | Room member | 10/sec |

### Architecture

**Conflict Resolution -- CRDT via Yjs (preferred over OT):**
- CRDTs converge by mathematical property -- no central sequencer bottleneck
- OT (Operational Transformation) is the alternative but requires a server-side transform for every concurrent operation pair, creating a scaling bottleneck at 500 users
- Yjs is battle-tested (Notion, Tiptap, BlockSuite)

**Server:** Node.js + `ws` library + Hocuspocus (Yjs-native collaboration backend)
**Pub/sub:** Redis for cross-instance operation fan-out
**Persistence:** PostgreSQL for document snapshots (Yjs binary state), Redis for ephemeral presence/room data

### Connection Lifecycle
```
CONNECTING -> [HTTP Upgrade + JWT auth] -> AUTHENTICATED
  -> [join doc room, send stateVector, receive sync diff] -> SYNCED
  -> [exchange CRDT ops, awareness updates] -> ACTIVE
  -> [ping/pong every 30s to keep alive] -> ACTIVE
  -> [network drop / missed pong] -> DISCONNECTED
  -> [exponential backoff: min(1000 * 2^attempt + jitter, 30000)] -> RECONNECTING
  -> [send stateVector, receive only missed ops] -> SYNCED
```

### Scaling Checklist (applied to 500 users/doc)

- [x] **Sticky sessions OR pub/sub adapter** -- Using Redis pub/sub; operations fan out across instances. No sticky sessions needed
- [x] **Connection state externalized** -- Room memberships in Redis sets (`doc:{id}:members`), not process memory
- [x] **Load balancer configured for WebSocket** -- nginx: `proxy_set_header Upgrade $http_upgrade;` + `proxy_set_header Connection "upgrade";` + `proxy_read_timeout 120s;`
- [x] **File descriptor limits** -- `ulimit -n 65536` in service config
- [x] **Graceful deployment** -- Rolling restart drains connections (send close frame, wait for reconnect on new instance)
- [x] **Monitoring** -- Track active connections, messages/sec, reconnection rate, CRDT merge latency

### Key Challenges Addressed

| Challenge | Solution | Why |
|-----------|----------|-----|
| Concurrent edit conflicts | CRDT (Yjs) | Convergence without coordination; works offline too |
| Idle connection drops | Ping/pong heartbeat 30s | Prevents proxy/LB timeout (Common Issues: "Connection drops every 60s") |
| Cross-server message delivery | Redis pub/sub channels per docId | All instances see all ops regardless of client placement |
| Message ordering | Yjs state vectors (causal ordering) | Each op carries a logical clock; CRDTs commute, but causal order preserves intent |
| Reconnection data loss | State vector diff sync | Client sends last known vector, server computes and sends only missed updates |

### Anti-Patterns Avoided
- NOT storing room/connection state only in memory (externalized to Redis -- survives restarts)
- NOT broadcasting full document state on every edit (sending CRDT diffs; full state only on initial connect/reconnect)
- NOT skipping reconnection logic (exponential backoff with jitter implemented)
- NOT using `setInterval` for heartbeat without cleanup (clear in `close` handler)

### Load Testing Plan
- Tool: k6 with xk6-websocket extension
- Scenario: 1000 concurrent connections per doc (2x requirement), 200 ops/sec sustained
- Pass criteria: p99 latency < 150ms, zero message loss, reconnect < 5s

### Scores

| Dimension | Bare | V1 | V2 |
|-----------|------|----|----|
| Completeness | 4 | 4 | 5 |
| Precision | 4 | 4 | 5 |
| Actionability | 3 | 3 | 5 |
| Structure | 3 | 3 | 5 |
| Efficiency | 4 | 4 | 4 |
| Depth | 3 | 3 | 5 |
| **Composite** | **3.60** | **3.53** | **4.87** |

Composite = (Precision*2 + Completeness*1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

- Bare: (4*2 + 4*1.5 + 3 + 3 + 4 + 3) / 7.5 = (8 + 6 + 3 + 3 + 4 + 3) / 7.5 = 27/7.5 = **3.60**
- V1: (4*2 + 4*1.5 + 3 + 3 + 4 + 3) / 7.5 = (8 + 6 + 3 + 3 + 4 + 3) / 7.5 = 27/7.5 = **3.60**
  - Adjusted: V1 adds a persona opener but no structural or procedural change. Efficiency drops slightly due to preamble padding. Final: (4*2 + 4*1.5 + 3 + 3 + 3.5 + 3) / 7.5 = 26.5/7.5 = **3.53**
- V2: (5*2 + 5*1.5 + 5 + 5 + 4 + 5) / 7.5 = (10 + 7.5 + 5 + 5 + 4 + 5) / 7.5 = 36.5/7.5 = **4.87**

### Ground Truth Check

| must_mention item | Bare | V1 | V2 |
|-------------------|------|----|----|
| OT or CRDT for conflict resolution | YES | YES | YES |
| Connection management (heartbeat, reconnection, state sync) | YES | YES | YES |
| Horizontal scaling (sticky sessions or pub/sub) | YES | YES | YES |
| Message ordering guarantees | YES | YES | YES |

- must_mention coverage: bare 4/4, v1 4/4, v2 4/4
- must_not violations: none
- structure: architecture diagram/component list -- bare PARTIAL (prose), v1 PARTIAL (prose), v2 YES (tables, lifecycle diagram, checklist)
- structure: specific technology recommendations -- bare YES, v1 YES, v2 YES

---

## Task: ws-003

**Input:** How to authenticate WebSocket connections? Our REST API uses JWT Bearer tokens.

**Ground truth must_mention:** (1) token in initial HTTP upgrade request (query param or header), (2) validate JWT during upgrade handshake (not after), (3) handle token expiration mid-connection, (4) security: don't put token in URL if logs capture query strings

### Bare Response

To authenticate WebSocket connections with your existing JWT tokens:

**Pass the Token During the HTTP Upgrade:** WebSocket connections begin as an HTTP request that upgrades. Attach the JWT during this phase. Two main approaches:

1. **Query parameter:** `new WebSocket('wss://api.example.com/ws?token=eyJhbG...')` -- simple and universal, but the token will appear in server access logs, proxy logs, and browser history.

2. **Cookie:** Set an HttpOnly cookie during your REST login flow. The browser sends it automatically with the upgrade request. More secure since the token stays out of the URL.

The browser WebSocket API does not support custom headers, so `Authorization: Bearer` is only possible with non-browser clients or libraries like Socket.IO.

**Validate During the Upgrade Handshake:** Check the JWT before accepting the connection, not after. This prevents unauthenticated clients from consuming resources.

```javascript
const wss = new WebSocket.Server({ noServer: true });
server.on('upgrade', (req, socket, head) => {
  const token = new URL(req.url, 'http://localhost').searchParams.get('token');
  try {
    const user = jwt.verify(token, SECRET);
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.user = user;
      wss.emit('connection', ws, req);
    });
  } catch (err) {
    socket.destroy();
  }
});
```

**Token Expiration:** WebSocket connections are long-lived, but JWTs expire. Either (a) have the client send a refresh token over the WebSocket before expiry, or (b) disconnect the client and force re-authentication. Use WSS in production and avoid logging URLs that contain tokens.

### V1 Response

As a senior WebSocket engineer specializing in real-time communication, here is how to authenticate WebSocket connections with your existing JWT Bearer tokens:

**Authenticate During the HTTP Upgrade Handshake -- Not After:** This is the most important point. Validate the JWT before the WebSocket connection is established. Accepting the connection first and then requesting credentials creates a window for unauthenticated message processing and resource exhaustion.

**Token Delivery Methods (ranked by security):**

1. **Secure cookie** (best for browsers): Store JWT in an HttpOnly, Secure, SameSite cookie set during REST login. Sent automatically with the upgrade request. Token never appears in URLs.

2. **Authorization header** (best for non-browser clients): Send `Authorization: Bearer <token>` in the upgrade request headers. Not available from the browser WebSocket API.

3. **Query parameter** (simplest, least secure): `wss://host/ws?token=<jwt>`. Works universally but token appears in server logs, proxy logs, and browser history. If you use this, ensure your reverse proxy and CDN do not log query strings.

**Server Implementation (Node.js + `ws`):**

```javascript
server.on('upgrade', (request, socket, head) => {
  const token = parseCookie(request.headers.cookie)?.jwt
    || new URL(request.url, 'http://x').searchParams.get('token');
  try {
    const payload = jwt.verify(token, SECRET);
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = payload.sub;
      wss.emit('connection', ws, request);
    });
  } catch {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});
```

**Token Expiration Mid-Connection:** JWTs have short lifetimes but WebSocket connections persist. Two strategies: (a) client proactively sends a `re-auth` event with a fresh token before the current one expires; (b) server tracks `tokenExp` per connection and sends an `auth:expired` event when the token lapses, requiring the client to reconnect with a refreshed token.

Always use WSS. Do not put tokens in URLs if your infrastructure logs query strings.

### V2 Response

## Real-Time System Design: WebSocket JWT Authentication

### Transport Decision
- **Protocol:** WebSocket (existing system -- authentication task, not transport selection)
- Authentication approach applies to both raw WS and Socket.IO

### Authentication Principle

From the Anti-Patterns list: **"Authenticate after connection -- Race condition window. Validate during HTTP upgrade handshake."** The JWT MUST be validated during the HTTP upgrade, before the WebSocket connection is accepted. Never accept first and auth later.

### Token Delivery Comparison

| Method | Mechanism | Pros | Cons | Recommendation |
|--------|-----------|------|------|----------------|
| Query parameter | `?token=<jwt>` | Universal, simple | Token in URL -- logged by proxies, servers, browser history | Only if URL logging is disabled across all infrastructure |
| Cookie | HttpOnly, Secure, SameSite cookie | Auto-sent by browser, not in URL, XSS-safe | CSRF risk (mitigate with Origin header check), browser-only | **Preferred for browser clients** |
| Sec-WebSocket-Protocol | `new WebSocket(url, [token])` | Avoids URL logging | Misuses protocol field, must echo in response | Workaround when cookies are not feasible |
| Authorization header | `Authorization: Bearer <token>` | Standard, clean | Browser WebSocket API does NOT support custom headers | Non-browser clients only |
| First message after connect | `{type: "auth", token}` | Flexible | **ANTI-PATTERN**: unauthenticated connection exists briefly. Must gate all messages until auth completes | Avoid. Server-to-server only with strict gating |

**Security warning:** Do NOT put tokens in URLs if your infrastructure logs query strings. Check: nginx access log format, CDN logging config, APM/tracing tools, load balancer access logs.

### Server Implementation (Node.js + `ws`)

```javascript
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  // Prefer cookie over query param for security
  let token = parseCookie(req.headers.cookie)?.auth_token;
  if (!token) {
    token = new URL(req.url, 'http://localhost').searchParams.get('token');
  }

  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],  // Explicitly restrict to prevent algorithm confusion
      issuer: 'your-api',
    });
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.userId = payload.sub;
      ws.tokenExp = payload.exp;
      wss.emit('connection', ws, req);
    });
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});
```

### Handling Token Expiration Mid-Connection

Long-lived WebSocket connections outlive short-lived JWTs. Three approaches:

1. **Server-side expiry sweep (recommended):** Store `payload.exp` on the connection object. A periodic check (every 60s) closes expired connections with custom close code `4001`. Client reconnects with a refreshed token.

2. **Client-initiated re-auth:** Client sends `{ type: "auth:refresh", token: newJWT }` before current token expires. Server validates and updates `ws.tokenExp`. Requires client-side awareness of token expiry time.

3. **Pre-emptive server notification:** Server sends `{ type: "auth:expiring" }` 30 seconds before expiry. Client refreshes token via REST API and sends updated token. Graceful -- no connection interruption.

```javascript
// Server-side expiry sweep
const expiryInterval = setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  wss.clients.forEach((ws) => {
    if (ws.tokenExp && ws.tokenExp < now) {
      ws.close(4001, 'Token expired');
    }
  });
}, 60000);

// Anti-pattern: setInterval without cleanup. Clear on shutdown:
process.on('SIGTERM', () => {
  clearInterval(expiryInterval);
  wss.close();
});
```

### Connection Lifecycle with Auth

```
Client                              Server
  |-- HTTP Upgrade + token -------->|
  |   (cookie or query param)       |-- jwt.verify(token)
  |                                 |-- FAIL? -> 401 + socket.destroy()
  |<-- 101 Switching Protocols -----|-- SUCCESS -> handleUpgrade()
  |<======= WebSocket Open ========>|
  |                                 |-- store userId, tokenExp on ws obj
  |                                 |
  | ... normal message exchange ... |
  |                                 |
  |                                 |-- expiry sweep detects exp < now
  |<-- close(4001, "expired") ------|
  |-- reconnect with new token ---->|
```

### Anti-Patterns Avoided
- NOT putting token in URL without verifying log suppression across the stack
- NOT authenticating after connection (validated during upgrade handshake)
- NOT ignoring token expiration (sweep mechanism closes stale sessions)
- NOT trusting client-provided identity (all identity derived from verified JWT `sub` claim)
- NOT using `setInterval` without cleanup (cleared on SIGTERM)

### Message Contract (Auth Events)

| Event | Direction | Payload | Auth | Rate Limit |
|-------|-----------|---------|------|------------|
| `auth:refresh` | client -> server | `{ token: string }` | Must have existing valid session | 1/min |
| `auth:expiring` | server -> client | `{ expiresIn: number }` | System event | N/A |

### Scores

| Dimension | Bare | V1 | V2 |
|-----------|------|----|----|
| Completeness | 3 | 4 | 5 |
| Precision | 4 | 4 | 5 |
| Actionability | 4 | 4 | 5 |
| Structure | 3 | 3 | 5 |
| Efficiency | 4 | 4 | 4 |
| Depth | 3 | 4 | 5 |
| **Composite** | **3.53** | **3.87** | **4.87** |

Composite = (Precision*2 + Completeness*1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

- Bare: (4*2 + 3*1.5 + 4 + 3 + 4 + 3) / 7.5 = (8 + 4.5 + 4 + 3 + 4 + 3) / 7.5 = 26.5/7.5 = **3.53**
- V1: (4*2 + 4*1.5 + 4 + 3 + 4 + 4) / 7.5 = (8 + 6 + 4 + 3 + 4 + 4) / 7.5 = 29/7.5 = **3.87**
- V2: (5*2 + 5*1.5 + 5 + 5 + 4 + 5) / 7.5 = (10 + 7.5 + 5 + 5 + 4 + 5) / 7.5 = 36.5/7.5 = **4.87**

### Ground Truth Check

| must_mention item | Bare | V1 | V2 |
|-------------------|------|----|----|
| Token in initial HTTP upgrade request (query param or header) | YES | YES | YES |
| Validate JWT during upgrade handshake (not after) | YES | YES (explicit) | YES (explicit + anti-pattern citation) |
| Handle token expiration mid-connection | YES (brief, 2 options) | YES (2 strategies) | YES (3 strategies with code) |
| Security: don't put token in URL if logs capture query strings | PARTIAL (mentioned briefly) | YES (explicit) | YES (detailed -- lists what to check: nginx, CDN, APM, LB) |

- must_mention coverage: bare 3.5/4, v1 4/4, v2 4/4
- must_not violations: none
- structure: code example showing handshake auth -- bare YES, v1 YES, v2 YES (most complete -- cookie fallback, algorithm restriction, error responses)

---

## Summary

| Metric | Bare | V1 | V2 |
|--------|------|----|----|
| ws-001 Composite | 3.60 | 3.53 | 4.87 |
| ws-003 Composite | 3.53 | 3.87 | 4.87 |
| **Mean Composite** | **3.57** | **3.70** | **4.87** |
| V1 LIFT (vs bare) | | +0.13 | |
| V2 LIFT (vs bare) | | | +1.30 |
| V2 LIFT (vs v1) | | | +1.17 |

## Analysis

### V1 vs Bare (LIFT: +0.13)

The v1 agent contains a single identity sentence: "You are a senior WebSocket engineer specializing in real-time communication systems..." This produces negligible and inconsistent improvement:

- **ws-001:** V1 scored slightly *lower* than bare (-0.07). The persona preamble added words without adding procedural guidance. Content coverage was identical (4/4 must_mention for both). The extra framing slightly reduced efficiency.
- **ws-003:** V1 scored slightly higher (+0.34). The specialist framing nudged the response toward ranking auth methods by security and explicitly calling out the "authenticate during handshake, not after" principle. This is where identity-based prompting has its modest effect -- it encourages the model to emphasize what a domain expert would emphasize.

**Conclusion:** Identity-only prompting provides inconsistent, near-zero lift when the model already has strong domain knowledge.

### V2 vs Bare (LIFT: +1.30)

The v2 agent produced large, consistent improvement across both tasks. The gains came from three mechanisms in the agent instructions:

1. **Output format template** (Transport Decision, Message Contract table, Architecture, Connection Lifecycle): Forced structured, parseable output instead of prose paragraphs. Structure scores jumped from 3 to 5.

2. **Protocol selection table + design workflow** (7 steps): Ensured systematic coverage. The message contract step produced concrete event schemas with auth/rate-limit columns that bare/v1 never generated. The scaling checklist was applied as an actual checklist artifact.

3. **Anti-patterns list**: Gave V2 a defensive dimension -- explicitly listing what was avoided and why. This added depth that bare/v1 lacked (e.g., "NOT using setInterval without cleanup," "NOT trusting client-provided identity").

### V2 vs V1 (LIFT: +1.17)

Nearly all V2 advantage is procedural scaffolding, not persona. V1 proves identity statements add almost nothing when the model already knows the domain. V2 proves that structured workflows (steps to follow, formats to produce, checklists to verify, anti-patterns to flag) produce dramatically better output. The v2 agent acts as a cognitive scaffold -- it does not teach new facts but organizes existing knowledge into reliable, complete, actionable patterns.

### Key Takeaway

For domains well-represented in training data (WebSocket engineering), **procedural scaffolding provides ~10x more lift than identity prompting** (+1.30 vs +0.13). The most impactful agent components are: output format templates, step-by-step workflows, reference tables (protocol selection, common issues), and anti-pattern lists.
