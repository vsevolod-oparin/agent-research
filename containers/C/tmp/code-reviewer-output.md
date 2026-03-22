# Code Review Report

---

## Task 1

**File:** Express.js user creation endpoint

```javascript
app.post('/api/users', async (req, res) => {
  const { name, email, role } = req.body;
  const query = `INSERT INTO users (name, email, role) VALUES ('${name}', '${email}', '${role}')`;
  const result = await db.query(query);
  res.json({ id: result.insertId, token: jwt.sign({ id: result.insertId }, 'secret123') });
});
```

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | SQL Injection | User input is directly interpolated into the SQL query string via template literals. An attacker can inject arbitrary SQL (e.g., `'; DROP TABLE users; --`) through `name`, `email`, or `role`. |
| 2 | CRITICAL | Hardcoded JWT Secret | The JWT signing secret `'secret123'` is hardcoded in source. Anyone with access to the code can forge valid tokens for any user. This must be loaded from an environment variable or secret manager. |
| 3 | HIGH | No Input Validation | `name`, `email`, and `role` are destructured from `req.body` with no validation. Missing fields will insert the string `'undefined'` into the database. `role` should be validated against an allowlist to prevent privilege escalation (e.g., a user setting `role` to `admin`). |
| 4 | HIGH | No Error Handling | If `db.query` or `jwt.sign` throws, the async handler has no try/catch. Express will not handle the rejected promise by default (pre-Express 5), resulting in an unhandled rejection and the client hanging or receiving a raw error. |
| 5 | HIGH | Token Returned on Creation | Returning a JWT immediately on user creation means there is no email verification or secondary authentication step. This allows automated account creation with immediate authenticated access. |
| 6 | MEDIUM | No Authentication/Authorization | The endpoint has no middleware to restrict who can create users. Depending on the application, this may allow unauthenticated mass user creation. |

### Suggested Fix

```javascript
app.post('/api/users', validate(userCreateSchema), async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    if (!['user', 'editor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const result = await db.query(
      'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
      [name, email, role]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
});
```

Key changes: parameterized query, input validation, role allowlist, error handling, JWT secret moved to config, token issuance separated from creation.

### Verdict: **BLOCK** -- Two CRITICAL issues (SQL injection, hardcoded secret) must be resolved before merge.

---

## Task 2

**File:** React `UserList` component

```jsx
function UserList({ users }) {
  const [filter, setFilter] = useState('');
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  });
  return users.filter(u => u.name.includes(filter)).map(u => <div>{u.name}</div>);
}
```

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | Infinite Re-render Loop | `useEffect` has no dependency array. It runs after every render, calls `setUsers` (which is undefined -- see #2), and if it were defined would trigger a re-render, which triggers the effect again. This creates an infinite loop of fetch requests, potentially DDoS-ing your own API. |
| 2 | HIGH | `setUsers` Is Undefined | The component declares `useState` for `filter` but never declares a `users` state. `setUsers` is called inside the effect but is never defined. `users` comes from props, not local state. This will throw a `ReferenceError` at runtime. |
| 3 | HIGH | Missing `key` Prop | The `.map()` renders `<div>` elements without a `key` prop. This causes React reconciliation issues -- incorrect DOM reuse when the list changes, stale UI, and a console warning. |
| 4 | HIGH | No Loading or Error State | The fetch has no `.catch()` handler. A network failure silently swallows the error. There is no loading indicator while data is being fetched. |
| 5 | MEDIUM | No Response Status Check | `fetch` does not reject on HTTP error statuses (4xx, 5xx). The `.then(r => r.json())` will attempt to parse an error response body, likely producing confusing failures. |
| 6 | LOW | Potential Null Reference | If `users` is undefined or null (before data loads, or if prop is missing), `users.filter()` will throw a TypeError. |

### Suggested Fix

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/users')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => { if (!cancelled) setUsers(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return users
    .filter(u => u.name.includes(filter))
    .map(u => <div key={u.id}>{u.name}</div>);
}
```

Key changes: empty dependency array, local users state, key prop, error/loading states, cleanup on unmount, response status check.

### Verdict: **BLOCK** -- The infinite loop (CRITICAL) and undefined `setUsers` (HIGH) make this component non-functional.

---

## Task 3

**File:** `services/payment.py` -- `process_refund`

```python
def process_refund(user_id, amount):
    user = db.get_user(user_id)
    if user.balance >= amount:
        user.balance -= amount
        db.save(user)
        send_email(user.email, f"Refunded ${amount}")
        return True
    return False
```

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | Race Condition (Double Refund) | There is no transaction or row-level lock around the read-modify-write cycle. Two concurrent refund requests can both read the same balance, both pass the check, and both deduct -- resulting in a negative balance and double the money refunded. This is a classic TOCTOU (time-of-check-to-time-of-use) bug in a financial operation. |
| 2 | HIGH | No Input Validation | `amount` is not validated. Negative amounts would increase the balance (`balance -= -50` adds 50). Zero amounts would succeed silently. Non-numeric types could cause runtime errors. `user_id` is not validated either. |
| 3 | HIGH | No Atomicity Between Save and Email | If `db.save(user)` succeeds but `send_email` throws, the refund is processed but the user is never notified. Conversely, there is no mechanism to retry the email. These should be decoupled (e.g., emit an event or use a task queue for the email). |
| 4 | HIGH | No Audit Trail | A financial operation like a refund has no logging, no transaction record, and no audit entry. There is no way to trace what happened, which is both a compliance issue and a debugging problem. |
| 5 | MEDIUM | Boolean Return Provides No Context | Returning `True`/`False` gives the caller no way to distinguish between "insufficient balance" and other potential failure modes. A result object or specific exceptions would be more informative. |
| 6 | MEDIUM | Floating-Point Risk | If `amount` and `balance` are floats, arithmetic will produce rounding errors (e.g., `0.1 + 0.2 != 0.3`). Financial calculations should use `Decimal` or integer cents. |

### Suggested Fix

```python
from decimal import Decimal

def process_refund(user_id: int, amount: Decimal) -> RefundResult:
    if amount <= 0:
        raise ValueError("Refund amount must be positive")

    with db.transaction():
        user = db.get_user_for_update(user_id)  # SELECT ... FOR UPDATE
        if user.balance < amount:
            return RefundResult(success=False, reason="insufficient_balance")

        user.balance -= amount
        db.save(user)
        refund_record = db.create_refund_record(user_id, amount)
        logger.info("Refund processed", user_id=user_id, amount=amount, refund_id=refund_record.id)

    # Email outside transaction -- use a queue for reliability
    refund_email_queue.enqueue(user.email, amount, refund_record.id)
    return RefundResult(success=True, refund_id=refund_record.id)
```

Key changes: database transaction with row lock, input validation, Decimal type, audit record, structured logging, email via queue, descriptive result object.

### Verdict: **BLOCK** -- The race condition (CRITICAL) in a financial function can cause direct monetary loss.

---

## Task 4

**File:** Go `DeleteUser` handler

```go
func DeleteUser(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    _, err := db.Exec("DELETE FROM users WHERE id = ?", id)
    if err != nil {
        log.Println(err)
    }
    w.WriteHeader(200)
}
```

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | No Authentication or Authorization | There is no check that the caller is authenticated or authorized to delete users. Any unauthenticated request with a valid user ID will delete that user. User deletion is a destructive, irreversible operation. |
| 2 | CRITICAL | Uses GET Query Parameter for Destructive Action | The user ID comes from a query string parameter, suggesting this may be accessible via GET (or at minimum, the ID is in the URL). Destructive operations should use DELETE or POST methods and should not be triggered by URL parameters alone, as they are vulnerable to CSRF via image tags, link prefetching, and browser history exposure. |
| 3 | HIGH | Error Silently Swallowed | When `db.Exec` fails, the error is logged but the handler still returns HTTP 200 to the client. The caller believes the deletion succeeded when it did not. |
| 4 | HIGH | No Input Validation | `id` is not validated. An empty string (missing parameter) will execute `DELETE FROM users WHERE id = ''`, which may match zero rows or behave unexpectedly depending on the database and column type. There is no check that `id` is a valid integer/UUID. |
| 5 | HIGH | No Method Check | The handler does not verify `r.Method`. It will execute on GET, POST, PUT, or any HTTP method, making the destructive operation easier to trigger accidentally. |
| 6 | MEDIUM | No Confirmation of Effect | The handler does not check `result.RowsAffected()` to confirm a row was actually deleted. If the ID does not exist, the client still receives 200 OK with no indication that nothing happened. |
| 7 | LOW | Logging May Be Insufficient | `log.Println(err)` provides minimal context. Including the request ID, user ID, and caller information would aid debugging. |

### Suggested Fix

```go
func DeleteUser(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodDelete {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    // Auth middleware should populate this; verify here as defense-in-depth
    callerID := r.Context().Value(authedUserKey)
    if callerID == nil || !hasPermission(callerID, "delete_user") {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

    id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "Missing id parameter", http.StatusBadRequest)
        return
    }
    if _, err := strconv.Atoi(id); err != nil {
        http.Error(w, "Invalid id", http.StatusBadRequest)
        return
    }

    result, err := db.Exec("DELETE FROM users WHERE id = ?", id)
    if err != nil {
        log.Printf("DeleteUser failed for id=%s: %v", id, err)
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

    rows, _ := result.RowsAffected()
    if rows == 0 {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}
```

Key changes: method check, authentication/authorization, input validation, proper error responses, rows affected check, 204 No Content on success.

### Verdict: **BLOCK** -- Missing authentication on a destructive endpoint (CRITICAL) and CSRF exposure (CRITICAL) must be fixed.

---

## Task 5

**File:** TypeScript `Cache<T>` class -- `cleanup()` method (changed lines only)

```typescript
cleanup() {
  const now = Date.now();
  for (const [key, entry] of this.store) {
    if (entry.expiry < now) this.store.delete(key);
  }
}
```

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | HIGH | Deleting Map Entries During Iteration | The code deletes entries from `this.store` while iterating over it with `for...of`. Per the ECMAScript specification, this is technically safe for `Map` -- the spec guarantees that deleting the current entry during iteration does not cause skipped entries or errors. **However**, this is a well-known source of confusion and bugs during maintenance. A future developer might refactor this to use a different data structure (e.g., a plain object) where deletion during iteration is unsafe. The pattern should be made explicitly safe. |
| 2 | MEDIUM | Missing Access Modifier | `cleanup()` has no access modifier (`public`/`private`). In the context of this class, `get` also lacks modifiers, so this is consistent with the existing style. However, `cleanup` and `get` should both be `public` explicitly for clarity. |
| 3 | LOW | No Return Type Annotation | The method lacks an explicit return type (`: void`). Minor, but adds clarity for a public API. |

### Suggested Fix

```typescript
public cleanup(): void {
  const now = Date.now();
  const expired: string[] = [];
  for (const [key, entry] of this.store) {
    if (entry.expiry < now) expired.push(key);
  }
  for (const key of expired) {
    this.store.delete(key);
  }
}
```

The two-pass approach (collect keys, then delete) eliminates any ambiguity about mutation during iteration and is the conventional pattern. The performance difference is negligible for typical cache sizes.

**Note:** The existing `get()` method correctly handles expired entries by returning `undefined`, so a lazy-expiry approach is already in place. The `cleanup()` method provides batch eviction, which is complementary. No issues with the interaction between the two.

### Verdict: **WARNING** -- The Map deletion-during-iteration pattern (HIGH) is technically correct per spec but fragile. Recommend the two-pass fix before merge, but this is not a blocker.

---

## Summary

| Task | Verdict | Critical | High | Medium | Low |
|------|---------|----------|------|--------|-----|
| 1 - Express.js endpoint | BLOCK | 2 | 3 | 1 | 0 |
| 2 - React component | BLOCK | 1 | 3 | 1 | 1 |
| 3 - Python refund | BLOCK | 1 | 3 | 2 | 0 |
| 4 - Go delete handler | BLOCK | 2 | 3 | 1 | 1 |
| 5 - TypeScript cache | WARNING | 0 | 1 | 1 | 1 |

**Overall:** 4 out of 5 code snippets contain CRITICAL issues that must be fixed before merge. The most dangerous patterns found are SQL injection (Task 1), a financial race condition (Task 3), and missing authentication on a destructive endpoint (Task 4).
