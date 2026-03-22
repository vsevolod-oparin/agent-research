# Agent Evaluation: tdd-guide

**Date:** 2026-03-22
**Agent:** tdd-guide
**Tasks:** tdd-001, tdd-004
**Scoring:** Precision x2, Completeness x1.5, others x1. Composite = sum / 7.5

---

## Task tdd-001: Implement `parsePrice(input: string): number` using TDD

### BARE Response

Here's how to implement `parsePrice`:

**Step 1: Write the function.** Parse the input string, strip currency symbols and commas, handle the "free" keyword, and convert to a number.

```javascript
function parsePrice(input) {
  if (!input || typeof input !== 'string') return NaN;
  const trimmed = input.trim().toLowerCase();
  if (trimmed === 'free') return 0;
  const cleaned = trimmed.replace(/[^0-9.\-]/g, '');
  if (!cleaned || cleaned === '.') return NaN;
  return parseFloat(cleaned);
}
```

**Step 2: Now write tests to verify it works.**

```javascript
test('parses dollar sign prices', () => {
  expect(parsePrice('$12.99')).toBe(12.99);
});
test('parses currency code prefix', () => {
  expect(parsePrice('USD 1,234.56')).toBe(1234.56);
});
test('parses euro symbol', () => {
  expect(parsePrice('€10')).toBe(10);
});
test('returns 0 for free', () => {
  expect(parsePrice('free')).toBe(0);
});
test('returns NaN for empty string', () => {
  expect(parsePrice('')).toBeNaN();
});
test('returns NaN for null', () => {
  expect(parsePrice(null)).toBeNaN();
});
```

This covers the main cases. You could add tests for negative prices and multiple decimal points. The function handles comma-separated thousands by stripping non-numeric characters except dots and minus signs.

---

### V1 Response

## TDD Plan: parsePrice

### RED -- Write Failing Tests First

```javascript
describe('parsePrice', () => {
  // Happy path
  it('parses "$12.99" to 12.99', () => {
    expect(parsePrice('$12.99')).toBe(12.99);
  });
  it('parses "USD 1,234.56" to 1234.56', () => {
    expect(parsePrice('USD 1,234.56')).toBe(1234.56);
  });
  it('parses "€10" to 10', () => {
    expect(parsePrice('€10')).toBe(10);
  });
  it('returns 0 for "free"', () => {
    expect(parsePrice('free')).toBe(0);
  });

  // Edge cases
  it('returns NaN for empty string', () => {
    expect(parsePrice('')).toBeNaN();
  });
  it('returns NaN for null', () => {
    expect(parsePrice(null)).toBeNaN();
  });
  it('handles negative prices', () => {
    expect(parsePrice('-$5.00')).toBe(-5);
  });
  it('returns NaN for multiple dots "1.2.3"', () => {
    expect(parsePrice('1.2.3')).toBeNaN();
  });
  it('returns NaN for no digits "$$"', () => {
    expect(parsePrice('$$')).toBeNaN();
  });
});
```

Run tests: all FAIL (function does not exist yet).

### GREEN -- Minimal Implementation

```javascript
function parsePrice(input) {
  if (!input || typeof input !== 'string') return NaN;
  if (input.trim().toLowerCase() === 'free') return 0;
  const cleaned = input.replace(/[^0-9.\-]/g, '');
  if (!cleaned || (cleaned.match(/\./g) || []).length > 1) return NaN;
  const result = parseFloat(cleaned);
  return isNaN(result) ? NaN : result;
}
```

Run tests: all PASS.

### REFACTOR

Extract currency stripping into a helper. Verify tests remain green. Run `npm run test:coverage` -- target 80%+.

---

### V2 Response

## TDD Plan: parsePrice

### Tests to Write (in order)
1. Dollar sign format `$12.99` -- basic currency parsing
2. Currency code format `USD 1,234.56` -- code prefix + comma separator
3. Euro symbol `€10` -- non-dollar currency
4. "free" keyword -- special case returning 0
5. Empty string / null / undefined -- invalid input handling
6. Negative price `-$5.00` -- sign handling
7. Multiple dots `$1.2.3` -- malformed number rejection
8. No digits `$$` -- no extractable value
9. Whitespace-only input `"   "` -- edge trimming

### RED -- Failing Tests First

```javascript
describe('parsePrice', () => {
  // Core behavior
  it('extracts price from "$12.99"', () => expect(parsePrice('$12.99')).toBe(12.99));
  it('handles currency code "USD 1,234.56"', () => expect(parsePrice('USD 1,234.56')).toBe(1234.56));
  it('handles euro "€10"', () => expect(parsePrice('€10')).toBe(10));
  it('returns 0 for "free"', () => expect(parsePrice('free')).toBe(0));

  // Edge cases
  it('NaN for empty string', () => expect(parsePrice('')).toBeNaN());
  it('NaN for null', () => expect(parsePrice(null)).toBeNaN());
  it('handles negative "-$5"', () => expect(parsePrice('-$5')).toBe(-5));
  it('NaN for multiple dots', () => expect(parsePrice('1.2.3')).toBeNaN());
  it('NaN for no digits', () => expect(parsePrice('$$')).toBeNaN());
  it('NaN for whitespace only', () => expect(parsePrice('   ')).toBeNaN());
});
```

Run: all fail (no implementation).

### GREEN -- Minimal Implementation

```javascript
function parsePrice(input) {
  if (!input || typeof input !== 'string' || !input.trim()) return NaN;
  if (input.trim().toLowerCase() === 'free') return 0;
  const cleaned = input.replace(/[^0-9.\-]/g, '');
  if (!cleaned || (cleaned.match(/\./g) || []).length > 1) return NaN;
  return parseFloat(cleaned);
}
```

### REFACTOR

Extract `stripCurrency()` helper. Add `test.each` for parameterized cases. Run coverage: target 80%+ lines/branches/functions.

### Coverage Target
- Lines: 80%+ | Branches: 80%+ | Functions: 80%+

### Test Type Breakdown
- Unit: 10 tests

---

### tdd-001 Scoring

| Dimension | BARE | V1 | V2 |
|-----------|------|----|----|
| Completeness | 3 | 4 | 5 |
| Precision | 2 | 4 | 4 |
| Actionability | 3 | 4 | 5 |
| Structure | 2 | 4 | 5 |
| Efficiency | 4 | 4 | 4 |
| Depth | 2 | 3 | 4 |

**Composite Scores (Precision x2 + Completeness x1.5 + others x1) / 7.5:**

- **BARE:** (2x2 + 3x1.5 + 3+2+4+2) / 7.5 = (4 + 4.5 + 11) / 7.5 = **2.60**
- **V1:** (4x2 + 4x1.5 + 4+4+4+3) / 7.5 = (8 + 6 + 15) / 7.5 = **3.87**
- **V2:** (4x2 + 5x1.5 + 5+5+4+4) / 7.5 = (8 + 7.5 + 18) / 7.5 = **4.47**

**LIFT: V1 = +1.27 | V2 = +1.87**

---

## Task tdd-004: Refactor `calculateDiscount` using TDD

### BARE Response

The `calculateDiscount` function has some issues worth cleaning up. The main concern is that `HALF` coupon overwrites the user-type discount rather than stacking -- this may be a bug or intentional.

**Refactored version:**

```javascript
const USER_DISCOUNTS = { premium: 0.2, vip: 0.3 };
const COUPON_DISCOUNTS = { SAVE10: 0.1, HALF: 0.5 };
const MAX_DISCOUNT = 0.5;

function calculateDiscount(price, userType, couponCode) {
  const userDiscount = USER_DISCOUNTS[userType] || 0;
  const couponDiscount = COUPON_DISCOUNTS[couponCode] || 0;
  // HALF replaces user discount (original behavior preserved)
  const totalDiscount = couponCode === 'HALF'
    ? couponDiscount
    : userDiscount + couponDiscount;
  return price * (1 - Math.min(totalDiscount, MAX_DISCOUNT));
}
```

You should add some tests to make sure the refactoring is correct:

```javascript
test('premium user gets 20% off', () => {
  expect(calculateDiscount(100, 'premium', null)).toBe(80);
});
test('vip with SAVE10 gets 40% off', () => {
  expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
});
test('discount capped at 50%', () => {
  expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
});
```

Note the `HALF` coupon behavior -- it sets discount to 0.5 regardless of user type, overwriting any premium/vip discount. Consider whether this is intended.

---

### V1 Response

## TDD Plan: calculateDiscount Refactor

### RED -- Write Failing Tests First

Before touching the implementation, write tests that lock in the current behavior:

```javascript
describe('calculateDiscount', () => {
  // Core cases
  it('returns full price for regular user, no coupon', () => {
    expect(calculateDiscount(100, 'regular', null)).toBe(100);
  });
  it('gives premium 20% off', () => {
    expect(calculateDiscount(100, 'premium', null)).toBe(80);
  });
  it('gives vip 30% off', () => {
    expect(calculateDiscount(100, 'vip', null)).toBe(70);
  });
  it('SAVE10 adds 10% to premium (total 30%)', () => {
    expect(calculateDiscount(100, 'premium', 'SAVE10')).toBe(70);
  });
  it('SAVE10 adds 10% to vip (total 40%)', () => {
    expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
  });
  it('HALF sets discount to 50% regardless of user type', () => {
    expect(calculateDiscount(100, 'premium', 'HALF')).toBe(50);
  });
  it('caps total discount at 50%', () => {
    expect(calculateDiscount(100, 'vip', 'HALF')).toBe(50);
  });

  // Edge cases
  it('handles unknown userType', () => {
    expect(calculateDiscount(100, 'unknown', null)).toBe(100);
  });
  it('handles unknown coupon', () => {
    expect(calculateDiscount(100, 'premium', 'INVALID')).toBe(80);
  });
  it('handles negative price', () => {
    expect(calculateDiscount(-100, 'premium', null)).toBe(-80);
  });
});
```

Run tests against the EXISTING implementation -- all should PASS.

### GREEN -- Tests Already Pass

The current implementation is the GREEN baseline. All tests pass against existing code.

### REFACTOR -- Now Safe to Change

```javascript
const USER_DISCOUNTS = { premium: 0.2, vip: 0.3 };
const COUPON_DISCOUNTS = { SAVE10: 0.1, HALF: 0.5 };

function calculateDiscount(price, userType, couponCode) {
  let discount = USER_DISCOUNTS[userType] || 0;
  if (couponCode === 'HALF') {
    discount = COUPON_DISCOUNTS[couponCode];
  } else if (COUPON_DISCOUNTS[couponCode]) {
    discount += COUPON_DISCOUNTS[couponCode];
  }
  return price * (1 - Math.min(discount, 0.5));
}
```

Run tests: all pass. The refactor is safe.

**Note:** The `HALF` coupon overwrites user-type discounts. This might be a bug -- `premium + HALF` gives 50% not 70%. Flag for product team review.

---

### V2 Response

## TDD Plan: calculateDiscount Refactor

### Phase 1: Characterization Tests (Capture Current Behavior)

Before ANY refactoring, write tests that document exactly what the existing code does. These tests are the safety net.

```javascript
describe('calculateDiscount -- characterization tests', () => {
  // Baseline: document current behavior exactly
  it('regular user, no coupon = full price', () => {
    expect(calculateDiscount(100, 'regular', null)).toBe(100);
  });
  it('premium, no coupon = 20% off', () => {
    expect(calculateDiscount(100, 'premium', null)).toBe(80);
  });
  it('vip, no coupon = 30% off', () => {
    expect(calculateDiscount(100, 'vip', null)).toBe(70);
  });
  it('premium + SAVE10 = 30% off', () => {
    expect(calculateDiscount(100, 'premium', 'SAVE10')).toBe(70);
  });
  it('vip + SAVE10 = 40% off', () => {
    expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
  });

  // BUG? HALF overwrites user discount instead of stacking
  it('premium + HALF = 50% off (HALF overwrites premium discount)', () => {
    expect(calculateDiscount(100, 'premium', 'HALF')).toBe(50);
  });
  it('vip + HALF = 50% off (cap applies, but HALF already overwrote vip)', () => {
    expect(calculateDiscount(100, 'vip', 'HALF')).toBe(50);
  });

  // Edge cases
  it('unknown userType treated as no discount', () => {
    expect(calculateDiscount(100, 'gold', null)).toBe(100);
  });
  it('unknown coupon ignored', () => {
    expect(calculateDiscount(100, 'premium', 'BOGUS')).toBe(80);
  });
  it('negative price applies discount in reverse', () => {
    expect(calculateDiscount(-100, 'vip', null)).toBe(-70);
  });
  it('zero price always returns 0', () => {
    expect(calculateDiscount(0, 'vip', 'SAVE10')).toBe(0);
  });
});
```

Run against existing code: **all must PASS**. If any fail, the characterization is wrong -- fix the test, not the code.

### Phase 2: Bug Discovery

Mark intentional vs. suspicious behavior:
- `HALF` overwrites `premium`/`vip` discount (line 5: `discount = 0.5` not `discount += 0.5`). If `vip + HALF` intended to be `0.3 + 0.5 = 0.5` (capped), the result is the same. But `premium + HALF` gives `0.5` not `0.7` (capped to `0.5`). **Flag for product review:** is `HALF` meant to replace or stack?

### Phase 3: Refactor (Tests Green = Safe)

```javascript
const USER_DISCOUNTS = { premium: 0.2, vip: 0.3 };
const MAX_DISCOUNT = 0.5;

function calculateDiscount(price, userType, couponCode) {
  let discount = USER_DISCOUNTS[userType] ?? 0;
  if (couponCode === 'SAVE10') discount += 0.1;
  if (couponCode === 'HALF') discount = 0.5; // preserves overwrite behavior
  return price * (1 - Math.min(discount, MAX_DISCOUNT));
}
```

Run all characterization tests: **must stay green**. Coverage target: 80%+ branches/lines/functions.

### Phase 4: Fix Bugs Separately

If product confirms HALF should stack: update characterization test, then change `discount = 0.5` to `discount += 0.5`.

---

### tdd-004 Scoring

| Dimension | BARE | V1 | V2 |
|-----------|------|----|----|
| Completeness | 2 | 4 | 5 |
| Precision | 1 | 3 | 5 |
| Actionability | 3 | 4 | 5 |
| Structure | 2 | 4 | 5 |
| Efficiency | 3 | 4 | 4 |
| Depth | 2 | 3 | 5 |

**Composite Scores:**

- **BARE:** (1x2 + 2x1.5 + 3+2+3+2) / 7.5 = (2 + 3 + 10) / 7.5 = **2.00**
- **V1:** (3x2 + 4x1.5 + 4+4+4+3) / 7.5 = (6 + 6 + 15) / 7.5 = **3.60**
- **V2:** (5x2 + 5x1.5 + 5+5+4+5) / 7.5 = (10 + 7.5 + 19) / 7.5 = **4.87**

**LIFT: V1 = +1.60 | V2 = +2.87**

---

## Summary

| Task | BARE | V1 | V2 | LIFT(V1) | LIFT(V2) | V2-V1 |
|------|------|----|----|----------|----------|-------|
| tdd-001 | 2.60 | 3.87 | 4.47 | +1.27 | +1.87 | +0.60 |
| tdd-004 | 2.00 | 3.60 | 4.87 | +1.60 | +2.87 | +1.27 |
| **Average** | **2.30** | **3.73** | **4.67** | **+1.43** | **+2.37** | **+0.93** |

## Key Differentiator Analysis

### tdd-004 is the decisive test

**BARE** commits the cardinal TDD sin: it refactors first, then adds tests as an afterthought. The response restructures the code into `USER_DISCOUNTS` and `COUPON_DISCOUNTS` maps before any test exists. Tests are tacked on at the end with "you should add some tests." This directly violates the task requirement and risks introducing regressions without a safety net.

**V1** correctly writes tests before refactoring (Red-Green-Refactor is in the agent instructions). However, it frames the tests as generic "failing tests first" rather than explicitly calling them characterization tests. The workflow is correct but the mental model is slightly off -- the tests aren't meant to fail (RED), they're meant to capture existing behavior (all should PASS immediately). V1 partially recognizes this ("GREEN -- Tests Already Pass") but the framing is awkward because the standard Red-Green-Refactor cycle doesn't cleanly map to the characterization test pattern.

**V2** nails it. The Characterization Test Workflow section in the v2 agent provides explicit instructions for this exact scenario: "Write tests that capture current behavior -- even if the behavior seems wrong, lock it in." The response:
1. Labels Phase 1 explicitly as "Characterization Tests"
2. Expects all tests to PASS against existing code (not fail)
3. Uses `// BUG?` comments to mark suspicious behavior without changing it
4. Separates bug discovery (Phase 2) from refactoring (Phase 3) from bug fixing (Phase 4)
5. States the rule: "If any fail, the characterization is wrong -- fix the test, not the code"

This phased approach (characterize -> discover -> refactor -> fix separately) is exactly what the ground truth demands and what distinguishes expert TDD practice from mechanical Red-Green-Refactor application.

### V2 advantages over V1

1. **Trigger Conditions** -- V2 knows WHEN to use TDD vs. characterization tests vs. other approaches
2. **Characterization Test Workflow** -- explicit 5-step process for refactoring untested code
3. **Test Smell Checklist** -- richer diagnostic capability
4. **Anti-pattern depth** -- 10 anti-patterns with explanations vs. 4 bullet points
5. **Output Format** -- structured template produces more consistent responses
6. **Test Type Decision Guide** -- clearer guidance on unit vs. integration vs. E2E selection
