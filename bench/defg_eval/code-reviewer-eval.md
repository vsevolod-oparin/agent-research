# code-reviewer Evaluation (D/E/F/G/H)

## Task cr-001: Express.js Endpoint Review

**Ground Truth Summary:** Must mention SQL injection, hardcoded JWT secret, no input validation. Must not have style-only complaints without security context. Must have severity labels and fix suggestions.

### Condition D
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Code artifacts: N/A (markdown only)
- Completeness: 5 -- All three must-mentions plus auth check and error handling
- Precision: 5 -- All findings accurate, severity labels correct (CRITICAL for SQL injection and JWT)
- Actionability: 5 -- Fix code provided for each finding
- Structure: 5 -- Severity labels, line references, summary table, verdict
- Efficiency: 4 -- Slightly verbose with additional findings beyond required
- Depth: 5 -- Explains privilege escalation via role, unhandled rejection details
- **Composite: 4.87**

### Condition E
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- Covers all required plus error handling and auth
- Precision: 5 -- All findings accurate, correct severity
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Clear severity labels, fix suggestions, verdict
- Efficiency: 4 -- Clean and concise
- Depth: 4 -- Good but slightly less detailed than D on exploit scenarios
- **Composite: 4.73**

### Condition F
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation (escalated to CRITICAL with mass assignment)
- must_not violations: None
- Completeness: 5 -- All required plus additional valid findings
- Precision: 5 -- Accurate, properly identifies mass assignment as critical
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Clear severity labels, organized
- Efficiency: 4 -- Good signal-to-noise
- Depth: 5 -- Identifies mass assignment as separate CRITICAL, notes token bypass
- **Composite: 4.87**

### Condition G
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation (merged into one CRITICAL)
- must_not violations: None
- Completeness: 5 -- All required findings present
- Precision: 4 -- Merging input validation into CRITICAL is arguable; ground truth says HIGH
- Actionability: 5 -- Fix code provided
- Structure: 4 -- Less structured than others; severity labels present but grouping is odd
- Efficiency: 4 -- Reasonably concise
- Depth: 4 -- Good depth on each finding
- **Composite: 4.40**

### Condition H
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation (combined into one CRITICAL)
- must_not violations: None
- Completeness: 5 -- All required plus JWT expiry
- Precision: 4 -- Combining input validation into CRITICAL overrates it slightly
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Clean organization, summary table
- Efficiency: 4 -- Good balance
- Depth: 5 -- Notes JWT expiry, privilege escalation via role
- **Composite: 4.60**

---

## Task cr-002: React UserList Component

**Ground Truth Summary:** Must mention useEffect missing dependency array (infinite loop), missing key prop, setUsers/props state mismatch. Must not have false complaints about missing error handling if context doesn't require it.

### Condition D
- must_mention coverage: 3/3 -- infinite loop, missing key, setUsers undefined
- must_not violations: Minor -- includes error handling and loading state complaints, though these are valid in context
- Completeness: 5 -- All three required findings plus valid additional ones
- Precision: 4 -- Error handling complaints are reasonable but borderline per must_not
- Actionability: 5 -- Fix code provided for each
- Structure: 5 -- Severity per finding, approval recommendation (BLOCK)
- Efficiency: 4 -- Slightly verbose
- Depth: 4 -- Good identification of state mismatch
- **Composite: 4.47**

### Condition E
- must_mention coverage: 3/3 -- infinite loop (CRITICAL), setUsers undefined (HIGH), missing keys (HIGH)
- must_not violations: Minor -- mentions error handling
- Completeness: 5 -- All required covered
- Precision: 5 -- Accurate findings, correct that useEffect is CRITICAL
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Clean severity labels, verdict
- Efficiency: 4 -- Concise
- Depth: 4 -- Good explanation of state ownership confusion
- **Composite: 4.73**

### Condition F
- must_mention coverage: 3/3 -- infinite loop, setUsers undefined, missing keys
- must_not violations: Minor -- mentions error/loading state
- Completeness: 5 -- All required
- Precision: 5 -- Accurate
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Good organization
- Efficiency: 4 -- Clean
- Depth: 4 -- Explains state confusion well
- **Composite: 4.73**

### Condition G
- must_mention coverage: 3/3 -- infinite loop (HIGH, should be higher), setUsers undefined (HIGH), missing keys (HIGH)
- must_not violations: Minor -- mentions loading/error state
- Completeness: 5 -- All required
- Precision: 4 -- Infinite loop labeled HIGH rather than CRITICAL; hedges on auth caveat
- Actionability: 4 -- Fix code provided but less detailed
- Structure: 4 -- Severity labels present, less structured
- Efficiency: 4 -- Concise
- Depth: 3 -- Less depth on state mismatch explanation
- **Composite: 4.07**

### Condition H
- must_mention coverage: 3/3 -- infinite loop (CRITICAL), setUsers undefined (CRITICAL), missing keys (HIGH)
- must_not violations: Minor -- mentions error handling
- Completeness: 5 -- All required
- Precision: 5 -- Accurate severity classification
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- Excellent explanation of state ownership confusion
- **Composite: 4.87**

---

## Task cr-003: Python Payment Refund

**Ground Truth Summary:** Must mention race condition (CRITICAL) and no audit trail (HIGH). Must not complain about missing type hints or docstrings.

### Condition D
- must_mention coverage: 2/2 -- race condition (CRITICAL), no audit trail (MEDIUM, should be HIGH)
- must_not violations: None -- no type hints or docstring complaints
- Completeness: 5 -- Both required plus input validation and error handling
- Precision: 4 -- Audit trail downgraded to MEDIUM vs expected HIGH
- Actionability: 5 -- Fix code with SELECT FOR UPDATE
- Structure: 5 -- Correct CRITICAL for race condition
- Efficiency: 4 -- Good signal-to-noise
- Depth: 5 -- Excellent explanation of TOCTOU race
- **Composite: 4.53**

### Condition E
- must_mention coverage: 2/2 -- race condition (CRITICAL), no audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both required plus input validation, transaction wrapping
- Precision: 5 -- Correct severity for both
- Actionability: 5 -- Atomic UPDATE fix with WHERE guard
- Structure: 5 -- Proper severity labels
- Efficiency: 4 -- Clean
- Depth: 5 -- Good explanation of negative amount vulnerability
- **Composite: 4.87**

### Condition F
- must_mention coverage: 2/2 -- race condition (CRITICAL renamed HIGH), audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both required
- Precision: 4 -- Race condition labeled HIGH, ground truth says CRITICAL
- Actionability: 5 -- Fix code provided
- Structure: 4 -- Severity present but race condition underrated
- Efficiency: 4 -- Good
- Depth: 4 -- Good TOCTOU explanation
- **Composite: 4.33**

### Condition G
- must_mention coverage: 2/2 -- race condition (HIGH, should be CRITICAL), audit trail (MEDIUM, should be HIGH)
- must_not violations: None
- Completeness: 5 -- Both required
- Precision: 3 -- Both findings underrated in severity
- Actionability: 5 -- Fix code provided
- Structure: 4 -- Severity labels present but miscalibrated
- Efficiency: 4 -- Concise
- Depth: 4 -- Decent TOCTOU explanation
- **Composite: 3.87**

### Condition H
- must_mention coverage: 2/2 -- race condition (CRITICAL), audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both required plus extensive additional findings
- Precision: 5 -- Correct severity for both
- Actionability: 5 -- Two fix options (atomic UPDATE and SELECT FOR UPDATE)
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- Detailed TOCTOU explanation with both fix approaches
- **Composite: 4.87**

---

## Task cr-004: Go DeleteUser Handler

**Ground Truth Summary:** Must mention no auth (CRITICAL), returns 200 on error (HIGH), no method check. Must NOT claim SQL injection (parameterized query is correct).

### Condition D
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), no method check (CRITICAL)
- must_not violations: None -- no SQL injection false positive
- Completeness: 5 -- All three plus input validation and rows affected check
- Precision: 5 -- Correctly avoids SQL injection trap
- Actionability: 5 -- Fix code for each finding
- Structure: 5 -- Proper severity labels
- Efficiency: 4 -- Good
- Depth: 5 -- Explains CSRF vector via GET, link prefetch
- **Composite: 4.87**

### Condition E
- must_mention coverage: 3/3 -- no auth (HIGH, should be CRITICAL), 200 on error (HIGH), no method check (HIGH)
- must_not violations: None -- explicitly notes parameterized query is correct
- Completeness: 5 -- All required
- Precision: 4 -- Auth finding should be CRITICAL not HIGH per ground truth
- Actionability: 5 -- Fix code provided
- Structure: 4 -- Severity present but auth underrated
- Efficiency: 5 -- Very clean, includes positive observation
- Depth: 4 -- Good CSRF explanation
- **Composite: 4.40**

### Condition F
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), no method check (HIGH)
- must_not violations: None
- Completeness: 5 -- All required plus soft delete consideration
- Precision: 5 -- Correct severity, avoids SQL injection trap
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- CSRF via image tag, soft delete suggestion
- **Composite: 4.87**

### Condition G
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), no method check (MEDIUM, should be higher)
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 4 -- Method check underrated at MEDIUM
- Actionability: 5 -- Fix code provided
- Structure: 4 -- Present but method check severity off
- Efficiency: 4 -- Good
- Depth: 4 -- Notes CSRF concern for method check
- **Composite: 4.33**

### Condition H
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), no method check (CRITICAL)
- must_not violations: None
- Completeness: 5 -- All required plus input validation, response body
- Precision: 5 -- Correct severity, avoids SQL injection trap
- Actionability: 5 -- Fix code provided
- Structure: 5 -- Well organized, summary table
- Efficiency: 4 -- Good
- Depth: 5 -- Detailed CSRF attack chain, image tag example
- **Composite: 4.87**

---

## Task cr-005: TypeScript Cache Cleanup

**Ground Truth Summary:** Must mention deleting from Map during iteration. Must NOT complain about unchanged get() method or missing return type.

### Condition D
- must_mention coverage: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: Mild -- mentions get() method (labeled "noting for context, not blocking") and missing set() method
- Completeness: 4 -- Main finding plus some noise
- Precision: 4 -- Notes Map spec safety but still flags HIGH; get() mention is borderline violation
- Actionability: 5 -- Two-pass fix code provided
- Structure: 5 -- Proper focus on changed code
- Efficiency: 3 -- Mentions unchanged code items
- Depth: 5 -- Correct nuance about ES2015 spec
- **Composite: 4.27**

### Condition E
- must_mention coverage: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: Minor -- mentions cleanup() access modifier (LOW) and return type (LOW)
- Completeness: 4 -- Main finding covered
- Precision: 5 -- Correctly notes this is spec-compliant, not a bug; mentions return type as LOW
- Actionability: 4 -- Suggests comment; two-pass fix offered
- Structure: 5 -- Clean, positive observations included
- Efficiency: 4 -- Good balance
- Depth: 5 -- Excellent nuance about ES2015 Map behavior
- **Composite: 4.53**

### Condition F
- must_mention coverage: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: Minor -- mentions missing set method and cleanup visibility
- Completeness: 4 -- Main finding covered
- Precision: 5 -- Correctly notes spec compliance
- Actionability: 4 -- Two-pass fix suggested
- Structure: 5 -- Clean organization
- Efficiency: 4 -- Some noise about missing set
- Depth: 5 -- Good nuance
- **Composite: 4.53**

### Condition G
- must_mention coverage: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: None -- no complaints about get() or return type
- Completeness: 4 -- Main finding covered
- Precision: 5 -- Correctly identifies spec compliance, nuanced
- Actionability: 4 -- Two-pass fix suggested
- Structure: 5 -- Clean, focused on changed lines
- Efficiency: 5 -- Minimal noise
- Depth: 5 -- Excellent spec reference
- **Composite: 4.67**

### Condition H
- must_mention coverage: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: Minor -- mentions missing set method and visibility
- Completeness: 4 -- Main finding covered
- Precision: 5 -- Correctly notes spec safety with nuance
- Actionability: 5 -- Two-pass fix code provided
- Structure: 5 -- Clean, focused on changed code
- Efficiency: 4 -- Slight noise about set method
- Depth: 5 -- Good nuance about maintainability risk
- **Composite: 4.67**

---

## Summary

| Task | D | E | F | G | H |
|------|---|---|---|---|---|
| cr-001 | 4.87 | 4.73 | 4.87 | 4.40 | 4.60 |
| cr-002 | 4.47 | 4.73 | 4.73 | 4.07 | 4.87 |
| cr-003 | 4.53 | 4.87 | 4.33 | 3.87 | 4.87 |
| cr-004 | 4.87 | 4.40 | 4.87 | 4.33 | 4.87 |
| cr-005 | 4.27 | 4.53 | 4.53 | 4.67 | 4.67 |
| **Mean** | **4.60** | **4.65** | **4.67** | **4.27** | **4.78** |
