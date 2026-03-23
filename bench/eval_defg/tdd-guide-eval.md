# tdd-guide Evaluation (D/E/F/G)

## Task 1: tdd-001

**Ground Truth Summary:** Implement parsePrice with TDD. Must mention: write failing test first (RED), test for dollar sign/currency code/comma separators/euro/"free"->0, edge cases (empty string, null, negative, multiple dots, no digits), minimal implementation (GREEN), refactor step. Structure: explicit Red-Green-Refactor cycle labels, test code before implementation.

### Condition D
- must_mention coverage: 5/5 -- RED phase with failing tests, tests for $/USD/comma/euro/free, edge cases (empty, null, negative, no digits), GREEN minimal impl, REFACTOR step
- must_not violations: None
- Code artifacts: None (markdown only -- tests and implementation in markdown)
- Completeness: 5 -- All required elements, 17 tests covering all specified cases
- Precision: 5 -- Correct implementation and tests
- Actionability: 4 -- Code in markdown only, not on disk; would need to copy-paste
- Structure: 5 -- Explicit RED-GREEN-REFACTOR labels, tests before implementation
- Efficiency: 5 -- Focused, no wasted content
- Depth: 5 -- Unicode currency, embedded text extraction, whitespace handling, NaN guard
- **Composite: 4.80**

### Condition E
- must_mention coverage: 5/5 -- RED tests (26 tests), $/USD/comma/euro/free, edge cases, GREEN impl, REFACTOR
- must_not violations: None
- Code artifacts: JS + Jest tests on disk (103 tests passing), files in src/
- Completeness: 5 -- All required elements, comprehensive test.each patterns
- Precision: 5 -- Correct, tests pass
- Actionability: 5 -- Runnable code on disk with passing tests
- Structure: 4 -- Tests before implementation in report; test.each grouping is clean
- Efficiency: 4 -- Report is a summary, less explicit cycle labeling than D
- Depth: 4 -- Good coverage but report text is more summarized
- **Composite: 4.60**

### Condition F
- must_mention coverage: 5/5 -- RED phase, tests for all required formats, edge cases (null/undefined return NaN, empty string, negative), GREEN, REFACTOR
- must_not violations: None
- Code artifacts: TS + Jest tests on disk (74 tests passing), files in src/
- Completeness: 5 -- All required elements; 20 tests
- Precision: 4 -- Returns NaN for null/undefined instead of throwing -- a design choice, but ground truth says "edge cases: null" without specifying throw vs NaN. Acceptable.
- Actionability: 5 -- Runnable TypeScript code on disk
- Structure: 4 -- Report describes TDD cycle but is more narrative than step-by-step
- Efficiency: 4 -- Report is descriptive rather than showing code
- Depth: 4 -- Mentions TDD observations about writing tests first
- **Composite: 4.40**

### Condition G
- must_mention coverage: 5/5 -- RED phase with tests first, tests for $/USD/comma/euro/free, edge cases (empty/null/negative/garbage), GREEN impl, REFACTOR (implicit in final form)
- must_not violations: None
- Code artifacts: JS + Jest tests on disk in tmp/ (68 tests passing)
- Completeness: 5 -- All required elements, 22 tests
- Precision: 5 -- Correct implementation, returns NaN for invalid inputs
- Actionability: 5 -- Runnable code on disk with passing tests
- Structure: 4 -- Tests First (RED) and Implementation (GREEN) labels present; REFACTOR not explicit
- Efficiency: 5 -- Clean report with code shown
- Depth: 4 -- Good coverage, sliding window pattern for negative prices
- **Composite: 4.73**

---

## Task 2: tdd-002

**Ground Truth Summary:** Implement rate limiter with TDD. Must mention: test first (basic allow, basic deny after limit), edge cases (multiple clients, window reset, concurrent calls), time mocking/injection. Must not: implement before writing tests, skip refactor phase.

### Condition D
- must_mention coverage: 4/4 -- test first (allow/deny), multiple clients, window reset via jest.useFakeTimers(), concurrent simulation
- must_not violations: None -- tests written before implementation, refactor step included
- Code artifacts: None (markdown only)
- Completeness: 5 -- 14 tests with sliding window, constructor validation, concurrent clients
- Precision: 5 -- Correct implementation with sliding window
- Actionability: 4 -- Code in markdown only
- Structure: 5 -- Explicit RED-GREEN-REFACTOR
- Efficiency: 5 -- Focused
- Depth: 5 -- Sliding window partial expiry test, performance test with 10K clients
- **Composite: 4.80**

### Condition E
- must_mention coverage: 4/4 -- test first, multiple clients, window reset, fake timers
- must_not violations: None
- Code artifacts: JS + Jest on disk
- Completeness: 4 -- 15 tests (report says 5, but on disk likely more); report shows fewer tests
- Precision: 5 -- Correct
- Actionability: 5 -- Runnable on disk
- Structure: 4 -- Tests before implementation; less explicit cycle labels
- Efficiency: 4 -- Report is summarized
- Depth: 4 -- Good coverage including constructor validation
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/4 -- test first, multiple clients, window reset with fake timers, sliding window
- must_not violations: None
- Code artifacts: TS + Jest on disk
- Completeness: 5 -- 10 tests covering core requirements
- Precision: 5 -- Correct sliding window implementation
- Actionability: 5 -- Runnable TypeScript on disk
- Structure: 4 -- Report describes TDD cycle narratively
- Efficiency: 4 -- Narrative style
- Depth: 4 -- Good, mentions fake timers as essential, sliding window emergence
- **Composite: 4.47**

### Condition G
- must_mention coverage: 4/4 -- tests first, multiple clients, window reset, fake timers, sliding window partial expiration
- must_not violations: None
- Code artifacts: JS + Jest on disk in tmp/
- Completeness: 5 -- 9 tests covering all required scenarios
- Precision: 5 -- Correct implementation with efficient shift-based cleanup
- Actionability: 5 -- Runnable on disk
- Structure: 4 -- RED/GREEN labels, REFACTOR implicit
- Efficiency: 5 -- Clean code and tests
- Depth: 4 -- Sliding window with partial expiration test
- **Composite: 4.73**

---

## Task 3: tdd-003

**Ground Truth Summary:** Fix duplicate email bug using TDD. Must mention: failing test that proves the bug, assert second registration fails/throws, minimal fix, additional tests for case insensitivity and whitespace. Structure: bug-reproducing test first, then fix, then edge case tests.

### Condition D
- must_mention coverage: 4/4 -- bug-reproducing test (duplicate email), assertion on failure, minimal fix, case insensitivity + whitespace tests
- must_not violations: None
- Code artifacts: None (markdown only)
- Completeness: 5 -- 11 tests including concurrent registration race condition test
- Precision: 5 -- Correct fix with dual-layer defense (app check + repo uniqueness)
- Actionability: 4 -- Code in markdown only
- Structure: 5 -- Bug-reproducing test explicitly labeled, comes first
- Efficiency: 5 -- Focused
- Depth: 5 -- Concurrent race condition test with Promise.allSettled, SQL injection edge case
- **Composite: 4.80**

### Condition E
- must_mention coverage: 4/4 -- bug-reproducing test, rejection assertion, fix, case insensitivity + whitespace
- must_not violations: None
- Code artifacts: JS + Jest on disk
- Completeness: 4 -- Report shows 3 tests (exact, case, whitespace); likely more on disk
- Precision: 5 -- Correct fix
- Actionability: 5 -- Runnable on disk
- Structure: 4 -- Bug test first in report
- Efficiency: 4 -- Report is summarized
- Depth: 3 -- Less edge case coverage shown in report than D
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- bug-reproducing test, rejection assertion, fix with normalization, case insensitivity
- must_not violations: None
- Code artifacts: TS + Jest on disk
- Completeness: 5 -- 10 tests including validation edge cases
- Precision: 5 -- Correct
- Actionability: 5 -- Runnable TypeScript on disk
- Structure: 4 -- Report describes TDD flow; bug test mentioned first
- Efficiency: 4 -- Narrative format
- Depth: 4 -- Password validation, empty email, stored email normalization
- **Composite: 4.47**

### Condition G
- must_mention coverage: 4/4 -- bug-reproducing test (duplicate email), assertion on failure, fix with normalization, case insensitivity + whitespace
- must_not violations: None
- Code artifacts: JS + Jest on disk in tmp/
- Completeness: 5 -- 8 tests covering bug reproduction, case insensitivity, whitespace, validation
- Precision: 5 -- Correct fix with email normalization
- Actionability: 5 -- Runnable on disk
- Structure: 4 -- Tests First (RED) label, bug test first
- Efficiency: 5 -- Clean and focused
- Depth: 4 -- Good coverage of normalization edge cases
- **Composite: 4.73**

---

## Task 4: tdd-004

**Ground Truth Summary:** Refactor calculateDiscount using TDD safety net. Must mention: characterization tests FIRST, test specific combinations (premium+SAVE10=0.3, vip+SAVE10=0.4, vip+HALF=0.5 cap), edge cases (negative price, unknown userType, unknown coupon), bug discovery (HALF overwrites premium/vip discount -- is this intended?), refactor only after tests green. Must not: refactor before characterization tests.

### Condition D
- must_mention coverage: 5/5 -- characterization tests first, all specified combinations tested, edge cases (negative, unknown, zero), HALF override behavior noted, refactor after green
- must_not violations: None -- tests written and verified green before refactor
- Code artifacts: None (markdown only)
- Completeness: 5 -- 20 characterization tests, all required combinations, refactored to lookup tables
- Precision: 5 -- Correct characterization and refactored code; HALF override behavior documented
- Actionability: 4 -- Code in markdown only
- Structure: 5 -- Explicit characterization-first approach, then refactor
- Efficiency: 5 -- Focused
- Depth: 5 -- Documents HALF override vs additive distinction, coupon type metadata, extensibility
- **Composite: 4.80**

### Condition E
- must_mention coverage: 5/5 -- characterization tests, all combinations (9 parameterized), edge cases, HALF override noted, refactor after green
- must_not violations: None
- Code artifacts: JS + Jest on disk; calculateDiscount.js and test file with 27+ tests
- Completeness: 5 -- Comprehensive parameterized tests covering all combinations
- Precision: 5 -- Correct; stacks property clarifies behavior
- Actionability: 5 -- Runnable on disk with passing tests
- Structure: 5 -- Clear characterization-first approach
- Efficiency: 5 -- Well organized with test.each
- Depth: 5 -- Notes HALF override behavior explicitly, lookup table refactor
- **Composite: 5.00**

### Condition F
- must_mention coverage: 5/5 -- characterization tests, all combinations, edge cases (negative, NaN, unknown), HALF override behavior, refactor after tests
- must_not violations: None
- Code artifacts: TS + Jest on disk; calculateDiscount.ts and test with 18 tests
- Completeness: 5 -- All required combinations tested
- Precision: 4 -- The implementation applies discounts sequentially (not additively as original code does), which changes behavior. Report claims tests caught this difference. This is a potential precision issue if the characterization tests don't match original behavior exactly.
- Actionability: 5 -- Runnable TypeScript on disk
- Structure: 4 -- Report describes the TDD process narratively
- Efficiency: 4 -- Narrative format
- Depth: 4 -- Notes additive vs sequential discount difference, which is a genuine insight
- **Composite: 4.40**

### Condition G
- must_mention coverage: 5/5 -- characterization tests first, all specified combinations, edge cases (zero, decimal, large, undefined), HALF override behavior noted, refactor after green
- must_not violations: None
- Code artifacts: JS + Jest on disk in tmp/; 16 tests passing
- Completeness: 5 -- 16 characterization tests covering all combinations
- Precision: 5 -- Correct characterization matching original behavior
- Actionability: 5 -- Runnable on disk with passing tests
- Structure: 4 -- Characterization Tests First (RED) label; clear flow
- Efficiency: 5 -- Clean and focused
- Depth: 4 -- Coupon type metadata (add vs set), lookup table refactor
- **Composite: 4.73**

---

## Task 5: tdd-005

**Ground Truth Summary:** Write tests for pagination utility. Must mention: test basic case (10 items, page 1, size 5), test last page (hasNext false), test first page (hasPrev false), edge cases (page 0, beyond range, pageSize 0, empty array, pageSize > total), coverage target (80%+). Structure: tests organized by scenario, each test has clear arrange-act-assert.

### Condition D
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases (page 0, beyond range, pageSize 0, empty array, pageSize > total), coverage target mentioned (100%)
- must_not violations: None
- Code artifacts: None (markdown only)
- Completeness: 5 -- 23 tests covering all required scenarios plus generics, immutability, performance
- Precision: 5 -- Correct implementation and tests
- Actionability: 4 -- Code in markdown only
- Structure: 5 -- Organized by scenario (happy path, edge cases, error cases), clear AAA pattern
- Efficiency: 5 -- Focused
- Depth: 5 -- Immutability test, generic type support, large dataset test, special characters
- **Composite: 4.80**

### Condition E
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases, coverage target (100%)
- must_not violations: None
- Code artifacts: JS + Jest on disk
- Completeness: 5 -- 22 tests (report), comprehensive
- Precision: 5 -- Correct
- Actionability: 5 -- Runnable on disk
- Structure: 4 -- Tests organized by scenario; report is summarized
- Efficiency: 4 -- Report is compact
- Depth: 4 -- Good coverage including performance test
- **Composite: 4.60**

### Condition F
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases (page 0 clamps, beyond range, empty array, pageSize > total), coverage mentioned
- must_not violations: None
- Code artifacts: TS + Jest on disk
- Completeness: 5 -- 16 tests
- Precision: 4 -- Page 0 clamps to page 1 instead of throwing (design choice; ground truth says "edge cases: page 0" without specifying behavior)
- Actionability: 5 -- Runnable TypeScript on disk
- Structure: 4 -- Report is narrative; PaginationResult interface is well-defined
- Efficiency: 4 -- Narrative format
- Depth: 4 -- Immutability test, performance test, generic types
- **Composite: 4.40**

### Condition G
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases (page 0 defaults to 1, beyond range, pageSize 0 throws, empty array, pageSize > total), coverage (100%)
- must_not violations: None
- Code artifacts: JS + Jest on disk in tmp/; 13 tests passing
- Completeness: 5 -- 13 tests covering all required scenarios
- Precision: 5 -- Correct; page 0 defaults to 1 (reasonable design), pageSize 0 throws
- Actionability: 5 -- Runnable on disk
- Structure: 4 -- Organized by basic/boundaries/edge cases
- Efficiency: 5 -- Clean and focused
- Depth: 4 -- Object items, large dataset, exact boundaries
- **Composite: 4.73**

---

## Summary

| Task | D | E | F | G |
|------|---|---|---|---|
| tdd-001 | 4.80 | 4.60 | 4.40 | 4.73 |
| tdd-002 | 4.80 | 4.47 | 4.47 | 4.73 |
| tdd-003 | 4.80 | 4.20 | 4.47 | 4.73 |
| tdd-004 | 4.80 | 5.00 | 4.40 | 4.73 |
| tdd-005 | 4.80 | 4.60 | 4.40 | 4.73 |
| **Mean** | **4.80** | **4.57** | **4.43** | **4.73** |
