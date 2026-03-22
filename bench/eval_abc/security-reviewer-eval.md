# security-reviewer Evaluation (A/B/C)

## Task 1: sr-001

**Ground Truth Summary:** Must mention: path traversal via username (../../etc/passwd), path traversal via file.name, no file type validation (could upload .php, .js), error message leakage (err.message to client). Must not: miss the double path traversal vector. Structure: CRITICAL for path traversal, pattern-severity-fix table.

### Condition A (bare)
- must_mention coverage: 4/4 -- path traversal via username (hit, CRITICAL), path traversal via file.name (hit, CRITICAL), no file type validation (hit, HIGH), error message leakage (hit, MEDIUM)
- must_not violations: None -- both path traversal vectors explicitly identified.
- Completeness: 5 -- All four must-mentions plus no auth (CRITICAL), no file size limit (MEDIUM).
- Precision: 5 -- All claims accurate with concrete attack vectors.
- Actionability: 5 -- Full fix with path.basename, path.resolve, startsWith check, allowlist.
- Structure: 5 -- Each vulnerability has severity, description, attack vector, and fix.
- Efficiency: 5 -- Dense, well-organized.
- Depth: 5 -- Specific attack path (../../etc/cron.d for RCE), defense-in-depth with startsWith.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- path traversal via username (hit), path traversal via file.name (hit), no file type validation (hit, HIGH), error message leakage (hit, MEDIUM)
- must_not violations: None -- both traversal vectors identified explicitly.
- Completeness: 5 -- All must-mentions plus no auth (HIGH), no file size limit (HIGH).
- Precision: 5 -- All claims accurate.
- Actionability: 5 -- Full fix with crypto.randomUUID for filenames, path containment check, allowlist, size limit.
- Structure: 5 -- Each vulnerability has severity and fix.
- Efficiency: 5 -- Tight.
- Depth: 5 -- Uses randomUUID approach (eliminates traversal entirely), mentions stored XSS via HTML uploads.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- path traversal via username (hit, CRITICAL), path traversal via file.name (hit, CRITICAL), no file type validation (hit, HIGH), error message leakage (hit, MEDIUM)
- must_not violations: None.
- Completeness: 5 -- All must-mentions plus no auth (CRITICAL), no file size limit (HIGH).
- Precision: 5 -- All claims accurate with concrete attack vectors.
- Actionability: 5 -- Full fix with randomUUID, allowlist, size limit, auth middleware, path containment.
- Structure: 5 -- Each vulnerability has severity, attack vector, impact, and fix.
- Efficiency: 5 -- Dense, no filler. Code echo at top is brief.
- Depth: 5 -- Mentions URL-encoded traversal (..%2F), stored XSS, both traversal vectors with distinct examples.
- **Composite: 5.00**

---

## Task 2: sr-002

**Ground Truth Summary:** Must mention: bare except catches all exceptions including SystemExit/KeyboardInterrupt, path whitelist bypass via /login/../admin or /health?redirect=..., no token expiration check (depends on jwt.decode config). Must not: "hardcoded secret" (it reads from config, not hardcoded). Structure: severity per finding with proof.

### Condition A (bare)
- must_mention coverage: 3/3 -- bare except (hit, HIGH), path bypass (hit, CRITICAL), no token expiration (hit, HIGH)
- must_not violations: None -- does not claim hardcoded secret. Mentions HS256 shared secret risk but correctly notes it reads from config.
- Completeness: 5 -- All three must-mentions plus token revocation, HS256 risk.
- Precision: 5 -- All claims accurate. Path bypass correctly identifies trailing slash and path traversal vectors.
- Actionability: 5 -- Fix code with path normalization, specific exceptions, require exp.
- Structure: 5 -- Each finding has severity, description, attack vector, fix.
- Efficiency: 5 -- Dense.
- Depth: 5 -- Mentions WSGI server path normalization timing, KeyError from missing user_id, HS256 vs RS256.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 3/3 -- bare except (hit, MEDIUM), path bypass (hit, MEDIUM), no token expiration (hit, HIGH)
- must_not violations: None -- correctly notes secret reads from config.
- Completeness: 5 -- All must-mentions plus revocation, weak secret key risk.
- Precision: 4 -- Bare except at MEDIUM is arguably too low (catching SystemExit is serious). Path bypass at MEDIUM is also low for a potential auth bypass.
- Actionability: 5 -- Fix code with normalization, specific exceptions, require claims.
- Structure: 4 -- Findings present but severity calibration is off -- path bypass and bare except should be higher.
- Efficiency: 4 -- "Static path whitelist does not scale" (finding #5) is more architectural advice than security finding.
- Depth: 4 -- Path bypass analysis is less specific than A (mentions URL-encoded variants but less concrete).
- **Composite: 4.40**

### Condition C (v2 agents)
- must_mention coverage: 3/3 -- bare except (hit, MEDIUM), path bypass (hit, CRITICAL), no token expiration (hit, HIGH)
- must_not violations: None.
- Completeness: 5 -- All must-mentions plus revocation, static whitelist scalability.
- Precision: 4 -- Bare except at MEDIUM is debatable. Path bypass correctly at CRITICAL.
- Actionability: 5 -- Fix with startswith for prefix matching, specific exceptions, require claims.
- Structure: 5 -- Each finding has severity, attack vector, impact, fix.
- Efficiency: 4 -- "Static Path Whitelist Does Not Scale" is architectural padding.
- Depth: 5 -- Mentions /%6Cogin URL encoding bypass, WSGI normalization timing, detailed path bypass analysis.
- **Composite: 4.67**

---

## Task 3: sr-003

**Ground Truth Summary:** Must mention: authorization via query parameter (trivially bypassable), exposing password hashes and SSN in response, no rate limiting on sensitive data endpoint. Structure: all CRITICAL, fix suggestions for each.

### Condition A (bare)
- must_mention coverage: 3/3 -- query param auth (hit, CRITICAL), password/SSN exposure (hit, CRITICAL), no rate limiting/pagination (hit, MEDIUM)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. SSN and password separated into distinct findings.
- Precision: 5 -- All claims accurate. Correctly identifies +password and +ssn Mongoose select behavior.
- Actionability: 5 -- Fix with proper auth middleware, role-based access, pagination, -password -ssn select.
- Structure: 4 -- Rate limiting at MEDIUM rather than ground truth's implied CRITICAL. Password and SSN separation is good.
- Efficiency: 5 -- Dense.
- Depth: 5 -- Mentions OWASP A01:2021, offline cracking, regulatory implications (PCI-DSS, GDPR, CCPA).
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 3/3 -- query param auth (hit, CRITICAL), password/SSN exposure (hit, CRITICAL), no rate limiting (hit, MEDIUM)
- must_not violations: None.
- Completeness: 5 -- All must-mentions plus audit logging.
- Precision: 5 -- All claims accurate.
- Actionability: 5 -- Full fix with requireAdmin middleware, pagination, -password -ssn, audit log.
- Structure: 4 -- Rate limiting at MEDIUM, ground truth implies higher. But SSN+password at CRITICAL is correct.
- Efficiency: 5 -- Dense, audit logging is a good addition.
- Depth: 5 -- Regulatory implications, audit logging, separate audited endpoint suggestion for SSN viewing.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 3/3 -- query param auth (hit, CRITICAL), password/SSN exposure (hit, CRITICAL), no rate limiting (hit, HIGH)
- must_not violations: None.
- Completeness: 5 -- All must-mentions plus audit logging.
- Precision: 5 -- All claims accurate. Rate limiting at HIGH is closer to appropriate.
- Actionability: 5 -- Full fix with auth middleware, pagination, audit logging, -password -ssn.
- Structure: 5 -- Rate limiting at HIGH is more appropriate. Good audit logging addition.
- Efficiency: 5 -- Dense with code echo.
- Depth: 5 -- Mentions hashcat/John the Ripper, identity theft, PCI-DSS/GDPR/CCPA, mass exfiltration in single request.
- **Composite: 5.00**

---

## Task 4: sr-004

**Ground Truth Summary:** Must mention: MD5 of timestamp is predictable (not cryptographically random), no token expiration, user enumeration (different response for valid/invalid email), reset link over query parameter (may be logged). Must not: "use HTTPS" (it already uses HTTPS in the URL).

### Condition A (bare)
- must_mention coverage: 3/4 -- predictable token (hit, CRITICAL), no token expiration (hit, HIGH), user enumeration (hit, HIGH). Reset link in query parameter: not explicitly mentioned as a logging concern.
- must_not violations: None -- does not suggest HTTPS.
- Completeness: 4 -- Misses the query parameter logging concern. Adds rate limiting and token not invalidated after use.
- Precision: 5 -- All claims accurate. Microsecond brute-force analysis is correct.
- Actionability: 5 -- Full fix with secrets.token_urlsafe, expiration, uniform response, rate limiting.
- Structure: 5 -- Correct severities.
- Efficiency: 5 -- Dense.
- Depth: 5 -- Quantifies brute-force window (1M candidates in <1 second), mentions unhandled exception leaking enumeration.
- **Composite: 4.73**

### Condition B (v1 agents)
- must_mention coverage: 3/4 -- predictable token (hit, CRITICAL), no token expiration (hit, HIGH), user enumeration (hit, MEDIUM). Reset link query parameter logging: not explicitly called out.
- must_not violations: None.
- Completeness: 4 -- Misses query param logging concern. Adds rate limiting, unvalidated email input.
- Precision: 5 -- All claims accurate. User enumeration at MEDIUM is slightly low.
- Actionability: 5 -- Full fix with secrets.token_urlsafe, expiration, uniform response, validation, rate limiting.
- Structure: 4 -- User enumeration at MEDIUM rather than HIGH is debatable.
- Efficiency: 5 -- Dense.
- Depth: 5 -- Mentions email header injection risk, token not hashed in database.
- **Composite: 4.60**

### Condition C (v2 agents)
- must_mention coverage: 3/4 -- predictable token (hit, CRITICAL), no token expiration (hit, HIGH), user enumeration (hit, HIGH). Reset link query parameter: not explicitly mentioned.
- must_not violations: None.
- Completeness: 4 -- Misses query param logging concern. Adds rate limiting, unvalidated email, token not hashed.
- Precision: 5 -- All claims accurate. User enumeration at HIGH is correct.
- Actionability: 5 -- Full fix with secrets.token_urlsafe, sha256 hashed storage, expiration, uniform response, rate limiting, validation.
- Structure: 5 -- Correct severities.
- Efficiency: 5 -- Dense, well-organized.
- Depth: 5 -- Token hashing in database is a strong addition. 10-second brute-force window quantified. Email header injection noted.
- **Composite: 4.73**

---

## Task 5: sr-005

**Ground Truth Summary:** Must mention: CORS allows ALL origins with credentials (critical misconfiguration), any site can make authenticated requests and read responses. Must not: "cookie is insecure" (httpOnly + secure + sameSite are correctly set). Structure: CRITICAL for CORS, note that cookie config itself is actually fine.

### Condition A (bare)
- must_mention coverage: 2/2 -- CORS allows all origins with credentials (hit, CRITICAL), any site can make authenticated requests and read responses (hit, explicitly described)
- must_not violations: Finding #2 "sameSite: 'None' weakens CSRF Protection" -- this is a nuanced area. The ground truth says "cookie is insecure" should not be flagged (httpOnly+secure+sameSite are correctly set). However, sameSite: 'None' combined with open CORS IS a legitimate security concern. This is not saying the cookie is insecure in isolation, but that it enables CSRF when CORS is open. Borderline -- not a violation.
- Completeness: 5 -- Both must-mentions hit. sameSite analysis adds value.
- Precision: 4 -- The sameSite: 'None' finding is arguably overcounting since the ground truth says cookie config is fine. But the combined CORS+sameSite analysis is valid.
- Actionability: 5 -- Fix with origin allowlist, sameSite: 'Lax', CSRF tokens.
- Structure: 5 -- CRITICAL for CORS. Notes about cookie config interaction are analytical.
- Efficiency: 4 -- Three findings from what is essentially one core issue (open CORS).
- Depth: 5 -- Explains the difference between CORS + credentials vs wildcard, fetch with credentials:include attack vector.
- **Composite: 4.60**

### Condition B (v1 agents)
- must_mention coverage: 2/2 -- CORS allows all origins with credentials (hit, CRITICAL), authenticated requests from any site (hit)
- must_not violations: Findings #2 and #3 discuss sameSite:'None' and no CSRF token -- these are related to the CORS issue, not incorrectly calling the cookie insecure.
- Completeness: 5 -- Both must-mentions hit. Additional sameSite and CSRF analysis.
- Precision: 4 -- sameSite analysis is valid but extends beyond cookie being "insecure" -- it's about the combined config.
- Actionability: 5 -- Fix with origin allowlist, sameSite options, CSRF token suggestion.
- Structure: 5 -- CRITICAL for CORS. Good separation of findings.
- Efficiency: 4 -- Three findings expanding one core issue.
- Depth: 5 -- Explains origin reflection is worse than wildcard *, detailed CSRF token recommendation.
- **Composite: 4.60**

### Condition C (v2 agents)
- must_mention coverage: 2/2 -- CORS allows all origins with credentials (hit, CRITICAL), any site reads responses (hit)
- must_not violations: Same borderline sameSite analysis.
- Completeness: 5 -- Both must-mentions. sameSite, no CSRF, CORS reflection analysis.
- Precision: 4 -- Same borderline on cookie criticism.
- Actionability: 5 -- Full fix with origin allowlist, sameSite:'Strict', CSRF tokens.
- Structure: 5 -- CRITICAL for CORS. Good structure.
- Efficiency: 4 -- Four findings from one core issue (CORS misconfiguration and its amplifiers).
- Depth: 5 -- Excellent analysis of origin reflection being worse than wildcard. Notes that even without CORS, sameSite:'None' increases attack surface. Finding #4 about CORS reflection is a non-obvious insight.
- **Composite: 4.60**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| sr-001 | 5.00 | 5.00 | 5.00 |
| sr-002 | 5.00 | 4.40 | 4.67 |
| sr-003 | 4.87 | 4.87 | 5.00 |
| sr-004 | 4.73 | 4.60 | 4.73 |
| sr-005 | 4.60 | 4.60 | 4.60 |
| **Mean** | **4.84** | **4.69** | **4.80** |
| B LIFT (vs A) | -- | -0.15 | -- |
| C LIFT (vs A) | -- | -- | -0.04 |
| C vs B | -- | -- | +0.11 |
