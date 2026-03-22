## Task 1: Node.js File Upload Handler Review

### Code Under Review

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

### Findings

| # | Vulnerability | Severity | OWASP Category |
|---|---------------|----------|----------------|
| 1 | Path Traversal via `req.body.username` | CRITICAL | A1 - Injection |
| 2 | Path Traversal via `file.name` | CRITICAL | A1 - Injection |
| 3 | No authentication check on route | CRITICAL | A5 - Broken Access Control |
| 4 | No file type validation | HIGH | A5 - Broken Access Control |
| 5 | No file size limit | HIGH | A6 - Security Misconfiguration |
| 6 | Error message leaks internal info | MEDIUM | A3 - Sensitive Data Exposure |
| 7 | No rate limiting | HIGH | A6 - Security Misconfiguration |

**1. Path Traversal (CRITICAL)** -- Both `req.body.username` and `file.name` are user-controlled and are interpolated directly into the filesystem path with no sanitization. An attacker can set `username` to `../../etc` or `file.name` to `../../../etc/passwd` to write files to arbitrary locations on the server. This can lead to remote code execution (e.g., overwriting application code, cron jobs, or SSH keys).

**2. No Authentication (CRITICAL)** -- The `/upload` route has no authentication middleware. Any unauthenticated user can upload files. This must be gated by an auth check at minimum.

**3. No File Type Validation (HIGH)** -- There is no check on the file extension or MIME type. An attacker can upload executable files (`.js`, `.php`, `.sh`, `.html` containing XSS) that may be served or executed by the server.

**4. No File Size Limit (HIGH)** -- Without a size limit, an attacker can exhaust disk space via repeated large uploads (denial of service).

**5. Error Message Exposure (MEDIUM)** -- `err.message` is sent directly to the client. Internal filesystem errors can reveal server directory structure and other sensitive details.

### Remediated Code

```javascript
const path = require('path');
const crypto = require('crypto');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = path.resolve(__dirname, 'uploads');

app.post('/upload', authMiddleware, rateLimit({ windowMs: 60000, max: 10 }), (req, res) => {
  if (!req.files || !req.files.avatar) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const file = req.files.avatar;

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return res.status(413).json({ error: 'File too large' });
  }

  // Validate file extension
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return res.status(400).json({ error: 'File type not allowed' });
  }

  // Generate a safe, random filename -- never trust user-supplied names
  const safeFilename = crypto.randomUUID() + ext;
  const userDir = path.join(UPLOAD_DIR, req.user.id.toString());
  const destPath = path.join(userDir, safeFilename);

  // Verify the resolved path is still within UPLOAD_DIR (defense in depth)
  if (!destPath.startsWith(UPLOAD_DIR)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  // Ensure user directory exists
  require('fs').mkdirSync(userDir, { recursive: true });

  file.mv(destPath, (err) => {
    if (err) {
      console.error('Upload failed:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }
    res.json({ message: 'Uploaded', filename: safeFilename });
  });
});
```

Key changes: authentication middleware required, random filename generation instead of user-supplied names, extension whitelist, file size check, path canonicalization guard, generic error message, rate limiting.

---

## Task 2: Python Authentication Middleware Review

### Code Under Review

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

### Findings

| # | Vulnerability | Severity | OWASP Category |
|---|---------------|----------|----------------|
| 1 | Path bypass via trailing slash or case variation | CRITICAL | A5 - Broken Access Control |
| 2 | Bare `except` swallows all errors silently | MEDIUM | A10 - Insufficient Logging |
| 3 | No token expiration validation | HIGH | A2 - Broken Authentication |
| 4 | No logging of failed authentication attempts | MEDIUM | A10 - Insufficient Logging |
| 5 | Allowlist approach is fragile | MEDIUM | A5 - Broken Access Control |
| 6 | No check that `user_id` claim exists in payload | MEDIUM | A2 - Broken Authentication |
| 7 | `SECRET_KEY` strength unknown | MEDIUM | A2 - Broken Authentication |

**1. Path Bypass (CRITICAL)** -- The allowlist check uses exact string matching (`request.path in [...]`). An attacker can bypass authentication by requesting `/login/`, `/Login`, `/health?`, or `/register/../../api/secret`. Flask normalizes some of these, but path variations like `/health/` (with trailing slash) or URL-encoded paths (`/%68ealth`) can bypass this check depending on Flask configuration. This is the most dangerous finding.

**2. Bare `except` Clause (MEDIUM)** -- A bare `except:` catches everything including `SystemExit`, `KeyboardInterrupt`, and programming errors. If the `SECRET_KEY` is misconfigured or `jwt.decode` raises an unexpected error, it is silently treated as an auth failure with no logging, making debugging and incident detection impossible.

**3. No Token Expiration (HIGH)** -- The code does not verify that the JWT contains and enforces an `exp` claim. PyJWT does check `exp` if present, but if tokens are issued without `exp`, they never expire.

**4. No Failed Auth Logging (MEDIUM)** -- Failed authentication attempts are not logged. This prevents detection of brute force attacks, credential stuffing, and token theft.

### Remediated Code

```python
import logging
from functools import wraps

logger = logging.getLogger(__name__)

# Use a frozenset for O(1) lookup
PUBLIC_PATHS = frozenset(['/login', '/register', '/health'])

@app.before_request
def check_auth():
    # Normalize path: strip trailing slash, lowercase
    normalized_path = request.path.rstrip('/').lower()

    if normalized_path in PUBLIC_PATHS:
        return

    token = request.headers.get('Authorization', '').replace('Bearer ', '', 1)

    if not token:
        logger.warning('Missing auth token from %s for %s', request.remote_addr, request.path)
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        payload = jwt.decode(
            token,
            app.config['SECRET_KEY'],
            algorithms=['HS256'],
            options={'require': ['exp', 'user_id']}
        )
        g.user_id = payload['user_id']
    except jwt.ExpiredSignatureError:
        logger.warning('Expired token from %s', request.remote_addr)
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError as e:
        logger.warning('Invalid token from %s: %s', request.remote_addr, str(e))
        return jsonify({'error': 'Unauthorized'}), 401
```

Key changes: path normalization to prevent bypass, specific exception handling with logging, `exp` claim required, empty token check, `replace` limited to first occurrence.

---

## Task 3: Admin API Endpoint Review

### Code Under Review

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

### Findings

| # | Vulnerability | Severity | OWASP Category |
|---|---------------|----------|----------------|
| 1 | Authorization based on query parameter | CRITICAL | A5 - Broken Access Control |
| 2 | Password hashes returned in API response | CRITICAL | A3 - Sensitive Data Exposure |
| 3 | SSNs returned in API response | CRITICAL | A3 - Sensitive Data Exposure |
| 4 | No authentication middleware | CRITICAL | A2 - Broken Authentication |
| 5 | No pagination -- potential DoS | MEDIUM | A6 - Security Misconfiguration |
| 6 | No audit logging | MEDIUM | A10 - Insufficient Logging |

**1. Fake Authorization via Query Parameter (CRITICAL)** -- This is the most severe issue. The "admin check" is simply `req.query.admin === 'true'`, meaning any user (or unauthenticated visitor) can access the full user database by appending `?admin=true` to the URL. This is not authorization -- it is a publicly accessible door with a sign that says "please say you are admin." Authorization must be verified server-side against a trusted source (e.g., a role stored in the database, validated via JWT claims from a signed token).

**2. Password Hashes Exposed (CRITICAL)** -- The query explicitly includes `+password`, which overrides Mongoose's default `select: false` protection. Password hashes must never leave the server under any circumstances. Even hashed passwords can be targeted with offline brute force or rainbow table attacks.

**3. SSNs Exposed (CRITICAL)** -- Social Security Numbers are highly sensitive PII. Exposing them in a bulk API response with no access control constitutes a data breach. SSNs should be encrypted at rest and only ever displayed partially (last 4 digits) in the UI, never in bulk API responses.

**4. No Authentication (CRITICAL)** -- There is no authentication middleware. The route is accessible to anyone on the internet.

### Remediated Code

```javascript
app.get('/api/admin/users',
  authMiddleware,            // Verify the user is logged in
  requireRole('admin'),      // Verify the user has admin role (checked against DB/JWT)
  auditLog('admin.users.list'),
  async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // NEVER select password or full SSN
    const users = await User.find({})
      .select('-password -ssn -resetToken')
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({});

    res.json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  }
);
```

Key changes: real authentication and role-based authorization middleware, sensitive fields explicitly excluded, pagination to prevent bulk data dump, audit logging.

---

## Task 4: Password Reset Flow Review

### Code Under Review

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

### Findings

| # | Vulnerability | Severity | OWASP Category |
|---|---------------|----------|----------------|
| 1 | Predictable reset token (MD5 of timestamp) | CRITICAL | A2 - Broken Authentication |
| 2 | User enumeration via error response | HIGH | A2 - Broken Authentication |
| 3 | No token expiration | HIGH | A2 - Broken Authentication |
| 4 | No rate limiting | HIGH | A6 - Security Misconfiguration |
| 5 | Token not hashed before storage | MEDIUM | A3 - Sensitive Data Exposure |
| 6 | No CSRF protection | MEDIUM | A5 - Broken Access Control |
| 7 | Unhandled `User.DoesNotExist` exception | MEDIUM | A6 - Security Misconfiguration |

**1. Predictable Reset Token (CRITICAL)** -- The token is `md5(str(time.time()))`. `time.time()` returns the current Unix timestamp with microsecond precision. An attacker who knows approximately when the reset was requested (which they do, since they can trigger it) can brute force the token by iterating over a narrow window of timestamps. MD5 is fast to compute, so millions of candidates can be checked per second. This means an attacker can reset any user's password.

**2. User Enumeration (HIGH)** -- If the email does not exist, `User.objects.get(email=email)` raises `User.DoesNotExist`, which will return a 500 error (or a different error than the success case). This allows attackers to enumerate which email addresses are registered.

**3. No Token Expiration (HIGH)** -- The reset token never expires. Once generated, it remains valid until used (or until another reset is requested). Tokens should expire within 15-30 minutes.

**4. Token Stored in Plaintext (MEDIUM)** -- If the database is compromised, an attacker can read reset tokens directly and use them. The token should be hashed (SHA-256) before storage, similar to how passwords are hashed.

**5. Unhandled Exception (MEDIUM)** -- `User.objects.get()` will raise `DoesNotExist` if the email is not found, causing a 500 error that may expose a stack trace in debug mode.

### Remediated Code

```python
import secrets
import hashlib
from datetime import timedelta
from django.utils import timezone

def reset_password(request):
    email = request.POST.get('email', '').strip().lower()

    # Always return the same response to prevent user enumeration
    success_response = JsonResponse({'status': 'sent'})

    if not email:
        return success_response

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Do NOT reveal that the user does not exist
        return success_response

    # Rate limit: do not allow resets more than once per minute
    if user.reset_token_created_at and \
       timezone.now() - user.reset_token_created_at < timedelta(minutes=1):
        return success_response

    # Generate a cryptographically secure token
    raw_token = secrets.token_urlsafe(32)

    # Store a SHA-256 hash of the token (not the raw token)
    user.reset_token = hashlib.sha256(raw_token.encode()).hexdigest()
    user.reset_token_created_at = timezone.now()
    user.save(update_fields=['reset_token', 'reset_token_created_at'])

    # Send the raw token to the user; only the hash is in the DB
    send_email(email, f"Reset link: https://app.com/reset?token={raw_token}")

    return success_response
```

The verification endpoint must also: hash the incoming token with SHA-256 before comparing to the stored hash, check that `reset_token_created_at` is within the last 30 minutes, invalidate the token after use, and require the new password to meet complexity requirements.

---

## Task 5: CORS Configuration and Cookie Review

### Code Under Review

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);  // Allows ALL origins
  },
  credentials: true,
};
app.use(cors(corsOptions));
```

```javascript
res.cookie('session', token, { httpOnly: true, sameSite: 'None', secure: true });
```

### Findings

| # | Vulnerability | Severity | OWASP Category |
|---|---------------|----------|----------------|
| 1 | CORS allows all origins with credentials | CRITICAL | A5 - Broken Access Control |
| 2 | `sameSite: 'None'` disables CSRF protection | HIGH | A5 - Broken Access Control |
| 3 | No `domain` or `path` restriction on cookie | MEDIUM | A6 - Security Misconfiguration |
| 4 | No `Max-Age` or `Expires` on cookie | LOW | A6 - Security Misconfiguration |

**1. CORS Wildcard with Credentials (CRITICAL)** -- The CORS origin callback returns `true` for every origin. Combined with `credentials: true`, this means any website on the internet can make authenticated cross-origin requests to this API and read the responses. This completely defeats the Same-Origin Policy.

An attacker can host a page at `https://evil.com` with JavaScript that makes `fetch('https://your-api.com/api/admin/users', { credentials: 'include' })` and read the full response, including any sensitive data. The browser will attach the session cookie (because `credentials: true` is set and `sameSite: 'None'`), and the server will return `Access-Control-Allow-Origin: https://evil.com` with `Access-Control-Allow-Credentials: true`, so the browser will allow `evil.com` to read the response.

This is a full account takeover vector. Any authenticated user who visits a malicious page will have their session hijacked.

**2. `sameSite: 'None'` (HIGH)** -- Setting `sameSite: 'None'` explicitly disables the browser's built-in CSRF protection for this cookie. The cookie will be sent on all cross-site requests. Combined with the open CORS policy, this is extremely dangerous. `sameSite: 'Lax'` or `sameSite: 'Strict'` should be used unless there is a legitimate cross-site requirement (e.g., an embedded iframe on a partner site).

### Remediated Code

```javascript
// Define an explicit allowlist of trusted origins
const ALLOWED_ORIGINS = new Set([
  'https://app.example.com',
  'https://admin.example.com',
]);

// In development only (never in production):
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.add('http://localhost:3000');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-to-server, curl)
    // only if appropriate for your use case
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight for 24 hours
};
app.use(cors(corsOptions));
```

```javascript
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',        // Changed from 'None' -- blocks cross-site sends
  path: '/',
  maxAge: 3600 * 1000,    // 1 hour
  // domain: '.example.com' // Set if needed for subdomains
});
```

Key changes: explicit origin allowlist instead of wildcard, `sameSite` changed to `Lax`, cookie max-age set, path restricted. If cross-site cookie sending is truly required (rare), keep `sameSite: 'None'` but the CORS origin allowlist becomes even more important.

---

## Summary

| Task | Critical | High | Medium | Low | Top Issue |
|------|----------|------|--------|-----|-----------|
| 1 - File Upload | 3 | 2 | 1 | 0 | Path traversal via unsanitized user input in filesystem path |
| 2 - Auth Middleware | 1 | 1 | 3 | 0 | Auth bypass via path variation (trailing slash, case) |
| 3 - Admin Endpoint | 4 | 0 | 2 | 0 | Authorization via query parameter -- any user can access all data |
| 4 - Password Reset | 1 | 3 | 2 | 0 | Predictable token from MD5 of timestamp enables account takeover |
| 5 - CORS + Cookie | 1 | 1 | 1 | 1 | Open CORS with credentials enables cross-site session hijacking |
| **Total** | **10** | **7** | **9** | **1** | |

All five code samples contain CRITICAL vulnerabilities that could lead to data breaches or account takeover in a production environment. None of these code samples are safe to deploy without remediation.
