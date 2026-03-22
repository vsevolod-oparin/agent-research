# Code Review Report

## Task 1

**File:** Express.js `/api/users` endpoint

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | SQL Injection | User input (`name`, `email`, `role`) is interpolated directly into the SQL string via template literals. An attacker can inject arbitrary SQL (e.g., `'; DROP TABLE users; --`) through any of the three fields. |
| 2 | CRITICAL | Hardcoded JWT Secret | The JWT signing secret `'secret123'` is hardcoded in source code. Anyone who reads the source (or guesses the trivial secret) can forge valid tokens for any user, bypassing authentication entirely. |
| 3 | HIGH | No Input Validation | The endpoint blindly trusts `req.body`. There is no validation of `name`, `email`, or `role`. A malicious client can set `role` to `"admin"` or supply empty/malformed values. |
| 4 | HIGH | No Authentication/Authorization | The endpoint appears to allow anyone to create a user with any role. There is no auth middleware protecting this route. |
| 5 | MEDIUM | No Error Handling | If `db.query` throws, the error propagates as an unhandled rejection. The client receives a generic 500 with potentially leaked stack traces. |
| 6 | LOW | Token Returned on Creation | Returning a signed JWT immediately on user creation means the account is authenticated before any email verification or approval step. |

### Recommendations

**Fix SQL Injection (CRITICAL):**
```javascript
const query = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
const result = await db.query(query, [name, email, role]);
```

**Fix Hardcoded Secret (CRITICAL):**
```javascript
const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });
```
Store the secret in environment variables or a secrets manager. Never commit it to source.

**Add Input Validation (HIGH):**
Use a schema validation library (e.g., `zod`, `joi`) to enforce type, format, and allowed values for `role`.

**Add Error Handling (MEDIUM):**
Wrap in try/catch, return appropriate status codes, and avoid leaking internal error details to the client.

### Verdict: **BLOCK** -- 2 CRITICAL issues must be fixed before merge.

---

## Task 2

**File:** React `UserList` component

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | Infinite Re-render Loop | `useEffect` has no dependency array, so it runs after every render. Each call to `setUsers` triggers a re-render, which triggers the effect again, creating an infinite loop of fetch requests. |
| 2 | HIGH | Undefined `setUsers` | The component receives `users` as a prop but calls `setUsers`, which is never declared. This will throw a `ReferenceError` at runtime. The component likely needs `const [users, setUsers] = useState([])` instead of receiving `users` as a prop. |
| 3 | HIGH | Missing `key` Prop | The `.map()` renders `<div>` elements without a `key` prop. This causes React reconciliation issues, especially if the list is filtered or reordered. |
| 4 | HIGH | No Error Handling on Fetch | The `fetch` call has no `.catch()` handler. A network failure will produce an unhandled promise rejection. There is also no loading state shown to the user. |
| 5 | MEDIUM | Potential Null Reference | `u.name.includes(filter)` will throw if `u.name` is `null` or `undefined`. |
| 6 | LOW | Missing Loading/Error UI | No visual feedback while data is loading or if the request fails. |

### Recommendations

**Fix the infinite loop and state ownership (CRITICAL + HIGH):**
```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .catch(setError);
  }, []); // empty dependency array -- run once on mount

  if (error) return <div>Failed to load users.</div>;

  return users
    .filter(u => u.name?.includes(filter))
    .map(u => <div key={u.id}>{u.name}</div>);
}
```

### Verdict: **BLOCK** -- 1 CRITICAL issue (infinite loop) and multiple HIGH issues.

---

## Task 3

**File:** `services/payment.py`

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | Race Condition (Double Refund) | The read-check-modify-save sequence is not atomic. Two concurrent requests for the same user can both read the same balance, both pass the check, and both deduct -- resulting in a double refund and a negative balance. |
| 2 | HIGH | No Transaction Boundary | The balance update and email send are not wrapped in a transaction. If `db.save()` succeeds but `send_email()` fails, the refund is applied but the user is not notified. Conversely, if `send_email()` succeeds but a later step fails, the user is told they were refunded when they were not. |
| 3 | HIGH | No Input Validation | `amount` is not validated. Negative values, zero, or extremely large values are accepted. A negative `amount` would increase the balance (reverse refund). |
| 4 | HIGH | No Audit Trail | Financial operations should be logged to an audit table with timestamps, transaction IDs, and the initiating actor. There is no record of this refund beyond the balance change. |
| 5 | MEDIUM | No Authorization Check | The function does not verify that the caller is authorized to issue a refund for this user. Any code path that calls `process_refund` can refund any user. |
| 6 | MEDIUM | Silent Failure | Returning `False` for insufficient balance gives the caller no information about why the refund failed. |

### Recommendations

**Fix Race Condition (CRITICAL):**
Use an atomic database operation with optimistic locking or `UPDATE ... WHERE balance >= amount`:
```python
def process_refund(user_id, amount):
    if amount <= 0:
        raise ValueError("Refund amount must be positive")

    with db.transaction():
        rows_updated = db.execute(
            "UPDATE users SET balance = balance - %s WHERE id = %s AND balance >= %s",
            (amount, user_id, amount)
        )
        if rows_updated == 0:
            raise InsufficientBalanceError(user_id)

        db.execute(
            "INSERT INTO refund_log (user_id, amount, created_at) VALUES (%s, %s, NOW())",
            (user_id, amount)
        )

    # Send email outside transaction -- idempotent or queued
    send_email_async(user.email, f"Refunded ${amount}")
```

### Verdict: **BLOCK** -- 1 CRITICAL race condition in a payment path. Must fix before merge.

---

## Task 4

**File:** Go `DeleteUser` handler

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | No Authentication or Authorization | Any unauthenticated client can delete any user by providing an `id` query parameter. This is a complete auth bypass on a destructive operation. |
| 2 | HIGH | Wrong HTTP Method Semantics | A DELETE operation is exposed without enforcing the HTTP method. If the router does not restrict this to DELETE, a GET request (e.g., from a browser link or crawler) could trigger user deletion. The `id` in query params also makes it linkable/cacheable. |
| 3 | HIGH | Silent Success on Error | When `db.Exec` fails, the error is logged but the handler still returns HTTP 200. The client believes the deletion succeeded when it did not. |
| 4 | HIGH | No Input Validation | The `id` parameter is used as-is. While the parameterized query prevents SQL injection, there is no check that `id` is a valid format (e.g., numeric, UUID). An empty string is silently accepted. |
| 5 | MEDIUM | No Confirmation of Deletion | The handler does not check `result.RowsAffected()` to confirm a row was actually deleted. Deleting a non-existent user returns 200 with no indication. |
| 6 | MEDIUM | No Soft Delete | Hard-deleting user records may violate data retention policies and makes recovery impossible. Consider a soft delete (`deleted_at` timestamp). |
| 7 | LOW | No Response Body | Returning only a status code with no body makes debugging harder for API consumers. |

### Recommendations

**Add Auth Middleware (CRITICAL):**
```go
func DeleteUser(w http.ResponseWriter, r *http.Request) {
    user := auth.MustGetUser(r.Context()) // middleware-injected
    if !user.HasPermission("admin") {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }
    // ...
}
```

**Fix Silent Success (HIGH):**
```go
result, err := db.Exec("DELETE FROM users WHERE id = ?", id)
if err != nil {
    log.Println(err)
    http.Error(w, "Internal server error", http.StatusInternalServerError)
    return
}
rows, _ := result.RowsAffected()
if rows == 0 {
    http.Error(w, "User not found", http.StatusNotFound)
    return
}
w.WriteHeader(http.StatusNoContent)
```

**Note:** The use of parameterized queries (`?`) is good -- SQL injection is not an issue here.

### Verdict: **BLOCK** -- 1 CRITICAL auth bypass on a destructive endpoint.

---

## Task 5

**File:** TypeScript `Cache<T>` class -- `cleanup()` method

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | MEDIUM | Deleting from Map During Iteration | The `cleanup()` method calls `this.store.delete(key)` while iterating over `this.store` with `for...of`. In JavaScript/TypeScript, this is technically safe per the ES2015 spec -- `Map` iteration handles same-iteration deletes correctly. However, this pattern is surprising to many developers and can cause bugs if the code is later refactored to use a different data structure. A comment documenting this intentional reliance on the spec would improve maintainability. |
| 2 | LOW | Missing `public` Visibility Modifier | The `cleanup()` method has no explicit access modifier. TypeScript defaults to `public`, but the class uses explicit `private` on `store`. The inconsistency reduces readability. |
| 3 | LOW | No Return Type Annotation | `cleanup()` lacks a return type annotation. Should be `cleanup(): void`. |
| 4 | LOW | No Automatic Cleanup Trigger | Expired entries are only removed when `cleanup()` is explicitly called. There is no mechanism (e.g., periodic timer, cleanup-on-get) to prevent unbounded memory growth if `cleanup()` is never called. |

### Recommendations

**Clarify the deletion-during-iteration pattern (MEDIUM):**
If the team prefers defensive coding, collect keys first:
```typescript
cleanup(): void {
  const now = Date.now();
  const expired: string[] = [];
  for (const [key, entry] of this.store) {
    if (entry.expiry < now) expired.push(key);
  }
  for (const key of expired) this.store.delete(key);
}
```
Alternatively, keep the current approach with a comment:
```typescript
// Safe: Map spec guarantees delete-during-iteration works correctly
```

**Consider lazy cleanup (LOW):**
Add cleanup-on-read or a periodic timer to prevent memory leaks in long-lived caches.

### Verdict: **Approve** -- No CRITICAL or HIGH issues. The MEDIUM finding is a maintainability concern, not a bug. The code is functionally correct.

---

# Summary

| Task | Verdict | CRITICAL | HIGH | MEDIUM | LOW |
|------|---------|----------|------|--------|-----|
| 1 - Express.js endpoint | BLOCK | 2 | 2 | 1 | 1 |
| 2 - React component | BLOCK | 1 | 3 | 1 | 1 |
| 3 - Python payment | BLOCK | 1 | 3 | 2 | 0 |
| 4 - Go handler | BLOCK | 1 | 3 | 2 | 1 |
| 5 - TypeScript Cache | APPROVE | 0 | 0 | 1 | 3 |

Tasks 1-4 all contain CRITICAL issues that must be resolved before merging. Task 5 is safe to merge as-is, with optional improvements.
