## Task 1

### Node.js File Upload Handler Review

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

#### Vulnerability 1: Path Traversal via `req.body.username`

- **Severity:** CRITICAL
- **Attack Vector:** An attacker sets `username` to `../../etc/cron.d` or `../../../app` to write files to arbitrary locations on the filesystem. For example, `username=../../` combined with a filename like `malicious.js` could overwrite application code or system files.
- **Impact:** Arbitrary file write anywhere the process has permission. Can lead to remote code execution by overwriting application files, cron jobs, or SSH keys.

#### Vulnerability 2: Path Traversal via `file.name`

- **Severity:** CRITICAL
- **Attack Vector:** The original filename from the client is used directly. An attacker crafts a multipart upload where the filename is `../../../etc/passwd` or `..%2F..%2Fapp.js`. This bypasses the intended upload directory.
- **Impact:** Same as above -- arbitrary file write.

#### Vulnerability 3: No Authentication or Authorization

- **Severity:** CRITICAL
- **Attack Vector:** The endpoint has no authentication middleware. Any unauthenticated user can upload files, potentially filling disk space or uploading malicious content.
- **Impact:** Denial of service, malware hosting, unauthorized resource consumption.

#### Vulnerability 4: No File Type Validation

- **Severity:** HIGH
- **Attack Vector:** An attacker uploads executable files (.php, .jsp, .sh, .exe), HTML files containing XSS payloads, or server-side scripts. If the uploads directory is web-accessible, the attacker can execute arbitrary code on the server.
- **Impact:** Remote code execution if upload directory is served by a web server. Stored XSS if HTML files are served.

#### Vulnerability 5: No File Size Limit

- **Severity:** HIGH
- **Attack Vector:** An attacker uploads extremely large files repeatedly to exhaust disk space or memory.
- **Impact:** Denial of service.

#### Vulnerability 6: Error Message Leaks Internal Information

- **Severity:** MEDIUM
- **Attack Vector:** `res.status(500).send(err.message)` exposes internal error details (file paths, OS information, permission errors) to the client.
- **Impact:** Information disclosure that aids further attacks.

#### Secure Code Fix

```javascript
const path = require('path');
const crypto = require('crypto');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = path.resolve(__dirname, 'uploads');

app.post('/upload', authMiddleware, (req, res) => {
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
  const destDir = path.join(UPLOAD_DIR, req.user.id);
  const destPath = path.join(destDir, safeFilename);

  // Verify the resolved path is still within the upload directory
  if (!destPath.startsWith(UPLOAD_DIR)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  // Ensure user directory exists
  require('fs').mkdirSync(destDir, { recursive: true });

  file.mv(destPath, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }
    res.json({ message: 'Uploaded', filename: safeFilename });
  });
});
```

Key changes: authentication required, random filenames instead of user-supplied names, allowlist for extensions, file size limit, path containment check, generic error messages.

---

## Task 2

### Python Authentication Middleware Review

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

#### Vulnerability 1: Path Bypass via Trailing Slash and Case Variation

- **Severity:** CRITICAL
- **Attack Vector:** The path whitelist uses exact string matching. An attacker accesses `/login/`, `/Login`, `/health?`, or `/register/` to bypass the check entirely, because these paths are not in the list. Flask normalizes trailing slashes depending on the route definition, but the auth check happens before routing, so `/admin/../login` or URL-encoded variants like `/%6Cogin` may also bypass the check.
- **Impact:** Complete authentication bypass on all protected endpoints.

#### Vulnerability 2: Bare `except` Swallows All Errors

- **Severity:** MEDIUM
- **Attack Vector:** The bare `except:` clause catches not just JWT errors but also `KeyError` (if `user_id` missing from payload), `TypeError`, and even `SystemExit` or `KeyboardInterrupt`. An attacker with a valid but manipulated token (missing `user_id` field) gets a generic 401 instead of proper error handling, and debugging becomes impossible. More critically, if `app.config['SECRET_KEY']` is misconfigured and raises an error, the system silently returns 401 instead of alerting operators to a configuration problem.
- **Impact:** Masked configuration errors, silent failures, difficult debugging.

#### Vulnerability 3: No Token Expiration Enforcement

- **Severity:** HIGH
- **Attack Vector:** The code does not check for or require an `exp` claim in the JWT. PyJWT will not enforce expiration unless the token contains an `exp` claim AND `require=["exp"]` is passed (or `options={"require": ["exp"]}`). If tokens are issued without `exp`, they are valid forever. A stolen token can be reused indefinitely.
- **Impact:** Permanent session compromise if a token is leaked.

#### Vulnerability 4: No Token Revocation Mechanism

- **Severity:** MEDIUM
- **Attack Vector:** JWTs are stateless. If a user's account is compromised, there is no way to revoke existing tokens. The attacker retains access until the token expires (and per the previous finding, it may never expire).
- **Impact:** Inability to respond to account compromise.

#### Vulnerability 5: Static Path Whitelist Does Not Scale

- **Severity:** MEDIUM
- **Attack Vector:** As the application grows, developers may forget to add public routes to the whitelist, or accidentally add sensitive routes. A prefix-match approach (e.g., `/api/public/`) or decorator-based authentication is more maintainable and less error-prone.
- **Impact:** Accidental exposure or lockout of endpoints.

#### Secure Code Fix

```python
from functools import wraps
import jwt as pyjwt

PUBLIC_PATH_PREFIXES = ('/login', '/register', '/health')

@app.before_request
def check_auth():
    # Use startswith for prefix matching, normalize path
    normalized = request.path.rstrip('/')
    if any(normalized == p or normalized.startswith(p + '/') for p in PUBLIC_PATH_PREFIXES):
        return

    token = request.headers.get('Authorization', '')
    if not token.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401

    token = token[7:]  # Remove 'Bearer ' prefix safely

    try:
        payload = pyjwt.decode(
            token,
            app.config['SECRET_KEY'],
            algorithms=['HS256'],
            options={"require": ["exp", "iat", "user_id"]}
        )
        g.user_id = payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except KeyError:
        return jsonify({'error': 'Malformed token'}), 401
```

Key changes: path normalization, specific exception handling, required claims including `exp`, safe token prefix extraction.

---

## Task 3

### Admin API Endpoint Review

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

#### Vulnerability 1: Authorization Based on Query Parameter

- **Severity:** CRITICAL
- **Attack Vector:** Admin access is determined solely by whether `?admin=true` is present in the URL. Any user (or unauthenticated visitor) can access admin functionality by appending `?admin=true` to the request. This is not authentication or authorization -- it is a client-side trust check that provides zero security.
- **Impact:** Complete unauthorized access to all user data including passwords and SSNs. This is a total system compromise.

#### Vulnerability 2: Exposure of Password Hashes and SSNs

- **Severity:** CRITICAL
- **Attack Vector:** The query explicitly selects `+password` and `+ssn` -- fields that are excluded by default in the schema (indicated by the `+` prefix in Mongoose). Even for a legitimate admin endpoint, returning password hashes and SSNs over the network is extremely dangerous. Password hashes can be cracked offline. SSNs are protected under regulations like PCI-DSS, GDPR, and various data protection laws.
- **Impact:** Mass credential exposure enabling offline password cracking. Mass PII (SSN) exposure creating legal liability and enabling identity theft. Regulatory violations (GDPR, CCPA, PCI-DSS).

#### Vulnerability 3: No Pagination or Rate Limiting

- **Severity:** HIGH
- **Attack Vector:** `User.find({})` returns all users in the database. An attacker (or even a legitimate admin) can trigger a query that returns millions of records, causing memory exhaustion and denial of service.
- **Impact:** Denial of service, potential data exfiltration of entire user database in a single request.

#### Vulnerability 4: No Audit Logging

- **Severity:** MEDIUM
- **Attack Vector:** Access to sensitive admin operations is not logged. When a breach is discovered, there is no audit trail to determine who accessed the data or when.
- **Impact:** Inability to detect, investigate, or respond to breaches.

#### Secure Code Fix

```javascript
const requireAdmin = async (req, res, next) => {
  // Authenticate via token/session (not query parameter)
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role !== 'admin') {
    logger.warn('Unauthorized admin access attempt', {
      userId: req.user.id,
      path: req.path,
      ip: req.ip
    });
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  // Never select password or SSN -- not even for admins
  const users = await User.find({})
    .select('-password -ssn -resetToken')
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments({});

  // Audit log
  logger.info('Admin user list accessed', {
    adminId: req.user.id,
    page,
    limit,
    ip: req.ip
  });

  res.json({ users, page, limit, total });
});
```

Key changes: real authentication and role-based authorization middleware, password and SSN fields permanently excluded, pagination with limits, audit logging.

---

## Task 4

### Password Reset Flow Review

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

#### Vulnerability 1: Predictable Reset Token (MD5 of Timestamp)

- **Severity:** CRITICAL
- **Attack Vector:** The token is `md5(str(time.time()))`. `time.time()` has limited precision (typically microseconds). An attacker who knows approximately when the reset was requested can brute-force the token by trying all timestamps within a window. For example, a 10-second window at microsecond precision is only around 10 million MD5 hashes, which takes under a second on modern hardware. The attacker can then use the token to reset any user's password.
- **Impact:** Complete account takeover for any user.

#### Vulnerability 2: User Enumeration

- **Severity:** HIGH
- **Attack Vector:** `User.objects.get(email=email)` raises `User.DoesNotExist` when the email is not in the database. If this exception is unhandled (which it is -- there is no try/except), the server returns a 500 error for non-existent emails but a 200 with `{'status': 'sent'}` for valid emails. This allows an attacker to enumerate which email addresses have accounts.
- **Impact:** Attackers can build a list of valid accounts for targeted attacks, credential stuffing, or phishing.

#### Vulnerability 3: No Token Expiration

- **Severity:** HIGH
- **Attack Vector:** The token is stored without a timestamp or expiration field. A reset token remains valid indefinitely until it is used or a new one is generated. If a reset email is intercepted or found later (in email logs, backups, etc.), the token can be used at any time.
- **Impact:** Stale tokens remain exploitable long after the reset was requested.

#### Vulnerability 4: No Rate Limiting

- **Severity:** MEDIUM
- **Attack Vector:** An attacker can call this endpoint in a loop to flood a victim's inbox with reset emails (email bombing) or to brute-force timing-based tokens by rapidly triggering resets and trying tokens corresponding to the expected timestamps.
- **Impact:** Email flooding, facilitates token brute-force, resource exhaustion.

#### Vulnerability 5: Token Not Hashed in Database

- **Severity:** MEDIUM
- **Attack Vector:** The reset token is stored in plaintext in the database. If the database is compromised (SQL injection, backup leak, insider threat), attackers can read all active reset tokens and use them to take over accounts.
- **Impact:** Mass account takeover if database is breached.

#### Vulnerability 6: Unvalidated Email Input

- **Severity:** MEDIUM
- **Attack Vector:** `request.POST['email']` is used directly without validation. While Django's ORM prevents SQL injection, the lack of input validation means the endpoint could be used with malformed input, and the `send_email` call could be affected depending on its implementation.
- **Impact:** Potential header injection in emails if `send_email` does not sanitize, unexpected errors from malformed input.

#### Secure Code Fix

```python
import secrets
import hashlib
from django.utils import timezone
from datetime import timedelta
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def reset_password(request):
    email = request.POST.get('email', '').strip().lower()

    # Always return same response to prevent user enumeration
    success_response = JsonResponse({'status': 'sent'})

    try:
        validate_email(email)
    except ValidationError:
        return success_response

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return success_response

    # Rate limit: no more than 1 reset per 60 seconds per user
    if user.reset_requested_at and \
       timezone.now() - user.reset_requested_at < timedelta(seconds=60):
        return success_response

    # Generate cryptographically secure token
    raw_token = secrets.token_urlsafe(32)

    # Store hashed token in database (like passwords, never store plaintext)
    user.reset_token = hashlib.sha256(raw_token.encode()).hexdigest()
    user.reset_token_expires = timezone.now() + timedelta(hours=1)
    user.reset_requested_at = timezone.now()
    user.save()

    send_email(
        email,
        f"Reset link: https://app.com/reset?token={raw_token}"
    )
    return success_response
```

Key changes: cryptographically secure token (`secrets.token_urlsafe`), hashed token storage, expiration timestamp, uniform response to prevent enumeration, rate limiting, input validation.

---

## Task 5

### CORS Configuration and Cookie Setting Review

```javascript
// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);  // Allows ALL origins
  },
  credentials: true,
};
app.use(cors(corsOptions));
```

```javascript
// Cookie setting
res.cookie('session', token, { httpOnly: true, sameSite: 'None', secure: true });
```

#### Vulnerability 1: CORS Allows All Origins with Credentials

- **Severity:** CRITICAL
- **Attack Vector:** The CORS callback always returns `true`, meaning any website on the internet can make credentialed cross-origin requests to this API. Combined with `credentials: true`, the browser will include cookies (including the session cookie) with requests from any origin. An attacker hosts a malicious page at `evil.com` that makes fetch requests with `credentials: 'include'` to the API. The browser sends the session cookie, and the attacker can read the response -- effectively performing CSRF and data theft simultaneously.
- **Impact:** Full account takeover from any malicious website the user visits. Unlike traditional CSRF (which is blind), this CORS misconfiguration allows the attacker to READ responses, enabling data exfiltration. Every authenticated endpoint is exploitable.

#### Vulnerability 2: `sameSite: 'None'` Disables SameSite Protection

- **Severity:** HIGH
- **Attack Vector:** Setting `sameSite: 'None'` explicitly disables the browser's SameSite cookie protection. This means the session cookie is sent with every cross-site request, including those from attacker-controlled pages. While `secure: true` ensures HTTPS, the lack of SameSite protection combined with the open CORS policy means the cookie is sent on every cross-origin request from any site.
- **Impact:** Enables cross-site request forgery. Removes a key defense-in-depth layer. Without the open CORS policy this would be moderate, but combined with Vulnerability 1 it is devastating.

#### Vulnerability 3: No CSRF Protection

- **Severity:** HIGH
- **Attack Vector:** With `sameSite: 'None'` and open CORS, there is no CSRF protection at all. There is no CSRF token, no origin validation, and the cookie-based SameSite defense is disabled. Any state-changing request (POST, PUT, DELETE) can be triggered from any website.
- **Impact:** Unauthorized actions performed on behalf of authenticated users.

#### Vulnerability 4: CORS Reflects Any Origin

- **Severity:** MEDIUM (amplifies the CRITICAL issue)
- **Attack Vector:** The `cors` middleware, when the callback returns `true`, reflects the requesting `Origin` header back as `Access-Control-Allow-Origin`. This means every origin gets a tailored CORS response. If this were changed to `Access-Control-Allow-Origin: *`, the browser would at least refuse to send credentials. The current configuration is actually worse than a wildcard because it combines origin reflection with `Access-Control-Allow-Credentials: true`.
- **Impact:** Amplifies Vulnerability 1 by ensuring every single origin is individually authorized with credential support.

#### Secure Code Fix

```javascript
// Define allowed origins explicitly
const ALLOWED_ORIGINS = new Set([
  'https://app.example.com',
  'https://admin.example.com',
]);

// Add development origin only in dev
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.add('http://localhost:3000');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, etc.)
    // Only if that is desired -- otherwise reject these too
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  maxAge: 86400, // Cache preflight for 24 hours
};
app.use(cors(corsOptions));

// Cookie with proper SameSite
res.cookie('session', token, {
  httpOnly: true,
  sameSite: 'Strict',  // Or 'Lax' if cross-site navigation is needed
  secure: true,
  maxAge: 3600000,     // 1 hour expiry
  path: '/',
});

// Additionally, implement CSRF token protection for state-changing requests
```

Key changes: explicit origin allowlist instead of blanket allow, `sameSite: 'Strict'` (or `'Lax'`), cookie expiration, recommendation for additional CSRF token protection.

---

## Summary

| Task | Findings | Most Severe | Primary Risk |
|------|----------|-------------|--------------|
| 1 - File Upload | 6 issues | CRITICAL | Path traversal leads to arbitrary file write / RCE |
| 2 - Auth Middleware | 5 issues | CRITICAL | Path bypass leads to full authentication bypass |
| 3 - Admin Endpoint | 4 issues | CRITICAL | Query parameter auth leads to total data breach |
| 4 - Password Reset | 6 issues | CRITICAL | Predictable token leads to account takeover |
| 5 - CORS/Cookies | 4 issues | CRITICAL | Open CORS with credentials enables cross-site account takeover |

**Overall Assessment:** All five code snippets contain CRITICAL vulnerabilities that would lead to severe security breaches in production. None of these code patterns should be deployed without the recommended fixes. The most dangerous are Task 3 (trivially exploitable data breach) and Task 5 (silent cross-site exploitation of all authenticated users).
