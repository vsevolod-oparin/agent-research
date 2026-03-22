const { parsePrice } = require('../src/parsePrice');

describe('parsePrice', () => {
  // Basic currency formats
  test('parses dollar amount "$12.99"', () => {
    expect(parsePrice('$12.99')).toBe(12.99);
  });

  test('parses dollar amount with comma "$1,234.56"', () => {
    expect(parsePrice('$1,234.56')).toBe(1234.56);
  });

  test('parses "USD 1,234.56"', () => {
    expect(parsePrice('USD 1,234.56')).toBe(1234.56);
  });

  test('parses euro symbol "€10"', () => {
    expect(parsePrice('€10')).toBe(10);
  });

  test('parses pound symbol "£99.99"', () => {
    expect(parsePrice('£99.99')).toBe(99.99);
  });

  test('parses yen symbol "¥500"', () => {
    expect(parsePrice('¥500')).toBe(500);
  });

  // "free" and zero
  test('parses "free" as 0', () => {
    expect(parsePrice('free')).toBe(0);
  });

  test('parses "FREE" as 0 (case-insensitive)', () => {
    expect(parsePrice('FREE')).toBe(0);
  });

  test('parses "Free" as 0 (case-insensitive)', () => {
    expect(parsePrice('Free')).toBe(0);
  });

  test('parses "$0" as 0', () => {
    expect(parsePrice('$0')).toBe(0);
  });

  test('parses "$0.00" as 0', () => {
    expect(parsePrice('$0.00')).toBe(0);
  });

  // Plain numbers
  test('parses plain number "42.50"', () => {
    expect(parsePrice('42.50')).toBe(42.50);
  });

  test('parses plain integer "100"', () => {
    expect(parsePrice('100')).toBe(100);
  });

  // Large numbers with commas
  test('parses "$1,000,000.00"', () => {
    expect(parsePrice('$1,000,000.00')).toBe(1000000.00);
  });

  // Edge cases: null, undefined, empty
  test('throws on null input', () => {
    expect(() => parsePrice(null)).toThrow('Invalid input');
  });

  test('throws on undefined input', () => {
    expect(() => parsePrice(undefined)).toThrow('Invalid input');
  });

  test('throws on empty string', () => {
    expect(() => parsePrice('')).toThrow('Invalid input');
  });

  test('throws on non-string input', () => {
    expect(() => parsePrice(123)).toThrow('Invalid input');
  });

  // Strings with no parseable price
  test('throws on unparseable string "hello"', () => {
    expect(() => parsePrice('hello')).toThrow('Unable to parse price');
  });

  // Negative prices
  test('parses negative price "-$5.00"', () => {
    expect(parsePrice('-$5.00')).toBe(-5.00);
  });

  // Whitespace handling
  test('trims whitespace "  $9.99  "', () => {
    expect(parsePrice('  $9.99  ')).toBe(9.99);
  });

  // Currency code formats
  test('parses "EUR 25.00"', () => {
    expect(parsePrice('EUR 25.00')).toBe(25.00);
  });

  test('parses "GBP 10.50"', () => {
    expect(parsePrice('GBP 10.50')).toBe(10.50);
  });
});
