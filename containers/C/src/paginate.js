/**
 * Paginates an array of items.
 *
 * @template T
 * @param {T[]} items - The full array to paginate
 * @param {number} page - The page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @returns {{ data: T[], total: number, totalPages: number, hasNext: boolean, hasPrev: boolean }}
 */
function paginate(items, page, pageSize) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  if (typeof page !== 'number' || !Number.isInteger(page)) {
    throw new Error('Page must be an integer');
  }
  if (typeof pageSize !== 'number' || !Number.isInteger(pageSize)) {
    throw new Error('Page size must be an integer');
  }
  if (page < 1) {
    throw new Error('Page must be >= 1');
  }
  if (pageSize < 1) {
    throw new Error('Page size must be >= 1');
  }

  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = items.slice(start, end);

  return {
    data,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

module.exports = { paginate };
