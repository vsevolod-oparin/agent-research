const { calculateDiscount } = require('../calculateDiscount');

describe('calculateDiscount', () => {
  // Characterization tests (capture existing behavior before refactor)
  describe('user type discounts', () => {
    test('no discount for regular user without coupon', () => {
      expect(calculateDiscount(100, 'regular', null)).toBe(100);
    });

    test('20% discount for premium user', () => {
      expect(calculateDiscount(100, 'premium', null)).toBe(80);
    });

    test('30% discount for vip user', () => {
      expect(calculateDiscount(100, 'vip', null)).toBe(70);
    });
  });

  describe('coupon code discounts', () => {
    test('SAVE10 adds 10% discount for regular user', () => {
      expect(calculateDiscount(100, 'regular', 'SAVE10')).toBe(90);
    });

    test('HALF gives 50% discount (replaces user discount)', () => {
      expect(calculateDiscount(100, 'regular', 'HALF')).toBe(50);
    });
  });

  describe('combined discounts', () => {
    test('premium + SAVE10 = 30% total', () => {
      expect(calculateDiscount(100, 'premium', 'SAVE10')).toBe(70);
    });

    test('vip + SAVE10 = 40% total', () => {
      expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60);
    });

    test('premium + HALF = 50% (HALF replaces)', () => {
      expect(calculateDiscount(100, 'premium', 'HALF')).toBe(50);
    });

    test('vip + HALF = 50% (HALF replaces)', () => {
      expect(calculateDiscount(100, 'vip', 'HALF')).toBe(50);
    });
  });

  describe('max discount cap at 50%', () => {
    test('discount never exceeds 50%', () => {
      // Even if somehow the math adds up to more, cap applies
      expect(calculateDiscount(100, 'vip', 'SAVE10')).toBe(60); // 40% < 50%
      expect(calculateDiscount(200, 'vip', 'HALF')).toBe(100);  // 50% capped
    });
  });

  // Input validation (new safety checks from refactor)
  describe('input validation', () => {
    test('throws on negative price', () => {
      expect(() => calculateDiscount(-10, 'regular', null)).toThrow('Price must be a non-negative number');
    });

    test('throws on non-numeric price', () => {
      expect(() => calculateDiscount('abc', 'regular', null)).toThrow('Price must be a non-negative number');
    });

    test('throws on null price', () => {
      expect(() => calculateDiscount(null, 'regular', null)).toThrow('Price must be a non-negative number');
    });

    test('throws on undefined price', () => {
      expect(() => calculateDiscount(undefined, 'regular', null)).toThrow('Price must be a non-negative number');
    });

    test('throws on invalid userType', () => {
      expect(() => calculateDiscount(100, 'hacker', null)).toThrow('Invalid user type');
    });

    test('throws on empty string userType', () => {
      expect(() => calculateDiscount(100, '', null)).toThrow('Invalid user type');
    });
  });

  // Edge cases
  describe('edge cases', () => {
    test('price of 0 returns 0 regardless of discounts', () => {
      expect(calculateDiscount(0, 'vip', 'HALF')).toBe(0);
    });

    test('unknown coupon code is ignored (no extra discount)', () => {
      expect(calculateDiscount(100, 'regular', 'INVALID')).toBe(100);
    });

    test('null coupon is treated as no coupon', () => {
      expect(calculateDiscount(100, 'premium', null)).toBe(80);
    });

    test('undefined coupon is treated as no coupon', () => {
      expect(calculateDiscount(100, 'premium', undefined)).toBe(80);
    });

    test('works with decimal prices', () => {
      expect(calculateDiscount(99.99, 'premium', null)).toBeCloseTo(79.992, 2);
    });

    test('very large price', () => {
      expect(calculateDiscount(1000000, 'vip', 'HALF')).toBe(500000);
    });
  });
});
