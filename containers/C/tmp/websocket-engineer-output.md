# WebSocket Engineering Tasks

## Task 1: Real-Time Collaborative Text Editor Architecture (500 Concurrent Users Per Document)

### Transport Decision

- **Protocol:** WebSocket (native, not Socket.IO)
- **Rationale:** Full-duplex with minimal per-frame overhead. Collaborative editing requires ultra-low-latency bidirectional messaging. Socket.IO's abstraction layer adds unnecessary overhead when you control both client and server. At 500 users per document, every byte of overhead is multiplied.

### Key Challenges and Solutions

**Challenge 1: Conflict Resolution (The Core Problem)**

When 500 users type simultaneously, edits arrive out of order and conflict. Naive last-write-wins destroys user work.

**Solution: Use CRDTs (Conflict-free Replicated Data Types)**

CRDTs (specifically Yjs or Automerge) allow concurrent edits to merge deterministically without a central coordinator. Every operation commutes, so order does not matter.

```typescript
// Server: document-sync.ts
import * as Y from 'yjs';
import { WebSocket, WebSocketServer } from 'ws';

interface DocumentRoom {
  doc: Y.Doc;
  clients: Map<WebSocket, { userId: string; awareness: any }>;
  persistence: DocumentPersistence;
}

const rooms = new Map<string, DocumentRoom>();

function getOrCreateRoom(docId: string): DocumentRoom {
  if (!rooms.has(docId)) {
    const doc = new Y.Doc();
    const room: DocumentRoom = {
      doc,
      clients: new Map(),
      persistence: new DocumentPersistence(docId),
    };
    // Load persisted state
    room.persistence.load(doc);
    rooms.set(docId, room);
  }
  return rooms.get(docId)!;
}

function handleConnection(ws: WebSocket, docId: string, userId: string) {
  const room = getOrCreateRoom(docId);

  // Send current document state to new client
  const stateVector = Y.encodeStateAsUpdate(room.doc);
  ws.send(JSON.stringify({
    type: 'sync:state',
    data: Buffer.from(stateVector).toString('base64'),
  }));

  room.clients.set(ws, { userId, awareness: null });

  ws.on('message', (raw: Buffer) => {
    const msg = JSON.parse(raw.toString());

    switch (msg.type) {
      case 'sync:update': {
        // Apply update from client to server doc
        const update = Buffer.from(msg.data, 'base64');
        Y.applyUpdate(room.doc, new Uint8Array(update));

        // Broadcast to all OTHER clients in the room
        for (const [client] of room.clients) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'sync:update',
              data: msg.data,
            }));
          }
        }

        // Persist (debounced)
        room.persistence.scheduleSave(room.doc);
        break;
      }

      case 'awareness:update': {
        // Cursor position, selection, user name
        room.clients.get(ws)!.awareness = msg.data;
        for (const [client] of room.clients) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'awareness:update',
              userId,
              data: msg.data,
            }));
          }
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    room.clients.delete(ws);
    // Broadcast departure
    for (const [client] of room.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'awareness:disconnect',
          userId,
        }));
      }
    }
    // Clean up empty rooms after delay
    if (room.clients.size === 0) {
      setTimeout(() => {
        if (room.clients.size === 0) {
          room.persistence.saveNow(room.doc);
          rooms.delete(docId);
        }
      }, 30_000);
    }
  });
}
```

```typescript
// Client: collaborative-editor.ts
import * as Y from 'yjs';

class CollaborativeEditor {
  private doc: Y.Doc;
  private ws: WebSocket | null = null;
  private reconnectAttempt = 0;
  private pendingUpdates: Uint8Array[] = [];

  constructor(private docId: string, private token: string) {
    this.doc = new Y.Doc();

    // Listen for local changes
    this.doc.on('update', (update: Uint8Array, origin: any) => {
      if (origin === 'remote') return; // Don't echo remote updates

      const msg = JSON.stringify({
        type: 'sync:update',
        data: Buffer.from(update).toString('base64'),
      });

      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(msg);
      } else {
        this.pendingUpdates.push(update);
      }
    });
  }

  connect() {
    const url = `wss://api.example.com/docs/${this.docId}?token=${this.token}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempt = 0;
      // Drain pending updates
      for (const update of this.pendingUpdates) {
        this.ws!.send(JSON.stringify({
          type: 'sync:update',
          data: Buffer.from(update).toString('base64'),
        }));
      }
      this.pendingUpdates = [];
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case 'sync:state':
        case 'sync:update': {
          const update = new Uint8Array(
            Buffer.from(msg.data, 'base64')
          );
          Y.applyUpdate(this.doc, update, 'remote');
          break;
        }
        case 'awareness:update':
          this.renderRemoteCursor(msg.userId, msg.data);
          break;
        case 'awareness:disconnect':
          this.removeRemoteCursor(msg.userId);
          break;
      }
    };

    this.ws.onclose = () => this.reconnectWithBackoff();
    this.ws.onerror = () => {}; // onclose fires after onerror
  }

  private reconnectWithBackoff() {
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempt) + Math.random() * 1000,
      30_000
    );
    this.reconnectAttempt++;
    setTimeout(() => this.connect(), delay);
  }

  private renderRemoteCursor(userId: string, data: any) { /* UI logic */ }
  private removeRemoteCursor(userId: string) { /* UI logic */ }
}
```

**Challenge 2: Fan-out at 500 Clients Per Room**

Broadcasting to 500 clients per update creates O(N) sends. At high typing speed (5 updates/sec per user), that is 2,500 updates/sec, each fanned out to 499 clients = 1.25M sends/sec.

**Solution: Update batching and compression**

```typescript
// Server-side batching: collect updates over a short window, merge, broadcast once
class BatchedBroadcaster {
  private pendingUpdates: Map<string, Uint8Array[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private readonly BATCH_INTERVAL_MS = 50; // 50ms batching window

  queueUpdate(roomId: string, update: Uint8Array) {
    if (!this.pendingUpdates.has(roomId)) {
      this.pendingUpdates.set(roomId, []);
    }
    this.pendingUpdates.get(roomId)!.push(update);

    if (!this.timers.has(roomId)) {
      this.timers.set(roomId, setTimeout(() => {
        this.flush(roomId);
      }, this.BATCH_INTERVAL_MS));
    }
  }

  private flush(roomId: string) {
    const updates = this.pendingUpdates.get(roomId) || [];
    this.pendingUpdates.delete(roomId);
    this.timers.delete(roomId);

    if (updates.length === 0) return;

    // Merge all Yjs updates into one
    const merged = Y.mergeUpdates(updates);
    const payload = JSON.stringify({
      type: 'sync:update',
      data: Buffer.from(merged).toString('base64'),
    });

    const room = rooms.get(roomId);
    if (!room) return;

    for (const [client] of room.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }
}
```

**Challenge 3: Scaling Beyond a Single Server**

A single Node.js process can handle roughly 10K-50K WebSocket connections depending on message rate. For documents with 500 users, you need document-level routing.

**Solution: Redis pub/sub for cross-server broadcast, sticky sessions by document ID**

```typescript
// redis-adapter.ts
import Redis from 'ioredis';

const pub = new Redis(process.env.REDIS_URL!);
const sub = new Redis(process.env.REDIS_URL!);

// Subscribe to document channels for rooms hosted on this server
function subscribeToDocument(docId: string) {
  sub.subscribe(`doc:${docId}`);
}

sub.on('message', (channel: string, message: string) => {
  const docId = channel.replace('doc:', '');
  const room = rooms.get(docId);
  if (!room) return;

  // Broadcast to local clients only
  for (const [client] of room.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
});

// When a local client sends an update, publish to Redis for other servers
function publishUpdate(docId: string, payload: string) {
  pub.publish(`doc:${docId}`, payload);
}
```

**Challenge 4: Persistence and Recovery**

```typescript
// Debounced persistence to avoid write storms
class DocumentPersistence {
  private saveTimer: NodeJS.Timeout | null = null;

  constructor(private docId: string) {}

  async load(doc: Y.Doc) {
    const stored = await db.get(`doc:${this.docId}`);
    if (stored) {
      Y.applyUpdate(doc, new Uint8Array(stored));
    }
  }

  scheduleSave(doc: Y.Doc) {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveNow(doc), 2000);
  }

  async saveNow(doc: Y.Doc) {
    const state = Y.encodeStateAsUpdate(doc);
    await db.set(`doc:${this.docId}`, Buffer.from(state));
  }
}
```

### Architecture Summary

```
Clients (browser, Yjs)
    |
    | WSS (TLS)
    v
Load Balancer (nginx, sticky by docId cookie)
    |
    v
+------------------+    +------------------+
| WS Server 1      |    | WS Server 2      |
| - Yjs Docs A,B   |    | - Yjs Docs C,D   |
| - Batched Bcast   |    | - Batched Bcast   |
+--------+---------+    +--------+---------+
         |                        |
         +--- Redis Pub/Sub ------+
         |
    +----+----+
    | Postgres |  (debounced persistence)
    +---------+
```

### Best Practices

1. Use binary encoding (Yjs updates are already binary) -- base64 wrapping adds 33% overhead; consider binary WebSocket frames for production.
2. Implement awareness protocol separately from document sync -- cursor positions change far more often than document content.
3. Set a maximum document size and reject updates that would exceed it.
4. Implement read-only mode for viewers to reduce server-side processing.
5. Version the wire protocol from day one so you can upgrade without breaking clients.

---

## Task 2: Fixing WebSocket Connections Dropping After 60 Seconds of Inactivity

### Root Cause

The 60-second timeout is almost always caused by an intermediary (reverse proxy, load balancer, or cloud provider) closing idle TCP connections. The browser WebSocket API does not implement automatic ping/pong -- that is a server-side responsibility per RFC 6455.

Common culprits:
- **nginx** default `proxy_read_timeout` is 60s
- **AWS ALB** default idle timeout is 60s
- **Cloudflare** default WebSocket timeout is 100s
- **HAProxy** default timeout is 50s

### Solution 1: Server-Side Ping/Pong (Primary Fix)

The WebSocket protocol defines control frames (ping/pong) at the protocol level. The server sends ping frames; the browser automatically responds with pong frames without any client-side JavaScript.

```typescript
// server.ts
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds -- must be less than proxy timeout
const CLIENT_TIMEOUT = 35_000;     // 35 seconds -- slightly more than interval

wss.on('connection', (ws: WebSocket) => {
  let isAlive = true;

  ws.on('pong', () => {
    isAlive = true;
  });

  const heartbeat = setInterval(() => {
    if (!isAlive) {
      // Client did not respond to last ping -- terminate
      clearInterval(heartbeat);
      ws.terminate(); // hard close, no close handshake
      return;
    }

    isAlive = false;
    ws.ping(); // browser responds with pong automatically
  }, HEARTBEAT_INTERVAL);

  ws.on('close', () => {
    clearInterval(heartbeat); // CRITICAL: prevent interval leak
  });

  ws.on('error', () => {
    clearInterval(heartbeat);
  });
});
```

### Solution 2: Application-Level Ping (Belt and Suspenders)

Some proxies strip WebSocket control frames. Add application-level ping as a fallback.

```typescript
// client.ts -- browser-side
class ResilientWebSocket {
  private ws: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private pongTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;

  constructor(private url: string) {}

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'pong') {
        // Server responded to our ping
        if (this.pongTimeout) {
          clearTimeout(this.pongTimeout);
          this.pongTimeout = null;
        }
        return;
      }
      // Handle other messages...
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.reconnect();
    };

    this.ws.onerror = () => {
      // onclose will fire after this
    };
  }

  private startHeartbeat() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', ts: Date.now() }));

        // If no pong within 5 seconds, connection is dead
        this.pongTimeout = setTimeout(() => {
          this.ws?.close();
        }, 5_000);
      }
    }, 25_000); // 25s interval
  }

  private stopHeartbeat() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.pongTimeout) clearTimeout(this.pongTimeout);
    this.pingInterval = null;
    this.pongTimeout = null;
  }

  private reconnect() {
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempt) + Math.random() * 1000,
      30_000
    );
    this.reconnectAttempt++;
    setTimeout(() => this.connect(), delay);
  }

  send(data: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }
}
```

```typescript
// server-side handler for application-level ping
ws.on('message', (raw: Buffer) => {
  const msg = JSON.parse(raw.toString());
  if (msg.type === 'ping') {
    ws.send(JSON.stringify({ type: 'pong', ts: msg.ts }));
    return;
  }
  // Handle other messages...
});
```

### Solution 3: Configure the Proxy/Load Balancer

Fix the actual timeout at the infrastructure level.

```nginx
# nginx.conf
location /ws {
    proxy_pass http://backend;
    proxy_http_version 1.1;

    # Required for WebSocket upgrade
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;

    # Increase timeouts -- these are IDLE timeouts (no data in either direction)
    proxy_read_timeout 3600s;  # 1 hour
    proxy_send_timeout 3600s;
    proxy_connect_timeout 10s; # keep connect timeout short
}
```

```bash
# AWS ALB -- set idle timeout to 3600 seconds via CLI
aws elbv2 modify-load-balancer-attributes \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --attributes Key=idle_timeout.timeout_seconds,Value=3600
```

### Best Practices

1. **Always implement server-side ping/pong regardless of proxy config.** The proxy timeout is a secondary defense; the ping/pong is the primary mechanism for detecting dead connections.
2. **Ping interval must be less than the smallest timeout in the chain.** If your proxy times out at 60s, ping at 30s.
3. **Always clean up intervals on close.** Leaked intervals are one of the most common WebSocket memory leaks.
4. **Log disconnection reasons.** Track close codes (1000=normal, 1001=going away, 1006=abnormal) to distinguish intentional disconnects from timeouts.
5. **Client reconnection is mandatory.** Even with perfect heartbeats, networks fail. Always implement exponential backoff with jitter.

---

## Task 3: Authenticating WebSocket Connections with JWT

### Core Principle

Authenticate during the HTTP upgrade handshake, NEVER after the WebSocket connection is open. Once a WebSocket connection is established, you have already allocated server resources (memory, file descriptors). Authenticating after connection creates a window where unauthenticated clients consume resources.

### Option A: Token in Query Parameter (Recommended for Browser WebSocket API)

The browser WebSocket API does not support custom headers. The most practical approach is passing the JWT as a query parameter during the handshake.

```typescript
// server.ts -- authentication during upgrade
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

const server = createServer();
const wss = new WebSocketServer({ noServer: true }); // noServer mode for manual upgrade

server.on('upgrade', (request, socket, head) => {
  // Extract token from query string
  const url = new URL(request.url!, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
      issuer: 'your-api',
    }) as { sub: string; roles: string[] };

    // Attach user info to the request for use in connection handler
    (request as any).user = payload;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
});

wss.on('connection', (ws: WebSocket, request: any) => {
  const user = request.user;
  console.log(`Authenticated connection: ${user.sub}`);

  // User is now authenticated -- handle messages
  ws.on('message', (data) => {
    // user.sub and user.roles are available here
    // Authorize per-message actions (e.g., room access)
  });
});

server.listen(8080);
```

```typescript
// client.ts -- pass token in URL
const token = localStorage.getItem('jwt_token');
const ws = new WebSocket(`wss://api.example.com/ws?token=${encodeURIComponent(token)}`);
```

**Security consideration:** Query parameters appear in server access logs and potentially in proxy logs. Mitigations:
- Use short-lived tokens (5 minutes) specifically for WebSocket connections
- Strip query parameters from access logs
- Always use WSS (TLS) so the URL is encrypted in transit

### Option B: Ticket-Based Authentication (Most Secure)

Exchange the JWT for a single-use, short-lived ticket via REST, then use the ticket for WebSocket connection.

```typescript
// REST endpoint: POST /api/ws-ticket
app.post('/api/ws-ticket', authenticateJWT, async (req, res) => {
  const ticket = crypto.randomUUID();

  // Store ticket in Redis with 30-second TTL
  await redis.set(`ws-ticket:${ticket}`, JSON.stringify({
    userId: req.user.sub,
    roles: req.user.roles,
  }), 'EX', 30);

  res.json({ ticket });
});

// WebSocket server: validate ticket during upgrade
server.on('upgrade', async (request, socket, head) => {
  const url = new URL(request.url!, `http://${request.headers.host}`);
  const ticket = url.searchParams.get('ticket');

  if (!ticket) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // Atomic get-and-delete: ticket can only be used once
  const userData = await redis.getdel(`ws-ticket:${ticket}`);

  if (!userData) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  (request as any).user = JSON.parse(userData);

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
```

```typescript
// Client: two-step connection
async function connectWebSocket() {
  // Step 1: Get a ticket using your existing JWT
  const response = await fetch('/api/ws-ticket', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getJwtToken()}`,
    },
  });
  const { ticket } = await response.json();

  // Step 2: Connect with the single-use ticket
  const ws = new WebSocket(`wss://api.example.com/ws?ticket=${ticket}`);
  return ws;
}
```

### Option C: Cookie-Based (When Same Origin)

If the WebSocket server shares the same domain as your REST API and you use HTTP-only cookies:

```typescript
// The browser automatically sends cookies on WebSocket handshake
const ws = new WebSocket('wss://api.example.com/ws');
// Cookies are sent automatically -- no code needed

// Server: extract JWT from cookie during upgrade
server.on('upgrade', (request, socket, head) => {
  const cookies = parseCookies(request.headers.cookie || '');
  const token = cookies['auth_token'];

  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // Verify JWT from cookie same as Option A...
});
```

### Token Refresh During Long-Lived Connections

JWTs expire. For long-lived WebSocket connections, handle token refresh over the open connection:

```typescript
// Server: periodic token validation
wss.on('connection', (ws: WebSocket, request: any) => {
  const user = request.user;
  let tokenExp = user.exp * 1000; // JWT exp is in seconds

  const tokenCheck = setInterval(() => {
    if (Date.now() > tokenExp) {
      ws.send(JSON.stringify({ type: 'auth:token_required' }));

      // Give client 10 seconds to send a new token
      const grace = setTimeout(() => {
        ws.close(4001, 'Token expired');
      }, 10_000);

      // One-time listener for token refresh
      const refreshHandler = (raw: Buffer) => {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'auth:refresh') {
          try {
            const newPayload = jwt.verify(msg.token, process.env.JWT_SECRET!);
            tokenExp = (newPayload as any).exp * 1000;
            clearTimeout(grace);
            ws.send(JSON.stringify({ type: 'auth:refreshed' }));
          } catch {
            ws.close(4001, 'Invalid token');
          }
          ws.removeListener('message', refreshHandler);
        }
      };
      ws.on('message', refreshHandler);
    }
  }, 60_000); // Check every minute

  ws.on('close', () => clearInterval(tokenCheck));
});
```

### Authorization: Per-Message and Per-Room

Authentication is not authorization. After the connection is authenticated, validate permissions for every action:

```typescript
ws.on('message', (raw: Buffer) => {
  const msg = JSON.parse(raw.toString());

  switch (msg.type) {
    case 'room:join': {
      // Check if user is allowed in this room
      if (!canAccessRoom(user.sub, user.roles, msg.roomId)) {
        ws.send(JSON.stringify({
          type: 'error',
          code: 'FORBIDDEN',
          message: 'Not authorized to join this room',
        }));
        return;
      }
      joinRoom(ws, msg.roomId);
      break;
    }
    // ...
  }
});
```

### Best Practices

1. **Never trust client-sent user IDs.** Always derive identity from the verified token.
2. **Use `noServer` mode** in the `ws` library to handle upgrade manually -- this gives you full control over authentication.
3. **Return 401 on the HTTP upgrade**, not after the WebSocket is open. This prevents resource exhaustion attacks.
4. **Ticket-based auth (Option B) is the most secure** for browser clients. No token in URL logs, single-use, short-lived.
5. **Implement token refresh** for connections expected to live longer than the JWT TTL.
6. **Rate-limit the upgrade endpoint** separately from your REST endpoints to prevent connection-flood attacks.

---

## Task 4: Scaling Socket.IO Beyond a Single Node.js Process

### Problem

The in-memory adapter stores room memberships and socket-to-room mappings in the process memory. When you run multiple processes, a message emitted on process A never reaches clients connected to process B.

### Architecture

```
                     Clients (10K concurrent)
                           |
                           v
                   Load Balancer (nginx)
                   (sticky sessions ON)
                    /       |       \
                   v        v        v
            Node.js 1  Node.js 2  Node.js 3
            (Socket.IO) (Socket.IO) (Socket.IO)
               \          |          /
                +--- Redis Pub/Sub --+
                    (adapter bridge)
```

### Step 1: Switch to the Redis Adapter

```bash
npm install @socket.io/redis-adapter redis
```

```typescript
// server.ts
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { createServer } from 'http';
import cluster from 'node:cluster';
import os from 'node:os';

const NUM_WORKERS = parseInt(process.env.WS_WORKERS || '0', 10)
  || Math.min(os.cpus().length, 4); // 4 workers typically enough for 10K connections

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} starting ${NUM_WORKERS} workers`);

  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.process.pid} exited (code ${code}), restarting`);
    cluster.fork();
  });
} else {
  startWorker();
}

async function startWorker() {
  const httpServer = createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'https://app.example.com',
      credentials: true,
    },
    // Performance tuning for 10K connections
    pingInterval: 25_000,
    pingTimeout: 20_000,
    maxHttpBufferSize: 1e6,        // 1MB max message size
    connectTimeout: 10_000,
    transports: ['websocket', 'polling'], // prefer WS, fallback to polling
  });

  // Redis adapter setup
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]);

  io.adapter(createAdapter(pubClient, subClient));

  // Connection handling
  io.on('connection', (socket) => {
    console.log(`Client ${socket.id} connected to worker ${process.pid}`);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
    });

    socket.on('message', (data: { roomId: string; content: string }) => {
      // This broadcasts across ALL server instances via Redis
      io.to(data.roomId).emit('message', {
        from: socket.id,
        content: data.content,
        timestamp: Date.now(),
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
    });
  });

  httpServer.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on 3000`);
  });
}
```

### Step 2: Configure Sticky Sessions in nginx

Socket.IO requires sticky sessions because the initial HTTP handshake and subsequent polling requests (or WebSocket upgrade) must reach the same process.

```nginx
# nginx.conf
upstream socketio_backend {
    # Use ip_hash for sticky sessions
    ip_hash;

    server 127.0.0.1:3000;
    # If running on multiple machines:
    # server ws-server-1:3000;
    # server ws-server-2:3000;
}

server {
    listen 443 ssl;
    server_name ws.example.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    location /socket.io/ {
        proxy_pass http://socketio_backend;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeout configuration
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;

        # Buffering off for real-time
        proxy_buffering off;
    }
}
```

### Step 3: OS-Level Tuning for 10K Connections

```bash
# /etc/sysctl.conf additions
# Increase max open file descriptors
fs.file-max = 100000

# Increase TCP connection tracking
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535

# Faster recycling of TIME_WAIT sockets
net.ipv4.tcp_tw_reuse = 1

# Increase port range for outbound connections
net.ipv4.ip_local_port_range = 1024 65535
```

```bash
# /etc/security/limits.conf
*  soft  nofile  65536
*  hard  nofile  65536
```

```bash
# systemd service file snippet
[Service]
LimitNOFILE=65536
```

### Step 4: Monitoring

```typescript
// monitoring.ts -- expose metrics endpoint
import { instrument } from '@socket.io/admin-ui';

// In your startWorker function, after creating io:
instrument(io, {
  auth: {
    type: 'basic',
    username: process.env.ADMIN_USER!,
    password: process.env.ADMIN_PASS!,
  },
  mode: 'production',
});

// Custom metrics with Prometheus
import { register, Gauge, Counter } from 'prom-client';

const connectedClients = new Gauge({
  name: 'socketio_connected_clients',
  help: 'Number of connected Socket.IO clients',
  labelNames: ['worker'],
});

const messagesTotal = new Counter({
  name: 'socketio_messages_total',
  help: 'Total messages processed',
  labelNames: ['event', 'worker'],
});

// Update metrics
io.on('connection', (socket) => {
  connectedClients.inc({ worker: String(process.pid) });

  socket.on('disconnect', () => {
    connectedClients.dec({ worker: String(process.pid) });
  });

  socket.onAny((event) => {
    messagesTotal.inc({ event, worker: String(process.pid) });
  });
});
```

### Step 5: Redis Adapter with Sharded Pub/Sub (High Scale)

For Redis 7+ and very high message rates, use the sharded adapter for better throughput:

```typescript
import { createShardedAdapter } from '@socket.io/redis-adapter';

// Sharded pub/sub distributes channels across Redis cluster nodes
io.adapter(createShardedAdapter(pubClient, subClient));
```

### Alternative: Redis Streams Adapter

For guaranteed message delivery (messages are not lost if a server restarts):

```bash
npm install @socket.io/redis-streams-adapter
```

```typescript
import { createAdapter } from '@socket.io/redis-streams-adapter';

// Messages persist in Redis Streams -- new workers can catch up
io.adapter(createAdapter(redisClient));
```

### Capacity Planning

| Component | For 10K connections |
|-----------|-------------------|
| Node.js workers | 3-4 (each handles ~3K connections comfortably) |
| Redis | Single instance sufficient; enable maxmemory-policy allkeys-lru |
| Memory per worker | ~500MB-1GB depending on message buffering |
| File descriptors | Set to 65536 minimum |
| nginx worker_connections | 16384 (set in events block) |

### Best Practices

1. **Start with `cluster` module before going multi-machine.** A single server with 4 workers handles 10K connections easily.
2. **Always test WebSocket transport first.** Socket.IO defaults to polling then upgrades. Force WebSocket in client: `{ transports: ['websocket'] }` if you know your network supports it.
3. **Set `maxHttpBufferSize`** to prevent memory exhaustion from large messages.
4. **Monitor Redis pub/sub lag.** If Redis becomes a bottleneck, consider the sharded adapter or NATS as an alternative.
5. **Implement graceful shutdown** so deploys don't drop all connections at once:

```typescript
process.on('SIGTERM', () => {
  // Stop accepting new connections
  httpServer.close();

  // Give existing connections 30 seconds to finish
  io.close(() => {
    process.exit(0);
  });

  // Force exit after 30s
  setTimeout(() => process.exit(1), 30_000);
});
```

---

## Task 5: Rate Limiting WebSocket Messages

### Architecture

Rate limiting WebSocket messages is different from HTTP rate limiting. You cannot use middleware that runs once per request -- messages arrive continuously on an open connection. The limiter must run per-message, be fast (sub-millisecond), and handle violations without closing the connection (unless abuse is severe).

### Implementation: Token Bucket Algorithm

The token bucket is ideal for WebSocket rate limiting because it allows short bursts while enforcing an average rate.

```typescript
// rate-limiter.ts
class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private maxTokens: number,     // bucket capacity (burst limit)
    private refillRate: number,    // tokens per second
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  consume(count: number = 1): boolean {
    this.refill();

    if (this.tokens >= count) {
      this.tokens -= count;
      return true;  // allowed
    }

    return false;   // rate limited
  }

  private refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // seconds
    this.tokens = Math.min(
      this.maxTokens,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }

  /** Returns milliseconds until a token is available */
  getRetryAfter(): number {
    if (this.tokens >= 1) return 0;
    return Math.ceil((1 - this.tokens) / this.refillRate * 1000);
  }
}
```

### Integration with WebSocket Server

```typescript
// server.ts
import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// Track rate limiters and violation counts per connection
interface ClientState {
  userId: string;
  limiter: TokenBucket;
  violations: number;
  lastViolation: number;
}

const clientStates = new Map<WebSocket, ClientState>();

// Configuration
const RATE_LIMIT = 10;         // messages per second
const BURST_LIMIT = 15;        // allow short burst up to 15
const WARN_THRESHOLD = 3;      // warn after 3 violations
const DISCONNECT_THRESHOLD = 10; // disconnect after 10 violations
const VIOLATION_DECAY_MS = 60_000; // violations reset after 60s of good behavior

wss.on('connection', (ws: WebSocket, request: any) => {
  const state: ClientState = {
    userId: request.user.sub,
    limiter: new TokenBucket(BURST_LIMIT, RATE_LIMIT),
    violations: 0,
    lastViolation: 0,
  };
  clientStates.set(ws, state);

  ws.on('message', (raw: Buffer) => {
    const now = Date.now();

    // Decay violations after period of good behavior
    if (state.violations > 0
        && now - state.lastViolation > VIOLATION_DECAY_MS) {
      state.violations = 0;
    }

    // Check rate limit
    if (!state.limiter.consume(1)) {
      state.violations++;
      state.lastViolation = now;

      if (state.violations >= DISCONNECT_THRESHOLD) {
        // Severe abuse: disconnect
        ws.send(JSON.stringify({
          type: 'error',
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many messages. Connection terminated.',
        }));
        ws.close(4008, 'Rate limit exceeded');
        return;
      }

      if (state.violations >= WARN_THRESHOLD) {
        // Repeated violations: warn with backoff hint
        ws.send(JSON.stringify({
          type: 'error',
          code: 'RATE_LIMITED',
          message: `Slow down. ${DISCONNECT_THRESHOLD - state.violations} violations remaining before disconnect.`,
          retryAfterMs: state.limiter.getRetryAfter(),
        }));
        return;
      }

      // First few violations: silent drop with notification
      ws.send(JSON.stringify({
        type: 'error',
        code: 'RATE_LIMITED',
        message: 'Message dropped. Max 10 messages per second.',
        retryAfterMs: state.limiter.getRetryAfter(),
      }));
      return;
    }

    // Within rate limit -- process the message
    handleMessage(ws, state, raw);
  });

  ws.on('close', () => {
    clientStates.delete(ws);
  });
});

function handleMessage(ws: WebSocket, state: ClientState, raw: Buffer) {
  try {
    const msg = JSON.parse(raw.toString());
    // ... business logic ...
  } catch (err) {
    ws.send(JSON.stringify({
      type: 'error',
      code: 'INVALID_MESSAGE',
      message: 'Could not parse message',
    }));
  }
}
```

### Client-Side Rate Limiting (Proactive)

Prevent the client from hitting the server limit in the first place:

```typescript
// client-rate-limiter.ts
class RateLimitedSocket {
  private ws: WebSocket;
  private queue: string[] = [];
  private sending = false;
  private messageTimestamps: number[] = [];
  private readonly maxPerSecond: number;

  constructor(url: string, maxPerSecond: number = 10) {
    this.maxPerSecond = maxPerSecond;
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.code === 'RATE_LIMITED') {
        // Server told us to slow down -- pause sending
        console.warn(`Rate limited. Retry after ${msg.retryAfterMs}ms`);
        setTimeout(() => this.drainQueue(), msg.retryAfterMs);
        return;
      }
      this.onMessage(msg);
    };
  }

  send(data: object) {
    const now = Date.now();

    // Remove timestamps older than 1 second
    this.messageTimestamps = this.messageTimestamps.filter(
      ts => now - ts < 1000
    );

    if (this.messageTimestamps.length < this.maxPerSecond) {
      // Under limit: send immediately
      this.messageTimestamps.push(now);
      this.ws.send(JSON.stringify(data));
    } else {
      // Over limit: queue it
      this.queue.push(JSON.stringify(data));
      if (!this.sending) {
        this.sending = true;
        this.drainQueue();
      }
    }
  }

  private drainQueue() {
    if (this.queue.length === 0) {
      this.sending = false;
      return;
    }

    const now = Date.now();
    this.messageTimestamps = this.messageTimestamps.filter(
      ts => now - ts < 1000
    );

    if (this.messageTimestamps.length < this.maxPerSecond) {
      const msg = this.queue.shift()!;
      this.messageTimestamps.push(now);
      this.ws.send(msg);
    }

    // Schedule next drain at the rate limit interval
    setTimeout(() => this.drainQueue(), Math.ceil(1000 / this.maxPerSecond));
  }

  onMessage(msg: any) {
    // Override in application code
  }
}
```

### Socket.IO Implementation

If using Socket.IO, apply rate limiting as middleware:

```typescript
// socket.io rate limiting
import { Server, Socket } from 'socket.io';

const io = new Server(httpServer);

// Per-event rate limits
const EVENT_LIMITS: Record<string, { rate: number; burst: number }> = {
  'chat:message':     { rate: 10, burst: 15 },
  'typing:start':     { rate: 2,  burst: 3 },
  'cursor:move':      { rate: 30, burst: 50 },  // higher limit for cursor
  'default':          { rate: 5,  burst: 10 },
};

io.use((socket: Socket, next) => {
  const limiters = new Map<string, TokenBucket>();
  let violations = 0;

  // Wrap the emit handler
  const originalOnEvent = (socket as any)._onevent;
  (socket as any)._onevent = function (packet: any) {
    const event = packet.data?.[0];
    if (!event || event.startsWith('_')) {
      return originalOnEvent.call(this, packet);
    }

    // Get or create limiter for this event type
    const config = EVENT_LIMITS[event] || EVENT_LIMITS['default'];
    if (!limiters.has(event)) {
      limiters.set(event, new TokenBucket(config.burst, config.rate));
    }

    const limiter = limiters.get(event)!;
    if (!limiter.consume(1)) {
      violations++;
      socket.emit('error', {
        code: 'RATE_LIMITED',
        event,
        retryAfterMs: limiter.getRetryAfter(),
      });

      if (violations > 20) {
        socket.disconnect(true);
      }
      return; // Drop the message
    }

    return originalOnEvent.call(this, packet);
  };

  next();
});
```

### Distributed Rate Limiting (Multi-Server)

When running multiple server instances, the in-memory token bucket only limits per-process. For global limits, use Redis:

```typescript
// distributed-rate-limiter.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

async function checkRateLimit(
  userId: string,
  maxPerSecond: number,
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  const key = `ratelimit:ws:${userId}`;
  const now = Date.now();
  const windowStart = now - 1000;

  // Use Redis sorted set as a sliding window
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart); // Remove old entries
  pipeline.zadd(key, now, `${now}-${Math.random()}`); // Add current
  pipeline.zcard(key); // Count in window
  pipeline.expire(key, 2); // TTL for cleanup

  const results = await pipeline.exec();
  const count = results![2][1] as number;

  if (count > maxPerSecond) {
    return {
      allowed: false,
      retryAfterMs: Math.ceil(1000 / maxPerSecond),
    };
  }

  return { allowed: true, retryAfterMs: 0 };
}

// Usage in message handler
ws.on('message', async (raw: Buffer) => {
  const { allowed, retryAfterMs } = await checkRateLimit(state.userId, 10);
  if (!allowed) {
    ws.send(JSON.stringify({
      type: 'error',
      code: 'RATE_LIMITED',
      retryAfterMs,
    }));
    return;
  }
  // Process message...
});
```

Note: The Redis approach adds ~0.5-1ms of latency per message. For most applications, the in-memory token bucket per connection is sufficient. Only use distributed rate limiting when you need global per-user limits across multiple servers.

### Violation Handling Strategy

| Violation Count | Action | Rationale |
|----------------|--------|-----------|
| 1-3 | Drop message, send `RATE_LIMITED` error with retry hint | User might be typing fast, not malicious |
| 4-9 | Drop message, send warning with remaining violations count | Escalating notice |
| 10+ | Close connection with code 4008 | Likely abusive client or broken implementation |
| Repeated disconnects for rate limiting | Block IP at load balancer for 5 minutes | Prevents reconnect-and-spam loop |

### Best Practices

1. **Always rate limit on the server.** Client-side limiting is a courtesy, not a security measure.
2. **Use different limits for different events.** Cursor movements need higher limits than chat messages.
3. **Send `retryAfterMs` in rate limit responses.** Well-behaved clients can use this to back off gracefully.
4. **Decay violations over time.** Users who slow down should not be permanently penalized.
5. **Log rate limit events.** Track which users hit limits and how often -- this informs your limit settings and identifies abuse.
6. **Limit message size too.** Rate limiting message count is not enough if a single message can be 100MB. Set `maxPayload` (ws library) or `maxHttpBufferSize` (Socket.IO).
7. **Consider the token bucket over sliding window for in-memory use.** Token bucket is O(1) with no memory growth; sliding window stores every timestamp.
