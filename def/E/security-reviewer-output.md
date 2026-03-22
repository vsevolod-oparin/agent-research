## Task 1: File Upload Handler Review

### [CRITICAL] Path Traversal via Username and Filename
Both `req.body.username` and `file.name` are user-controlled and injected directly into a filesystem path. An attacker sends `username` set to `../../etc` and `file.name` set to `crontab` -- the template literal builds the path with zero sanitization, enabling arbitrary file write anywhere the Node.js process has permission. Can lead to RCE (overwriting app source, cron jobs, SSH keys).

**Fix:**
```javascript
const path = require('path');
const sanitize = require('sanitize-filename');
const safeName = sanitize(file.name);
const safeUser = sanitize(req.body.username);
const dest = path.join(path.resolve('./uploads'), safeUser, safeName);
if (!dest.startsWith(path.resolve('./uploads'))) {
  return res.status(400).send('Invalid path');
}
```

### [CRITICAL] No Authentication on Upload Endpoint
Any unauthenticated user can upload files. Combined with path traversal: unauthenticated RCE.

### [HIGH] No File Type or Size Validation
No validation of MIME type, extension, or size. Attackers can upload executable files or exhaust disk.

### [MEDIUM] Error Message Leaks Internal Details
`err.message` sent directly to client. Return a generic error instead.

---

## Task 2: Authentication Middleware Review

### [HIGH] Path Bypass via Trailing Slash or Case Variation
Exact string matching (`request.path in ['/login', '/register', '/health']`) can be bypassed with `/login/`, `/Login`, or URL-encoded variants. **Fix:** `if request.path.rstrip('/') in [...]` or use decorator-based approach.

### [HIGH] Bare Except Clause Masks Errors
`except:` catches all exceptions including `KeyError` on missing `user_id`, hiding bugs and security events. No logging means attacks go undetected. **Fix:** Catch specific exceptions (`jwt.ExpiredSignatureError`, `jwt.InvalidTokenError`, `KeyError`) and log each.

### [MEDIUM] No Token Expiration Enforcement Check
No guarantee tokens are issued with `exp` claim. Add `options={"require": ["exp", "user_id"]}` to decode.

### [MEDIUM] No Rate Limiting on Authentication
Allows brute-force token guessing or credential stuffing.

---

## Task 3: Admin API Endpoint Review

### [CRITICAL] Broken Access Control -- Admin Check via Query Parameter
Admin authorization is `req.query.admin === 'true'` -- a user-controlled query parameter. ANY user gains admin access by appending `?admin=true`. **Fix:** Use proper auth middleware with role verification from the session/token.

### [CRITICAL] Mass Exposure of Passwords and SSNs
`.select('+password +ssn')` explicitly returns password hashes and SSNs in the API response. Even for admins, this is never acceptable. This is a reportable data breach under GDPR/CCPA. **Fix:** `.select('-password -ssn')`. SSNs: show only last 4 digits if needed.

### [HIGH] No Pagination
`User.find({})` returns all users with no limit -- enables data dump and DoS on large datasets.

---

## Task 4: Password Reset Flow Review

### [CRITICAL] Predictable Reset Token (Insecure Randomness)
`hashlib.md5(str(time.time()).encode()).hexdigest()` -- an attacker who knows the approximate time (~1 second window) can brute-force the token with fewer than 1000 attempts. Enables full account takeover. **Fix:** `token = secrets.token_urlsafe(32)`.

### [HIGH] No Token Expiration
Reset token valid indefinitely. Tokens from old intercepted emails or database leaks remain usable. **Fix:** Add `user.reset_token_expires = timezone.now() + timedelta(hours=1)`.

### [HIGH] User Enumeration
`User.objects.get(email=email)` raises `DoesNotExist` → 500 error for invalid emails, 200 for valid ones. **Fix:** Always return the same response regardless of whether the email exists.

### [MEDIUM] No Rate Limiting
Enables email bombing or rapid user enumeration.

### [MEDIUM] No CSRF Protection Visible
Processes `request.POST` without visible CSRF token validation.

---

## Task 5: CORS Configuration and Cookie Review

### [CRITICAL] CORS Allows All Origins with Credentials
The origin callback unconditionally returns `true` for every origin, combined with `credentials: true`. Any website on the internet can make credentialed cross-origin requests and read responses -- full session hijacking. An attacker at `evil.com` runs `fetch('https://your-api.com/api/users', {credentials: 'include'})` and reads all user data.

**Fix:**
```javascript
const allowedOrigins = ['https://app.com', 'https://admin.app.com'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
```

### [HIGH] SameSite=None Disables CSRF Protection
`sameSite: 'None'` means the browser sends the session cookie on all cross-site requests. Combined with the open CORS policy, this completely eliminates browser-based CSRF protections. **Fix:** Use `sameSite: 'Lax'` unless there is a genuine cross-origin requirement.

### [MEDIUM] No Cookie path or domain Restriction
Missing explicit `path` and `domain` attributes. Add `path: '/'` and consider setting `domain`.

---

## Summary

**Verdict: FAIL**

| Task | Critical | High | Medium |
|------|----------|------|--------|
| 1 - File Upload | 2 | 1 | 1 |
| 2 - Auth Middleware | 0 | 2 | 2 |
| 3 - Admin Endpoint | 2 | 1 | 0 |
| 4 - Password Reset | 1 | 2 | 2 |
| 5 - CORS/Cookies | 1 | 1 | 1 |
| **Total** | **6** | **7** | **6** |
