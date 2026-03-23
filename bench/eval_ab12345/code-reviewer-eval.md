# code-reviewer Evaluation

## Task 1: cr-001
**Ground Truth Summary:** Review Express.js endpoint for SQL injection, hardcoded JWT secret, no input validation. Must not have style-only complaints without security context.

### Condition a1
- must_mention: 3/3 (SQL injection, hardcoded JWT secret, no input validation)
- must_not violations: none
- Completeness: 5 — All three must-mention items covered plus role assignment and error handling
- Precision: 5 — All findings are accurate, no false positives
- Actionability: 4 — Fix provided for SQL injection and JWT; others described but less detailed
- Structure: 3 — No explicit severity labels (CRITICAL/HIGH), uses bold headings instead
- Efficiency: 4 — Concise, well-organized
- Depth: 4 — Good explanation of each issue with examples
- **Composite: 4.20**

### Condition a2
- must_mention: 3/3
- must_not violations: none
- Completeness: 5 — All items covered plus role and error handling
- Precision: 5 — Accurate findings, correctly identifies the issues
- Actionability: 5 — Fix suggestions with code for each finding
- Structure: 5 — Clear CRITICAL/HIGH severity labels, verdict included
- Efficiency: 4 — Well-organized, not padded
- Depth: 5 — Thorough explanation with code examples
- **Composite: 4.87**

### Condition a3
- must_mention: 3/3
- must_not violations: none
- Completeness: 5 — All must-mention items plus privilege escalation and token expiry
- Precision: 5 — All findings accurate
- Actionability: 5 — Code fixes provided for SQL injection and JWT
- Structure: 4 — Has severity labels (Critical/High) but less formal structure
- Efficiency: 4 — Reasonable length
- Depth: 4 — Good explanations
- **Composite: 4.60**

### Condition a4
- must_mention: 3/3
- must_not violations: none
- Completeness: 5 — All items covered with confidence labels
- Precision: 5 — Accurate, well-labeled confidence levels
- Actionability: 5 — Code fixes included
- Structure: 5 — CONFIRMED/LIKELY labels, CRITICAL/HIGH severity
- Efficiency: 4 — Concise
- Depth: 5 — Good trace of each vulnerability
- **Composite: 4.87**

### Condition a5
- must_mention: 3/3
- must_not violations: none
- Completeness: 5 — All items plus privilege escalation
- Precision: 5 — All accurate with confidence labels
- Actionability: 5 — Detailed fix suggestions with code
- Structure: 5 — CONFIRMED/LIKELY labels, CRITICAL/HIGH labels, clear sections
- Efficiency: 4 — Appropriate length
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b1
- must_mention: 3/3
- must_not violations: none
- Completeness: 5 — All items plus missing response headers, CORS
- Precision: 4 — "Missing Response Headers" is somewhat padded; CORS is speculative
- Actionability: 5 — Full rewritten code example
- Structure: 4 — Has CRITICAL label but structure is less clean; provides full rewrite
- Efficiency: 3 — Full rewrite is verbose for a review
- Depth: 4 — Good but verbose
- **Composite: 4.20**

### Condition b2
- must_mention: 3/3
- must_not violations: none — file references are wrong (says services/payment.py for a JS file) but not a must_not issue
- Completeness: 5 — All items covered
- Precision: 3 — Wrong file references (services/payment.py for an Express.js file); missing unique constraint check is speculative
- Actionability: 4 — Fix suggestions included
- Structure: 4 — CRITICAL/HIGH labels present
- Efficiency: 4 — Reasonable length
- Depth: 4 — Good explanations
- **Composite: 3.93**

### Condition b3
- must_mention: 3/3
- must_not violations: none
- Completeness: 5 — All items plus rate limiting, email uniqueness
- Precision: 4 — Some findings speculative (rate limiting, email uniqueness not in the code)
- Actionability: 4 — Fixes described
- Structure: 4 — CRITICAL/HIGH labels
- Efficiency: 3 — Some padding with speculative findings
- Depth: 4 — Good depth on main issues
- **Composite: 4.00**

### Condition b4
- must_mention: 3/3
- must_not violations: none
- Completeness: 5 — All items covered
- Precision: 5 — Accurate, confidence-labeled
- Actionability: 5 — Code fixes provided
- Structure: 5 — CRITICAL/HIGH severity, CONFIRMED labels
- Efficiency: 4 — Appropriate length
- Depth: 5 — Strong explanations
- **Composite: 4.87**

### Condition b5
- must_mention: 3/3
- must_not violations: none
- Completeness: 5 — All items plus information disclosure
- Precision: 5 — Accurate findings
- Actionability: 5 — Code fixes
- Structure: 5 — CRITICAL/HIGH labels with line references
- Efficiency: 4 — Good length
- Depth: 5 — Strong depth
- **Composite: 4.87**

---

## Task 2: cr-002
**Ground Truth Summary:** Review React component for infinite loop (missing dep array), missing key prop, setUsers/props mismatch. Must not have false complaints about missing error handling.

### Condition a1
- must_mention: 3/3 (infinite loop, missing key, state mismatch)
- must_not violations: Minor — mentions "No error handling" but not as a false complaint about required context; mentions XSS and self-corrects. Borderline.
- Completeness: 5 — All three issues identified
- Precision: 4 — Error handling mentioned, XSS mentioned then retracted
- Actionability: 4 — Fix suggestions included
- Structure: 3 — No severity labels
- Efficiency: 4 — Concise
- Depth: 4 — Good explanations
- **Composite: 3.93**

### Condition a2
- must_mention: 3/3
- must_not violations: Has "Missing Loading and Error States" at MEDIUM — this is borderline since ground truth says must_not "false complaints about missing error handling if context doesn't require it"
- Completeness: 5 — All items found
- Precision: 4 — Error/loading state finding is borderline violation
- Actionability: 5 — Code fixes
- Structure: 5 — CRITICAL/HIGH/MEDIUM labels, verdict
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.53**

### Condition a3
- must_mention: 3/3
- must_not violations: Has "No error handling" and "No loading state" — borderline
- Completeness: 5 — All items
- Precision: 4 — Error handling mention
- Actionability: 4 — Fixes described
- Structure: 4 — Has severity labels
- Efficiency: 4 — Good
- Depth: 4 — Solid
- **Composite: 4.20**

### Condition a4
- must_mention: 3/3
- must_not violations: Has "CONFIRMED - Missing loading and error states (HIGH)" — borderline
- Completeness: 5 — All items
- Precision: 4 — Loading/error state finding borderline
- Actionability: 4 — Fixes described
- Structure: 5 — CONFIRMED labels, severity labels
- Efficiency: 4 — Good
- Depth: 4 — Solid
- **Composite: 4.33**

### Condition a5
- must_mention: 3/3
- must_not violations: Has "[LIKELY] No loading or error state - Medium" — borderline, but rated Medium which is acceptable
- Completeness: 5 — All items
- Precision: 4 — Loading state mentioned but at Medium
- Actionability: 5 — Code fixes
- Structure: 5 — CONFIRMED/LIKELY labels, severity
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.53**

### Condition b1
- must_mention: 2/3 — Does not clearly identify the state mismatch (mentions setUsers not defined but doesn't connect it to props/state mismatch clearly); actually: "Variable Not Declared - setUsers is used but never declared with useState" + "Missing Dependency in Effect" — partially captures state mismatch but weakly. Also marks infinite loop only as HIGH not CRITICAL.
- must_not violations: Multiple — Missing error handling, loading state, empty filter behavior as separate findings
- Completeness: 4 — Key, infinite loop found; state mismatch partially
- Precision: 3 — Multiple low-value findings, infinite loop only HIGH
- Actionability: 5 — Full rewrite provided
- Structure: 3 — CRITICAL says "None" which is wrong (infinite loop should be CRITICAL)
- Efficiency: 3 — Verbose with full rewrite
- Depth: 3 — Misses severity of infinite loop
- **Composite: 3.33**

### Condition b2
- must_mention: 2/3 — "Missing Dependency Array" is listed as HIGH and mentions setUsers is not defined, but does not clearly identify infinite loop behavior. Says "Potential Infinite Loop" separately but mischaracterizes it.
- must_not violations: Error handling, loading state mentioned
- Completeness: 3 — Infinite loop partially captured, key prop missing from HIGH findings
- Precision: 3 — Severity misclassification (infinite loop as HIGH, not CRITICAL)
- Actionability: 4 — Fix suggestions
- Structure: 4 — Severity labels present
- Efficiency: 3 — Some noise
- Depth: 3 — Weaker analysis
- **Composite: 3.27**

### Condition b3
- must_mention: 3/3 — Infinite loop identified as HIGH, setUsers state issue, key missing
- must_not violations: Error handling, loading state, case sensitivity mentioned
- Completeness: 5 — All items
- Precision: 3 — Infinite loop only HIGH, several noisy findings
- Actionability: 4 — Fixes provided
- Structure: 4 — Severity labels
- Efficiency: 3 — Extra noise
- Depth: 3 — Misses CRITICAL on infinite loop
- **Composite: 3.53**

### Condition b4
- must_mention: 3/3 — Infinite loop (HIGH), missing key (MEDIUM), setUsers undefined
- must_not violations: Error handling mentioned, loading state, potential null crash
- Completeness: 5 — All items
- Precision: 3 — Infinite loop only HIGH, lots of noise
- Actionability: 4 — Fixes
- Structure: 4 — Labels present
- Efficiency: 3 — Several noisy findings
- Depth: 3 — Severity miscategorized
- **Composite: 3.53**

### Condition b5
- must_mention: 3/3 — Infinite loop (CRITICAL), missing key, missing setUsers
- must_not violations: Error handling, loading state mentioned
- Completeness: 5 — All items found
- Precision: 4 — Core findings correct, some noise
- Actionability: 4 — Fixes provided
- Structure: 5 — CONFIRMED labels, severity, line references
- Efficiency: 3 — Some noise
- Depth: 4 — Good depth on main issues
- **Composite: 4.07**

---

## Task 3: cr-003
**Ground Truth Summary:** Review Python refund function for race condition (CRITICAL) and no audit trail (HIGH). Must not mention "missing type hints" or "missing docstring."

### Condition a1
- must_mention: 1/2 — Race condition found; no audit trail not explicitly mentioned (mentions "no transaction" and email timing but not audit trail)
- must_not violations: Has "Floating-point arithmetic" which is LOW noise but not exactly type hints/docstring
- Completeness: 3 — Race condition found, audit trail missing
- Precision: 4 — Findings are accurate
- Actionability: 5 — Atomic SQL fix provided
- Structure: 3 — No formal severity labels
- Efficiency: 4 — Concise
- Depth: 4 — Good race condition analysis
- **Composite: 3.73**

### Condition a2
- must_mention: 1/2 — Race condition found with CRITICAL; no audit trail not mentioned explicitly
- must_not violations: none
- Completeness: 3 — Missing audit trail
- Precision: 5 — Accurate findings
- Actionability: 5 — Code fixes with SELECT FOR UPDATE
- Structure: 5 — CRITICAL/HIGH labels, verdict
- Efficiency: 4 — Good
- Depth: 5 — Thorough race condition analysis
- **Composite: 4.20**

### Condition a3
- must_mention: 1/2 — Race condition (High, should be Critical); no audit trail missing
- must_not violations: none
- Completeness: 3 — Missing audit trail, race condition severity too low
- Precision: 4 — Race condition correctly identified but severity wrong (High vs Critical)
- Actionability: 5 — Code fix provided
- Structure: 4 — Has severity labels
- Efficiency: 4 — Good
- Depth: 4 — Good analysis
- **Composite: 3.80**

### Condition a4
- must_mention: 1/2 — Race condition (CRITICAL); no audit trail not mentioned
- must_not violations: none
- Completeness: 3 — Missing audit trail
- Precision: 5 — Accurate with confidence labels
- Actionability: 5 — Code fix
- Structure: 5 — CONFIRMED/LIKELY labels, CRITICAL
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.20**

### Condition a5
- must_mention: 1/2 — Race condition (CRITICAL); no audit trail missing
- must_not violations: 1 — "[POSSIBLE] Missing type hints - Low" — explicit must_not violation
- Completeness: 3 — Missing audit trail
- Precision: 3 — Type hints violation
- Actionability: 5 — Detailed fix
- Structure: 5 — Confidence + severity labels
- Efficiency: 3 — Includes forbidden finding
- Depth: 4 — Good race condition analysis
- **Composite: 3.60**

### Condition b1
- must_mention: 2/2 — Race condition found, "Logging Missing - No audit trail for refund operations" found
- must_not violations: none
- Completeness: 5 — Both must-mention items found
- Precision: 4 — Race condition labeled HIGH not CRITICAL; some extra findings
- Actionability: 5 — Full code rewrite
- Structure: 4 — Has severity labels
- Efficiency: 3 — Verbose with full rewrite
- Depth: 4 — Good
- **Composite: 4.07**

### Condition b2
- must_mention: 2/2 — Race condition (CRITICAL), "No Audit Trail" (HIGH)
- must_not violations: none
- Completeness: 5 — Both items found with correct severity
- Precision: 5 — Accurate
- Actionability: 5 — Fix code provided
- Structure: 5 — CRITICAL/HIGH labels
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b3
- must_mention: 2/2 — Race condition (CRITICAL), "No Audit Trail" (HIGH)
- must_not violations: none
- Completeness: 5 — Both items
- Precision: 5 — Accurate
- Actionability: 5 — Code fix
- Structure: 5 — CRITICAL/HIGH labels
- Efficiency: 4 — Good
- Depth: 5 — Good analysis
- **Composite: 4.87**

### Condition b4
- must_mention: 2/2 — Race condition (CONFIRMED, CRITICAL), "No Refund Record Created" (HIGH) — this is the audit trail
- must_not violations: none
- Completeness: 5 — Both items
- Precision: 5 — Accurate
- Actionability: 5 — Code fix
- Structure: 5 — Confidence + severity labels
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b5
- must_mention: 1/2 — Race condition (CRITICAL); no explicit audit trail finding
- must_not violations: none
- Completeness: 3 — Missing audit trail
- Precision: 5 — Accurate
- Actionability: 5 — Code fix
- Structure: 5 — CONFIRMED labels, severity, line references
- Efficiency: 4 — Good
- Depth: 4 — Good race condition analysis
- **Composite: 4.07**

---

## Task 4: cr-004
**Ground Truth Summary:** No auth check (CRITICAL), returns 200 on error (HIGH), no method check (accepts GET for destructive op). Must NOT claim SQL injection (query IS parameterized).

### Condition a1
- must_mention: 2/3 — No auth (found), 200 on error (found), no method check (not mentioned)
- must_not violations: none — does not claim SQL injection
- Completeness: 4 — Missing method check
- Precision: 5 — No false positives, correctly avoids SQL injection claim
- Actionability: 5 — Code fix
- Structure: 3 — No severity labels
- Efficiency: 4 — Concise
- Depth: 4 — Good
- **Composite: 4.07**

### Condition a2
- must_mention: 2/3 — No auth, 200 on error; no method check missing
- must_not violations: none
- Completeness: 4 — Missing method check
- Precision: 5 — Correctly notes parameterized query prevents injection
- Actionability: 5 — Code fix
- Structure: 5 — Severity labels, verdict
- Efficiency: 4 — Good
- Depth: 4 — Explicitly clarifies no SQL injection
- **Composite: 4.47**

### Condition a3
- must_mention: 2/3 — No auth (Critical), error handling (High); method check missing
- must_not violations: none
- Completeness: 4 — Missing method check
- Precision: 5 — Correctly notes parameterized query is safe
- Actionability: 5 — Code fix
- Structure: 4 — Severity labels
- Efficiency: 4 — Good
- Depth: 4 — Good
- **Composite: 4.33**

### Condition a4
- must_mention: 2/3 — No auth (CRITICAL), error handling (HIGH); method check missing
- must_not violations: none
- Completeness: 4 — Missing method check
- Precision: 5 — Correctly avoids SQL injection claim
- Actionability: 5 — Code fix
- Structure: 5 — CONFIRMED labels, severity
- Efficiency: 4 — Good
- Depth: 4 — Good
- **Composite: 4.47**

### Condition a5
- must_mention: 2/3 — No auth (Critical), 200 on error (High); method check missing
- must_not violations: none
- Completeness: 4 — Missing method check
- Precision: 5 — Correctly avoids SQL injection
- Actionability: 5 — Code fix
- Structure: 5 — Severity labels
- Efficiency: 4 — Good
- Depth: 4 — Good
- **Composite: 4.47**

### Condition b1
- must_mention: 3/3 — No auth (CRITICAL), 200 on error, no method check
- must_not violations: 1 — "SQL Injection via Query Parameter (CRITICAL)" — this is explicitly forbidden. While it then hedges ("Current code appears safe"), listing it as CRITICAL is a false positive.
- Completeness: 5 — All items found
- Precision: 1 — Claims SQL injection as CRITICAL which is explicitly a false positive trap
- Actionability: 5 — Full rewrite
- Structure: 4 — Labels present
- Efficiency: 3 — Verbose
- Depth: 3 — SQL injection claim undermines credibility
- **Composite: 3.07**

### Condition b2
- must_mention: 3/3 — No auth (CRITICAL), error handling, method check missing... wait checking: "No Method Check" not found. Actually there's no explicit mention of accepting GET for destructive operation. Missing.
- must_mention: 2/3 — No auth, error handling found; method check not found
- must_not violations: 1 — "SQL Injection via Query Parameter (CRITICAL)" listed, though hedged
- Completeness: 4 — Missing method check
- Precision: 2 — SQL injection listed as CRITICAL (false positive)
- Actionability: 4 — Fixes present
- Structure: 4 — Labels
- Efficiency: 3 — Some noise
- Depth: 3 — SQL injection claim hurts
- **Composite: 3.07**

### Condition b3
- must_mention: 2/3 — No auth (CRITICAL), error handling; method check not mentioned
- must_not violations: 1 — "SQL Injection via Query Parameter (CONFIRMED)" — false positive
- Completeness: 4 — Missing method check
- Precision: 2 — SQL injection false positive
- Actionability: 4 — Fixes
- Structure: 4 — Labels
- Efficiency: 3 — Noise
- Depth: 3 — SQL injection claim hurts
- **Composite: 3.07**

### Condition b4
- must_mention: 2/3 — No auth (CRITICAL), error handling; method check not found
- must_not violations: 1 — "SQL Injection via Query Param (CONFIRMED)" listed then hedged as "actually SAFE"
- Completeness: 4 — Missing method check
- Precision: 3 — Lists SQL injection then retracts — confusing but less harmful
- Actionability: 4 — Fixes
- Structure: 4 — CONFIRMED labels
- Efficiency: 3 — Noisy with the retraction
- Depth: 4 — Generally good analysis
- **Composite: 3.53**

### Condition b5
- must_mention: 2/3 — No auth (CRITICAL), error handling; method check not found
- must_not violations: 1 — "SQL Injection (CRITICAL)" listed then immediately retracted as "actually SAFE"
- Completeness: 4 — Missing method check
- Precision: 3 — Lists then retracts SQL injection
- Actionability: 4 — Fixes
- Structure: 5 — CONFIRMED labels, severity, line references
- Efficiency: 3 — Retraction is noisy
- Depth: 4 — Generally thorough
- **Composite: 3.67**

---

## Task 5: cr-005
**Ground Truth Summary:** Must mention deleting from Map during iteration. Must NOT complain about unchanged get() method or "missing return type" on cleanup.

### Condition a1
- must_mention: 1/1 — Mentions Map deletion during iteration but says it's safe per spec
- must_not violations: 1 — Comments on "No set method shown" which is about unchanged code; also comments on cleanup being public (minor). Does NOT complain about get() method though.
- Completeness: 4 — Main issue identified
- Precision: 4 — Says it's safe (which is debatable per ground truth phrasing "may cause issues")
- Actionability: 3 — Suggestions are minor
- Structure: 3 — No severity labels
- Efficiency: 4 — Focused on changed code
- Depth: 4 — Good analysis of spec behavior
- **Composite: 3.67**

### Condition a2
- must_mention: 1/1 — Mentions Map deletion during iteration
- must_not violations: 1 — "No Visibility Modifier" is LOW noise (ground truth says must_not "missing return type")
- Completeness: 4 — Main issue mentioned but noted as safe per spec
- Precision: 4 — Correctly notes spec safety, flags as awareness
- Actionability: 3 — Minor suggestion
- Structure: 4 — LOW label, APPROVE verdict
- Efficiency: 5 — Focused, minimal noise
- Depth: 4 — Good spec analysis
- **Composite: 3.93**

### Condition a3
- must_mention: 1/1 — Map deletion during iteration noted
- must_not violations: none — mentions visibility modifier which is minor
- Completeness: 4 — Issue identified, noted as safe
- Precision: 5 — Accurate, correctly notes safety
- Actionability: 3 — Design suggestions
- Structure: 4 — Minor/minor headings
- Efficiency: 5 — Well-focused on changed code
- Depth: 4 — Good
- **Composite: 4.07**

### Condition a4
- must_mention: 1/1 — Map deletion during iteration (HIGH)
- must_not violations: none
- Completeness: 4 — Issue identified
- Precision: 4 — Labels it HIGH but then says it's safe per spec — inconsistent
- Actionability: 3 — Suggests alternative but says current is fine
- Structure: 5 — CONFIRMED label, severity
- Efficiency: 4 — Good
- Depth: 4 — Explains spec behavior
- **Composite: 3.93**

### Condition a5
- must_mention: 1/1 — Notes Map deletion; says "No issue in the changed lines"
- must_not violations: none
- Completeness: 3 — Identifies the pattern but says no issue
- Precision: 4 — Technically correct per spec but ground truth considers it noteworthy
- Actionability: 3 — Only design suggestions
- Structure: 5 — CONFIRMED label
- Efficiency: 5 — Well-focused
- Depth: 3 — Dismisses the concern
- **Composite: 3.67**

### Condition b1
- must_mention: 1/1 — "Iterating While Modifying Collection (BUG)" — overstates it as a bug
- must_not violations: 1 — Multiple findings about unchanged behavior (scheduling, return value, empty map)
- Completeness: 5 — Found the issue
- Precision: 2 — Claims "Behavior is undefined in some JavaScript engines" which is false for Map; overstates as BUG
- Actionability: 5 — Multiple fix options
- Structure: 4 — Summary table
- Efficiency: 2 — Too many minor findings, verbose
- Depth: 2 — Wrong about engine behavior
- **Composite: 3.07**

### Condition b2
- must_mention: 1/1 — "Potential Concurrent Modification" at MEDIUM
- must_not violations: 1 — Comments on get() efficiency which is unchanged code
- Completeness: 4 — Found the issue
- Precision: 3 — "can cause issues in some JS engines" is inaccurate for Map
- Actionability: 4 — Fix code provided
- Structure: 4 — MEDIUM label, APPROVE verdict
- Efficiency: 3 — Some noise
- Depth: 3 — Inaccurate claim
- **Composite: 3.33**

### Condition b3
- must_mention: 1/1 — "Modifying Map During Iteration" at MEDIUM
- must_not violations: 1 — Comments on get() not triggering cleanup (unchanged code)
- Completeness: 4 — Found it
- Precision: 4 — Notes it's safe but surprising
- Actionability: 3 — Suggestions
- Structure: 4 — MEDIUM label
- Efficiency: 3 — Some noise from unchanged code
- Depth: 3 — OK
- **Composite: 3.47**

### Condition b4
- must_mention: 1/1 — "Modifying Map During Iteration (CONFIRMED)"
- must_not violations: none — stays focused on changed code
- Completeness: 4 — Found it
- Precision: 4 — Notes safe but confusing
- Actionability: 3 — Suggestions
- Structure: 4 — MEDIUM label, CONFIRMED
- Efficiency: 4 — Reasonable length
- Depth: 4 — Good analysis
- **Composite: 3.80**

### Condition b5
- must_mention: 1/1 — "Unsafe Iteration During Modification (CRITICAL)"
- must_not violations: none
- Completeness: 4 — Found the issue
- Precision: 2 — Labels it CRITICAL and says "iterator may skip entries or throw" which is false for Map
- Actionability: 4 — Fix code provided
- Structure: 4 — CONFIRMED, severity labels
- Efficiency: 3 — Some noise
- Depth: 2 — Incorrect claim about behavior
- **Composite: 3.07**

---

## Summary

| Task | a1 | a2 | a3 | a4 | a5 | b1 | b2 | b3 | b4 | b5 |
|------|----|----|----|----|----|----|----|----|----|----|
| cr-001 | 4.20 | 4.87 | 4.60 | 4.87 | 4.87 | 4.20 | 3.93 | 4.00 | 4.87 | 4.87 |
| cr-002 | 3.93 | 4.53 | 4.20 | 4.33 | 4.53 | 3.33 | 3.27 | 3.53 | 3.53 | 4.07 |
| cr-003 | 3.73 | 4.20 | 3.80 | 4.20 | 3.60 | 4.07 | 4.87 | 4.87 | 4.87 | 4.07 |
| cr-004 | 4.07 | 4.47 | 4.33 | 4.47 | 4.47 | 3.07 | 3.07 | 3.07 | 3.53 | 3.67 |
| cr-005 | 3.67 | 3.93 | 4.07 | 3.93 | 3.67 | 3.07 | 3.33 | 3.47 | 3.80 | 3.07 |
| **Mean** | **3.92** | **4.40** | **4.20** | **4.36** | **4.23** | **3.55** | **3.69** | **3.79** | **4.12** | **3.95** |
