## Task 1 -- Node.js File Upload Handler

### Vulnerabilities Found

**1. Path Traversal via `username` -- CRITICAL**

`req.body.username` is user-controlled and never sanitized. An attacker can supply `../../etc/cron.d` or similar values to write files anywhere on the filesystem.

```javascript
// Malicious request body:
{ "username": "../../etc/cron.d", "avatar": malicious_file }
// Resulting path: ./uploads/../../etc/cron.d/malicious_file
```

**2. Path Traversal via `file.name` -- CRITICAL**

`file.name` is also user-controlled. A filename like `../../../etc/passwd` bypasses the intended directory entirely.

**3. No File Type Validation -- HIGH**

There is no check on file extension or MIME type. An attacker can upload `.js`, `.sh`, `.php`, `.html`, or any executable file. If the uploads directory is served statically, this leads directly to Remote Code Execution or Stored XSS.

**4. No File Size Limit -- MEDIUM**

No size restriction is enforced, enabling denial-of-service via disk exhaustion.

**5. No Authentication -- CRITICAL**

The route has no auth middleware. Any unauthenticated user can upload files.

**6. Error Message Leaks Internal Details -- LOW**

`res.status(500).send(err.message)` may expose filesystem paths or OS-level error details to the client.

### Fixed Code

```javascript
const path = require('path');
const crypto = require('crypto');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

app.post('/upload', authMiddleware, (req, res) => {
  if (!req.files || !req.files.avatar) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const file = req.files.avatar;

  if (file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: 'File too large' });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return res.status(400).json({ error: 'File type not allowed' });
  }

  // Generate a safe filename -- no user input in path
  const safeName = crypto.randomUUID() + ext;
  const uploadDir = path.resolve(__dirname, 'uploads', req.user.id);
  const dest = path.join(uploadDir, safeName);

  // Verify the resolved path is still inside the uploads directory
  if (!dest.startsWith(path.resolve(__dirname, 'uploads'))) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  file.mv(dest, (err) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    res.json({ message: 'Uploaded', filename: safeName });
  });
});
```

---

## Task 2 -- Python Authentication Middleware

### Vulnerabilities Found

**1. Bare `except` Swallows All Errors -- HIGH**

The bare `except:` catches every exception, including `KeyError`, `TypeError`, and even `SystemExit`. If `SECRET_KEY` is misconfigured or missing, the middleware silently returns 401 instead of surfacing a server error.

**2. No Token Expiration Enforcement -- HIGH**

There is no check for an `exp` claim. If the token was issued without an expiration, stolen tokens remain valid forever.

**3. Incomplete Path Whitelist -- MEDIUM**

The whitelist uses exact string matching. It does not account for trailing slashes (`/login/`), query strings, or path variations. An attacker may be able to bypass the check.

**4. No Token Revocation Mechanism -- MEDIUM**

There is no blacklist or server-side session store. A compromised token cannot be invalidated before its natural expiry.

### Fixed Code

```python
import jwt as pyjwt

EXEMPT_PATHS = frozenset(['/login', '/register', '/health'])

@app.before_request
def check_auth():
    normalized = request.path.rstrip('/')
    if normalized in EXEMPT_PATHS:
        return

    token = request.headers.get('Authorization', '').replace('Bearer ', '', 1)
    if not token:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        payload = pyjwt.decode(
            token,
            app.config['SECRET_KEY'],
            algorithms=['HS256'],
            options={"require": ["exp", "user_id"]},
        )
        if is_token_revoked(payload.get('jti')):
            return jsonify({'error': 'Token revoked'}), 401
        g.user_id = payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'error': 'Unauthorized'}), 401
```

---

## Task 3 -- Admin Users API Endpoint

### Vulnerabilities Found

**1. Authorization Based on Query Parameter -- CRITICAL**

Admin access is granted when `req.query.admin === 'true'`. Any user can simply append `?admin=true` to the URL. This is not authentication or authorization; it is a publicly accessible switch.

**2. Passwords and SSNs Returned in Response -- CRITICAL**

`.select('+password +ssn')` explicitly includes fields that should never leave the database layer. Returning password hashes and SSNs in an API response is a severe data exposure risk violating PCI-DSS, GDPR, HIPAA, and virtually every data-protection standard.

**3. No Authentication Middleware -- CRITICAL**

The route has no auth middleware at all. It is fully accessible without any credentials.

**4. No Pagination -- MEDIUM**

`User.find({})` returns every user in the database, enabling denial of service and excessive data exposure.

### Fixed Code

```javascript
app.get(
  '/api/admin/users',
  authMiddleware,
  requireRole('admin'),
  async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const users = await User.find({})
      .select('-password -ssn -resetToken')
      .skip((page - 1) * limit)
      .limit(limit);

    auditLog.info({ action: 'admin_list_users', adminId: req.user.id, ip: req.ip });
    res.json({ users, page, limit });
  }
);
```

---

## Task 4 -- Password Reset Flow

### Vulnerabilities Found

**1. Predictable Reset Token (MD5 of Timestamp) -- CRITICAL**

`hashlib.md5(str(time.time()).encode()).hexdigest()` is trivially predictable. An attacker who knows the approximate time of the request can generate all possible tokens and brute-force the reset link.

**2. No Token Expiration -- HIGH**

The reset token has no expiry timestamp. Once generated, it remains valid indefinitely.

**3. No Rate Limiting -- HIGH**

An attacker can flood any email address with reset emails or enumerate valid accounts.

**4. User Enumeration -- MEDIUM**

`User.objects.get(email=email)` will raise `User.DoesNotExist` for unknown emails, allowing account enumeration.

**5. Token Not Invalidated After Use -- MEDIUM**

No code clears the token after a successful password reset, so the same link could be reused.

### Fixed Code

```python
import secrets
from django.utils import timezone

def reset_password(request):
    email = request.POST.get('email', '').strip().lower()
    generic_response = JsonResponse({'status': 'If that email exists, a reset link was sent.'})

    try:
        validate_email(email)
    except ValidationError:
        return generic_response

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return generic_response

    if user.reset_token_created and user.reset_token_created > timezone.now() - timedelta(seconds=60):
        return generic_response

    token = secrets.token_urlsafe(48)
    user.reset_token = hashlib.sha256(token.encode()).hexdigest()
    user.reset_token_created = timezone.now()
    user.save(update_fields=['reset_token', 'reset_token_created'])

    send_email(email, f"Reset link: https://app.com/reset?token={token}")
    return generic_response
```

---

## Task 5 -- CORS Configuration and Cookie Settings

### Vulnerabilities Found

**1. CORS Allows All Origins with Credentials -- CRITICAL**

The `origin` callback unconditionally calls `callback(null, true)`, reflecting any requesting origin as allowed. Combined with `credentials: true`, any website on the internet can make authenticated cross-origin requests and read the responses. This completely defeats the Same-Origin Policy.

**2. `sameSite: 'None'` Removes CSRF Protection -- HIGH**

Setting `sameSite: 'None'` explicitly tells the browser to send the session cookie on all cross-site requests. Combined with the open CORS policy, CSRF and cross-origin data theft are trivial.

**3. No CSRF Token Mechanism -- HIGH**

With `sameSite: 'None'` and open CORS, there is no remaining layer of CSRF protection.

### Fixed Code

```javascript
const ALLOWED_ORIGINS = new Set([
  'https://app.example.com',
  'https://admin.example.com',
]);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};
app.use(cors(corsOptions));

res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
  maxAge: 3600000,
  path: '/',
});
```

---

## Summary

| Task | Vulnerability | Severity |
|------|--------------|----------|
| 1 | Path traversal via `username` and `file.name` | CRITICAL |
| 1 | No file type validation | HIGH |
| 1 | No authentication on upload route | CRITICAL |
| 2 | Bare `except` hides errors | HIGH |
| 2 | No token expiration enforcement | HIGH |
| 3 | Auth check via query parameter `?admin=true` | CRITICAL |
| 3 | Passwords and SSNs returned in response | CRITICAL |
| 4 | Predictable reset token (MD5 of timestamp) | CRITICAL |
| 4 | No token expiration | HIGH |
| 4 | User enumeration | MEDIUM |
| 5 | CORS allows all origins with credentials | CRITICAL |
| 5 | `sameSite: 'None'` removes CSRF protection | HIGH |

**Total: 6 CRITICAL, 6 HIGH, 4 MEDIUM, 1 LOW across all five tasks.**
