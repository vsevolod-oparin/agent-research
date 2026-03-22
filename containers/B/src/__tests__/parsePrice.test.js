const { parsePrice } = require('../parsePrice');

describe('parsePrice', () => {
  // Basic currency formats
  test('parses dollar amount like "$12.99"', () => {
    expect(parsePrice('$12.99')).toBe(12.99);
  });

  test('parses USD prefix like "USD 1,234.56"', () => {
    expect(parsePrice('USD 1,234.56')).toBe(1234.56);
  });

  test('parses euro symbol like "€10"', () => {
    expect(parsePrice('€10')).toBe(10);
  });

  test('parses "free" as 0', () => {
    expect(parsePrice('free')).toBe(0);
  });

  test('parses "FREE" case-insensitively as 0', () => {
    expect(parsePrice('FREE')).toBe(0);
  });

  // Edge cases: null/undefined/empty
  test('throws on null input', () => {
    expect(() => parsePrice(null)).toThrow('Input must be a non-empty string');
  });

  test('throws on undefined input', () => {
    expect(() => parsePrice(undefined)).toThrow('Input must be a non-empty string');
  });

  test('throws on empty string', () => {
    expect(() => parsePrice('')).toThrow('Input must be a non-empty string');
  });

  test('throws on non-string input', () => {
    expect(() => parsePrice(123)).toThrow('Input must be a non-empty string');
  });

  // More formats
  test('parses plain number "42.50"', () => {
    expect(parsePrice('42.50')).toBe(42.50);
  });

  test('parses GBP prefix "GBP 99.99"', () => {
    expect(parsePrice('GBP 99.99')).toBe(99.99);
  });

  test('parses pound symbol "£50"', () => {
    expect(parsePrice('£50')).toBe(50);
  });

  test('parses yen symbol "¥1000"', () => {
    expect(parsePrice('¥1000')).toBe(1000);
  });

  test('parses large number with multiple commas "$1,234,567.89"', () => {
    expect(parsePrice('$1,234,567.89')).toBe(1234567.89);
  });

  // Boundary values
  test('parses "$0" as 0', () => {
    expect(parsePrice('$0')).toBe(0);
  });

  test('parses "$0.00" as 0', () => {
    expect(parsePrice('$0.00')).toBe(0);
  });

  test('throws on string with no numeric value and not "free"', () => {
    expect(() => parsePrice('abc')).toThrow('Unable to parse price');
  });

  test('throws on whitespace-only string', () => {
    expect(() => parsePrice('   ')).toThrow('Input must be a non-empty string');
  });

  // Special characters
  test('handles surrounding whitespace "$12.99 "', () => {
    expect(parsePrice('  $12.99  ')).toBe(12.99);
  });

  test('parses negative price "-$5.00"', () => {
    expect(parsePrice('-$5.00')).toBe(-5.00);
  });
});
