# Security Review Report

Date: 2026-03-22

---

## Task 1

**Subject:** Node.js File Upload Handler

```javascript
app.post('/upload', (req, res) => {
  const file = req.files.avatar;
  const path = `./uploads/${req.body.username}/${file.name}`;
  file.mv(path, (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('Uploaded');
  });
});
```

### Vulnerabilities Found

#### 1. Path Traversal via `req.body.username` -- CRITICAL

**Description:** The `username` field comes directly from the request body with no sanitization. An attacker can supply a value like `../../etc` or `../../../root/.ssh` to write files to arbitrary locations on the server.

**Attack Vector:** `POST /upload` with body `username=../../etc/cron.d` and a crafted file. This writes an arbitrary file to `/etc/cron.d`, achieving remote code execution.

**Fix:** Sanitize the username by stripping path separators, and resolve the final path to confirm it stays within the uploads directory.

```javascript
const path = require('path');

app.post('/upload', authMiddleware, (req, res) => {
  const file = req.files?.avatar;
  if (!file) return res.status(400).send('No file provided');

  const username = path.basename(req.body.username || '');
  if (!username) return res.status(400).send('Invalid username');

  const filename = path.basename(file.name);
  const uploadsRoot = path.resolve('./uploads');
  const dest = path.resolve(uploadsRoot, username, filename);

  if (!dest.startsWith(uploadsRoot + path.sep)) {
    return res.status(400).send('Invalid path');
  }

  file.mv(dest, (err) => {
    if (err) return res.status(500).send('Upload failed');
    res.send('Uploaded');
  });
});
```

#### 2. Path Traversal via `file.name` -- CRITICAL

**Description:** The original filename from the client is used directly. An attacker can name a file `../../../app.js` to overwrite application code or other sensitive files.

**Attack Vector:** Upload a file named `../../server.js` to overwrite the running application.

**Fix:** Use `path.basename(file.name)` to strip directory components (shown in fix above).

#### 3. No Authentication -- CRITICAL

**Description:** The endpoint has no authentication middleware. Any anonymous user can upload files to the server.

**Attack Vector:** Unauthenticated requests to `POST /upload` can fill disk, overwrite files, or upload malicious content.

**Fix:** Add authentication middleware (e.g., `authMiddleware`) before the handler, as shown in the fix above.

#### 4. Unrestricted File Type -- HIGH

**Description:** There is no validation of file type, extension, or content. An attacker can upload executable scripts (`.php`, `.jsp`, `.sh`), web shells, or malware.

**Attack Vector:** Upload a web shell as `shell.php`. If the uploads directory is served by a web server that executes PHP, the attacker gains remote code execution.

**Fix:** Validate file extension against an allowlist and check MIME type.

```javascript
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const ext = path.extname(filename).toLowerCase();
if (!ALLOWED_EXTENSIONS.includes(ext)) {
  return res.status(400).send('File type not allowed');
}
```

#### 5. No File Size Limit -- MEDIUM

**Description:** Without a size limit, an attacker can upload very large files to exhaust disk space (denial of service).

**Fix:** Configure file size limits in express-fileupload or multer middleware.

```javascript
app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 } })); // 5 MB
```

#### 6. Internal Error Message Leakage -- MEDIUM

**Description:** `res.status(500).send(err.message)` exposes internal error details (file paths, permissions, OS info) to the client.

**Fix:** Return a generic error message. Log the real error server-side.

```javascript
if (err) {
  console.error('Upload failed:', err);
  return res.status(500).send('Upload failed');
}
```

---

## Task 2

**Subject:** Python Flask Authentication Middleware

```python
@app.before_request
def check_auth():
    if request.path in ['/login', '/register', '/health']:
        return
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        g.user_id = payload['user_id']
    except:
        return jsonify({'error': 'Unauthorized'}), 401
```

### Vulnerabilities Found

#### 1. Path Bypass via Trailing Slash / Case Variation -- CRITICAL

**Description:** The allowlist uses exact string matching (`request.path in [...]`). Flask normalizes some paths but an attacker can try variations like `/login/`, `/Login`, `/health?`, or `/health/../../admin` to bypass the check, or conversely access protected routes that happen to match due to URL normalization.

**Attack Vector:** Depending on Flask's URL routing configuration and any reverse proxy in front, requests to `/Login` or `/health/` might bypass the allowlist check yet still be routed to a protected endpoint.

**Fix:** Normalize the path before comparison, use `startswith` for prefix matching, or better yet use Flask's `@app.before_request` with explicit decorator-based exemptions.

```python
@app.before_request
def check_auth():
    exempt = {'/login', '/register', '/health'}
    normalized = request.path.rstrip('/').lower()
    if normalized in exempt:
        return
    # ... rest of auth check
```

#### 2. Bare `except` Catches All Exceptions -- HIGH

**Description:** The bare `except:` clause catches every exception, not just JWT validation errors. If `app.config['SECRET_KEY']` is missing and raises a `KeyError`, or if there is a bug in the JWT library, the middleware silently returns 401 instead of surfacing the real error. This masks configuration issues and makes debugging extremely difficult.

**Attack Vector:** Not a direct exploit, but a misconfigured secret key would go undetected in production, potentially allowing the service to run without any user ever being able to authenticate -- a silent denial of service.

**Fix:** Catch only JWT-specific exceptions.

```python
except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
    return jsonify({'error': 'Unauthorized'}), 401
```

#### 3. No Token Expiration Enforcement -- HIGH

**Description:** While `jwt.decode` with PyJWT will check `exp` if present, the code does not ensure tokens actually contain an `exp` claim. If tokens are issued without expiration, they are valid forever.

**Attack Vector:** A stolen token can be used indefinitely. There is no way to invalidate compromised credentials short of rotating the secret key (which invalidates all tokens).

**Fix:** Require `exp` in the payload and implement token expiration.

```python
payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'],
                     options={"require": ["exp", "user_id"]})
```

#### 4. No Token Revocation Mechanism -- MEDIUM

**Description:** There is no blocklist or revocation check. Once issued, a token cannot be invalidated (e.g., on logout or password change).

**Fix:** Implement a token blocklist (Redis-backed) or use short-lived tokens with refresh token rotation.

#### 5. `HS256` Shared Secret Risk -- MEDIUM

**Description:** HS256 uses a symmetric key. If the secret key is weak or leaked, any party can forge tokens. In a microservices architecture, every service that needs to verify tokens must have the secret, increasing the attack surface.

**Fix:** For production systems, consider RS256 (asymmetric) so only the auth service holds the private key. At minimum, ensure the secret key is cryptographically random and at least 256 bits.

---

## Task 3

**Subject:** Admin Users API Endpoint

```javascript
app.get('/api/admin/users', async (req, res) => {
  if (req.query.admin === 'true') {
    const users = await User.find({}).select('+password +ssn');
    res.json(users);
  } else {
    res.status(403).json({ error: 'Not admin' });
  }
});
```

### Vulnerabilities Found

#### 1. Authorization Bypass via Query Parameter -- CRITICAL

**Description:** Admin access is "protected" by checking if the query parameter `admin` equals `'true'`. This is not authentication or authorization -- it is a publicly known URL parameter that anyone can set.

**Attack Vector:** Any user (or anonymous attacker) sends `GET /api/admin/users?admin=true` and receives the full user database including passwords and SSNs. This is a complete authorization bypass.

**Fix:** Use proper authentication middleware and role-based access control.

```javascript
app.get('/api/admin/users', authMiddleware, requireRole('admin'), async (req, res) => {
  const users = await User.find({}).select('-password -ssn');
  res.json(users);
});
```

#### 2. Exposing Password Hashes -- CRITICAL

**Description:** `.select('+password')` explicitly includes the password field (which Mongoose excludes by default with `select: false` in the schema). Returning password hashes to any client -- even an admin -- is never necessary and enables offline brute-force attacks if the data is intercepted or logged.

**Attack Vector:** Attacker obtains the response (trivial given vulnerability #1), then runs offline cracking tools (hashcat, John the Ripper) against the password hashes. Weak passwords are recovered in seconds.

**Fix:** Never select or return password fields. Remove `+password` from the select clause entirely.

#### 3. Exposing SSNs (Social Security Numbers) -- CRITICAL

**Description:** `.select('+ssn')` returns Social Security Numbers for all users. This is Personally Identifiable Information (PII) subject to regulatory requirements (GDPR, CCPA, etc.). Mass exposure of SSNs constitutes a reportable data breach.

**Attack Vector:** Same as above. The attacker gets SSNs for every user in the database.

**Fix:** Never return SSNs in API responses. If an admin needs to view a single user's SSN, implement a separate audited endpoint with additional authentication (e.g., re-authentication, MFA) and log every access.

#### 4. No Pagination or Rate Limiting -- MEDIUM

**Description:** `User.find({})` returns all users at once. For large databases, this causes performance issues and makes data exfiltration trivial in a single request.

**Fix:** Add pagination and rate limiting.

```javascript
const page = parseInt(req.query.page) || 1;
const limit = Math.min(parseInt(req.query.limit) || 20, 100);
const users = await User.find({})
  .select('-password -ssn')
  .skip((page - 1) * limit)
  .limit(limit);
```

---

## Task 4

**Subject:** Python Password Reset Flow

```python
def reset_password(request):
    email = request.POST['email']
    user = User.objects.get(email=email)
    token = hashlib.md5(str(time.time()).encode()).hexdigest()
    user.reset_token = token
    user.save()
    send_email(email, f"Reset link: https://app.com/reset?token={token}")
    return JsonResponse({'status': 'sent'})
```

### Vulnerabilities Found

#### 1. Predictable Reset Token -- CRITICAL

**Description:** The token is an MD5 hash of `time.time()`. `time.time()` returns the current Unix timestamp with microsecond precision. An attacker who knows the approximate time a reset was requested (within a few seconds) can brute-force all possible timestamps and generate the corresponding MD5 hashes. MD5 is fast to compute -- millions of hashes per second is trivial.

**Attack Vector:** Attacker requests a password reset for a victim's email, notes the approximate time, then brute-forces the token by iterating over timestamps in a narrow window. With microsecond precision, a 1-second window has only ~1,000,000 candidates, computable in under a second.

**Fix:** Use `secrets.token_urlsafe()` which generates cryptographically random tokens.

```python
import secrets

def reset_password(request):
    email = request.POST.get('email', '').strip().lower()
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Return same response to prevent user enumeration
        return JsonResponse({'status': 'sent'})

    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expires = timezone.now() + timedelta(hours=1)
    user.save()
    send_email(email, f"Reset link: https://app.com/reset?token={token}")
    return JsonResponse({'status': 'sent'})
```

#### 2. User Enumeration -- HIGH

**Description:** `User.objects.get(email=email)` raises `User.DoesNotExist` if the email is not found. If the exception is unhandled (or if the response differs from a successful request), the attacker can determine which emails are registered.

**Attack Vector:** Attacker submits various email addresses and observes whether the response is `{'status': 'sent'}` or a 500 error / different message. This reveals valid accounts for targeted attacks.

**Fix:** Always return the same response regardless of whether the email exists (shown in fix above).

#### 3. No Token Expiration -- HIGH

**Description:** The reset token has no expiration time. Once generated, it remains valid forever until used. A token from months ago is still valid.

**Attack Vector:** If a token is leaked (via email compromise, logs, browser history), it can be used at any future time.

**Fix:** Add an expiration timestamp and validate it when the token is used (shown in fix above).

#### 4. No Rate Limiting -- HIGH

**Description:** There is no rate limiting on the reset endpoint. An attacker can flood it with requests to:
- Generate many tokens for the same user (increasing brute-force window)
- Send spam emails to arbitrary addresses
- Cause denial of service via email sending costs

**Fix:** Add rate limiting (e.g., Django Ratelimit, or custom per-email throttling).

#### 5. Token Not Invalidated After Use -- MEDIUM

**Description:** There is no indication that the token is cleared after a successful password reset. If not cleared, a token can be reused.

**Fix:** Set `user.reset_token = None` and `user.reset_token_expires = None` after a successful reset.

#### 6. Unhandled Exception on Missing Email -- MEDIUM

**Description:** `request.POST['email']` raises `KeyError` if the field is missing, resulting in an unhandled 500 error. `User.objects.get()` raises `DoesNotExist` if no match -- also an unhandled 500.

**Fix:** Use `request.POST.get('email')` and wrap the query in a try/except (shown in fix above).

---

## Task 5

**Subject:** CORS Configuration and Cookie Settings

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));
```

```javascript
res.cookie('session', token, { httpOnly: true, sameSite: 'None', secure: true });
```

### Vulnerabilities Found

#### 1. CORS Allows All Origins with Credentials -- CRITICAL

**Description:** The origin callback unconditionally returns `true` for every origin, while `credentials: true` allows cookies to be sent cross-origin. This means any website on the internet can make authenticated requests to this API and read the responses. This completely defeats the Same-Origin Policy.

**Attack Vector:** An attacker hosts a malicious page at `https://evil.com` that makes `fetch('https://app.com/api/admin/users', { credentials: 'include' })`. The browser sends the victim's session cookie, the server responds with `Access-Control-Allow-Origin: https://evil.com` and `Access-Control-Allow-Credentials: true`, and the attacker's JavaScript reads the response -- extracting all user data, performing actions as the victim, etc.

**Fix:** Restrict origins to an explicit allowlist.

```javascript
const ALLOWED_ORIGINS = [
  'https://app.com',
  'https://www.app.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, server-to-server)
    // only if that is an intentional design decision
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
```

#### 2. `sameSite: 'None'` Weakens CSRF Protection -- HIGH

**Description:** Setting `sameSite: 'None'` means the browser will send the session cookie on every cross-origin request. This disables the browser's built-in CSRF protection. Combined with the open CORS policy, this is especially dangerous.

**Attack Vector:** Any cross-origin form submission or fetch request from any site will include the session cookie. This enables CSRF attacks on state-changing endpoints (POST, PUT, DELETE).

**Fix:** Use `sameSite: 'Lax'` (or `'Strict'`) unless cross-origin cookie sending is genuinely required (e.g., embedded iframes from a different subdomain). If `None` is required, ensure CORS is tightly restricted (fix #1) and add CSRF tokens to state-changing requests.

```javascript
res.cookie('session', token, {
  httpOnly: true,
  sameSite: 'Lax',
  secure: true,
  maxAge: 3600000, // 1 hour
  path: '/',
});
```

#### 3. No Cookie `domain` or `path` Restriction -- LOW

**Description:** Without explicit `domain` and `path` settings, the cookie defaults to the exact host and `/` path. This is generally acceptable but should be explicitly set to prevent unintended scope expansion if the application is later deployed on a shared domain.

**Fix:** Explicitly set `path: '/'` and `domain` if needed for subdomain sharing.

---

# Summary

| Task | Vulnerabilities | Critical | High | Medium | Low |
|------|----------------|----------|------|--------|-----|
| 1 - File Upload | 6 | 3 | 1 | 2 | 0 |
| 2 - Auth Middleware | 5 | 1 | 2 | 2 | 0 |
| 3 - Admin Endpoint | 4 | 3 | 0 | 1 | 0 |
| 4 - Password Reset | 6 | 1 | 3 | 2 | 0 |
| 5 - CORS + Cookies | 3 | 1 | 1 | 0 | 1 |
| **Total** | **24** | **9** | **7** | **7** | **1** |

The most dangerous issues across all tasks are:

1. **Task 3 -- Query parameter authorization bypass** exposing passwords and SSNs. This is a data breach waiting to happen.
2. **Task 5 -- Open CORS with credentials** allowing any website to make authenticated requests and read responses.
3. **Task 1 -- Path traversal** allowing arbitrary file write on the server, leading to remote code execution.
4. **Task 4 -- Predictable reset tokens** allowing account takeover via brute-force.

All CRITICAL findings require immediate remediation before the code reaches production.
