# tdd-guide Evaluation (A/B/C)

## Task 1: tdd-001

**Ground Truth Summary:** Must mention: write failing test first (RED), test for: dollar sign, currency code, comma separators, euro, "free" -> 0, edge cases: empty string, null, negative, multiple dots, no digits, minimal implementation (GREEN), refactor step. Structure: explicit Red-Green-Refactor cycle labels, test code before implementation code.

### Condition A (bare)
- must_mention coverage: 5/5 -- RED first (hit, explicit label), dollar/currency/comma/euro/free tests (hit), edge cases null/undefined/empty/negative (hit), GREEN implementation (hit), refactor step (not explicitly labeled but coverage report implies cycle complete)
- must_not violations: None.
- Completeness: 4 -- Covers dollar, euro, pound, yen, commas, free, null, undefined, empty, negative, whitespace, large numbers. Missing: "multiple dots" edge case, "no digits" explicitly. Refactor phase not explicitly labeled.
- Precision: 5 -- All tests and implementation are correct.
- Actionability: 5 -- Full test suite and implementation provided, runnable.
- Structure: 4 -- Labels "TDD Step 1 -- RED" and "TDD Step 2 -- GREEN" but no explicit REFACTOR label.
- Efficiency: 5 -- Dense, 19 test cases well-organized.
- Depth: 4 -- Good coverage but missing multiple dots edge case. Refactor phase is implicit.
- **Composite: 4.53**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- RED first (hit, explicit "RED Phase"), dollar/currency/comma/euro/free (hit), edge cases null/undefined/empty/negative (hit), GREEN (hit, explicit "GREEN Phase"), REFACTOR (hit, explicit "REFACTOR Phase" with explanation)
- must_not violations: None.
- Completeness: 5 -- All must-mentions including explicit refactor. Covers dollar, euro, pound, yen, commas, free/FREE, null/undefined/empty, negative, whitespace, non-parseable strings. Edge case table provided.
- Precision: 5 -- Tests and implementation are correct. Throws on invalid input (different design choice from A's NaN approach).
- Actionability: 5 -- Full test suite and implementation, runnable. Coverage table.
- Structure: 5 -- Explicit RED/GREEN/REFACTOR labels. Edge case table. Tests before implementation.
- Efficiency: 5 -- Dense, 20 tests well-organized with categories.
- Depth: 5 -- Explicit refactor explanation (negative price handling required approach change). Edge case summary table.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- RED first (hit, explicit "RED -- Write failing tests first"), dollar/currency/comma/euro/free (hit), edge cases null/undefined/empty/negative (hit), GREEN (hit, "GREEN -- Minimal implementation"), REFACTOR not explicitly labeled but tests came first.
- must_not violations: None.
- Completeness: 5 -- Covers dollar, euro, pound, yen, commas, free/FREE/Free, null/undefined/empty, negative, whitespace, currency codes, large numbers, $0/$0.00.
- Precision: 5 -- Tests and implementation correct.
- Actionability: 5 -- Full test suite and implementation. Coverage stated as 100%.
- Structure: 4 -- RED and GREEN labeled. REFACTOR not explicitly labeled as a phase.
- Efficiency: 5 -- Dense, 23 tests.
- Depth: 4 -- Good coverage but refactor phase not explicitly discussed. No edge case summary table.
- **Composite: 4.73**

---

## Task 2: tdd-002

**Ground Truth Summary:** Must mention: test first (basic allow, basic deny after limit), edge cases (multiple clients, window reset, concurrent calls), time mocking/injection (don't use real time in tests), coverage check step. Must not: implement before writing tests, skip the refactor phase.

### Condition A (bare)
- must_mention coverage: 4/5 -- test first (hit), basic allow/deny (hit), edge cases multiple clients/window reset (hit), time mocking with jest.useFakeTimers (hit). Coverage check: coverage report at top shows 100% but no explicit "coverage check step" in the workflow.
- must_not violations: None -- tests written before implementation.
- Completeness: 4 -- All core tests present. Sliding window tested. No explicit coverage check step described.
- Precision: 5 -- Tests and implementation are correct. Sliding window algorithm is well-implemented.
- Actionability: 5 -- Full test suite and implementation. Uses jest.useFakeTimers correctly.
- Structure: 4 -- RED/GREEN labels. No explicit REFACTOR phase. Design note mentions sliding window.
- Efficiency: 5 -- Dense, 11 tests.
- Depth: 4 -- Good sliding window tests. Constructor validation. But refactor phase is implicit.
- **Composite: 4.47**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- test first (hit, "RED Phase"), basic allow/deny (hit), edge cases multiple clients/window reset/concurrent (hit), time mocking (hit, jest.useFakeTimers), coverage stated (100%).
- must_not violations: None -- tests before implementation, refactor discussed.
- Completeness: 5 -- All must-mentions. Constructor validation, special characters in clientId, 1000 clients.
- Precision: 5 -- Correct. Throws on empty/non-string clientId (stricter validation than A).
- Actionability: 5 -- Full test suite and implementation. Coverage table.
- Structure: 5 -- Explicit RED/GREEN/REFACTOR labels. Edge case table.
- Efficiency: 5 -- Dense, 11 tests well-categorized.
- Depth: 5 -- Explicit refactor discussion. Integer validation for maxRequests. Edge case summary table.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 4/5 -- test first (hit, "RED"), basic allow/deny (hit), edge cases multiple clients/window reset (hit), time mocking (hit). Coverage check: coverage stated as 100% but not as an explicit step.
- must_not violations: None.
- Completeness: 5 -- 12 tests including burst test, limit of 1, many clients.
- Precision: 5 -- Tests and implementation correct.
- Actionability: 5 -- Full test suite and implementation.
- Structure: 4 -- RED/GREEN labels. No explicit REFACTOR label.
- Efficiency: 5 -- Dense, 12 tests.
- Depth: 4 -- Burst test is a good addition. But no explicit refactor phase discussion.
- **Composite: 4.60**

---

## Task 3: tdd-003

**Ground Truth Summary:** Must mention: write a failing test that proves the bug (register same email twice), test should assert second registration fails/throws, minimal fix to make test pass, additional tests: case insensitivity (User@X.com vs user@x.com), whitespace. Structure: bug-reproducing test comes first, then fix, then edge case tests.

### Condition A (bare)
- must_mention coverage: 5/5 -- failing test for duplicate email (hit), assert second registration fails (hit), minimal fix (hit, store.findByEmail), case insensitivity (hit), whitespace (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Plus null/undefined input, empty email, invalid format.
- Precision: 5 -- Bug fix is correct. Case-insensitive and whitespace-trimming comparison.
- Actionability: 5 -- Full test suite and implementation with clear fix annotation.
- Structure: 4 -- Bug test is prominent but all tests are written together, not clearly "bug test first, then fix, then edge cases."
- Efficiency: 5 -- Dense, 11 tests.
- Depth: 4 -- Good fix. Uses result objects rather than throws. No explicit RED/GREEN/REFACTOR labels.
- **Composite: 4.60**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- failing test for duplicate (hit, "THE BUG FIX" annotation), assert throws (hit), minimal fix (hit), case insensitivity (hit), whitespace (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Plus null/undefined, invalid format, special characters, unicode name.
- Precision: 5 -- Bug fix correct. Uses throw rather than result object.
- Actionability: 5 -- Full test suite and implementation. Coverage stated.
- Structure: 5 -- RED/GREEN/REFACTOR labels. Bug test highlighted. Fix annotated with "THE BUG FIX" comment.
- Efficiency: 5 -- Dense, 13 tests.
- Depth: 5 -- Explicit refactor discussion (three changes listed). UserStore encapsulation for testability.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- failing test for duplicate (hit, "throws error when registering duplicate email"), assert throws (hit), minimal fix (hit), case insensitivity (hit), whitespace (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Plus password hashing, null/undefined, missing fields, special characters.
- Precision: 5 -- Bug fix correct. Adds password security (not storing plaintext) -- beyond requirements but valid.
- Actionability: 5 -- Full test suite and implementation. Three layers of protection described.
- Structure: 4 -- RED/GREEN labeled. Bug test is present. Fix annotated. REFACTOR not explicit.
- Efficiency: 5 -- Dense, 14 tests.
- Depth: 5 -- Password hashing addition. createdAt timestamp. safeUser return (omits passwordHash). Three protection layers.
- **Composite: 4.87**

---

## Task 4: tdd-004

**Ground Truth Summary:** Must mention: write characterization tests FIRST (capture current behavior), test: premium+SAVE10=0.3, vip+SAVE10=0.4, vip+HALF=0.5 (cap), regular+none=0, edge: negative price, unknown userType, unknown coupon, bug discovery: HALF overwrites premium/vip discount (is this intended?), refactor only after tests are green. Must not: refactor before characterization tests exist.

### Condition A (bare)
- must_mention coverage: 4/5 -- characterization tests first (hit), specific combinations tested (hit: premium+SAVE10=70, vip+SAVE10=60, vip+HALF=50, regular+none=100), edge cases negative/unknown/unknown coupon (hit), refactor after tests green (hit). Bug discovery about HALF overriding: not explicitly questioned as intentional vs bug.
- must_not violations: None -- characterization tests written first.
- Completeness: 4 -- All combinations tested. Missing explicit "is HALF override intentional?" discussion.
- Precision: 5 -- All test expectations match the original code's behavior.
- Actionability: 5 -- Full test suite with 18 cases, refactored implementation with lookup tables.
- Structure: 4 -- "TDD Step 1 -- RED" labels. Characterization tests present. But HALF override question not raised.
- Efficiency: 5 -- Dense, 18 tests.
- Depth: 4 -- Good refactor with named constants and lookup tables. But doesn't question HALF behavior.
- **Composite: 4.47**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- characterization tests first (hit, explicit "Characterization tests -- lock down existing behavior"), specific combinations (hit), edge cases negative/unknown (hit, throws on negative and invalid userType), HALF override behavior (hit, test name "HALF gives 50% discount (replaces user discount)" and "HALF replaces" in test descriptions), refactor after green (hit).
- must_not violations: None.
- Completeness: 5 -- All must-mentions including HALF override documentation. Input validation added as new behavior with dedicated describe block.
- Precision: 5 -- Characterization tests correctly capture existing behavior. New validation tests added separately.
- Actionability: 5 -- Full test suite (22 tests) and implementation. Coupon type system (additive vs override).
- Structure: 5 -- Explicit RED/GREEN/REFACTOR labels. Characterization vs new validation separated. "What Changed" section.
- Efficiency: 5 -- Dense, 22 tests.
- Depth: 5 -- Explicit documentation of HALF override vs additive behavior. Coupon type system makes it extensible. Three problems listed in original code.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 4/5 -- characterization tests (hit), specific combinations (hit), edge cases negative/unknown (hit, throws), HALF override (hit in test "HALF overrides"), refactor after green (hit). Bug discovery question about HALF: not explicitly raised as "is this intentional?"
- must_not violations: None.
- Completeness: 4 -- Tests capture HALF override behavior but don't question whether it's intentional.
- Precision: 5 -- Tests correctly capture existing behavior.
- Actionability: 5 -- Full test suite (22 tests claimed, 16 shown) and implementation.
- Structure: 4 -- RED/GREEN labeled. REFACTOR not separately labeled. Tests capture behavior.
- Efficiency: 5 -- Dense.
- Depth: 4 -- Good refactor with lookup tables. Mentions "HALF overrides" in test name but doesn't flag it as potentially unintended.
- **Composite: 4.47**

---

## Task 5: tdd-005

**Ground Truth Summary:** Must mention: test basic case (10 items, page 1, size 5), test last page (hasNext false), test first page (hasPrev false), edge cases: page 0, page beyond range, pageSize 0, empty array, pageSize > total, coverage target (80%+). Structure: tests organized by scenario (happy path, edge cases, error cases), each test has clear arrange-act-assert.

### Condition A (bare)
- must_mention coverage: 5/5 -- basic case (hit, 10 items page 1 size 3), last page hasNext false (hit), first page hasPrev false (hit), edge cases page 0/beyond range/pageSize 0/empty/pageSize > total (hit), coverage 100% (hit, exceeds 80%)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Plus large arrays, string/object types, immutability.
- Precision: 5 -- All tests and implementation correct.
- Actionability: 5 -- Full test suite (15 tests) and implementation.
- Structure: 4 -- Tests present but not explicitly organized by "happy path / edge / error" categories.
- Efficiency: 5 -- Dense, 15 tests.
- Depth: 4 -- Good coverage. Clamps invalid page/pageSize rather than throwing (different design choice).
- **Composite: 4.60**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- basic case (hit), last page (hit), first page (hit), edge cases page 0/beyond/pageSize 0/empty/pageSize > total (hit), coverage 100% (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Plus input validation (throws), large dataset, generic types.
- Precision: 5 -- All tests correct. Throws on invalid input (stricter validation).
- Actionability: 5 -- Full test suite (17 tests) and implementation.
- Structure: 5 -- Tests organized with clear categories: basic, empty, single item, beyond range, validation, generic types, large, boundary. Each test has clear AAA pattern.
- Efficiency: 5 -- Dense, 17 tests.
- Depth: 5 -- Input validation tests, non-integer page/pageSize detection. Coverage summary table.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- basic case (hit), last page (hit), first page (hit), edge cases page 0/beyond/pageSize 0/empty/pageSize > total (hit), coverage 100% (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Plus immutability test, non-integer validation, generic types.
- Precision: 5 -- All tests correct.
- Actionability: 5 -- Full test suite (14 tests shown, 22 claimed) and implementation.
- Structure: 4 -- Tests present but not explicitly grouped by happy/edge/error in the listing.
- Efficiency: 5 -- Dense.
- Depth: 4 -- Good. Non-integer validation. But fewer tests shown than claimed.
- **Composite: 4.60**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| tdd-001 | 4.53 | 5.00 | 4.73 |
| tdd-002 | 4.47 | 5.00 | 4.60 |
| tdd-003 | 4.60 | 5.00 | 4.87 |
| tdd-004 | 4.47 | 5.00 | 4.47 |
| tdd-005 | 4.60 | 5.00 | 4.60 |
| **Mean** | **4.53** | **5.00** | **4.65** |
| B LIFT (vs A) | -- | +0.47 | -- |
| C LIFT (vs A) | -- | -- | +0.12 |
| C vs B | -- | -- | -0.35 |
