# tdd-guide Evaluation (D/E/F/G/H)

## Task tdd-001: parsePrice

**Ground Truth Summary:** Must write failing test first (RED), test for dollar sign/currency code/comma/euro/"free"->0, edge cases (empty/null/negative/multiple dots/no digits), minimal implementation (GREEN), refactor step. Explicit Red-Green-Refactor labels, test code before implementation.

### Condition D
- must_mention coverage: 5/5 -- RED labeled, dollar/currency/comma/euro/free tests, edge cases (null/empty/negative/no digits), GREEN labeled, REFACTOR labeled
- must_not violations: None
- Code artifacts: Markdown only but complete test + impl code inline
- Completeness: 5 -- All required formats plus Unicode currencies, embedded price in text
- Precision: 5 -- Code is correct and would pass
- Actionability: 5 -- Complete test file + implementation, copy-paste ready
- Structure: 5 -- Explicit RED/GREEN/REFACTOR labels, tests before impl
- Efficiency: 4 -- Thorough test suite (17 tests)
- Depth: 5 -- Edge cases include SQL injection email, special chars, large numbers
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- RED (implicit), all currency formats, edge cases, GREEN, REFACTOR
- must_not violations: None
- Code artifacts: JS + Jest in src/__tests__/ (103 tests total across all tasks)
- Completeness: 5 -- Covers all formats including plain numbers
- Precision: 5 -- Running code with 100% coverage
- Actionability: 5 -- Actual working code with real test execution
- Structure: 4 -- Uses test.each effectively but RED/GREEN/REFACTOR labels less explicit in markdown
- Efficiency: 5 -- Concise with parameterized tests (26 tests)
- Depth: 4 -- Good edge cases but less narrative about TDD process
- **Composite: 4.73**

### Condition F
- must_mention coverage: 5/5 -- RED/GREEN/REFACTOR described, all formats, edge cases (null returns NaN rather than throwing)
- must_not violations: None
- Code artifacts: TS + Jest in src/ (74 tests total)
- Completeness: 5 -- All required formats
- Precision: 4 -- Returns NaN for null/undefined rather than throwing; debatable design choice but works
- Actionability: 5 -- Real TypeScript code executing with tests
- Structure: 4 -- TDD observations section nice but less explicit cycle labeling
- Efficiency: 4 -- 20 tests, good coverage
- Depth: 4 -- TDD observations section adds process insight
- **Composite: 4.33**

### Condition G
- must_mention coverage: 5/5 -- RED/GREEN labels, all formats, edge cases (null returns NaN), implementation
- must_not violations: None
- Code artifacts: JS + Jest in tmp/ (68 tests total)
- Completeness: 5 -- All required formats, Unicode currencies
- Precision: 5 -- Working code with 93%+ coverage
- Actionability: 5 -- Real running tests
- Structure: 4 -- RED/GREEN labeled but REFACTOR section brief
- Efficiency: 4 -- 22 tests, good
- Depth: 4 -- Negative price handling, large numbers
- **Composite: 4.60**

### Condition H
- must_mention coverage: 5/5 -- RED/GREEN/REFACTOR explicit, all formats, edge cases (throws on null), implementation
- must_not violations: None
- Code artifacts: JS + Jest in tmp/ (105 tests total, highest count)
- Completeness: 5 -- All required plus Unicode symbols (Rupee, Won)
- Precision: 5 -- Working code with 100% coverage
- Actionability: 5 -- Real running tests with coverage data
- Structure: 5 -- Explicit RED/GREEN/REFACTOR, test before impl, edge case table
- Efficiency: 4 -- 29 tests, comprehensive
- Depth: 5 -- Unicode currency symbols, ISO code stripping, edge case categorization table
- **Composite: 4.87**

---

## Task tdd-002: Rate Limiter

**Ground Truth Summary:** Must test first (basic allow, deny after limit), edge cases (multiple clients, window reset, concurrent calls), time mocking/injection, coverage check. Must not implement before tests or skip refactor.

### Condition D
- must_mention coverage: 4/4 -- basic allow/deny tests first, multiple clients, window reset, jest.useFakeTimers
- must_not violations: None -- tests before implementation
- Completeness: 5 -- All required plus sliding window, constructor validation, special chars, 10k clients
- Precision: 5 -- Code is correct, sliding window implementation
- Actionability: 5 -- Complete test + implementation
- Structure: 5 -- RED/GREEN/REFACTOR labeled
- Efficiency: 4 -- 14 tests
- Depth: 5 -- Sliding window with individual timestamp expiry, promise chain for concurrency
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- basic allow/deny, independent clients, window reset, fake timers
- must_not violations: None
- Code artifacts: Running tests (103 total)
- Completeness: 4 -- Covers required but fewer edge cases (5 tests)
- Precision: 5 -- Correct implementation
- Actionability: 5 -- Working code
- Structure: 4 -- Less explicit TDD labels
- Efficiency: 5 -- Very concise (5 tests)
- Depth: 3 -- Minimal edge cases, no constructor validation tests
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- basic allow/deny, multiple clients, window reset, fake timers
- must_not violations: None
- Code artifacts: TS + Jest running
- Completeness: 4 -- Good coverage (10 tests) but missing constructor validation
- Precision: 5 -- Correct
- Actionability: 5 -- Working TypeScript code
- Structure: 4 -- TDD observations section good
- Efficiency: 4 -- 10 tests
- Depth: 4 -- Sliding window, partial expiry test
- **Composite: 4.33**

### Condition G
- must_mention coverage: 4/4 -- basic allow/deny, independent clients, window reset, fake timers
- must_not violations: None
- Code artifacts: Running tests (68 total)
- Completeness: 5 -- All required plus constructor validation, many clients, sliding window
- Precision: 5 -- Correct, uses shift() for efficient cleanup
- Actionability: 5 -- Working code
- Structure: 4 -- RED/GREEN labeled
- Efficiency: 4 -- 9 tests
- Depth: 4 -- Good sliding window test
- **Composite: 4.60**

### Condition H
- must_mention coverage: 4/4 -- basic allow/deny, independent clients, window reset, fake timers
- must_not violations: None
- Code artifacts: Running tests (105 total)
- Completeness: 5 -- All required plus constructor validation, special chars, 10k clients, rapid sequential
- Precision: 5 -- Correct
- Actionability: 5 -- Working code with 100% coverage
- Structure: 5 -- Explicit RED/GREEN/REFACTOR, key design decisions section
- Efficiency: 4 -- 14 tests
- Depth: 5 -- Sliding window vs fixed window decision explained, per-client isolation, lazy pruning
- **Composite: 4.87**

---

## Task tdd-003: Fix Duplicate Email Bug

**Ground Truth Summary:** Must write failing test proving bug (register same email twice), assert second fails, minimal fix, additional tests for case insensitivity and whitespace. Bug-reproducing test first, then fix, then edge cases.

### Condition D
- must_mention coverage: 4/4 -- duplicate email test first (RED), second registration throws, minimal fix (findByEmail check), case insensitivity + whitespace tests
- must_not violations: None
- Completeness: 5 -- All required plus concurrent registration race test, SQL injection test
- Precision: 5 -- Correct, includes serialized insert for race condition
- Actionability: 5 -- Complete code with before/after comparison
- Structure: 5 -- Bug-reproducing test clearly labeled, RED/GREEN/REFACTOR
- Efficiency: 4 -- 11 tests
- Depth: 5 -- Race condition handling with promise chain, two-layer defense
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- duplicate email test, case insensitive, whitespace, minimal fix
- must_not violations: None
- Code artifacts: Running tests
- Completeness: 4 -- Covers required, less edge cases shown (3 bug tests)
- Precision: 5 -- Correct fix
- Actionability: 5 -- Working code
- Structure: 4 -- Bug-reproducing tests first but less explicit labeling
- Efficiency: 5 -- Concise
- Depth: 3 -- Minimal depth beyond the fix
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- duplicate email test, case insensitive, stored lowercase, minimal fix
- must_not violations: None
- Code artifacts: TS + Jest running
- Completeness: 4 -- Good coverage (10 tests)
- Precision: 5 -- Correct
- Actionability: 5 -- Working TypeScript code
- Structure: 4 -- TDD observations section good
- Efficiency: 4 -- Good
- Depth: 4 -- TDD prevented over-engineering note
- **Composite: 4.33**

### Condition G
- must_mention coverage: 4/4 -- duplicate test first (RED), case insensitive, whitespace, fix
- must_not violations: None
- Code artifacts: Running tests (68 total)
- Completeness: 5 -- All required plus validation edge cases
- Precision: 5 -- Correct, uses result objects not exceptions
- Actionability: 5 -- Working code
- Structure: 4 -- Tests first, good structure
- Efficiency: 4 -- 8 tests
- Depth: 4 -- Good email normalization
- **Composite: 4.60**

### Condition H
- must_mention coverage: 4/4 -- duplicate test first (RED), case insensitive, whitespace (implicit via lowercase), fix with findByEmail
- must_not violations: None
- Code artifacts: Running tests (105 total)
- Completeness: 5 -- All required plus SQL injection test, null/undefined, password validation
- Precision: 5 -- Correct, includes password hashing
- Actionability: 5 -- Working code with 100% coverage
- Structure: 5 -- Bug-reproducing tests clearly marked, RED/GREEN/REFACTOR
- Efficiency: 4 -- 12 tests
- Depth: 5 -- Password hashing, email regex validation, SQL injection defense, before/after code
- **Composite: 4.87**

---

## Task tdd-004: Refactor calculateDiscount

**Ground Truth Summary:** Must write characterization tests FIRST, test specific combos (premium+SAVE10=0.3, vip+SAVE10=0.4, vip+HALF=0.5 cap), edge cases (negative, unknown), discover HALF overwrite behavior, refactor only after tests green. Must NOT refactor before characterization tests.

### Condition D
- must_mention coverage: 5/5 -- characterization tests first, premium+SAVE10=70, vip+SAVE10=60, vip+HALF=50, HALF override behavior noted, refactor after green
- must_not violations: None -- characterization tests before refactor
- Completeness: 5 -- All required combos plus null handling, floating point, large prices
- Precision: 5 -- Correct values for all combos, HALF override vs additive correctly identified
- Actionability: 5 -- Complete refactored code with lookup tables
- Structure: 5 -- Characterization tests clearly labeled, improvements listed
- Efficiency: 4 -- 20 tests
- Depth: 5 -- Explicit coupon type (additive/override), extensibility analysis
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- characterization tests, all combos correct, HALF override, refactor after
- must_not violations: None
- Code artifacts: Running tests
- Completeness: 5 -- Full 3x3 matrix plus edge cases (27 tests)
- Precision: 4 -- Uses "stacks: true/false" which is good but less explicit than additive/override
- Actionability: 5 -- Working code
- Structure: 4 -- Less explicit labeling of characterization step
- Efficiency: 4 -- Good
- Depth: 4 -- Good refactoring with lookup tables
- **Composite: 4.33**

### Condition F
- must_mention coverage: 4/5 -- characterization tests, combos tested, refactor after; HALF override mentioned but uses sequential application (30% then 10%) which differs from ground truth
- must_not violations: None
- Code artifacts: TS + Jest running
- Completeness: 4 -- Tests present but sequential vs additive discount stacking differs from original function
- Precision: 3 -- Sequential discount application changes behavior from original; characterization tests should preserve original behavior but F's tests define different behavior (employee 30%, vip 25% instead of 20%/30%)
- Actionability: 4 -- Working code but deviates from the original function's specification
- Structure: 4 -- TDD observations section good
- Efficiency: 4 -- 18 tests
- Depth: 4 -- Notes sequential vs additive but this means the characterization failed to preserve behavior
- **Composite: 3.67**

### Condition G
- must_mention coverage: 5/5 -- characterization tests first, all correct combos, HALF override (type: 'set'), refactor after
- must_not violations: None
- Code artifacts: Running tests (68 total)
- Completeness: 5 -- Full characterization matrix with edge cases
- Precision: 5 -- Correct values, correct HALF behavior
- Actionability: 5 -- Working code
- Structure: 5 -- Characterization tests clearly organized by category
- Efficiency: 4 -- 16 tests
- Depth: 5 -- Explicit add/set coupon types, MAX_DISCOUNT constant
- **Composite: 4.87**

### Condition H
- must_mention coverage: 5/5 -- characterization tests first, all correct combos, HALF override (type: 'override'), refactor after green
- must_not violations: None
- Code artifacts: Running tests (105 total)
- Completeness: 5 -- Full 3x3 matrix parameterized plus individual tests, edge cases (negative, NaN, large)
- Precision: 5 -- Correct values for all combos
- Actionability: 5 -- Working code with 100% coverage
- Structure: 5 -- Characterization tests clearly labeled, improvement table
- Efficiency: 4 -- 28 tests (some redundancy between parameterized and individual)
- Depth: 5 -- Input validation added (NaN/non-numeric), explicit additive/override typing, improvement comparison table
- **Composite: 4.87**

---

## Task tdd-005: Pagination Utility

**Ground Truth Summary:** Must test basic case (10 items, page 1, size 5), last page (hasNext false), first page (hasPrev false), edge cases (page 0, beyond range, pageSize 0, empty array, pageSize > total), coverage target 80%+. Tests organized by scenario, clear arrange-act-assert.

### Condition D
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases (page 0, beyond range, pageSize 0, empty array, pageSize > total), 100% coverage
- must_not violations: None
- Completeness: 5 -- All required plus immutability test, performance test, generic types, special characters
- Precision: 5 -- Correct implementation
- Actionability: 5 -- Complete test + implementation
- Structure: 5 -- Organized by scenario, clear assertions
- Efficiency: 4 -- 23 tests
- Depth: 5 -- Non-mutation test, generic type support, performance consideration
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases, coverage 100%
- must_not violations: None
- Code artifacts: Running tests
- Completeness: 4 -- Covers required but fewer tests (9 shown in markdown, 22 in actual files)
- Precision: 5 -- Correct
- Actionability: 5 -- Working code
- Structure: 4 -- Organized but less detailed in markdown
- Efficiency: 4 -- Concise
- Depth: 3 -- Less depth on edge cases in documentation
- **Composite: 4.20**

### Condition F
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases (page 0 clamps), coverage
- must_not violations: None
- Code artifacts: TS + Jest running
- Completeness: 4 -- Good coverage (16 tests) but page 0 clamps rather than throws (different behavior)
- Precision: 4 -- Clamping page 0 to page 1 is a valid choice but different from throwing; pageSize 0 defaults rather than throws
- Actionability: 5 -- Working TypeScript code
- Structure: 4 -- TDD observations section
- Efficiency: 4 -- Good
- Depth: 4 -- Immutability test, performance test
- **Composite: 4.13**

### Condition G
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases (page 0 defaults to 1, pageSize throws), coverage 100%
- must_not violations: None
- Code artifacts: Running tests (68 total)
- Completeness: 5 -- All required edge cases covered
- Precision: 4 -- Page 0 defaults to 1 rather than throws; mixed approach
- Actionability: 5 -- Working code
- Structure: 5 -- Organized by describe blocks
- Efficiency: 4 -- 13 tests
- Depth: 4 -- Object items, large dataset, string items
- **Composite: 4.47**

### Condition H
- must_mention coverage: 5/5 -- basic case, last page, first page, edge cases (page 0 throws, pageSize 0 throws, beyond range, empty), 100% coverage
- must_not violations: None
- Code artifacts: Running tests (105 total)
- Completeness: 5 -- All required plus non-integer page/pageSize, immutability, performance, generic types
- Precision: 5 -- Correct, throws on invalid inputs
- Actionability: 5 -- Working code with 100% coverage
- Structure: 5 -- Organized by scenario, clear assertions, edge case table
- Efficiency: 4 -- 22 tests
- Depth: 5 -- Non-integer input validation, immutability test, performance assertion, generic type tests
- **Composite: 4.87**

---

## Summary

| Task | D | E | F | G | H |
|------|---|---|---|---|---|
| tdd-001 | 4.87 | 4.73 | 4.33 | 4.60 | 4.87 |
| tdd-002 | 4.87 | 4.20 | 4.33 | 4.60 | 4.87 |
| tdd-003 | 4.87 | 4.20 | 4.33 | 4.60 | 4.87 |
| tdd-004 | 4.87 | 4.33 | 3.67 | 4.87 | 4.87 |
| tdd-005 | 4.87 | 4.20 | 4.13 | 4.47 | 4.87 |
| **Mean** | **4.87** | **4.33** | **4.16** | **4.63** | **4.87** |
