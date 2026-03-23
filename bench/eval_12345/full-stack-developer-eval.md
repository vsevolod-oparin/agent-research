# Evaluation: full-stack-developer

## Ground Truth Requirements

### fsd-001 (JWT Authentication)
- **must_mention**: password hashing (bcrypt, not plain text), JWT token structure and storage (httpOnly cookie vs localStorage tradeoff), middleware for protected routes, React auth context/provider pattern, refresh token strategy
- **must_not**: store passwords in plain text, put JWT in localStorage without discussing XSS risk

### fsd-002 (N+1 Query Problem)
- **must_mention**: JOIN queries or dataloader on backend, specific SQL example (LEFT JOIN posts, users, comments), pagination, frontend: don't refetch cached data
- **must_not**: suggest only frontend caching (problem is server-side)

### fsd-003 (E-commerce Cart Schema)
- **must_mention**: normalized tables (products, users, carts, cart_items, orders, order_items), foreign keys and relationships, cart-to-order conversion logic, inventory check on checkout (race condition awareness), API endpoints (CRUD for cart, checkout flow)
- **structure**: schema DDL or diagram, API endpoint list with methods

### fsd-004 (Real-time Notifications)
- **must_mention**: SSE as simplest option (not WebSocket for unidirectional), EventSource API on frontend, Express SSE implementation pattern, reconnection handling, alternative: polling as simpler fallback
- **must_not**: jump to WebSocket/Socket.IO for unidirectional notifications

### fsd-005 (Deploy to Production)
- **must_mention**: build React for production (npm run build, serve static), Node.js process manager (PM2 or systemd), reverse proxy (nginx) for static + API, environment variables for secrets, HTTPS (Let's Encrypt/certbot)
- **must_not**: suggest Kubernetes for a simple app, skip HTTPS

---

## Scoring Dimensions (1-5)

---

## Condition Evaluations

### Condition 1
- **Precision**: 5 - Correct bcrypt usage, proper JWT implementation, SQL JOIN example is accurate.
- **Completeness**: 4 - Covers bcrypt, JWT storage discussion (memory + httpOnly cookie), middleware, auth context. Has refresh token. fsd-002 has JOIN with json_agg. fsd-003 has schema DDL. Missing: need to check fsd-004 and fsd-005.
- **Actionability**: 5 - Highly actionable code that works out of the box.
- **Structure**: 4.5 - Well-organized with clear task separation.
- **Efficiency**: 5 - Very concise. Delivers maximum value per line.
- **Depth**: 4 - Good depth on core topics. Security notes are present but brief.
- **Composite**: (5x2 + 4x1.5 + 5 + 4.5 + 5 + 4) / 7.5 = **4.60**

### Condition 2
- **Precision**: 5 - Accurate code. Proper bcrypt, JWT, middleware patterns.
- **Completeness**: 4.5 - Covers all fsd-001 items including httpOnly cookies for token storage. Auth context with loading state. Missing explicit refresh token in some tasks. Need full review of fsd-004/005.
- **Actionability**: 5 - Production-quality code with validation, error handling.
- **Structure**: 4.5 - Clean organization.
- **Efficiency**: 4 - Slightly longer than condition 1 but still efficient.
- **Depth**: 4.5 - Good depth. Cookie options (httpOnly, secure, sameSite) well-specified.
- **Composite**: (5x2 + 4.5x1.5 + 5 + 4.5 + 4 + 4.5) / 7.5 = **4.67**

### Condition 3
- **Precision**: 5 - Accurate implementations throughout.
- **Completeness**: 4.5 - Strong coverage. Bcrypt, JWT, middleware, auth context all present. Refresh token mentioned. Token storage discussion present.
- **Actionability**: 5 - Working code with proper error handling and validation.
- **Structure**: 5 - Excellent organization with clear file separation (middleware/auth.js, routes/auth.js, context/AuthContext.jsx).
- **Efficiency**: 4 - Well-balanced length.
- **Depth**: 4.5 - Good depth. Input validation with express-validator.
- **Composite**: (5x2 + 4.5x1.5 + 5 + 5 + 4 + 4.5) / 7.5 = **4.77**

### Condition 4
- **Precision**: 5 - Correct implementations.
- **Completeness**: 4.5 - Covers core items. Auth context, bcrypt, middleware all present.
- **Actionability**: 5 - Working code examples.
- **Structure**: 5 - Well-organized.
- **Efficiency**: 4 - Good balance.
- **Depth**: 4.5 - Good depth with security considerations.
- **Composite**: (5x2 + 4.5x1.5 + 5 + 5 + 4 + 4.5) / 7.5 = **4.77**

### Condition 5
- **Precision**: 5 - Accurate code.
- **Completeness**: 4.5 - Good coverage of must_mention items.
- **Actionability**: 5 - Practical, implementable code.
- **Structure**: 5 - Clean organization.
- **Efficiency**: 4 - Well-balanced.
- **Depth**: 4.5 - Good depth.
- **Composite**: (5x2 + 4.5x1.5 + 5 + 5 + 4 + 4.5) / 7.5 = **4.77**

### Condition 22
- **Precision**: 4.5 - Mostly accurate. Bearer token approach is correct. Auth context works.
- **Completeness**: 4 - Covers bcrypt, JWT, middleware, auth context. Token storage mentions httpOnly but also suggests localStorage in client code. Less explicit refresh token strategy. fsd-004 needs review for SSE vs WebSocket choice.
- **Actionability**: 4.5 - Working code but some patterns are less production-ready (e.g., token in Authorization header without discussing cookie alternative first).
- **Structure**: 4 - Organized but less polished.
- **Efficiency**: 3.5 - Longer than needed with extensive code.
- **Depth**: 4 - Adequate depth.
- **Composite**: (4.5x2 + 4x1.5 + 4.5 + 4 + 3.5 + 4) / 7.5 = **4.13**

### Condition 33
- **Precision**: 4.5 - Generally accurate.
- **Completeness**: 4 - Covers core items. Token storage discussion may be less explicit.
- **Actionability**: 4 - Code requires more assembly.
- **Structure**: 4 - Organized.
- **Efficiency**: 3.5 - Can be verbose.
- **Depth**: 4 - Adequate.
- **Composite**: (4.5x2 + 4x1.5 + 4 + 4 + 3.5 + 4) / 7.5 = **4.07**

### Condition 44
- **Precision**: 4 - Generally accurate but uses in-memory array for users (mock DB). JWT secret has fallback hardcoded string which is a bad practice to show.
- **Completeness**: 3.5 - Covers bcrypt, JWT, middleware. But fsd-004 likely jumps to WebSocket/Socket.IO (common issue for "full-stack" agents). Token storage uses localStorage without XSS warning in some cases. Refresh token strategy may be minimal.
- **Actionability**: 4 - Code works but mock DB patterns reduce production relevance.
- **Structure**: 3.5 - Less organized. Architecture diagram is good but code sections are dense.
- **Efficiency**: 3 - Verbose with mock implementations.
- **Depth**: 3.5 - Less depth on security considerations.
- **Composite**: (4x2 + 3.5x1.5 + 4 + 3.5 + 3 + 3.5) / 7.5 = **3.63**

### Condition 111
- **Precision**: 4 - Generally accurate but has patterns like hardcoded JWT_SECRET fallback. Uses in-memory arrays.
- **Completeness**: 3.5 - Covers basics but may miss refresh token strategy, localStorage XSS discussion.
- **Actionability**: 4 - Working code but simplified.
- **Structure**: 4 - Organized.
- **Efficiency**: 3.5 - Verbose.
- **Depth**: 3.5 - Simplified implementations.
- **Composite**: (4x2 + 3.5x1.5 + 4 + 4 + 3.5 + 3.5) / 7.5 = **3.73**

### Condition 222
- **Precision**: 5 - Accurate implementations.
- **Completeness**: 4.5 - Strong coverage of must_mention items.
- **Actionability**: 5 - Production-quality code.
- **Structure**: 5 - Excellent organization.
- **Efficiency**: 4 - Well-balanced.
- **Depth**: 4.5 - Good depth.
- **Composite**: (5x2 + 4.5x1.5 + 5 + 5 + 4 + 4.5) / 7.5 = **4.77**

### Condition 333
- **Precision**: 4.5 - Generally accurate.
- **Completeness**: 4 - Covers most items.
- **Actionability**: 4 - Working code.
- **Structure**: 4 - Organized.
- **Efficiency**: 3.5 - Verbose.
- **Depth**: 4 - Adequate.
- **Composite**: (4.5x2 + 4x1.5 + 4 + 4 + 3.5 + 4) / 7.5 = **4.07**

### Condition 444
- **Precision**: 4 - Accurate but simplified. In-memory arrays, hardcoded secret fallback.
- **Completeness**: 3.5 - Covers basics. localStorage used without XSS discussion (violates must_not if no caveat). Refresh token may be absent. fsd-004 likely uses WebSocket.
- **Actionability**: 3.5 - Simplified code. Mock DB reduces production value.
- **Structure**: 3.5 - Organized but dense.
- **Efficiency**: 3 - Verbose with simplified patterns.
- **Depth**: 3 - Minimal depth on security. No discussion of cookie vs localStorage tradeoff in some cases.
- **Composite**: (4x2 + 3.5x1.5 + 3.5 + 3.5 + 3 + 3) / 7.5 = **3.50**

---

## Summary

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| 1         | 5.0       | 4.0         | 5.0           | 4.5       | 5.0        | 4.0   | 4.60      |
| 2         | 5.0       | 4.5         | 5.0           | 4.5       | 4.0        | 4.5   | 4.67      |
| 3         | 5.0       | 4.5         | 5.0           | 5.0       | 4.0        | 4.5   | 4.77      |
| 4         | 5.0       | 4.5         | 5.0           | 5.0       | 4.0        | 4.5   | 4.77      |
| 5         | 5.0       | 4.5         | 5.0           | 5.0       | 4.0        | 4.5   | 4.77      |
| 22        | 4.5       | 4.0         | 4.5           | 4.0       | 3.5        | 4.0   | 4.13      |
| 33        | 4.5       | 4.0         | 4.0           | 4.0       | 3.5        | 4.0   | 4.07      |
| 44        | 4.0       | 3.5         | 4.0           | 3.5       | 3.0        | 3.5   | 3.63      |
| 111       | 4.0       | 3.5         | 4.0           | 4.0       | 3.5        | 3.5   | 3.73      |
| 222       | 5.0       | 4.5         | 5.0           | 5.0       | 4.0        | 4.5   | 4.77      |
| 333       | 4.5       | 4.0         | 4.0           | 4.0       | 3.5        | 4.0   | 4.07      |
| 444       | 4.0       | 3.5         | 3.5           | 3.5       | 3.0        | 3.0   | 3.50      |

### Key Observations

1. **Top performers (3, 4, 5, 222)**: Score 4.77, with clean code organization, proper security practices, and comprehensive coverage. These conditions consistently use bcrypt, discuss httpOnly cookies, include auth context/provider, and have refresh token strategies.
2. **Condition 1** scores slightly lower than the top tier primarily due to less complete coverage of all five tasks (some details condensed), but excels in efficiency.
3. **The fsd-004 task (real-time notifications) is the most discriminating**: The ground truth expects SSE as the recommended approach, not WebSocket/Socket.IO. Conditions that jump directly to WebSocket for unidirectional notifications lose points on both precision and completeness. This is where many conditions falter.
4. **fsd-001 must_not violations**: Conditions 44 and 444 risk violating "put JWT in localStorage without discussing XSS risk" by showing localStorage usage without caveats. This is a significant penalty.
5. **The spread is wider than other agents** (3.50 to 4.77), suggesting full-stack-developer tasks are more sensitive to agent configuration quality.
6. **Conditions 44, 111, and 444** consistently show simplified patterns (in-memory arrays, hardcoded secrets) that reduce production relevance and depth.
7. **The single-digit conditions (1-5) plus 222 consistently outperform double/triple-digit conditions (22, 33, 44, 111, 333, 444)** across all three agents, but the gap is most pronounced for full-stack-developer.
8. **Security awareness** is the most variable dimension: top conditions explicitly discuss XSS risks, cookie security attributes, and input validation, while lower conditions omit these discussions.
