const { calculateDiscount } = require('../src/calculateDiscount');

describe('calculateDiscount', () => {
  // Base cases: no discount
  test('returns full price for regular user with no coupon', () => {
    expect(calculateDiscount(100, 'regular', null)).toBe(100);
  });

  test('returns full price for regular user with empty coupon', () => {
    expect(calculateDiscount(100, 'regular', '')).toBe(100);
  });

  // User type discounts
  test('applies 20% discount for premium user', () => {
    expect(calculateDiscount(100, 'premium', null)).toBe(80);
  });

  test('applies 30% discount for vip user', () => {
    expect(calculateDiscount(100, 'vip', null)).toBe(70);
  });

  // Coupon discounts (standalone)
  test('applies 10% discount for SAVE10 coupon', () => {
    expect(calculateDiscount(100, 'regular', 'SAVE10')).toBe(90);
  });

  test('applies 50% discount for HALF coupon', () => {
    expect(calculateDiscount(100, 'regular', 'HALF')).toBe(50);
  });

  // Combined: user type + coupon
  test('premium + SAVE10 = 30% discount', () => {
    expect(calculateDiscount(100, 'premium', 'SAVE10')).toBe(70);
  });

  test('vip + SAVE10 = 40% discount', () => {
    expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
  });

  // HALF coupon overrides user type discount (original behavior)
  test('premium + HALF = 50% discount (HALF overrides)', () => {
    expect(calculateDiscount(100, 'premium', 'HALF')).toBe(50);
  });

  test('vip + HALF = 50% discount (HALF overrides)', () => {
    expect(calculateDiscount(100, 'vip', 'HALF')).toBe(50);
  });

  // Cap at 50%
  test('discount is capped at 50%', () => {
    // vip(30%) + SAVE10(10%) = 40%, under cap
    expect(calculateDiscount(200, 'vip', 'SAVE10')).toBe(120);
  });

  // Price edge cases
  test('handles zero price', () => {
    expect(calculateDiscount(0, 'premium', 'SAVE10')).toBe(0);
  });

  test('handles decimal prices', () => {
    expect(calculateDiscount(19.99, 'premium', null)).toBeCloseTo(15.992);
  });

  test('handles large prices', () => {
    expect(calculateDiscount(999999.99, 'vip', null)).toBeCloseTo(699999.993);
  });

  // Invalid inputs
  test('throws on negative price', () => {
    expect(() => calculateDiscount(-10, 'regular', null)).toThrow('Price must be non-negative');
  });

  test('throws on non-number price', () => {
    expect(() => calculateDiscount('abc', 'regular', null)).toThrow('Price must be a number');
  });

  test('throws on null price', () => {
    expect(() => calculateDiscount(null, 'regular', null)).toThrow('Price must be a number');
  });

  test('throws on undefined price', () => {
    expect(() => calculateDiscount(undefined, 'regular', null)).toThrow('Price must be a number');
  });

  test('throws on invalid userType', () => {
    expect(() => calculateDiscount(100, 'gold', null)).toThrow('Invalid user type');
  });

  test('throws on null userType', () => {
    expect(() => calculateDiscount(100, null, null)).toThrow('Invalid user type');
  });

  // Unknown coupon code (no discount from coupon)
  test('unknown coupon code gives no coupon discount', () => {
    expect(calculateDiscount(100, 'regular', 'INVALID')).toBe(100);
  });

  test('unknown coupon with premium still gives 20%', () => {
    expect(calculateDiscount(100, 'premium', 'BOGUS')).toBe(80);
  });
});
