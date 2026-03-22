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

/**
 * Calculates the discounted price based on user type and coupon code.
 * Discount is capped at 50%.
 */
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
