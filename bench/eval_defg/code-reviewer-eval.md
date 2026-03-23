# code-reviewer Evaluation (D/E/F/G)

## Task 1: cr-001

**Ground Truth Summary:** Review Express.js endpoint. Must mention: SQL injection, hardcoded JWT secret, no input validation. Must not: style-only complaints without security context. Structure: severity labels (CRITICAL/HIGH), file:line references, fix suggestions.

### Condition D
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Code artifacts: None (markdown only)
- Completeness: 5 -- All three required findings plus additional valid issues (no auth, no error handling)
- Precision: 5 -- All claims accurate, proper severity classification (CRITICAL for SQLi and JWT, HIGH for validation)
- Actionability: 4 -- Fix code snippets included; no runnable files on disk
- Structure: 5 -- Clean severity headers, line references, summary table, verdict
- Efficiency: 5 -- High signal-to-noise, no fluff
- Depth: 5 -- Detailed explanations of attack vectors, privilege escalation via role field
- **Composite: 4.87**

### Condition E
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation
- must_not violations: None
- Code artifacts: JS + Jest tests on disk (103 tests passing across all tasks)
- Completeness: 5 -- All required findings plus additional valid issues
- Precision: 5 -- Accurate claims, correct severity levels
- Actionability: 4 -- Fix snippets inline; code on disk is for TDD tasks, not this review
- Structure: 5 -- Consistent format with severity tags, verdict, summary table
- Efficiency: 5 -- Concise, focused findings
- Depth: 4 -- Solid explanations but slightly less detailed attack chain descriptions than D
- **Composite: 4.73**

### Condition F
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation (elevated to CRITICAL as mass assignment)
- must_not violations: None
- Code artifacts: TS + Jest tests on disk (74 tests passing across all tasks)
- Completeness: 5 -- All required findings plus token-returned-on-creation observation
- Precision: 5 -- Accurate; labeling no input validation as CRITICAL (mass assignment angle) is defensible
- Actionability: 4 -- Fix snippets inline
- Structure: 5 -- Clear severity headers, well-organized
- Efficiency: 5 -- Tight, no wasted space
- Depth: 4 -- Good depth; mass assignment call-out is a nice non-obvious insight
- **Composite: 4.73**

### Condition G
- must_mention coverage: 3/3 -- SQL injection, hardcoded JWT secret, no input validation (CRITICAL)
- must_not violations: None
- Code artifacts: JS + Jest tests in tmp/ (68 tests passing across all tasks)
- Completeness: 5 -- All required findings plus error handling and token observation
- Precision: 5 -- Accurate claims, correct severity
- Actionability: 4 -- Fix snippets inline
- Structure: 5 -- Well organized with severity labels, summary table
- Efficiency: 5 -- Focused
- Depth: 4 -- Good explanations; notes mass assignment angle
- **Composite: 4.73**

---

## Task 2: cr-002

**Ground Truth Summary:** Review React component. Must mention: useEffect missing dependency array (infinite loop), missing key prop, setUsers/state mismatch. Must not: false complaints about missing error handling if context doesn't require it. Structure: severity per finding, approval recommendation.

### Condition D
- must_mention coverage: 3/3 -- infinite loop, missing key, setUsers/state mismatch
- must_not violations: Mentions missing error handling (borderline -- context is ambiguous but ground truth says not to complain if context doesn't require it; D flags it as HIGH which is somewhat aggressive)
- Code artifacts: None
- Completeness: 5 -- All three core issues identified
- Precision: 4 -- Minor: raises error handling as HIGH when ground truth warns against false complaints here
- Actionability: 4 -- Fix snippets included
- Structure: 5 -- Severity labels, verdict
- Efficiency: 4 -- Slightly verbose with loading/error state discussion
- Depth: 5 -- Excellent explanation of the state mismatch design confusion
- **Composite: 4.47**

### Condition E
- must_mention coverage: 3/3 -- infinite loop (CRITICAL), setUsers undefined (HIGH), missing keys (HIGH)
- must_not violations: Mentions missing error handling but at HIGH level (same concern)
- Code artifacts: On disk
- Completeness: 5 -- All three core issues
- Precision: 4 -- Same error handling concern as D
- Actionability: 4 -- Fix snippets included
- Structure: 5 -- Clean format with severity tags
- Efficiency: 4 -- Mentions potential null crash, which is valid but adds noise
- Depth: 4 -- Good analysis of state ownership confusion
- **Composite: 4.33**

### Condition F
- must_mention coverage: 3/3 -- infinite loop (CRITICAL), setUsers undefined (HIGH), missing keys (HIGH)
- must_not violations: Mentions error handling at MEDIUM level (less severe than D/E)
- Code artifacts: On disk
- Completeness: 5 -- All three core issues
- Precision: 4 -- Still mentions error handling but at MEDIUM, more appropriate
- Actionability: 4 -- Fix snippets
- Structure: 4 -- Slightly less organized (some findings listed as MEDIUM without full table)
- Efficiency: 4 -- Decent signal-to-noise
- Depth: 4 -- Good explanation of design confusion
- **Composite: 4.20**

### Condition G
- must_mention coverage: 3/3 -- infinite loop (HIGH), setUsers not defined (HIGH), missing keys (HIGH)
- must_not violations: Mentions error handling at MEDIUM level
- Code artifacts: On disk
- Completeness: 5 -- All core issues found
- Precision: 4 -- Downgrades infinite loop to HIGH instead of CRITICAL; ground truth doesn't mandate CRITICAL but most would consider it so
- Actionability: 4 -- Fix snippets
- Structure: 4 -- Severity labels present but infinite loop downgraded
- Efficiency: 4 -- Reasonable
- Depth: 4 -- Good analysis of state confusion, notes nullable crash
- **Composite: 4.20**

---

## Task 3: cr-003

**Ground Truth Summary:** Review Python payment function. Must mention: race condition (no transaction/lock), no audit trail. Must not: "missing type hints" (LOW), "missing docstring" (LOW). Structure: CRITICAL for race condition, HIGH for missing audit.

### Condition D
- must_mention coverage: 2/2 -- race condition (CRITICAL), no audit trail (MEDIUM -- should be HIGH per ground truth)
- must_not violations: None -- does not mention type hints or docstrings
- Code artifacts: None
- Completeness: 5 -- Both required findings plus valid extras (input validation, error handling)
- Precision: 4 -- Audit trail at MEDIUM instead of HIGH per ground truth
- Actionability: 4 -- Fix code with SELECT FOR UPDATE example
- Structure: 4 -- Race condition is CRITICAL (correct), audit trail is MEDIUM (ground truth says HIGH)
- Efficiency: 4 -- Good signal-to-noise
- Depth: 5 -- Excellent explanation of TOCTOU pattern, double refund scenario
- **Composite: 4.33**

### Condition E
- must_mention coverage: 2/2 -- race condition (CRITICAL), no audit trail (HIGH)
- must_not violations: None
- Code artifacts: On disk
- Completeness: 5 -- Both required plus extras
- Precision: 5 -- Correct severity for both
- Actionability: 4 -- Fix with atomic UPDATE example
- Structure: 5 -- CRITICAL for race, HIGH for audit (matches ground truth)
- Efficiency: 5 -- Focused
- Depth: 5 -- Detailed explanation including negative amount exploit
- **Composite: 4.87**

### Condition F
- must_mention coverage: 2/2 -- race condition (HIGH -- should be CRITICAL), no audit trail (MEDIUM -- should be HIGH)
- must_not violations: None
- Code artifacts: On disk
- Completeness: 5 -- Both findings plus extras
- Precision: 3 -- Race condition at HIGH instead of CRITICAL is a significant misclassification for a financial operation
- Actionability: 4 -- Fix examples included
- Structure: 3 -- Severity mismatch: race condition should be CRITICAL, audit should be HIGH
- Efficiency: 4 -- Good
- Depth: 4 -- Mentions TOCTOU but downgraded severity undermines the analysis
- **Composite: 3.73**

### Condition G
- must_mention coverage: 2/2 -- race condition (HIGH), no audit trail (MEDIUM)
- must_not violations: None
- Code artifacts: On disk
- Completeness: 5 -- Both findings
- Precision: 3 -- Race condition at HIGH instead of CRITICAL; audit at MEDIUM instead of HIGH
- Actionability: 4 -- Fix examples
- Structure: 3 -- Same severity misclassification as F
- Efficiency: 4 -- Good
- Depth: 4 -- Mentions TOCTOU, includes auth check note
- **Composite: 3.73**

---

## Task 4: cr-004

**Ground Truth Summary:** Review Go handler. Must mention: no auth/authz on delete, returns 200 even on error, no method check. Must NOT: "SQL injection" (query IS parameterized). Structure: CRITICAL for missing auth, HIGH for error handling.

### Condition D
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), no method check (CRITICAL)
- must_not violations: None -- explicitly does NOT claim SQL injection
- Code artifacts: None
- Completeness: 5 -- All three required findings plus valid extras
- Precision: 5 -- No false positives; correctly avoids SQLi trap
- Actionability: 4 -- Fix snippets included
- Structure: 5 -- CRITICAL for auth and method, HIGH for error handling
- Efficiency: 5 -- Well focused
- Depth: 5 -- Explains CSRF via GET, link prefetchers, image tags
- **Composite: 4.87**

### Condition E
- must_mention coverage: 3/3 -- no auth (HIGH -- should be CRITICAL), 200 on error (HIGH), no method check (HIGH)
- must_not violations: None -- explicitly notes parameterized query is correct
- Code artifacts: On disk
- Completeness: 5 -- All three findings
- Precision: 4 -- Auth at HIGH instead of CRITICAL is a downgrade
- Actionability: 4 -- Fix snippets
- Structure: 4 -- Auth should be CRITICAL per ground truth
- Efficiency: 5 -- Clean, includes positive observation about parameterized query
- Depth: 4 -- Good CSRF explanation
- **Composite: 4.33**

### Condition F
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), method not enforced (MEDIUM -- should be higher)
- must_not violations: None
- Code artifacts: On disk
- Completeness: 5 -- All three findings
- Precision: 4 -- Method check at MEDIUM is arguably low; also hedges on auth with "confirm middleware" note
- Actionability: 4 -- Fix snippets
- Structure: 4 -- Mostly correct but method check downgraded
- Efficiency: 4 -- Slight hedging adds noise
- Depth: 4 -- Reasonable
- **Composite: 4.20**

### Condition G
- must_mention coverage: 3/3 -- no auth (CRITICAL), 200 on error (HIGH), method not enforced (MEDIUM)
- must_not violations: None
- Code artifacts: On disk
- Completeness: 5 -- All three findings plus extras
- Precision: 4 -- Method check at MEDIUM is low
- Actionability: 4 -- Fix snippets
- Structure: 4 -- Mostly correct
- Efficiency: 4 -- Good
- Depth: 4 -- Reasonable depth
- **Composite: 4.20**

---

## Task 5: cr-005

**Ground Truth Summary:** Review TypeScript Cache cleanup. Must mention: deleting from Map during iteration. Must not: complaints about unchanged get() method, "missing return type" on cleanup. Structure: only review changed code unless CRITICAL.

### Condition D
- must_mention coverage: 1/1 -- Map deletion during iteration (HIGH)
- must_not violations: Mentions get() method (flagged as MEDIUM context note, explicitly says "in unchanged code, so flagging only as context -- not blocking"); mentions missing set() method (LOW). Borderline but acknowledges unchanged code caveat.
- Code artifacts: None
- Completeness: 4 -- Core finding present; extra notes on unchanged code slightly outside scope
- Precision: 5 -- Correctly notes Map deletion is spec-safe but risky pattern
- Actionability: 4 -- Provides two-pass fix pattern
- Structure: 4 -- Mostly scoped to changed code but mentions unchanged get()
- Efficiency: 4 -- Slight scope creep
- Depth: 5 -- Excellent nuance about ES2015 spec, maintainability concern, engine differences
- **Composite: 4.47**

### Condition E
- must_mention coverage: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: Mentions return type at LOW (ground truth says must_not "missing return type" on cleanup); mentions cleanup access modifier (LOW)
- Code artifacts: On disk
- Completeness: 4 -- Core finding present
- Precision: 3 -- Mentions "missing return type" which ground truth says must_not; also notes it's "not a bug" which is honest
- Actionability: 4 -- Provides alternative pattern with comment suggestion
- Structure: 4 -- Scoped well, good positive observations
- Efficiency: 4 -- Some noise from LOW findings
- Depth: 4 -- Good spec-awareness
- **Composite: 3.73**

### Condition F
- must_mention coverage: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: Mentions missing public visibility modifier (LOW) -- borderline since ground truth says no "missing return type" specifically
- Code artifacts: On disk
- Completeness: 4 -- Core finding present
- Precision: 4 -- Notes spec compliance correctly; missing set() method observation is reasonable
- Actionability: 4 -- Two-pass alternative provided
- Structure: 4 -- Good scope discipline
- Efficiency: 4 -- Reasonable
- Depth: 4 -- Good ECMAScript spec reference
- **Composite: 4.00**

### Condition G
- must_mention coverage: 1/1 -- Map deletion during iteration (MEDIUM)
- must_not violations: Mentions missing public visibility modifier (LOW) -- borderline
- Code artifacts: On disk
- Completeness: 4 -- Core finding present
- Precision: 4 -- Correct about spec safety
- Actionability: 4 -- Provides alternative pattern
- Structure: 4 -- Good scope
- Efficiency: 4 -- Reasonable
- Depth: 4 -- Good spec reference, positive observations about Date.now() capture
- **Composite: 4.00**

---

## Summary

| Task | D | E | F | G |
|------|---|---|---|---|
| cr-001 | 4.87 | 4.73 | 4.73 | 4.73 |
| cr-002 | 4.47 | 4.33 | 4.20 | 4.20 |
| cr-003 | 4.33 | 4.87 | 3.73 | 3.73 |
| cr-004 | 4.87 | 4.33 | 4.20 | 4.20 |
| cr-005 | 4.47 | 3.73 | 4.00 | 4.00 |
| **Mean** | **4.60** | **4.40** | **4.17** | **4.17** |
