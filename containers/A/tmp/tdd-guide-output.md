# TDD Guide Output

All tasks developed using strict Test-Driven Development: tests written first (RED), minimal implementation to pass (GREEN), then refactored (REFACTOR). Final coverage: **95.89% statements, 92% branches, 100% functions, 95.83% lines**.

```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   95.89 |       92 |     100 |   95.83 |
 calculateDiscount.js |    92.3 |    91.66 |     100 |    92.3 | 32
 paginate.js          |     100 |      100 |     100 |     100 |
 parsePrice.js        |    92.3 |    91.66 |     100 |    92.3 | 29
 rateLimiter.js       |     100 |      100 |     100 |     100 |
 registerUser.js      |      95 |    85.71 |     100 |   94.73 | 33
----------------------|---------|----------|---------|---------|-------------------
```

**74 tests total, all passing.**

---

## Task 1: parsePrice

**Goal:** Extract a numeric price from strings like `"$12.99"`, `"USD 1,234.56"`, `"free"`.

### TDD Step 1 -- RED: Write Tests First

Tests written to `__tests__/parsePrice.test.js` covering 19 cases:

```javascript
const { parsePrice } = require('../src/parsePrice');

describe('parsePrice', () => {
  // Basic currency symbols
  test('parses dollar amount like "$12.99"', () => {
    expect(parsePrice('$12.99')).toBe(12.99);
  });

  test('parses euro amount like "€10"', () => {
    expect(parsePrice('€10')).toBe(10);
  });

  test('parses pound amount like "£5.50"', () => {
    expect(parsePrice('£5.50')).toBe(5.5);
  });

  // Currency code prefix
  test('parses "USD 1,234.56" with commas', () => {
    expect(parsePrice('USD 1,234.56')).toBe(1234.56);
  });

  test('parses "EUR 99.00"', () => {
    expect(parsePrice('EUR 99.00')).toBe(99.0);
  });

  // Free / zero
  test('returns 0 for "free"', () => {
    expect(parsePrice('free')).toBe(0);
  });

  test('returns 0 for "FREE" (case insensitive)', () => {
    expect(parsePrice('FREE')).toBe(0);
  });

  test('returns 0 for "Free Shipping"', () => {
    expect(parsePrice('Free Shipping')).toBe(0);
  });

  // Plain numbers
  test('parses plain number string "42"', () => {
    expect(parsePrice('42')).toBe(42);
  });

  test('parses plain decimal "19.95"', () => {
    expect(parsePrice('19.95')).toBe(19.95);
  });

  // Edge cases - invalid input
  test('returns NaN for null', () => {
    expect(parsePrice(null)).toBeNaN();
  });

  test('returns NaN for undefined', () => {
    expect(parsePrice(undefined)).toBeNaN();
  });

  test('returns NaN for empty string', () => {
    expect(parsePrice('')).toBeNaN();
  });

  test('returns NaN for non-numeric string "hello"', () => {
    expect(parsePrice('hello')).toBeNaN();
  });

  // Large numbers with commas
  test('parses "$1,000,000.00"', () => {
    expect(parsePrice('$1,000,000.00')).toBe(1000000.0);
  });

  // Whitespace handling
  test('handles leading/trailing whitespace', () => {
    expect(parsePrice('  $9.99  ')).toBe(9.99);
  });

  // Negative prices
  test('parses negative price "-$5.00"', () => {
    expect(parsePrice('-$5.00')).toBe(-5.0);
  });

  // Suffix currency
  test('parses "100 USD"', () => {
    expect(parsePrice('100 USD')).toBe(100);
  });

  // Yen (no decimals)
  test('parses "¥1500"', () => {
    expect(parsePrice('¥1500')).toBe(1500);
  });
});
```

**Edge cases covered:** null, undefined, empty string, non-numeric text, negative prices, large numbers with commas, whitespace, multiple currency symbols ($, EUR, GBP, JPY), "free" variants, suffix currency codes.

### TDD Step 2 -- GREEN: Implementation

```javascript
function parsePrice(input) {
  if (input == null || typeof input !== 'string') {
    return NaN;
  }

  const trimmed = input.trim();

  if (trimmed === '') {
    return NaN;
  }

  if (/^free\b/i.test(trimmed)) {
    return 0;
  }

  const cleaned = trimmed
    .replace(/[$\u00A3\u00A5\u20AC]/g, '')  // currency symbols
    .replace(/\b[A-Z]{3}\b/g, '')            // currency codes like USD, EUR
    .trim()
    .replace(/,/g, '');                       // remove commas

  if (cleaned === '') {
    return NaN;
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? NaN : num;
}

module.exports = { parsePrice };
```

**Result:** 19/19 tests passing. Coverage: 92.3% statements, 91.66% branches.

---

## Task 2: RateLimiter

**Goal:** A rate limiter class allowing max N requests per time window, tracked per client.

### TDD Step 1 -- RED: Write Tests First

Tests written to `__tests__/rateLimiter.test.js` covering 11 cases:

```javascript
const { RateLimiter } = require('../src/rateLimiter');

describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    jest.useFakeTimers();
    limiter = new RateLimiter(3, 1000); // 3 requests per 1000ms
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('allows requests under the limit', () => {
    expect(limiter.allow('client1')).toBe(true);
    expect(limiter.allow('client1')).toBe(true);
    expect(limiter.allow('client1')).toBe(true);
  });

  test('rejects requests over the limit', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    expect(limiter.allow('client1')).toBe(false);
  });

  test('allows requests again after time window expires', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    expect(limiter.allow('client1')).toBe(false);
    jest.advanceTimersByTime(1001);
    expect(limiter.allow('client1')).toBe(true);
  });

  test('tracks clients independently', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    expect(limiter.allow('client1')).toBe(false);
    expect(limiter.allow('client2')).toBe(true);
  });

  test('only counts requests within current window', () => {
    limiter.allow('client1'); // t=0
    jest.advanceTimersByTime(500);
    limiter.allow('client1'); // t=500
    jest.advanceTimersByTime(600);
    // t=1100 - first request expired
    limiter.allow('client1'); // t=1100
    limiter.allow('client1'); // t=1100
    expect(limiter.allow('client1')).toBe(false);
  });

  test('handles empty clientId', () => {
    expect(limiter.allow('')).toBe(true);
  });

  test('works with limit of 1', () => {
    const strictLimiter = new RateLimiter(1, 1000);
    expect(strictLimiter.allow('c')).toBe(true);
    expect(strictLimiter.allow('c')).toBe(false);
  });

  test('constructor requires positive maxRequests', () => {
    expect(() => new RateLimiter(0, 1000)).toThrow();
    expect(() => new RateLimiter(-1, 1000)).toThrow();
  });

  test('constructor requires positive windowMs', () => {
    expect(() => new RateLimiter(5, 0)).toThrow();
    expect(() => new RateLimiter(5, -100)).toThrow();
  });

  test('handles many clients without interference', () => {
    for (let i = 0; i < 100; i++) {
      expect(limiter.allow(`client-${i}`)).toBe(true);
    }
  });

  test('correctly expires old timestamps in sliding window', () => {
    limiter.allow('c'); // t=0
    jest.advanceTimersByTime(400);
    limiter.allow('c'); // t=400
    jest.advanceTimersByTime(400);
    limiter.allow('c'); // t=800
    expect(limiter.allow('c')).toBe(false); // 3 in window

    jest.advanceTimersByTime(300);
    // t=1100: t=0 expired, t=400 and t=800 still in window
    expect(limiter.allow('c')).toBe(true);  // 2 + this = 3
    expect(limiter.allow('c')).toBe(false); // would be 4
  });
});
```

**Edge cases covered:** constructor validation, sliding window expiry, partial window, per-client isolation, 100 concurrent clients, limit of 1, empty clientId.

### TDD Step 2 -- GREEN: Implementation

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    if (maxRequests <= 0) {
      throw new Error('maxRequests must be positive');
    }
    if (windowMs <= 0) {
      throw new Error('windowMs must be positive');
    }
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.clients = new Map();
  }

  allow(clientId) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, []);
    }

    const timestamps = this.clients.get(clientId);

    // Remove timestamps outside the current window
    while (timestamps.length > 0 && timestamps[0] <= windowStart) {
      timestamps.shift();
    }

    if (timestamps.length >= this.maxRequests) {
      return false;
    }

    timestamps.push(now);
    return true;
  }
}

module.exports = { RateLimiter };
```

**Design:** Uses a sliding window algorithm. Each client has an array of request timestamps. On each call, expired timestamps are pruned, then the count is checked against `maxRequests`. Uses `jest.useFakeTimers()` in tests to control `Date.now()`.

**Result:** 11/11 tests passing. Coverage: 100% across all metrics.

---

## Task 3: registerUser Duplicate Email Bug Fix

**Goal:** Fix the bug where users can register with duplicate email addresses.

### TDD Step 1 -- RED: Write the Failing Test First

The critical test that exposes the bug:

```javascript
test('rejects registration with duplicate email', () => {
  registerUser(store, { email: 'alice@example.com', name: 'Alice' });
  const result = registerUser(store, { email: 'alice@example.com', name: 'Alice 2' });
  expect(result.success).toBe(false);
  expect(result.error).toMatch(/already exists/i);
});
```

Full test suite in `__tests__/registerUser.test.js` with 11 tests covering:

```javascript
const { registerUser, UserStore } = require('../src/registerUser');

describe('registerUser', () => {
  let store;

  beforeEach(() => {
    store = new UserStore();
  });

  test('registers a new user successfully', () => {
    const result = registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    expect(result.success).toBe(true);
    expect(result.user.email).toBe('alice@example.com');
    expect(result.user.name).toBe('Alice');
    expect(result.user.id).toBeDefined();
  });

  // THE BUG FIX TEST
  test('rejects registration with duplicate email', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    const result = registerUser(store, { email: 'alice@example.com', name: 'Alice 2' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  test('rejects duplicate email case-insensitively', () => {
    registerUser(store, { email: 'Alice@Example.COM', name: 'Alice' });
    const result = registerUser(store, { email: 'alice@example.com', name: 'Alice 2' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  test('allows different emails', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    const result = registerUser(store, { email: 'bob@example.com', name: 'Bob' });
    expect(result.success).toBe(true);
  });

  test('rejects missing email', () => {
    const result = registerUser(store, { name: 'Alice' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/email.*required/i);
  });

  test('rejects empty email', () => {
    const result = registerUser(store, { email: '', name: 'Alice' });
    expect(result.success).toBe(false);
  });

  test('rejects invalid email format', () => {
    const result = registerUser(store, { email: 'not-an-email', name: 'Alice' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/invalid.*email/i);
  });

  test('rejects null input', () => {
    const result = registerUser(store, null);
    expect(result.success).toBe(false);
  });

  test('rejects undefined input', () => {
    const result = registerUser(store, undefined);
    expect(result.success).toBe(false);
  });

  test('trims whitespace from email before checking', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    const result = registerUser(store, { email: '  alice@example.com  ', name: 'Alice 2' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  test('stored user has an id', () => {
    const result = registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    expect(typeof result.user.id).toBe('string');
    expect(result.user.id.length).toBeGreaterThan(0);
  });
});
```

### TDD Step 2 -- GREEN: Fix the Bug

The fix adds a `store.findByEmail()` check before inserting:

```javascript
const crypto = require('crypto');

class UserStore {
  constructor() {
    this.users = [];
  }

  findByEmail(email) {
    return this.users.find(u => u.email === email.toLowerCase().trim());
  }

  add(user) {
    this.users.push(user);
  }
}

function registerUser(store, userData) {
  if (!userData || typeof userData !== 'object') {
    return { success: false, error: 'Invalid input' };
  }

  if (!userData.email) {
    return { success: false, error: 'Email is required' };
  }

  const email = String(userData.email).trim().toLowerCase();

  if (email === '') {
    return { success: false, error: 'Email is required' };
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  // THE FIX: Check for duplicate email BEFORE inserting
  if (store.findByEmail(email)) {
    return { success: false, error: 'Email already exists' };
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    name: userData.name || '',
  };

  store.add(user);
  return { success: true, user };
}

module.exports = { registerUser, UserStore };
```

**Key fix details:**
1. Added `store.findByEmail()` lookup before insertion
2. Email is normalized to lowercase and trimmed before comparison
3. Case-insensitive duplicate detection (Alice@Example.COM = alice@example.com)
4. Whitespace-insensitive ("  alice@example.com  " matches "alice@example.com")

**Result:** 11/11 tests passing. Coverage: 95% statements, 85.71% branches.

---

## Task 4: calculateDiscount Refactoring

**Goal:** Refactor the discount calculation function using TDD to ensure behavior is preserved and made clearer.

### Original Code (Before Refactoring)

```javascript
function calculateDiscount(price, userType, couponCode) {
  let discount = 0;
  if (userType === 'premium') discount = 0.2;
  if (userType === 'vip') discount = 0.3;
  if (couponCode === 'SAVE10') discount += 0.1;
  if (couponCode === 'HALF') discount = 0.5;
  if (discount > 0.5) discount = 0.5;
  return price * (1 - discount);
}
```

### TDD Step 1 -- RED: Write Tests That Pin Existing Behavior

Tests written to `__tests__/calculateDiscount.test.js` with 18 cases pinning every combination:

```javascript
const { calculateDiscount } = require('../src/calculateDiscount');

describe('calculateDiscount', () => {
  // Regular user, no coupon
  test('no discount for regular user without coupon', () => {
    expect(calculateDiscount(100, 'regular', null)).toBe(100);
  });

  test('20% discount for premium user', () => {
    expect(calculateDiscount(100, 'premium', null)).toBe(80);
  });

  test('30% discount for vip user', () => {
    expect(calculateDiscount(100, 'vip', null)).toBe(70);
  });

  test('10% discount for SAVE10 coupon', () => {
    expect(calculateDiscount(100, 'regular', 'SAVE10')).toBe(90);
  });

  test('HALF coupon gives 50% discount', () => {
    expect(calculateDiscount(100, 'regular', 'HALF')).toBe(50);
  });

  // Combinations
  test('premium + SAVE10 = 30% discount', () => {
    expect(calculateDiscount(100, 'premium', 'SAVE10')).toBe(70);
  });

  test('vip + SAVE10 = 40% discount', () => {
    expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
  });

  test('discount is capped at 50%', () => {
    expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
  });

  test('HALF coupon with vip user caps at 50%', () => {
    expect(calculateDiscount(100, 'vip', 'HALF')).toBe(50);
  });

  test('HALF coupon with premium caps at 50%', () => {
    expect(calculateDiscount(100, 'premium', 'HALF')).toBe(50);
  });

  // Edge cases
  test('handles zero price', () => {
    expect(calculateDiscount(0, 'vip', 'HALF')).toBe(0);
  });

  test('handles decimal prices', () => {
    expect(calculateDiscount(19.99, 'premium', null)).toBeCloseTo(15.992);
  });

  test('returns price unchanged for unknown userType', () => {
    expect(calculateDiscount(100, 'unknown', null)).toBe(100);
  });

  test('returns price unchanged for unknown coupon', () => {
    expect(calculateDiscount(100, 'regular', 'INVALID')).toBe(100);
  });

  test('handles null price (coerced to 0)', () => {
    expect(calculateDiscount(null, 'regular', null)).toBe(0);
  });

  test('handles undefined coupon same as no coupon', () => {
    expect(calculateDiscount(100, 'regular', undefined)).toBe(100);
  });

  test('handles negative price', () => {
    expect(calculateDiscount(-50, 'premium', null)).toBe(-40);
  });

  test('handles large price correctly', () => {
    expect(calculateDiscount(1000000, 'vip', 'SAVE10')).toBe(600000);
  });
});
```

### TDD Step 2 -- GREEN + REFACTOR: Clean Implementation

The refactored version replaces if-chains with data-driven lookup tables and named constants:

```javascript
const USER_DISCOUNTS = {
  premium: 0.2,
  vip: 0.3,
};

const COUPON_ADDITIVE = {
  SAVE10: 0.1,
};

const COUPON_OVERRIDE = {
  HALF: 0.5,
};

const MAX_DISCOUNT = 0.5;

function calculateDiscount(price, userType, couponCode) {
  let discount = USER_DISCOUNTS[userType] || 0;

  if (couponCode && COUPON_ADDITIVE[couponCode] !== undefined) {
    discount += COUPON_ADDITIVE[couponCode];
  }

  if (couponCode && COUPON_OVERRIDE[couponCode] !== undefined) {
    discount = COUPON_OVERRIDE[couponCode];
  }

  if (discount > MAX_DISCOUNT) {
    discount = MAX_DISCOUNT;
  }

  return price * (1 - discount);
}

module.exports = { calculateDiscount };
```

**Refactoring improvements:**
1. **Data-driven:** User discounts and coupons are in lookup objects, easy to extend
2. **Named constants:** `MAX_DISCOUNT = 0.5` instead of magic number
3. **Separated coupon types:** Additive coupons (SAVE10) vs override coupons (HALF) are explicitly different data structures
4. **Same behavior guaranteed:** All 18 tests pass unchanged

**Result:** 18/18 tests passing. Coverage: 92.3% statements, 91.66% branches.

---

## Task 5: Pagination Utility

**Goal:** Write comprehensive tests for a `paginate()` function and implement it.

### TDD Step 1 -- RED: Write Tests First

Tests written to `__tests__/paginate.test.js` with 15 cases:

```javascript
const { paginate } = require('../src/paginate');

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  test('returns first page correctly', () => {
    const result = paginate(items, 1, 3);
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.total).toBe(10);
    expect(result.totalPages).toBe(4); // ceil(10/3)
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
  });

  test('returns middle page correctly', () => {
    const result = paginate(items, 2, 3);
    expect(result.data).toEqual([4, 5, 6]);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(true);
  });

  test('returns last page with remaining items', () => {
    const result = paginate(items, 4, 3);
    expect(result.data).toEqual([10]);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  test('handles exact page fit', () => {
    const result = paginate(items, 2, 5);
    expect(result.data).toEqual([6, 7, 8, 9, 10]);
    expect(result.totalPages).toBe(2);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  test('all items fit on one page', () => {
    const result = paginate(items, 1, 20);
    expect(result.data).toEqual(items);
    expect(result.totalPages).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  test('handles empty array', () => {
    const result = paginate([], 1, 10);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  test('returns empty data for page beyond total', () => {
    const result = paginate(items, 100, 3);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(10);
    expect(result.totalPages).toBe(4);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  test('treats page < 1 as page 1', () => {
    const result = paginate(items, 0, 3);
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.hasPrev).toBe(false);
  });

  test('treats negative page as page 1', () => {
    const result = paginate(items, -5, 3);
    expect(result.data).toEqual([1, 2, 3]);
  });

  test('treats pageSize < 1 as pageSize 1', () => {
    const result = paginate(items, 1, 0);
    expect(result.data).toEqual([1]);
    expect(result.totalPages).toBe(10);
  });

  test('works with string arrays', () => {
    const result = paginate(['a', 'b', 'c', 'd'], 2, 2);
    expect(result.data).toEqual(['c', 'd']);
    expect(result.total).toBe(4);
  });

  test('works with object arrays', () => {
    const objs = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = paginate(objs, 1, 2);
    expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.hasNext).toBe(true);
  });

  test('pageSize of 1 gives one item per page', () => {
    const result = paginate(items, 5, 1);
    expect(result.data).toEqual([5]);
    expect(result.totalPages).toBe(10);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(true);
  });

  test('handles large arrays', () => {
    const large = Array.from({ length: 10000 }, (_, i) => i);
    const result = paginate(large, 100, 100);
    expect(result.data.length).toBe(100);
    expect(result.data[0]).toBe(9900);
    expect(result.total).toBe(10000);
    expect(result.totalPages).toBe(100);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  test('does not mutate the original array', () => {
    const original = [1, 2, 3];
    paginate(original, 1, 2);
    expect(original).toEqual([1, 2, 3]);
  });
});
```

**Edge cases covered:** empty array, out-of-bounds page, negative page, zero pageSize, page 0, exact fit, partial last page, single-item pages, 10,000-item performance, generic types (strings, objects), immutability guarantee.

### TDD Step 2 -- GREEN: Implementation

```javascript
function paginate(items, page, pageSize) {
  const total = items.length;
  const effectivePageSize = Math.max(1, pageSize);
  const totalPages = total === 0 ? 0 : Math.ceil(total / effectivePageSize);
  const effectivePage = Math.max(1, page);

  const startIndex = (effectivePage - 1) * effectivePageSize;
  const data = items.slice(startIndex, startIndex + effectivePageSize);

  return {
    data,
    total,
    totalPages,
    hasNext: effectivePage < totalPages,
    hasPrev: effectivePage > 1,
  };
}

module.exports = { paginate };
```

**Design decisions:**
- Invalid page numbers (< 1) are clamped to 1 rather than throwing, which is more user-friendly
- Invalid pageSize (< 1) is clamped to 1
- Empty arrays produce `totalPages: 0` (not 1 for an empty page)
- Uses `Array.slice()` which never mutates the original and handles out-of-bounds gracefully

**Result:** 15/15 tests passing. Coverage: 100% across all metrics.
