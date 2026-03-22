## Task 1

### User Authentication for React + Express (JWT-based)

#### Implementation Plan

1. **Backend (Express):** Set up auth routes (`/api/auth/register`, `/api/auth/login`), hash passwords with bcrypt, issue JWT access + refresh tokens, create auth middleware for protected routes.
2. **Frontend (React):** Build login/register forms, store tokens in httpOnly cookies (preferred) or memory, create an Axios interceptor for automatic token attachment, build a `ProtectedRoute` wrapper component.
3. **Database:** Users table with id, email, password_hash, created_at.

#### Key Code

**1. Backend - User model and auth routes**

```js
// backend/models/user.js
const pool = require('../db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

module.exports = {
  async create(email, password) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hash]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async verifyPassword(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
  }
};
```

```js
// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateTokens(userId) {
  const accessToken = jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ error: 'Email and password (min 8 chars) required' });
    }
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const user = await User.create(email, password);
    const tokens = generateTokens(user.id);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(201).json({ user, accessToken: tokens.accessToken });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await User.verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokens = generateTokens(user.id);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ user: { id: user.id, email: user.email }, accessToken: tokens.accessToken });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const tokens = generateTokens(payload.sub);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ accessToken: tokens.accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;
```

**2. Backend - Auth middleware**

```js
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(header.split(' ')[1], process.env.JWT_ACCESS_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

**3. Frontend - Auth context and protected route**

```jsx
// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    setAccessToken(data.accessToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

```jsx
// frontend/src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,  // sends cookies for refresh token
});

// Attach access token and handle refresh on 401
let refreshPromise = null;

export function setupInterceptors(getToken, refreshFn) {
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        if (!refreshPromise) refreshPromise = refreshFn().finally(() => { refreshPromise = null; });
        const newToken = await refreshPromise;
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
```

**4. Route setup**

```jsx
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

#### Security Checklist

- Passwords hashed with bcrypt (cost factor 12).
- Access tokens short-lived (15 min), refresh tokens in httpOnly secure cookies.
- Refresh token rotation on each use prevents replay.
- CSRF protection via `sameSite: 'strict'` on cookies.
- Input validation on all auth endpoints.
- Rate limiting should be added via `express-rate-limit` on auth routes in production.

---

## Task 2

### Fixing the N+1 Query Problem (React + Node.js + PostgreSQL)

#### Diagnosis

The N+1 pattern looks like this in the current code:

```js
// BAD: N+1 queries
app.get('/api/posts', async (req, res) => {
  const posts = await db.query('SELECT * FROM posts');          // 1 query
  for (const post of posts.rows) {
    const author = await db.query(                               // N queries
      'SELECT * FROM users WHERE id = $1', [post.author_id]
    );
    const comments = await db.query(                             // N queries
      'SELECT * FROM comments WHERE post_id = $1', [post.id]
    );
    post.author = author.rows[0];
    post.comments = comments.rows;
  }
  res.json(posts.rows);
});
```

With 25 posts, that is 1 + 25 + 25 = 51 queries.

#### Solution 1: JOIN Query (Simplest)

Collapse everything into a single query with JOINs:

```js
app.get('/api/posts', async (req, res) => {
  const { rows } = await db.query(`
    SELECT
      p.id, p.title, p.body, p.created_at,
      json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar) AS author,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'body', c.body, 'author_name', cu.name)
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::json
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
```

This is **1 query** regardless of post count. PostgreSQL handles the aggregation efficiently.

#### Solution 2: Batch Loading with DataLoader (When JOINs Get Complex)

When the data shape is more varied or you use GraphQL, use Facebook's DataLoader pattern:

```js
// backend/loaders.js
const DataLoader = require('dataloader');

function createLoaders(db) {
  const userLoader = new DataLoader(async (userIds) => {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE id = ANY($1)',
      [userIds]
    );
    const userMap = new Map(rows.map(u => [u.id, u]));
    return userIds.map(id => userMap.get(id) || null);
  });

  const commentsByPostLoader = new DataLoader(async (postIds) => {
    const { rows } = await db.query(
      'SELECT * FROM comments WHERE post_id = ANY($1) ORDER BY created_at',
      [postIds]
    );
    const grouped = new Map();
    for (const row of rows) {
      if (!grouped.has(row.post_id)) grouped.set(row.post_id, []);
      grouped.get(row.post_id).push(row);
    }
    return postIds.map(id => grouped.get(id) || []);
  });

  return { userLoader, commentsByPostLoader };
}

module.exports = createLoaders;
```

```js
// backend/routes/posts.js
app.get('/api/posts', async (req, res) => {
  const loaders = createLoaders(db);  // new loaders per request
  const { rows: posts } = await db.query(
    'SELECT * FROM posts ORDER BY created_at DESC LIMIT 20'
  );

  // Batch: only 2 additional queries total (1 for users, 1 for comments)
  const enriched = await Promise.all(posts.map(async (post) => ({
    ...post,
    author: await loaders.userLoader.load(post.author_id),
    comments: await loaders.commentsByPostLoader.load(post.id),
  })));

  res.json(enriched);
});
```

Result: 3 queries total (posts, unique authors, comments) regardless of post count.

#### Solution 3: Database-Level Optimization (Indexes)

Whichever approach you use, make sure these indexes exist:

```sql
CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_posts_author_id ON posts (author_id);
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);
```

#### Frontend: React Query for Caching

Avoid redundant re-fetches on the client side:

```jsx
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => api.get(`/posts?page=${page}`).then(r => r.data),
    staleTime: 30_000,  // don't refetch for 30s
  });
}
```

#### Recommendation

Use **Solution 1 (JOIN)** for this specific endpoint -- it is the simplest and fastest, producing a single round trip. Use Solution 2 (DataLoader) if you adopt GraphQL or have many endpoints that share the same loading patterns.

---

## Task 3

### E-Commerce Cart: Database Schema and REST API

#### PostgreSQL Schema

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items (one active cart per user, modeled as loose items)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)  -- one row per product per user
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order line items (snapshot of product at time of purchase)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Indexes
CREATE INDEX idx_cart_items_user ON cart_items (user_id);
CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_products_active ON products (is_active) WHERE is_active = TRUE;
```

Key design decisions:
- **Prices in cents** -- avoids floating point issues.
- **order_items snapshots** product name and price at purchase time so price changes do not affect historical orders.
- **UNIQUE(user_id, product_id)** on cart_items means adding the same product again increments quantity rather than creating a duplicate row.
- **stock CHECK constraint** prevents negative inventory at the database level.

#### REST API Design

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (paginated) |
| GET | /api/products/:id | Get single product |
| GET | /api/cart | Get current user's cart |
| POST | /api/cart/items | Add item to cart |
| PATCH | /api/cart/items/:id | Update item quantity |
| DELETE | /api/cart/items/:id | Remove item from cart |
| POST | /api/orders | Checkout (cart to order) |
| GET | /api/orders | List user's orders |
| GET | /api/orders/:id | Get order detail |

#### Key Endpoint Implementations

```js
// GET /api/cart -- returns cart with product details and total
router.get('/cart', authenticate, async (req, res) => {
  const { rows: items } = await db.query(`
    SELECT ci.id, ci.quantity, ci.product_id,
           p.name, p.price_cents, p.image_url, p.stock
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = $1
    ORDER BY ci.added_at
  `, [req.userId]);

  const total_cents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
  res.json({ items, total_cents });
});

// POST /api/cart/items -- add to cart (upsert)
router.post('/cart/items', authenticate, async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id || quantity < 1) {
    return res.status(400).json({ error: 'Valid product_id and quantity required' });
  }

  const { rows } = await db.query(`
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    RETURNING *
  `, [req.userId, product_id, quantity]);

  res.status(201).json(rows[0]);
});

// POST /api/orders -- checkout: convert cart to order atomically
router.post('/orders', authenticate, async (req, res) => {
  const { shipping_address } = req.body;
  if (!shipping_address) return res.status(400).json({ error: 'Shipping address required' });

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // Lock cart items + products to prevent race conditions
    const { rows: cartItems } = await client.query(`
      SELECT ci.product_id, ci.quantity,
             p.name AS product_name, p.price_cents, p.stock
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = $1
      FOR UPDATE OF p   -- lock product rows
    `, [req.userId]);

    if (cartItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Verify stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          error: `Insufficient stock for ${item.product_name}`
        });
      }
    }

    // Calculate total
    const total_cents = cartItems.reduce(
      (sum, i) => sum + i.price_cents * i.quantity, 0
    );

    // Create order
    const { rows: [order] } = await client.query(`
      INSERT INTO orders (user_id, total_cents, shipping_address)
      VALUES ($1, $2, $3) RETURNING *
    `, [req.userId, total_cents, shipping_address]);

    // Create order items and decrement stock
    for (const item of cartItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity)
        VALUES ($1, $2, $3, $4, $5)
      `, [order.id, item.product_id, item.product_name, item.price_cents, item.quantity]);

      await client.query(`
        UPDATE products SET stock = stock - $1 WHERE id = $2
      `, [item.quantity, item.product_id]);
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Checkout failed' });
  } finally {
    client.release();
  }
});
```

The checkout endpoint uses a database transaction with `FOR UPDATE` row locks to guarantee atomicity -- no overselling even under concurrent checkouts.

---

## Task 4

### Real-Time Notifications with Server-Sent Events (SSE)

SSE is the simplest reliable approach for server-to-client push. It is built into every modern browser, works over standard HTTP, automatically reconnects, and requires no additional libraries on the client.

Use WebSockets instead only if you need bidirectional communication (chat, collaborative editing). For one-way notifications, SSE is simpler.

#### Backend Implementation

```js
// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

// In-memory map of connected clients. For multi-server, replace with Redis pub/sub.
const clients = new Map();  // userId -> Set<response>

router.get('/notifications/stream', authenticate, (req, res) => {
  // SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',  // disable nginx buffering
  });

  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  // Register client
  const userId = req.userId;
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  // Keep-alive every 30s to prevent proxy timeouts
  const keepAlive = setInterval(() => res.write(':ping\n\n'), 30000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(keepAlive);
    clients.get(userId)?.delete(res);
    if (clients.get(userId)?.size === 0) clients.delete(userId);
  });
});

// Helper: send notification to a user from anywhere in the app
function sendNotification(userId, notification) {
  const userClients = clients.get(userId);
  if (!userClients) return;

  const data = JSON.stringify({
    id: notification.id,
    type: notification.type,
    message: notification.message,
    timestamp: new Date().toISOString(),
  });

  for (const client of userClients) {
    client.write(`data: ${data}\n\n`);
  }
}

module.exports = { router, sendNotification };
```

```js
// Usage from any route: send notification when something happens
const { sendNotification } = require('./routes/notifications');

// Example: notify user when their order ships
app.patch('/api/orders/:id/ship', async (req, res) => {
  // ... update order status ...
  sendNotification(order.user_id, {
    id: uuid(),
    type: 'order_shipped',
    message: `Your order #${order.id.slice(0, 8)} has shipped!`,
  });
  res.json(order);
});
```

#### Frontend Implementation

```jsx
// frontend/src/hooks/useNotifications.js
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const { accessToken } = useAuth();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!accessToken) return;

    // EventSource doesn't support custom headers, so pass token as query param.
    // The backend auth middleware should also check req.query.token for SSE routes.
    const es = new EventSource(`/api/notifications/stream?token=${accessToken}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'connected') return;
      setNotifications(prev => [data, ...prev].slice(0, 50)); // keep last 50
    };

    es.onerror = () => {
      // EventSource automatically reconnects. No manual handling needed.
    };

    return () => es.close();
  }, [accessToken]);

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, dismiss };
}
```

```jsx
// frontend/src/components/NotificationBell.jsx
import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationBell() {
  const { notifications, dismiss } = useNotifications();
  const [open, setOpen] = useState(false);
  const unread = notifications.length;

  return (
    <div className="notification-bell">
      <button onClick={() => setOpen(!open)}>
        Notifications {unread > 0 && <span className="badge">{unread}</span>}
      </button>
      {open && (
        <ul className="notification-dropdown">
          {notifications.length === 0 && <li>No notifications</li>}
          {notifications.map(n => (
            <li key={n.id}>
              <span>{n.message}</span>
              <button onClick={() => dismiss(n.id)}>x</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### Scaling Beyond a Single Server

The in-memory `clients` Map only works on a single server process. For multiple servers or workers, add Redis pub/sub:

```js
const Redis = require('ioredis');
const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);

sub.subscribe('notifications');
sub.on('message', (channel, message) => {
  const { userId, notification } = JSON.parse(message);
  // Deliver to locally connected clients only
  const userClients = clients.get(userId);
  if (!userClients) return;
  const data = JSON.stringify(notification);
  for (const client of userClients) {
    client.write(`data: ${data}\n\n`);
  }
});

// Replace direct sendNotification with pub
function sendNotification(userId, notification) {
  pub.publish('notifications', JSON.stringify({ userId, notification }));
}
```

This way every server instance subscribes and delivers to its own connected clients.

---

## Task 5

### Minimal Production Deployment for React + Node.js

#### Architecture

```
Client -> Cloudflare (CDN/DNS) -> VPS (Caddy -> Node.js)
                                      |
                                  PostgreSQL
```

A single VPS with Caddy as reverse proxy is the simplest reliable production setup. Caddy handles HTTPS automatically (free Let's Encrypt certs, auto-renewal).

#### Step-by-step

**1. Build the React frontend**

```bash
cd frontend && npm run build
```

This produces a `dist/` (or `build/`) folder of static files. The Node.js server will serve these.

**2. Configure Express to serve the frontend**

```js
// backend/server.js
const express = require('express');
const path = require('path');
const app = express();

// API routes
app.use('/api', require('./routes'));

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {     // bind to localhost only; Caddy faces the internet
  console.log(`Server running on port ${PORT}`);
});
```

**3. Use PM2 as process manager**

PM2 keeps your app running, restarts on crash, and handles log rotation.

```bash
npm install -g pm2
```

```js
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'app',
    script: 'backend/server.js',
    instances: 'max',        // one worker per CPU core
    exec_mode: 'cluster',    // built-in load balancing
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/myapp',
      JWT_ACCESS_SECRET: 'generate-a-random-64-char-string',
      JWT_REFRESH_SECRET: 'generate-another-random-64-char-string',
    }
  }]
};
```

```bash
pm2 start ecosystem.config.js --env production
pm2 save        # persist across reboots
pm2 startup     # generate system startup script
```

**4. Set up Caddy as reverse proxy with automatic HTTPS**

Install Caddy on the VPS and create a Caddyfile:

```
# /etc/caddy/Caddyfile
myapp.example.com {
    reverse_proxy localhost:3000
    encode gzip
}
```

That is the entire Caddy config. It automatically obtains and renews TLS certificates from Let's Encrypt.

```bash
sudo systemctl enable caddy
sudo systemctl start caddy
```

**5. PostgreSQL setup**

```bash
sudo apt install postgresql
sudo -u postgres createuser --pwprompt myappuser
sudo -u postgres createdb -O myappuser myapp
```

Run your schema migrations:

```bash
psql -U myappuser -d myapp -f schema.sql
```

**6. Environment and security hardening**

```bash
# .env (never commit this file)
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://myappuser:securepass@localhost:5432/myapp
JWT_ACCESS_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
```

Firewall -- only expose ports 80, 443, and SSH:

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

**7. Basic deployment script**

```bash
#!/bin/bash
# deploy.sh -- run on the VPS
set -e

cd /opt/myapp
git pull origin main

# Install deps
cd frontend && npm ci && npm run build && cd ..
cd backend && npm ci --production && cd ..

# Restart
pm2 reload ecosystem.config.js --env production

echo "Deployed successfully"
```

**8. Monitoring**

```bash
pm2 monit              # real-time CPU/memory
pm2 logs               # application logs
pm2 install pm2-logrotate   # prevent disk from filling
```

#### Upgrade Path

When the app outgrows a single VPS:

1. **Database:** Move to managed PostgreSQL (RDS, Cloud SQL, or Supabase) for automated backups and failover.
2. **Static assets:** Move the React build to a CDN (Cloudflare Pages, S3 + CloudFront) to offload the server.
3. **Containers:** Dockerize the Node.js app for reproducible deployments and horizontal scaling.
4. **CI/CD:** Add GitHub Actions to run tests and deploy on push to main.

This progression is incremental -- each step can be done independently when the need arises.
