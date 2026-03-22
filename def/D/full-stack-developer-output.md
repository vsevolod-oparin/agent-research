## Task 1: User Authentication for a React + Express App

### Implementation Plan

The authentication system has four layers: database user storage, Express API endpoints, JWT token management, and React protected routes.

**Architecture Overview**

```
React Frontend                    Express Backend                 PostgreSQL
+-----------------+               +------------------+            +--------+
| Login Form      | -- POST ----> | /api/auth/login  | -- query > | users  |
| Register Form   | -- POST ----> | /api/auth/register|            +--------+
| Protected Route | -- GET -----> | /api/protected/* |
|  (Bearer token) |               |  (authMiddleware)|
+-----------------+               +------------------+
```

**Step 1: Backend Dependencies and User Model**

```bash
npm install express bcryptjs jsonwebtoken cookie-parser cors dotenv
```

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
```

**Step 2: Auth Middleware (backend/middleware/auth.js)**

```js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // Must be a strong random string
const JWT_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { generateTokens, authMiddleware };
```

**Step 3: Auth Routes (backend/routes/auth.js)**

```js
const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");
const { generateTokens } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "Invalid email or password (min 8 chars)" });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email.toLowerCase().trim(), hash]
    );
    const tokens = generateTokens(result.rows[0].id);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ user: result.rows[0], accessToken: tokens.accessToken });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const tokens = generateTokens(user.id);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ user: { id: user.id, email: user.email }, accessToken: tokens.accessToken });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });
  try {
    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "refresh") throw new Error("Wrong token type");
    const tokens = generateTokens(decoded.userId);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: tokens.accessToken });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

module.exports = router;
```

**Step 4: React Auth Context and Protected Route**

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiFetch = useCallback(
    async (url, options = {}) => {
      const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });
      if (res.status === 401 && token) {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setToken(data.accessToken);
          return fetch(url, {
            ...options,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.accessToken}`,
              ...options.headers,
            },
          });
        }
        setUser(null);
        setToken(null);
      }
      return res;
    },
    [token]
  );

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setToken(data.accessToken);
    }
    return { ok: res.ok, data };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setToken(data.accessToken);
        // Decode user from token or fetch /api/auth/me
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

```jsx
// Usage in App.jsx router
<Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
```

**Security Considerations**

- Passwords hashed with bcrypt (cost factor 12).
- Access tokens are short-lived (15 min); refresh tokens are httpOnly cookies (7 days).
- The refresh token is never exposed to JavaScript, mitigating XSS token theft.
- `sameSite: "strict"` on cookies prevents CSRF.
- Always return the same error message for wrong email vs. wrong password to prevent user enumeration.
- Rate-limit the login endpoint in production (e.g., `express-rate-limit`).

---

## Task 2: Fixing the N+1 Query Problem

### Problem Diagnosis

The N+1 problem occurs when the code fetches a list of posts (1 query), then loops over each post to fetch its author (N queries) and comments (N more queries). For 25 posts, that is 1 + 25 + 25 = 51 queries.

Typical problematic code:

```js
// BAD: N+1
app.get("/api/posts", async (req, res) => {
  const posts = await db.query("SELECT * FROM posts LIMIT 25");
  for (const post of posts.rows) {
    const author = await db.query("SELECT * FROM users WHERE id = $1", [post.author_id]);
    const comments = await db.query("SELECT * FROM comments WHERE post_id = $1", [post.id]);
    post.author = author.rows[0];
    post.comments = comments.rows;
  }
  res.json(posts.rows);
});
```

### Solution: Batch Queries with JOINs or DataLoader Pattern

**Approach A: SQL JOINs (simplest, recommended for this case)**

Replace all the individual queries with two efficient queries:

```js
app.get("/api/posts", async (req, res) => {
  // Query 1: Posts with authors (single JOIN)
  const postsResult = await db.query(`
    SELECT
      p.id, p.title, p.body, p.created_at,
      json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar) AS author
    FROM posts p
    JOIN users u ON u.id = p.author_id
    ORDER BY p.created_at DESC
    LIMIT 25
  `);

  const postIds = postsResult.rows.map((p) => p.id);

  // Query 2: All comments for those posts in one query
  const commentsResult = await db.query(`
    SELECT c.*, json_build_object('id', u.id, 'name', u.name) AS commenter
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = ANY($1)
    ORDER BY c.created_at ASC
  `, [postIds]);

  // Group comments by post_id in application code
  const commentsByPost = {};
  for (const c of commentsResult.rows) {
    if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
    commentsByPost[c.post_id].push(c);
  }

  const posts = postsResult.rows.map((p) => ({
    ...p,
    comments: commentsByPost[p.id] || [],
  }));

  res.json(posts);
});
```

This reduces the query count from 50+ down to exactly 2, regardless of the number of posts.

**Approach B: DataLoader (for GraphQL or complex cases)**

If using GraphQL or if the data access patterns are unpredictable, use `dataloader` to batch and deduplicate queries within a single request:

```js
const DataLoader = require("dataloader");

// Create loaders per-request (in middleware)
app.use((req, res, next) => {
  req.loaders = {
    user: new DataLoader(async (userIds) => {
      const result = await db.query(
        "SELECT * FROM users WHERE id = ANY($1)", [userIds]
      );
      const map = Object.fromEntries(result.rows.map((u) => [u.id, u]));
      return userIds.map((id) => map[id] || null);
    }),
    commentsByPost: new DataLoader(async (postIds) => {
      const result = await db.query(
        "SELECT * FROM comments WHERE post_id = ANY($1)", [postIds]
      );
      const grouped = {};
      for (const c of result.rows) {
        if (!grouped[c.post_id]) grouped[c.post_id] = [];
        grouped[c.post_id].push(c);
      }
      return postIds.map((id) => grouped[id] || []);
    }),
  };
  next();
});
```

**Database Indexes Required**

```sql
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
```

**React Frontend Optimization**

On the frontend, avoid making the problem worse by fetching related data separately:

```js
// BAD: Fetching author per post on the frontend
posts.map(post => fetch(`/api/users/${post.authorId}`))

// GOOD: The API already returns everything nested
const { data: posts } = useSWR("/api/posts", fetcher);
// posts[0].author and posts[0].comments are already included
```

If the data is large, add pagination on both the API (`?page=1&limit=25`) and consider cursor-based pagination for real-time feeds.

---

## Task 3: E-Commerce Cart Database Schema and API

### PostgreSQL Schema

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart items (one active cart per user, no separate cart table needed)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)  -- One row per product per user
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items (snapshot of product at time of purchase)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Indexes
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
```

Key design decisions:
- **Prices stored as integers (cents)** to avoid floating-point rounding errors.
- **UNIQUE(user_id, product_id)** on cart_items means each user has one implicit cart; adding the same product increments quantity via `ON CONFLICT`.
- **order_items snapshots product_name and unit_price_cents** so the order history remains accurate even if the product is later changed or deleted.
- **shipping_address as JSONB** allows flexible address formats without a separate table.

### REST API Design

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products?page=1&limit=20 | List active products |
| GET | /api/products/:id | Get product details |
| GET | /api/cart | Get current user's cart |
| POST | /api/cart/items | Add item to cart |
| PATCH | /api/cart/items/:productId | Update item quantity |
| DELETE | /api/cart/items/:productId | Remove item from cart |
| POST | /api/orders | Checkout (cart -> order) |
| GET | /api/orders | List user's orders |
| GET | /api/orders/:id | Get order details |

### Key Endpoint Implementations

```js
// POST /api/cart/items -- Add to cart (upsert)
router.post("/cart/items", authMiddleware, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.userId;

  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
     RETURNING *`,
    [userId, productId, quantity]
  );
  res.status(201).json(result.rows[0]);
});

// GET /api/cart -- Get cart with product details and total
router.get("/cart", authMiddleware, async (req, res) => {
  const result = await pool.query(
    `SELECT ci.product_id, ci.quantity, p.name, p.price_cents, p.image_url,
            (ci.quantity * p.price_cents) AS line_total_cents
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = $1`,
    [req.userId]
  );
  const items = result.rows;
  const totalCents = items.reduce((sum, i) => sum + i.line_total_cents, 0);
  res.json({ items, totalCents });
});

// POST /api/orders -- Checkout
router.post("/orders", authMiddleware, async (req, res) => {
  const { shippingAddress } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock cart items and products to prevent race conditions
    const cartResult = await client.query(
      `SELECT ci.product_id, ci.quantity, p.name, p.price_cents, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1
       FOR UPDATE OF p`,
      [req.userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate stock
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          error: `Insufficient stock for ${item.name}`,
        });
      }
    }

    const totalCents = cartResult.rows.reduce(
      (sum, i) => sum + i.price_cents * i.quantity, 0
    );

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_cents, shipping_address)
       VALUES ($1, $2, $3) RETURNING id`,
      [req.userId, totalCents, JSON.stringify(shippingAddress)]
    );
    const orderId = orderResult.rows[0].id;

    // Create order items and decrement stock
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.name, item.price_cents, item.quantity]
      );
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.userId]);

    await client.query("COMMIT");
    res.status(201).json({ orderId, totalCents });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Checkout failed" });
  } finally {
    client.release();
  }
});
```

The checkout endpoint uses a database transaction with `FOR UPDATE` locking to handle concurrent purchases safely, preventing overselling.

---

## Task 4: Real-Time Notifications with Server-Sent Events (SSE)

### Recommended Approach: Server-Sent Events

For notifications that flow from server to client only, SSE is the simplest reliable approach. It is simpler than WebSockets because it uses plain HTTP, reconnects automatically, and requires no additional libraries. WebSockets would be overkill here since notifications are unidirectional.

### Backend Implementation

```js
// backend/routes/notifications.js
const express = require("express");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Store connected clients by userId
const clients = new Map(); // userId -> Set of response objects

router.get("/stream", authMiddleware, (req, res) => {
  const userId = req.userId;

  // Set SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  // Register client
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  // Keep-alive ping every 30s to prevent proxy timeouts
  const keepAlive = setInterval(() => res.write(": ping\n\n"), 30000);

  // Cleanup on disconnect
  req.on("close", () => {
    clearInterval(keepAlive);
    clients.get(userId)?.delete(res);
    if (clients.get(userId)?.size === 0) clients.delete(userId);
  });
});

// Helper to send notification to a specific user
function sendNotification(userId, notification) {
  const userClients = clients.get(userId);
  if (!userClients) return;
  const data = `data: ${JSON.stringify(notification)}\n\n`;
  for (const client of userClients) {
    client.write(data);
  }
}

module.exports = { router, sendNotification };
```

Trigger notifications from anywhere in the backend:

```js
// Example: After a new comment is posted
const { sendNotification } = require("./routes/notifications");

router.post("/api/posts/:id/comments", authMiddleware, async (req, res) => {
  // ... save comment to DB ...

  // Notify the post author
  sendNotification(post.author_id, {
    type: "new_comment",
    message: `${commenter.name} commented on your post`,
    postId: post.id,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(comment);
});
```

### React Frontend

```jsx
// src/hooks/useNotifications.js
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const { token } = useAuth();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // EventSource does not support custom headers, so pass token as query param
    // (alternatively, use a session cookie for auth)
    const es = new EventSource(`/api/notifications/stream?token=${token}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "connected") return;
      setNotifications((prev) => [data, ...prev]);
    };

    es.onerror = () => {
      // EventSource reconnects automatically; no action needed
    };

    return () => es.close();
  }, [token]);

  const dismiss = useCallback((index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return { notifications, dismiss };
}
```

```jsx
// src/components/NotificationBell.jsx
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationBell() {
  const { notifications, dismiss } = useNotifications();
  const [open, setOpen] = useState(false);
  const unread = notifications.length;

  return (
    <div className="notification-bell">
      <button onClick={() => setOpen(!open)}>
        Bell {unread > 0 && <span className="badge">{unread}</span>}
      </button>
      {open && (
        <div className="notification-dropdown">
          {notifications.length === 0 && <p>No notifications</p>}
          {notifications.map((n, i) => (
            <div key={i} className="notification-item">
              <span>{n.message}</span>
              <button onClick={() => dismiss(i)}>x</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### When to Use WebSockets Instead

Use WebSockets (via `socket.io`) only if you also need bidirectional communication, such as a chat feature or collaborative editing. For notifications alone, SSE is the right tool because it is simpler, works over standard HTTP, and handles reconnection out of the box.

### Scaling Beyond a Single Server

The in-memory `clients` Map works for a single server. When running multiple instances behind a load balancer, use Redis Pub/Sub to broadcast notifications across servers:

```js
const Redis = require("ioredis");
const sub = new Redis();
const pub = new Redis();

sub.subscribe("notifications");
sub.on("message", (channel, message) => {
  const { userId, notification } = JSON.parse(message);
  sendNotification(userId, notification); // Send to local clients only
});

// Use this instead of sendNotification directly
function broadcastNotification(userId, notification) {
  pub.publish("notifications", JSON.stringify({ userId, notification }));
}
```

---

## Task 5: Minimal Production Deployment

### Overview

The goal is to go from `npm start` on a laptop to a production setup that is secure, reliable, and reasonably performant. The minimal viable production stack is:

```
Internet -> Caddy (reverse proxy + TLS) -> Node.js app -> PostgreSQL
                                        -> Static React files
```

### Step 1: Build the React Frontend

```bash
cd frontend && npm run build
```

This produces a `build/` directory of static files. Serve them from the Node.js app or directly from the reverse proxy.

### Step 2: Prepare the Node.js Backend for Production

```js
// server.js
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

app.use(helmet());           // Security headers
app.use(compression());      // Gzip responses
app.use(express.json());

// API routes
app.use("/api", require("./routes"));

// Serve React static files
app.use(express.static(path.join(__dirname, "frontend/build")));

// SPA fallback: serve index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

### Step 3: Use a Process Manager

Do not use `node server.js` directly. Use PM2 to keep the process alive and manage restarts:

```bash
npm install -g pm2

# Start with cluster mode to use all CPU cores
pm2 start server.js --name myapp -i max

# Save the process list so it restarts on reboot
pm2 save
pm2 startup  # Generates a command to run for OS autostart
```

### Step 4: Environment Configuration

Create a `.env` file on the server (never commit this):

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
JWT_SECRET=<random-64-char-string>
```

### Step 5: Reverse Proxy with Caddy

Caddy automatically provisions and renews TLS certificates from Let's Encrypt. Install Caddy and create `/etc/caddy/Caddyfile`:

```
myapp.example.com {
  reverse_proxy localhost:3000

  encode gzip

  header {
    X-Content-Type-Options nosniff
    X-Frame-Options DENY
    Referrer-Policy strict-origin-when-cross-origin
  }
}
```

```bash
sudo systemctl enable caddy
sudo systemctl start caddy
```

Caddy handles HTTPS, HTTP/2, and certificate renewal with zero configuration beyond the domain name.

### Step 6: PostgreSQL Setup

```bash
sudo apt install postgresql
sudo -u postgres createuser myapp_user
sudo -u postgres createdb myapp -O myapp_user
sudo -u postgres psql -c "ALTER USER myapp_user PASSWORD 'strong-password';"
```

Enable automatic backups:

```bash
# Add to crontab
0 3 * * * pg_dump myapp | gzip > /backups/myapp-$(date +\%F).sql.gz
```

### Step 7: Minimal Docker Alternative

If you prefer containers, here is a `docker-compose.yml` for the entire stack:

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://myapp:secret@db:5432/myapp
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    restart: unless-stopped

  caddy:
    image: caddy:2
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    restart: unless-stopped

volumes:
  pgdata:
  caddy_data:
```

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN cd frontend && npm ci && npm run build
EXPOSE 3000
CMD ["node", "server.js"]
```

### Production Checklist

| Item | Why |
|------|-----|
| `NODE_ENV=production` | Express disables verbose errors, enables caching |
| Helmet middleware | Sets security HTTP headers |
| HTTPS via Caddy | Encrypted traffic, required for cookies with `secure` flag |
| PM2 or Docker restart | Process recovery after crashes |
| Database backups | Data loss protection |
| Rate limiting | Prevent abuse (`express-rate-limit`) |
| Logging | Use `pino` or `winston` for structured logs, pipe to a file or log service |
| Health check endpoint | `GET /api/health` returning 200 for monitoring |
| Firewall | Only expose ports 80, 443, and SSH. Block direct access to port 3000 |

This setup can handle a moderate traffic load on a single $5-20/month VPS (such as a DigitalOcean droplet or Hetzner server) and forms a solid foundation to scale from.
