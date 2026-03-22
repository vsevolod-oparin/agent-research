# Tasks

## Task 1

Implement a function `parsePrice(input: string): number` that extracts
a numeric price from strings like "$12.99", "USD 1,234.56", "€10", "free".
Use TDD approach.

## Task 2

Implement a rate limiter class that allows max N requests per
time window. API: `limiter.allow(clientId): boolean`.
Use TDD approach.

## Task 3

There's a bug: users can register with duplicate email addresses.
The `registerUser` function doesn't check for existing emails.
Fix using TDD.

## Task 4

Refactor this function using TDD to ensure safety:
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

## Task 5

Write tests for a pagination utility: `paginate(items: T[], page: number, pageSize: number)`.
Should return `{ data: T[], total: number, totalPages: number, hasNext: boolean, hasPrev: boolean }`.
