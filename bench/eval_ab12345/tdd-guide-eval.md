# TDD Guide Evaluation

## Scoring Dimensions (1-5)
- **Precision**: Correctness, no false claims, must_mention/must_not compliance
- **Completeness**: Coverage of all ground truth requirements
- **Actionability**: Can the reader directly use the output?
- **Structure**: Organization, clarity, readability
- **Efficiency**: Conciseness, no unnecessary filler
- **Depth**: Insight, nuance, understanding of edge cases

**Composite** = (Precision x 2 + Completeness x 1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

---

## Task-by-Task Analysis

### tdd-001: parsePrice TDD

**Ground Truth Requirements:**
- write failing test first (RED)
- test for: dollar sign, currency code, comma separators, euro, "free" -> 0
- edge cases: empty string, null, negative, multiple dots, no digits
- minimal implementation (GREEN)
- refactor step

### tdd-002: Rate Limiter TDD

**Ground Truth Requirements:**
- test first: basic allow, basic deny after limit
- edge cases: multiple clients, window reset, concurrent calls
- time mocking/injection (don't use real time in tests)
- coverage check step
- must_not: implement before writing tests, skip refactor phase

### tdd-003: Duplicate Email Bug Fix TDD

**Ground Truth Requirements:**
- write failing test that proves bug (register same email twice)
- test should assert second registration fails/throws
- minimal fix to make test pass
- additional tests: case insensitivity, whitespace
- structure: bug-reproducing test first, then fix, then edge case tests

### tdd-004: Refactor calculateDiscount TDD

**Ground Truth Requirements:**
- write characterization tests FIRST (capture current behavior)
- test: premium+SAVE10=0.3, vip+SAVE10=0.4, vip+HALF=0.5 (cap), regular+none=0
- edge: negative price, unknown userType, unknown coupon
- bug discovery: HALF overwrites premium/vip discount (is this intended?)
- refactor only after tests are green
- must_not: refactor before characterization tests exist

### tdd-005: Pagination Tests

**Ground Truth Requirements:**
- test basic case (10 items, page 1, size 5)
- test last page (hasNext false)
- test first page (hasPrev false)
- edge cases: page 0, page beyond range, pageSize 0, empty array, pageSize > total
- coverage target (80%+)
- structure: tests organized by scenario, each test has clear arrange-act-assert

---

## Condition Evaluations

### a1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Correct test logic, correct implementations. Task 4 vip+SAVE10 test expects 50 (wrong, should be 60). Minor issue. |
| Completeness | 4 | Covers most must_mention items. Missing null test in task 1, missing explicit coverage target in task 5. No explicit mention of HALF overwriting premium/vip as potential bug in task 4. |
| Actionability | 5 | Fully executable code, clear steps |
| Structure | 4 | Clear step numbering but lacks explicit RED/GREEN/REFACTOR labels consistently |
| Efficiency | 4 | Concise, no filler |
| Depth | 3 | Misses bug discovery in task 4 HALF behavior, no coverage target discussion |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 3) / 7.5 = **3.87**

### a2

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Good accuracy. Task 4 has self-correcting test (first writes 50 then corrects to 60), slightly messy. Fake timers used correctly in task 2. |
| Completeness | 4 | Covers most items. Missing null in task 1 edge cases. Case insensitivity test present in task 3. Task 5 missing page 0 and pageSize 0 tests. |
| Actionability | 5 | Complete executable code |
| Structure | 5 | Explicit RED/GREEN/REFACTOR labels, well-organized |
| Efficiency | 4 | Good conciseness |
| Depth | 3 | Task 4 doesn't explicitly flag HALF override as potential bug |

**Composite**: (4x2 + 4x1.5 + 5 + 5 + 4 + 3) / 7.5 = **4.00**

### a3

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Correct test expectations. Task 3 includes case insensitivity. Task 4 correctly computes vip+SAVE10=60. |
| Completeness | 4 | Good coverage. Task 1 missing null test but has empty string throw. Task 5 missing pageSize 0 edge case. No coverage target mentioned. |
| Actionability | 5 | Full executable code with clear steps |
| Structure | 4 | Good organization, tests before implementation |
| Efficiency | 4 | Focused content |
| Depth | 3 | Task 4 notes HALF override semantics but doesn't flag as potential bug. No coverage discussion. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 3) / 7.5 = **3.87**

### a4

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All computations correct. vip+SAVE10=60 correct. Time injection via constructor for rate limiter is clean. Task 3 includes case insensitivity and whitespace. |
| Completeness | 5 | Covers nearly all must_mention items. Task 1 has empty string, negative. Task 2 has time injection, sliding window. Task 3 has case-insensitive and empty email. Task 4 has characterization tests, correct values, edge cases. Task 5 has all edge cases including single item. |
| Actionability | 5 | Fully executable, clean code |
| Structure | 5 | Explicit Red/Green/Refactor labels throughout, well-organized |
| Efficiency | 4 | Slightly verbose but justified |
| Depth | 4 | Notes refactoring decisions. Task 4 refactor uses function-based coupon rules (creative). Missing explicit bug discovery callout for HALF override. |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 4) / 7.5 = **4.73**

### a5

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Correct throughout. Task 4 correctly identifies vip+SAVE10=60. Time injection via constructor parameter. |
| Completeness | 5 | Excellent coverage. Task 1 has all formats, empty, negative, throws on invalid. Task 2 has time injection, sliding window test. Task 3 has case insensitivity, whitespace, empty email. Task 4 has comprehensive characterization tests. Task 5 has empty, beyond range, pageSize 1, single item, type preservation. |
| Actionability | 5 | Complete runnable code |
| Structure | 5 | Clear RED/GREEN/REFACTOR labels, well-organized by test category |
| Efficiency | 4 | Good density |
| Depth | 4 | Notes potential cleanup method for rate limiter. Task 4 mentions what changed in refactor. Still doesn't explicitly flag HALF override as potential bug. |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 4) / 7.5 = **4.73**

### b1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Generally correct. Task 4 incorrectly expects vip+SAVE10=50 (should be 60) in characterization test. Iterative approach (start with hardcoded return) is pedagogically nice but adds verbosity. |
| Completeness | 4 | Good coverage. Task 2 has sliding window. Task 3 has case insensitivity and whitespace. Task 4 adds case-insensitive coupon matching (changes behavior, violates must_not). Task 5 has good edge cases. |
| Actionability | 4 | Code is runnable. Task 4 refactored version changes HALF behavior by making coupons additive instead of override (breaks characterization). |
| Structure | 5 | Excellent iterative TDD structure showing multiple Red-Green-Refactor cycles |
| Efficiency | 3 | Very verbose with multiple iterations per task |
| Depth | 4 | Shows genuine iterative TDD process. Good edge case thinking. |

**Composite**: (4x2 + 4x1.5 + 4 + 5 + 3 + 4) / 7.5 = **3.87**

### b2

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Generally correct. Task 4 vip+HALF comment says "30% + 50% = 80%, capped at 50%" which misunderstands - HALF sets to 0.5, doesn't add. The refactored version makes coupon additive, changing behavior. |
| Completeness | 4 | Covers most must_mention items. Task 1 has null/undefined. Task 2 uses real sleep (not mocked time) - partially problematic. Task 3 has case insensitivity and whitespace. Task 5 has good coverage. No coverage target mentioned. |
| Actionability | 4 | Code is usable. Task 2 uses real sleep() which makes tests slow/flaky. |
| Structure | 5 | Well-organized with RED/GREEN/REFACTOR sections, summary at end |
| Efficiency | 3 | Very verbose, extensive code examples |
| Depth | 3 | Task 4 refactored version changes HALF semantics (additive instead of override), missing the bug discovery insight. |

**Composite**: (4x2 + 4x1.5 + 4 + 5 + 3 + 3) / 7.5 = **3.73**

### b3

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Generally correct. Task 2 uses real sleep (flaky tests). Task 4 refactored version changes HALF to additive, violating must_not (changing behavior before understanding). |
| Completeness | 4 | Task 1 has null/undefined, negative. Task 3 has case insensitivity, whitespace, email validation. Task 5 has page 0, pageSize 0 (good). Missing coverage target. |
| Actionability | 4 | Code is runnable but some tests use real delays |
| Structure | 5 | Clear RED/GREEN/REFACTOR labels, clean organization |
| Efficiency | 3 | Very verbose |
| Depth | 3 | Notes "Some behaviors may be unintended" in task 4 which is close to bug discovery but doesn't fully articulate it |

**Composite**: (4x2 + 4x1.5 + 4 + 5 + 3 + 3) / 7.5 = **3.73**

### b4

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 2 uses real sleep. Task 4 refactored version changes HALF behavior (additive). b4 is identical to b3 content. |
| Completeness | 4 | Same coverage as b3 |
| Actionability | 4 | Same as b3 |
| Structure | 5 | Same as b3 |
| Efficiency | 3 | Very verbose |
| Depth | 3 | Same as b3 |

**Composite**: (4x2 + 4x1.5 + 4 + 5 + 3 + 3) / 7.5 = **3.73**

### b5

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 4 expects vip+HALF=50 which is correct for existing behavior. Refactored version uses additive approach which changes HALF semantics. |
| Completeness | 4 | Good coverage. Task 5 has page beyond range returning last page (different design choice). Has pageSize 0 edge case. |
| Actionability | 4 | Code is usable. Task 5 implementation clamps page which is different from ground truth expectation. |
| Structure | 5 | Clear RED/GREEN/REFACTOR labels, summary table, best practices list |
| Efficiency | 3 | Extremely verbose |
| Depth | 3 | Good pedagogy but misses bug discovery nuance in task 4 |

**Composite**: (4x2 + 4x1.5 + 4 + 5 + 3 + 3) / 7.5 = **3.73**

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| a1 | 4 | 4 | 5 | 4 | 4 | 3 | 3.87 |
| a2 | 4 | 4 | 5 | 5 | 4 | 3 | 4.00 |
| a3 | 4 | 4 | 5 | 4 | 4 | 3 | 3.87 |
| a4 | 5 | 5 | 5 | 5 | 4 | 4 | 4.73 |
| a5 | 5 | 5 | 5 | 5 | 4 | 4 | 4.73 |
| b1 | 4 | 4 | 4 | 5 | 3 | 4 | 3.87 |
| b2 | 4 | 4 | 4 | 5 | 3 | 3 | 3.73 |
| b3 | 4 | 4 | 4 | 5 | 3 | 3 | 3.73 |
| b4 | 4 | 4 | 4 | 5 | 3 | 3 | 3.73 |
| b5 | 4 | 4 | 4 | 5 | 3 | 3 | 3.73 |

**Key Observations:**
- a4 and a5 are the strongest outputs with highest precision and completeness, correctly computing all discount values and including time injection for rate limiter tests
- All conditions miss the explicit "bug discovery" callout for HALF overriding premium/vip discount in task 4 (a key must_mention)
- b-conditions tend to be significantly more verbose without additional substance, and several use real sleep() instead of fake timers in task 2
- b-conditions' task 4 refactoring often changes HALF semantics from override to additive, which breaks the characterization test contract
- a-conditions are consistently more concise and precise
