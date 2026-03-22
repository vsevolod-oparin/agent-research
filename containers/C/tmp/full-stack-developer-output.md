## Task 1

### User Authentication for React + Express (JWT)

#### Implementation Plan

1. **Backend (Express):** bcrypt for password hashing, jsonwebtoken for JWT, express middleware for route protection
2. **Database:** Users table with email, hashed password, created_at
3. **Frontend (React):** Login/Register forms, token storage in httpOnly cookie, Axios interceptor for auth headers, protected route wrapper
4. **Flow:** Register -> hash password -> store user -> Login -> verify password -> issue JWT -> Client stores token -> Protected routes check token via middleware

#### Database (PostgreSQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

#### Backend Key Code

**Dependencies:**
```bash
npm install express bcrypt jsonwebtoken cookie-parser pg dotenv
```

**auth.middleware.js**
```javascript
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { authenticate };
```

**auth.routes.js**
```javascript
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db"); // pg Pool instance

const router = express.Router();
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "Email and password (8+ chars) required" });
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email.toLowerCase().trim(), hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});

module.exports = router;
```

**server.js (wiring)**
```javascript
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./auth.routes");
const { authenticate } = require("./auth.middleware");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Protected route example
app.get("/api/profile", authenticate, async (req, res) => {
  // req.user is set by middleware
  res.json({ user: req.user });
});

app.listen(process.env.PORT || 3001);
```

#### Frontend Key Code

**AuthContext.jsx**
```jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated (cookie-based)
    fetch("/api/profile", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    const data = await res.json();
    setUser(data.user);
    return data.user;
  }

  async function register(email, password) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    const data = await res.json();
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**ProtectedRoute.jsx**
```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

**App.jsx (routing)**
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

#### Security Checklist

- Passwords hashed with bcrypt (cost factor 12)
- JWT stored in httpOnly cookie (not localStorage -- prevents XSS theft)
- sameSite=strict prevents CSRF
- secure flag in production forces HTTPS
- Generic error message on login failure (prevents user enumeration)
- Input validation on registration
- JWT_SECRET loaded from environment variable, never hardcoded

---

## Task 2

### Fixing the N+1 Query Problem

#### The Problem

Typical N+1 code looks like this:

```javascript
// BAD: 1 query for posts + N queries for authors + N queries for comments = 2N+1
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

With 25 posts, that is 51 queries per request.

#### Solution 1: JOIN Query (Simplest)

```javascript
app.get("/api/posts", async (req, res) => {
  const { rows } = await db.query(`
    SELECT
      p.id, p.title, p.body, p.created_at,
      json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar) AS author,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'body', c.body, 'author_name', cu.name, 'created_at', c.created_at)
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::json
      ) AS comments
    FROM posts p
    JOIN users u ON u.id = p.author_id
    LEFT JOIN comments c ON c.post_id = p.id
    LEFT JOIN users cu ON cu.id = c.author_id
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT 25
  `);

  res.json(rows);
});
```

**Result:** 1 query instead of 51. PostgreSQL handles the aggregation.

#### Solution 2: Batch Queries with DataLoader Pattern

When JOINs get complex or you want reusable loaders:

```javascript
// dataLoaders.js
async function batchLoadAuthors(authorIds) {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE id = ANY($1)",
    [authorIds]
  );
  const map = new Map(rows.map((r) => [r.id, r]));
  return authorIds.map((id) => map.get(id) || null);
}

async function batchLoadComments(postIds) {
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE post_id = ANY($1) ORDER BY created_at",
    [postIds]
  );
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.post_id)) map.set(row.post_id, []);
    map.get(row.post_id).push(row);
  }
  return postIds.map((id) => map.get(id) || []);
}

// Route handler
app.get("/api/posts", async (req, res) => {
  const posts = await db.query(
    "SELECT * FROM posts ORDER BY created_at DESC LIMIT 25"
  );

  const authorIds = [...new Set(posts.rows.map((p) => p.author_id))];
  const postIds = posts.rows.map((p) => p.id);

  // 3 queries total, regardless of row count
  const [authors, commentGroups] = await Promise.all([
    batchLoadAuthors(authorIds),
    batchLoadComments(postIds),
  ]);

  const authorMap = new Map(authorIds.map((id, i) => [id, authors[i]]));

  const result = posts.rows.map((post, i) => ({
    ...post,
    author: authorMap.get(post.author_id),
    comments: commentGroups[i],
  }));

  res.json(result);
});
```

**Result:** 3 queries total (posts, authors, comments) regardless of how many posts.

#### Solution 3: Database Indexes

Ensure these indexes exist -- without them, even optimized queries will be slow:

```sql
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_author_id ON comments(author_id);
```

#### Frontend: Avoid Waterfalls

```jsx
// BAD: sequential fetches
function PostList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // fetches posts, then each post fetches its own author...
  }, []);
}

// GOOD: single fetch, backend returns everything
function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setPosts);
  }, []);

  return posts.map((post) => (
    <PostCard
      key={post.id}
      post={post}
      author={post.author}       // already included
      comments={post.comments}   // already included
    />
  ));
}
```

#### Adding Pagination

```javascript
app.get("/api/posts", async (req, res) => {
  const cursor = req.query.cursor; // last post's created_at from previous page
  const limit = Math.min(parseInt(req.query.limit) || 25, 100);

  const whereClause = cursor
    ? "WHERE p.created_at < $1"
    : "";
  const params = cursor ? [cursor, limit] : [limit];
  const limitParam = cursor ? "$2" : "$1";

  const { rows } = await db.query(`
    SELECT p.*, json_build_object('id', u.id, 'name', u.name) AS author,
      COALESCE(json_agg(json_build_object('id', c.id, 'body', c.body))
        FILTER (WHERE c.id IS NOT NULL), '[]'::json) AS comments
    FROM posts p
    JOIN users u ON u.id = p.author_id
    LEFT JOIN comments c ON c.post_id = p.id
    ${whereClause}
    GROUP BY p.id, u.id
    ORDER BY p.created_at DESC
    LIMIT ${limitParam}
  `, params);

  res.json({
    posts: rows,
    nextCursor: rows.length === limit ? rows[rows.length - 1].created_at : null,
  });
});
```

#### Summary

| Approach | Queries | Complexity | Best For |
|----------|---------|------------|----------|
| JOIN + json_agg | 1 | Medium | Most cases |
| Batch (ANY) | 3 | Low | Reusable loaders, GraphQL |
| DataLoader lib | 3 | Low | GraphQL specifically |
| Pagination | 1 per page | Medium | Large datasets |

Recommendation: Start with the JOIN approach (Solution 1). It is the simplest and most performant for this use case. Add cursor pagination when the dataset grows.

---

## Task 3

### E-Commerce Cart: Database Schema and REST API

#### Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart items (one cart per user, modeled as rows)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)  -- one row per product per user
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items (snapshot of products at time of purchase)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,    -- snapshot
  price_cents INTEGER NOT NULL,           -- snapshot of price at purchase time
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Indexes
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
```

**Key design decisions:**
- Prices stored as integers (cents) to avoid floating-point issues
- Order items snapshot product name and price at purchase time (prices change, order history should not)
- Cart is implicit -- rows in cart_items with a user_id constitute that user's cart
- UNIQUE(user_id, product_id) on cart_items prevents duplicate entries (use ON CONFLICT to update quantity)

#### REST API Design

```
Products
  GET    /api/products                 List products (paginated, filterable)
  GET    /api/products/:id             Get single product

Cart
  GET    /api/cart                     Get current user's cart
  POST   /api/cart/items               Add item to cart
  PATCH  /api/cart/items/:productId    Update quantity
  DELETE /api/cart/items/:productId    Remove item from cart
  DELETE /api/cart                     Clear cart

Orders
  POST   /api/orders                   Create order from cart (checkout)
  GET    /api/orders                   List user's orders
  GET    /api/orders/:id               Get order details
```

#### API Implementation

**cart.routes.js**
```javascript
const express = require("express");
const pool = require("./db");
const { authenticate } = require("./auth.middleware");

const router = express.Router();
router.use(authenticate);

// Get cart with product details and total
router.get("/", async (req, res) => {
  const { rows: items } = await pool.query(`
    SELECT ci.product_id, ci.quantity,
           p.name, p.price_cents, p.image_url, p.stock,
           (ci.quantity * p.price_cents) AS line_total_cents
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = $1
    ORDER BY ci.added_at
  `, [req.user.id]);

  const total_cents = items.reduce((sum, item) => sum + item.line_total_cents, 0);

  res.json({ items, total_cents, item_count: items.length });
});

// Add item to cart (or increment quantity if already present)
router.post("/items", async (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  // Verify product exists and has stock
  const { rows: [product] } = await pool.query(
    "SELECT id, stock FROM products WHERE id = $1 AND is_active = TRUE", [product_id]
  );
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (product.stock < quantity) return res.status(400).json({ error: "Insufficient stock" });

  const { rows: [item] } = await pool.query(`
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    RETURNING *
  `, [req.user.id, product_id, quantity]);

  res.status(201).json(item);
});

// Update quantity
router.patch("/items/:productId", async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ error: "Quantity must be >= 1" });

  const { rows: [item] } = await pool.query(`
    UPDATE cart_items SET quantity = $1
    WHERE user_id = $2 AND product_id = $3
    RETURNING *
  `, [quantity, req.user.id, req.params.productId]);

  if (!item) return res.status(404).json({ error: "Item not in cart" });
  res.json(item);
});

// Remove item
router.delete("/items/:productId", async (req, res) => {
  await pool.query(
    "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
    [req.user.id, req.params.productId]
  );
  res.status(204).end();
});

// Clear cart
router.delete("/", async (req, res) => {
  await pool.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
  res.status(204).end();
});

module.exports = router;
```

**orders.routes.js (checkout)**
```javascript
const express = require("express");
const pool = require("./db");
const { authenticate } = require("./auth.middleware");

const router = express.Router();
router.use(authenticate);

// Checkout: convert cart to order (transactional)
router.post("/", async (req, res) => {
  const { shipping_address } = req.body;
  if (!shipping_address) return res.status(400).json({ error: "Shipping address required" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock cart items and their products for update
    const { rows: cartItems } = await client.query(`
      SELECT ci.product_id, ci.quantity,
             p.name AS product_name, p.price_cents, p.stock
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = $1
      FOR UPDATE OF p
    `, [req.user.id]);

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Verify stock for all items
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: `Insufficient stock for ${item.product_name}`,
        });
      }
    }

    // Calculate total
    const total_cents = cartItems.reduce(
      (sum, item) => sum + item.price_cents * item.quantity, 0
    );

    // Create order
    const { rows: [order] } = await client.query(`
      INSERT INTO orders (user_id, total_cents, shipping_address)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [req.user.id, total_cents, JSON.stringify(shipping_address)]);

    // Create order items and decrement stock
    for (const item of cartItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_name, price_cents, quantity)
        VALUES ($1, $2, $3, $4, $5)
      `, [order.id, item.product_id, item.product_name, item.price_cents, item.quantity]);

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);

    await client.query("COMMIT");

    res.status(201).json({ order_id: order.id, total_cents, status: order.status });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed" });
  } finally {
    client.release();
  }
});

// List orders
router.get("/", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT id, status, total_cents, created_at
    FROM orders WHERE user_id = $1
    ORDER BY created_at DESC
  `, [req.user.id]);
  res.json(rows);
});

// Order detail
router.get("/:id", async (req, res) => {
  const { rows: [order] } = await pool.query(
    "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );
  if (!order) return res.status(404).json({ error: "Order not found" });

  const { rows: items } = await pool.query(
    "SELECT * FROM order_items WHERE order_id = $1", [order.id]
  );

  res.json({ ...order, items });
});

module.exports = router;
```

#### Key Points

- **Checkout is fully transactional** with FOR UPDATE locks to prevent race conditions on stock
- **Price snapshots** in order_items protect order history from price changes
- **ON CONFLICT** for cart upsert prevents duplicate cart entries
- **Stock validation** happens inside the transaction, not before it
- **Cents-based pricing** avoids floating-point math entirely

---

## Task 4

### Real-Time Notifications with Server-Sent Events (SSE)

SSE is the simplest reliable approach. It is built into every browser, requires no additional library on the frontend, and uses plain HTTP -- no WebSocket upgrade, no Socket.io dependency, no sticky sessions needed.

#### Why SSE Over WebSocket

| Feature | SSE | WebSocket |
|---------|-----|-----------|
| Direction | Server to client | Bidirectional |
| Protocol | HTTP | WS |
| Reconnection | Built-in automatic | Manual |
| Complexity | Very low | Medium |
| Proxy/firewall | Passes through HTTP | Can be blocked |
| Libraries needed | None (EventSource API) | socket.io or ws |

Notifications are server-to-client only, which is exactly what SSE does.

#### Backend Implementation

**notifications.js**
```javascript
const express = require("express");
const { authenticate } = require("./auth.middleware");

const router = express.Router();

// Store active connections per user
const clients = new Map(); // userId -> Set of response objects

router.get("/stream", authenticate, (req, res) => {
  const userId = req.user.id;

  // SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // disable nginx buffering
  });

  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  // Register this client
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  // Heartbeat every 30s to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 30000);

  // Cleanup on disconnect
  req.on("close", () => {
    clearInterval(heartbeat);
    clients.get(userId)?.delete(res);
    if (clients.get(userId)?.size === 0) clients.delete(userId);
  });
});

// Helper: send notification to a specific user
function sendNotification(userId, notification) {
  const userClients = clients.get(userId);
  if (!userClients) return;

  const data = `data: ${JSON.stringify(notification)}\n\n`;
  for (const client of userClients) {
    client.write(data);
  }
}

// API to mark notifications as read
router.patch("/:id/read", authenticate, async (req, res) => {
  const pool = require("./db");
  await pool.query(
    "UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );
  res.json({ ok: true });
});

module.exports = { router, sendNotification };
```

**Usage from other parts of your app:**
```javascript
const { sendNotification } = require("./notifications");

// After someone comments on a post
async function createComment(postId, authorId, body) {
  const comment = await db.query(/* insert comment */);
  const post = await db.query("SELECT author_id FROM posts WHERE id = $1", [postId]);

  // Notify the post author in real time
  sendNotification(post.rows[0].author_id, {
    type: "new_comment",
    message: `Someone commented on your post`,
    postId,
    commentId: comment.rows[0].id,
    createdAt: new Date().toISOString(),
  });
}
```

**Database table for persistence:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread
  ON notifications(user_id, created_at DESC) WHERE read = FALSE;
```

#### Frontend Implementation

**useNotifications.js**
```javascript
import { useState, useEffect, useCallback } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream", {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "connected") {
        setConnected(true);
        return;
      }

      setNotifications((prev) => [data, ...prev]);
    };

    eventSource.onerror = () => {
      setConnected(false);
      // EventSource automatically reconnects
    };

    return () => eventSource.close();
  }, []);

  const markAsRead = useCallback(async (id) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
      credentials: "include",
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, connected, markAsRead };
}
```

**NotificationBell.jsx**
```jsx
import { useState } from "react";
import { useNotifications } from "./useNotifications";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-bell">
      <button onClick={() => setOpen(!open)}>
        Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          {notifications.length === 0 && <p>No notifications</p>}
          {notifications.map((n) => (
            <div
              key={n.id || n.createdAt}
              className={`notification-item ${n.read ? "read" : "unread"}`}
              onClick={() => n.id && markAsRead(n.id)}
            >
              <p>{n.message}</p>
              <time>{new Date(n.createdAt).toLocaleString()}</time>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Scaling Notes

For a single server, the in-memory clients Map works fine. When you scale to multiple servers:

1. **Redis Pub/Sub** as a broadcast layer -- each server subscribes, publishes notifications to the channel, and all servers forward to their connected clients
2. That is the only change needed. SSE connections stay on their original server; Redis distributes the notifications across servers

```javascript
// Multi-server: add Redis pub/sub (only needed when scaling)
const Redis = require("ioredis");
const pub = new Redis();
const sub = new Redis();

sub.subscribe("notifications");
sub.on("message", (channel, message) => {
  const { userId, notification } = JSON.parse(message);
  sendNotification(userId, notification); // delivers to local clients only
});

// Replace direct sendNotification calls with:
function broadcastNotification(userId, notification) {
  pub.publish("notifications", JSON.stringify({ userId, notification }));
}
```

---

## Task 5

### Production Deployment for React + Node.js

#### Architecture Overview

```
                   [Cloudflare / Route53 DNS]
                            |
                     [Load Balancer]
                      (cloud-native)
                       /         \
              [React SPA]    [Node.js API]
              (static CDN)   (container x2)
                                 |
                          [PostgreSQL]
                          (managed DB)
```

#### Step 1: Separate Build Artifacts

**React (frontend):** Build static files, serve from CDN or nginx.

```bash
cd frontend
npm run build   # produces build/ or dist/ folder
```

**Node.js (backend):** No build step needed for plain JS. If TypeScript, compile first.

#### Step 2: Dockerize the Backend

**Dockerfile (backend)**
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Non-root user
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -S appuser
USER appuser

EXPOSE 3001
ENV NODE_ENV=production

CMD ["node", "server.js"]
```

**Dockerfile (frontend -- optional, if not using CDN)**
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**nginx.conf (for SPA routing)**
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 3: Docker Compose for Local Parity

**docker-compose.yml**
```yaml
services:
  api:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://app:${DB_PASSWORD}@db:5432/myapp
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=app
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d myapp"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:
```

#### Step 4: Essential Production Hardening

**.env.production (never commit this)**
```
NODE_ENV=production
JWT_SECRET=<generate with: openssl rand -base64 64>
DB_PASSWORD=<generate with: openssl rand -base64 32>
```

**Backend hardening (add to server.js):**
```javascript
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

// Security headers
app.use(helmet());

// Gzip
app.use(compression());

// Rate limiting
app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 login attempts per window
  message: { error: "Too many attempts, try again later" },
}));

// Trust proxy (if behind load balancer/nginx)
app.set("trust proxy", 1);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down...");
  server.close(() => {
    pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000); // force after 10s
});
```

#### Step 5: Minimal Cloud Deployment Options

**Option A: Single VPS (cheapest, simplest)**

A $10-20/month VPS (DigitalOcean, Hetzner, Railway) is enough to start:

```bash
# On VPS
apt update && apt install docker.io docker-compose-plugin -y
git clone <your-repo>
cd your-repo
cp .env.example .env.production  # fill in secrets
docker compose --env-file .env.production up -d

# Add SSL with Caddy (auto HTTPS) instead of nginx
# Caddyfile:
# yourdomain.com {
#     handle /api/* {
#         reverse_proxy api:3001
#     }
#     handle {
#         root * /srv/frontend
#         file_server
#         try_files {path} /index.html
#     }
# }
```

**Option B: PaaS (simplest, slightly more expensive)**

Deploy backend to Railway/Render/Fly.io, frontend to Vercel/Netlify, use managed PostgreSQL:

```bash
# Backend: Railway
railway login
railway init
railway add --database postgresql
railway up

# Frontend: Vercel
cd frontend
npx vercel --prod
# Set VITE_API_URL=https://your-backend.railway.app in Vercel env
```

#### Step 6: Observability (Non-Negotiable)

```javascript
// Structured logging (replace console.log)
const pino = require("pino");
const logger = pino({ level: process.env.LOG_LEVEL || "info" });

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", uptime: process.uptime() });
  } catch {
    res.status(503).json({ status: "unhealthy", db: "down" });
  }
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start,
    });
  });
  next();
});
```

#### Production Checklist

```
[x] NODE_ENV=production
[x] Secrets in env vars, not code
[x] HTTPS (via Caddy auto-cert or cloud LB)
[x] Security headers (helmet)
[x] Rate limiting on auth endpoints
[x] Health check endpoint
[x] Structured logging
[x] Graceful shutdown handlers
[x] Non-root user in Docker
[x] Database connection pooling
[x] Static asset caching headers
[x] SPA routing configured (try_files or equivalent)
[x] Automated backups for PostgreSQL
[x] Container restart policy (unless-stopped)
```

#### What to Add Later (Not Day One)

- CI/CD pipeline (GitHub Actions: test -> build -> push image -> deploy)
- Monitoring/alerting (Grafana Cloud free tier, or UptimeRobot for basics)
- CDN for static assets (Cloudflare free tier)
- Database read replicas (when you actually need them)
- Horizontal scaling (when a single server cannot handle the load)
