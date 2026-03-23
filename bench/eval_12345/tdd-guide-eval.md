# Evaluation: tdd-guide

## Ground Truth Requirements

### Task tdd-001 (parsePrice)
- **must_mention**: failing test first (RED); test for dollar sign, currency code, comma separators, euro, "free"->0; edge cases (empty string, null, negative, multiple dots, no digits); minimal implementation (GREEN); refactor step
- **structure**: explicit Red-Green-Refactor cycle labels; test code before implementation code

### Task tdd-002 (Rate Limiter)
- **must_mention**: test first (basic allow, basic deny); edge cases (multiple clients, window reset, concurrent calls); time mocking/injection; coverage check step
- **must_not**: implement before writing tests; skip the refactor phase

### Task tdd-003 (Duplicate Email Bug)
- **must_mention**: failing test that proves the bug; test asserts second registration fails/throws; minimal fix; additional tests for case insensitivity, whitespace
- **structure**: bug-reproducing test comes first, then fix, then edge case tests

### Task tdd-004 (calculateDiscount Refactor)
- **must_mention**: characterization tests FIRST; test premium+SAVE10=0.3, vip+SAVE10=0.4, vip+HALF=0.5(cap), regular+none=0; edge cases (negative price, unknown userType, unknown coupon); bug discovery (HALF overwrites premium/vip discount); refactor only after tests green
- **must_not**: refactor before characterization tests exist

### Task tdd-005 (Pagination)
- **must_mention**: test basic case (10 items, page 1, size 5); test last page (hasNext false); test first page (hasPrev false); edge cases (page 0, page beyond range, pageSize 0, empty array, pageSize > total); coverage target 80%+
- **structure**: tests organized by scenario; clear arrange-act-assert

---

## Condition Evaluations

### Condition 1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Accurate TDD content, no misinformation. Minor: missing explicit null/negative edge case tests for Task 1; doesn't throw for empty string in Task 1 — just throws. Task 4 identifies HALF override behavior but doesn't explicitly call it a "bug discovery." |
| Completeness | 4 | All 5 tasks covered. Task 1: covers dollar, currency code, comma, euro, free. Missing: multiple dots edge case. Task 2: covers allow/deny/multi-client/window reset with jest.useFakeTimers. Missing: explicit coverage check step. Task 3: covers bug test, case insensitivity. Missing: whitespace edge case. Task 4: characterization tests first, correct values. Task 5: good coverage but missing page 0 and pageSize 0 tests. |
| Actionability | 5 | Full runnable code for all tasks. Tests and implementations are copy-paste ready. |
| Structure | 4 | Clear Red-Green-Refactor labels on some tasks but not consistently explicit on all. Task 1 lists the cycle steps at end. Tests come before implementation. |
| Efficiency | 4 | Concise, no bloat. Good ratio of signal to noise. |
| Depth | 4 | Good depth on each task. Task 2 uses fake timers correctly. Task 4 notes HALF override behavior. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 4) / 7.5 = (8 + 6 + 5 + 4 + 4 + 4) / 7.5 = 31/7.5 = **4.13**

---

### Condition 2

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Accurate. Task 2 uses real setTimeout instead of fake timers for window reset test (less ideal but functional). Task 3 adds DB-level safety net (good extra). Task 4 correctly identifies HALF override behavior. |
| Completeness | 4 | All 5 tasks covered well. Task 1: good range of tests including GBP, zero price. Missing: null, negative, multiple dots. Task 2: multiple clients, window reset (real timeout). Missing: explicit coverage step. Task 3: case insensitivity, different emails. Missing: whitespace. Task 4: correct characterization tests, negative price, unknown coupon. Task 5: thorough including page 0/negative, pageSize 0, type safety. |
| Actionability | 5 | All code is runnable. Implementation provided for each. |
| Structure | 4 | Explicit RED/GREEN labels. Tests before implementation. Task 5 well-organized by scenario. |
| Efficiency | 4 | Well-structured, good density. |
| Depth | 4 | Task 3 adds unique DB constraint. Task 5 includes type safety tests. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 4) / 7.5 = 31/7.5 = **4.13**

---

### Condition 3

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Very accurate. Explicit error messages, strong typing, comprehensive edge cases. Task 4 correctly identifies HALF override as a design question. |
| Completeness | 5 | Excellent coverage. Task 1: 20 tests including null, undefined, empty, non-string, yen symbol, trailing currency code, very large price. Task 2: construction validation, sliding window test, remaining/reset helpers, 13 tests. Task 3: bug-reproducing test first, case insensitivity, error message test. Task 4: characterization tests lock behavior, premium+SAVE10, vip+SAVE10, HALF override explicitly noted. Task 5: 28 tests, return shape, input validation for page<1 and non-integer pageSize. Coverage table provided. |
| Actionability | 5 | Full runnable code. Coverage reports shown. |
| Structure | 5 | Explicit RED-GREEN-REFACTOR cycle labels on every task. Tests always before implementation. Step 6 coverage report per task. Well-organized by scenario. |
| Efficiency | 4 | Thorough but longer. Good content density. |
| Depth | 5 | Sliding window test in Task 2 is excellent. Task 4 discusses extensibility with CouponStrategy pattern. Task 5 has 28 tests with coverage table. TDD principles summary at end. |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 5) / 7.5 = (10 + 7.5 + 5 + 5 + 4 + 5) / 7.5 = 36.5/7.5 = **4.87**

---

### Condition 4

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Very accurate. Task 1: uses typed error classes (TypeError, SyntaxError, RangeError). Task 2: injectable clock for deterministic testing. Task 4: characterization tests with correct values, explicit bug discovery about HALF. |
| Completeness | 5 | Outstanding. Task 1: 28 tests including negative prices, European decimal format, trailing currency, null/undefined/empty/whitespace-only, very large prices. Task 2: constructor validation, sliding window, injectable clock, clientId type checking, Unicode clientId, reset/remaining helpers. Task 3: bug-reproducing test first, case insensitivity, error message content check. Task 4: characterization + validation tests, negative price throws, unknown userType throws. Task 5: thorough including non-integer pageSize validation. |
| Actionability | 5 | Full runnable code with coverage reports. |
| Structure | 5 | Explicit RED-GREEN-REFACTOR labels. Step numbering (Step 1-6). Tests before implementation. Coverage tables. |
| Efficiency | 4 | Very thorough, somewhat long. |
| Depth | 5 | Injectable clock in Task 2 is best practice. Task 4 coupon strategy pattern. European decimal format handling. |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 5) / 7.5 = 36.5/7.5 = **4.87**

---

### Condition 5

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Accurate overall. Task 1: doesn't throw on empty string (returns 0) — deviates from ground truth edge case expectation. Task 4: uses HALF as additive (vip+HALF=0.50 capped) but the original code sets HALF=0.5 overriding. The refactored builder pattern incorrectly stacks HALF additively. |
| Completeness | 4 | All 5 tasks covered. Task 1: covers core formats but missing null/negative edge cases. Task 2: good tests including cleanup method but uses Date.now mock instead of fake timers — workable. Task 3: covers case insensitivity, whitespace trimming. Task 4: characterization tests present but limited edge cases. Task 5: comprehensive with type safety and reference equality tests. |
| Actionability | 5 | Full runnable code. SQL schema provided for Task 3. |
| Structure | 3 | RED-GREEN-REFACTOR labels present but inconsistent. Task 1 has cycle description at end. Some tasks lack explicit phase labels. |
| Efficiency | 4 | Good density. Task 4 provides two implementations (table + builder). |
| Depth | 4 | Task 3 adds SQL implementation. Task 5 has production edge cases section. |

**Composite**: (4x2 + 4x1.5 + 5 + 3 + 4 + 4) / 7.5 = (8 + 6 + 5 + 3 + 4 + 4) / 7.5 = 30/7.5 = **4.00**

---

### Condition 22

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly accurate. Task 1: returns NaN for unrecognizable (ground truth expects throw or 0). Handles negative prices. Task 4: correctly identifies HALF override, but adds validation tests that change behavior (throws for unknown userType and negative price). |
| Completeness | 4 | Good coverage. Task 1: 9 tests including negative prices, GBP. Missing: comma separator edge cases, multiple dots. Task 2: includes construction validation, sliding window, fake timers. Task 3: bug-reproducing test first, case insensitivity, whitespace. Missing: explicit whitespace test but email normalization covers it. Task 4: characterization tests + validation tests. Notes HALF override explicitly. Task 5: thorough with validation (page<1, pageSize<1, non-integer). |
| Actionability | 5 | Full code provided. |
| Structure | 5 | Very clear RED-GREEN-REFACTOR labels with step numbers. Key TDD lessons sections. |
| Efficiency | 4 | Well-organized. Design notes table for Task 2 rate limiting strategies. |
| Depth | 5 | Task 2 compares sliding window log vs fixed window vs token bucket. Task 4 discusses extensibility. TDD lessons after each task. |

**Composite**: (4x2 + 4x1.5 + 5 + 5 + 4 + 5) / 7.5 = (8 + 6 + 5 + 5 + 4 + 5) / 7.5 = 33/7.5 = **4.40**

---

### Condition 33

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Task 1: returns 0 for empty string and "N/A" (ground truth expects throw or at least 0 is debatable). "free" handling is a special case set, not extensible. European comma-as-decimal and rounding to 2 places are additions not in spec. Task 4: refactored table-based approach is correct but doesn't highlight HALF override as a bug. |
| Completeness | 3 | Task 1: missing null, negative edge cases explicitly. Task 2: good but no fake timers — uses real setTimeout. Missing coverage step. Task 3: covers case insensitivity, whitespace. Task 4: characterization tests present but limited edge case coverage. Task 5: good basic coverage but missing page 0, pageSize 0 edge cases. |
| Actionability | 4 | Code is runnable but Task 2 uses real timeouts (flaky). |
| Structure | 3 | RED/GREEN/REFACTOR labels present but not consistently explicit. Task 1 has separate edge case test addition step (good iterative approach). |
| Efficiency | 3 | Task 4 provides two alternative implementations (table + builder) which adds bulk. Task 5 has many tests but some are redundant. |
| Depth | 3 | Less depth on TDD principles. Task 2 lacks time mocking. No coverage metrics mentioned. |

**Composite**: (3x2 + 3x1.5 + 4 + 3 + 3 + 3) / 7.5 = (6 + 4.5 + 4 + 3 + 3 + 3) / 7.5 = 23.5/7.5 = **3.13**

---

### Condition 44

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Accurate. Task 1: uses NaN for no-digits case. Task 2: uses fake timers correctly. Task 3: proper mock repository, custom DuplicateEmailError. Task 4: correct characterization tests, notes HALF override. |
| Completeness | 4 | Task 1: 12 tests including negative, European format, multiple numbers. Missing: empty string throw (returns NaN). Task 2: good coverage with fake timers, multiple clients, partial windows. Task 3: case insensitivity, whitespace, empty email, thread-safety test (good). Task 4: correct values, case-insensitive coupon handling (addition to spec). Task 5: comprehensive with page size variations. |
| Actionability | 5 | Full runnable code. Mock repository in Task 3 is reusable pattern. |
| Structure | 3 | Inconsistent labeling. Some tasks have RED/GREEN/REFACTOR but not all. Tests come before implementation. |
| Efficiency | 4 | Good density. Task 3 is thorough with mock repository pattern. |
| Depth | 4 | Task 3 thread-safety test. Task 4 case-insensitive coupon handling. Task 5 type preservation test. |

**Composite**: (4x2 + 4x1.5 + 5 + 3 + 4 + 4) / 7.5 = (8 + 6 + 5 + 3 + 4 + 4) / 7.5 = 30/7.5 = **4.00**

---

### Condition 111

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Accurate. Task 1: returns 0 for empty/null (not throwing as some ground truth expects). Task 2: uses fake timers. Task 3: proper TDD flow. Task 4: correct characterization, identifies HALF behavior. |
| Completeness | 4 | Task 1: covers core formats, free, whitespace. Missing: null/negative edge cases with explicit tests. Task 2: good with sliding window, fake timers. Missing coverage step. Task 3: case insensitivity, stores in Set for O(1) lookup (good refactor). Task 4: characterization tests, cap discussion. Task 5: good with page guard tests added in refactor. |
| Actionability | 5 | Full code. All tests runnable. |
| Structure | 5 | Explicit RED-GREEN-REFACTOR headings on every task. Tests before implementation. Refactor step clearly separated. |
| Efficiency | 4 | Clean and well-organized. |
| Depth | 4 | Task 3: Set-based email index optimization. Task 5: RangeError guards added in refactor. |

**Composite**: (4x2 + 4x1.5 + 5 + 5 + 4 + 4) / 7.5 = (8 + 6 + 5 + 5 + 4 + 4) / 7.5 = 32/7.5 = **4.27**

---

### Condition 222

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Task 1: returns 0 for unparseable/empty (not throwing). European comma format — good but different from what ground truth expects. Bug in implementation: `cleaned.replace(/,/g, '')` runs before European format check since commas were already removed. Task 4: characterization tests correct but doesn't call out HALF override as bug/design issue. |
| Completeness | 3 | Task 1: basic formats covered but missing many edge cases. Task 2: sliding window, fake timers, multiple clients. Missing: coverage step. Task 3: case insensitivity, whitespace. Task 4: limited characterization tests. Task 5: basic coverage, missing page 0, pageSize 0 edge cases. |
| Actionability | 4 | Code is runnable. Some implementations have bugs (Task 1 comma handling). |
| Structure | 3 | RED/GREEN/REFACTOR labels present but minimal. Some cycle descriptions are cursory. |
| Efficiency | 3 | Mixed — some tasks concise, others have redundant content. |
| Depth | 3 | Less deep analysis. No coverage metrics. No TDD principle summaries. |

**Composite**: (3x2 + 3x1.5 + 4 + 3 + 3 + 3) / 7.5 = (6 + 4.5 + 4 + 3 + 3 + 3) / 7.5 = 23.5/7.5 = **3.13**

---

### Condition 333

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Task 1: returns 0 for "N/A", "unknown", empty — not throwing. Handles European format and rounds to 2 decimal places — additions beyond spec. Task 2: uses jest.advanceTimersByTime but some tests use real timeouts. Task 4: table-based discount rules approach changes original semantics (HALF as table entry, not additive). |
| Completeness | 3 | Task 1: missing null/negative tests. Task 2: sliding window, multiple clients. Missing: coverage step. Task 3: case insensitivity, whitespace. Task 4: characterization tests present but missing HALF override bug discussion. Task 5: good basic coverage, missing page 0/pageSize 0 edge cases. |
| Actionability | 4 | Code generally runnable. |
| Structure | 3 | RED/GREEN/REFACTOR labels present but not consistently prominent. |
| Efficiency | 3 | Some tasks have duplicate content (Task 5 has "additional utility tests" section). |
| Depth | 3 | Less deep. Task 2 lacks coverage metrics. |

**Composite**: (3x2 + 3x1.5 + 4 + 3 + 3 + 3) / 7.5 = 23.5/7.5 = **3.13**

---

### Condition 444

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Task 1: returns 0 for unparseable (not throwing). European format handling added. Task 2: uses real setTimeout (flaky). Task 4: correct characterization but doesn't highlight HALF override issue. |
| Completeness | 3 | Task 1: covers core but missing many edge cases. Task 2: basic tests, sliding window with real delay (flaky). Missing coverage step. Task 3: case insensitivity but missing whitespace explicitly. Task 4: basic characterization. Task 5: missing page 0, pageSize 0 tests. |
| Actionability | 4 | Code runnable but Task 2 uses real delays. |
| Structure | 3 | RED/GREEN/REFACTOR labels present. Tests before implementation. |
| Efficiency | 3 | Reasonable density. |
| Depth | 3 | Less deep. No coverage metrics. |

**Composite**: (3x2 + 3x1.5 + 4 + 3 + 3 + 3) / 7.5 = 23.5/7.5 = **3.13**

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| 1         | 4         | 4           | 5             | 4         | 4          | 4     | 4.13      |
| 2         | 4         | 4           | 5             | 4         | 4          | 4     | 4.13      |
| 3         | 5         | 5           | 5             | 5         | 4          | 5     | 4.87      |
| 4         | 5         | 5           | 5             | 5         | 4          | 5     | 4.87      |
| 5         | 4         | 4           | 5             | 3         | 4          | 4     | 4.00      |
| 22        | 4         | 4           | 5             | 5         | 4          | 5     | 4.40      |
| 33        | 3         | 3           | 4             | 3         | 3          | 3     | 3.13      |
| 44        | 4         | 4           | 5             | 3         | 4          | 4     | 4.00      |
| 111       | 4         | 4           | 5             | 5         | 4          | 4     | 4.27      |
| 222       | 3         | 3           | 4             | 3         | 3          | 3     | 3.13      |
| 333       | 3         | 3           | 4             | 3         | 3          | 3     | 3.13      |
| 444       | 3         | 3           | 4             | 3         | 3          | 3     | 3.13      |

**Top performers**: Conditions 3 and 4 (4.87) — most thorough TDD coverage with injectable clocks, comprehensive edge cases, coverage reports, and explicit cycle labels.

**Weakest performers**: Conditions 33, 222, 333, 444 (3.13) — less precise edge case handling, inconsistent TDD structure, missing coverage metrics, and some incorrect behavior (returning 0 vs throwing for invalid input).
