# code-reviewer Evaluation (D/E/F/I/L/M/N/O)

## Task cr-001: Express.js User Creation Endpoint
**Ground Truth Summary:** Must find SQL injection, hardcoded JWT secret, no input validation. Must not have style-only complaints without security context. Should have CRITICAL/HIGH severity labels, file:line references, fix suggestions.

### Condition D
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All three required items plus auth and error handling
- Precision: 5 -- Every finding is real and correctly classified
- Actionability: 5 -- Parameterized query examples, env var suggestion, Zod/Joi validation
- Structure: 5 -- CRITICAL/HIGH labels, line references, fix code, summary table, verdict
- Efficiency: 4 -- Two extra findings (auth, error handling) are valid but add length
- Depth: 5 -- SQL injection explained with attack example, JWT secret risk clearly described
- **Composite: 4.87**

### Condition E
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All required items plus error handling and auth
- Precision: 5 -- No false positives, correct severities
- Actionability: 5 -- Concrete fixes with code examples
- Structure: 5 -- Severity labels, verdict, summary table
- Efficiency: 4 -- Five findings total, all valid
- Depth: 4 -- Thorough but slightly less detailed than D on JWT risk
- **Composite: 4.73**

### Condition F
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All required items plus mass assignment, error handling, JWT expiry
- Precision: 5 -- All findings valid; mass assignment (CRITICAL) is a reasonable interpretation of "no input validation"
- Actionability: 5 -- Code fixes provided
- Structure: 5 -- Severity labels, verdicts, summary table
- Efficiency: 4 -- Six findings, some overlap between input validation and mass assignment
- Depth: 5 -- Mass assignment angle adds depth to the input validation finding
- **Composite: 4.87**

### Condition I
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation (combined with auth as "Missing Input Validation and Authentication")
- must_not violations: None
- Completeness: 5 -- All required items well covered
- Precision: 5 -- No false positives
- Actionability: 5 -- Detailed fixes with code examples, JWT expiry suggestion
- Structure: 5 -- Severity labels, line references, verdict
- Efficiency: 4 -- Five findings
- Depth: 5 -- JWT no-expiry is a good additional insight
- **Composite: 4.87**

### Condition L
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All required items with confidence labels
- Precision: 5 -- Confirmed confidence on all findings, no false positives
- Actionability: 5 -- Zod validation example, parameterized query, env var
- Structure: 5 -- Finding table with severity + confidence, line references
- Efficiency: 5 -- Four focused findings, no padding
- Depth: 4 -- Solid but slightly less attack-scenario detail than D/I
- **Composite: 4.87**

### Condition M
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All required items
- Precision: 5 -- Confidence labels (CONFIRMED/LIKELY/POSSIBLE) add rigor
- Actionability: 4 -- Fixes present but some are brief ("Validate input with a schema library")
- Structure: 5 -- Consistent format with confidence levels
- Efficiency: 5 -- Four concise findings
- Depth: 4 -- Good but less detailed on attack scenarios
- **Composite: 4.73**

### Condition N
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None -- but Finding 1 claims "Extra Closing Brace" (this is Task 4, not Task 1, so N/A here)
- Completeness: 5 -- All required items plus error handling
- Precision: 5 -- Correct findings with confidence labels
- Actionability: 4 -- Fix suggestions present but some terse
- Structure: 5 -- Severity labels, confidence, clear format
- Efficiency: 4 -- Five findings
- Depth: 4 -- Adequate depth
- **Composite: 4.73**

### Condition O
- must_mention: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Completeness: 5 -- All required items
- Precision: 5 -- Clean findings with confidence labels
- Actionability: 5 -- Code fixes included
- Structure: 5 -- Consistent format with verdicts
- Efficiency: 5 -- Four focused findings
- Depth: 4 -- Good depth, concise
- **Composite: 4.87**

---

## Task cr-002: React UserList Component
**Ground Truth Summary:** Must find useEffect missing dependency array (infinite loop), missing key prop, setUsers/users state mismatch. Must not have false complaints about missing error handling if context doesn't require it.

### Condition D
- must_mention: 3/3 -- infinite loop, missing key prop, setUsers undefined (state mismatch)
- must_not violations: Mentions missing error handling on fetch (#4) and no loading/error state (#5) -- borderline, but given the code obviously fetches data, this is not a "false complaint if context doesn't require it"
- Completeness: 5 -- All three items found
- Precision: 4 -- Error handling findings are valid but push against must_not boundary
- Actionability: 5 -- Clear fixes with code
- Structure: 5 -- Severity labels, verdict
- Efficiency: 4 -- Five findings, two are somewhat beyond scope
- Depth: 5 -- Infinite loop and state mismatch deeply explained
- **Composite: 4.60**

### Condition E
- must_mention: 3/3 -- All three found
- must_not violations: Mentions error handling but appropriate given fetch exists
- Completeness: 5 -- All items covered
- Precision: 4 -- Similar to D on error handling
- Actionability: 5 -- Code fixes provided
- Structure: 5 -- CRITICAL/HIGH labels, verdict
- Efficiency: 4 -- Five findings
- Depth: 4 -- Good coverage
- **Composite: 4.47**

### Condition F
- must_mention: 3/3 -- All three found
- must_not violations: None significant
- Completeness: 5 -- All items plus null reference edge case
- Precision: 5 -- setUsers identified as CRITICAL which is appropriate
- Actionability: 5 -- Thorough fixes
- Structure: 5 -- Good format
- Efficiency: 4 -- Five findings
- Depth: 5 -- State mismatch thoroughly analyzed
- **Composite: 4.87**

### Condition I
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct severities, setUsers CRITICAL
- Actionability: 5 -- Full rewrite suggestion
- Structure: 5 -- Good format
- Efficiency: 4 -- Five findings
- Depth: 5 -- Null reference and loading state considerations
- **Composite: 4.87**

### Condition L
- must_mention: 3/3 -- All three found (setUsers called "undefined" which is the state mismatch)
- must_not violations: None
- Completeness: 5 -- All items with confidence labels
- Precision: 5 -- Correct findings
- Actionability: 5 -- Full component rewrite example
- Structure: 5 -- Finding table, severity + confidence
- Efficiency: 4 -- Four findings, focused
- Depth: 5 -- Deep analysis of the state mismatch
- **Composite: 4.87**

### Condition M
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Confidence labels add rigor
- Actionability: 4 -- Fixes present, some brief
- Structure: 5 -- Consistent format
- Efficiency: 4 -- Four findings
- Depth: 4 -- Adequate
- **Composite: 4.60**

### Condition N
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items plus "filter never wired" observation
- Precision: 5 -- Clean findings
- Actionability: 4 -- Fix suggestions present
- Structure: 5 -- Good format
- Efficiency: 4 -- Five findings
- Depth: 4 -- Good
- **Composite: 4.60**

### Condition O
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Clean findings
- Actionability: 4 -- Fixes present
- Structure: 5 -- Consistent format
- Efficiency: 5 -- Four focused findings
- Depth: 4 -- Concise but adequate
- **Composite: 4.73**

---

## Task cr-003: Python Payment Refund
**Ground Truth Summary:** Must find race condition (no transaction/lock), no audit trail. Must not mention "missing type hints" or "missing docstring" (LOW, unchanged code). Should mark race condition as CRITICAL and audit trail as HIGH.

### Condition D
- must_mention: 2/2 -- Race condition (CRITICAL), audit trail (MEDIUM -- should be HIGH)
- must_not violations: None (no type hints or docstring complaints)
- Completeness: 5 -- Both required items found
- Precision: 4 -- Audit trail at MEDIUM instead of HIGH per ground truth
- Actionability: 5 -- SELECT FOR UPDATE example, transaction code
- Structure: 4 -- Race condition CRITICAL (correct), audit trail MEDIUM (should be HIGH)
- Efficiency: 4 -- Five findings, some extras (input validation, error handling, user_id validation)
- Depth: 5 -- TOCTOU pattern well explained with transaction fix
- **Composite: 4.47**

### Condition E
- must_mention: 2/2 -- Race condition (CRITICAL), audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both items at correct severities
- Precision: 5 -- All findings valid, correct severity assignment
- Actionability: 5 -- Atomic UPDATE with WHERE guard, idempotency suggestion
- Structure: 5 -- CRITICAL for race condition, HIGH for audit trail (matches ground truth)
- Efficiency: 4 -- Five findings
- Depth: 5 -- Negative amount exploitation well explained
- **Composite: 4.87**

### Condition F
- must_mention: 2/2 -- Race condition (CRITICAL), audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both items correctly labeled
- Precision: 5 -- Correct severities
- Actionability: 5 -- Two fix options (atomic UPDATE, SELECT FOR UPDATE)
- Structure: 5 -- Matches ground truth severity
- Efficiency: 4 -- Five findings
- Depth: 5 -- TOCTOU well explained
- **Composite: 4.87**

### Condition I
- must_mention: 2/2 -- Race condition (CRITICAL), audit trail (HIGH)
- must_not violations: None
- Completeness: 5 -- Both items
- Precision: 5 -- Correct severities
- Actionability: 5 -- Detailed fixes
- Structure: 5 -- Correct severity mapping
- Efficiency: 4 -- Five findings
- Depth: 5 -- Comprehensive TOCTOU analysis
- **Composite: 4.87**

### Condition L
- must_mention: 2/2 -- Race condition (CRITICAL), audit trail (not explicitly found as separate finding)
- must_not violations: None
- Completeness: 4 -- Race condition well covered, but audit trail is missing as an explicit finding
- Precision: 5 -- Findings are accurate
- Actionability: 5 -- Atomic update example
- Structure: 4 -- Missing explicit audit trail finding
- Efficiency: 5 -- Three focused findings
- Depth: 5 -- Deep analysis of race condition
- **Composite: 4.47**

### Condition M
- must_mention: 2/2 -- Race condition (CONFIRMED), audit trail (POSSIBLE)
- must_not violations: "Missing type hints" found (Finding 3) -- VIOLATES must_not
- Completeness: 4 -- Both items found but type hints violation
- Precision: 3 -- Type hints is a must_not violation; audit trail at POSSIBLE is weak
- Actionability: 4 -- Fixes present
- Structure: 4 -- Audit trail at POSSIBLE understates its importance
- Efficiency: 3 -- Type hints finding is noise per ground truth
- Depth: 4 -- Good on race condition
- **Composite: 3.67**

### Condition N
- must_mention: 2/2 -- Race condition (CONFIRMED), audit trail (POSSIBLE)
- must_not violations: "Missing Type Hints on Public API" (Finding 3) -- VIOLATES must_not
- Completeness: 4 -- Both items found
- Precision: 3 -- Type hints violation
- Actionability: 4 -- Transaction fix provided
- Structure: 4 -- Audit trail at POSSIBLE is weak
- Efficiency: 3 -- Type hints is noise
- Depth: 4 -- Good on race condition
- **Composite: 3.67**

### Condition O
- must_mention: 2/2 -- Race condition (CONFIRMED), no audit trail explicitly mentioned
- must_not violations: "Missing Type Hints" (Finding 3) -- VIOLATES must_not
- Completeness: 3 -- Race condition found, audit trail missing, type hints violates must_not
- Precision: 3 -- Type hints violation
- Actionability: 4 -- Good fix for race condition
- Structure: 4 -- Missing audit trail finding
- Efficiency: 3 -- Type hints noise
- Depth: 4 -- Race condition well analyzed
- **Composite: 3.40**

---

## Task cr-004: Go DeleteUser Handler
**Ground Truth Summary:** Must find no auth/authorization, returns 200 on error, no method check (accepts GET). Must NOT claim "SQL injection" (query IS parameterized). CRITICAL for missing auth, HIGH for error handling.

### Condition D
- must_mention: 3/3 -- No auth (CRITICAL), returns 200 on error (HIGH), no method check (CRITICAL)
- must_not violations: None -- does NOT claim SQL injection
- Completeness: 5 -- All three items found
- Precision: 5 -- No false positives, SQL injection trap avoided
- Actionability: 5 -- Method check code, error handling code
- Structure: 5 -- CRITICAL for auth and method, HIGH for error handling
- Efficiency: 4 -- Five findings including input validation and RowsAffected
- Depth: 5 -- CSRF via image tag well explained
- **Composite: 4.87**

### Condition E
- must_mention: 3/3 -- All three found
- must_not violations: None -- explicitly notes parameterized query is correct
- Completeness: 5 -- All items
- Precision: 5 -- Positive note about parameterized query; no auth at HIGH not CRITICAL per ground truth (minor downgrade)
- Actionability: 5 -- Code examples
- Structure: 4 -- Auth at HIGH (should be CRITICAL per ground truth)
- Efficiency: 4 -- Five findings
- Depth: 4 -- Good
- **Composite: 4.47**

### Condition F
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items plus soft delete suggestion
- Precision: 5 -- Auth at CRITICAL (correct), method at HIGH
- Actionability: 5 -- Method enforcement code
- Structure: 5 -- Correct severity mapping
- Efficiency: 4 -- Six findings
- Depth: 5 -- Thorough
- **Composite: 4.87**

### Condition I
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Auth at CRITICAL, method at CRITICAL (both appropriate)
- Actionability: 5 -- Detailed code fixes
- Structure: 5 -- Correct severities
- Efficiency: 4 -- Five findings
- Depth: 5 -- CSRF vector well explained
- **Composite: 4.87**

### Condition L
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Auth CRITICAL, method HIGH, error HIGH
- Actionability: 5 -- Code fixes
- Structure: 5 -- Finding table
- Efficiency: 4 -- Four findings
- Depth: 4 -- Good
- **Composite: 4.73**

### Condition M
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct findings
- Actionability: 4 -- Fixes present
- Structure: 5 -- Confidence labels
- Efficiency: 4 -- Four findings
- Depth: 4 -- Adequate
- **Composite: 4.60**

### Condition N
- must_mention: 3/3 -- All three found
- must_not violations: "Syntax Error: Extra Closing Brace" (Finding 1) -- this is a FALSE POSITIVE (the code as given has proper braces; this is an error in the model's reading)
- Completeness: 5 -- All required items found
- Precision: 3 -- False positive on syntax error
- Actionability: 4 -- Fixes present
- Structure: 4 -- False positive damages credibility
- Efficiency: 3 -- Noise from false positive
- Depth: 4 -- Good on real findings
- **Composite: 3.87**

### Condition O
- must_mention: 3/3 -- All three found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Clean findings
- Actionability: 5 -- Code fixes
- Structure: 5 -- Correct format
- Efficiency: 5 -- Four focused findings
- Depth: 4 -- Adequate
- **Composite: 4.87**

---

## Task cr-005: TypeScript Cache Cleanup
**Ground Truth Summary:** Must find deleting from Map during iteration. Must NOT complain about unchanged get() method or "missing return type" on cleanup. Should only review changed code unless CRITICAL in unchanged code.

### Condition D
- must_mention: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: Mentions get() method (Finding 3) as context only -- mild violation. Mentions "missing set()" (LOW) -- acceptable
- Completeness: 5 -- Primary finding found
- Precision: 4 -- get() mention is borderline; access modifier note is noise
- Actionability: 5 -- Two-pass approach fix with code
- Structure: 4 -- Notes get() is "in unchanged code, noting for context -- not blocking"
- Efficiency: 3 -- Four findings on a small change; get() and set() findings are noise
- Depth: 5 -- Correctly notes ES2015 spec behavior while recommending safer pattern
- **Composite: 4.27**

### Condition E
- must_mention: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: "No return type annotation" (LOW) -- VIOLATES must_not. Mentions get() method.
- Completeness: 4 -- Primary finding found but at MEDIUM, not flagged as important
- Precision: 3 -- Return type complaint violates must_not; severity too low
- Actionability: 4 -- Comment suggestion, two-pass alternative
- Structure: 3 -- MEDIUM severity understates the concern; return type violates must_not
- Efficiency: 3 -- Return type is noise
- Depth: 4 -- Correctly identifies spec-safe behavior
- **Composite: 3.47**

### Condition F
- must_mention: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: None explicit (no return type complaint, mentions get() but with caveats about unchanged code)
- Completeness: 4 -- Found but at MEDIUM
- Precision: 4 -- Missing set() is noted but appropriate
- Actionability: 5 -- Two-pass code provided
- Structure: 4 -- MEDIUM is acceptable; "Approve with comments" is good
- Efficiency: 4 -- Three findings, reasonable
- Depth: 4 -- Good analysis of spec compliance
- **Composite: 4.13**

### Condition I
- must_mention: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: None explicit
- Completeness: 5 -- Primary finding well covered
- Precision: 5 -- Correctly HIGH, acknowledges spec safety
- Actionability: 5 -- Two-pass approach with code
- Structure: 5 -- WARNING verdict appropriate
- Efficiency: 4 -- Three findings
- Depth: 5 -- Thorough analysis of spec behavior and maintainability risk
- **Composite: 4.87**

### Condition L
- must_mention: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: None
- Completeness: 5 -- Found with correct context
- Precision: 5 -- POSSIBLE confidence is honest; acknowledges spec safety
- Actionability: 4 -- Two-pass approach suggested as optional
- Structure: 5 -- Clean format
- Efficiency: 5 -- Two findings only, focused on changed code
- Depth: 5 -- Nuanced analysis
- **Composite: 4.87**

### Condition M
- must_mention: 1/1 -- Map deletion during iteration (POSSIBLE)
- must_not violations: None
- Completeness: 4 -- Found but downgraded with only a comment suggestion
- Precision: 5 -- Correctly identifies spec safety; no false positives
- Actionability: 3 -- Minimal: "No fix required. Consider adding a comment"
- Structure: 4 -- POSSIBLE severity is very weak for this finding
- Efficiency: 5 -- Very focused, no noise
- Depth: 4 -- Adequate explanation of spec behavior
- **Composite: 4.13**

### Condition N
- must_mention: 1/1 -- Map deletion during iteration (LIKELY)
- must_not violations: None
- Completeness: 4 -- Found
- Precision: 5 -- No false positives
- Actionability: 4 -- Two-pass code provided
- Structure: 4 -- LIKELY confidence
- Efficiency: 5 -- Two findings, focused
- Depth: 4 -- Good explanation
- **Composite: 4.33**

### Condition O
- must_mention: 1/1 -- Map deletion during iteration (POSSIBLE)
- must_not violations: None
- Completeness: 4 -- Found but very minimal treatment
- Precision: 5 -- Correctly identifies spec safety, no false positives
- Actionability: 3 -- "No issues to flag" is too dismissive
- Structure: 4 -- Minimal structure
- Efficiency: 5 -- Very focused
- Depth: 3 -- Brief treatment, could explain more
- **Composite: 3.93**

---

## Summary

| Task | D | E | F | I | L | M | N | O |
|------|---|---|---|---|---|---|---|---|
| cr-001 | 4.87 | 4.73 | 4.87 | 4.87 | 4.87 | 4.73 | 4.73 | 4.87 |
| cr-002 | 4.60 | 4.47 | 4.87 | 4.87 | 4.87 | 4.60 | 4.60 | 4.73 |
| cr-003 | 4.47 | 4.87 | 4.87 | 4.87 | 4.47 | 3.67 | 3.67 | 3.40 |
| cr-004 | 4.87 | 4.47 | 4.87 | 4.87 | 4.73 | 4.60 | 3.87 | 4.87 |
| cr-005 | 4.27 | 3.47 | 4.13 | 4.87 | 4.87 | 4.13 | 4.33 | 3.93 |
| **Mean** | **4.62** | **4.40** | **4.72** | **4.87** | **4.76** | **4.35** | **4.24** | **4.36** |
