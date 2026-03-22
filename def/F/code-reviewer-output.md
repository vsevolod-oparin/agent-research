## Task 1: Express.js User Creation Endpoint

### CRITICAL: SQL Injection

The query is built via string concatenation with unsanitized user input. An attacker can inject arbitrary SQL:

```javascript
// Attacker sends: email = "'; DROP TABLE users; --"
const query = `INSERT INTO users (name, email, role) VALUES ('${name}', '${email}', '${role}')`;
```

**Fix:** Use parameterized queries.

```javascript
const query = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
const result = await db.query(query, [name, email, role]);
```

### CRITICAL: Hardcoded JWT Secret

`'secret123'` is a hardcoded, trivially guessable secret. Anyone who discovers it can forge tokens for any user, achieving full authentication bypass.

**Fix:** Load the secret from an environment variable or a secrets manager.

```javascript
jwt.sign({ id: result.insertId }, process.env.JWT_SECRET)
```

### CRITICAL: Mass Assignment / Privilege Escalation

The `role` field is taken directly from `req.body`. A user can self-assign `admin` or any privileged role.

**Fix:** Either remove `role` from the destructure and assign a default, or validate it against an allowlist with authorization checks.

### HIGH: No Input Validation

`name`, `email`, and `role` are used with no type checking, length limits, or format validation. Missing fields will insert the string `'undefined'` into the database.

### HIGH: No Error Handling

If `db.query` throws, the request hangs or crashes with an unhandled rejection. There is no `try/catch` and no error response.

### HIGH: Token Returned on Creation

Returning a signed JWT on user creation means account creation doubles as automatic login. Depending on the application, this may bypass email verification or other onboarding steps.

**Verdict: BLOCK** -- Three critical issues must be fixed before merge.

---

## Task 2: React UserList Component

### CRITICAL: Infinite Render Loop

The `useEffect` has no dependency array, so it runs after every render. Each call to `setUsers` triggers a re-render, which triggers the effect again, creating an infinite fetch loop.

**Fix:**

```jsx
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(setUsers);
}, []);
```

### HIGH: `setUsers` Is Undefined

The component receives `users` as a prop but calls `setUsers`, which is never declared. This will throw a `ReferenceError` at runtime. If the intent is to manage users locally, it should be:

```jsx
const [users, setUsers] = useState([]);
```

But then `users` as a prop is unused and the component signature is wrong. The ownership of `users` state is ambiguous and needs to be resolved.

### HIGH: Missing List Keys

The `.map()` renders `<div>` elements without a `key` prop. React will emit a warning and may exhibit incorrect behavior when the list updates (e.g., stale DOM nodes).

**Fix:**

```jsx
users.filter(...).map(u => <div key={u.id}>{u.name}</div>)
```

### HIGH: No Error or Loading State

The fetch has no `.catch()` handler. If the request fails, the error is silently swallowed. There is also no loading indicator while the fetch is in flight.

### MEDIUM: Potential Null Reference

If a user object has a `null` or `undefined` `name`, `u.name.includes(filter)` will throw a `TypeError`.

**Verdict: BLOCK** -- The infinite loop and undefined `setUsers` make this component non-functional.

---

## Task 3: Python Payment Refund

### CRITICAL: Race Condition (Double-Refund)

Two concurrent requests for the same user can both read `user.balance >= amount` as true before either writes back. This allows refunding more than the actual balance. The read-check-write pattern is not atomic.

**Fix:** Use a database-level atomic operation or row-level locking:

```python
# Option 1: Atomic UPDATE with a WHERE guard
db.execute(
    "UPDATE users SET balance = balance - %s WHERE id = %s AND balance >= %s",
    (amount, user_id, amount)
)
```

### HIGH: No Transaction / Partial Failure

`db.save(user)` and `send_email(...)` are not in a transaction. If `send_email` fails after the balance is deducted, the user is refunded but never notified. Conversely, if `db.save` succeeds but a later step in a larger workflow fails, there is no rollback.

**Fix:** Wrap in a transaction and handle email sending asynchronously (e.g., via a task queue) so the database operation is not coupled to email delivery.

### HIGH: No Input Validation

- `amount` is not checked for being positive. A negative amount would *increase* the balance.
- `amount` type is not validated -- passing a string could cause unexpected behavior.
- `user_id` is not validated.

```python
if not isinstance(amount, (int, float)) or amount <= 0:
    raise ValueError("Amount must be a positive number")
```

### HIGH: No Audit Trail

A financial operation like a refund produces no log entry and no transaction record. There is no way to reconstruct what happened after the fact.

### MEDIUM: No Authorization Check

The function accepts `user_id` and processes a refund with no verification that the caller is authorized to issue refunds for this user.

**Verdict: BLOCK** -- The race condition can cause financial loss; input validation gaps allow balance manipulation.

---

## Task 4: Go DeleteUser Handler

### CRITICAL: No Authentication or Authorization

Any unauthenticated request can delete any user by passing an `id` query parameter. There is no session check, no token validation, and no permission verification.

### HIGH: No HTTP Method Check

The handler does not verify that the request method is `DELETE` (or `POST`). A `GET` request -- which can be triggered by an image tag, link prefetch, or search engine crawler -- will delete the user. This is also a CSRF vector since `GET` requests are trivially triggered cross-origin.

**Fix:**

```go
if r.Method != http.MethodDelete {
    http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    return
}
```

### HIGH: Error Swallowed, Success Always Returned

When `db.Exec` fails, the error is logged but the handler still returns HTTP 200. The client believes the deletion succeeded when it did not.

**Fix:**

```go
if err != nil {
    log.Println(err)
    http.Error(w, "Internal server error", http.StatusInternalServerError)
    return
}
```

### HIGH: No Verification of Deletion

The handler does not check `RowsAffected()`. If the `id` does not exist, it silently returns 200. The caller should be told the user was not found.

### MEDIUM: Soft Delete Not Considered

Hard-deleting user rows can break foreign key relationships and makes recovery impossible. Most production systems use soft deletes (`deleted_at` timestamp).

### LOW: `id` Is Not Validated

While the parameterized query prevents SQL injection, passing an empty or non-numeric `id` will silently match zero rows. Basic input validation (non-empty, numeric) would catch mistakes early.

**Verdict: BLOCK** -- Missing authentication on a destructive endpoint is critical.

---

## Task 5: TypeScript Cache Cleanup

### MEDIUM: Deleting Map Entries During Iteration

The `cleanup()` method calls `this.store.delete(key)` while iterating over `this.store` with `for...of`. In JavaScript/TypeScript, this is technically safe per the ECMAScript specification -- entries deleted during iteration are not revisited and iteration continues correctly. However, this is a well-known source of confusion and some linters flag it. It is worth adding a comment to acknowledge the deliberate choice, or collecting keys first:

```typescript
cleanup() {
  const now = Date.now();
  const expired: string[] = [];
  for (const [key, entry] of this.store) {
    if (entry.expiry < now) expired.push(key);
  }
  expired.forEach(k => this.store.delete(k));
}
```

### MEDIUM: No Public `set` Method

The class has `get` and `cleanup` but no `set` method. Users cannot add entries to the cache. Either `set` is missing from this diff, or `store` is populated externally -- but `store` is `private`, so external access is impossible. The class is incomplete as shown.

### LOW: `cleanup` Visibility

`cleanup()` has no access modifier, defaulting to `public`. If it is meant to be called internally (e.g., on a timer), consider marking it `private` or `protected`. If it is part of the public API, this is fine.

### LOW: No Automatic Cleanup

Expired entries are only removed when `cleanup()` is explicitly called or when `get()` encounters them individually. There is no TTL-based eviction or periodic sweep, which means stale entries can accumulate unboundedly until `cleanup()` is invoked.

**Verdict: Approve with comments** -- No critical or high issues. The Map deletion during iteration is spec-compliant. The missing `set` method should be clarified.

---

## Summary

| Task | Component | Verdict | Critical | High | Medium | Low |
|------|-----------|---------|----------|------|--------|-----|
| 1 | Express endpoint | **BLOCK** | 3 (SQL injection, hardcoded secret, mass assignment) | 3 | 0 | 0 |
| 2 | React component | **BLOCK** | 1 (infinite loop) | 3 | 1 | 0 |
| 3 | Python refund | **BLOCK** | 1 (race condition) | 3 | 1 | 0 |
| 4 | Go handler | **BLOCK** | 1 (no auth) | 3 | 1 | 1 |
| 5 | TS Cache | **Approve** | 0 | 0 | 2 | 2 |

Tasks 1 through 4 must not be merged until their critical issues are resolved.
