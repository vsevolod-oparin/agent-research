# code-reviewer Evaluation (D/E/F)

## Task 1: cr-001

**Ground Truth Summary:** Must mention: SQL injection via string concatenation, hardcoded JWT secret, no input validation. Must not: style-only complaints without security context. Structure: severity labels (CRITICAL/HIGH), file:line references, fix suggestions.

### Condition D
- must_mention coverage: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (HIGH)
- must_not violations: None
- Completeness: 5 -- All three must-mention items plus auth and error handling
- Precision: 5 -- Every claim is accurate and well-evidenced
- Actionability: 5 -- Concrete code fixes for each finding
- Structure: 5 -- Severity labels, line references, summary table, verdict
- Efficiency: 4 -- Some findings (auth, error handling) add value but slightly dilute focus
- Depth: 5 -- Explains attack vectors clearly (e.g., privilege escalation via role)
- **Composite: 4.87**

### Condition E
- must_mention coverage: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (HIGH)
- must_not violations: None
- Completeness: 5 -- All must-mention items plus auth, error handling
- Precision: 5 -- All claims accurate
- Actionability: 5 -- Code fixes provided for key issues
- Structure: 5 -- Severity labels, verdict, overall summary table
- Efficiency: 5 -- Dense, every finding adds value, no filler
- Depth: 4 -- Good explanations but slightly less detailed attack scenarios than D
- **Composite: 4.87**

### Condition F
- must_mention coverage: 3/3 -- SQL injection (CRITICAL), hardcoded JWT secret (CRITICAL), no input validation (HIGH). Also escalated mass assignment to CRITICAL
- must_not violations: None
- Completeness: 5 -- All items plus mass assignment elevation and token-on-creation concern
- Precision: 5 -- All claims accurate; mass assignment as CRITICAL is defensible
- Actionability: 4 -- Fixes for main issues but some findings lack code fixes
- Structure: 5 -- Clean severity labels, summary table, verdicts
- Efficiency: 5 -- Tight, no wasted words
- Depth: 5 -- Mass assignment / privilege escalation insight goes beyond the other conditions
- **Composite: 4.87**

---

## Task 2: cr-002

**Ground Truth Summary:** Must mention: useEffect missing dependency array (infinite loop), missing key prop, setUsers/users state mismatch. Must not: false complaints about missing error handling if context doesn't require it. Structure: severity per finding, approval recommendation.

### Condition D
- must_mention coverage: 3/3 -- infinite loop (HIGH), missing keys (HIGH), setUsers undefined / state mismatch (HIGH)
- must_not violations: Minor -- includes error handling and loading state complaints, which ground truth says not to flag if context doesn't require it. Borderline.
- Completeness: 5 -- All three must-mention items covered
- Precision: 4 -- Error handling complaint is borderline violation of must_not
- Actionability: 5 -- Code fixes for each issue
- Structure: 5 -- Severity per finding, verdict
- Efficiency: 4 -- Error handling/loading state findings are arguably noise per ground truth
- Depth: 5 -- Well-explained infinite loop mechanism and state mismatch
- **Composite: 4.53**

### Condition E
- must_mention coverage: 3/3 -- infinite loop (CRITICAL), setUsers undefined (HIGH), missing keys (HIGH)
- must_not violations: Includes error handling and null reference complaints -- similar borderline issue
- Completeness: 5 -- All three items covered
- Precision: 4 -- Same borderline violation on error handling
- Actionability: 5 -- Clear fixes with code
- Structure: 5 -- Severity labels, verdict
- Efficiency: 4 -- Similar noise from error handling
- Depth: 4 -- Good but slightly less detailed than D on the state mismatch explanation
- **Composite: 4.40**

### Condition F
- must_mention coverage: 3/3 -- infinite loop (CRITICAL), setUsers undefined (HIGH), missing keys (HIGH)
- must_not violations: Includes error/loading state -- borderline
- Completeness: 5 -- All items covered
- Precision: 4 -- Same borderline must_not issue
- Actionability: 4 -- Fixes provided but less detailed code examples
- Structure: 5 -- Severity labels, verdict, summary table
- Efficiency: 5 -- More concise than D and E; the null reference point is brief
- Depth: 5 -- Good explanation of state ownership ambiguity
- **Composite: 4.53**

---

## Task 3: cr-003

**Ground Truth Summary:** Must mention: race condition (no transaction/lock), no audit trail. Must not: "missing type hints" or "missing docstring" (LOW noise on unchanged code). Structure: CRITICAL for race condition, HIGH for missing audit.

### Condition D
- must_mention coverage: 2/2 -- race condition (CRITICAL), no audit trail (MEDIUM)
- must_not violations: None -- no type hints or docstring complaints
- Completeness: 5 -- Both must-mention items plus input validation, error handling, user validation
- Precision: 4 -- Audit trail rated MEDIUM instead of HIGH per ground truth
- Actionability: 5 -- Code fix with SELECT FOR UPDATE pattern
- Structure: 4 -- Severity labels present but audit trail severity misclassified
- Efficiency: 4 -- Extra findings add value but dilute the two key issues
- Depth: 5 -- Excellent race condition explanation with concurrent scenario
- **Composite: 4.47**

### Condition E
- must_mention coverage: 2/2 -- race condition (CRITICAL), no audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both items plus input validation and transaction concerns
- Precision: 5 -- Correct severity classifications matching ground truth
- Actionability: 5 -- Atomic UPDATE alternative provided, idempotency suggestion
- Structure: 5 -- Correct CRITICAL/HIGH alignment with ground truth
- Efficiency: 5 -- Focused findings, all add value
- Depth: 5 -- Double refund scenario explained, idempotency mentioned
- **Composite: 5.00**

### Condition F
- must_mention coverage: 2/2 -- race condition (CRITICAL), no audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both items plus input validation, authorization check
- Precision: 5 -- Correct severity for both must-mention items
- Actionability: 5 -- Atomic UPDATE code, clear next steps
- Structure: 5 -- CRITICAL and HIGH correctly applied
- Efficiency: 5 -- Tight, every finding justified
- Depth: 5 -- Good explanation of negative amount attack, race condition
- **Composite: 5.00**

---

## Task 4: cr-004

**Ground Truth Summary:** Must mention: no auth/authorization on delete, returns 200 on error, no method check (accepts GET). Must not: "SQL injection" (parameterized query -- false positive trap). Structure: CRITICAL for missing auth, HIGH for error handling.

### Condition D
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), no method check (CRITICAL)
- must_not violations: None -- correctly notes parameterized query is used
- Completeness: 5 -- All three must-mention items plus input validation and rows affected check
- Precision: 5 -- No false positives; correctly avoids SQL injection claim
- Actionability: 5 -- Code fixes for method check and error handling
- Structure: 5 -- CRITICAL for auth and method, HIGH for error handling
- Efficiency: 4 -- Five findings total; all relevant
- Depth: 5 -- CSRF via img tag, link prefetcher scenarios explained
- **Composite: 4.87**

### Condition E
- must_mention coverage: 3/3 -- no auth (HIGH), 200 on error (HIGH), no method check (HIGH)
- must_not violations: None -- explicitly notes parameterized query is correct
- Completeness: 5 -- All items plus input validation and rows affected
- Precision: 4 -- Auth classified as HIGH instead of CRITICAL per ground truth
- Actionability: 5 -- Code fixes provided
- Structure: 4 -- Auth should be CRITICAL not HIGH; severity misalignment
- Efficiency: 5 -- Clean, positive observation about parameterized query
- Depth: 4 -- CSRF mention but less detailed than D
- **Composite: 4.47**

### Condition F
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), no method check (HIGH)
- must_not violations: None -- correctly notes parameterized query prevents SQLi
- Completeness: 5 -- All items plus soft delete consideration, input validation
- Precision: 5 -- Correct severity alignment
- Actionability: 5 -- Code fix for method check
- Structure: 5 -- CRITICAL for auth, HIGH for others
- Efficiency: 4 -- Soft delete point is somewhat tangential
- Depth: 5 -- CSRF explanation, method discussion thorough
- **Composite: 4.87**

---

## Task 5: cr-005

**Ground Truth Summary:** Must mention: deleting from Map during iteration (may cause issues). Must not: complaints about unchanged get() method, "missing return type" on cleanup. Structure: only review changed code unless CRITICAL in unchanged code.

### Condition D
- must_mention coverage: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: Yes -- comments on get() method (MEDIUM, noted as "context" but still flagged), missing set() method (LOW)
- Completeness: 4 -- Core finding covered but drifts into unchanged code
- Precision: 3 -- Correctly notes it's spec-compliant but the get() and set() comments violate must_not
- Actionability: 5 -- Two-pass fix provided with code
- Structure: 3 -- Reviews unchanged code despite instructions to focus on changed lines
- Efficiency: 3 -- Findings on unchanged code are noise per ground truth
- Depth: 5 -- Nuanced discussion of spec compliance vs maintainability
- **Composite: 3.73**

### Condition E
- must_mention coverage: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: Minimal -- notes access modifier (LOW) and return type (LOW) but these are brief
- Completeness: 4 -- Core finding covered
- Precision: 4 -- Return type mention is a must_not violation but rated LOW and brief
- Actionability: 4 -- Fix suggestion via comment or two-pass approach
- Structure: 5 -- Focused on changed code; positive observations about unchanged code without flagging issues
- Efficiency: 5 -- Tight, minimal noise
- Depth: 4 -- Correctly identifies spec compliance; less detail than D
- **Composite: 4.27**

### Condition F
- must_mention coverage: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: Minor -- notes missing set() method (MEDIUM) and cleanup visibility (LOW)
- Completeness: 4 -- Core finding covered
- Precision: 4 -- Missing set() comment about unchanged code, minor violation
- Actionability: 4 -- Two-pass fix provided with code
- Structure: 4 -- Mostly focused on changed code but strays slightly
- Efficiency: 4 -- Somewhat more noise than E with the set() method and auto-cleanup points
- Depth: 4 -- Good spec-compliance note
- **Composite: 4.00**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| cr-001 | 4.87 | 4.87 | 4.87 |
| cr-002 | 4.53 | 4.40 | 4.53 |
| cr-003 | 4.47 | 5.00 | 5.00 |
| cr-004 | 4.87 | 4.47 | 4.87 |
| cr-005 | 3.73 | 4.27 | 4.00 |
| **Mean** | **4.49** | **4.60** | **4.65** |
| E LIFT (vs D) | -- | +0.11 | -- |
| F LIFT (vs D) | -- | -- | +0.16 |
| F vs E | -- | -- | +0.05 |
