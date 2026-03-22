# Security Review Report

## Task 1

**File Upload Handler (Node.js)**

### Vulnerability 1 -- Path Traversal

**Severity: CRITICAL**

Both `req.body.username` and `file.name` are user-controlled and injected directly into the file path with no sanitization. An attacker can use directory traversal sequences to write files anywhere on the filesystem.

**Attack vector:** A user submits `username=../../etc/cron.d` and `file.name=malicious-job` (or `file.name=../../etc/passwd`). The resulting path becomes `./uploads/../../etc/cron.d/malicious-job`, allowing arbitrary file write. This leads to Remote Code Execution (RCE) on most systems.

### Vulnerability 2 -- No File Type Validation

**Severity: HIGH**

There is no check on the file extension, MIME type, or file content. An attacker can upload executable files (`.php`, `.jsp`, `.sh`, `.exe`), web shells, or HTML files containing JavaScript (stored XSS).

**Attack vector:** Upload a `.html` file containing malicious JavaScript. If the uploads directory is served by the web server, any user who visits the URL executes the attacker's script in the context of the application domain.

### Vulnerability 3 -- No File Size Limit

**Severity: HIGH**

No maximum file size is enforced. An attacker can upload arbitrarily large files to exhaust disk space, causing denial of service.

### Vulnerability 4 -- No Authentication or Authorization Check

**Severity: HIGH**

The endpoint has no visible auth middleware. Any anonymous user can upload files.

### Vulnerability 5 -- Error Message Leaks Internal Details

**Severity: MEDIUM**

`res.status(500).send(err.message)` exposes internal error messages (file paths, OS details) to the client.

### Secure Fix

```javascript
const path = require('path');
const crypto = require('crypto');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');

app.post('/upload', authenticate, (req, res) => {
  if (!req.files || !req.files.avatar) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const file = req.files.avatar;

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: 'File too large' });
  }

  // Validate file extension
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return res.status(400).json({ error: 'File type not allowed' });
  }

  // Generate safe filename -- never use user input in paths
  const safeFilename = crypto.randomUUID() + ext;
  const destPath = path.join(UPLOADS_DIR, safeFilename);

  // Verify the resolved path is within UPLOADS_DIR (defense in depth)
  if (!destPath.startsWith(UPLOADS_DIR + path.sep)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  file.mv(destPath, (err) => {
    if (err) {
      console.error('Upload failed:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }
    res.json({ message: 'Uploaded', filename: safeFilename });
  });
});
```

---

## Task 2

**Authentication Middleware (Python/Flask)**

### Vulnerability 1 -- No Token Expiration Enforcement

**Severity: HIGH**

The code decodes the JWT but does not verify or enforce expiration. If the token contains an `exp` claim, PyJWT will check it by default, but there is no guarantee every token has one. If tokens are issued without `exp`, they are valid forever. A stolen token grants permanent access.

**Attack vector:** An attacker obtains a token (via XSS, log exposure, shoulder surfing). Without expiration, the token works indefinitely, even after a user changes their password.

### Vulnerability 2 -- Bare `except` Swallows All Errors

**Severity: MEDIUM**

The bare `except:` clause catches every exception, including `SystemExit`, `KeyboardInterrupt`, and programming errors (e.g., `KeyError` if `user_id` is missing from the payload). This masks bugs and makes debugging extremely difficult. A malformed but validly-signed token missing `user_id` would cause `g.user_id` assignment to fail, but the user would simply get a generic 401 rather than a proper error being logged.

**Attack vector:** Not directly exploitable, but masks logic errors that could lead to security bypass in edge cases.

### Vulnerability 3 -- Allowlisted Paths Use Exact Match Only

**Severity: MEDIUM**

The path allowlist uses exact string matching. An attacker can bypass auth by appending trailing slashes or using path variations: `/health/`, `/login/../../api/secret`. Depending on the framework and WSGI server, these may route to different handlers while bypassing the auth check.

**Attack vector:** Request `/health/../api/admin/data`. Some WSGI servers normalize paths before routing but after the `before_request` hook runs, potentially bypassing the check.

### Vulnerability 4 -- Weak Secret Key Risk

**Severity: MEDIUM**

The security of the entire auth system depends on `app.config['SECRET_KEY']`. If this is a weak or default value (common in Flask tutorials), an attacker can forge arbitrary tokens.

### Vulnerability 5 -- No Token Revocation Mechanism

**Severity: MEDIUM**

There is no check against a revocation list or database. Compromised tokens cannot be invalidated before expiry.

### Secure Fix

```python
import logging

logger = logging.getLogger(__name__)

OPEN_PATHS = frozenset(['/login', '/register', '/health'])

@app.before_request
def check_auth():
    # Normalize path to prevent bypass via trailing slashes or double slashes
    normalized = request.path.rstrip('/')
    if normalized in OPEN_PATHS or request.path in OPEN_PATHS:
        return

    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        payload = jwt.decode(
            token,
            app.config['SECRET_KEY'],
            algorithms=['HS256'],
            options={"require": ["exp", "user_id"]}
        )
        # Optionally check a revocation list
        if is_token_revoked(payload.get('jti')):
            return jsonify({'error': 'Token revoked'}), 401

        g.user_id = payload['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token attempt: {e}")
        return jsonify({'error': 'Unauthorized'}), 401
```

---

## Task 3

**Admin API Endpoint (Node.js)**

### Vulnerability 1 -- Broken Access Control via Query Parameter

**Severity: CRITICAL**

Admin access is determined solely by checking `req.query.admin === 'true'`. Any user can append `?admin=true` to the URL and gain full admin access. There is no authentication or role-based authorization whatsoever. This is a textbook Broken Access Control vulnerability (OWASP A01:2021).

**Attack vector:** Any unauthenticated user sends `GET /api/admin/users?admin=true` and receives the full user database including passwords and SSNs.

### Vulnerability 2 -- Exposure of Passwords and SSNs

**Severity: CRITICAL**

The query explicitly selects sensitive fields with `+password` and `+ssn`. Even if the access control were fixed, returning password hashes and Social Security Numbers in an API response is a severe data exposure risk. Password hashes can be cracked offline. SSN exposure violates virtually all data protection regulations (PCI DSS, GDPR, CCPA, HIPAA).

**Attack vector:** Combined with the access control bypass above, any anonymous user can harvest every user's password hash and SSN.

### Vulnerability 3 -- No Pagination or Rate Limiting

**Severity: MEDIUM**

`User.find({})` returns all users. With a large database, this is a denial-of-service vector and makes data exfiltration trivial in a single request.

### Secure Fix

```javascript
// Middleware to verify JWT and role
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);

  const users = await User.find({})
    .select('-password -ssn -resetToken')  // Never return sensitive fields
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await User.countDocuments({});

  res.json({
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});
```

---

## Task 4

**Password Reset Flow (Python/Django)**

### Vulnerability 1 -- Predictable Reset Token (MD5 of Timestamp)

**Severity: CRITICAL**

The token is `md5(str(time.time()))`. `time.time()` returns the current Unix timestamp, which is predictable to within a narrow range. An attacker who knows approximately when a reset was requested (e.g., because they triggered it) can brute-force the token by computing MD5 hashes for timestamps in that window. At microsecond granularity, a one-second window is only about 1,000,000 candidates, trivially brutable.

**Attack vector:** Attacker requests a password reset for a victim's email. They note the current time. They brute-force MD5 hashes for timestamps within a few seconds of the request time and try each as the reset token. Full account takeover follows.

### Vulnerability 2 -- No Token Expiration

**Severity: HIGH**

The reset token has no expiry time. Once generated, it remains valid indefinitely in the database. Tokens from months or years ago can still be used.

**Attack vector:** A leaked or intercepted token from any point in history can be used for account takeover.

### Vulnerability 3 -- User Enumeration

**Severity: MEDIUM**

If `User.objects.get(email=email)` raises `User.DoesNotExist`, the resulting unhandled exception (500 error) reveals that the email is not registered. If it succeeds, the user gets a 200 response. This difference allows enumeration of valid email addresses.

**Attack vector:** Attacker iterates through a list of email addresses, observing the response to determine which ones have accounts.

### Vulnerability 4 -- No Rate Limiting

**Severity: MEDIUM**

No rate limiting on the reset endpoint. An attacker can flood an email address with reset emails (email bombing) or brute-force tokens.

### Vulnerability 5 -- Unvalidated Email Input

**Severity: MEDIUM**

The email from `request.POST['email']` is used directly in a database query and in `send_email` without validation. Depending on the email library, this could enable email header injection.

### Secure Fix

```python
import secrets
from django.utils import timezone
from datetime import timedelta
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def reset_password(request):
    email = request.POST.get('email', '').strip().lower()

    # Always return the same response to prevent user enumeration
    success_response = JsonResponse({'status': 'sent'})

    try:
        validate_email(email)
    except ValidationError:
        return success_response  # Same response regardless

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return success_response  # Same response regardless

    # Rate limit: no more than 1 reset per 60 seconds per user
    if user.reset_token_created_at and \
       timezone.now() - user.reset_token_created_at < timedelta(seconds=60):
        return success_response

    # Cryptographically secure random token
    token = secrets.token_urlsafe(48)

    user.reset_token = token
    user.reset_token_created_at = timezone.now()
    user.reset_token_expires_at = timezone.now() + timedelta(hours=1)
    user.save(update_fields=[
        'reset_token', 'reset_token_created_at', 'reset_token_expires_at'
    ])

    send_email(
        email,
        f"Reset link: https://app.com/reset?token={token}"
    )

    return success_response
```

The corresponding reset handler must also verify:
```python
def confirm_reset(request):
    token = request.POST.get('token', '')
    user = User.objects.filter(
        reset_token=token,
        reset_token_expires_at__gt=timezone.now()
    ).first()

    if not user:
        return JsonResponse({'error': 'Invalid or expired token'}, status=400)

    # Invalidate token immediately (single use)
    user.reset_token = None
    user.reset_token_expires_at = None
    user.set_password(request.POST['new_password'])
    user.save()
```

---

## Task 5

**CORS Configuration and Cookie Settings (Node.js)**

### Vulnerability 1 -- CORS Allows All Origins with Credentials

**Severity: CRITICAL**

The `origin` callback always calls `callback(null, true)`, which reflects any `Origin` header back as `Access-Control-Allow-Origin`. Combined with `credentials: true` (which sets `Access-Control-Allow-Credentials: true`), this allows any website on the internet to make authenticated cross-origin requests to the API. The browser will attach cookies, and the response will be readable by the attacker's page.

**Attack vector:** An attacker hosts a malicious page at `https://evil.com`. When a logged-in user visits it, JavaScript on that page sends `fetch('https://app.com/api/user/data', { credentials: 'include' })`. The browser attaches the session cookie. The CORS headers permit `evil.com` to read the response. The attacker exfiltrates the victim's data. This is a full Cross-Site Request Forgery and data theft vector that bypasses the `SameSite=None` cookie protection.

### Vulnerability 2 -- SameSite=None Disables CSRF Protection

**Severity: HIGH**

Setting `sameSite: 'None'` on the session cookie means the browser will send it on all cross-site requests. This is required for legitimate cross-origin scenarios, but combined with the open CORS policy above, it removes the last line of defense against cross-origin attacks. Even without the CORS misconfiguration, `SameSite=None` increases the attack surface for CSRF.

### Vulnerability 3 -- No CSRF Token Mechanism

**Severity: HIGH**

With `SameSite=None` and open CORS, there is no visible CSRF token mechanism. State-changing requests (POST, PUT, DELETE) can be forged from any origin.

### Secure Fix

```javascript
// Whitelist of allowed origins
const ALLOWED_ORIGINS = new Set([
  'https://app.com',
  'https://admin.app.com',
]);

// Add staging/dev origins only in non-production
if (process.env.NODE_ENV !== 'production') {
  ALLOWED_ORIGINS.add('http://localhost:3000');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    // only if appropriate for your use case
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, origin || true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  maxAge: 86400,
};
app.use(cors(corsOptions));

// Cookie: use SameSite=Strict or Lax if not doing cross-origin auth
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',  // Or 'Lax' if you need top-level navigation
  maxAge: 3600000,      // 1 hour
  path: '/',
});
```

If cross-origin cookies are truly required (e.g., a separate API domain), keep `sameSite: 'None'` but enforce a strict origin allowlist and add a CSRF token mechanism:

```javascript
const csrf = require('csurf');
app.use(csrf({ cookie: { httpOnly: true, secure: true, sameSite: 'Strict' } }));
```

---

## Summary

| Task | Vulnerabilities | CRITICAL | HIGH | MEDIUM |
|------|----------------|----------|------|--------|
| 1 - File Upload | 5 | 1 | 3 | 1 |
| 2 - Auth Middleware | 5 | 0 | 1 | 4 |
| 3 - Admin Endpoint | 3 | 2 | 0 | 1 |
| 4 - Password Reset | 5 | 1 | 1 | 3 |
| 5 - CORS + Cookies | 3 | 1 | 2 | 0 |
| **Total** | **21** | **5** | **7** | **9** |

The most dangerous findings are:

1. **Task 3** -- Admin access controlled by a query parameter, with passwords and SSNs returned. This is the most immediately exploitable and damaging issue.
2. **Task 5** -- Open CORS with credentials allows any website to steal authenticated user data.
3. **Task 1** -- Path traversal enables arbitrary file write, leading to RCE.
4. **Task 4** -- Predictable reset tokens enable account takeover.

All CRITICAL findings require immediate remediation before any of this code is deployed to production.
