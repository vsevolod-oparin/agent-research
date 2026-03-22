## Task 1

### Real-Time Collaborative Text Editor Architecture (500 Concurrent Users/Document)

**Transport:** WebSocket (raw, via `ws` library). Full-duplex, lowest overhead after handshake.

**Key Challenges and Solutions:**

**1. Conflict Resolution (hardest problem)**
- **Recommendation: CRDTs via Yjs.** Each client maintains a local replica. Edits merge automatically without a central coordinator. Tolerates network partitions. Server acts as relay, not arbiter.
- Alternative: OT (Operational Transformation, used by Google Docs) -- requires central server, harder to scale.

**2. Message Volume**
- Yjs batches updates internally (update vectors, not individual keystrokes)
- Awareness protocol (cursors, selections) uses separate lightweight channel
- Binary encoding reduces payload 10-50x vs. JSON

**3. Connection Management**
- Room-based routing: each document = a room
- Document state in Redis/database, not solely server memory
- 500 connections/doc × ~10-50KB each = manageable memory

**4. Late Joiners / Reconnection**
- Yjs sync protocol: client sends state vector, server responds with only missing updates
- Periodic snapshots to database for persistence

**5. Multi-Server Scaling**
- Redis pub/sub adapter: all servers subscribe to per-document channels
- Sticky sessions preferred but not required

**Message Contract:**

| Event | Direction | Payload | Rate Limit |
|-------|-----------|---------|------------|
| `doc:sync-step-1` | client→server | `{ docId, stateVector }` | 1/connection |
| `doc:sync-step-2` | server→client | `{ docId, update }` | None |
| `doc:update` | bidirectional | `{ docId, update }` | 100 ops/sec |
| `awareness:update` | bidirectional | `{ docId, clientId, state }` | 10/sec |

---

## Task 2

### Fixing WebSocket Drops After ~60 Seconds of Inactivity

**Root Cause:** Proxy/load balancer idle timeout (nginx, AWS ALB, Cloudflare default: 60s). No data flowing = proxy closes connection.

**Fix 1: Application-level heartbeat (server):**

```javascript
const HEARTBEAT_INTERVAL = 30000;
wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTERVAL);
```

**Fix 2: Configure reverse proxy timeout:**

nginx:
```nginx
proxy_read_timeout 120s;
proxy_send_timeout 120s;
```

**Apply both:** Heartbeat at 30s ensures data flows regularly; proxy timeout at 120s provides margin.

---

## Task 3

### Authenticating WebSocket Connections with JWT

**Critical rule:** Authenticate during the HTTP upgrade handshake, NOT after the connection opens.

**Recommended: Token as Query Parameter**

```javascript
// Client
const ws = new WebSocket(`wss://api.example.com/ws?token=${token}`);

// Server
server.on('upgrade', (request, socket, head) => {
  const { query } = url.parse(request.url, true);
  try {
    request.user = jwt.verify(query.token, JWT_SECRET);
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});
```

**Mitigate token-in-URL risk:**
- Short-lived tokens (5-15 min) specifically for WebSocket
- Request dedicated WS token from REST API before connecting
- Always use WSS (TLS)

**Token expiry during long connections:** Client sends `{ type: "auth:refresh", token: "new.jwt" }` before expiry. Server verifies and updates context. On failure, close with custom code `4401`.

**Do not use** the `Authorization` header -- browser WebSocket API does not support custom headers.

---

## Task 4

### Scaling Socket.IO Beyond Single Process (10K Connections)

**Step 1: Redis Adapter**

```javascript
const { createAdapter } = require('@socket.io/redis-adapter');
const pubClient = createClient({ url: 'redis://redis-host:6379' });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));
```

**Step 2: Multiple Processes** (PM2 recommended)

```bash
pm2 start server.js -i max
```

**Step 3: Sticky Sessions** (nginx)

```nginx
upstream socketio_backend {
    ip_hash;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}
```

Or skip sticky sessions by forcing WebSocket-only transport:
```javascript
const socket = io('https://api.example.com', { transports: ['websocket'] });
```

**Step 4: Externalize State** -- Move room membership to Redis.

**Step 5: OS Tuning** -- `ulimit -n 65536`

**Capacity:** 10K connections / 4 cores = 2,500/process × ~20-40KB each = ~200-400MB total. Comfortable on a single 4-core, 2GB+ machine.

---

## Task 5

### Rate Limiting WebSocket Messages (10/sec per user)

**Server-side token bucket:**

```javascript
class RateLimiter {
  constructor(maxTokens, refillRate) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.buckets = new Map();
  }
  consume(clientId) {
    const now = Date.now();
    let bucket = this.buckets.get(clientId) || { tokens: this.maxTokens, lastRefill: now };
    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + elapsed * this.refillRate);
    bucket.lastRefill = now;
    if (bucket.tokens >= 1) { bucket.tokens -= 1; this.buckets.set(clientId, bucket); return true; }
    this.buckets.set(clientId, bucket);
    return false;
  }
}
```

**Violation Handling -- Escalation Strategy:**

| Level | Trigger | Response |
|-------|---------|----------|
| 1 - Warn & drop | Single violation | Send `RATE_LIMITED` error, drop message |
| 2 - Temporary mute | 5+ violations in 60s | Mute for 30s, drop all messages silently |
| 3 - Disconnect | Continued violations after mute | `ws.close(4429, 'Rate limit exceeded')` |

**Client-side courtesy throttle:** Queue outgoing messages, send max 10/sec, drop if queue exceeds 50. This is optional -- server is the enforcement point.

**Multi-instance:** For strict global enforcement across processes, use Redis `INCR` with `EXPIRE`. For most apps, per-process limiting is sufficient.
