## Task 1 -- Express.js Endpoint Review

### [CRITICAL] SQL Injection via string concatenation
- **Issue**: User-supplied `name`, `email`, and `role` are interpolated directly into the SQL query string using template literals. An attacker can inject arbitrary SQL. For example, an `email` value of `'; DROP TABLE users; --` would destroy the table.
- **Suggestion**: Use parameterized queries:
```javascript
const query = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
const result = await db.query(query, [name, email, role]);
```

### [CRITICAL] Hardcoded JWT secret
- **Issue**: The JWT signing secret `'secret123'` is hardcoded in source code. Anyone with access to the repository can forge authentication tokens for any user.
- **Suggestion**: Load the secret from an environment variable: `process.env.JWT_SECRET`. Ensure the value is cryptographically random (at least 256 bits). Fail to start the server if the variable is not set.

### [HIGH] No input validation
- **Issue**: `name`, `email`, and `role` are destructured from `req.body` with no validation. The `role` field is especially dangerous -- without allowlist validation, a user can self-assign an admin role (mass assignment / privilege escalation).
- **Suggestion**: Validate with a schema library (e.g., Zod, Joi). Enforce an allowlist for `role`.

### [HIGH] No error handling on database query
- **Issue**: `await db.query(query)` is not wrapped in a try/catch. If the query fails, the unhandled rejection will either crash the process or return a default 500 with internal error details leaked to the client.
- **Suggestion**: Wrap in try/catch. Return a generic error message to the client. Log the real error server-side.

### [HIGH] No authentication or authorization check
- **Issue**: This endpoint creates a user and returns a signed JWT, but there is no authentication middleware.
- **Suggestion**: If this is registration, remove `role` from user input and set a default. If this is admin-only, add authentication middleware.

**Verdict**: BLOCK -- 2 CRITICAL, 3 HIGH

---

## Task 2 -- React Component Review

### [CRITICAL] useEffect with no dependency array causes infinite loop
- **Issue**: `useEffect(() => { ... })` has no dependency array at all. This means it fires on every single render. The fetch call inside presumably calls `setUsers`, which triggers a re-render, which triggers useEffect again, creating an infinite loop of HTTP requests.
- **Suggestion**: Add an empty dependency array:
```jsx
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(setUsers);
}, []);
```

### [HIGH] setUsers is not defined
- **Issue**: The component receives `users` as a prop and calls `setUsers` inside useEffect, but `setUsers` is never declared. There is no `useState` for users -- only `useState('')` for `filter`. This will throw a `ReferenceError` at runtime.
- **Suggestion**: Decide whether users come from props or from fetching. If fetching: `const [users, setUsers] = useState([])` and remove the prop. If from props: remove the fetch entirely.

### [HIGH] Missing keys on list items
- **Issue**: `.map(u => <div>{u.name}</div>)` does not provide a `key` prop. React will issue a warning and may exhibit incorrect behavior when the list updates.
- **Suggestion**: Add a unique key: `<div key={u.id}>{u.name}</div>`.

### [HIGH] No error handling on fetch
- **Issue**: The fetch chain has no `.catch()` handler. If the network request fails, the promise rejects silently.
- **Suggestion**: Add a `.catch()` handler and loading/error state variables.

### [MEDIUM] Potential crash if users is null/undefined
- **Issue**: `users.filter(...)` will throw a TypeError if `users` is `undefined` or `null`.
- **Suggestion**: Default to an empty array: `(users || []).filter(...)`.

**Verdict**: BLOCK -- 1 CRITICAL, 3 HIGH, 1 MEDIUM

---

## Task 3 -- Python Payment Service Review

### [CRITICAL] Race condition on balance check and deduction
- **Issue**: The read-check-write sequence (`get_user` -> check balance -> save) is not atomic. Two concurrent refund requests can both read the original balance, both pass the `>=` check, and both deduct -- resulting in a negative balance and double refund.
- **Suggestion**: Use a database-level atomic operation: `UPDATE users SET balance = balance - :amount WHERE id = :user_id AND balance >= :amount`, and check the affected row count. Alternatively, use `SELECT ... FOR UPDATE`.

### [HIGH] No input validation on amount
- **Issue**: A negative amount (e.g., `process_refund(user_id, -100)`) would pass the balance check and then subtract a negative, effectively adding money to the user's balance.
- **Suggestion**: Validate at the top:
```python
if not isinstance(amount, (int, float)) or amount <= 0:
    raise ValueError("Amount must be a positive number")
```

### [HIGH] No transaction wrapping -- partial failure risk
- **Issue**: `db.save(user)` and `send_email(...)` are sequential without a transaction. If `db.save` succeeds but `send_email` raises, the refund is applied but the user is not notified. No idempotency mechanism prevents duplicate refunds.
- **Suggestion**: Wrap the database operation in a transaction. Move the email send to a background job. Add an idempotency key.

### [HIGH] No audit trail
- **Issue**: A financial operation (refund) is performed by mutating a balance field directly with no transaction log, no refund record, and no audit trail.
- **Suggestion**: Insert a record into a `transactions` or `refunds` table before modifying the balance.

### [MEDIUM] Boolean return provides no error context
- **Issue**: Returning `True`/`False` gives the caller no information about why a refund failed.
- **Suggestion**: Raise specific exceptions or return a result object with status and message.

**Verdict**: BLOCK -- 1 CRITICAL, 3 HIGH, 1 MEDIUM

---

## Task 4 -- Go Handler Review

### [HIGH] No authentication or authorization check
- **Issue**: `DeleteUser` deletes a user record based solely on a query parameter `id`. There is no authentication or authorization. Any unauthenticated request can delete any user.
- **Suggestion**: Add authentication middleware. Verify the requesting user has permission (admin role or self-deletion only).

### [HIGH] Missing HTTP method check
- **Issue**: The handler does not verify that the HTTP method is DELETE. A GET request (which can be triggered by a browser link or image tag) could delete a user. This is also a CSRF concern.
- **Suggestion**: Add a method check or ensure the router restricts the method.

### [HIGH] Error silently ignored -- success returned on failure
- **Issue**: When `db.Exec` returns an error, the handler logs it but still returns HTTP 200. The client believes the deletion succeeded when it did not.
- **Suggestion**:
```go
if err != nil {
    log.Println(err)
    http.Error(w, "internal server error", http.StatusInternalServerError)
    return
}
```

### [HIGH] No validation that id exists or was affected
- **Issue**: The result of `db.Exec` (discarded with `_`) contains `RowsAffected()`. If the id does not match any user, the query succeeds with 0 rows affected, and the handler returns 200.
- **Suggestion**: Check `result.RowsAffected()`. Return 404 if zero rows were affected.

### [MEDIUM] No input validation on id parameter
- **Issue**: The `id` query parameter has no validation. While the parameterized query prevents SQL injection, an empty string will match nothing.
- **Suggestion**: Validate that `id` is non-empty and matches the expected format. Return 400 if invalid.

**Positive**: Parameterized query (`?` placeholder) is used correctly, preventing SQL injection.

**Verdict**: BLOCK -- 0 CRITICAL, 4 HIGH, 1 MEDIUM

---

## Task 5 -- TypeScript Cache Cleanup Review

### [MEDIUM] Deleting Map entries during iteration is safe but worth noting
- **Issue**: The code deletes entries from `this.store` while iterating with `for...of`. In JavaScript/TypeScript, the `Map` specification explicitly allows deletion of the current entry during `for...of` iteration. This is **not a bug**.
- **Suggestion**: Add a comment: `// Safe: Map spec allows deleting current entry during iteration`.

### [LOW] cleanup() has no access modifier
- **Issue**: `cleanup()` defaults to `public`. If it is only meant for internal use, it should be `private`.
- **Suggestion**: Add an explicit access modifier to clarify intent.

### [LOW] No return type annotation
- **Issue**: `cleanup()` lacks an explicit return type.
- **Suggestion**: `cleanup(): void {`

**Positive observations**:
- The cleanup logic is simple, correct, and efficient
- The `get()` method already handles expired entries gracefully as a fallback
- Good use of generics for type safety

**Verdict**: APPROVE -- 0 CRITICAL, 0 HIGH, 1 MEDIUM, 2 LOW

---

## Overall Summary

| Task | Verdict | Critical | High | Medium | Low |
|------|---------|----------|------|--------|-----|
| 1 - Express.js | BLOCK | 2 | 3 | 0 | 0 |
| 2 - React | BLOCK | 1 | 3 | 1 | 0 |
| 3 - Python | BLOCK | 1 | 3 | 1 | 0 |
| 4 - Go | BLOCK | 0 | 4 | 1 | 0 |
| 5 - TypeScript | APPROVE | 0 | 0 | 1 | 2 |
| **Total** | | **4** | **13** | **4** | **2** |
