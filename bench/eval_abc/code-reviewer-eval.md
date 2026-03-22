# code-reviewer Evaluation (A/B/C)

## Task 1: cr-001

**Ground Truth Summary:** Must mention: SQL injection via string concatenation, hardcoded JWT secret, no input validation. Must not: style-only complaints without security context. Structure: severity labels (CRITICAL/HIGH), file:line references, fix suggestions.

### Condition A (bare)
- must_mention coverage: 3/3 -- SQL injection (hit), hardcoded JWT secret (hit), no input validation (hit)
- must_not violations: None. Additional findings (no auth, no error handling, token on creation) all have security context.
- Completeness: 5 -- All three must-mentions hit, plus three additional valid findings.
- Precision: 5 -- Every claim is accurate and verifiable against the code.
- Actionability: 5 -- Parameterized query code shown, env var suggestion for JWT, validation library recommended.
- Structure: 5 -- Clean severity table, fix code blocks, verdict with reasoning.
- Efficiency: 5 -- Dense findings table, no filler.
- Depth: 4 -- Good but does not trace exploitation beyond basics (e.g., no mention of role escalation via role field specifically).
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 3/3 -- SQL injection (hit), hardcoded JWT secret (hit), no input validation (hit)
- must_not violations: None.
- Completeness: 5 -- Same three must-mentions plus additional valid findings (no auth, no error handling, token on creation).
- Precision: 5 -- All claims accurate.
- Actionability: 5 -- Full fix code with auth middleware, validation, parameterized queries, error handling.
- Structure: 5 -- Severity table, code blocks, verdict.
- Efficiency: 5 -- Tight, no filler.
- Depth: 4 -- Mentions ER_DUP_ENTRY handling in fix, role allowlist -- slightly more practical depth.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 3/3 -- SQL injection (hit), hardcoded JWT secret (hit), no input validation (hit)
- must_not violations: None.
- Completeness: 5 -- Three must-mentions plus auth, error handling, token on creation.
- Precision: 5 -- All claims accurate.
- Actionability: 5 -- Full fix code with validation schema, role allowlist, error handling, parameterized queries.
- Structure: 5 -- Echoes the code inline, severity table, fix suggestions, verdict.
- Efficiency: 4 -- Echoing the original code at the top is slight padding, but findings are dense.
- Depth: 4 -- Notes pre-Express 5 unhandled rejection behavior -- good detail.
- **Composite: 4.80**

---

## Task 2: cr-002

**Ground Truth Summary:** Must mention: useEffect missing dependency array (infinite loop), missing key prop in list rendering, setUsers called but users from props (state mismatch). Must not: false complaints about missing error handling if context doesn't require it. Structure: severity per finding, approval recommendation.

### Condition A (bare)
- must_mention coverage: 3/3 -- infinite loop (hit), missing key (hit), setUsers/props mismatch (hit as "Undefined setUsers")
- must_not violations: Finding #4 (No Error Handling on Fetch) and #6 (Missing Loading/Error UI) could be borderline, but the component genuinely has a fetch call, so noting error handling is reasonable. No clear violation.
- Completeness: 5 -- All must-mentions plus additional valid findings.
- Precision: 5 -- All claims accurate; correctly identifies setUsers is undefined.
- Actionability: 5 -- Full rewrite with fix for all issues.
- Structure: 5 -- Severity table, code fix, verdict.
- Efficiency: 4 -- Some overlap between findings #4 and #6.
- Depth: 4 -- Good identification of the prop/state ownership confusion.
- **Composite: 4.73**

### Condition B (v1 agents)
- must_mention coverage: 3/3 -- infinite loop (hit), missing key (hit), setUsers/props mismatch (hit)
- must_not violations: Same borderline error handling notes, but reasonable given the code.
- Completeness: 5 -- All must-mentions plus loading state, null reference, response status.
- Precision: 5 -- All claims accurate.
- Actionability: 5 -- Comprehensive fix with cancellation cleanup pattern.
- Structure: 5 -- Clean table, code fix, verdict.
- Efficiency: 4 -- Slight overlap between loading state and error handling findings.
- Depth: 5 -- Mentions cleanup flag for unmounted components, r.ok check -- deeper practical knowledge.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 3/3 -- infinite loop (hit), missing key (hit), setUsers/props mismatch (hit)
- must_not violations: None significant.
- Completeness: 5 -- All must-mentions plus response status check, null reference.
- Precision: 5 -- All claims accurate.
- Actionability: 5 -- Full fix with cancellation and cleanup.
- Structure: 5 -- Code echoed, table, fix, verdict.
- Efficiency: 4 -- Code echo at top adds length.
- Depth: 4 -- Similar depth to B, cleanup pattern included.
- **Composite: 4.80**

---

## Task 3: cr-003

**Ground Truth Summary:** Must mention: race condition (no transaction/lock on balance check + update), no audit trail for financial operation. Must not: "missing type hints" (LOW), "missing docstring" (LOW). Structure: CRITICAL for race condition, HIGH for missing audit.

### Condition A (bare)
- must_mention coverage: 2/2 -- race condition (hit, CRITICAL), no audit trail (hit, HIGH)
- must_not violations: None -- no type hint or docstring complaints.
- Completeness: 5 -- Both must-mentions hit. Additional valid findings: no transaction boundary, no input validation, no auth, silent failure.
- Precision: 5 -- All claims accurate. Race condition correctly described.
- Actionability: 5 -- Full atomic UPDATE fix with transaction, audit log, async email.
- Structure: 5 -- Correct severity: CRITICAL for race condition, HIGH for audit. Clean table.
- Efficiency: 5 -- Every finding is meaningful.
- Depth: 5 -- Explains TOCTOU pattern, atomic UPDATE alternative, email-outside-transaction pattern.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 2/2 -- race condition (hit, CRITICAL), no audit trail (hit, HIGH)
- must_not violations: None.
- Completeness: 5 -- Both must-mentions plus transaction boundaries, input validation, auth context, email failure.
- Precision: 5 -- All claims accurate. Floating-point risk is a valid addition.
- Actionability: 5 -- Full fix with Decimal type, SELECT FOR UPDATE, refund record, email queue.
- Structure: 5 -- Correct severities. Clean table.
- Efficiency: 5 -- Dense, every finding adds value.
- Depth: 5 -- Mentions Decimal type, RefundResult pattern, email queue -- production-ready depth.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 2/2 -- race condition (hit, CRITICAL), no audit trail (hit, HIGH)
- must_not violations: None.
- Completeness: 5 -- Both must-mentions plus validation, atomicity, boolean return, floating-point.
- Precision: 5 -- All claims accurate. TOCTOU explicitly named.
- Actionability: 5 -- Full fix with Decimal, RefundResult, transaction, logging, email queue.
- Structure: 5 -- Correct severities.
- Efficiency: 4 -- Code echo adds length.
- Depth: 5 -- TOCTOU named, Decimal type, email queue, structured logging.
- **Composite: 4.93**

---

## Task 4: cr-004

**Ground Truth Summary:** Must mention: no authentication/authorization check on delete endpoint, returns 200 even on error, no method check (accepts GET for destructive operation). Must not: "SQL injection" (query IS parameterized -- false positive trap). Structure: CRITICAL for missing auth, HIGH for error handling.

### Condition A (bare)
- must_mention coverage: 3/3 -- no auth (hit, CRITICAL), returns 200 on error (hit, HIGH), no method check (hit, HIGH)
- must_not violations: None -- explicitly notes "parameterized query prevents SQL injection" in finding #4. Line 176 explicitly states SQL injection is not an issue.
- Completeness: 5 -- All three must-mentions plus input validation, rows affected, soft delete.
- Precision: 5 -- Correctly avoids the SQL injection trap. All claims verifiable.
- Actionability: 5 -- Full fix with auth, method check, error handling, rows affected check.
- Structure: 5 -- Correct severities. Clean table and fix code.
- Efficiency: 5 -- Dense, no filler.
- Depth: 5 -- Notes linkability/cacheability concern with GET + query params, mentions soft delete policy.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 3/3 -- no auth (hit, CRITICAL), returns 200 on error (hit, HIGH), no method check (hit, HIGH)
- must_not violations: None -- explicitly notes parameterized queries are correct.
- Completeness: 5 -- All must-mentions plus validation, rows affected, soft delete, response body.
- Precision: 5 -- All claims accurate. SQL injection trap avoided.
- Actionability: 5 -- Full fix with method check, auth, validation, rows affected.
- Structure: 5 -- Correct severities.
- Efficiency: 5 -- Dense.
- Depth: 5 -- Good analysis of GET semantics, CSRF via image tags, browser history exposure.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 3/3 -- no auth (hit, 2x CRITICAL -- one for auth, one for GET semantics), returns 200 on error (hit, HIGH), no method check (hit as part of CRITICAL #2 and HIGH #5)
- must_not violations: None -- no SQL injection false positive.
- Completeness: 5 -- All must-mentions plus validation, rows affected, logging context.
- Precision: 5 -- All claims accurate. Elevates GET for destructive action to CRITICAL, which is arguably appropriate.
- Actionability: 5 -- Full fix with auth context, method check, validation, rows affected, proper status codes.
- Structure: 5 -- Clean table, code fix, verdict.
- Efficiency: 4 -- Code echo, slightly more verbose.
- Depth: 5 -- CSRF via image tags, link prefetching, browser history -- strong security reasoning.
- **Composite: 4.93**

---

## Task 5: cr-005

**Ground Truth Summary:** Must mention: deleting from Map during iteration (may cause issues depending on engine). Must not: complaints about unchanged get() method, "missing return type" on cleanup (LOW noise). Structure: only review changed code unless CRITICAL in unchanged code.

### Condition A (bare)
- must_mention coverage: 1/1 -- deleting from Map during iteration (hit, MEDIUM)
- must_not violations: Finding #3 "No Return Type Annotation" is a LOW complaint about cleanup -- this is listed in must_not. However, it's labeled LOW and brief. Minor violation. Finding #4 mentions no automatic cleanup trigger, which touches unchanged code but is LOW and relevant.
- Completeness: 4 -- Must-mention hit. But includes some noise per must_not.
- Precision: 4 -- Correctly notes ES2015 spec allows it but pattern is surprising. Return type comment is noise per ground truth.
- Actionability: 5 -- Provides both two-pass fix and comment alternative.
- Structure: 4 -- Mostly reviews changed code. Minor violations with get() not complained about but return type is.
- Efficiency: 4 -- Some LOW findings could be omitted per must_not.
- Depth: 5 -- Correctly explains ES2015 spec behavior, offers two alternatives.
- **Composite: 4.33**

### Condition B (v1 agents)
- must_mention coverage: 1/1 -- deleting from Map during iteration (hit, HIGH)
- must_not violations: Finding #2 "Missing public visibility / return type" -- return type is mentioned which is in must_not. Finding #3 mentions concurrency which touches broader design. No complaint about get() method.
- Completeness: 4 -- Must-mention hit. Some noise.
- Precision: 4 -- Elevates to HIGH which is debatable (spec says it's safe). Return type noise.
- Actionability: 5 -- Two-pass alternative shown, notes get() interaction.
- Structure: 4 -- Mostly focused on changed code. Note about get() is observation, not complaint.
- Efficiency: 4 -- Finding #3 (concurrency) is speculative for single-threaded JS.
- Depth: 5 -- Explains spec behavior, notes async boundary concern, get() interaction.
- **Composite: 4.33**

### Condition C (v2 agents)
- must_mention coverage: 1/1 -- deleting from Map during iteration (hit, HIGH)
- must_not violations: Finding #2 mentions missing access modifier. Finding #3 mentions missing return type -- in must_not. No complaint about get() method.
- Completeness: 4 -- Must-mention hit. Some noise on return type.
- Precision: 4 -- Return type complaint is noise per must_not.
- Actionability: 5 -- Two-pass fix shown, notes get() already handles expired entries.
- Structure: 4 -- Mostly on changed code. get() commentary is positive (notes it's fine).
- Efficiency: 4 -- Code echo at top, some noise.
- Depth: 5 -- Good explanation of spec behavior, two-pass alternative, notes get() complementary design.
- **Composite: 4.33**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| cr-001 | 4.87 | 4.87 | 4.80 |
| cr-002 | 4.73 | 4.87 | 4.80 |
| cr-003 | 5.00 | 5.00 | 4.93 |
| cr-004 | 5.00 | 5.00 | 4.93 |
| cr-005 | 4.33 | 4.33 | 4.33 |
| **Mean** | **4.79** | **4.81** | **4.76** |
| B LIFT (vs A) | -- | +0.02 | -- |
| C LIFT (vs A) | -- | -- | -0.03 |
| C vs B | -- | -- | -0.05 |
