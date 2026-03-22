## Task 1: WebSocket Architecture for Collaborative Text Editor (500 Concurrent Users/Document)

### Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Clients    │────>│   Load Balancer   │────>│  WS Server Pool │
│  (Browsers)  │<────│  (sticky session) │<────│  (N instances)  │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │   Redis Pub/Sub  │
                                              │  (cross-node sync)│
                                              └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  Document Store   │
                                              │ (PostgreSQL/Mongo)│
                                              └──────────────────┘
```

### Key Challenges and Solutions

**1. Conflict Resolution (the hardest problem)**

Use a CRDT (Conflict-free Replicated Data Type) library such as **Yjs** or Automerge rather than Operational Transform. CRDTs allow every client to apply edits locally and merge without a central coordinator.

```javascript
import * as Y from 'yjs';

const docs = new Map();

function getOrCreateDoc(docId) {
  if (!docs.has(docId)) {
    const doc = new Y.Doc();
    doc.on('update', debounce((update) => {
      persistSnapshot(docId, Y.encodeStateAsUpdate(doc));
    }, 2000));
    docs.set(docId, doc);
  }
  return docs.get(docId);
}

wss.on('connection', (ws, req) => {
  const docId = parseDocId(req.url);
  const doc = getOrCreateDoc(docId);
  ws.on('message', (data) => {
    const update = new Uint8Array(data);
    Y.applyUpdate(doc, update);
    broadcastToDoc(docId, update, ws);
  });
  ws.send(Y.encodeStateAsUpdate(doc));
});
```

**2. Bandwidth at Scale**

- **Delta compression**: Send only CRDT update deltas (typically 20-100 bytes per edit)
- **Update batching**: Accumulate updates over a 50ms window
- **Awareness throttling**: Cursor positions broadcast at most 2-3 times per second

**3. Persistence Strategy**

Keep the authoritative CRDT document in memory. Persist snapshots every N seconds or N updates. On server restart, load the last snapshot and replay buffered updates.

**4. Multi-Node Scaling**

Use Redis Pub/Sub to relay CRDT updates across server instances. Each server subscribes to channels for documents it has active clients for.

| Concern | Recommendation |
|---|---|
| Conflict resolution | Yjs (CRDT) |
| Cross-node messaging | Redis Pub/Sub |
| Persistence | PostgreSQL with binary CRDT snapshots |
| Load balancing | Sticky sessions via IP hash |
| Presence/cursors | Yjs awareness protocol, throttled to 3Hz |

---

## Task 2: Fixing WebSocket Disconnections After 60 Seconds of Inactivity

The 60-second timeout is caused by an intermediary (load balancer, reverse proxy, or cloud provider) closing idle TCP connections. The fix is **application-level heartbeats (ping/pong)**.

### Server-Side Fix (Node.js with `ws`)

```javascript
const HEARTBEAT_INTERVAL = 30_000;

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTERVAL);

wss.on('close', () => clearInterval(interval));
```

The `ws.ping()` sends a WebSocket protocol-level ping frame. The browser automatically responds with a pong -- no client-side code needed. This keeps the TCP connection active so proxies see it as live.

### Client-Side (for detecting dead servers)

```javascript
function createReconnectingSocket(url) {
  let ws;
  let pingTimer;

  function connect() {
    ws = new WebSocket(url);
    ws.onopen = () => {
      pingTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send('__ping__');
      }, 25_000);
    };
    ws.onmessage = (event) => {
      if (event.data === '__pong__') return;
      // Handle normal messages
    };
    ws.onclose = () => {
      clearInterval(pingTimer);
      setTimeout(connect, 1000 + Math.random() * 2000);
    };
  }
  connect();
}
```

### Proxy Configuration (nginx)

```nginx
location /ws/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
}
```

---

## Task 3: Authenticating WebSocket Connections with JWT

### Recommended: Token in Query Parameter (with one-time ticket)

```javascript
// CLIENT
const token = localStorage.getItem('jwt');
const ws = new WebSocket(`wss://api.example.com/ws?token=${token}`);
```

```javascript
// SERVER
server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});
```

**Security note**: Query parameters may appear in logs. Use short-lived tokens (60 seconds) exchanged from your REST API specifically for the WebSocket connection:

```javascript
// REST: POST /api/ws-ticket
app.post('/api/ws-ticket', authenticateJWT, (req, res) => {
  const ticket = jwt.sign(
    { sub: req.user.id, purpose: 'ws' },
    process.env.JWT_SECRET,
    { expiresIn: '60s' }
  );
  res.json({ ticket });
});
```

### Token Refresh for Long-Lived Connections

Have the client send a new token over the existing connection before the old one expires:

```javascript
setTimeout(async () => {
  const newToken = await fetch('/api/refresh-token').then(r => r.json());
  ws.send(JSON.stringify({ type: 'token_refresh', token: newToken.access_token }));
}, expiresIn - 60_000);
```

---

## Task 4: Scaling Socket.IO Beyond a Single Node.js Process

### Step 1: Install the Redis Adapter

```bash
npm install @socket.io/redis-adapter redis
```

### Step 2: Configure Each Server Instance

```javascript
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: 'redis://redis-host:6379' });
const subClient = pubClient.duplicate();
await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

### Step 3: Sticky Sessions (Required for HTTP polling)

**Using nginx:**

```nginx
upstream socket_servers {
    ip_hash;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
    server 127.0.0.1:3004;
}
```

**Or skip the problem entirely** by forcing WebSocket-only transport:

```javascript
const socket = io('https://api.example.com', {
  transports: ['websocket'],
});
```

### Step 4: Run Multiple Processes

```bash
pm2 start server.js -i 4 --name socket-server
```

### Capacity Planning for 10K Connections

| Resource | Estimate |
|---|---|
| Memory per connection | ~10-20 KB |
| Total memory (10K) | ~150-200 MB |
| Worker processes | 4 (one per CPU core) |
| Redis | Single instance is fine |

---

## Task 5: Rate Limiting WebSocket Messages

### Token Bucket Implementation

```javascript
class TokenBucket {
  constructor(rate, capacity) {
    this.rate = rate;
    this.capacity = capacity;
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

### Server Integration

```javascript
const rateLimiters = new WeakMap();
const violations = new WeakMap();

wss.on('connection', (ws) => {
  rateLimiters.set(ws, new TokenBucket(10, 15)); // 10/sec, burst of 15
  violations.set(ws, { count: 0, cooldownUntil: 0 });

  ws.on('message', (data) => {
    const violation = violations.get(ws);

    if (Date.now() < violation.cooldownUntil) return; // silently drop

    const bucket = rateLimiters.get(ws);
    if (!bucket.consume()) {
      violation.count += 1;

      if (violation.count >= 3) {
        ws.close(4029, 'Rate limit exceeded');
        return;
      }

      violation.cooldownUntil = Date.now() + 5000;
      ws.send(JSON.stringify({
        type: 'error',
        code: 'RATE_LIMITED',
        retryAfter: 5000,
      }));
      return;
    }

    handleMessage(ws, data);
  });
});
```

### Escalating Response Strategy

| Violation # | Action |
|---|---|
| 1st | Warning + 5s cooldown |
| 2nd | Warning + 5s cooldown |
| 3rd | Disconnect with close code `4029` |

Using `WeakMap` ensures memory is automatically freed when connections are garbage collected.
