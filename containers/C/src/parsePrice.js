/**
 * Parses a price string and returns the numeric value.
 * Supports formats: "$12.99", "USD 1,234.56", "EUR 10", currency symbols, "free".
 * @param {string} input - The price string to parse
 * @returns {number} The numeric price value
 */
function parsePrice(input) {
  if (input === null || input === undefined || typeof input !== 'string') {
    throw new Error('Invalid input');
  }

  const trimmed = input.trim();
  if (trimmed === '') {
    throw new Error('Invalid input');
  }

  if (trimmed.toLowerCase() === 'free') {
    return 0;
  }

  // Detect negative sign
  let isNegative = false;
  let working = trimmed;
  if (working.startsWith('-')) {
    isNegative = true;
    working = working.slice(1);
  }

  // Remove currency symbols and codes
  working = working
    .replace(/^[£€¥₹$]/, '')        // remove leading currency symbols
    .replace(/^[A-Z]{3}\s*/, '')     // remove 3-letter currency codes
    .replace(/,/g, '');              // remove commas

  const value = parseFloat(working);
  if (isNaN(value)) {
    throw new Error('Unable to parse price');
  }

  return isNegative ? -value : value;
}

module.exports = { parsePrice };
