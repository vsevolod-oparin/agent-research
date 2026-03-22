# tdd-guide Evaluation (D/E/F) -- Full

## Task 1: tdd-001 (parsePrice)

**Ground Truth Summary:** Must write failing test first (RED), test for dollar sign/currency code/comma separators/euro/"free"->0, edge cases (empty string, null, negative, multiple dots, no digits), minimal implementation (GREEN), refactor step. Needs explicit Red-Green-Refactor labels, test code before implementation.

### Condition D
- must_mention coverage: 5/5 -- RED phase with failing tests, all format tests (dollar, USD, euro, "free"), edge cases (null, empty, negative, no digits), GREEN minimal impl, refactor step
- must_not violations: None
- Code artifacts: In-markdown only (no actual files on disk)
- Completeness: 5 -- 17 tests covering all required formats and edge cases, plus yen, pound, embedded text
- Precision: 5 -- Code is correct and would work as-is
- Actionability: 4 -- Code in markdown only; would need to copy-paste to use
- Structure: 5 -- Explicit RED/GREEN/REFACTOR labels, tests before implementation
- Efficiency: 5 -- Clean tests, minimal implementation
- Depth: 5 -- Unicode currencies, embedded price extraction, large numbers, whitespace
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- all required items covered
- must_not violations: None
- Code artifacts: Actual files on disk (`src/parsePrice.js`, `src/__tests__/parsePrice.test.js`) -- 26 tests per markdown report, all passing
- Completeness: 5 -- 26 tests covering all formats, edge cases
- Precision: 5 -- Tests pass, implementation handles all cases. Throws on negative prices (design choice)
- Actionability: 5 -- Actual runnable files on disk, part of 103-test passing suite
- Structure: 4 -- test.each pattern is efficient; markdown report shows tests but RED/GREEN/REFACTOR labels are in report not code
- Efficiency: 5 -- test.each eliminates repetition
- Depth: 5 -- Comprehensive edge cases including whitespace between symbol and number
- **Composite: 4.87**

### Condition F
- must_mention coverage: 5/5 -- all required items covered
- must_not violations: None
- Code artifacts: Actual TypeScript files on disk (`src/parsePrice.ts`, `src/parsePrice.test.ts`) -- 20 tests, all passing
- Completeness: 4 -- 20 tests; covers basics and edges but fewer than D (17) and E (26). Missing "multiple dots" edge case
- Precision: 5 -- TypeScript implementation correct, returns NaN for invalid (different error handling model than D/E which throw)
- Actionability: 5 -- Actual runnable TypeScript files, 74-test suite all passing
- Structure: 5 -- Clean TypeScript with explicit types, tests well-organized
- Efficiency: 5 -- Clean, no duplication
- Depth: 4 -- Good edge cases but fewer than D/E, NaN return instead of throw is less strict
- **Composite: 4.73**

---

## Task 2: tdd-002 (Rate Limiter)

**Ground Truth Summary:** Must test first (basic allow, basic deny after limit), edge cases (multiple clients, window reset, concurrent calls), time mocking/injection, coverage check. Must not implement before tests or skip refactor.

### Condition D
- must_mention coverage: 5/5 -- test first, basic allow/deny, multiple clients, window reset, time mocking (jest.useFakeTimers), coverage check
- must_not violations: None -- tests come first, refactor phase present
- Code artifacts: In-markdown only
- Completeness: 5 -- 14 tests covering sliding window, concurrent clients, constructor validation, special chars, performance
- Precision: 5 -- Correct sliding window implementation
- Actionability: 4 -- Markdown only
- Structure: 5 -- RED/GREEN/REFACTOR labels, test code before implementation
- Efficiency: 5 -- Clean implementation
- Depth: 5 -- Sliding window behavior, 10K client performance test, special characters in clientId
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- all items
- must_not violations: None
- Code artifacts: Actual files (`src/rateLimiter.js`, `src/__tests__/rateLimiter.test.js`) -- 15 tests per report
- Completeness: 4 -- 15 tests in report (5 shown in markdown), covers basics but markdown shows fewer tests than D
- Precision: 5 -- Implementation correct, tests pass
- Actionability: 5 -- Runnable files on disk
- Structure: 4 -- Tests shown in markdown are minimal (5 tests), actual file has more
- Efficiency: 5 -- Clean
- Depth: 4 -- Constructor validation, multiple clients, window reset but less elaborate than D
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/5 -- test first, basic allow/deny, window reset, time mocking; concurrent calls/multiple clients less prominent
- must_not violations: None
- Code artifacts: Actual TypeScript files (`src/rateLimiter.ts`, `src/rateLimiter.test.ts`) -- 10 tests
- Completeness: 4 -- 10 tests; covers core scenarios but fewer edge cases than D (14)
- Precision: 5 -- TypeScript implementation correct, tests pass
- Actionability: 5 -- Runnable TypeScript files
- Structure: 5 -- Clean TypeScript with Map<string, number[]>, well-typed
- Efficiency: 5 -- Minimal, clean
- Depth: 3 -- Fewer edge cases (no constructor validation, no concurrent client test, no special chars), though partial window expiry is good
- **Composite: 4.40**

---

## Task 3: tdd-003 (registerUser Duplicate Email Fix)

**Ground Truth Summary:** Must write failing test proving bug (register same email twice), test should assert second registration fails, minimal fix, additional tests for case insensitivity and whitespace. Bug-reproducing test first, then fix, then edge case tests.

### Condition D
- must_mention coverage: 5/5 -- bug-reproducing test (duplicate email), assertion on failure, minimal fix (findByEmail check), case insensitivity, whitespace trimming
- must_not violations: None
- Code artifacts: In-markdown only
- Completeness: 5 -- 11 tests including concurrent registration race condition, SQL injection, email format validation
- Precision: 5 -- Fix with promise-chain serialization for race conditions, correct email normalization
- Actionability: 4 -- Markdown only
- Structure: 5 -- Bug-reproducing test first, then fix, then edge cases
- Efficiency: 4 -- Slightly over-engineered (promise chain lock) but thorough
- Depth: 5 -- Concurrent registration, SQL injection, email format validation, whitespace
- **Composite: 4.73**

### Condition E
- must_mention coverage: 5/5 -- all items covered
- must_not violations: None
- Code artifacts: Actual files (`src/registerUser.js`, `src/__tests__/registerUser.test.js`) -- 13 tests per report
- Completeness: 5 -- 13 tests, all key scenarios covered
- Precision: 5 -- Implementation correct with Map-based store, email normalization
- Actionability: 5 -- Runnable files on disk
- Structure: 4 -- Bug-reproducing tests shown but TDD cycle labels less explicit in report
- Efficiency: 5 -- Clean, focused
- Depth: 4 -- Covers case insensitivity, whitespace, but fewer edge cases than D
- **Composite: 4.73**

### Condition F
- must_mention coverage: 5/5 -- duplicate email test, case insensitivity, whitespace
- must_not violations: None
- Code artifacts: Actual TypeScript files (`src/registerUser.ts`, `src/registerUser.test.ts`) -- 10 tests
- Completeness: 4 -- 10 tests; covers core scenarios. Uses result object pattern (success/error) instead of throw
- Precision: 5 -- TypeScript implementation correct with interfaces, tests pass
- Actionability: 5 -- Runnable TypeScript files
- Structure: 5 -- Clean TypeScript with User/RegistrationResult interfaces, UserStore class
- Efficiency: 5 -- Clean design
- Depth: 3 -- Fewer edge cases (no email format validation, no concurrent test, no whitespace-specific test beyond one trim check)
- **Composite: 4.40**

---

## Task 4: tdd-004 (calculateDiscount Refactor)

**Ground Truth Summary:** Must write characterization tests FIRST, test specific combos (premium+SAVE10=0.3, vip+SAVE10=0.4, vip+HALF=0.5 cap, regular+none=0), edge cases (negative price, unknown userType, unknown coupon), discover HALF overwrite bug, refactor after tests green. Must NOT refactor before characterization tests.

### Condition D
- must_mention coverage: 5/5 -- characterization tests first (20 tests), all specific combos verified, edge cases (negative, zero, floating point, unknown coupon/userType), HALF override behavior documented, refactor after green
- must_not violations: None -- tests run green first, then refactor
- Code artifacts: In-markdown only
- Completeness: 5 -- 20 characterization tests, all combos, edge cases
- Precision: 5 -- Correctly identifies HALF as override (not additive), refactored to lookup tables
- Actionability: 4 -- Markdown only
- Structure: 5 -- Characterization tests -> green -> refactor, explicit labels
- Efficiency: 5 -- Clean refactored code with config objects
- Depth: 5 -- Floating point, negative price, NaN for null, explicit additive vs override semantics
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- characterization tests, all combos, edge cases, HALF behavior, refactor
- must_not violations: None
- Code artifacts: Actual files (`src/calculateDiscount.js`, `src/__tests__/calculateDiscount.test.js`) -- 27 tests per report (actual file has 25+ with test.each)
- Completeness: 5 -- Comprehensive characterization with test.each for all 9 combos plus edge cases
- Precision: 5 -- Tests pass, implementation correct with stacks property
- Actionability: 5 -- Runnable files on disk
- Structure: 5 -- Well-organized by category (no discount, user type, coupon, combined, cap, edge cases, parameterized)
- Efficiency: 5 -- test.each pattern avoids repetition
- Depth: 5 -- All combos, NaN for non-numeric, undefined handling, large prices, decimal precision
- **Composite: 5.00**

### Condition F
- must_mention coverage: 4/5 -- characterization tests, combos, HALF behavior; edge cases less comprehensive (negative price returns negative instead of being rejected -- design choice); unknown coupon tested
- must_not violations: None
- Code artifacts: Actual TypeScript files (`src/calculateDiscount.ts`, `src/calculateDiscount.test.ts`) -- 18 tests
- Completeness: 4 -- 18 tests; different discount values than ground truth (employee 30%, vip 25% instead of original premium 20%, vip 30%). This means the implementation deviates from the original function behavior
- Precision: 3 -- The TypeScript implementation uses DIFFERENT discount percentages (employee: 0.30, vip: 0.25) than the original code (premium: 0.20, vip: 0.30). Characterization tests should capture EXISTING behavior, not invent new values. This is a significant precision issue
- Actionability: 5 -- Runnable TypeScript files
- Structure: 5 -- Clean TypeScript with helper functions
- Efficiency: 4 -- Clean but applies discounts sequentially (not how original works)
- Depth: 3 -- The deviation from original behavior undermines the characterization testing purpose
- **Composite: 3.73**

---

## Task 5: tdd-005 (Pagination Utility)

**Ground Truth Summary:** Must test basic case (10 items, page 1, size 5), last page (hasNext false), first page (hasPrev false), edge cases (page 0, page beyond range, pageSize 0, empty array, pageSize > total), coverage target 80%+. Tests organized by scenario with clear arrange-act-assert.

### Condition D
- must_mention coverage: 5/5 -- basic case, last page, first page, all edge cases (page 0, beyond range, pageSize 0, empty, pageSize > total), coverage claim 100%
- must_not violations: None
- Code artifacts: In-markdown only
- Completeness: 5 -- 23 tests covering all scenarios plus special characters, immutability, performance
- Precision: 5 -- Implementation correct, handles out-of-bounds gracefully
- Actionability: 4 -- Markdown only
- Structure: 5 -- Well-organized by scenario, clear arrange-act-assert
- Efficiency: 5 -- Clean slice-based implementation
- Depth: 5 -- Non-integer validation, null/undefined inputs, immutability, 10K performance, special chars
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- all required scenarios covered
- must_not violations: None
- Code artifacts: Actual files (`src/paginate.js`, `src/__tests__/paginate.test.js`) -- 22 tests per report
- Completeness: 5 -- 22 tests covering all scenarios
- Precision: 5 -- Tests pass, implementation correct
- Actionability: 5 -- Runnable files on disk
- Structure: 5 -- Well-organized test categories
- Efficiency: 5 -- Clean
- Depth: 5 -- Objects, single item, pageSize of 1, large dataset
- **Composite: 5.00**

### Condition F
- must_mention coverage: 5/5 -- all required scenarios covered
- must_not violations: None
- Code artifacts: Actual TypeScript files (`src/paginate.ts`, `src/paginate.test.ts`) -- 16 tests
- Completeness: 4 -- 16 tests; covers core scenarios but fewer than D (23) and E (22). Different return shape (items vs data, currentPage vs page field)
- Precision: 5 -- TypeScript with generic PaginationResult<T> interface, tests pass
- Actionability: 5 -- Runnable TypeScript files
- Structure: 5 -- Clean TypeScript with interface definition
- Efficiency: 5 -- Clean
- Depth: 4 -- Immutability, performance, but page 0/negative clamps instead of throws (less strict), fewer edge cases
- **Composite: 4.60**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| tdd-001 | 4.87 | 4.87 | 4.73 |
| tdd-002 | 4.87 | 4.53 | 4.40 |
| tdd-003 | 4.73 | 4.73 | 4.40 |
| tdd-004 | 4.87 | 5.00 | 3.73 |
| tdd-005 | 4.87 | 5.00 | 4.60 |
| **Mean** | **4.84** | **4.83** | **4.37** |
| E LIFT (vs D) | -- | -0.01 | -- |
| F LIFT (vs D) | -- | -- | -0.47 |
| F vs E | -- | -- | -0.46 |
