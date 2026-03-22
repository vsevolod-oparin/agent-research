## Task 1: WebSocket Architecture for a Real-Time Collaborative Text Editor (500 Concurrent Users per Document)

### Architecture Overview

The system requires a WebSocket gateway that fans out edits to all participants on a shared document in real time, while preserving consistency when two users type simultaneously.

```
Clients (browsers)
   |  WebSocket (wss://)
   v
Load Balancer (sticky sessions by document ID)
   |
   v
WebSocket Gateway Cluster (N Node.js / Go processes)
   |         |
   v         v
Redis Pub/Sub    CRDT / OT Engine
   |
   v
Persistence Layer (PostgreSQL / S3 for snapshots)
```

### Key Challenges and Solutions

**1. Conflict Resolution (the hardest problem)**

When two users edit the same region simultaneously, naive last-write-wins destroys data. Two proven approaches exist:

- **Operational Transformation (OT)** -- used by Google Docs. The server transforms each incoming operation against every concurrent operation so that all clients converge to the same state. The server is the single source of truth for operation ordering.
- **CRDTs (Conflict-free Replicated Data Types)** -- used by Figma, Yjs, Automerge. Each character gets a globally unique, causally ordered ID. Merges are commutative and associative, so no central coordinator is needed.

Recommendation: Use **Yjs** (a mature CRDT library with WebSocket provider `y-websocket`). It eliminates the need to write a custom OT server, handles offline edits gracefully, and the binary encoding is compact (~10x smaller than JSON OT operations).

**2. Fan-out to 500 Connections per Document**

A single document room with 500 members means every keystroke must be delivered to 499 other sockets. Strategies:

- **Document-level rooms**: Group all connections for a document into a single pub/sub channel. Use Redis Pub/Sub (or Redis Streams) so that any gateway node receiving an edit publishes it, and every node with subscribers delivers it.
- **Delta compression**: Send only the CRDT update binary deltas, not full document state. Yjs updates are typically 20-100 bytes per keystroke.
- **Batching / coalescing**: Buffer updates on the client for 50-100 ms before sending. This reduces per-keystroke overhead and is imperceptible to users.

**3. Presence and Cursor Awareness**

Users need to see each other's cursors and selections. This is ephemeral data -- do not persist it.

- Use a separate "awareness" channel (Yjs has built-in awareness protocol).
- Throttle awareness updates to ~200 ms intervals; cursor positions do not need keystroke-level precision.
- On disconnect, broadcast a removal after a short timeout (2 s) to avoid flicker on transient network drops.

**4. Connection Management at Scale**

- **Sticky sessions**: Route all connections for a given document to the same gateway node when possible. This avoids cross-node pub/sub for the majority of messages. Use consistent hashing on `documentId` at the load balancer.
- **Graceful degradation**: If a gateway node fails, clients reconnect to another node and re-sync via the CRDT merge (no data loss).
- **Backpressure**: If a client cannot consume messages fast enough (slow network), buffer up to a threshold, then drop that client's connection and let it reconnect + re-sync rather than letting memory grow unbounded.

**5. Persistence**

- Persist CRDT document state to the database on a periodic schedule (every 5-10 seconds if dirty) and on last-user-leave.
- Store incremental updates in an append-only log for undo history and audit.
- Snapshot the full CRDT state periodically and garbage-collect old incremental updates.

**6. Security**

- Authenticate on WebSocket upgrade (see Task 3).
- Authorize per-document: verify the user has edit or view permission before joining the room.
- Rate-limit inbound messages per connection (see Task 5).

---

## Task 2: Fixing WebSocket Drops After ~60 Seconds of Inactivity

### Root Cause

The 60-second timeout is almost certainly caused by an **intermediary** (load balancer, reverse proxy, or cloud provider) closing idle TCP connections. Common culprits:

- **Nginx** `proxy_read_timeout` defaults to 60 s.
- **AWS ALB** idle timeout defaults to 60 s.
- **Cloudflare** proxied connections have similar timeouts.

The browser WebSocket API does not have a built-in keepalive mechanism, so if neither side sends data for 60 seconds the intermediary considers the connection dead and closes it.

### Fix: Application-Level Ping/Pong (Heartbeat)

Implement a heartbeat that keeps the connection alive by sending a small message at a regular interval shorter than the proxy timeout.

**Server side (Node.js with `ws` library):**

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds -- well under the 60s timeout
const CLIENT_TIMEOUT = 35_000;     // allow 5s grace for pong response

wss.on('connection', (ws) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });
});

const interval = setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) {
      // Client did not respond to the last ping -- terminate
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(); // sends a WebSocket protocol-level ping frame
  }
}, HEARTBEAT_INTERVAL);

wss.on('close', () => clearInterval(interval));
```

**Client side (browser):**

The browser WebSocket API automatically responds to protocol-level ping frames with pong frames -- no client code is needed for the `ws.ping()` approach above.

However, some proxies strip WebSocket control frames. In that case, use application-level pings:

```javascript
const PING_INTERVAL = 25_000;

function connect() {
  const ws = new WebSocket('wss://example.com/ws');
  let pingTimer;

  ws.onopen = () => {
    pingTimer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, PING_INTERVAL);
  };

  ws.onclose = () => {
    clearInterval(pingTimer);
    // Reconnect with exponential backoff
    setTimeout(connect, 1000 + Math.random() * 2000);
  };
}
```

### Also Fix the Proxy Configuration

Do not rely solely on heartbeats. Increase the proxy timeout so it is not the bottleneck:

**Nginx:**

```nginx
location /ws {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;   # 1 hour
    proxy_send_timeout 3600s;
}
```

**AWS ALB:**

Set the idle timeout to 3600 seconds via the console or CLI:

```bash
aws elbv2 modify-load-balancer-attributes \
  --load-balancer-arn <arn> \
  --attributes Key=idle_timeout.timeout_seconds,Value=3600
```

### Reconnection Strategy

Even with heartbeats, connections will occasionally drop (deploys, network changes). Always implement reconnection with exponential backoff and jitter on the client:

```javascript
function reconnect(attempt = 0) {
  const delay = Math.min(1000 * 2 ** attempt, 30_000) + Math.random() * 1000;
  setTimeout(() => connect(attempt + 1), delay);
}
```

---

## Task 3: Authenticating WebSocket Connections with JWT

### Recommended Approach: Authenticate During the HTTP Upgrade

The WebSocket handshake starts as an HTTP GET request with an `Upgrade` header. This is the correct place to validate the JWT -- **before** the connection is upgraded to a WebSocket. If authentication fails, respond with HTTP 401 and never complete the upgrade.

**Option A: Token in query string (simplest, but token appears in logs)**

```javascript
// Client
const ws = new WebSocket(`wss://example.com/ws?token=${jwtToken}`);
```

```javascript
// Server (Node.js, ws library)
const jwt = require('jsonwebtoken');
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, 'http://localhost');
  const token = url.searchParams.get('token');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = payload.sub;
      ws.permissions = payload.permissions;
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});
```

**Option B: Token in a protocol sub-header (avoids URL logging)**

Browsers do not allow custom headers on WebSocket, but you can use the `Sec-WebSocket-Protocol` header:

```javascript
// Client
const ws = new WebSocket('wss://example.com/ws', [jwtToken]);
```

```javascript
// Server
server.on('upgrade', (request, socket, head) => {
  const token = request.headers['sec-websocket-protocol'];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = payload.sub;
      // Echo back the protocol so the handshake completes
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});
```

**Option C: Authenticate after connection with a timeout (most flexible)**

Allow the WebSocket upgrade unauthenticated, but require the first message to be an auth message. Terminate if not received within a timeout.

```javascript
wss.on('connection', (ws) => {
  ws.isAuthenticated = false;

  const authTimeout = setTimeout(() => {
    if (!ws.isAuthenticated) {
      ws.close(4001, 'Authentication timeout');
    }
  }, 5_000); // 5 second window to authenticate

  ws.on('message', (data) => {
    if (!ws.isAuthenticated) {
      const msg = JSON.parse(data);
      if (msg.type === 'auth') {
        try {
          const payload = jwt.verify(msg.token, process.env.JWT_SECRET);
          ws.isAuthenticated = true;
          ws.userId = payload.sub;
          clearTimeout(authTimeout);
          ws.send(JSON.stringify({ type: 'auth_ok' }));
        } catch {
          ws.close(4002, 'Invalid token');
        }
      }
      return; // Drop all non-auth messages until authenticated
    }

    // Normal message handling for authenticated connections
    handleMessage(ws, data);
  });
});
```

### Token Refresh

JWTs expire. Handle this without dropping the connection:

1. The client watches its token expiry and obtains a new JWT from the REST API refresh endpoint before the current one expires.
2. The client sends a `{ type: "token_refresh", token: "<new JWT>" }` message over the existing WebSocket.
3. The server verifies the new token and updates the stored claims on the connection.

### Security Considerations

- **Option A (query string)**: The token will appear in proxy access logs, browser history, and potentially referrer headers. Use short-lived tokens (60 s) specifically for the WebSocket upgrade and obtain them from a REST endpoint.
- **Never trust the client after initial auth** if the token can be revoked. Periodically re-verify the token or check a revocation list server-side.
- **Use `wss://` (TLS) exclusively** -- tokens sent over unencrypted WebSocket are trivially interceptable.
- **Close code conventions**: Use 4000-4999 range for application-level close codes (4001 for auth timeout, 4002 for invalid token, etc.).

---

## Task 4: Scaling Socket.IO Beyond a Single Node.js Process (10K Connections)

### Problem

Socket.IO's default in-memory adapter stores room membership and connected socket data in the local process. When you run multiple processes (via clustering or multiple hosts), a message emitted on process A will not reach clients connected to process B.

### Solution: Redis Adapter + Multiple Processes

**Step 1: Install the Redis adapter**

```bash
npm install @socket.io/redis-adapter redis
```

**Step 2: Configure each Socket.IO server to use the Redis adapter**

```javascript
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

async function createSocketServer(httpServer) {
  const pubClient = createClient({ url: 'redis://redis-host:6379' });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  const io = new Server(httpServer, {
    adapter: createAdapter(pubClient, subClient),
    // Tune transport settings for scale
    transports: ['websocket'],      // Skip HTTP long-polling; reduces load
    pingInterval: 25_000,
    pingTimeout: 20_000,
    maxHttpBufferSize: 1e6,         // 1 MB max message size
  });

  return io;
}
```

The Redis adapter uses Redis Pub/Sub under the hood. When `io.to('room').emit(...)` is called on any process, the adapter publishes the event to Redis, and all other processes subscribed to that channel deliver it to their local clients.

**Step 3: Run multiple processes**

Option A -- Node.js Cluster module (single machine, utilize all CPU cores):

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numWorkers = os.cpus().length;
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting`);
    cluster.fork();
  });
} else {
  // Each worker runs the Socket.IO server
  const httpServer = require('http').createServer();
  createSocketServer(httpServer).then((io) => {
    // ... set up event handlers
    httpServer.listen(3000);
  });
}
```

Option B -- Multiple hosts behind a load balancer (horizontal scaling):

Deploy the same Socket.IO application to N hosts. Place a load balancer in front with **sticky sessions** enabled.

**Step 4: Sticky sessions (required)**

Socket.IO's HTTP long-polling fallback requires that all HTTP requests from the same client reach the same backend process. Even with `transports: ['websocket']`, the initial handshake uses HTTP. Configure stickiness:

**Nginx:**

```nginx
upstream socket_backend {
    ip_hash;  # Sticky sessions based on client IP
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    location /socket.io/ {
        proxy_pass http://socket_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
    }
}
```

For cookie-based stickiness (more reliable than `ip_hash` when clients are behind NAT), use `sticky cookie` with Nginx Plus or use an AWS ALB with stickiness enabled on the target group.

### Capacity Planning for 10K Connections

- A single Node.js process can handle roughly 5K-10K idle WebSocket connections depending on message throughput and payload size.
- For 10K connections with moderate messaging, plan for **2-4 Node.js processes** across 1-2 hosts.
- Monitor: RSS memory per process, event loop latency (`perf_hooks`), and Redis Pub/Sub throughput.
- If Redis Pub/Sub becomes a bottleneck at higher scale (100K+ connections), consider `@socket.io/redis-streams-adapter` which provides better delivery guarantees and handles message ordering.

### Alternative: Socket.IO with Redis Streams Adapter

```bash
npm install @socket.io/redis-streams-adapter
```

```javascript
const { createAdapter } = require('@socket.io/redis-streams-adapter');
// Same setup, but uses Redis Streams instead of Pub/Sub
// Better for cases where messages must not be lost during reconnection
```

---

## Task 5: Rate Limiting WebSocket Messages (10 Messages/Second)

### Implementation: Token Bucket Algorithm Per Connection

The token bucket is the best fit for WebSocket rate limiting because it allows short bursts while enforcing an average rate. Each connection gets a bucket of 10 tokens. One token is consumed per message. Tokens refill at 10 per second.

```javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;       // Max tokens (burst size)
    this.tokens = capacity;         // Current tokens
    this.refillRate = refillRate;   // Tokens added per second
    this.lastRefill = Date.now();
  }

  consume() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;  // Allowed
    }
    return false;    // Rate limited
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}
```

### Integration with the WebSocket Server

```javascript
const rateLimiters = new WeakMap();

wss.on('connection', (ws) => {
  const bucket = new TokenBucket(10, 10); // 10 capacity, 10 tokens/sec refill
  rateLimiters.set(ws, bucket);

  let violations = 0;

  ws.on('message', (data) => {
    const bucket = rateLimiters.get(ws);

    if (!bucket.consume()) {
      violations++;

      // Progressive response to violations
      if (violations >= 30) {
        // Persistent abuser -- disconnect
        ws.close(4029, 'Rate limit exceeded: connection terminated');
        return;
      }

      if (violations >= 10) {
        // Repeat offender -- warn with longer backoff
        ws.send(JSON.stringify({
          type: 'error',
          code: 'RATE_LIMITED',
          message: 'Rate limit exceeded. Slow down.',
          retryAfter: 5000,
        }));
        return;
      }

      // First few violations -- just reject the message
      ws.send(JSON.stringify({
        type: 'error',
        code: 'RATE_LIMITED',
        message: 'Too many messages. Max 10 per second.',
        retryAfter: 1000,
      }));
      return;
    }

    // Reset violation counter gradually on good behavior
    if (violations > 0) violations = Math.max(0, violations - 0.1);

    // Process the message normally
    handleMessage(ws, data);
  });
});
```

### Handling Violations: A Graduated Approach

The strategy above uses three tiers:

| Violation Count | Response |
|----------------|----------|
| 1-9            | Reject the message silently with a `RATE_LIMITED` error. Include `retryAfter` so well-behaved clients can back off. |
| 10-29          | Send a stronger warning with a longer `retryAfter`. Log the event for monitoring. |
| 30+            | Terminate the connection with close code `4029`. The client can reconnect, but the pattern may trigger IP-level throttling. |

### Client-Side Handling

Cooperating clients should implement local rate limiting so they never hit the server limit:

```javascript
class MessageQueue {
  constructor(ws, maxPerSecond = 10) {
    this.ws = ws;
    this.queue = [];
    this.interval = 1000 / maxPerSecond;
    this.lastSent = 0;
    this.timer = null;
  }

  send(message) {
    this.queue.push(message);
    this.flush();
  }

  flush() {
    if (this.timer || this.queue.length === 0) return;

    const now = Date.now();
    const wait = Math.max(0, this.interval - (now - this.lastSent));

    this.timer = setTimeout(() => {
      this.timer = null;
      if (this.queue.length > 0) {
        const msg = this.queue.shift();
        this.ws.send(JSON.stringify(msg));
        this.lastSent = Date.now();
        this.flush();
      }
    }, wait);
  }
}
```

### Additional Considerations

- **Per-user vs per-connection**: If a user opens multiple tabs, rate limit per user ID (aggregate across connections) using a shared store like Redis. This prevents circumventing limits by opening multiple connections.
- **Message-type differentiation**: Not all messages are equal. You may want different limits for chat messages (10/s) vs cursor movements (30/s) vs document edits (20/s). Use separate buckets per message type.
- **Monitoring**: Track rate limit hits as a metric. A sudden spike across many users may indicate a bug in the client rather than abuse.
- **Do not use `ws.pause()`**: Some guides suggest pausing the socket. This applies TCP backpressure and can cause the OS receive buffer to fill, which is harder to reason about than simply dropping application messages.
