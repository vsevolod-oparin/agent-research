## Task 1

### User Authentication: React + Express with JWT

**Implementation Plan:**

1. Backend: Express middleware for auth, bcrypt for passwords, JWT for tokens
2. Frontend: React context for auth state, Axios interceptors for token attachment
3. Protected routes on both sides (middleware + React Router)

**Backend - Key Code:**

```js
// backend/src/auth/auth.middleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

function generateTokens(userId) {
  const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  const refreshToken = jwt.sign({ sub: userId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_EXPIRY });
  return { accessToken, refreshToken };
}

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });

  try {
    const payload = jwt.verify(header.split(' ')[1], JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { generateTokens, authenticate };
```

```js
// backend/src/auth/auth.routes.js
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { generateTokens, authenticate } = require('./auth.middleware');
const db = require('../db');

const SALT_ROUNDS = 12;

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Email and password (8+ chars) required' });
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email.toLowerCase(), hash]
    );
    const tokens = generateTokens(rows[0].id);
    res.status(201).json({ user: rows[0], ...tokens });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    throw err;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await db.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email.toLowerCase()]);
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const tokens = generateTokens(rows[0].id);
  res.json({ user: { id: rows[0].id, email: rows[0].email }, ...tokens });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (payload.type !== 'refresh') throw new Error();
    const tokens = generateTokens(payload.sub);
    res.json(tokens);
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

**Frontend - Key Code:**

```jsx
// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then(r => setUser(r.data)).catch(() => logout()).finally(() => setLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// frontend/src/lib/api.js -- Axios with interceptor for auto-refresh
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken: refresh });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
```

```jsx
// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
```

**Security checklist:** store JWT_SECRET in env only, use HTTPS in production, set short access token expiry (15m) with refresh tokens (7d), hash passwords with bcrypt at cost 12+, validate all inputs server-side, add rate limiting to login/register endpoints.

---

## Task 2

### Fixing the N+1 Query Problem

**The Problem:**

```js
// BAD - 50+ queries
app.get('/api/posts', async (req, res) => {
  const posts = await db.query('SELECT * FROM posts LIMIT 20');          // 1 query
  for (const post of posts.rows) {
    post.author = (await db.query('SELECT * FROM users WHERE id = $1', [post.author_id])).rows[0]; // +20
    post.comments = (await db.query('SELECT * FROM comments WHERE post_id = $1', [post.id])).rows; // +20
  }
});
```

### Approach 1: JOIN query (simplest)

```js
app.get('/api/posts', async (req, res) => {
  const { rows } = await db.query(`
    SELECT
      p.id, p.title, p.body, p.created_at,
      json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar_url) AS author,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'body', c.body, 'author_name', cu.name)
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
      ) AS comments
    FROM posts p
    JOIN users u ON u.id = p.author_id
    LEFT JOIN comments c ON c.post_id = p.id
    LEFT JOIN users cu ON cu.id = c.author_id
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT 20
  `);
  res.json(rows);
});
// Total: 1 query
```

### Approach 2: Batch loading with DataLoader pattern

```js
const DataLoader = require('dataloader');

function createLoaders() {
  return {
    userById: new DataLoader(async (ids) => {
      const { rows } = await db.query('SELECT * FROM users WHERE id = ANY($1)', [ids]);
      const map = Object.fromEntries(rows.map(r => [r.id, r]));
      return ids.map(id => map[id] || null);
    }),
    commentsByPostId: new DataLoader(async (postIds) => {
      const { rows } = await db.query(
        'SELECT * FROM comments WHERE post_id = ANY($1) ORDER BY created_at',
        [postIds]
      );
      const grouped = {};
      for (const row of rows) {
        (grouped[row.post_id] ||= []).push(row);
      }
      return postIds.map(id => grouped[id] || []);
    }),
  };
}
// Total: 3 queries (posts + batch users + batch comments)
```

### Required indexes

```sql
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

**Recommendation:** Use Approach 1 (JOIN) for this endpoint since the data shape is predictable. Use Approach 2 (DataLoader) if you move to GraphQL or have variable data needs.

---

## Task 3

### E-Commerce Cart: Schema + API

### Database Schema (PostgreSQL)

```sql
CREATE TABLE products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url   TEXT,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id             BIGSERIAL PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  name           TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  BIGINT NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  added_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE orders (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id),
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  BIGINT NOT NULL REFERENCES products(id),
  name        TEXT NOT NULL,          -- snapshot at purchase time
  price_cents INTEGER NOT NULL,       -- snapshot at purchase time
  quantity    INTEGER NOT NULL CHECK (quantity > 0)
);
```

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List active products (paginated) |
| GET | /api/products/:id | Single product detail |
| GET | /api/cart | Get current user's cart |
| POST | /api/cart/items | Add item to cart |
| PATCH | /api/cart/items/:id | Update quantity |
| DELETE | /api/cart/items/:id | Remove item |
| POST | /api/cart/checkout | Convert cart to order |
| GET | /api/orders | List user's orders |
| GET | /api/orders/:id | Order detail |

### Checkout (critical path -- must be atomic)

```js
router.post('/cart/checkout', authenticate, async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: items } = await client.query(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price_cents, p.stock
      FROM cart_items ci JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = $1
      FOR UPDATE OF p
    `, [req.userId]);

    if (!items.length) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Cart is empty' }); }

    for (const item of items) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: `Insufficient stock for "${item.name}"` });
      }
    }

    const total_cents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
    const { rows: [order] } = await client.query(
      'INSERT INTO orders (user_id, total_cents) VALUES ($1, $2) RETURNING *',
      [req.userId, total_cents]
    );

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, name, price_cents, quantity) VALUES ($1,$2,$3,$4,$5)',
        [order.id, item.product_id, item.name, item.price_cents, item.quantity]
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});
```

The checkout uses a database transaction with `FOR UPDATE` row locking to prevent two concurrent checkouts from overselling stock.

---

## Task 4

### Real-Time Notifications with Server-Sent Events (SSE)

SSE is the simplest reliable approach -- simpler than WebSockets, one-directional (which is exactly what notifications need), auto-reconnects, and natively supported by all modern browsers.

### Backend

```js
const clients = new Map(); // userId -> Set of response objects

function addClient(userId, res) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const keepAlive = setInterval(() => res.write(': keepalive\n\n'), 30_000);

  res.on('close', () => {
    clearInterval(keepAlive);
    clients.get(userId)?.delete(res);
    if (clients.get(userId)?.size === 0) clients.delete(userId);
  });
}

function sendNotification(userId, notification) {
  const conns = clients.get(userId);
  if (!conns) return;
  const data = JSON.stringify(notification);
  for (const res of conns) {
    res.write(`event: notification\ndata: ${data}\n\n`);
  }
}
```

### Frontend (React)

```jsx
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get('/notifications').then(r => {
      setNotifications(r.data);
      setUnreadCount(r.data.filter(n => !n.read).length);
    });

    const token = localStorage.getItem('accessToken');
    const es = new EventSource(`/api/notifications/stream?token=${token}`);

    es.addEventListener('notification', (event) => {
      const notif = JSON.parse(event.data);
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => es.close();
  }, []);

  const markRead = useCallback(async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  return { notifications, unreadCount, markRead };
}
```

**Why SSE over WebSockets:** Notifications are unidirectional. SSE handles this natively with automatic reconnection, needs no extra libraries, and is simpler to deploy behind load balancers. Use WebSockets only if you also need client-to-server messaging.

---

## Task 5

### Minimal Production Deployment

### 1. Dockerize the app

```dockerfile
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "src/index.js"]
```

### 2. Docker Compose

```yaml
services:
  app:
    build: .
    restart: unless-stopped
    ports: ["3000:3000"]
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://app:${DB_PASSWORD}@db:5432/myapp
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d myapp"]

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes: [./Caddyfile:/etc/caddy/Caddyfile, caddy_data:/data]
    depends_on: [app]

volumes:
  pgdata:
  caddy_data:
```

### 3. Automatic HTTPS with Caddy

```
# Caddyfile
myapp.example.com {
    reverse_proxy app:3000
    encode gzip
}
```

### 4. Deploy

```bash
# On a fresh Ubuntu VPS:
sudo apt update && sudo apt install -y docker.io docker-compose-v2
git clone your-repo /opt/myapp && cd /opt/myapp
# Create .env with real secrets, then:
docker compose up -d
```

### Production checklist

| Item | Solution |
|------|----------|
| HTTPS | Caddy auto-TLS |
| Process restart | Docker `restart: unless-stopped` |
| Database persistence | Docker named volume |
| Security headers | `helmet` middleware |
| Rate limiting | `express-rate-limit` |
| Compression | `compression` middleware |
| DB backups | Cron: `docker compose exec db pg_dump` |
