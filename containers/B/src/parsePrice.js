/**
 * Extracts a numeric price from various string formats.
 * @param {string} input - The price string to parse
 * @returns {number} The parsed numeric price
 */
function parsePrice(input) {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new Error('Input must be a non-empty string');
  }

  const trimmed = input.trim();

  if (trimmed.toLowerCase() === 'free') {
    return 0;
  }

  const isNegative = trimmed.startsWith('-');
  const withoutSign = isNegative ? trimmed.slice(1) : trimmed;

  // Remove everything except digits, commas, and dots
  const cleaned = withoutSign.replace(/[^0-9.,]/g, '').replace(/,/g, '');

  if (cleaned === '') {
    throw new Error('Unable to parse price');
  }

  const result = parseFloat(cleaned);

  if (isNaN(result)) {
    throw new Error('Unable to parse price');
  }

  return isNegative ? -result : result;
}

module.exports = { parsePrice };
