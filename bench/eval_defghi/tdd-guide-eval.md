# tdd-guide Evaluation (D/E/F/G/H/I)

## Task 1: tdd-001

**Ground Truth Summary:** Write failing test first (RED), test for dollar/currency code/comma/euro/"free"->0, edge cases (empty, null, negative, multiple dots, no digits), minimal implementation (GREEN), refactor step. Structure: explicit Red-Green-Refactor labels, test code before implementation.

### Condition D
- must_mention: 5/5 -- RED first, all format tests, edge cases, GREEN minimal, refactor step
- must_not violations: None
- Code artifacts: No actual files (markdown only)
- Completeness: 5 -- All required test cases plus extras (Unicode currencies, embedded in text)
- Precision: 5 -- Correct TDD cycle, tests before implementation
- Actionability: 5 -- Full runnable test and implementation code
- Structure: 5 -- Explicit RED/GREEN/REFACTOR labels, coverage note
- Efficiency: 4 -- Thorough
- Depth: 5 -- 17 tests, comprehensive edge cases
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: JS 103 tests in src/ (actual files exist)
- Completeness: 5 -- All formats, edge cases covered (26 test cases)
- Precision: 5 -- Tests before implementation, correct TDD
- Actionability: 5 -- Full code with test.each patterns
- Structure: 4 -- TDD cycle mentioned but labels less explicit
- Efficiency: 5 -- Concise parameterized tests
- Depth: 4 -- Good coverage but less narrative about cycle
- **Composite: 4.60**

### Condition F
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: TS 74 tests in src/ (actual TypeScript files)
- Completeness: 5 -- All formats, edge cases (20 tests)
- Precision: 5 -- RED-GREEN-REFACTOR clearly described
- Actionability: 4 -- Summary of tests rather than full inline code
- Structure: 5 -- Explicit TDD cycle labels, observations section
- Efficiency: 4 -- Descriptive
- Depth: 4 -- NaN return for edge cases (different from throws, valid choice)
- **Composite: 4.47**

### Condition G
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: JS 68 tests in tmp/ (actual files)
- Completeness: 5 -- All formats, edge cases (22 test cases)
- Precision: 5 -- Tests before implementation, correct TDD
- Actionability: 5 -- Full test and implementation code
- Structure: 5 -- Explicit RED/GREEN labels, coverage stats
- Efficiency: 5 -- Clean parameterized tests
- Depth: 4 -- Good coverage, NaN return choice
- **Composite: 4.73**

### Condition H
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: JS 105 tests in tmp/ (actual files)
- Completeness: 5 -- All formats, edge cases (29 tests), Unicode symbols
- Precision: 5 -- Explicit RED/GREEN/REFACTOR
- Actionability: 5 -- Full code with edge case table
- Structure: 5 -- Clear TDD cycle labels
- Efficiency: 4 -- Thorough
- Depth: 5 -- Unicode symbols (rupee, won), throws on invalid
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Code artifacts: JS 105 tests in tmp/ (same as H)
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 2: tdd-002

**Ground Truth Summary:** Test first (basic allow, basic deny), edge cases (multiple clients, window reset, concurrent calls), time mocking/injection, coverage check step. Must not: implement before tests, skip refactor phase.

### Condition D
- must_mention: 4/4 -- Test first, edge cases (multiple clients, window reset, concurrent), time mocking (jest.useFakeTimers), coverage check
- must_not violations: None -- tests written first, refactor step present
- Completeness: 5 -- All items plus sliding window, constructor validation, special chars
- Precision: 5 -- Correct TDD cycle
- Actionability: 5 -- Full runnable code (14 tests)
- Structure: 5 -- RED/GREEN/REFACTOR labels
- Efficiency: 4 -- Thorough
- Depth: 5 -- Sliding window with partial expiry tested
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- All found
- must_not violations: None
- Code artifacts: Part of 103 tests
- Completeness: 4 -- Core cases covered but fewer tests (15 described inline)
- Precision: 5 -- Tests first, fake timers
- Actionability: 5 -- Full code
- Structure: 4 -- TDD mentioned but less explicit labels
- Efficiency: 5 -- Concise
- Depth: 4 -- Good but less edge case variety
- **Composite: 4.47**

### Condition F
- must_mention: 4/4 -- All found
- must_not violations: None
- Code artifacts: Part of 74 tests
- Completeness: 4 -- 10 tests described, core cases covered
- Precision: 5 -- Tests first, fake timers
- Actionability: 4 -- Summary format, less inline code
- Structure: 5 -- TDD cycle labeled, observations
- Efficiency: 4 -- Descriptive
- Depth: 4 -- Sliding window, partial expiry
- **Composite: 4.33**

### Condition G
- must_mention: 4/4 -- All found
- must_not violations: None
- Code artifacts: Part of 68 tests
- Completeness: 5 -- 9 tests, all core + sliding window partial expiry
- Precision: 5 -- Tests first, fake timers
- Actionability: 5 -- Full code, while-loop optimization
- Structure: 5 -- RED/GREEN labels, coverage stats (100%)
- Efficiency: 5 -- Clean implementation
- Depth: 4 -- Good design decisions documented
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 -- All found
- must_not violations: None
- Code artifacts: Part of 105 tests
- Completeness: 5 -- 14 tests, all core + sliding window + rapid fire + special chars
- Precision: 5 -- Tests first, fake timers
- Actionability: 5 -- Full code
- Structure: 5 -- RED/GREEN/REFACTOR labels
- Efficiency: 4 -- Thorough
- Depth: 5 -- Boundary test (maxRequests=1), rapid sequential, 10k clients
- **Composite: 4.87**

### Condition I
- must_mention: 4/4 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 3: tdd-003

**Ground Truth Summary:** Write failing test proving bug (register same email twice), test asserts second registration fails, minimal fix, additional tests (case insensitivity, whitespace). Structure: bug-reproducing test first, then fix, then edge cases.

### Condition D
- must_mention: 4/4 -- Bug-reproducing test first, second reg fails, minimal fix, case insensitivity + whitespace
- must_not violations: None
- Completeness: 5 -- Bug test first, case insensitive, whitespace, concurrent duplicates
- Precision: 5 -- Correct TDD bug-fix cycle
- Actionability: 5 -- Full code with repository pattern
- Structure: 5 -- Bug test RED, then GREEN fix, then edge cases
- Efficiency: 4 -- Thorough (11 tests)
- Depth: 5 -- Concurrent registration race condition test, SQL injection test
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- Bug test, case insensitive, whitespace
- Precision: 5 -- Tests first
- Actionability: 5 -- Full code
- Structure: 4 -- Bug-reproducing tests labeled but less explicit TDD cycle
- Efficiency: 5 -- Concise
- Depth: 4 -- 13 tests including validation
- **Composite: 4.60**

### Condition F
- must_mention: 4/4 -- All found
- must_not violations: None
- Code artifacts: Part of 74 tests
- Completeness: 5 -- Bug test, case insensitive, whitespace, stored email lowercase
- Precision: 5 -- TDD approach
- Actionability: 4 -- Summary with key fix code
- Structure: 5 -- Bug-reproducing tests highlighted, TDD observations
- Efficiency: 4 -- Good
- Depth: 4 -- Good, 10 tests
- **Composite: 4.47**

### Condition G
- must_mention: 4/4 -- All found
- must_not violations: None
- Code artifacts: Part of 68 tests
- Completeness: 5 -- Bug test, case insensitive, whitespace trim
- Precision: 5 -- Tests first, fix after
- Actionability: 5 -- Full code
- Structure: 5 -- Explicit bug-fix TDD approach
- Efficiency: 5 -- Clean (8 tests focused)
- Depth: 4 -- Good, less edge cases than D
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 -- All found
- must_not violations: None
- Code artifacts: Part of 105 tests
- Completeness: 5 -- Bug test, case insensitive, whitespace, SQL injection, special chars
- Precision: 5 -- Tests first, explicit bug-fix labels
- Actionability: 5 -- Full code with password hashing
- Structure: 5 -- BUG FIX label, RED then GREEN
- Efficiency: 4 -- Thorough (12 tests)
- Depth: 5 -- SQL injection defense, password not returned, email format validation
- **Composite: 4.87**

### Condition I
- must_mention: 4/4 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 4: tdd-004

**Ground Truth Summary:** Write characterization tests FIRST, test specific combos (premium+SAVE10=0.3 discount, vip+SAVE10=0.4, vip+HALF=0.5 cap, regular+none=0), edge cases (negative, unknown userType/coupon), bug discovery: HALF overwrites premium/vip discount, refactor only after tests green. Must not: refactor before characterization tests.

### Condition D
- must_mention: 5/5 -- Characterization tests first, all combos tested, edge cases, HALF override behavior noted, refactor after green
- must_not violations: None -- characterization tests run green before refactor
- Completeness: 5 -- Full 3x3 matrix plus edge cases, 20 tests
- Precision: 5 -- Correct TDD refactoring approach
- Actionability: 5 -- Full code with lookup tables
- Structure: 5 -- Characterization tests labeled, then refactor
- Efficiency: 4 -- Thorough
- Depth: 5 -- HALF override vs additive distinction explicitly noted
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: Part of 103 tests
- Completeness: 5 -- Full matrix, edge cases (27 tests)
- Precision: 5 -- Characterization first, refactor after
- Actionability: 5 -- Full code with stacks property
- Structure: 5 -- Characterization tests labeled
- Efficiency: 5 -- Parameterized tests
- Depth: 5 -- stacks boolean property is elegant
- **Composite: 4.87**

### Condition F
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: Part of 74 tests
- Completeness: 4 -- 18 tests. Different discount model (sequential not additive) -- deviates from original function's behavior
- Precision: 3 -- The refactored implementation uses sequential application of discounts (30% then 10%) instead of additive (30% + 10% = 40%), which changes behavior. This is a significant inaccuracy
- Actionability: 4 -- Code provided but behavior differs
- Structure: 5 -- TDD cycle labeled
- Efficiency: 4 -- Good
- Depth: 4 -- Notes the sequential vs additive issue but changes behavior
- **Composite: 3.87**

### Condition G
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: Part of 68 tests
- Completeness: 5 -- Full matrix, edge cases, HALF override noted
- Precision: 5 -- Correct characterization of original behavior
- Actionability: 5 -- Full code with add/set coupon types
- Structure: 5 -- Characterization tests labeled
- Efficiency: 5 -- Clean test organization by category
- Depth: 5 -- HALF as "set" vs SAVE10 as "add" is clear
- **Composite: 4.87**

### Condition H
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: Part of 105 tests
- Completeness: 5 -- Full matrix (parameterized), edge cases (28 tests)
- Precision: 5 -- Correct characterization, all values match original
- Actionability: 5 -- Full code with additive/override types
- Structure: 5 -- Characterization labeled, key behavioral observations
- Efficiency: 4 -- Thorough
- Depth: 5 -- Input validation added (non-numeric/NaN), behavioral observations section
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 5: tdd-005

**Ground Truth Summary:** Test basic case (10 items, page 1, size 5), last page (hasNext false), first page (hasPrev false), edge cases (page 0, beyond range, pageSize 0, empty array, pageSize > total), coverage target (80%+). Structure: tests by scenario (happy path, edge, error), clear arrange-act-assert.

### Condition D
- must_mention: 5/5 -- Basic case, last page, first page, edge cases, coverage target (100% claimed)
- must_not violations: None
- Completeness: 5 -- All items plus generic type support, immutability, performance (23 tests)
- Precision: 5 -- Correct TDD
- Actionability: 5 -- Full code
- Structure: 5 -- Tests organized by scenario, clear AAA pattern
- Efficiency: 4 -- Thorough
- Depth: 5 -- Non-mutation test, 10K items test, special characters
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: Part of 103 tests
- Completeness: 5 -- All items (22 tests), objects, single item
- Precision: 5 -- Tests first
- Actionability: 5 -- Full code
- Structure: 4 -- Tests organized, AAA pattern
- Efficiency: 5 -- Concise
- Depth: 4 -- Good coverage
- **Composite: 4.60**

### Condition F
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: Part of 74 tests
- Completeness: 5 -- All items (16 tests), immutability, performance
- Precision: 5 -- Tests first
- Actionability: 4 -- Summary with code
- Structure: 5 -- Tests organized by scenario, interface defined
- Efficiency: 4 -- Good
- Depth: 4 -- Different return field names (items vs data) -- valid TypeScript approach
- **Composite: 4.47**

### Condition G
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: Part of 68 tests
- Completeness: 5 -- All items (13 tests), string/object types, large dataset
- Precision: 4 -- page 0 defaults to page 1 instead of throwing (different behavior choice)
- Actionability: 5 -- Full code
- Structure: 5 -- Tests by scenario
- Efficiency: 5 -- Clean
- Depth: 4 -- Good but page 0 handling differs from throwing
- **Composite: 4.53**

### Condition H
- must_mention: 5/5 -- All found
- must_not violations: None
- Code artifacts: Part of 105 tests
- Completeness: 5 -- All items (22 tests), immutability, performance, generic types
- Precision: 5 -- Throws on invalid input
- Actionability: 5 -- Full code
- Structure: 5 -- Tests by scenario, edge case table
- Efficiency: 4 -- Thorough
- Depth: 5 -- Performance assertion (<100ms), non-mutation, non-integer page/pageSize
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Summary

| Task | D | E | F | G | H | I |
|------|---|---|---|---|---|---|
| tdd-001 | 4.87 | 4.60 | 4.47 | 4.73 | 4.87 | 4.87 |
| tdd-002 | 4.87 | 4.47 | 4.33 | 4.73 | 4.87 | 4.87 |
| tdd-003 | 4.87 | 4.60 | 4.47 | 4.73 | 4.87 | 4.87 |
| tdd-004 | 4.87 | 4.87 | 3.87 | 4.87 | 4.87 | 4.87 |
| tdd-005 | 4.87 | 4.60 | 4.47 | 4.53 | 4.87 | 4.87 |
| **Mean** | **4.87** | **4.63** | **4.32** | **4.72** | **4.87** | **4.87** |
