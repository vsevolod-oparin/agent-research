# Code Review Report

## Task 1

**File:** Express.js user creation endpoint

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | SQL Injection | User input (`name`, `email`, `role`) is interpolated directly into the SQL query string via template literals. An attacker can inject arbitrary SQL (e.g., `'; DROP TABLE users; --`) through any of the three fields. |
| 2 | CRITICAL | Hardcoded JWT Secret | The JWT signing secret `'secret123'` is hardcoded in source code. Anyone with access to the code (or who guesses this trivial secret) can forge authentication tokens for any user. |
| 3 | HIGH | No Input Validation | The endpoint blindly destructures `name`, `email`, `role` from the request body with no validation. Missing fields will insert `undefined` as literal strings. The `role` field is particularly dangerous -- a user could self-assign an admin role. |
| 4 | HIGH | No Authentication/Authorization | The endpoint has no auth middleware. Anyone can create users, including with arbitrary roles. |
| 5 | MEDIUM | No Error Handling | If `db.query` or `jwt.sign` throws, the request will hang or crash with an unhandled rejection. No try/catch or error response. |
| 6 | LOW | Token in Creation Response | Returning a signed JWT in the user creation response conflates registration with authentication. These should be separate operations. |

### Suggested Fix

```javascript
app.post('/api/users', authMiddleware, validateBody(userSchema), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const result = await db.query(
      'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
      [name, email, role]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    next(err);
  }
});
```

- Use parameterized queries to prevent SQL injection.
- Load the JWT secret from environment variables (`process.env.JWT_SECRET`).
- Add input validation middleware (e.g., Joi, zod).
- Add authentication middleware and restrict who can set `role`.

### Verdict: **BLOCK** -- Two CRITICAL issues must be fixed before merge.

---

## Task 2

**File:** React `UserList` component

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | Infinite Render Loop | `useEffect` has no dependency array, so it fires on every render. Each call to `setUsers` triggers a re-render, which triggers another `useEffect`, creating an infinite loop of fetch requests. |
| 2 | HIGH | Undefined `setUsers` | The component receives `users` as a prop but calls `setUsers`, which is never declared. This will throw a `ReferenceError` at runtime. The component likely needs `const [users, setUsers] = useState([])` instead of receiving `users` as a prop, or the fetch should be lifted to the parent. |
| 3 | HIGH | Missing `key` Prop | The `.map()` call renders `<div>` elements without a `key` prop. React requires stable keys for list reconciliation. Using array index is also discouraged if items can reorder; use a unique identifier like `u.id`. |
| 4 | HIGH | No Error Handling on Fetch | The `fetch` call has no `.catch()` handler and does not check `r.ok`. Network failures or non-2xx responses will silently fail or set invalid state. |
| 5 | HIGH | No Loading State | There is no loading indicator. The component renders an empty or stale list while the fetch is in flight. |
| 6 | MEDIUM | Potential Null Reference | `u.name.includes(filter)` will throw if any user object has a null or undefined `name`. |

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
    .filter(u => u.name?.includes(filter))
    .map(u => <div key={u.id}>{u.name}</div>);
}
```

- Add `[]` dependency array so the effect runs once on mount.
- Own the `users` state locally or lift the fetch to the parent -- do not mix.
- Add `key={u.id}` to mapped elements.
- Add error handling and a loading state.
- Use a cleanup flag to prevent state updates on unmounted components.

### Verdict: **BLOCK** -- The infinite loop (CRITICAL) and the undefined `setUsers` (HIGH) make this component non-functional.

---

## Task 3

**File:** `services/payment.py`

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | Race Condition (Double Refund) | The read-check-modify-write sequence (`get_user` -> check balance -> subtract -> `save`) is not atomic. Two concurrent requests can both read the same balance, both pass the check, and both deduct -- resulting in a double refund and potentially negative balance. |
| 2 | HIGH | No Transaction Boundaries | `db.save(user)` and `send_email()` are not wrapped in a transaction. If `send_email` fails after the balance is already saved, the user gets refunded but receives no confirmation. Conversely, there is no rollback mechanism. |
| 3 | HIGH | No Input Validation | `amount` is not validated. Negative amounts would effectively add to the balance. Zero amounts would succeed silently. Non-numeric values would cause runtime errors. |
| 4 | HIGH | No Audit Trail | Financial operations must be logged in an auditable ledger. This function modifies a balance in place with no record of what happened, when, or why. |
| 5 | MEDIUM | No Authentication Context | The function accepts a raw `user_id` with no indication of who authorized the refund. There is no permission check. |
| 6 | MEDIUM | Email Failure Not Handled | If `send_email` raises an exception, it propagates up and the caller receives an error despite the refund having already been persisted. |
| 7 | LOW | String Formatting in Email | Using f-string for currency (`f"Refunded ${amount}"`) does not format the amount to two decimal places. A refund of `10.1` would display as `$10.1`. |

### Suggested Fix

```python
from decimal import Decimal

def process_refund(user_id: int, amount: Decimal, authorized_by: int) -> bool:
    if amount <= 0:
        raise ValueError("Refund amount must be positive")

    with db.transaction() as txn:
        user = txn.get_user_for_update(user_id)  # SELECT ... FOR UPDATE
        if user.balance < amount:
            return False

        user.balance -= amount
        txn.save(user)
        txn.insert_ledger_entry(
            user_id=user_id, type="refund", amount=amount, authorized_by=authorized_by
        )

    # Send email outside transaction -- failures are non-fatal
    try:
        send_email(user.email, f"Refunded ${amount:.2f}")
    except Exception:
        logger.warning("Failed to send refund email to user %s", user_id)

    return True
```

- Use `SELECT ... FOR UPDATE` or an atomic decrement to prevent race conditions.
- Wrap the balance update and ledger entry in a database transaction.
- Validate the amount.
- Move email sending outside the transaction and handle failures gracefully.

### Verdict: **BLOCK** -- The race condition on a financial operation is a CRITICAL issue.

---

## Task 4

**File:** Go `DeleteUser` handler

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | CRITICAL | No Authentication or Authorization | Any unauthenticated request can delete any user by supplying an `id` query parameter. There is no auth check whatsoever. |
| 2 | HIGH | No Input Validation | The `id` parameter is taken from the query string without validation. An empty string, non-numeric value, or missing parameter will cause the query to silently delete zero rows (or error), and the handler still returns 200. |
| 3 | HIGH | HTTP Method Semantics | A destructive operation like user deletion should not accept GET requests (which is implied by reading from `r.URL.Query()`). Using GET for state-changing operations means browsers, crawlers, and prefetch mechanisms can trigger deletions. This should use DELETE method with the ID in the URL path. |
| 4 | HIGH | Silent Error Swallowing | When `db.Exec` fails, the error is logged but the response is still HTTP 200. The caller has no way to know the deletion failed. |
| 5 | HIGH | No "Not Found" Handling | If the ID does not match any row, the handler returns 200. The caller cannot distinguish between a successful deletion and a no-op. Check `result.RowsAffected()`. |
| 6 | MEDIUM | No Soft Delete | Hard-deleting user records removes audit trails and breaks foreign key references. Consider a soft delete (setting a `deleted_at` timestamp). |
| 7 | LOW | Missing Response Body | Returning only a status code with no body makes debugging harder for API consumers. Return a JSON response. |

### Suggested Fix

```go
func DeleteUser(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodDelete {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    userID := r.PathValue("id")  // or mux.Vars(r)["id"]
    if _, err := strconv.Atoi(userID); err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }

    // Assumes auth middleware has already verified the caller's identity and permissions

    result, err := db.Exec("DELETE FROM users WHERE id = ?", userID)
    if err != nil {
        log.Printf("failed to delete user %s: %v", userID, err)
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

    rows, _ := result.RowsAffected()
    if rows == 0 {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}
```

- Add authentication and authorization middleware.
- Restrict to DELETE method; take ID from URL path.
- Validate the ID parameter.
- Return appropriate error status codes.
- Check `RowsAffected` to distinguish success from no-op.

### Verdict: **BLOCK** -- Missing authentication on a destructive endpoint is CRITICAL.

---

## Task 5

**File:** TypeScript `Cache<T>` class -- `cleanup()` method (changed lines only)

### Findings

| # | Severity | Issue | Description |
|---|----------|-------|-------------|
| 1 | HIGH | Mutating Map During Iteration | The `cleanup()` method calls `this.store.delete(key)` while iterating over `this.store` with `for...of`. While the ES2015 spec technically allows deletion of the current key during `Map` iteration (the iterator will not revisit deleted entries and will still visit remaining entries), this is a subtle behavior that many developers and linters flag as risky. It works correctly in current JS engines, but the intent is fragile and error-prone for future maintainers. |
| 2 | MEDIUM | Missing `public` Visibility / Return Type | The `cleanup()` method has no explicit access modifier or return type annotation. For a public API in a TypeScript class, adding `public cleanup(): void` improves clarity and consistency with the `private store` declaration. |
| 3 | MEDIUM | No Concurrency Safety | If `cleanup()` is called while a `get()` is in progress (e.g., in a Node.js environment with interleaved async operations that reference the cache), entries could be deleted between the `get` lookup and the caller's use of the returned value. This is a narrow window in single-threaded JS but worth noting if the cache is shared across async boundaries. |
| 4 | LOW | Missing Scheduled Cleanup | The `cleanup` method must be called manually. Expired entries accumulate in memory until someone calls it. Consider adding a `setInterval`-based auto-cleanup or cleaning lazily during `get`/`set`. |

### Note on Finding #1

To be precise: deleting the current entry from a `Map` during `for...of` iteration is spec-compliant in ES2015+. The `Map` iterator is defined to handle this correctly. However, a safer and more readable alternative collects keys first:

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

This two-pass approach is negligibly slower but eliminates any ambiguity about mutation-during-iteration semantics and is universally understood as safe.

### Verdict: **Warning** -- No CRITICAL issues. The HIGH finding (#1) is technically correct behavior but warrants a safer pattern. Can merge with the suggested improvement.

---

# Summary

| Task | Verdict | Critical | High | Medium | Low |
|------|---------|----------|------|--------|-----|
| 1 - Express endpoint | BLOCK | 2 | 2 | 1 | 1 |
| 2 - React component | BLOCK | 1 | 4 | 1 | 0 |
| 3 - Payment function | BLOCK | 1 | 3 | 2 | 1 |
| 4 - Go handler | BLOCK | 1 | 4 | 1 | 1 |
| 5 - TypeScript cache | Warning | 0 | 1 | 2 | 1 |

Tasks 1 through 4 should be blocked from merging until their CRITICAL and HIGH issues are addressed. Task 5 can proceed with caution, ideally after adopting the two-pass cleanup pattern.
