const VALID_USER_TYPES = ['regular', 'premium', 'vip'];

const USER_TYPE_DISCOUNTS = {
  regular: 0,
  premium: 0.2,
  vip: 0.3,
};

const COUPON_DISCOUNTS = {
  SAVE10: { type: 'additive', value: 0.1 },
  HALF:   { type: 'override', value: 0.5 },
};

const MAX_DISCOUNT = 0.5;

/**
 * Calculates the discounted price based on user type and coupon code.
 * @param {number} price - The original price (must be >= 0)
 * @param {string} userType - One of 'regular', 'premium', 'vip'
 * @param {string|null} couponCode - Optional coupon code
 * @returns {number} The final price after discount
 */
function calculateDiscount(price, userType, couponCode) {
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    throw new Error('Price must be a non-negative number');
  }

  if (!VALID_USER_TYPES.includes(userType)) {
    throw new Error('Invalid user type');
  }

  let discount = USER_TYPE_DISCOUNTS[userType];

  if (couponCode && COUPON_DISCOUNTS[couponCode]) {
    const coupon = COUPON_DISCOUNTS[couponCode];
    if (coupon.type === 'override') {
      discount = coupon.value;
    } else {
      discount += coupon.value;
    }
  }

  discount = Math.min(discount, MAX_DISCOUNT);

  return price * (1 - discount);
}

module.exports = { calculateDiscount };
