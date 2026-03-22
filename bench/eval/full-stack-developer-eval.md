# Evaluation: full-stack-developer

**Date:** 2026-03-22
**Tasks:** fsd-001, fsd-004
**Conditions:** BARE, V1, V2

---

## Task fsd-001: User Authentication (React + Express)

**Input:** Implement user authentication for a React + Express app. Requirements: email/password login, JWT tokens, protected routes. Give me the implementation plan and key code.

**Ground truth keys:** bcrypt hashing, JWT storage tradeoff (httpOnly cookie vs localStorage + XSS risk), Express middleware for protected routes, React auth context/provider, refresh token strategy.

---

### BARE Response (fsd-001)

Here's a plan for implementing auth in your React + Express app:

**Backend (Express):**
Install `jsonwebtoken` and `bcrypt`. Create a User model with email and hashed password. On registration, hash the password with bcrypt before storing. On login, compare with `bcrypt.compare()`, then sign a JWT with `jwt.sign({ userId }, SECRET, { expiresIn: '1h' })`. Store the token -- you can use localStorage on the client, though httpOnly cookies are more secure against XSS attacks. Create an auth middleware that checks the Authorization header, verifies the token, and attaches the user to `req.user`. Apply this middleware to any protected route: `router.get('/profile', authMiddleware, handler)`.

**Frontend (React):**
Create an AuthContext with a provider that holds user state and login/logout functions. Wrap your app in `<AuthProvider>`. On login, POST credentials to `/api/login`, store the returned token, and update context. Create a `ProtectedRoute` component that checks auth state and redirects to login if unauthenticated.

**Key considerations:** Use bcrypt with salt rounds of 10+. Set reasonable token expiry. For production, implement refresh tokens -- issue a long-lived refresh token alongside the short-lived access token, so users don't have to re-login frequently. Store refresh tokens server-side in a database to enable revocation. Add rate limiting on login endpoints to prevent brute force.

This gives you a solid foundation. Add email verification and password reset flows as next steps.

---

### V1 Response (fsd-001)

As a full-stack developer with expertise across the entire technology stack, here is a comprehensive implementation plan for authentication:

**Architecture:** Following clean code principles and a holistic approach, the auth system spans frontend (React), backend (Express), and database (PostgreSQL) layers.

**Backend Implementation:**
Use bcrypt (salt rounds 12) to hash passwords -- never store plaintext. Create Express middleware for JWT verification: extract token from the Authorization header, verify with `jwt.verify()`, attach decoded user to the request. Apply to all protected routes. For the login endpoint, validate credentials, compare hashed passwords, and issue a JWT.

**Token Strategy:**
JWT storage involves a security tradeoff. localStorage is convenient but vulnerable to XSS. httpOnly cookies prevent JavaScript access but require CSRF protection. For most apps, httpOnly cookies with SameSite=Strict is the safer default. Implement refresh tokens: short-lived access tokens (15 minutes) paired with longer-lived refresh tokens stored server-side, enabling token rotation and revocation.

**Frontend (React):**
Build an AuthContext/Provider that manages auth state, exposes login/logout/register functions, and checks token validity on mount. Create a ProtectedRoute wrapper component that redirects unauthenticated users. Use an Axios interceptor to attach tokens and handle 401 responses automatically.

**Security considerations per web security best practices:** Rate limit login attempts, validate all inputs, use HTTPS in production, implement account lockout after failed attempts. Following the test-driven mindset principle, write integration tests for auth flows including negative cases.

---

### V2 Response (fsd-001)

## Implementation Plan: User Authentication

### Data Model

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN DEFAULT FALSE
);
```

### API Endpoints

| Method | Path | Auth | Request | Response | Status |
|--------|------|------|---------|----------|--------|
| POST | /api/auth/register | No | `{email, password}` | `{accessToken}` + cookie | 201/409 |
| POST | /api/auth/login | No | `{email, password}` | `{accessToken}` + cookie | 200/401 |
| POST | /api/auth/refresh | Cookie | -- | `{accessToken}` | 200/401 |
| POST | /api/auth/logout | Yes | -- | -- | 204 |

### Key Decisions

**Password hashing:** bcrypt with cost factor 12. Not argon2 (bcrypt has wider Express ecosystem support).

**Token storage tradeoff:** Access token (15min) returned in response body, stored in memory (not localStorage -- XSS vulnerable). Refresh token in httpOnly, Secure, SameSite=Strict cookie. This avoids both XSS (no JS-accessible token persistence) and CSRF (SameSite + no auth action on GET).

**Auth middleware:** Verify access token from `Authorization: Bearer` header. On 401, frontend silently calls `/refresh` before retrying. Express middleware: `verifyToken(req, res, next)` on all `/api/*` except auth routes.

**React auth context:** AuthProvider holds user + accessToken in state. Axios interceptor attaches token and handles 401 refresh retry. ProtectedRoute redirects to `/login`.

### Implementation Order
1. Migration + User model (source of truth)
2. Register/login endpoints with bcrypt + Zod validation
3. JWT signing + refresh token rotation
4. Auth middleware on protected routes
5. React AuthProvider + ProtectedRoute + API client

### Anti-patterns avoided
- No localStorage for tokens (XSS risk)
- No CORS `*` -- specific origin only
- Server-side auth enforcement, not frontend-only

Tech Stack: Express, bcrypt, jsonwebtoken, Zod, React Context | Files: 6 new, 2 modified | Complexity: MEDIUM

---

### Scores: fsd-001

| Dimension | BARE | V1 | V2 |
|-----------|------|----|----|
| Completeness | 3.5 | 4.0 | 5.0 |
| Precision | 3.0 | 3.5 | 5.0 |
| Actionability | 3.0 | 3.0 | 5.0 |
| Structure | 3.0 | 3.5 | 5.0 |
| Efficiency | 3.5 | 3.0 | 4.5 |
| Depth | 3.0 | 3.5 | 4.5 |

**Ground truth coverage:**

| Criterion | BARE | V1 | V2 |
|-----------|------|----|----|
| bcrypt hashing | Yes | Yes | Yes |
| JWT storage tradeoff | Partial (mentions both but leans localStorage) | Yes | Yes (explicit, reasoned) |
| Express middleware | Yes | Yes | Yes |
| React auth context | Yes | Yes | Yes |
| Refresh token strategy | Yes (brief) | Yes | Yes (with rotation, DB-backed) |
| No plaintext passwords | Yes | Yes | Yes |
| XSS risk discussed | Partial | Yes | Yes (drives architecture) |

**Composite scores (Precision x2 + Completeness x1.5 + others x1) / 7.5:**

- BARE: (3.0x2 + 3.5x1.5 + 3.0 + 3.0 + 3.5 + 3.0) / 7.5 = (6.0 + 5.25 + 12.5) / 7.5 = **3.17**
- V1: (3.5x2 + 4.0x1.5 + 3.0 + 3.5 + 3.0 + 3.5) / 7.5 = (7.0 + 6.0 + 13.0) / 7.5 = **3.47**
- V2: (5.0x2 + 5.0x1.5 + 5.0 + 5.0 + 4.5 + 4.5) / 7.5 = (10.0 + 7.5 + 19.0) / 7.5 = **4.87**

---

## Task fsd-004: Real-Time Notifications

**Input:** Add real-time notifications to an existing React + Express app. Users should see notifications appear without page refresh. What's the simplest reliable approach?

**Ground truth keys:** SSE as simplest option (not WebSocket), EventSource API, Express SSE pattern, reconnection handling, polling as fallback. Must NOT jump to WebSocket/Socket.IO.

---

### BARE Response (fsd-004)

The simplest approach for real-time notifications is **WebSocket** using Socket.IO. It's well-supported and easy to set up with Express:

**Backend:** Install `socket.io`. Create a Socket.IO server attached to your Express HTTP server. When something happens that generates a notification (e.g., new message), emit an event: `io.to(userId).emit('notification', data)`. Use rooms so each user gets only their notifications.

**Frontend:** Install `socket.io-client`. Connect on mount: `const socket = io('http://localhost:3000')`. Listen for events: `socket.on('notification', (data) => { addNotification(data) })`. Show a toast or badge update when notifications arrive. Clean up the connection on unmount.

**Notification storage:** Save notifications in a database table so users can see missed ones. Mark as read when clicked. Load unread count on initial page load via REST, then update in real-time via the socket.

**Reconnection:** Socket.IO handles reconnection automatically with exponential backoff. If the connection drops, it will retry. You can listen for disconnect/reconnect events to show connection status to the user.

**Alternative approaches:** For an even simpler setup, you could use polling (fetch `/api/notifications` every 30 seconds), but this adds latency and unnecessary server load. Server-Sent Events (SSE) is another option if you only need server-to-client communication, but Socket.IO is more widely used and has better tooling.

This gives you real-time updates with minimal setup.

---

### V1 Response (fsd-004)

For real-time notifications, the simplest and most reliable approach depends on your communication pattern. Since notifications are **unidirectional** (server to client), you have several options:

**Recommended: Server-Sent Events (SSE)**
SSE is purpose-built for server-to-client streaming and simpler than WebSockets for this use case. On Express, set headers `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`, then write events with `res.write()`. On the frontend, use the native `EventSource` API -- no library needed.

**Express implementation:** Create a `/api/notifications/stream` endpoint that holds the response open. When notifications are created elsewhere in your app, push them to connected clients. Track connections in a Map keyed by userId. On `req.on('close')`, clean up.

**React integration:** In your notification component, create an `EventSource` instance pointing to the stream endpoint. Handle `onmessage` to parse and display notifications. The `EventSource` API automatically reconnects on disconnect, which is a major advantage over manual WebSocket reconnection handling.

**Why not WebSocket/Socket.IO?** WebSockets are bidirectional -- overkill for notifications where only the server sends data. Socket.IO adds a large dependency for a problem SSE solves natively. Following the principle of prioritizing user experience with clean code, SSE is the right tool for this job.

**Fallback:** If you need to support very old browsers or proxies that don't handle SSE well, simple polling (fetch every 15-30s) works as the simplest possible alternative. It trades latency for simplicity.

Store notifications in a database for persistence and offline access.

---

### V2 Response (fsd-004)

## Implementation Plan: Real-Time Notifications

### Technology Decision

**SSE (Server-Sent Events)**, not WebSocket. Rationale from selection criteria:

| Option | Fits? | Why/Why Not |
|--------|-------|-------------|
| WebSocket/Socket.IO | No | Bidirectional -- overengineered for server-to-client notifications. Adds `socket.io` dependency (~300KB). Requires custom reconnection logic |
| SSE | **Yes** | Native browser API (`EventSource`), auto-reconnect built in, works over HTTP/1.1, no extra dependencies, unidirectional = correct fit |
| Polling | Fallback | Simplest but adds latency (up to interval length) and wastes requests. Use only if SSE fails behind a proxy |

### API Endpoints

| Method | Path | Auth | Response | Status |
|--------|------|------|----------|--------|
| GET | /api/notifications/stream | Yes | `text/event-stream` | 200 (long-lived) |
| GET | /api/notifications | Yes | `{ notifications: [...] }` | 200 |
| PATCH | /api/notifications/:id/read | Yes | `{ ok: true }` | 200/404 |

### Express SSE Implementation Pattern

```js
// Key headers: Content-Type, Cache-Control, Connection
// res.write(`data: ${JSON.stringify(notification)}\n\n`)
// Track connections: Map<userId, Response[]>
// req.on('close', () => cleanup(userId, res))
// Heartbeat every 30s: res.write(': heartbeat\n\n') to detect dead connections
```

### Frontend: EventSource API

```js
const es = new EventSource('/api/notifications/stream', { withCredentials: true });
es.onmessage = (e) => dispatch({ type: 'NEW_NOTIFICATION', payload: JSON.parse(e.data) });
es.onerror = () => { /* EventSource auto-reconnects. Show "reconnecting..." after 5s */ };
```

**Reconnection handling:** EventSource reconnects automatically. Server sends `retry: 3000\n` to set retry interval. On reconnect, client sends `Last-Event-ID` header -- server uses this to replay missed notifications (requires storing event IDs).

### Implementation Order
1. Notifications table + migration (id, user_id, type, payload, read, created_at)
2. SSE endpoint with auth middleware + connection tracking
3. Notification service: on event, write to DB + push to connected SSE clients
4. React hook `useNotifications()` wrapping EventSource + REST fallback
5. UI: notification bell with unread count + dropdown

### Anti-patterns avoided
- No WebSocket/Socket.IO for unidirectional flow (overengineering)
- No premature optimization (no Redis pub/sub until multi-server)
- Heartbeat prevents silent connection death

Tech Stack: Express (native SSE), EventSource API, no new dependencies | Files: 4 new, 1 modified | Complexity: LOW

---

### Scores: fsd-004

| Dimension | BARE | V1 | V2 |
|-----------|------|----|----|
| Completeness | 3.5 | 4.5 | 5.0 |
| Precision | 2.0 | 4.5 | 5.0 |
| Actionability | 3.5 | 3.5 | 5.0 |
| Structure | 3.0 | 3.5 | 5.0 |
| Efficiency | 2.5 | 4.0 | 4.5 |
| Depth | 3.0 | 3.5 | 4.5 |

**Ground truth coverage:**

| Criterion | BARE | V1 | V2 |
|-----------|------|----|----|
| SSE as simplest option | **No** (chose WebSocket) | Yes | Yes |
| EventSource API | No | Yes | Yes |
| Express SSE pattern | No | Yes (partial) | Yes (detailed) |
| Reconnection handling | Partial (Socket.IO auto) | Yes | Yes (Last-Event-ID) |
| Polling as fallback | Mentioned but dismissed | Yes | Yes |
| Did NOT jump to WebSocket | **FAIL** | Pass | Pass |

**Composite scores:**

- BARE: (2.0x2 + 3.5x1.5 + 3.5 + 3.0 + 2.5 + 3.0) / 7.5 = (4.0 + 5.25 + 12.0) / 7.5 = **2.83**
- V1: (4.5x2 + 4.5x1.5 + 3.5 + 3.5 + 4.0 + 3.5) / 7.5 = (9.0 + 6.75 + 14.5) / 7.5 = **4.03**
- V2: (5.0x2 + 5.0x1.5 + 5.0 + 5.0 + 4.5 + 4.5) / 7.5 = (10.0 + 7.5 + 19.0) / 7.5 = **4.87**

---

## Summary Table

| Task | BARE | V1 | V2 | LIFT(V1) | LIFT(V2) |
|------|------|----|----|----------|----------|
| fsd-001 (Auth) | 3.17 | 3.47 | 4.87 | +0.30 | +1.70 |
| fsd-004 (Notifications) | 2.83 | 4.03 | 4.87 | +1.20 | +2.04 |
| **Average** | **3.00** | **3.75** | **4.87** | **+0.75** | **+1.87** |

### Key Findings

1. **V1 provides marginal lift on fsd-001 (+0.30):** The generic competency paragraphs (clean code, holistic approach, test-driven mindset) add rhetorical padding but do not meaningfully improve technical precision. The auth response reads like a V1-flavored version of the bare response -- same structure, slightly better security awareness, but no new architectural decisions.

2. **V1 provides significant lift on fsd-004 (+1.20):** The main gain is V1 correctly choosing SSE over WebSocket. However, this likely comes from general knowledge rather than agent instructions -- the V1 doc has no technology selection guidance that would steer toward SSE. The V1 agent text mentions "holistic approach" which may weakly nudge toward analyzing the communication pattern first.

3. **V2 provides strong lift on both tasks (+1.70, +2.04):** The technology selection table, anti-patterns list, and structured output format directly improve precision and actionability. On fsd-004, the anti-pattern "premature optimization / overengineering" explicitly steers away from WebSocket. On fsd-001, the auth checklist ("bcrypt/argon2, short-lived access, rotating refresh") ensures all ground truth items are covered.

4. **V2's structured output format is a force multiplier.** The template (Data Model, API Endpoints table, Implementation Order, Anti-patterns avoided) forces concrete answers where BARE and V1 produce prose. This accounts for most of the Structure and Actionability score gains.

5. **V1's weakness is lack of decision guidance.** It says "knowledge of authentication" but not WHICH pattern to use. It says "API development" but not WHAT format to return. V2's tables and checklists convert generic competency into concrete selection criteria.
