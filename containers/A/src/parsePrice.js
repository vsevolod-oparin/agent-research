/**
 * Extracts a numeric price from various string formats.
 * Returns NaN for unparseable input, 0 for "free".
 */
function parsePrice(input) {
  if (input == null || typeof input !== 'string') {
    return NaN;
  }

  const trimmed = input.trim();

  if (trimmed === '') {
    return NaN;
  }

  // Check for "free" (case-insensitive, can be part of phrase like "Free Shipping")
  if (/^free\b/i.test(trimmed)) {
    return 0;
  }

  // Remove currency symbols and codes, keep digits, commas, dots, minus
  const cleaned = trimmed
    .replace(/[$$\u00A3\u00A5\u20AC]/g, '') // currency symbols
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
