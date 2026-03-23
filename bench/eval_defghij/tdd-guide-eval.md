# tdd-guide Evaluation (D/E/F/G/H/I/J)

## Task tdd-001: parsePrice
**Ground Truth Summary:** Must mention write failing test first (RED), test for dollar sign/currency code/comma/euro/"free"->0, edge cases (empty string, null, negative, multiple dots, no digits), minimal implementation (GREEN), refactor step. Structure: explicit Red-Green-Refactor labels, test code before implementation.

### Condition D
- must_mention: 5/5 -- RED (17 tests first), dollar/currency/comma/euro/free, edge cases (null, empty, negative, large numbers, whitespace, unicode currencies), GREEN (minimal impl), refactor step
- must_not violations: None
- Code artifacts: No runnable code (markdown only)
- Completeness: 5 -- All required with extensive edge cases
- Precision: 5 -- Tests cover all ground truth items
- Actionability: 5 -- Complete test code and implementation code shown
- Structure: 5 -- Explicit RED-GREEN-REFACTOR labels, tests before implementation
- Efficiency: 4 -- 17 tests is thorough; coverage claim
- Depth: 5 -- Unicode currencies, embedded price in text, negative prices
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- Tests first (26 tests), all formats, edge cases, implementation, coverage claim
- must_not violations: None
- Code artifacts: JS 103 tests total (src/__tests__/parsePrice.test.js exists with well-organized describe blocks)
- Completeness: 5 -- All required; 26 tests in test.each style
- Precision: 5 -- Good test organization by category
- Actionability: 5 -- Both test code and implementation provided; actual runnable tests exist
- Structure: 5 -- Explicit RED-GREEN-REFACTOR in output; tests grouped by category in actual files
- Efficiency: 4 -- Good coverage
- Depth: 5 -- Actual test files show well-organized describe blocks with edge cases
- **Composite: 4.87**

### Condition F
- must_mention: 5/5 -- RED (20 tests), all formats, edge cases (null returns NaN), GREEN, refactor
- must_not violations: None
- Code artifacts: TS 74 tests total (src/parsePrice.test.ts with 20 tests for this task)
- Completeness: 5 -- All required; TypeScript implementation
- Precision: 4 -- Returns NaN for null/undefined instead of throwing -- defensible but different from typical
- Actionability: 5 -- Both test and implementation files
- Structure: 5 -- Explicit cycle labels, TDD observations section
- Efficiency: 4 -- 20 tests, good organization
- Depth: 4 -- Good but less edge cases than D/E (negative prices just return NaN)
- **Composite: 4.60**

### Condition G
- must_mention: 5/5 -- RED (tests first), all formats, edge cases (null returns NaN, negative prices), GREEN, results
- must_not violations: None
- Code artifacts: JS 68 tests total (tmp/parsePrice.test.js with parameterized test.each)
- Completeness: 5 -- All required
- Precision: 5 -- NaN for null/undefined is a valid design choice with tests
- Actionability: 5 -- Actual runnable test files
- Structure: 4 -- RED/GREEN labels present but less explicit refactor step
- Efficiency: 4 -- 22 tests for parsePrice
- Depth: 4 -- Good edge case coverage
- **Composite: 4.53**

### Condition H
- must_mention: 5/5 -- RED (29 tests), all formats, comprehensive edge cases, GREEN, refactor noted
- must_not violations: None
- Code artifacts: JS 105 tests total (tmp/parsePrice.test.js with 29 tests including unicode, whitespace-only)
- Completeness: 5 -- All required with exceptional edge case coverage
- Precision: 5 -- Throws for invalid inputs (stricter contract)
- Actionability: 5 -- Runnable tests, parameterized test.each
- Structure: 5 -- Explicit RED-GREEN-REFACTOR, test type decision section
- Efficiency: 4 -- 29 tests for one function -- very thorough
- Depth: 5 -- Unicode currencies, whitespace-only, multiple dots implied by coverage
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H (identical output)
- must_not violations: None
- Code artifacts: JS 105 tests total (same as H)
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 4/5 -- RED-GREEN shown (but some tests marked "GREEN already passing" -- not all tests failed first), basic formats, limited edge cases (no negative, no multiple dots), implementation
- must_not violations: None
- Code artifacts: JS 35 tests total, 8 for parsePrice
- Completeness: 3 -- Only 8 tests; missing negative prices, multiple dots, unicode currencies, no-digits error case is weak (returns 0 instead of error)
- Precision: 3 -- Implementation is minimal but misses edge cases; empty string returns 0 instead of error/NaN; null throws but only because of .replace on null
- Actionability: 4 -- Test and implementation code provided; files exist
- Structure: 4 -- RED-GREEN cycle described but some tests skipped as "already passing"
- Efficiency: 3 -- Only 8 tests is notably fewer; less comprehensive
- Depth: 2 -- Missing key edge cases; implementation is too simple (no negative handling, no multiple dot handling)
- **Composite: 3.13**

---

## Task tdd-002: Rate Limiter
**Ground Truth Summary:** Must mention test first (basic allow, basic deny), edge cases (multiple clients, window reset, concurrent), time mocking/injection, coverage check step. Must not implement before tests or skip refactor.

### Condition D
- must_mention: 5/5 -- Test first with fake timers, basic allow/deny, multiple clients, window reset, time mocking (jest.useFakeTimers), coverage mention
- must_not violations: None
- Completeness: 5 -- All required with additional edge cases (empty clientId, many clients)
- Precision: 5 -- Correct use of fake timers
- Actionability: 5 -- Full test and implementation code
- Structure: 5 -- RED-GREEN-REFACTOR labels
- Efficiency: 4 -- Thorough
- Depth: 5 -- Sliding window detail, concurrent requests simulation
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- Test first, fake timers, basic allow/deny, clients independent, window reset, coverage
- must_not violations: None
- Code artifacts: Actual test file with 15 tests including validation
- Completeness: 5 -- All required
- Precision: 5 -- Good fake timer usage
- Actionability: 5 -- Runnable tests
- Structure: 5 -- Clear TDD cycle
- Efficiency: 4 -- 15 tests
- Depth: 4 -- Good but standard edge cases
- **Composite: 4.73**

### Condition F
- must_mention: 5/5 -- All required with jest.useFakeTimers
- must_not violations: None
- Code artifacts: TS test file with 10 tests
- Completeness: 5 -- All required including sliding window, partial expiry
- Precision: 5 -- Good test design
- Actionability: 5 -- Both test and implementation
- Structure: 5 -- TDD observations section
- Efficiency: 4 -- 10 well-designed tests
- Depth: 5 -- Sliding window, partial window expiry, rapid-fire test
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- Test first, fake timers, all required scenarios
- must_not violations: None
- Code artifacts: JS test file with 9 tests including sliding window, many clients
- Completeness: 5 -- All required
- Precision: 5 -- Good fake timer usage, validation tests
- Actionability: 5 -- Runnable tests
- Structure: 4 -- RED/GREEN present but less explicit refactor
- Efficiency: 4 -- 9 tests
- Depth: 5 -- Sliding window partial expiration, many clients stress test
- **Composite: 4.73**

### Condition H
- must_mention: 5/5 -- All required with fake timers
- must_not violations: None
- Code artifacts: JS 105 tests total
- Completeness: 5 -- All required with extensive edge cases
- Precision: 5 -- Good test design
- Actionability: 5 -- Runnable tests
- Structure: 5 -- Explicit RED-GREEN-REFACTOR
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- Thorough coverage
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Code artifacts: Same as H
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 4/5 -- Test first, fake timers, basic allow/deny, clients independent, window reset -- but coverage check not mentioned and some tests listed as "already passing"
- must_not violations: None
- Code artifacts: JS 5 tests for rate limiter
- Completeness: 3 -- Only 5 tests; missing concurrent calls, does not test zero max requests (mentioned but test says "already passing")
- Precision: 4 -- Tests are correct but thin
- Actionability: 4 -- Test and implementation provided
- Structure: 4 -- TDD cycles described
- Efficiency: 3 -- Only 5 tests
- Depth: 3 -- Missing concurrent scenario, missing edge cases for validation
- **Composite: 3.47**

---

## Task tdd-003: registerUser Duplicate Email Bug Fix
**Ground Truth Summary:** Must mention write failing test proving bug (register same email twice), test asserts second registration fails, minimal fix, additional tests for case insensitivity and whitespace. Structure: bug-reproducing test first, then fix, then edge cases.

### Condition D
- must_mention: 5/5 -- Bug-reproducing test first (duplicate email), assertion on failure, case insensitivity, whitespace, minimal fix
- must_not violations: None
- Completeness: 5 -- All required with async/await pattern
- Precision: 5 -- Bug reproducing test clearly first
- Actionability: 5 -- Complete test and fix code
- Structure: 5 -- Bug test -> fix -> edge case tests
- Efficiency: 4 -- Focused
- Depth: 5 -- Case sensitivity and whitespace trimming
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- Bug test first, case insensitive, whitespace, fix, edge cases
- must_not violations: None
- Code artifacts: Test file with bug-reproducing tests and edge cases
- Completeness: 5 -- All required
- Precision: 5 -- Correct TDD for bug fix
- Actionability: 5 -- Runnable tests
- Structure: 5 -- Bug test first, then fix
- Efficiency: 4 -- Good
- Depth: 5 -- Multiple case variations, stored email normalization check
- **Composite: 4.87**

### Condition F
- must_mention: 5/5 -- Bug test, case insensitive, fix, edge cases
- must_not violations: None
- Code artifacts: TS test file with 10 tests
- Completeness: 5 -- All required with validation tests (empty email, short password)
- Precision: 5 -- Good TDD for bug fix
- Actionability: 5 -- Both test and implementation
- Structure: 5 -- Bug test first
- Efficiency: 4 -- 10 tests
- Depth: 5 -- Stored email normalization verification, password validation
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- Bug test, case insensitive, fix, edge cases
- must_not violations: None
- Code artifacts: JS test file
- Completeness: 5 -- All required
- Precision: 5 -- Bug test clearly first
- Actionability: 5 -- Runnable
- Structure: 4 -- RED-GREEN present
- Efficiency: 4 -- Good
- Depth: 4 -- Case insensitive and empty email covered
- **Composite: 4.60**

### Condition H
- must_mention: 5/5 -- All required
- must_not violations: None
- Code artifacts: JS tests
- Completeness: 5 -- All required
- Precision: 5 -- Good
- Actionability: 5 -- Runnable
- Structure: 5 -- Explicit TDD cycle
- Efficiency: 4 -- Good
- Depth: 5 -- Comprehensive edge cases
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 4/5 -- Bug test, case insensitive, fix. Missing explicit whitespace test
- must_not violations: None
- Code artifacts: JS 4 tests for registerUser
- Completeness: 3 -- Only 4 tests; missing whitespace edge case
- Precision: 4 -- Tests are correct but limited
- Actionability: 4 -- Test and implementation provided
- Structure: 4 -- TDD cycles described
- Efficiency: 3 -- Only 4 tests
- Depth: 3 -- Covers duplicate and case insensitive but no whitespace, no multiple users, no email format validation
- **Composite: 3.40**

---

## Task tdd-004: calculateDiscount Refactor
**Ground Truth Summary:** Must mention characterization tests FIRST, test specific combinations (premium+SAVE10=0.3, vip+SAVE10=0.4, vip+HALF=0.5 cap), edge cases (negative price, unknown userType, unknown coupon), bug discovery (HALF overwrites), refactor only after tests green. Must not refactor before characterization tests.

### Condition D
- must_mention: 5/5 -- Characterization tests first, specific combinations tested, edge cases, HALF behavior (override vs stack) noted, refactor after green
- must_not violations: None
- Completeness: 5 -- All required with extensive characterization tests
- Precision: 5 -- Captures HALF overwrite behavior correctly
- Actionability: 5 -- Full test and refactored implementation
- Structure: 5 -- Characterization tests -> green -> refactor
- Efficiency: 4 -- Thorough
- Depth: 5 -- Notes HALF overwrite as potential bug; cap at 50%
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- Characterization tests, combinations, edge cases, HALF note (via test), refactor
- must_not violations: None
- Code artifacts: Test file exists
- Completeness: 5 -- All required
- Precision: 5 -- Good characterization approach
- Actionability: 5 -- Runnable tests
- Structure: 5 -- Tests first, then refactor
- Efficiency: 4 -- Good
- Depth: 4 -- Less explicit about HALF overwrite as bug
- **Composite: 4.73**

### Condition F
- must_mention: 5/5 -- Characterization tests (18 tests), combinations, edge cases (negative, unknown, null), HALF behavior, refactor after
- must_not violations: None
- Code artifacts: TS 18 tests with table-driven refactored implementation
- Completeness: 5 -- All required; sequential vs additive stacking catch is excellent
- Precision: 5 -- Catches stacking subtlety
- Actionability: 5 -- Both test and implementation
- Structure: 5 -- Explicit characterization -> refactor
- Efficiency: 4 -- 18 tests
- Depth: 5 -- Sequential vs additive stacking insight; rounding to 2 decimal places
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- Characterization tests, combinations, edge cases, HALF overwrites, refactor
- must_not violations: None
- Code artifacts: JS test file
- Completeness: 5 -- All required
- Precision: 5 -- Good
- Actionability: 5 -- Runnable
- Structure: 4 -- RED/GREEN labels less explicit
- Efficiency: 4 -- Good
- Depth: 4 -- Captures behavior but less analytical about HALF overwrite
- **Composite: 4.60**

### Condition H
- must_mention: 5/5 -- All required
- must_not violations: None
- Code artifacts: JS tests
- Completeness: 5 -- All required
- Precision: 5 -- Comprehensive characterization
- Actionability: 5 -- Runnable
- Structure: 5 -- Explicit TDD cycle
- Efficiency: 4 -- Good
- Depth: 5 -- Comprehensive
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 4/5 -- Characterization tests first (10 tests), combinations tested, edge cases (zero, negative), HALF overwrite captured, refactor with config-driven approach. But less explicit about HALF as a potential bug/design question.
- must_not violations: None
- Code artifacts: JS 10 tests
- Completeness: 4 -- 10 tests covers main cases; missing unknown userType test, unknown coupon test
- Precision: 4 -- Tests capture behavior but stacks/replaces concept not deeply analyzed
- Actionability: 5 -- Good config-driven refactored implementation
- Structure: 5 -- Characterization tests -> refactor clearly stated
- Efficiency: 4 -- 10 tests is reasonable
- Depth: 4 -- Config-driven refactor is clean; stacks: true/false is a good design choice
- **Composite: 4.27**

---

## Task tdd-005: Pagination Utility
**Ground Truth Summary:** Must mention test basic case (10 items, page 1, size 5), test last page (hasNext false), test first page (hasPrev false), edge cases (page 0, beyond range, pageSize 0, empty array, pageSize > total), coverage target 80%+. Structure: tests organized by scenario with arrange-act-assert.

### Condition D
- must_mention: 5/5 -- Basic case, last page, first page, edge cases (page 0, beyond range, pageSize 0, empty array), coverage mention
- must_not violations: None
- Completeness: 5 -- All required with additional edge cases (generic types)
- Precision: 5 -- Good test design
- Actionability: 5 -- Full test and implementation
- Structure: 5 -- Tests organized by scenario
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- Immutability test, generic type test
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All required with coverage
- must_not violations: None
- Code artifacts: Test file exists
- Completeness: 5 -- All required
- Precision: 5 -- Good
- Actionability: 5 -- Runnable
- Structure: 5 -- Organized by scenario
- Efficiency: 4 -- Good
- Depth: 4 -- Standard coverage
- **Composite: 4.73**

### Condition F
- must_mention: 5/5 -- All required with 16 tests
- must_not violations: None
- Code artifacts: TS 16 tests
- Completeness: 5 -- All required with performance test (10K items under 50ms), immutability
- Precision: 5 -- Comprehensive
- Actionability: 5 -- Both test and implementation
- Structure: 5 -- Organized by category
- Efficiency: 4 -- 16 tests
- Depth: 5 -- Performance test, immutability, page clamping behavior
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- All required
- must_not violations: None
- Code artifacts: JS test file
- Completeness: 5 -- All required
- Precision: 5 -- Good
- Actionability: 5 -- Runnable
- Structure: 4 -- Less organized
- Efficiency: 4 -- Good
- Depth: 4 -- Standard edge cases
- **Composite: 4.53**

### Condition H
- must_mention: 5/5 -- All required
- must_not violations: None
- Code artifacts: JS tests
- Completeness: 5 -- All required
- Precision: 5 -- Comprehensive
- Actionability: 5 -- Runnable
- Structure: 5 -- Well-organized
- Efficiency: 4 -- Good
- Depth: 5 -- Comprehensive
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 3/5 -- Basic case, last page, first page, empty array, pageSize > total. Missing: page 0 test, pageSize 0 test, no explicit coverage target
- must_not violations: None
- Code artifacts: JS 8 tests
- Completeness: 3 -- Only 8 tests; missing several required edge cases (page 0, pageSize 0)
- Precision: 4 -- Tests present are correct
- Actionability: 4 -- Test and implementation provided
- Structure: 4 -- Tests organized reasonably
- Efficiency: 3 -- 8 tests is thin for a pagination utility
- Depth: 3 -- Missing important edge cases
- **Composite: 3.40**

---

## Summary

| Task | D | E | F | G | H | I | J |
|------|---|---|---|---|---|---|---|
| tdd-001 | 4.87 | 4.87 | 4.60 | 4.53 | 4.87 | 4.87 | 3.13 |
| tdd-002 | 4.87 | 4.73 | 4.87 | 4.73 | 4.87 | 4.87 | 3.47 |
| tdd-003 | 4.87 | 4.87 | 4.87 | 4.60 | 4.87 | 4.87 | 3.40 |
| tdd-004 | 4.87 | 4.73 | 4.87 | 4.60 | 4.87 | 4.87 | 4.27 |
| tdd-005 | 4.87 | 4.73 | 4.87 | 4.53 | 4.87 | 4.87 | 3.40 |
| **Mean** | **4.87** | **4.79** | **4.82** | **4.60** | **4.87** | **4.87** | **3.53** |
