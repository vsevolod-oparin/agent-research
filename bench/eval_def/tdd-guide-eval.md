# tdd-guide Evaluation (D/E/F)

## Task 1: tdd-001

**Ground Truth Summary:** Must mention: write failing test first (RED), test for dollar sign/currency code/comma separators/euro/"free"->0, edge cases (empty string, null, negative, multiple dots, no digits), minimal implementation (GREEN), refactor step. Structure: explicit Red-Green-Refactor cycle labels, test code before implementation code.

### Condition D
- must_mention coverage: 5/5 -- RED phase with failing tests first, tests for $, USD, commas, euro, "free"->0, edge cases (null, empty, negative, no digits), GREEN minimal implementation, REFACTOR step
- must_not violations: None
- Completeness: 5 -- All required formats tested plus yen, pound, whitespace, embedded text
- Precision: 5 -- All tests and implementation are correct
- Actionability: 5 -- Complete runnable test suite and implementation
- Structure: 5 -- Explicit RED/GREEN/REFACTOR labels, tests before implementation
- Efficiency: 4 -- Some tests are nice-to-have (embedded text, yen) but not required
- Depth: 5 -- Coverage analysis included, edge cases thoroughly explored
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- RED with test.each (failing tests), $, USD, commas, euro, "free"->0, edge cases (null, empty, whitespace), GREEN implementation, REFACTOR noted (implicit in clean code)
- must_not violations: None
- Completeness: 4 -- Covers core cases but missing explicit negative price test; "multiple dots" not tested
- Precision: 5 -- All tests and implementation correct
- Actionability: 5 -- Complete runnable code
- Structure: 4 -- Test code before implementation but RED/GREEN/REFACTOR labels not explicit in structure; presented more as test suite then implementation
- Efficiency: 5 -- Very compact test.each format; no filler
- Depth: 3 -- Less detailed edge case coverage; no coverage analysis; no explicit RED/GREEN labeling
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/5 -- RED/GREEN/REFACTOR mentioned in summary, tests for $, USD, commas, euro, "free"->0, edge cases (null, empty). Missing: negative prices not tested, multiple dots not tested. Refactor step mentioned.
- must_not violations: None
- Completeness: 3 -- Core formats covered but edge cases less thorough (no negative, no multiple dots)
- Precision: 5 -- Claims are accurate; returns NaN instead of throwing for invalid input (design choice)
- Actionability: 4 -- Code provided but test suite less runnable (described rather than shown for some)
- Structure: 4 -- RED/GREEN/REFACTOR cycle described in text but test code and implementation shown separately; less explicit cycle labeling in the code itself
- Efficiency: 4 -- Summary-style descriptions add overhead
- Depth: 3 -- TDD observations are generic; less specific edge case analysis
- **Composite: 3.87**

---

## Task 2: tdd-002

**Ground Truth Summary:** Must mention: test first (basic allow, basic deny after limit), edge cases (multiple clients, window reset, concurrent calls), time mocking/injection, coverage check. Must not: implement before writing tests, skip refactor phase.

### Condition D
- must_mention coverage: 5/5 -- test first (allow under limit, deny over limit), multiple clients, window reset, concurrent clients (100 clients), jest.useFakeTimers, coverage check, refactor phase mentioned
- must_not violations: None -- tests clearly before implementation
- Completeness: 5 -- All items plus sliding window test, edge cases (null clientId, constructor validation, special chars)
- Precision: 5 -- All tests and implementation correct
- Actionability: 5 -- Complete runnable test suite and implementation
- Structure: 5 -- Explicit RED/GREEN/REFACTOR labels
- Efficiency: 4 -- Slightly verbose with edge cases that go beyond requirements
- Depth: 5 -- Sliding window behavior, performance test with 10K clients
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/5 -- test first (allow, deny), multiple clients, window reset, jest.useFakeTimers. Coverage check not explicitly mentioned. Refactor phase absent (no step 3).
- must_not violations: Minor -- refactor phase appears to be skipped
- Completeness: 4 -- Core tests present but fewer edge cases; no constructor validation tests shown
- Precision: 5 -- All tests correct
- Actionability: 5 -- Runnable code
- Structure: 3 -- No explicit RED/GREEN/REFACTOR labels; just test suite then implementation
- Efficiency: 5 -- Very compact
- Depth: 3 -- Basic tests only; no sliding window, no performance, no concurrent simulation
- **Composite: 3.87**

### Condition F
- must_mention coverage: 4/5 -- tests first, basic allow/deny, multiple clients (independent keys), window reset, jest.useFakeTimers. Coverage check mentioned (100%). Missing explicit concurrent calls test.
- must_not violations: None -- RED/GREEN/REFACTOR described
- Completeness: 4 -- Core tests present; sliding window, partial expiry, exact boundary mentioned. Less edge case depth.
- Precision: 5 -- All claims accurate
- Actionability: 4 -- Test descriptions rather than always full code shown
- Structure: 4 -- TDD cycle described but structure is more narrative
- Efficiency: 4 -- Descriptive prose adds overhead vs. showing code
- Depth: 4 -- Sliding window observation is good; fake timers justification
- **Composite: 4.13**

---

## Task 3: tdd-003

**Ground Truth Summary:** Must mention: write failing test that proves bug (register same email twice), test asserts second registration fails/throws, minimal fix, additional tests (case insensitivity, whitespace). Structure: bug-reproducing test first, then fix, then edge case tests.

### Condition D
- must_mention coverage: 5/5 -- bug-reproducing test (register same email twice, assert rejection), minimal fix (check findByEmail before insert), case insensitivity test, whitespace test
- must_not violations: None
- Completeness: 5 -- All items plus concurrent registration race condition test, SQL injection edge case
- Precision: 5 -- All tests and implementation correct
- Actionability: 5 -- Complete runnable code with mock DB
- Structure: 5 -- Bug test first (RED), then fix (GREEN), then edge cases
- Efficiency: 4 -- Slightly verbose with concurrent/SQL tests
- Depth: 5 -- Race condition handling with promise chain serialization is excellent
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- bug-reproducing test (exact match and case mismatch), assertion of rejection, minimal fix (lowercase + trim + check), case insensitivity, whitespace
- must_not violations: None
- Completeness: 5 -- All required items covered
- Precision: 5 -- All claims accurate
- Actionability: 5 -- Runnable code
- Structure: 4 -- Bug tests shown first then fix, but no explicit RED/GREEN labels
- Efficiency: 5 -- Very compact; minimal code, maximum coverage
- Depth: 3 -- Minimal fix shown; no concurrent handling or deeper edge cases
- **Composite: 4.33**

### Condition F
- must_mention coverage: 5/5 -- bug-reproducing tests first (exact match, case mismatch), assertion of failure, fix with lowercase normalization, case insensitivity and whitespace tests
- must_not violations: None
- Completeness: 4 -- Core items covered but fewer edge cases (no concurrent, no SQL injection)
- Precision: 5 -- All claims accurate
- Actionability: 4 -- Code shown but some is pseudocode-like (validate format elided)
- Structure: 4 -- Tests before fix but less explicit cycle labeling
- Efficiency: 4 -- Narrative adds some overhead
- Depth: 4 -- Good observation about TDD preventing over-engineering; case normalization dual-layer
- **Composite: 4.20**

---

## Task 4: tdd-004

**Ground Truth Summary:** Must mention: characterization tests FIRST (capture current behavior), test premium+SAVE10=0.3, vip+SAVE10=0.4, vip+HALF=0.5 (cap), regular+none=0, edge cases (negative price, unknown userType, unknown coupon), bug discovery (HALF overwrites premium/vip discount -- intended?), refactor only after tests green. Must not: refactor before characterization tests exist.

### Condition D
- must_mention coverage: 5/5 -- characterization tests FIRST (20 tests against original), premium+SAVE10=70 (0.3 discount), vip+SAVE10=60 (0.4 discount), vip+HALF=50 (cap), regular+none=100, edge cases (null, zero, negative, floating point, unknown coupon), HALF override behavior documented ("HALF overwrites"), refactor after tests green
- must_not violations: None -- characterization tests run against original first
- Completeness: 5 -- All required combinations plus floating point, large price
- Precision: 5 -- All test expectations match original function behavior
- Actionability: 5 -- Complete test suite and refactored implementation
- Structure: 5 -- Characterization tests first, then refactor with lookup tables
- Efficiency: 4 -- Comprehensive but some tests are nice-to-have
- Depth: 5 -- Override vs additive coupon distinction, config-driven extensibility
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- characterization tests first (9 combinations via test.each), premium+SAVE10=70, vip+SAVE10=60, vip+HALF=50, regular+none=100, edge cases (zero price, cap verification), HALF override behavior (stacks: false), refactor after tests
- must_not violations: None
- Completeness: 4 -- Core combinations covered but fewer edge cases (no negative price, no null handling tests)
- Precision: 5 -- All test expectations correct
- Actionability: 5 -- Complete runnable code
- Structure: 4 -- Characterization tests first then refactor but less explicit labeling
- Efficiency: 5 -- Very compact test.each format
- Depth: 4 -- stacks property is a good design choice; less depth on edge cases
- **Composite: 4.40**

### Condition F
- must_mention coverage: 4/5 -- characterization tests first (18 tests), user type tests, coupon tests, combined tests. However, the test expectations appear different from original code behavior (employee/vip/premium with different percentages than original; sequential application rather than additive). Missing: explicit bug discovery about HALF overwrite behavior.
- must_not violations: None -- tests before refactor
- Completeness: 3 -- Tests appear to describe a DIFFERENT function than the one provided (employee type, sequential discount application, vip at 25%). Does not match the ground truth function's behavior
- Precision: 2 -- The characterization tests appear to capture behavior of a different implementation than the one given in the task. premium=20%, vip=25%, employee=30% do not match the original code's premium=20%, vip=30%. Sequential vs additive application is wrong.
- Actionability: 4 -- Code is runnable but characterizes wrong behavior
- Structure: 4 -- TDD cycle described
- Efficiency: 3 -- Space spent on wrong characterization
- Depth: 4 -- TDD observation about sequential vs additive is interesting but incorrect for this task
- **Composite: 3.13**

---

## Task 5: tdd-005

**Ground Truth Summary:** Must mention: basic case (10 items, page 1, size 5), last page (hasNext false), first page (hasPrev false), edge cases (page 0, page beyond range, pageSize 0, empty array, pageSize > total), coverage target (80%+). Structure: tests organized by scenario, each test has arrange-act-assert.

### Condition D
- must_mention coverage: 5/5 -- basic case (10 items, page 1, size 3), last page (hasNext false), first page (hasPrev false), edge cases (page 0, beyond range, pageSize 0, empty array, pageSize > total), coverage analysis (100%)
- must_not violations: None
- Completeness: 5 -- All items plus immutability test, large dataset performance, generic type support
- Precision: 5 -- All test expectations correct
- Actionability: 5 -- Complete test suite and implementation
- Structure: 5 -- Organized by scenario (basic, edge, error, performance), arrange-act-assert pattern
- Efficiency: 4 -- Slightly verbose with special character tests
- Depth: 5 -- Non-integer validation, immutability check, performance test
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases (page 0, beyond range, pageSize 0, empty array, pageSize > total), coverage mentioned (100%)
- must_not violations: None
- Completeness: 4 -- Core tests present but less edge case depth (no non-integer, no immutability)
- Precision: 5 -- All tests correct
- Actionability: 5 -- Complete runnable code
- Structure: 4 -- Tests organized but less grouped by scenario
- Efficiency: 5 -- Compact
- Depth: 3 -- Functional but lacks the extra edge cases and analysis
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/5 -- basic case, last page, first page, edge cases (page 0 -- clamps instead of throws, beyond range, empty array, pageSize > total implied). Coverage mentioned (100%). pageSize 0 -- "defaults to sensible size" rather than throwing (design choice, but different from typical expectation)
- must_not violations: None
- Completeness: 4 -- Core tests present; clamping behavior for page 0 is a different design choice
- Precision: 4 -- Clamping page 0 to 1 rather than rejecting is a valid choice but diverges from typical pagination contract
- Actionability: 4 -- Implementation described but return type differs from spec (items vs data, currentPage/pageSize extra fields)
- Structure: 4 -- Tests organized by category, TDD observations section
- Efficiency: 4 -- Descriptive prose format less efficient than code
- Depth: 4 -- Immutability test mentioned, performance test noted
- **Composite: 4.00**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| tdd-001 | 4.87 | 4.20 | 3.87 |
| tdd-002 | 4.87 | 3.87 | 4.13 |
| tdd-003 | 4.87 | 4.33 | 4.20 |
| tdd-004 | 4.87 | 4.40 | 3.13 |
| tdd-005 | 4.87 | 4.20 | 4.00 |
| **Mean** | **4.87** | **4.20** | **3.87** |
| E LIFT (vs D) | -- | -0.67 | -- |
| F LIFT (vs D) | -- | -- | -1.00 |
| F vs E | -- | -- | -0.33 |
