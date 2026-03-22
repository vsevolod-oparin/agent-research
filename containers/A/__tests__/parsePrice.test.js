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
