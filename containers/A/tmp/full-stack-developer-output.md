## Task 1

### User Authentication for React + Express (JWT)

**Architecture Overview**

Three layers: React frontend with protected route wrappers, Express middleware for JWT verification, and a PostgreSQL `users` table with bcrypt-hashed passwords. Tokens are short-lived access tokens (15 min) paired with longer-lived refresh tokens (7 days) stored in httpOnly cookies.

**Implementation Plan**

1. Database: `users` table with id, email, password_hash, created_at
2. Backend: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
3. Middleware: `authenticateToken` that verifies JWT on protected routes
4. Frontend: AuthContext provider, ProtectedRoute component, login/register forms
5. Token strategy: access token in memory, refresh token in httpOnly cookie

**Key Code -- Backend**

```js
// auth.middleware.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = { authenticateToken };
```

```js
// auth.routes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();
const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );

    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: { id: user.id, email: user.email }, accessToken });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: { id: user.id, email: user.email }, accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const result = await pool.query("SELECT id, email FROM users WHERE id = $1", [payload.id]);
    if (result.rows.length === 0) {
      return res.status(403).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

module.exports = router;
```

**Key Code -- Frontend**

```jsx
// AuthContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      setUser(null);
      setAccessToken(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshAccessToken().then((token) => {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.id, email: payload.email });
      }
      setLoading(false);
    });
  }, [refreshAccessToken]);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }
    const data = await res.json();
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setAccessToken(null);
  };

  // Wrapper for authenticated fetch calls
  const authFetch = useCallback(async (url, options = {}) => {
    let token = accessToken;
    let res = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });

    if (res.status === 403) {
      token = await refreshAccessToken();
      if (!token) throw new Error("Session expired");
      res = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      });
    }
    return res;
  }, [accessToken, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

```jsx
// App.jsx -- route setup
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {
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

**Security Considerations**

- Never store JWTs in localStorage (XSS vulnerable). Access token lives in React state; refresh token in httpOnly cookie.
- Use `sameSite: "strict"` and `secure: true` on cookies in production.
- Return identical error messages for "user not found" and "wrong password" to prevent user enumeration.
- Rate-limit login attempts (use `express-rate-limit`).
- Add CSRF protection if the app serves HTML from the same origin.

---

## Task 2

### Fixing the N+1 Query Problem (Posts with Authors and Comments)

**The Problem**

The current code likely looks like this:

```js
// BAD: N+1 pattern
app.get("/api/posts", async (req, res) => {
  const posts = await db.query("SELECT * FROM posts LIMIT 20");

  for (const post of posts.rows) {
    const author = await db.query("SELECT * FROM users WHERE id = $1", [post.author_id]);
    post.author = author.rows[0];

    const comments = await db.query("SELECT * FROM comments WHERE post_id = $1", [post.id]);
    post.comments = comments.rows;
  }

  res.json(posts.rows);
});
// 20 posts = 1 (posts) + 20 (authors) + 20 (comments) = 41 queries minimum
```

**Solution: Batch Loading with JOINs or IN clauses**

There are two main strategies. Use JOINs for tightly coupled data, and batch IN queries when the data shape is complex.

**Approach A -- Single JOIN query (simplest)**

```js
app.get("/api/posts", async (req, res) => {
  const result = await db.query(`
    SELECT
      p.id AS post_id,
      p.title,
      p.body,
      p.created_at AS post_created_at,
      u.id AS author_id,
      u.name AS author_name,
      u.avatar_url AS author_avatar,
      c.id AS comment_id,
      c.body AS comment_body,
      c.created_at AS comment_created_at,
      cu.name AS commenter_name
    FROM posts p
    JOIN users u ON u.id = p.author_id
    LEFT JOIN comments c ON c.post_id = p.id
    LEFT JOIN users cu ON cu.id = c.user_id
    ORDER BY p.created_at DESC, c.created_at ASC
    LIMIT 200
  `);

  // Reshape flat rows into nested structure
  const postsMap = new Map();
  for (const row of result.rows) {
    if (!postsMap.has(row.post_id)) {
      postsMap.set(row.post_id, {
        id: row.post_id,
        title: row.title,
        body: row.body,
        createdAt: row.post_created_at,
        author: { id: row.author_id, name: row.author_name, avatar: row.author_avatar },
        comments: [],
      });
    }
    if (row.comment_id) {
      postsMap.get(row.post_id).comments.push({
        id: row.comment_id,
        body: row.comment_body,
        createdAt: row.comment_created_at,
        commenterName: row.commenter_name,
      });
    }
  }

  res.json([...postsMap.values()]);
});
// Total: 1 query regardless of post/comment count
```

**Approach B -- Batch IN queries (better for large comment counts)**

When posts have many comments, the JOIN produces a cartesian expansion. Three separate queries with IN clauses avoid this:

```js
app.get("/api/posts", async (req, res) => {
  // Query 1: Get posts
  const posts = await db.query(
    "SELECT * FROM posts ORDER BY created_at DESC LIMIT 20"
  );

  const postIds = posts.rows.map((p) => p.id);
  const authorIds = [...new Set(posts.rows.map((p) => p.author_id))];

  // Query 2: Get all authors in one shot
  const authors = await db.query(
    "SELECT id, name, avatar_url FROM users WHERE id = ANY($1)",
    [authorIds]
  );
  const authorMap = new Map(authors.rows.map((a) => [a.id, a]));

  // Query 3: Get all comments in one shot
  const comments = await db.query(
    `SELECT c.*, u.name AS commenter_name
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = ANY($1)
     ORDER BY c.created_at ASC`,
    [postIds]
  );

  // Group comments by post_id
  const commentsByPost = new Map();
  for (const c of comments.rows) {
    if (!commentsByPost.has(c.post_id)) commentsByPost.set(c.post_id, []);
    commentsByPost.get(c.post_id).push(c);
  }

  // Assemble response
  const result = posts.rows.map((post) => ({
    ...post,
    author: authorMap.get(post.author_id),
    comments: commentsByPost.get(post.id) || [],
  }));

  res.json(result);
});
// Total: 3 queries regardless of post/comment count
```

**Database Indexes**

```sql
-- These indexes are critical for performance
CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_posts_author_id ON posts (author_id);
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);
```

**Frontend Optimization**

On the React side, avoid re-fetching the full list unnecessarily:

```jsx
// Use React Query / TanStack Query for caching and deduplication
import { useQuery } from "@tanstack/react-query";

function PostsList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then((r) => r.json()),
    staleTime: 30_000, // Don't refetch for 30 seconds
  });

  if (isLoading) return <div>Loading...</div>;

  return posts.map((post) => (
    <PostCard key={post.id} post={post} />
  ));
}
```

**When to use which approach:**
- Approach A (JOIN): Posts have few comments (< 10 each), simplest code
- Approach B (batch IN): Posts have many comments, or you need pagination on comments
- DataLoader pattern: If you use GraphQL, use Facebook's `dataloader` library which automates batching

**Result:** 50+ queries reduced to 1-3 queries. Response time typically drops from 500ms+ to under 50ms.

---

## Task 3

### E-Commerce Cart: Database Schema and REST API

**Database Schema (PostgreSQL)**

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url   VARCHAR(512),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cart items (one active cart per user, no separate cart table needed)
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- Orders
CREATE TABLE orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  status      VARCHAR(50) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  shipping_address JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items (snapshot of product at time of purchase)
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  product_name VARCHAR(255) NOT NULL
);

-- Indexes
CREATE INDEX idx_cart_items_user ON cart_items (user_id);
CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_products_active ON products (is_active) WHERE is_active = true;
```

**Key design decisions:**
- Prices stored as integers (cents) to avoid floating-point errors
- `order_items` stores a snapshot of `price_cents` and `product_name` so order history is accurate even if products change
- `cart_items` has a UNIQUE constraint on (user_id, product_id) -- updating quantity instead of duplicating rows
- `shipping_address` as JSONB keeps the schema flexible without a separate addresses table

**REST API Design**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (paginated) |
| GET | /api/products/:id | Get single product |
| GET | /api/cart | Get current user's cart |
| POST | /api/cart/items | Add item to cart |
| PATCH | /api/cart/items/:id | Update item quantity |
| DELETE | /api/cart/items/:id | Remove item from cart |
| POST | /api/cart/checkout | Convert cart to order |
| GET | /api/orders | List user's orders |
| GET | /api/orders/:id | Get order details |

**Key Code -- Cart and Checkout**

```js
// routes/cart.js
const router = require("express").Router();
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

// Get cart with product details
router.get("/", async (req, res) => {
  const result = await pool.query(
    `SELECT ci.id, ci.quantity, ci.product_id,
            p.name, p.price_cents, p.image_url, p.stock
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = $1
     ORDER BY ci.created_at`,
    [req.user.id]
  );

  const items = result.rows;
  const totalCents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);

  res.json({ items, totalCents });
});

// Add item to cart (upsert)
router.post("/items", async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await pool.query(
    "SELECT id, stock, is_active FROM products WHERE id = $1",
    [productId]
  );
  if (product.rows.length === 0 || !product.rows[0].is_active) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (product.rows[0].stock < quantity) {
    return res.status(400).json({ error: "Insufficient stock" });
  }

  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = now()
     RETURNING *`,
    [req.user.id, productId, quantity]
  );

  res.status(201).json(result.rows[0]);
});

// Update quantity
router.patch("/items/:id", async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: "Quantity must be at least 1" });
  }

  const result = await pool.query(
    `UPDATE cart_items SET quantity = $1, updated_at = now()
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [quantity, req.params.id, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Cart item not found" });
  }
  res.json(result.rows[0]);
});

// Remove item
router.delete("/items/:id", async (req, res) => {
  await pool.query(
    "DELETE FROM cart_items WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );
  res.status(204).end();
});

// Checkout -- convert cart to order
router.post("/checkout", async (req, res) => {
  const { shippingAddress } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock cart items and products to prevent races
    const cartResult = await client.query(
      `SELECT ci.id, ci.quantity, ci.product_id,
              p.name, p.price_cents, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1
       FOR UPDATE OF ci, p`,
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate stock for all items
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: `Insufficient stock for ${item.name}`,
        });
      }
    }

    // Calculate total
    const totalCents = cartResult.rows.reduce(
      (sum, i) => sum + i.price_cents * i.quantity, 0
    );

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_cents, shipping_address)
       VALUES ($1, $2, $3) RETURNING id`,
      [req.user.id, totalCents, JSON.stringify(shippingAddress)]
    );
    const orderId = orderResult.rows[0].id;

    // Create order items and decrement stock
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_cents, product_name)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, item.price_cents, item.name]
      );
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);

    await client.query("COMMIT");
    res.status(201).json({ orderId, totalCents });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed" });
  } finally {
    client.release();
  }
});

module.exports = router;
```

**Important patterns in this implementation:**
- Checkout uses a database transaction with row-level locking (`FOR UPDATE`) to prevent race conditions (two users buying the last item)
- Stock is validated and decremented atomically within the transaction
- Cart item upsert uses `ON CONFLICT` to handle "add same product twice" gracefully

---

## Task 4

### Real-Time Notifications with Socket.IO

**Why Socket.IO over alternatives:**
- SSE (Server-Sent Events) is simpler but only supports server-to-client; no native reconnection backoff
- Raw WebSockets require manual reconnection, heartbeat, and room management
- Socket.IO provides automatic reconnection, room-based broadcasting, and fallback to long-polling -- the best simplicity/reliability tradeoff

**Implementation Plan**

1. Add Socket.IO to the existing Express server (no separate service needed)
2. Authenticate socket connections using the existing JWT
3. Each user joins a room named by their user ID
4. Backend emits notifications to specific user rooms
5. Frontend listens and displays with a notification bell/toast

**Key Code -- Backend**

```js
// socket.js -- Socket.IO setup
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // Authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = payload.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    // Join user-specific room
    socket.join(`user:${socket.userId}`);
    console.log(`User ${socket.userId} connected`);

    // Mark notification as read
    socket.on("notification:read", async (notificationId) => {
      const pool = require("./db");
      await pool.query(
        "UPDATE notifications SET read_at = now() WHERE id = $1 AND user_id = $2",
        [notificationId, socket.userId]
      );
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  return io;
}

// Call from anywhere in the backend to send a notification
function sendNotification(userId, notification) {
  if (!io) return;
  io.to(`user:${userId}`).emit("notification", notification);
}

module.exports = { initSocket, sendNotification };
```

```js
// server.js -- integrate with existing Express app
const express = require("express");
const http = require("http");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
initSocket(server);

// ... existing routes ...

// Start with httpServer, not app.listen
server.listen(process.env.PORT || 4000);
```

```js
// Usage anywhere in your backend code
const { sendNotification } = require("./socket");

// Example: after someone comments on a post
async function addComment(postId, commenterId, body) {
  const comment = await db.query(/* insert comment */);
  const post = await db.query("SELECT author_id FROM posts WHERE id = $1", [postId]);

  if (post.rows[0].author_id !== commenterId) {
    const commenter = await db.query("SELECT name FROM users WHERE id = $1", [commenterId]);

    sendNotification(post.rows[0].author_id, {
      id: comment.rows[0].id,
      type: "new_comment",
      message: `${commenter.rows[0].name} commented on your post`,
      postId,
      createdAt: new Date().toISOString(),
    });
  }
}
```

**Key Code -- Frontend**

```jsx
// useNotifications.js
import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export function useNotifications() {
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:4000", {
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, [accessToken]);

  const markAsRead = useCallback((notificationId) => {
    if (socket) {
      socket.emit("notification:read", notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, readAt: new Date() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [socket]);

  return { notifications, unreadCount, markAsRead };
}
```

```jsx
// NotificationBell.jsx
import { useNotifications } from "./useNotifications";
import { useState } from "react";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} aria-label="Notifications">
        Bell
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "red", color: "white", borderRadius: "50%",
            width: 18, height: 18, fontSize: 12, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <ul style={{
          position: "absolute", right: 0, top: "100%",
          background: "white", border: "1px solid #ddd",
          borderRadius: 8, width: 320, maxHeight: 400,
          overflow: "auto", listStyle: "none", padding: 0, margin: 0,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          {notifications.length === 0 && (
            <li style={{ padding: 16, color: "#888" }}>No notifications</li>
          )}
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => markAsRead(n.id)}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #f0f0f0",
                background: n.readAt ? "white" : "#f0f7ff",
                cursor: "pointer",
              }}
            >
              <p style={{ margin: 0 }}>{n.message}</p>
              <small style={{ color: "#888" }}>
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Persistence note:** For production, also store notifications in a database table so users can see missed notifications when they come back online. Load the initial list via a REST endpoint (`GET /api/notifications`) and use Socket.IO only for real-time push of new ones.

---

## Task 5

### Minimal Production Deployment for React + Node.js

**The goal:** Go from `npm start` on a laptop to a reliable, secure production deployment with the fewest moving parts.

**Recommended stack:** A single VPS (DigitalOcean, Hetzner, or AWS Lightsail), Docker Compose, Caddy as reverse proxy, and PostgreSQL.

**Architecture**

```
Internet
  |
  v
Caddy (reverse proxy, auto-HTTPS)
  |
  +---> /api/*  -->  Node.js container (port 4000)
  +---> /*      -->  Serves React static build
  |
Node.js --> PostgreSQL container (port 5432, not exposed)
```

**Step 1 -- Dockerize the Application**

```dockerfile
# Dockerfile (multi-stage)
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./
COPY --from=frontend-build /app/client/build ./public

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 4000
CMD ["node", "index.js"]
```

**Step 2 -- Docker Compose**

```yaml
# docker-compose.yml
services:
  app:
    build: .
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://appuser:${DB_PASSWORD}@db:5432/myapp
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - internal

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d myapp"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - internal

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - internal

volumes:
  pgdata:
  caddy_data:
  caddy_config:

networks:
  internal:
```

**Step 3 -- Caddy Configuration (automatic HTTPS)**

```
# Caddyfile
yourdomain.com {
    handle /api/* {
        reverse_proxy app:4000
    }

    handle {
        reverse_proxy app:4000
    }
}
```

Caddy automatically obtains and renews Let's Encrypt certificates. No manual TLS configuration needed.

**Step 4 -- Environment File**

```bash
# .env (do NOT commit this file)
DB_PASSWORD=generate-a-strong-random-password-here
JWT_ACCESS_SECRET=generate-a-64-char-random-string
JWT_REFRESH_SECRET=generate-a-different-64-char-random-string
```

Generate secrets with: `openssl rand -base64 48`

**Step 5 -- Server Setup Script**

```bash
#!/bin/bash
# setup.sh -- run on fresh Ubuntu 22.04+ VPS

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Create app directory
mkdir -p /opt/myapp
cd /opt/myapp

# Clone your repo (or scp files)
git clone https://github.com/you/myapp.git .

# Create .env with production secrets
cp .env.example .env
# Edit .env with real values

# Start everything
docker compose up -d

# Verify
docker compose ps
docker compose logs -f app
```

**Step 6 -- Node.js Production Hardening**

```js
// server/index.js -- production considerations
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const app = express();

// Security headers
app.use(helmet());

// Gzip compression
app.use(compression());

// Parse JSON
app.use(express.json({ limit: "1mb" }));

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => process.exit(0));
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Step 7 -- Basic Monitoring and Backups**

```bash
# Automated database backups (add to crontab)
# crontab -e
0 3 * * * docker compose -f /opt/myapp/docker-compose.yml exec -T db pg_dump -U appuser myapp | gzip > /opt/backups/myapp-$(date +\%Y\%m\%d).sql.gz

# Keep only last 7 days
0 4 * * * find /opt/backups -name "myapp-*.sql.gz" -mtime +7 -delete
```

**Production Checklist**

- [x] Dockerfile with multi-stage build and non-root user
- [x] Docker Compose with health checks and restart policies
- [x] Reverse proxy with automatic HTTPS (Caddy)
- [x] Secrets in .env, not in code or Docker image
- [x] Helmet for security headers
- [x] Graceful shutdown handling
- [x] Database on a persistent volume
- [x] Automated backups
- [ ] Log aggregation (add when you need it: Loki, or just `docker compose logs`)
- [ ] Uptime monitoring (free: UptimeRobot, Cronitor)
- [ ] CI/CD pipeline (add when deploy frequency justifies it)

**Cost:** A $6-12/month VPS handles this entire stack comfortably for thousands of users. Scale vertically (bigger VPS) before adding complexity.
