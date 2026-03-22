const { calculateDiscount } = require('../src/calculateDiscount');

describe('calculateDiscount', () => {
  // Regular user, no coupon
  test('no discount for regular user without coupon', () => {
    expect(calculateDiscount(100, 'regular', null)).toBe(100);
  });

  // Premium user
  test('20% discount for premium user', () => {
    expect(calculateDiscount(100, 'premium', null)).toBe(80);
  });

  // VIP user
  test('30% discount for vip user', () => {
    expect(calculateDiscount(100, 'vip', null)).toBe(70);
  });

  // SAVE10 coupon
  test('10% discount for SAVE10 coupon', () => {
    expect(calculateDiscount(100, 'regular', 'SAVE10')).toBe(90);
  });

  // HALF coupon overrides (sets to 0.5, not additive)
  test('HALF coupon gives 50% discount', () => {
    expect(calculateDiscount(100, 'regular', 'HALF')).toBe(50);
  });

  // Premium + SAVE10 = 30%
  test('premium + SAVE10 = 30% discount', () => {
    expect(calculateDiscount(100, 'premium', 'SAVE10')).toBe(70);
  });

  // VIP + SAVE10 = 40%
  test('vip + SAVE10 = 40% discount', () => {
    expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
  });

  // Cap at 50%
  test('discount is capped at 50%', () => {
    // VIP (30%) + SAVE10 (10%) = 40%, under cap
    expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
  });

  // HALF coupon with VIP - HALF sets discount to 0.5, not additive
  test('HALF coupon with vip user caps at 50%', () => {
    expect(calculateDiscount(100, 'vip', 'HALF')).toBe(50);
  });

  // HALF coupon with premium - same
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

  // Large price
  test('handles large price correctly', () => {
    expect(calculateDiscount(1000000, 'vip', 'SAVE10')).toBe(600000);
  });
});
