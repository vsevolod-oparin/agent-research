# WebSocket Engineering Solutions

## Task 1

### Real-Time Collaborative Text Editor: WebSocket Architecture for 500 Concurrent Users Per Document

#### Key Challenges

1. **Conflict resolution** -- Multiple users editing the same region simultaneously produces divergent document states.
2. **Operational ordering** -- Network latency means operations arrive out of order across clients.
3. **Cursor and selection awareness** -- Each user needs to see where others are editing in real time.
4. **Bandwidth at scale** -- 500 users generating keystrokes can produce thousands of messages per second per document.
5. **State recovery** -- Late joiners and reconnecting clients need the current document state without replaying the full history.

#### Architecture

```
                         Load Balancer (sticky sessions by document_id)
                                |
              +-----------------+-----------------+
              |                 |                 |
         WS Server 1       WS Server 2       WS Server 3
         (doc A, B)        (doc C, D)        (doc A, E)
              |                 |                 |
              +-----------------+-----------------+
                                |
                    Redis Pub/Sub (cross-node fan-out)
                                |
                    PostgreSQL / MongoDB
                    (document snapshots + op log)
```

#### Conflict Resolution: Use CRDTs over OT

For 500 concurrent users, CRDTs (Conflict-free Replicated Data Types) are preferable to Operational Transformation. OT requires a central server to serialize operations, creating a bottleneck. CRDTs allow every client to apply operations independently and converge to the same state.

Recommended library: **Yjs** (production-proven, efficient binary encoding, awareness protocol built in).

#### Server Implementation

```typescript
import { WebSocketServer, WebSocket } from 'ws';
import * as Y from 'yjs';
import { encodeStateAsUpdate, applyUpdate, encodeStateVector } from 'yjs';
import Redis from 'ioredis';

interface DocumentRoom {
  doc: Y.Doc;
  clients: Map<string, WebSocket>;
  awarenessStates: Map<string, AwarenessState>;
  lastSnapshotVersion: number;
}

interface AwarenessState {
  user: { name: string; color: string };
  cursor: { index: number; length: number } | null;
}

const rooms = new Map<string, DocumentRoom>();
const redisPub = new Redis(process.env.REDIS_URL!);
const redisSub = new Redis(process.env.REDIS_URL!);

function getOrCreateRoom(docId: string): DocumentRoom {
  if (!rooms.has(docId)) {
    const doc = new Y.Doc();
    const room: DocumentRoom = {
      doc,
      clients: new Map(),
      awarenessStates: new Map(),
      lastSnapshotVersion: 0,
    };

    // Load persisted state
    loadDocumentFromDB(docId, doc);

    // Subscribe to cross-node updates via Redis
    redisSub.subscribe(`doc:${docId}:update`);
    redisSub.subscribe(`doc:${docId}:awareness`);

    rooms.set(docId, room);
  }
  return rooms.get(docId)!;
}

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket, req) => {
  const docId = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('doc')!;
  const userId = generateUserId();
  const room = getOrCreateRoom(docId);

  room.clients.set(userId, ws);

  // Send current document state to the joining client
  const stateUpdate = encodeStateAsUpdate(room.doc);
  ws.send(JSON.stringify({
    type: 'sync-full',
    update: Buffer.from(stateUpdate).toString('base64'),
    awareness: Object.fromEntries(room.awarenessStates),
  }));

  ws.on('message', (raw: Buffer) => {
    const msg = JSON.parse(raw.toString());

    switch (msg.type) {
      case 'update': {
        const update = Buffer.from(msg.update, 'base64');
        // Apply to server doc -- Yjs handles conflict resolution
        applyUpdate(room.doc, new Uint8Array(update));

        // Fan out to local clients (skip sender)
        broadcastToRoom(room, userId, {
          type: 'update',
          update: msg.update,
        });

        // Fan out to other server nodes via Redis
        redisPub.publish(`doc:${docId}:update`, JSON.stringify({
          senderId: userId,
          sourceNode: process.env.NODE_ID,
          update: msg.update,
        }));

        // Periodic snapshot persistence
        maybeSnapshotDocument(docId, room);
        break;
      }

      case 'awareness': {
        room.awarenessStates.set(userId, msg.state);
        broadcastToRoom(room, userId, {
          type: 'awareness',
          userId,
          state: msg.state,
        });
        redisPub.publish(`doc:${docId}:awareness`, JSON.stringify({
          userId,
          sourceNode: process.env.NODE_ID,
          state: msg.state,
        }));
        break;
      }
    }
  });

  ws.on('close', () => {
    room.clients.delete(userId);
    room.awarenessStates.delete(userId);
    broadcastToRoom(room, userId, {
      type: 'awareness',
      userId,
      state: null, // signals user left
    });

    // Clean up empty rooms after delay
    if (room.clients.size === 0) {
      setTimeout(() => {
        if (room.clients.size === 0) {
          persistDocument(docId, room.doc);
          rooms.delete(docId);
        }
      }, 30_000);
    }
  });
});

// Handle cross-node Redis messages
redisSub.on('message', (channel: string, message: string) => {
  const parsed = JSON.parse(message);
  if (parsed.sourceNode === process.env.NODE_ID) return; // skip own messages

  const docId = channel.split(':')[1];
  const room = rooms.get(docId);
  if (!room) return;

  if (channel.endsWith(':update')) {
    const update = Buffer.from(parsed.update, 'base64');
    applyUpdate(room.doc, new Uint8Array(update));
    // Broadcast to all local clients
    for (const [, client] of room.clients) {
      client.send(JSON.stringify({ type: 'update', update: parsed.update }));
    }
  } else if (channel.endsWith(':awareness')) {
    if (parsed.state) {
      room.awarenessStates.set(parsed.userId, parsed.state);
    } else {
      room.awarenessStates.delete(parsed.userId);
    }
    for (const [, client] of room.clients) {
      client.send(JSON.stringify({
        type: 'awareness',
        userId: parsed.userId,
        state: parsed.state,
      }));
    }
  }
});

function broadcastToRoom(room: DocumentRoom, excludeUserId: string, msg: object) {
  const payload = JSON.stringify(msg);
  for (const [uid, client] of room.clients) {
    if (uid !== excludeUserId && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

async function maybeSnapshotDocument(docId: string, room: DocumentRoom) {
  // Snapshot every 100 operations to bound recovery time
  const currentVersion = room.doc.clientID; // simplified; real impl tracks op count
  if (currentVersion - room.lastSnapshotVersion > 100) {
    await persistDocument(docId, room.doc);
    room.lastSnapshotVersion = currentVersion;
  }
}
```

#### Client Implementation

```typescript
import * as Y from 'yjs';

const doc = new Y.Doc();
const text = doc.getText('content');
let ws: WebSocket;

function connect(docId: string, token: string) {
  ws = new WebSocket(`wss://collab.example.com/ws?doc=${docId}&token=${token}`);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
      case 'sync-full': {
        const update = Uint8Array.from(atob(msg.update), c => c.charCodeAt(0));
        Y.applyUpdate(doc, update);
        renderAwareness(msg.awareness);
        break;
      }
      case 'update': {
        const update = Uint8Array.from(atob(msg.update), c => c.charCodeAt(0));
        Y.applyUpdate(doc, update);
        break;
      }
      case 'awareness':
        updateCursorOverlay(msg.userId, msg.state);
        break;
    }
  };

  // Listen for local changes and send to server
  doc.on('update', (update: Uint8Array, origin: any) => {
    if (origin === 'remote') return; // don't echo back remote updates
    ws.send(JSON.stringify({
      type: 'update',
      update: btoa(String.fromCharCode(...update)),
    }));
  });
}
```

#### Bandwidth Optimization for 500 Users

At 500 concurrent users, naive broadcasting creates an O(n) fan-out per keystroke.

1. **Batch updates** -- Buffer changes for 50-100ms before sending. Yjs merges operations efficiently.
2. **Binary encoding** -- Use Yjs binary protocol instead of JSON for update payloads (3-10x smaller).
3. **Awareness throttling** -- Throttle cursor/selection broadcasts to 5 updates/second per user.
4. **Document partitioning** -- For very large documents, partition into sections so users only receive updates for sections they are viewing.

```typescript
// Server-side batching
const pendingUpdates = new Map<string, Uint8Array[]>();

function queueUpdate(docId: string, update: Uint8Array) {
  if (!pendingUpdates.has(docId)) {
    pendingUpdates.set(docId, []);
    setTimeout(() => flushUpdates(docId), 50); // 50ms batch window
  }
  pendingUpdates.get(docId)!.push(update);
}

function flushUpdates(docId: string) {
  const updates = pendingUpdates.get(docId);
  pendingUpdates.delete(docId);
  if (!updates || updates.length === 0) return;

  // Merge all buffered updates into one
  const merged = Y.mergeUpdates(updates);
  broadcastMergedUpdate(docId, merged);
}
```

#### Persistence Strategy

```
Write path:  Client -> Server CRDT -> Redis Pub/Sub -> Periodic Snapshot to DB
Read path:   DB Snapshot -> Apply pending ops from Redis Stream -> Serve to client
```

- Snapshot the full document state to the database every N operations or every T seconds.
- Use a Redis Stream as a write-ahead log for operations between snapshots.
- On server restart, load the latest snapshot and replay the stream.

---

## Task 2

### Fixing WebSocket Disconnections After 60 Seconds of Inactivity

#### Root Cause

The 60-second timeout is almost certainly caused by intermediate infrastructure -- load balancers, reverse proxies (Nginx, AWS ALB/ELB), or cloud provider timeouts -- closing idle TCP connections. The WebSocket protocol itself has no built-in idle timeout, but infrastructure between client and server does.

Common culprits:
- **Nginx** `proxy_read_timeout` defaults to 60s
- **AWS ALB** idle timeout defaults to 60s
- **Cloudflare** WebSocket timeout is 100s
- **HAProxy** `timeout tunnel` defaults to no timeout but `timeout server` applies

#### Solution: Application-Level Heartbeat (Ping/Pong)

The fix is a bidirectional ping/pong mechanism that keeps the connection alive by ensuring data flows within the timeout window.

#### Server-Side Implementation

```typescript
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds -- must be less than proxy timeout
const HEARTBEAT_TIMEOUT = 10_000;  // 10 seconds to respond before considered dead

wss.on('connection', (ws: WebSocket) => {
  let isAlive = true;
  let heartbeatTimer: NodeJS.Timeout;

  // Mark connection alive when pong received
  ws.on('pong', () => {
    isAlive = true;
  });

  // Start heartbeat cycle
  heartbeatTimer = setInterval(() => {
    if (!isAlive) {
      // Client did not respond to last ping -- terminate
      console.log('Client unresponsive, terminating connection');
      clearInterval(heartbeatTimer);
      ws.terminate(); // hard close, no close frame
      return;
    }

    isAlive = false;
    ws.ping(); // sends WebSocket protocol-level ping frame
  }, HEARTBEAT_INTERVAL);

  ws.on('close', () => {
    clearInterval(heartbeatTimer);
  });

  ws.on('error', () => {
    clearInterval(heartbeatTimer);
  });
});
```

#### Client-Side Implementation

The browser WebSocket API automatically responds to protocol-level ping frames with pong frames -- no client code is needed for the `ws` library approach above. However, the browser API does not expose ping/pong frames to JavaScript, so you cannot detect a dead server from the client side using protocol-level pings alone.

Add an application-level heartbeat for client-side dead connection detection:

```typescript
class ResilientWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private heartbeatInterval: number | null = null;
  private missedHeartbeats = 0;
  private maxMissedHeartbeats = 3;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'pong') {
        this.missedHeartbeats = 0;
        return;
      }
      // Handle application messages
      this.onMessage(data);
    };

    this.ws.onclose = (event: CloseEvent) => {
      this.stopHeartbeat();
      if (!event.wasClean) {
        this.reconnect();
      }
    };

    this.ws.onerror = () => {
      this.stopHeartbeat();
    };
  }

  private startHeartbeat() {
    this.missedHeartbeats = 0;
    this.heartbeatInterval = window.setInterval(() => {
      if (this.missedHeartbeats >= this.maxMissedHeartbeats) {
        console.log('Server unresponsive, reconnecting');
        this.ws?.close();
        this.stopHeartbeat();
        this.reconnect();
        return;
      }

      this.missedHeartbeats++;
      this.ws?.send(JSON.stringify({ type: 'ping', ts: Date.now() }));
    }, 25_000); // 25 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    // Exponential backoff with jitter
    const baseDelay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30_000);
    const jitter = Math.random() * 1000;
    const delay = baseDelay + jitter;

    this.reconnectAttempts++;
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => this.connect(), delay);
  }

  private onMessage(data: any) {
    // Application message handler -- override in subclass or pass callback
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}
```

#### Infrastructure Configuration

Fix the proxy/load balancer timeout as well -- heartbeats are still needed, but a longer timeout provides margin.

**Nginx:**
```nginx
location /ws {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;

    # Increase timeouts for WebSocket connections
    proxy_read_timeout 3600s;   # 1 hour
    proxy_send_timeout 3600s;
    proxy_connect_timeout 10s;
}
```

**AWS ALB:**
```bash
aws elbv2 modify-load-balancer-attributes \
  --load-balancer-arn $ALB_ARN \
  --attributes Key=idle_timeout.timeout_seconds,Value=3600
```

**HAProxy:**
```haproxy
defaults
    timeout tunnel 3600s
    timeout client 3600s
    timeout server 3600s
```

#### Summary

| Layer | Action | Value |
|-------|--------|-------|
| Server | Send WebSocket ping frames | Every 30s |
| Client | Send application-level ping messages | Every 25s |
| Client | Detect dead server | 3 missed pongs |
| Client | Reconnect with backoff | Exponential, max 30s |
| Nginx/ALB/HAProxy | Increase idle timeout | 3600s |

The heartbeat interval must always be shorter than the shortest timeout in the infrastructure chain.

---

## Task 3

### Authenticating WebSocket Connections with JWT

WebSocket connections start as an HTTP upgrade request. Authentication must happen during this upgrade -- not after the connection is open -- to prevent unauthenticated clients from consuming server resources.

#### Strategy 1: Token in Query Parameter (Most Common)

The browser WebSocket API does not allow setting custom headers, so the most practical approach is passing the JWT in the query string during the initial connection.

**Client:**
```typescript
const token = localStorage.getItem('jwt');
const ws = new WebSocket(`wss://api.example.com/ws?token=${token}`);
```

**Server (Node.js with `ws` library):**
```typescript
import { WebSocketServer, WebSocket } from 'ws';
import { createServer, IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends WebSocket {
  userId: string;
  roles: string[];
}

const JWT_SECRET = process.env.JWT_SECRET!;

const server = createServer();
const wss = new WebSocketServer({ noServer: true }); // noServer for manual upgrade handling

// Authenticate during HTTP upgrade -- before WebSocket handshake completes
server.on('upgrade', (request: IncomingMessage, socket, head) => {
  const url = new URL(request.url!, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'api.example.com',
    }) as { sub: string; roles: string[]; exp: number };

    // Complete the WebSocket handshake
    wss.handleUpgrade(request, socket, head, (ws) => {
      const authWs = ws as AuthenticatedSocket;
      authWs.userId = payload.sub;
      authWs.roles = payload.roles;

      wss.emit('connection', authWs, request);
    });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      socket.write('HTTP/1.1 401 Token Expired\r\n\r\n');
    } else {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    }
    socket.destroy();
  }
});

wss.on('connection', (ws: AuthenticatedSocket) => {
  console.log(`User ${ws.userId} connected with roles: ${ws.roles}`);

  // The connection is now authenticated -- all messages from this socket
  // are from a verified user
  ws.on('message', (data) => {
    // Authorize specific actions based on roles
    const msg = JSON.parse(data.toString());
    if (msg.type === 'admin_action' && !ws.roles.includes('admin')) {
      ws.send(JSON.stringify({ error: 'Forbidden', code: 4003 }));
      return;
    }
    handleMessage(ws, msg);
  });
});

server.listen(8080);
```

#### Strategy 2: Ticket-Based Authentication (More Secure)

Query parameters can appear in server access logs, proxy logs, and browser history. For higher security, use a short-lived, single-use ticket obtained via your authenticated REST API.

**Flow:**
```
1. Client -> REST API:  POST /api/ws-ticket  (with JWT in Authorization header)
2. REST API -> Client:  { ticket: "abc123", expiresIn: 30 }
3. Client -> WS Server: new WebSocket("wss://api.example.com/ws?ticket=abc123")
4. WS Server -> Redis:  Validate and consume ticket (single-use)
5. WS Server -> Client: Connection established
```

**REST endpoint to issue tickets:**
```typescript
import { randomBytes } from 'crypto';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

// Called from your existing authenticated REST API
app.post('/api/ws-ticket', authenticateJWT, async (req, res) => {
  const ticket = randomBytes(32).toString('hex');
  const ticketData = {
    userId: req.user.id,
    roles: req.user.roles,
    createdAt: Date.now(),
  };

  // Store ticket in Redis with 30-second TTL
  await redis.set(
    `ws:ticket:${ticket}`,
    JSON.stringify(ticketData),
    'EX', 30 // expires in 30 seconds
  );

  res.json({ ticket, expiresIn: 30 });
});
```

**WebSocket server validates and consumes the ticket:**
```typescript
server.on('upgrade', async (request, socket, head) => {
  const url = new URL(request.url!, `http://${request.headers.host}`);
  const ticket = url.searchParams.get('ticket');

  if (!ticket) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // Atomic get-and-delete -- ticket can only be used once
  const ticketKey = `ws:ticket:${ticket}`;
  const ticketDataRaw = await redis.get(ticketKey);
  if (!ticketDataRaw) {
    socket.write('HTTP/1.1 401 Invalid or Expired Ticket\r\n\r\n');
    socket.destroy();
    return;
  }
  await redis.del(ticketKey); // consume the ticket

  const ticketData = JSON.parse(ticketDataRaw);

  wss.handleUpgrade(request, socket, head, (ws) => {
    const authWs = ws as AuthenticatedSocket;
    authWs.userId = ticketData.userId;
    authWs.roles = ticketData.roles;
    wss.emit('connection', authWs, request);
  });
});
```

#### Handling Token Expiration on Long-Lived Connections

JWTs expire, but WebSocket connections are long-lived. You need a mechanism to re-authenticate without dropping the connection.

```typescript
// Server-side: periodic token refresh check
wss.on('connection', (ws: AuthenticatedSocket) => {
  let tokenExpiry = ws.tokenExp; // set during initial auth

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());

    if (msg.type === 'token_refresh') {
      try {
        const payload = jwt.verify(msg.token, JWT_SECRET, {
          algorithms: ['HS256'],
        }) as jwt.JwtPayload;

        // Verify it is the same user
        if (payload.sub !== ws.userId) {
          ws.send(JSON.stringify({ type: 'auth_error', reason: 'user_mismatch' }));
          ws.close(4001, 'User mismatch');
          return;
        }

        tokenExpiry = payload.exp! * 1000;
        ws.send(JSON.stringify({ type: 'token_refreshed' }));
      } catch {
        ws.send(JSON.stringify({ type: 'auth_error', reason: 'invalid_token' }));
        ws.close(4001, 'Authentication failed');
      }
      return;
    }

    // Check if token has expired for regular messages
    if (Date.now() > tokenExpiry) {
      ws.send(JSON.stringify({
        type: 'auth_error',
        reason: 'token_expired',
        action: 'refresh_required',
      }));
      return; // drop the message but keep connection open for refresh
    }

    handleMessage(ws, msg);
  });
});

// Client-side: proactive token refresh
function setupTokenRefresh(ws: WebSocket) {
  // Refresh 60 seconds before expiry
  const payload = JSON.parse(atob(token.split('.')[1]));
  const refreshAt = (payload.exp * 1000) - 60_000;

  setTimeout(async () => {
    const newToken = await refreshTokenViaRestAPI();
    ws.send(JSON.stringify({ type: 'token_refresh', token: newToken }));
  }, refreshAt - Date.now());
}
```

#### Strategy Comparison

| Approach | Security | Complexity | Browser Support |
|----------|----------|------------|-----------------|
| Query parameter JWT | Medium (token in logs) | Low | Full |
| Ticket-based | High (single-use, short-lived) | Medium | Full |
| Cookie-based | Medium (CSRF risk) | Low | Full |
| First-message auth | Low (connection open before auth) | Low | Full |

**Recommendation:** Use ticket-based authentication for production systems. It combines the security of not exposing long-lived JWTs in URLs with the simplicity of query parameter passing. The REST API handles the actual JWT validation, and the WebSocket server only deals with short-lived, single-use tickets.

---

## Task 4

### Scaling Socket.IO Beyond a Single Node.js Process

#### The Problem with In-Memory Adapter

The default Socket.IO in-memory adapter stores all connection state (rooms, sids, namespaces) in the Node.js process memory. When you run multiple processes or servers:

- A client connected to Process A is invisible to Process B.
- `io.emit()` only reaches clients on the emitting process.
- Room joins on one process are unknown to others.
- 10K connections on a single process is feasible but leaves no headroom -- a single process crash loses all connections.

#### Architecture for 10K Connections

```
                    DNS Round Robin or L4 Load Balancer
                    (sticky sessions via IP hash or cookie)
                              |
            +-----------------+-----------------+
            |                 |                 |
       Node Process 1    Node Process 2    Node Process 3
       (Socket.IO)       (Socket.IO)       (Socket.IO)
       ~3,400 conn       ~3,400 conn       ~3,400 conn
            |                 |                 |
            +-----------------+-----------------+
                              |
                    Redis 7+ (with Streams)
                    Socket.IO Redis Adapter
```

#### Step 1: Switch to Redis Adapter

```bash
npm install @socket.io/redis-adapter redis
```

```typescript
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' },
  // Connection handling tuning for scale
  pingInterval: 25000,
  pingTimeout: 20000,
  maxHttpBufferSize: 1e6,          // 1MB max message size
  connectTimeout: 10000,
  transports: ['websocket'],       // skip polling for performance
});

async function setupRedisAdapter() {
  const pubClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
      keepAlive: 30000,
    },
  });
  const subClient = pubClient.duplicate();

  pubClient.on('error', (err) => console.error('Redis pub error:', err));
  subClient.on('error', (err) => console.error('Redis sub error:', err));

  await Promise.all([pubClient.connect(), subClient.connect()]);

  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis adapter connected');
}

setupRedisAdapter().then(() => {
  httpServer.listen(3000, () => {
    console.log(`Socket.IO server running on pid ${process.pid}`);
  });
});
```

#### Step 2: Run Multiple Processes with PM2 or Cluster

**Option A: PM2 (Recommended for production)**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'socketio-server',
    script: 'dist/server.js',
    instances: 'max',         // one process per CPU core
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      REDIS_URL: 'redis://redis-host:6379',
    },
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 10000,
  }],
};
```

```bash
pm2 start ecosystem.config.js
pm2 scale socketio-server 4    # scale to 4 processes
```

**Option B: Node.js Cluster module**

```typescript
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numWorkers = Math.min(os.cpus().length, 4); // cap at 4 for 10K
  console.log(`Primary ${process.pid}: spawning ${numWorkers} workers`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.process.pid} died (code ${code}), restarting`);
    cluster.fork(); // auto-restart crashed workers
  });
} else {
  // Each worker runs the full Socket.IO server with Redis adapter
  startSocketIOServer();
}
```

#### Step 3: Sticky Sessions

Socket.IO's HTTP long-polling transport (used as fallback) requires that all requests from a client reach the same process. Even when using WebSocket-only transport, sticky sessions improve reconnection behavior.

**Nginx configuration:**
```nginx
upstream socketio_backend {
    ip_hash;  # sticky sessions based on client IP
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
    server 127.0.0.1:3004;
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
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

If you need cookie-based sticky sessions (more reliable than IP hash behind CDNs):

```nginx
upstream socketio_backend {
    hash $cookie_io consistent;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
    server 127.0.0.1:3004;
}
```

#### Step 4: Cross-Process Communication

With the Redis adapter, these operations work transparently across all processes:

```typescript
// Broadcasting to all connected clients (all processes)
io.emit('notification', { message: 'System update' });

// Room operations work across processes
socket.join('room:lobby');
io.to('room:lobby').emit('chat', { user: 'Alice', text: 'Hello' });

// Direct messaging to a specific socket (even on another process)
io.to(targetSocketId).emit('private_message', { from: 'Bob', text: 'Hi' });

// Server-side emit from external services (e.g., a REST API or worker)
import { createClient } from 'redis';
import { Emitter } from '@socket.io/redis-emitter';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();
const emitter = new Emitter(redisClient);

// Emit to all clients from any service -- no Socket.IO server needed
emitter.to('room:lobby').emit('announcement', { text: 'Server maintenance in 5 min' });
```

#### Step 5: Monitoring and Health Checks

```typescript
// Expose metrics for each process
import { instrument } from '@socket.io/admin-ui';

instrument(io, {
  auth: {
    type: 'basic',
    username: 'admin',
    password: process.env.ADMIN_PASSWORD!,
  },
  mode: 'production',
});

// Custom health check endpoint
import { createServer } from 'http';

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    const engineServer = io.engine;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      pid: process.pid,
      connections: engineServer.clientsCount,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }));
    return;
  }
});
```

#### Capacity Planning for 10K Connections

| Component | Recommendation |
|-----------|---------------|
| Node.js processes | 3-4 (one per CPU core, ~3K connections each) |
| Redis | Single instance is sufficient for 10K; enable AOF persistence |
| Memory per process | ~200-400MB depending on message sizes |
| Bandwidth | ~50 Mbps for 10K active connections at moderate message rate |
| Load balancer | Nginx with ip_hash or cookie-based sticky sessions |

#### Graceful Shutdown

```typescript
process.on('SIGTERM', async () => {
  console.log(`Worker ${process.pid}: shutting down gracefully`);

  // Stop accepting new connections
  io.close(() => {
    console.log('All connections closed');
    process.exit(0);
  });

  // Force exit after 10 seconds if connections don't close
  setTimeout(() => {
    console.log('Forcing exit after timeout');
    process.exit(1);
  }, 10_000);
});
```

---

## Task 5

### Rate Limiting WebSocket Messages

Unlike HTTP rate limiting, WebSocket rate limiting operates on a persistent connection. You cannot simply reject the connection -- you need to handle violations on an already-open socket while deciding whether the user is misbehaving or experiencing a burst.

#### Implementation: Token Bucket Algorithm

The token bucket algorithm is ideal for WebSocket rate limiting because it allows short bursts while enforcing an average rate. A user gets 10 tokens (messages) per second, with tokens refilling continuously.

```typescript
class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per millisecond

  constructor(maxTokens: number, refillRatePerSecond: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRatePerSecond / 1000;
    this.lastRefill = Date.now();
  }

  consume(count: number = 1): { allowed: boolean; retryAfterMs: number } {
    this.refill();

    if (this.tokens >= count) {
      this.tokens -= count;
      return { allowed: true, retryAfterMs: 0 };
    }

    // Calculate how long until enough tokens are available
    const deficit = count - this.tokens;
    const retryAfterMs = Math.ceil(deficit / this.refillRate);
    return { allowed: false, retryAfterMs };
  }

  private refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}
```

#### Full Server Integration

```typescript
import { WebSocketServer, WebSocket } from 'ws';

interface RateLimitConfig {
  messagesPerSecond: number;   // sustained rate
  burstSize: number;           // max burst before throttling
  warningsBeforeKick: number;  // warnings before disconnection
  violationWindowMs: number;   // window for counting violations
}

const DEFAULT_LIMITS: RateLimitConfig = {
  messagesPerSecond: 10,
  burstSize: 15,               // allow small bursts above the sustained rate
  warningsBeforeKick: 3,
  violationWindowMs: 60_000,   // 3 violations in 60s = disconnect
};

interface ClientState {
  bucket: TokenBucket;
  violations: number[];        // timestamps of violations
  warned: boolean;
}

const clientStates = new Map<WebSocket, ClientState>();

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  const state: ClientState = {
    bucket: new TokenBucket(DEFAULT_LIMITS.burstSize, DEFAULT_LIMITS.messagesPerSecond),
    violations: [],
    warned: false,
  };
  clientStates.set(ws, state);

  ws.on('message', (data: Buffer) => {
    const result = handleRateLimit(ws, state);
    if (!result.allowed) return; // message is dropped

    // Process the message normally
    try {
      const msg = JSON.parse(data.toString());
      handleMessage(ws, msg);
    } catch {
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    clientStates.delete(ws);
  });
});

function handleRateLimit(ws: WebSocket, state: ClientState): { allowed: boolean } {
  const { allowed, retryAfterMs } = state.bucket.consume(1);

  if (allowed) return { allowed: true };

  // Rate limit exceeded -- record violation
  const now = Date.now();
  state.violations.push(now);

  // Prune old violations outside the window
  state.violations = state.violations.filter(
    (ts) => now - ts < DEFAULT_LIMITS.violationWindowMs
  );

  // Check if client should be disconnected
  if (state.violations.length >= DEFAULT_LIMITS.warningsBeforeKick) {
    ws.send(JSON.stringify({
      type: 'error',
      code: 4029,
      message: 'Rate limit exceeded. Connection terminated.',
    }));
    ws.close(4029, 'Rate limit exceeded');
    return { allowed: false };
  }

  // Warn the client
  ws.send(JSON.stringify({
    type: 'rate_limit',
    message: `Rate limit exceeded. Max ${DEFAULT_LIMITS.messagesPerSecond} messages/second.`,
    retryAfterMs,
    violationsRemaining: DEFAULT_LIMITS.warningsBeforeKick - state.violations.length,
  }));

  return { allowed: false };
}

function handleMessage(ws: WebSocket, msg: any) {
  // Application logic here
}
```

#### Per-Message-Type Rate Limits

Different message types often need different limits. Chat messages can be slow, but cursor movements need to be fast.

```typescript
interface MessageTypeLimits {
  [messageType: string]: { perSecond: number; burst: number };
}

const MESSAGE_LIMITS: MessageTypeLimits = {
  'chat':           { perSecond: 2,  burst: 5 },
  'cursor_move':    { perSecond: 20, burst: 30 },
  'document_edit':  { perSecond: 10, burst: 15 },
  'file_upload':    { perSecond: 1,  burst: 1 },
  'default':        { perSecond: 5,  burst: 10 },
};

class PerTypeLimiter {
  private buckets = new Map<string, TokenBucket>();

  constructor(private limits: MessageTypeLimits) {}

  consume(messageType: string): { allowed: boolean; retryAfterMs: number } {
    const config = this.limits[messageType] || this.limits['default'];

    if (!this.buckets.has(messageType)) {
      this.buckets.set(messageType, new TokenBucket(config.burst, config.perSecond));
    }

    return this.buckets.get(messageType)!.consume(1);
  }
}
```

#### Client-Side Rate Limiting (Defense in Depth)

Rate limiting only on the server means malicious clients still consume server resources parsing and rejecting messages. Implement client-side limiting as well to protect well-behaved clients from accidental floods.

```typescript
class RateLimitedSocket {
  private ws: WebSocket;
  private queue: Array<{ data: string; resolve: () => void }> = [];
  private sending = false;
  private sendCount = 0;
  private windowStart = Date.now();
  private readonly maxPerSecond: number;

  constructor(url: string, maxPerSecond: number = 10) {
    this.ws = new WebSocket(url);
    this.maxPerSecond = maxPerSecond;

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'rate_limit') {
        console.warn(`Rate limited. Retry after ${msg.retryAfterMs}ms.`);
        // Pause sending for the specified duration
        this.sending = false;
        setTimeout(() => this.drainQueue(), msg.retryAfterMs);
        return;
      }
      this.onMessage(msg);
    };
  }

  send(data: object): Promise<void> {
    return new Promise((resolve) => {
      this.queue.push({ data: JSON.stringify(data), resolve });
      this.drainQueue();
    });
  }

  private drainQueue() {
    if (this.sending || this.queue.length === 0) return;
    this.sending = true;

    const now = Date.now();
    if (now - this.windowStart >= 1000) {
      this.sendCount = 0;
      this.windowStart = now;
    }

    while (this.queue.length > 0 && this.sendCount < this.maxPerSecond) {
      const item = this.queue.shift()!;
      this.ws.send(item.data);
      this.sendCount++;
      item.resolve();
    }

    this.sending = false;

    // Schedule remaining messages for next window
    if (this.queue.length > 0) {
      const msUntilNextWindow = 1000 - (Date.now() - this.windowStart);
      setTimeout(() => this.drainQueue(), Math.max(msUntilNextWindow, 10));
    }
  }

  private onMessage(data: any) {
    // Override or set callback
  }
}
```

#### Socket.IO Middleware Approach

If using Socket.IO, use middleware for cleaner integration:

```typescript
import { Server } from 'socket.io';

const io = new Server(httpServer);
const limiters = new Map<string, TokenBucket>();

// Rate limiting middleware -- runs before every event handler
io.use((socket, next) => {
  const originalEmit = socket.emit;

  // Intercept incoming events (not outgoing)
  socket.onAny((eventName: string, ...args: any[]) => {
    const socketId = socket.id;

    if (!limiters.has(socketId)) {
      limiters.set(socketId, new TokenBucket(15, 10));
    }

    const { allowed, retryAfterMs } = limiters.get(socketId)!.consume(1);

    if (!allowed) {
      socket.emit('rate_limit', {
        event: eventName,
        retryAfterMs,
        message: 'Slow down. You are sending messages too fast.',
      });
      return; // swallow the event
    }
  });

  socket.on('disconnect', () => {
    limiters.delete(socket.id);
  });

  next();
});
```

#### Violation Handling Strategy

| Violation Count (within 60s) | Action |
|-------------------------------|--------|
| 1st | Drop message, send warning with retry delay |
| 2nd | Drop message, send stronger warning |
| 3rd | Disconnect with close code 4029 |
| Reconnect after kick | Allow, but start with reduced limit (5/s) for 5 minutes |

```typescript
// Track kicked clients to apply reduced limits on reconnect
const kickedClients = new Map<string, number>(); // userId -> kickTime

function getLimitsForUser(userId: string): RateLimitConfig {
  const kickTime = kickedClients.get(userId);
  if (kickTime && Date.now() - kickTime < 5 * 60_000) {
    // Reduced limits for 5 minutes after being kicked
    return {
      messagesPerSecond: 5,
      burstSize: 5,
      warningsBeforeKick: 1,     // zero tolerance
      violationWindowMs: 60_000,
    };
  }
  return DEFAULT_LIMITS;
}
```

#### Best Practices Summary

1. **Use token bucket, not fixed window.** Fixed windows allow 2x burst at window boundaries; token buckets provide smooth rate enforcement.
2. **Rate limit on the server, not just the client.** Client-side limiting is a convenience, not security.
3. **Send machine-readable rate limit responses.** Include `retryAfterMs` so clients can implement proper backoff.
4. **Differentiate by message type.** Not all messages are equal -- cursor moves need higher throughput than chat messages.
5. **Escalate violations gradually.** Warn, then throttle, then disconnect. Do not disconnect on the first violation -- legitimate users experience bursts.
6. **Track by authenticated user, not socket.** A malicious user can reconnect to reset per-socket limits.
7. **Log rate limit events.** High violation rates from a single user or IP indicate abuse and should trigger alerts.
8. **Apply reduced limits after kicks.** Prevent rapid reconnect-flood cycles.
