# code-reviewer Evaluation (D/E/F/G/H/I)

## Task 1: cr-001

**Ground Truth Summary:** SQL injection via string concatenation, hardcoded JWT secret, no input validation. Must not: style-only complaints without security context. Structure: severity labels (CRITICAL/HIGH), file:line references, fix suggestions.

### Condition D
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All three must_mention items plus additional valid findings (auth, error handling)
- Precision: 5 -- No false positives, correct severity (CRITICAL for SQL injection and JWT, HIGH for validation)
- Actionability: 5 -- Code fix snippets for each finding
- Structure: 5 -- Severity labels, line references, summary table, verdict
- Efficiency: 4 -- Slightly verbose but well-organized
- Depth: 5 -- Detailed explanation of attack vectors and impact
- **Composite: 4.87**

### Condition E
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All items plus auth and error handling
- Precision: 5 -- Correct severities, no false positives; correctly notes parameterized query is fine in cr-004
- Actionability: 5 -- Fix suggestions with code
- Structure: 5 -- Severity labels, verdicts, summary table
- Efficiency: 4 -- Concise but thorough
- Depth: 4 -- Good explanations, slightly less detailed than D
- **Composite: 4.73**

### Condition F
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All items plus mass assignment called out as separate CRITICAL (valid)
- Precision: 4 -- Elevating input validation to CRITICAL (mass assignment) is defensible but aggressive
- Actionability: 5 -- Fix snippets provided
- Structure: 5 -- Clear severity labels, verdicts
- Efficiency: 4 -- Good length
- Depth: 5 -- Token returned on creation is a good additional insight
- **Composite: 4.73**

### Condition G
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation (combined with auth as one CRITICAL)
- must_not violations: None
- Completeness: 5 -- All items covered
- Precision: 4 -- Combining input validation + auth into one CRITICAL finding is less precise
- Actionability: 5 -- Fix code provided
- Structure: 4 -- Severity labels present but combined findings reduce clarity
- Efficiency: 4 -- Reasonable length
- Depth: 4 -- JWT no-expiry is a good addition
- **Composite: 4.47**

### Condition H
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All items plus JWT no-expiry
- Precision: 5 -- Correct severities, well-calibrated
- Actionability: 5 -- Fix code with expiresIn
- Structure: 5 -- Clear severity labels, code references
- Efficiency: 4 -- Good length
- Depth: 5 -- JWT expiry and mass assignment separately noted
- **Composite: 4.87**

### Condition I
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- Identical to H (same output)
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

---

## Task 2: cr-002

**Ground Truth Summary:** useEffect missing dependency array (infinite loop), missing key prop, setUsers/props state mismatch. Must not: false complaints about missing error handling if context doesn't require it.

### Condition D
- must_mention: 3/3 -- infinite loop, missing key, state mismatch (setUsers undefined)
- must_not violations: Minor -- complains about missing error handling and loading state (borderline, context is ambiguous)
- Completeness: 5 -- All three core issues found
- Precision: 4 -- Error handling and loading state complaints are noise per must_not
- Actionability: 5 -- Fix code provided for each
- Structure: 5 -- Severity per finding, verdict
- Efficiency: 4 -- Slightly verbose
- Depth: 5 -- Good explanation of each issue
- **Composite: 4.60**

### Condition E
- must_mention: 3/3 -- All three found
- must_not violations: Minor -- mentions error handling and null crash
- Completeness: 5 -- All found
- Precision: 4 -- Same minor must_not concern
- Actionability: 4 -- Fix suggestions present but less detailed
- Structure: 5 -- Good severity labels
- Efficiency: 5 -- More concise
- Depth: 4 -- Adequate
- **Composite: 4.47**

### Condition F
- must_mention: 3/3 -- All three found
- must_not violations: Minor -- error/loading and null reference mentioned
- Completeness: 5 -- All found
- Precision: 4 -- Same noise
- Actionability: 5 -- Good fix suggestions
- Structure: 5 -- Severity labels, verdicts
- Efficiency: 4 -- Good
- Depth: 4 -- Adequate
- **Composite: 4.47**

### Condition G
- must_mention: 3/3 -- All three found
- must_not violations: Minor -- error handling, null reference mentioned
- Completeness: 5 -- All found
- Precision: 4 -- Same
- Actionability: 5 -- Fix code
- Structure: 4 -- Verdict says "2 HIGH issues, 1 bug" -- unusual labeling
- Efficiency: 4 -- Good
- Depth: 4 -- Adequate
- **Composite: 4.33**

### Condition H
- must_mention: 3/3 -- All three found (setUsers elevated to CRITICAL)
- must_not violations: Minor -- error handling mentioned
- Completeness: 5 -- All found
- Precision: 4 -- Same noise; setUsers as CRITICAL is defensible
- Actionability: 5 -- Good fix code
- Structure: 5 -- Clear labels
- Efficiency: 4 -- Good
- Depth: 5 -- Good depth on state ownership issue
- **Composite: 4.60**

### Condition I
- must_mention: 3/3 -- Same as H
- must_not violations: Minor -- same
- Completeness: 5
- Precision: 4
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.60**

---

## Task 3: cr-003

**Ground Truth Summary:** Race condition (no transaction/lock), no audit trail. Must not: "missing type hints" or "missing docstring". Structure: CRITICAL for race condition, HIGH for audit.

### Condition D
- must_mention: 2/2 -- Race condition, no audit trail
- must_not violations: None (no type hints or docstring complaints)
- Completeness: 5 -- Both found plus additional valid findings
- Precision: 4 -- Audit trail rated MEDIUM not HIGH (ground truth says HIGH)
- Actionability: 5 -- Fix code with SELECT FOR UPDATE
- Structure: 4 -- Race condition CRITICAL (correct), audit MEDIUM (should be HIGH)
- Efficiency: 4 -- Good
- Depth: 5 -- Excellent race condition explanation
- **Composite: 4.47**

### Condition E
- must_mention: 2/2 -- Both found
- must_not violations: None
- Completeness: 5 -- Both plus valid extras
- Precision: 5 -- Race CRITICAL, audit HIGH (matches ground truth)
- Actionability: 5 -- Both SQL options provided
- Structure: 5 -- Correct severity mapping
- Efficiency: 4 -- Good
- Depth: 5 -- Good detail
- **Composite: 4.87**

### Condition F
- must_mention: 2/2 -- Both found
- must_not violations: None
- Completeness: 5 -- Both found
- Precision: 5 -- Correct severities
- Actionability: 5 -- Fix code
- Structure: 5 -- Correct severity labels
- Efficiency: 4 -- Good
- Depth: 5 -- TOCTOU terminology used, good detail
- **Composite: 4.87**

### Condition G
- must_mention: 2/2 -- Both found
- must_not violations: None
- Completeness: 5 -- Both found
- Precision: 4 -- Race condition labeled HIGH not CRITICAL, audit MEDIUM not HIGH. Verdict WARNING not BLOCK
- Actionability: 5 -- Fix code
- Structure: 3 -- Severity mapping inconsistent with ground truth
- Efficiency: 4 -- Good
- Depth: 4 -- Adequate
- **Composite: 4.13**

### Condition H
- must_mention: 2/2 -- Both found
- must_not violations: None
- Completeness: 5 -- Both found
- Precision: 5 -- Race CRITICAL, audit HIGH
- Actionability: 5 -- Multiple fix options
- Structure: 5 -- Correct severities
- Efficiency: 4 -- Good
- Depth: 5 -- Excellent TOCTOU explanation
- **Composite: 4.87**

### Condition I
- must_mention: 2/2 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 4: cr-004

**Ground Truth Summary:** No auth/authz check, returns 200 on error, no method check (GET for destructive op). Must not: "SQL injection" (query IS parameterized). Structure: CRITICAL for missing auth, HIGH for error handling.

### Condition D
- must_mention: 3/3 -- No auth, 200 on error, no method check
- must_not violations: None (correctly avoids false SQL injection claim)
- Completeness: 5 -- All three found plus id validation, rows affected check
- Precision: 5 -- No SQL injection false positive; correct severities
- Actionability: 5 -- Fix code for each
- Structure: 5 -- CRITICAL for auth and GET, HIGH for error handling
- Efficiency: 4 -- Good
- Depth: 5 -- CSRF via img tag explained
- **Composite: 4.87**

### Condition E
- must_mention: 3/3 -- All found
- must_not violations: None -- explicitly notes parameterized query is correct
- Completeness: 5 -- All found
- Precision: 5 -- Correct; positive note about parameterized query
- Actionability: 5 -- Fix code
- Structure: 4 -- Auth labeled HIGH not CRITICAL (ground truth says CRITICAL)
- Efficiency: 4 -- Good
- Depth: 4 -- Good but auth severity underrated
- **Composite: 4.47**

### Condition F
- must_mention: 3/3 -- All found
- must_not violations: None
- Completeness: 5 -- All found plus soft delete consideration
- Precision: 5 -- CRITICAL for auth, correct
- Actionability: 5 -- Fix code
- Structure: 5 -- Correct severity mapping
- Efficiency: 4 -- Good
- Depth: 4 -- Good
- **Composite: 4.73**

### Condition G
- must_mention: 3/3 -- All found
- must_not violations: None -- correctly notes parameterized query
- Completeness: 5 -- All found
- Precision: 4 -- Auth CRITICAL correct, but method check only MEDIUM
- Actionability: 5 -- Fix code
- Structure: 4 -- Method check severity too low
- Efficiency: 4 -- Good
- Depth: 4 -- Adequate
- **Composite: 4.33**

### Condition H
- must_mention: 3/3 -- All found
- must_not violations: None
- Completeness: 5 -- All found plus soft delete, response body
- Precision: 5 -- Both auth and method check CRITICAL
- Actionability: 5 -- Fix code
- Structure: 5 -- Correct severity mapping
- Efficiency: 4 -- Good
- Depth: 5 -- CSRF via img tag well-explained
- **Composite: 4.87**

### Condition I
- must_mention: 3/3 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 5: cr-005

**Ground Truth Summary:** Deleting from Map during iteration (may cause issues). Must not: complaints about unchanged get() method, "missing return type" on cleanup. Structure: only review changed code unless CRITICAL.

### Condition D
- must_mention: 1/1 -- Map deletion during iteration flagged
- must_not violations: Minor -- mentions get() not removing expired entries (but notes it's unchanged code, for context). Missing set() noted but marked LOW.
- Completeness: 4 -- Main issue found, but also reviews unchanged code
- Precision: 4 -- Comments on get() and missing set() are technically violations of "only review changed code" spirit
- Actionability: 5 -- Two-pass fix provided
- Structure: 4 -- Reviews beyond changed lines
- Efficiency: 3 -- Some noise from reviewing unchanged code
- Depth: 5 -- Nuanced: notes it's spec-safe but fragile
- **Composite: 4.07**

### Condition E
- must_mention: 1/1 -- Found
- must_not violations: None -- correctly states it's spec-safe, no complaints about get() or return type
- Completeness: 4 -- Main issue found
- Precision: 5 -- Correctly identifies as MEDIUM, notes spec compliance. No false positives.
- Actionability: 4 -- Suggests comment or two-pass approach
- Structure: 5 -- Approves the code, correct verdict
- Efficiency: 5 -- Concise, focused on changed code
- Depth: 4 -- Good nuance about spec compliance
- **Composite: 4.47**

### Condition F
- must_mention: 1/1 -- Found
- must_not violations: None -- mentions missing set but in low priority
- Completeness: 4 -- Main issue found
- Precision: 5 -- Correct severity, no false positives about get()
- Actionability: 4 -- Two-pass fix suggested
- Structure: 5 -- Approve verdict correct
- Efficiency: 5 -- Focused
- Depth: 4 -- Good
- **Composite: 4.47**

### Condition G
- must_mention: 1/1 -- Found
- must_not violations: None
- Completeness: 4 -- Main issue found
- Precision: 5 -- Correctly notes spec-safe, labels MEDIUM
- Actionability: 4 -- Comment suggestion
- Structure: 5 -- APPROVE verdict
- Efficiency: 5 -- Concise
- Depth: 5 -- Detailed spec citation (Section 24.1.5.8)
- **Composite: 4.53**

### Condition H
- must_mention: 1/1 -- Found
- must_not violations: None -- no complaints about get() or return type
- Completeness: 4 -- Main issue found
- Precision: 5 -- Labeled HIGH but notes spec-safe; technically HIGH is too severe for spec-defined safe behavior
- Actionability: 5 -- Two-pass fix code
- Structure: 4 -- WARNING verdict (not APPROVE) -- slightly pessimistic
- Efficiency: 4 -- Good
- Depth: 5 -- Excellent nuance
- **Composite: 4.47**

### Condition I
- must_mention: 1/1 -- Same as H
- must_not violations: None
- Completeness: 4
- Precision: 5
- Actionability: 5
- Structure: 4
- Efficiency: 4
- Depth: 5
- **Composite: 4.47**

---

## Summary

| Task | D | E | F | G | H | I |
|------|---|---|---|---|---|---|
| cr-001 | 4.87 | 4.73 | 4.73 | 4.47 | 4.87 | 4.87 |
| cr-002 | 4.60 | 4.47 | 4.47 | 4.33 | 4.60 | 4.60 |
| cr-003 | 4.47 | 4.87 | 4.87 | 4.13 | 4.87 | 4.87 |
| cr-004 | 4.87 | 4.47 | 4.73 | 4.33 | 4.87 | 4.87 |
| cr-005 | 4.07 | 4.47 | 4.47 | 4.53 | 4.47 | 4.47 |
| **Mean** | **4.58** | **4.60** | **4.65** | **4.36** | **4.74** | **4.74** |
