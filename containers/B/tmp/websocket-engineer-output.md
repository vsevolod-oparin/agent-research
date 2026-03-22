## Task 1

### Real-Time Collaborative Text Editor -- WebSocket Architecture for 500 Concurrent Users per Document

#### Core Architecture

The central challenge in collaborative editing is conflict resolution when multiple users edit the same region simultaneously. The two proven approaches are Operational Transformation (OT) and Conflict-free Replicated Data Types (CRDTs). For 500 concurrent users per document, a CRDT-based approach (e.g., Yjs or Automerge) is strongly recommended because it does not require a central transformation server, reducing latency and single-point-of-failure risk.

```
                        +-------------------+
                        |   Load Balancer   |
                        | (sticky sessions) |
                        +--------+----------+
                                 |
              +------------------+------------------+
              |                  |                  |
     +--------v------+  +-------v-------+  +-------v-------+
     | WS Server 1   |  | WS Server 2   |  | WS Server 3   |
     | (Document A-F) |  | (Document G-L) |  | (Document M-Z) |
     +--------+------+  +-------+-------+  +-------+-------+
              |                  |                  |
              +------------------+------------------+
                                 |
                        +--------v----------+
                        |  Redis Pub/Sub    |
                        |  (cross-server    |
                        |   broadcast)      |
                        +--------+----------+
                                 |
                        +--------v----------+
                        |  Document Store   |
                        |  (PostgreSQL /    |
                        |   S3 snapshots)   |
                        +-------------------+
```

#### Key Challenges and Solutions

**1. Conflict Resolution**

Use a CRDT library like Yjs. Each client maintains a local document replica and sends incremental updates (not the full document) over the WebSocket.

```javascript
// Server-side: Yjs awareness + WebSocket provider
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');

// Each document gets its own Y.Doc
const docs = new Map();

function getOrCreateDoc(docId) {
  if (!docs.has(docId)) {
    const ydoc = new Y.Doc();
    docs.set(docId, ydoc);
  }
  return docs.get(docId);
}

wss.on('connection', (ws, req) => {
  const docId = parseDocId(req.url);
  const doc = getOrCreateDoc(docId);

  ws.on('message', (data) => {
    // Apply CRDT update from client
    const update = new Uint8Array(data);
    Y.applyUpdate(doc, update);

    // Broadcast to all other clients on this document
    broadcastToDocument(docId, update, ws);
  });
});
```

**2. Bandwidth at Scale (500 users)**

With 500 users typing simultaneously, naive broadcasting creates an O(n^2) message fan-out problem. Mitigations:

- **Update batching**: Collect updates on the client for 50-100ms before sending, reducing message frequency from per-keystroke to ~10-20 updates/second per user.
- **Binary encoding**: Use Yjs binary encoding (not JSON). A typical keystroke update is 20-50 bytes in binary vs. 200+ bytes in JSON.
- **Awareness protocol**: Separate cursor/selection state from document edits. Cursor updates can be throttled more aggressively (every 200ms).

```javascript
// Client-side: batched updates
const ydoc = new Y.Doc();
let pendingUpdates = [];
let flushTimer = null;

ydoc.on('update', (update) => {
  pendingUpdates.push(update);
  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      const merged = Y.mergeUpdates(pendingUpdates);
      ws.send(merged);
      pendingUpdates = [];
      flushTimer = null;
    }, 50); // 50ms batch window
  }
});
```

**3. Connection Management**

500 concurrent WebSocket connections on a single document means a single server node must handle all of them (or use Redis pub/sub for cross-node sync). Recommended approach:

- Route all connections for a given document to the same server using consistent hashing at the load balancer.
- If a single server cannot handle 500 connections for one document (unlikely -- a typical Node.js process handles 10K+ idle WebSocket connections), shard the document across servers using Redis pub/sub to relay updates.

**4. Persistence and Recovery**

- Snapshot the CRDT document state to persistent storage every N updates or every T seconds.
- On reconnection, the client sends its state vector, and the server responds with only the missing updates (built into Yjs sync protocol).
- Store an operation log for audit trails and undo history.

```javascript
// Periodic persistence
setInterval(() => {
  for (const [docId, doc] of docs) {
    const state = Y.encodeStateAsUpdate(doc);
    persistToDatabase(docId, state);
  }
}, 30000); // Every 30 seconds
```

**5. Presence and Cursors**

Use a separate lightweight channel (or Yjs awareness protocol) for presence:

```javascript
// Awareness updates: who is where in the document
awareness.setLocalStateField('user', {
  name: 'Alice',
  color: '#ff0000',
  cursor: { anchor: 150, head: 150 }
});

// Throttle awareness broadcasts
awareness.on('change', throttle((changes) => {
  const encoded = awarenessProtocol.encodeAwarenessUpdate(awareness, changes);
  ws.send(encoded);
}, 200));
```

**6. Memory Management**

With 500 users per document, the server holds one Y.Doc instance per document (not per user). The CRDT state grows with the editing history. Periodically garbage-collect the CRDT by snapshotting and creating a fresh document from the snapshot.

#### Summary of Design Decisions

| Concern | Decision | Rationale |
|---------|----------|-----------|
| Conflict resolution | CRDT (Yjs) | No central transform server needed, proven at scale |
| Transport | Binary WebSocket frames | 4-10x smaller than JSON |
| Batching | 50ms client-side | Reduces message rate from 500/user/sec to ~20/user/sec |
| Routing | Consistent hash per document | All users on same server, no cross-node sync needed per doc |
| Cross-node (overflow) | Redis pub/sub | Only if single node insufficient for a document |
| Persistence | Periodic CRDT snapshots | Crash recovery without full replay |
| Presence | Yjs awareness, 200ms throttle | Separate from document edits, less critical latency |

---

## Task 2

### Fixing WebSocket Connections Dropping After 60 Seconds of Inactivity

The root cause is almost certainly missing keep-alive (ping/pong) frames. WebSocket connections pass through proxies, load balancers, and firewalls that enforce idle timeouts (commonly 60 seconds for Nginx, AWS ALB, Cloudflare, etc.). Without periodic traffic, intermediaries close the TCP connection.

#### Server-Side Fix: Implement Ping/Pong

The WebSocket protocol (RFC 6455) defines control frames: Ping (opcode 0x9) and Pong (opcode 0xA). The server should send periodic Ping frames; the browser automatically responds with Pong.

```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Ping every 30 seconds (well under the 60s timeout)
const HEARTBEAT_INTERVAL = 30000;
const CLIENT_TIMEOUT = 35000; // Allow 5s for pong response

wss.on('connection', (ws) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('close', () => {
    ws.isAlive = false;
  });
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      // Client did not respond to last ping -- terminate
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(); // Browser auto-responds with pong
  });
}, HEARTBEAT_INTERVAL);

wss.on('close', () => {
  clearInterval(interval);
});
```

#### Client-Side Fix: Reconnection Logic

The browser WebSocket API automatically handles Pong responses to server Pings (no code needed). However, you must handle reconnection for cases where the connection does drop:

```javascript
class ReconnectingWebSocket {
  constructor(url) {
    this.url = url;
    this.reconnectDelay = 1000;
    this.maxReconnectDelay = 30000;
    this.messageHandlers = [];
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectDelay = 1000; // Reset backoff on successful connection
    };

    this.ws.onmessage = (event) => {
      this.messageHandlers.forEach((handler) => handler(event));
    };

    this.ws.onclose = (event) => {
      console.log(`Disconnected (code: ${event.code}). Reconnecting in ${this.reconnectDelay}ms`);
      setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
    };

    this.ws.onerror = () => {
      this.ws.close(); // Triggers onclose -> reconnect
    };
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }
}
```

#### Infrastructure Fixes

If you cannot modify the server code, or as a complement, adjust proxy timeouts:

**Nginx:**
```nginx
location /ws/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # Increase idle timeout from 60s to 300s
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
}
```

**AWS ALB:**
- ALB idle timeout default is 60 seconds. Increase to 300-3600 seconds in the target group settings.
- ALB does NOT forward WebSocket ping/pong frames in some configurations -- always rely on application-level heartbeats.

**HAProxy:**
```
defaults
    timeout client 300s
    timeout server 300s
    timeout tunnel 3600s  # Critical for WebSocket long-lived connections
```

#### Why Application-Level Heartbeats Are Preferred

Even after fixing proxy timeouts, always implement server-side ping/pong because:

1. **Dead connection detection**: TCP keep-alive has long default intervals (often 2 hours). WebSocket ping/pong detects dead clients in seconds.
2. **Mobile networks**: Carrier NATs aggressively close idle connections (sometimes in 30 seconds). Only active traffic keeps the path open.
3. **Defense in depth**: You cannot always control every proxy, CDN, or firewall in the path.

---

## Task 3

### Authenticating WebSocket Connections with JWT

There are three standard approaches, each with different trade-offs. The recommended approach for most applications is Option A (query parameter during handshake) combined with periodic re-validation.

#### Option A: JWT in the Handshake Query Parameter (Recommended)

The browser WebSocket API does not support custom headers. Pass the JWT as a query parameter during the initial HTTP upgrade request.

**Client:**
```javascript
const token = getAccessToken(); // From your auth service
const ws = new WebSocket(`wss://api.example.com/ws?token=${token}`);
```

**Server (Node.js with ws library):**
```javascript
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'your-api',
    });

    // Attach user info to the request for use in connection handler
    request.user = payload;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});

wss.on('connection', (ws, request) => {
  const user = request.user;
  console.log(`User ${user.sub} connected`);

  // Store token expiry for periodic re-validation
  ws.tokenExp = user.exp;
  ws.userId = user.sub;
});

server.listen(8080);
```

**Security note on query parameters**: The JWT will appear in server access logs and potentially in proxy logs. Mitigate by: (1) using short-lived tokens (5 minutes), (2) configuring log scrubbing for the `token` parameter, (3) using TLS (wss://) always.

#### Option B: Ticket-Based Authentication (Most Secure)

Issue a short-lived, single-use ticket via your REST API, then use it to open the WebSocket. This avoids exposing the JWT in URLs entirely.

**Flow:**
```
1. Client -> REST API: POST /api/ws-ticket (Authorization: Bearer <JWT>)
2. REST API -> Client: { "ticket": "abc123", "expires_in": 30 }
3. Client -> WS Server: new WebSocket("wss://api.example.com/ws?ticket=abc123")
4. WS Server validates ticket (single-use, not expired) -> accepts connection
```

**REST endpoint:**
```javascript
app.post('/api/ws-ticket', authenticateJWT, async (req, res) => {
  const ticket = crypto.randomBytes(32).toString('hex');

  // Store in Redis with 30-second TTL
  await redis.set(`ws-ticket:${ticket}`, JSON.stringify({
    userId: req.user.sub,
    roles: req.user.roles,
  }), 'EX', 30);

  res.json({ ticket, expires_in: 30 });
});
```

**WebSocket server:**
```javascript
server.on('upgrade', async (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const ticket = url.searchParams.get('ticket');

  if (!ticket) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // Atomic get-and-delete: single-use guarantee
  const userData = await redis.getDel(`ws-ticket:${ticket}`);

  if (!userData) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  request.user = JSON.parse(userData);

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
```

#### Option C: First-Message Authentication

Establish the WebSocket connection without authentication, then require the first message to be an auth payload. Reject and close if it is not.

```javascript
wss.on('connection', (ws) => {
  ws.isAuthenticated = false;

  // Close if not authenticated within 5 seconds
  const authTimeout = setTimeout(() => {
    if (!ws.isAuthenticated) {
      ws.close(4001, 'Authentication timeout');
    }
  }, 5000);

  ws.on('message', (data) => {
    if (!ws.isAuthenticated) {
      try {
        const msg = JSON.parse(data);
        if (msg.type !== 'auth' || !msg.token) {
          ws.close(4002, 'First message must be auth');
          return;
        }
        const payload = jwt.verify(msg.token, process.env.JWT_SECRET);
        ws.isAuthenticated = true;
        ws.userId = payload.sub;
        clearTimeout(authTimeout);
        ws.send(JSON.stringify({ type: 'auth', status: 'ok' }));
      } catch {
        ws.close(4003, 'Invalid token');
      }
      return;
    }

    // Normal message handling
    handleMessage(ws, data);
  });
});
```

This approach is simpler but has a downside: the WebSocket connection is established before authentication, consuming server resources for unauthenticated clients. Rate-limit connection attempts by IP to mitigate.

#### Periodic Token Re-Validation

JWT tokens expire. For long-lived WebSocket connections, re-validate periodically:

```javascript
// Check token expiry every 60 seconds
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.tokenExp && Date.now() / 1000 > ws.tokenExp) {
      // Send a re-auth request to the client
      ws.send(JSON.stringify({
        type: 'auth',
        action: 'refresh_required',
      }));

      // Grace period: close if not re-authenticated in 30s
      ws.reauthTimeout = setTimeout(() => {
        ws.close(4004, 'Token expired');
      }, 30000);
    }
  });
}, 60000);

// Handle re-auth messages
ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.type === 'auth' && msg.action === 'refresh') {
    try {
      const payload = jwt.verify(msg.token, process.env.JWT_SECRET);
      ws.tokenExp = payload.exp;
      clearTimeout(ws.reauthTimeout);
      ws.send(JSON.stringify({ type: 'auth', status: 'refreshed' }));
    } catch {
      ws.close(4003, 'Invalid refresh token');
    }
  }
});
```

#### Comparison

| Approach | Security | Complexity | Browser Support |
|----------|----------|------------|----------------|
| Query parameter | Good (with short-lived tokens + TLS) | Low | Full |
| Ticket-based | Best (single-use, no JWT in URL) | Medium (requires Redis) | Full |
| First-message | Acceptable | Low | Full |

For most applications, start with Option A. Move to Option B if you have strict security requirements or compliance needs.

---

## Task 4

### Scaling Socket.IO Beyond a Single Node.js Process

The in-memory adapter only works for a single process because Socket.IO rooms, namespaces, and broadcast state are not shared across processes. To scale to 10K concurrent connections, you need a shared message bus.

#### Architecture

```
                    +------------------+
                    |  Load Balancer   |
                    |  (sticky sessions|
                    |   REQUIRED)      |
                    +--------+---------+
                             |
           +-----------------+-----------------+
           |                 |                 |
    +------v------+   +------v------+   +------v------+
    | Node.js #1  |   | Node.js #2  |   | Node.js #3  |
    | Socket.IO   |   | Socket.IO   |   | Socket.IO   |
    | ~3.3K conn  |   | ~3.3K conn  |   | ~3.3K conn  |
    +------+------+   +------+------+   +------+------+
           |                 |                 |
           +-----------------+-----------------+
                             |
                    +--------v---------+
                    |  Redis 7+        |
                    |  (pub/sub +      |
                    |   streams)       |
                    +------------------+
```

#### Step 1: Switch to the Redis Adapter

Install and configure `@socket.io/redis-adapter`:

```bash
npm install @socket.io/redis-adapter redis
```

```javascript
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

async function createSocketServer(httpServer) {
  const pubClient = createClient({ url: 'redis://redis-host:6379' });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  const io = new Server(httpServer, {
    cors: { origin: '*' },
    // Performance tuning for 10K connections
    pingInterval: 25000,
    pingTimeout: 20000,
    maxHttpBufferSize: 1e6, // 1MB max message
    connectTimeout: 10000,
  });

  io.adapter(createAdapter(pubClient, subClient));

  return io;
}
```

With this adapter, when one process calls `io.to('room').emit('event', data)`, the adapter publishes the event to Redis, and all other processes pick it up and emit to their local clients in that room.

#### Step 2: Enable Sticky Sessions

Socket.IO uses HTTP long-polling as a fallback transport and for the initial handshake. Sticky sessions ensure that all HTTP requests from a single client reach the same Node.js process. Without this, the handshake will fail.

**Nginx:**
```nginx
upstream socketio_backend {
    ip_hash;  # Sticky sessions based on client IP
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 443 ssl;

    location /socket.io/ {
        proxy_pass http://socketio_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Timeouts for long-lived connections
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

If all clients support WebSocket (modern browsers do), you can skip the polling transport entirely and avoid the sticky session requirement:

```javascript
// Client-side: skip polling, go straight to WebSocket
const socket = io('https://api.example.com', {
  transports: ['websocket'], // Skip HTTP long-polling entirely
});
```

```javascript
// Server-side: disable polling if all clients use WebSocket
const io = new Server(httpServer, {
  transports: ['websocket'], // No polling fallback
});
```

With `transports: ['websocket']` on both sides, sticky sessions are not required because every connection is a single persistent TCP connection -- any process can handle it.

#### Step 3: Run Multiple Processes with PM2 or Node.js Cluster

**PM2 (recommended for production):**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'socketio-server',
    script: './server.js',
    instances: 'max',     // One process per CPU core
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      REDIS_URL: 'redis://redis-host:6379',
    },
  }],
};
```

```bash
pm2 start ecosystem.config.js
```

**Node.js Cluster (manual):**
```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = Math.min(os.cpus().length, 4); // Cap at 4 for 10K connections

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  require('./server.js');
}
```

#### Step 4: Connection and Room Management

With the Redis adapter, room joins and leaves are automatically synced. No code changes needed for basic room operations:

```javascript
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    // This broadcast reaches clients across ALL processes
    io.to(roomId).emit('user-joined', { userId: socket.userId });
  });

  socket.on('message', (roomId, content) => {
    // Automatically relayed to all processes via Redis
    io.to(roomId).emit('message', {
      from: socket.userId,
      content,
      timestamp: Date.now(),
    });
  });
});
```

#### Step 5: Monitoring and Capacity Planning

For 10K concurrent connections across 3-4 Node.js processes:

```javascript
// Expose metrics
setInterval(async () => {
  const sockets = await io.fetchSockets();
  const rooms = io.sockets.adapter.rooms;

  console.log({
    totalConnections: sockets.length,
    totalRooms: rooms.size,
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
    pid: process.pid,
  });
}, 30000);
```

**Capacity estimates for 10K connections:**
- Memory: ~50-100MB per process (assuming small payloads), 200-400MB total.
- Redis: Minimal load for pub/sub. A single Redis instance handles 100K+ messages/sec.
- CPU: 3-4 Node.js processes on a 4-core machine is sufficient.
- Network: The main bottleneck at scale. 10K connections with 1 message/sec at 1KB each = ~10MB/s throughput.

#### Redis Adapter Alternatives

For higher throughput or more advanced needs:

| Adapter | Use Case | Throughput |
|---------|----------|------------|
| `@socket.io/redis-adapter` | Default, good for most cases | ~50K msg/sec |
| `@socket.io/redis-streams-adapter` | Message ordering guarantees, durability | ~30K msg/sec |
| `@socket.io/postgres-adapter` | Already using PostgreSQL, no Redis | ~10K msg/sec |
| `@socket.io/mongo-adapter` | Already using MongoDB, no Redis | ~10K msg/sec |

For 10K connections, the standard Redis adapter is more than sufficient.

---

## Task 5

### Rate Limiting WebSocket Messages

Unlike HTTP rate limiting (where each request is independent), WebSocket rate limiting operates on a persistent connection. You need per-connection tracking with efficient memory usage.

#### Token Bucket Implementation

The token bucket algorithm is ideal for WebSocket rate limiting: it allows short bursts while enforcing an average rate. For 10 messages/second, configure a bucket that refills at 10 tokens/second with a small burst capacity.

```javascript
class TokenBucket {
  constructor(rate, capacity) {
    this.rate = rate;           // Tokens per second (10)
    this.capacity = capacity;   // Max burst size (15 -- allows small bursts)
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.rate);
    this.lastRefill = now;
  }
}
```

#### Integration with WebSocket Server

```javascript
const WebSocket = require('ws');

const RATE_LIMIT = 10;        // messages per second
const BURST_CAPACITY = 15;    // allow small bursts
const WARN_THRESHOLD = 3;     // warn when 3 violations
const BAN_THRESHOLD = 10;     // disconnect after 10 violations
const VIOLATION_DECAY = 5000; // reset violation count after 5s of good behavior

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // Per-connection rate limiter
  ws.rateLimiter = new TokenBucket(RATE_LIMIT, BURST_CAPACITY);
  ws.violations = 0;
  ws.lastViolation = 0;

  ws.on('message', (data) => {
    // Decay violations over time
    if (ws.violations > 0 && Date.now() - ws.lastViolation > VIOLATION_DECAY) {
      ws.violations = Math.max(0, ws.violations - 1);
    }

    if (!ws.rateLimiter.consume()) {
      ws.violations++;
      ws.lastViolation = Date.now();

      if (ws.violations >= BAN_THRESHOLD) {
        // Hard disconnect for persistent violators
        ws.send(JSON.stringify({
          type: 'error',
          code: 'RATE_LIMIT_BAN',
          message: 'Disconnected: persistent rate limit violation',
        }));
        ws.close(4029, 'Rate limit exceeded');
        return;
      }

      if (ws.violations >= WARN_THRESHOLD) {
        ws.send(JSON.stringify({
          type: 'error',
          code: 'RATE_LIMIT_WARNING',
          message: `Slow down. ${BAN_THRESHOLD - ws.violations} violations until disconnect.`,
          retryAfter: 1000, // Suggest client waits 1 second
        }));
      }

      // Drop the message silently for first few violations,
      // send warning after threshold
      return;
    }

    // Message passed rate limit -- process normally
    handleMessage(ws, data);
  });
});
```

#### Client-Side Rate Limiting (Cooperative)

Implement client-side throttling to avoid triggering server-side limits. This improves user experience by queuing messages instead of dropping them.

```javascript
class RateLimitedSocket {
  constructor(url, maxRate = 10) {
    this.ws = new WebSocket(url);
    this.maxRate = maxRate;
    this.queue = [];
    this.sendCount = 0;
    this.windowStart = Date.now();

    // Process queue at the rate limit
    this.processInterval = setInterval(() => this.processQueue(), 1000 / maxRate);

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'error' && msg.code === 'RATE_LIMIT_WARNING') {
        // Back off: pause sending for retryAfter duration
        this.paused = true;
        setTimeout(() => { this.paused = false; }, msg.retryAfter || 1000);
      }
    };
  }

  send(data) {
    this.queue.push(data);
  }

  processQueue() {
    if (this.paused || this.queue.length === 0) return;
    if (this.ws.readyState !== WebSocket.OPEN) return;

    const message = this.queue.shift();
    this.ws.send(typeof message === 'string' ? message : JSON.stringify(message));
  }

  close() {
    clearInterval(this.processInterval);
    this.ws.close();
  }
}
```

#### Socket.IO Middleware Approach

If using Socket.IO, implement rate limiting as middleware:

```javascript
io.use((socket, next) => {
  socket.rateLimiter = new TokenBucket(10, 15);
  socket.violations = 0;
  next();
});

// Apply rate limiting to all events
io.on('connection', (socket) => {
  const originalOnEvent = socket.onevent;

  socket.onevent = function (packet) {
    if (!socket.rateLimiter.consume()) {
      socket.violations++;

      if (socket.violations >= 10) {
        socket.emit('error', { code: 'RATE_LIMIT_BAN' });
        socket.disconnect(true);
        return;
      }

      socket.emit('error', {
        code: 'RATE_LIMIT',
        message: 'Too many messages',
      });
      return;
    }

    // Pass through to normal handler
    originalOnEvent.call(socket, packet);
  };
});
```

#### Per-Event Rate Limiting

Different events may warrant different rate limits. A chat message should be limited more strictly than a typing indicator:

```javascript
const EVENT_LIMITS = {
  'chat:message':    { rate: 5,  burst: 8 },   // 5 messages/sec
  'chat:typing':     { rate: 2,  burst: 3 },   // 2 updates/sec
  'cursor:move':     { rate: 20, burst: 30 },   // 20 updates/sec (collaborative editor)
  'document:edit':   { rate: 15, burst: 20 },   // 15 ops/sec
  default:           { rate: 10, burst: 15 },
};

io.on('connection', (socket) => {
  socket.limiters = {};

  const getOrCreateLimiter = (event) => {
    if (!socket.limiters[event]) {
      const config = EVENT_LIMITS[event] || EVENT_LIMITS.default;
      socket.limiters[event] = new TokenBucket(config.rate, config.burst);
    }
    return socket.limiters[event];
  };

  const originalOnEvent = socket.onevent;
  socket.onevent = function (packet) {
    const eventName = packet.data[0];
    const limiter = getOrCreateLimiter(eventName);

    if (!limiter.consume()) {
      socket.emit('rate_limited', {
        event: eventName,
        retryAfter: 100,
      });
      return;
    }

    originalOnEvent.call(socket, packet);
  };
});
```

#### Violation Handling Strategy Summary

| Violation Count | Action | Rationale |
|----------------|--------|-----------|
| 1-2 | Drop message silently | Minor burst, do not annoy the user |
| 3-9 | Drop + send warning to client | Inform client to back off |
| 10+ | Disconnect with code 4029 | Persistent abuse, protect server resources |

#### Memory Considerations

Each `TokenBucket` instance uses ~40 bytes. Per-event limiters with 5 event types use ~200 bytes per connection. At 10K connections, that is roughly 2MB -- negligible. No need for shared/external rate limiting state unless you need cross-process rate limits (which is unusual for per-connection limits on WebSocket).
