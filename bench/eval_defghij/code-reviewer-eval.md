# code-reviewer Evaluation (D/E/F/G/H/I/J)

## Task cr-001: Express.js User Creation Endpoint
**Ground Truth Summary:** Must mention SQL injection, hardcoded JWT secret, no input validation. Must not have style-only complaints without security context. Should have severity labels and fix suggestions.

### Condition D
- must_mention: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (HIGH)
- must_not violations: None
- Completeness: 5 -- All three required findings plus additional valid findings (no auth, no error handling)
- Precision: 5 -- No false positives; severity levels accurate (CRITICAL for SQLi and secret, HIGH for validation)
- Actionability: 5 -- Parameterized query fix code, env variable suggestion, schema validation recommendation
- Structure: 5 -- Severity labels, line references, fix suggestions, summary table, verdict
- Efficiency: 4 -- Five findings is thorough but not padded; slightly verbose explanations
- Depth: 5 -- Detailed attack scenarios, specific fix code examples
- **Composite: 4.87**

### Condition E
- must_mention: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (HIGH)
- must_not violations: None
- Completeness: 5 -- All required findings plus auth, error handling, state mismatch note
- Precision: 5 -- Correctly identifies parameterized queries as safe in cr-004 (positive note). No false positives
- Actionability: 5 -- Fix code provided for each finding
- Structure: 5 -- Severity per finding, summary table, clear verdicts
- Efficiency: 4 -- Well-organized with test.each-style approach
- Depth: 4 -- Good depth but slightly less detailed explanations than D
- **Composite: 4.73**

### Condition F
- must_mention: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (CRITICAL -- slightly over-escalated)
- must_not violations: None
- Completeness: 5 -- All required plus mass assignment, error handling, token on creation
- Precision: 4 -- Elevates input validation to CRITICAL (ground truth expects HIGH); mass assignment as separate CRITICAL is reasonable
- Actionability: 5 -- Full fix code with Zod example
- Structure: 5 -- Clear severity labels, summary table
- Efficiency: 4 -- Good density
- Depth: 5 -- Explains mass assignment / privilege escalation in detail
- **Composite: 4.73**

### Condition G
- must_mention: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (CRITICAL)
- must_not violations: None
- Completeness: 5 -- All required findings plus error handling, token on creation
- Precision: 4 -- Input validation at CRITICAL is a slight over-escalation; token-on-creation is valid but borderline
- Actionability: 5 -- Fix suggestions with code
- Structure: 4 -- Severity labels present but less structured than D/E (no line references)
- Efficiency: 4 -- Concise and focused
- Depth: 4 -- Good but slightly less detailed than D
- **Composite: 4.47**

### Condition H
- must_mention: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (CRITICAL)
- must_not violations: None
- Completeness: 5 -- All required plus JWT expiry, error handling
- Precision: 4 -- Input validation bundled with auth as single CRITICAL; JWT expiry is a valid addition
- Actionability: 5 -- Fix code includes expiresIn on JWT
- Structure: 5 -- Clean hierarchy, code blocks, summary table
- Efficiency: 4 -- Well-balanced
- Depth: 5 -- JWT expiry point adds real value; privilege escalation explained
- **Composite: 4.73**

### Condition I
- must_mention: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (CRITICAL)
- must_not violations: None
- Completeness: 5 -- Identical coverage to H
- Precision: 4 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.73**

### Condition J
- must_mention: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (CRITICAL)
- must_not violations: None
- Completeness: 5 -- All required, plus error handling, adds confidence percentages
- Precision: 5 -- Confidence scores add calibration; no false positives
- Actionability: 5 -- Fix code with Zod schema example, env variable validation
- Structure: 5 -- Numbered findings with confidence, clear hierarchy
- Efficiency: 4 -- Concise with high signal
- Depth: 5 -- Confidence percentages, specific attack scenarios
- **Composite: 4.87**

---

## Task cr-002: React UserList Component
**Ground Truth Summary:** Must mention useEffect missing dependency array (infinite loop), missing key prop, setUsers/props state mismatch. Must not have false complaints about error handling if context doesn't require it.

### Condition D
- must_mention: 3/3 -- infinite loop (HIGH), missing key (HIGH), setUsers undefined/state mismatch (HIGH)
- must_not violations: Has error handling complaint (HIGH) -- but this is borderline since the must_not says "if context doesn't require it." Reasonable finding given the fetch pattern.
- Completeness: 5 -- All three plus valid additional findings
- Precision: 4 -- infinite loop at HIGH not CRITICAL is debatable but defensible
- Actionability: 5 -- Fix code for each
- Structure: 5 -- Severity labels, verdict
- Efficiency: 4 -- Five findings, all valid
- Depth: 4 -- Good explanations
- **Composite: 4.53**

### Condition E
- must_mention: 3/3 -- infinite loop (CRITICAL), missing key (HIGH), setUsers undefined (HIGH)
- must_not violations: None significant
- Completeness: 5 -- All three required
- Precision: 5 -- Correct severity escalation of infinite loop to CRITICAL
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Clean format
- Efficiency: 4 -- Good density
- Depth: 4 -- Clear explanations
- **Composite: 4.73**

### Condition F
- must_mention: 3/3 -- infinite loop (CRITICAL), missing key (HIGH), setUsers undefined (HIGH)
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- Good severity alignment
- Actionability: 4 -- Fix suggestions but less code than others
- Structure: 5 -- Good format
- Efficiency: 4 -- Focused
- Depth: 4 -- Explains design confusion well
- **Composite: 4.53**

### Condition G
- must_mention: 3/3 -- infinite loop (HIGH), missing key (HIGH), setUsers undefined (HIGH)
- must_not violations: None
- Completeness: 5 -- All three required
- Precision: 4 -- Infinite loop at HIGH rather than CRITICAL; otherwise good
- Actionability: 4 -- Fix suggestions present
- Structure: 4 -- Less polished
- Efficiency: 4 -- Adequate
- Depth: 3 -- Less detailed explanations
- **Composite: 4.07**

### Condition H
- must_mention: 3/3 -- infinite loop (CRITICAL), setUsers undefined (CRITICAL), missing key (HIGH)
- must_not violations: None
- Completeness: 5 -- All three plus null reference edge case
- Precision: 5 -- setUsers at CRITICAL is justified (it's a runtime crash)
- Actionability: 5 -- Full fix code
- Structure: 5 -- Well-organized
- Efficiency: 4 -- Good balance
- Depth: 5 -- Explains the design confusion (props vs state) in depth
- **Composite: 4.87**

### Condition I
- must_mention: 3/3 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 3/3 -- infinite loop (CRITICAL), setUsers undefined (HIGH), missing key (HIGH)
- must_not violations: None
- Completeness: 5 -- All three plus loading/error state
- Precision: 5 -- Good severity calibration with confidence scores
- Actionability: 5 -- Full fix code with loading/error state example
- Structure: 5 -- Clean numbered format
- Efficiency: 4 -- Focused
- Depth: 5 -- Comprehensive fix example
- **Composite: 4.87**

---

## Task cr-003: Python Payment Refund
**Ground Truth Summary:** Must mention race condition (CRITICAL), no audit trail (HIGH). Must not mention "missing type hints" or "missing docstring." Structure should have CRITICAL for race condition, HIGH for audit.

### Condition D
- must_mention: 2/2 -- Race condition (CRITICAL), no audit trail (MEDIUM -- should be HIGH)
- must_not violations: None (no type hints or docstring complaints)
- Completeness: 5 -- Both required plus input validation, error handling, user_id validation
- Precision: 4 -- Audit trail at MEDIUM rather than HIGH per ground truth
- Actionability: 5 -- SELECT FOR UPDATE fix code
- Structure: 5 -- CRITICAL/HIGH/MEDIUM hierarchy
- Efficiency: 4 -- Five findings, all relevant
- Depth: 5 -- Detailed race condition explanation with concurrent request scenario
- **Composite: 4.67**

### Condition E
- must_mention: 2/2 -- Race condition (CRITICAL), no audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both required plus transaction wrapping, input validation, boolean return
- Precision: 5 -- Correct severity: CRITICAL for race, HIGH for audit
- Actionability: 5 -- Atomic UPDATE fix and idempotency key suggestion
- Structure: 5 -- Proper hierarchy
- Efficiency: 4 -- Well-organized
- Depth: 5 -- Mentions idempotency, which is a sophisticated addition
- **Composite: 4.87**

### Condition F
- must_mention: 2/2 -- Race condition (HIGH -- should be CRITICAL), no audit trail (MEDIUM -- should be HIGH)
- must_not violations: None
- Completeness: 5 -- Both required plus transaction wrapping, input validation
- Precision: 3 -- Race condition at HIGH not CRITICAL is a notable error; audit at MEDIUM not HIGH
- Actionability: 4 -- Fix suggestions present
- Structure: 4 -- "WARNING" verdict for a race condition in payments seems too lenient
- Efficiency: 4 -- Adequate
- Depth: 4 -- Good explanation but severity miscalibration
- **Composite: 3.93**

### Condition G
- must_mention: 2/2 -- Race condition (CRITICAL), no audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both required plus input validation, transaction wrapping, authorization
- Precision: 5 -- Correct severity levels
- Actionability: 5 -- Both atomic UPDATE and SELECT FOR UPDATE options
- Structure: 5 -- Clean hierarchy
- Efficiency: 4 -- Good density
- Depth: 5 -- Dual fix approach, mentions authorization
- **Composite: 4.87**

### Condition H
- must_mention: 2/2 -- Race condition (CRITICAL), no audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both required plus all additional findings
- Precision: 5 -- Correct severity
- Actionability: 5 -- Dual fix options with code
- Structure: 5 -- Well-organized
- Efficiency: 4 -- Thorough
- Depth: 5 -- TOCTOU terminology, upper-bound check mention
- **Composite: 4.87**

### Condition I
- must_mention: 2/2 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 2/2 -- Race condition (CRITICAL), audit trail addressed via email/transaction discussion (HIGH-2)
- must_not violations: None
- Completeness: 4 -- Race condition and input validation strong; audit trail less explicitly called out as separate finding
- Precision: 5 -- Correct severity, confidence scores
- Actionability: 5 -- Dual fix options with code
- Structure: 5 -- Clean format
- Efficiency: 5 -- Three focused findings, high signal
- Depth: 5 -- Email-before-commit ordering insight is sophisticated
- **Composite: 4.73**

---

## Task cr-004: Go DeleteUser Handler
**Ground Truth Summary:** Must mention no auth/authz (CRITICAL), returns 200 on error (HIGH), no method check. Must NOT mention SQL injection (parameterized query -- false positive trap).

### Condition D
- must_mention: 3/3 -- No auth (CRITICAL), returns 200 on error (HIGH), no method check (CRITICAL)
- must_not violations: None -- does NOT flag SQL injection
- Completeness: 5 -- All three plus input validation and RowsAffected check
- Precision: 5 -- Avoids false positive trap; correct severity
- Actionability: 5 -- Fix code for method check and error handling
- Structure: 5 -- CRITICAL/HIGH labels, summary table
- Efficiency: 4 -- Five findings, all valid
- Depth: 5 -- CSRF via img tag scenario, link prefetcher mention
- **Composite: 4.87**

### Condition E
- must_mention: 3/3 -- No auth (HIGH -- should be CRITICAL), returns 200 on error (HIGH), no method check (HIGH)
- must_not violations: None -- explicitly notes parameterized query is safe (positive)
- Completeness: 5 -- All three required plus input validation, RowsAffected
- Precision: 4 -- Auth at HIGH not CRITICAL is an under-escalation per ground truth
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Good format with positive observation
- Efficiency: 4 -- Clean
- Depth: 4 -- Good but less dramatic severity treatment
- **Composite: 4.53**

### Condition F
- must_mention: 3/3 -- No auth (CRITICAL), error handling (HIGH), method check (MEDIUM -- under-escalated)
- must_not violations: None
- Completeness: 5 -- All three required
- Precision: 4 -- Method check at MEDIUM is too low; soft delete is a design concern not a review finding
- Actionability: 4 -- Fix code present
- Structure: 4 -- Some severity miscalibration
- Efficiency: 4 -- Reasonable
- Depth: 4 -- Mentions router-level middleware caveat
- **Composite: 4.20**

### Condition G
- must_mention: 3/3 -- No auth (CRITICAL), error handling (HIGH), method check (CRITICAL)
- must_not violations: None
- Completeness: 5 -- All three required plus validation, RowsAffected, soft delete
- Precision: 5 -- Correct severity levels
- Actionability: 5 -- Fix code with method enforcement
- Structure: 5 -- Clean hierarchy
- Efficiency: 4 -- Good
- Depth: 5 -- CSRF vector explanation, soft delete consideration
- **Composite: 4.87**

### Condition H
- must_mention: 3/3 -- No auth (CRITICAL), error handling (HIGH), method check (CRITICAL)
- must_not violations: None
- Completeness: 5 -- All three required
- Precision: 5 -- Correct severity
- Actionability: 5 -- Fix code
- Structure: 5 -- Well-organized
- Efficiency: 4 -- Good
- Depth: 5 -- CSRF scenario, img tag attack
- **Composite: 4.87**

### Condition I
- must_mention: 3/3 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 3/3 -- No auth (HIGH), error handling (HIGH), method check (HIGH)
- must_not violations: None -- explicitly notes parameterized query prevents SQLi
- Completeness: 5 -- All three required
- Precision: 4 -- All at HIGH rather than CRITICAL for auth is under-escalation; caveat about middleware being possibly applied at router level adds nuance but reduces assertiveness
- Actionability: 5 -- Fix code with auth middleware example
- Structure: 5 -- Clean format with confidence scores
- Efficiency: 5 -- Three focused findings, no padding
- Depth: 4 -- Router-level middleware caveat is sophisticated but may under-weight the severity
- **Composite: 4.53**

---

## Task cr-005: TypeScript Cache Cleanup
**Ground Truth Summary:** Must mention deleting from Map during iteration. Must NOT complain about unchanged get() method or "missing return type." Structure should only review changed code.

### Condition D
- must_mention: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: Has comments about get() method (flagged as "noting for context" not blocking) -- minor violation
- Completeness: 4 -- Primary finding identified; extra context on get() is borderline
- Precision: 4 -- Correctly notes it's spec-compliant but flags it; get() comment is a minor must_not breach
- Actionability: 5 -- Two-pass fix code provided
- Structure: 5 -- Correctly scoped to changed lines primarily
- Efficiency: 4 -- Some unnecessary findings (missing set method)
- Depth: 5 -- ES2015 spec reference, nuanced discussion of spec vs practice
- **Composite: 4.47**

### Condition E
- must_mention: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: LOW "No return type annotation" -- mild violation of must_not
- Completeness: 4 -- Primary finding present; notes it's not a bug
- Precision: 5 -- Correctly identifies as spec-compliant, not a bug; MEDIUM is appropriate
- Actionability: 4 -- Two-pass fix suggestion, comment suggestion
- Structure: 5 -- Good scoping, positive observations included
- Efficiency: 5 -- Lean output, APPROVE verdict appropriate
- Depth: 4 -- Spec reference, practical suggestion
- **Composite: 4.53**

### Condition F
- must_mention: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: None significant
- Completeness: 4 -- Primary finding present
- Precision: 5 -- Correct, spec-referenced, not over-escalated
- Actionability: 4 -- Two-pass fix
- Structure: 5 -- Clean, scoped to changed code
- Efficiency: 5 -- Lean, focused
- Depth: 4 -- Good spec reference
- **Composite: 4.53**

### Condition G
- must_mention: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: LOW "cleanup visibility" and "no automatic cleanup" -- minor
- Completeness: 4 -- Primary finding present
- Precision: 5 -- Correctly assessed, proper APPROVE verdict
- Actionability: 4 -- Fix suggestion
- Structure: 5 -- Good format
- Efficiency: 4 -- Slightly more findings than needed
- Depth: 4 -- ECMAScript spec citation
- **Composite: 4.40**

### Condition H
- must_mention: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: None significant
- Completeness: 4 -- Primary finding identified
- Precision: 4 -- HIGH is slightly over-escalated for spec-compliant behavior
- Actionability: 5 -- Full two-pass fix code
- Structure: 5 -- WARNING verdict is reasonable
- Efficiency: 4 -- Lean with LOW items
- Depth: 5 -- Detailed spec reference, future-proofing rationale
- **Composite: 4.47**

### Condition I
- must_mention: 1/1 -- Same as H
- must_not violations: None
- Completeness: 4 -- Same as H
- Precision: 4 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.47**

### Condition J
- must_mention: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: None
- Completeness: 4 -- Primary finding; also adds memory leak concern about cleanup not being called
- Precision: 4 -- Memory leak concern is creative but speculative (no evidence cleanup isn't called)
- Actionability: 5 -- Full constructor-based cleanup solution with dispose()
- Structure: 5 -- Clean, focused on changed code
- Efficiency: 4 -- Two findings
- Depth: 5 -- Memory leak angle is insightful; constructor pattern suggestion
- **Composite: 4.47**

---

## Summary

| Task | D | E | F | G | H | I | J |
|------|---|---|---|---|---|---|---|
| cr-001 | 4.87 | 4.73 | 4.73 | 4.47 | 4.73 | 4.73 | 4.87 |
| cr-002 | 4.53 | 4.73 | 4.53 | 4.07 | 4.87 | 4.87 | 4.87 |
| cr-003 | 4.67 | 4.87 | 3.93 | 4.87 | 4.87 | 4.87 | 4.73 |
| cr-004 | 4.87 | 4.53 | 4.20 | 4.87 | 4.87 | 4.87 | 4.53 |
| cr-005 | 4.47 | 4.53 | 4.53 | 4.40 | 4.47 | 4.47 | 4.47 |
| **Mean** | **4.68** | **4.68** | **4.38** | **4.54** | **4.76** | **4.76** | **4.69** |
