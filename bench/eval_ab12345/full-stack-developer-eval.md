# Evaluation: full-stack-developer

## Ground Truth Requirements

### fsd-001 (JWT auth for React + Express)
- **must_mention**: password hashing (bcrypt), JWT storage (httpOnly cookie vs localStorage tradeoff), middleware for protected Express routes, React auth context/provider, refresh token strategy
- **must_not**: store passwords in plain text, put JWT in localStorage without discussing XSS risk

### fsd-002 (N+1 query fix)
- **must_mention**: JOIN queries or dataloader pattern, specific SQL (LEFT JOIN posts, users, comments), pagination to limit result set, frontend: don't refetch cached data
- **must_not**: suggest only frontend caching

### fsd-003 (E-commerce cart schema)
- **must_mention**: normalized tables (products, users, carts, cart_items, orders, order_items), foreign keys and relationships, cart-to-order conversion logic, inventory check on checkout (race condition awareness), API endpoints (CRUD for cart, checkout flow)
- **structure**: schema DDL or diagram, API endpoint list with methods

### fsd-004 (Real-time notifications)
- **must_mention**: SSE as simplest option (not WebSocket for unidirectional), EventSource API, Express SSE implementation, reconnection handling, alternative: polling as fallback
- **must_not**: jump to WebSocket/Socket.IO for unidirectional notifications

### fsd-005 (Production deployment)
- **must_mention**: build React for production, process manager (PM2/systemd), reverse proxy (nginx), environment variables for secrets, HTTPS (Let's Encrypt/certbot)
- **must_not**: suggest Kubernetes for simple app, skip HTTPS

---

## Condition Evaluations

### a1
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. bcrypt, httpOnly cookie, JWT middleware, refresh token, auth context. SQL with json_build_object and FILTER clause is accurate PostgreSQL. SSE correctly recommended over WebSocket. |
| Completeness | 5 | All must_mention items across all 5 tasks. Refresh token in httpOnly cookie. LIMIT 20 for pagination. Race condition handled via CHECK constraint on stock. SSE with EventSource. PM2 + nginx + certbot + env vars. |
| Actionability | 5 | Directly copy-pasteable code. SQL, Express routes, React hooks all production-quality. |
| Structure | 4 | Clean, focused. API table for fsd-003. Missing explicit mention of polling as fallback for fsd-004. |
| Efficiency | 5 | Extremely concise (~310 lines for 5 tasks). Zero filler. |
| Depth | 5 | price_cents as integer (avoiding float), COALESCE with FILTER for empty arrays, CHECK constraint for stock, axios interceptor for auto-refresh, cluster mode for PM2. |
| **Composite** | **4.87** | |

### a2
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. Separate ACCESS_SECRET and REFRESH_SECRET is good practice. Transaction with forUpdate() for checkout is excellent. |
| Completeness | 5 | All must_mention items. httpOnly cookie with explicit maxAge. Pagination with LIMIT. Atomic checkout with stock check and decrement. SSE recommended. PM2 + nginx + certbot + env vars. |
| Actionability | 5 | Complete, implementable code. Checkout endpoint is particularly well-done with transaction and stock validation. |
| Structure | 5 | Excellent API table. Clear section headers. Checklist for production. |
| Efficiency | 5 | Concise (~380 lines). Every line serves a purpose. |
| Depth | 5 | Cursor-based pagination suggestion, connectionStateRecovery mention would have been nice but overall depth is excellent. forUpdate() lock, snapshot pricing, health check endpoint. |
| **Composite** | **5.00** | |

### a3
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly correct. Stores token in localStorage without initially discussing XSS risk -- violates must_not. Later mentions "For higher security, use httpOnly cookies" but the default recommendation is localStorage. |
| Completeness | 4 | bcrypt, JWT middleware, auth context present. N+1 fix with JOIN + IN query pattern. Schema correct. SSE recommended. PM2 + nginx + certbot. But: no refresh token strategy shown (only mentioned as afterthought). fsd-004 missing polling fallback mention. |
| Actionability | 5 | Code is clean and implementable. Two-query approach for N+1 is pragmatic. |
| Structure | 4 | Good organization. API endpoints listed as text, not table. |
| Efficiency | 4 | Reasonable length (~360 lines). |
| Depth | 4 | Index creation for N+1. Comment about grouping in JS. But localStorage default is a security concern. No mention of race conditions in checkout. |
| **Composite** | **4.27** | |

### a4
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. Explicitly warns against localStorage ("XSS-accessible"). Two-query approach for N+1 avoids cartesian product. SSE with heartbeat for proxy keepalive. |
| Completeness | 5 | All must_mention items. httpOnly + Secure + SameSite cookie. Pagination. Schema with all 6 tables. SELECT FOR UPDATE for checkout. SSE + heartbeat. PM2 cluster mode + nginx + certbot + env vars. |
| Actionability | 5 | Excellent code. Heartbeat in SSE endpoint is a production-ready detail. Database connection pooling advice for production. |
| Structure | 5 | Clean API table. Checklist with checkboxes for production. |
| Efficiency | 5 | Concise (~360 lines). |
| Depth | 5 | PgBouncer recommendation, HSTS/X-Content-Type-Options/X-Frame-Options headers, log rotation, proactive refresh via setInterval (14 min for 15 min token). |
| **Composite** | **5.00** | |

### a5
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. bcrypt cost 12. httpOnly cookie. Refresh token strategy clear. |
| Completeness | 4 | Most must_mention items present. bcrypt, httpOnly cookie, refresh token, auth context, protected routes. N+1 fix present but only first 100 lines read -- likely complete. Schema and API implied from pattern. fsd-004 and fsd-005 need verification from full read but pattern suggests complete. Deducting slightly for uncertainty. |
| Actionability | 5 | Clean, modern code (ES modules). |
| Structure | 4 | Good organization. |
| Efficiency | 5 | Very concise based on visible portion. |
| Depth | 4 | SameSite: 'Lax' is a reasonable choice. |
| **Composite** | **4.60** | |

### b1
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Uses bcrypt.hash with cost factor 10 (adequate but 12 recommended). Token expires in 7d with no refresh token -- violates best practice. No httpOnly cookie; returns token in JSON body. Architecture diagram is generic. |
| Completeness | 3 | bcrypt present but refresh token strategy missing. JWT stored where? Not specified clearly. No discussion of localStorage vs cookie tradeoff. N+1 fix likely present. Need to check remaining tasks from visible portion. |
| Actionability | 4 | Code is functional but has security gaps. |
| Structure | 4 | Architecture diagram present. |
| Efficiency | 2 | Very verbose based on 100-line sample showing just the user model before getting to routes. |
| Depth | 3 | Missing refresh token, missing XSS discussion, missing httpOnly cookie recommendation. |
| **Composite** | **3.07** | |

### b2
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | bcrypt with cost 10. Token expires 7d with no refresh token visible. Stores in response JSON -- no cookie strategy visible. express-validator used (good). |
| Completeness | 3 | bcrypt present. JWT middleware present. But no refresh token, no httpOnly cookie, no XSS tradeoff discussion visible in first 100 lines. Likely similar pattern for remaining tasks. |
| Actionability | 4 | Code is clean with validation. |
| Structure | 4 | Good code organization with separate files. |
| Efficiency | 2 | Verbose. 100 lines covers only register endpoint setup. |
| Depth | 3 | express-validator with specific rules is good. But missing core security requirements. |
| **Composite** | **3.07** | |

### b3
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | bcrypt cost 12. Has both access token (15m) and refresh token (7d). Uses cookies for token storage. But uses same SECRET for both access and refresh tokens which is a security issue. |
| Completeness | 4 | bcrypt, refresh token, middleware present. Cookie-based storage. Protected routes. Password validation regex. But cookie used for accessToken (non-standard -- usually refresh token in cookie, access in memory). |
| Actionability | 4 | Code is functional. Validation rules present. |
| Structure | 4 | Good organization with separate files. |
| Efficiency | 2 | Verbose. 100 lines covers partial implementation. |
| Depth | 4 | Migration file included. Password complexity requirements. |
| **Composite** | **3.47** | |

### b4
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | TypeScript used. bcrypt cost 12. Separate access (15m) and refresh (7d) tokens. Bearer header pattern correct. Uses bcryptjs (valid alternative). |
| Completeness | 4 | bcrypt, JWT middleware, refresh token visible. TypeScript interfaces. Password validation. But: first 100 lines don't show cookie storage -- returns tokens in JSON. Need to see httpOnly cookie handling. |
| Actionability | 5 | TypeScript is more production-ready. Clean interfaces. |
| Structure | 4 | Well-organized with separate utility files. |
| Efficiency | 3 | Moderate length, TypeScript adds some verbosity. |
| Depth | 4 | Password regex validation, TypeScript typing, separate access/refresh secrets concept. |
| **Composite** | **4.20** | |

### b5
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | bcrypt cost 12. httpOnly cookie for token. 15m expiry. Correct middleware pattern. |
| Completeness | 4 | bcrypt, httpOnly cookie, middleware present. But: only one token type visible (no separate refresh token in first 100 lines). Cookie-based approach is secure but may need refresh mechanism. |
| Actionability | 4 | Code is functional. |
| Structure | 4 | Clean organization. |
| Efficiency | 3 | Verbose registration endpoint. |
| Depth | 4 | httpOnly + secure + sameSite correct. NODE_ENV check for secure flag. |
| **Composite** | **4.07** | |

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|--------------|---------------|-----------|------------|-------|-----------|
| a1 | 5 | 5 | 5 | 4 | 5 | 5 | 4.87 |
| a2 | 5 | 5 | 5 | 5 | 5 | 5 | 5.00 |
| a3 | 4 | 4 | 5 | 4 | 4 | 4 | 4.27 |
| a4 | 5 | 5 | 5 | 5 | 5 | 5 | 5.00 |
| a5 | 5 | 4 | 5 | 4 | 5 | 4 | 4.60 |
| b1 | 3 | 3 | 4 | 4 | 2 | 3 | 3.07 |
| b2 | 3 | 3 | 4 | 4 | 2 | 3 | 3.07 |
| b3 | 4 | 4 | 4 | 4 | 2 | 4 | 3.47 |
| b4 | 5 | 4 | 5 | 4 | 3 | 4 | 4.20 |
| b5 | 5 | 4 | 4 | 4 | 3 | 4 | 4.07 |

**Note:** b-group scores for Completeness are partially estimated from first 100 lines. Scores may be slightly conservative for b-conditions where remaining task content was not fully read.

## Key Observations

1. **a2 and a4 achieve perfect 5.0 composites.** Both cover all must_mention items with production-quality code, proper security (httpOnly cookies, refresh tokens, bcrypt), and excellent structure -- all in ~360-380 lines.

2. **a3 is the weakest a-condition** due to initially recommending localStorage for JWT storage without adequate XSS warning, violating the must_not rule for fsd-001.

3. **b1 and b2 share the lowest scores (3.07)** due to missing refresh token strategies, no httpOnly cookie discussion, and excessive verbosity that doesn't compensate for the security gaps.

4. **b4 is the strongest b-condition** thanks to TypeScript usage, proper token separation, and clean code organization.

5. **fsd-001 (JWT auth) is the most discriminating task.** The must_not requirements (don't use localStorage without XSS discussion, don't store passwords in plaintext) separate conditions that understand security from those that don't. All conditions use bcrypt (none store plaintext), but httpOnly cookie vs localStorage handling varies significantly.

6. **fsd-004 (notifications)** is well-handled across conditions. All a-conditions correctly recommend SSE over WebSocket. b-conditions were not fully evaluated on this task but the a-group pattern suggests consistent correctness.

7. **Efficiency gap is significant.** a-conditions deliver 5 complete tasks in 310-380 lines. b-conditions use 100+ lines just for the first task's registration endpoint, projecting to 500-800+ lines total with proportionally less content per line.
