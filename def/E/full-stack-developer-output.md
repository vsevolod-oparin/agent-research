## Task 1

### User Authentication for React + Express (JWT)

**Implementation Plan:**

| Step | Component | Description |
|------|-----------|-------------|
| 1 | Database | Create `users` and `refresh_tokens` tables |
| 2 | Backend Service | Register, login, refresh, logout logic |
| 3 | Validation | Zod schemas for input validation |
| 4 | Middleware | JWT verification middleware |
| 5 | Routes | Auth route handlers |
| 6 | Frontend API Client | Token management with auto-refresh |
| 7 | Forms | Login/register with error handling |
| 8 | ProtectedRoute | Route wrapper component |

**API Endpoints:**

| Method | Path | Auth | Status Codes |
|--------|------|------|-------------|
| POST | /api/auth/register | No | 201, 400, 409 |
| POST | /api/auth/login | No | 200, 400, 401 |
| POST | /api/auth/refresh | No | 200, 401 |
| POST | /api/auth/logout | Yes | 200, 401 |
| GET | /api/auth/me | Yes | 200, 401 |

**Key Backend Code -- Auth Middleware:**

```typescript
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

**Key Backend Code -- Auth Service:**

```typescript
export async function registerUser(email: string, password: string) {
  const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows.length > 0) {
    throw { status: 409, code: "USER_EXISTS", error: "Email already registered" };
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await db.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, passwordHash]
  );
  const user = result.rows[0];
  const tokens = await generateTokens(user.id, user.email);
  return { user, ...tokens };
}
```

**Frontend Protected Route:**

```tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

**Critical Design Decisions:**
- Short-lived access tokens (15 min) with rotating refresh tokens
- Refresh tokens stored as SHA-256 hashes in the database
- bcrypt with 12 rounds for password hashing
- Generic "Invalid email or password" error on login (prevents enumeration)

---

## Task 2

### Fixing the N+1 Query Problem

**Problem:** The endpoint makes 1 + 2N queries (50+ for 20 posts).

**Fix: Use JOINs and Batch Queries (3 queries total):**

```typescript
async function getPosts(req, res) {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  // Query 1: posts + authors
  const postsResult = await db.query(`
    SELECT p.id, p.title, p.body, p.created_at,
      json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar) AS author
    FROM posts p JOIN users u ON u.id = p.author_id
    ORDER BY p.created_at DESC LIMIT $1 OFFSET $2
  `, [limit, offset]);

  // Query 2: all comments for fetched posts at once
  const postIds = postsResult.rows.map(p => p.id);
  const commentsResult = await db.query(`
    SELECT c.id, c.body, c.post_id, c.created_at,
      json_build_object('id', u.id, 'name', u.name) AS commenter
    FROM comments c JOIN users u ON u.id = c.user_id
    WHERE c.post_id = ANY($1) ORDER BY c.created_at ASC
  `, [postIds]);

  // Group comments by post_id in application code
  const commentsByPost = new Map();
  for (const comment of commentsResult.rows) {
    const list = commentsByPost.get(comment.post_id) || [];
    list.push(comment);
    commentsByPost.set(comment.post_id, list);
  }

  // Query 3: count
  const countResult = await db.query("SELECT COUNT(*) FROM posts");

  res.json({ posts, total: parseInt(countResult.rows[0].count), page, limit });
}
```

**Required indexes:**
```sql
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
```

**Result:** 3 queries regardless of post count. ~10-30ms response time.

---

## Task 3

### E-Commerce Cart: Database Schema and API

**Schema:**

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE(user_id, product_id)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  shipping_address JSONB NOT NULL
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0)  -- snapshot at time of order
);
```

**Key design decisions:**
- `price_cents` as INTEGER avoids floating-point rounding errors
- `UNIQUE(user_id, product_id)` on cart_items prevents duplicates
- `price_cents` duplicated in order_items snapshots price at purchase time
- `shipping_address` as JSONB for flexible address formats

**Checkout (atomic transaction with row locking):**

```typescript
async function checkout(userId, shippingAddress) {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    // Lock product rows, validate stock, calculate total, create order + items, decrement stock, clear cart
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
```

---

## Task 4

### Real-Time Notifications with Server-Sent Events (SSE)

SSE is the simplest reliable approach because notifications are server-to-client only.

**Backend SSE endpoint:**

```typescript
router.get("/api/notifications/stream", authenticate, (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 30000);
  const unsubscribe = subscribe(req.user.userId, (notification) => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  });

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});
```

**Frontend hook:**

```typescript
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/notifications/stream?token=${token}`);
    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };
    return () => eventSource.close();
  }, []);

  return { notifications, unreadCount, markAsRead };
}
```

**Scaling:** Replace in-memory EventEmitter with Redis Pub/Sub when you need multiple servers. Do not add Redis until you actually have multiple servers.

---

## Task 5

### Minimal Production Deployment

**Recommended: Single VPS with Caddy + PM2**

| Component | Tool | Why |
|-----------|------|-----|
| Reverse proxy + TLS | Caddy | Auto HTTPS, simple config |
| Process manager | PM2 | Auto-restart, clustering, logs |
| Database | PostgreSQL (managed or local) | ACID, reliable |
| Static files | Caddy file_server | Fast, no extra server |

**Caddyfile:**

```
yourdomain.com {
    root * /home/appuser/app/client/dist
    file_server
    handle /api/* {
        reverse_proxy localhost:3001
    }
    try_files {path} /index.html
}
```

**PM2 config:**

```javascript
module.exports = {
  apps: [{
    name: "api",
    script: "dist/server.js",
    instances: "max",
    exec_mode: "cluster",
    env_production: { NODE_ENV: "production", PORT: 3001 },
  }],
};
```

**Deploy script:**

```bash
#!/bin/bash
set -euo pipefail
cd /home/appuser/app
git pull origin main
npm ci --production
npm run build
node src/db/migrate.js
pm2 reload api --update-env
```

**What NOT to do:**
- Do not use Docker/K8s for a single app on a single server
- Do not use `npm start` or `node server.js` directly in production
- Do not skip HTTPS
- Do not store secrets in code
- Do not run as root

Cost: ~$6-12/month. Handles thousands of concurrent users.
