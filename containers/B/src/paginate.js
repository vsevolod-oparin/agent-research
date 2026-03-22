/**
 * Paginates an array of items.
 * @template T
 * @param {T[]} items - The full array of items
 * @param {number} page - The page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @returns {{ data: T[], total: number, totalPages: number, hasNext: boolean, hasPrev: boolean }}
 */
function paginate(items, page, pageSize) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  if (!Number.isInteger(page) || page < 1) {
    throw new Error('Page must be a positive integer');
  }
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new Error('Page size must be a positive integer');
  }

  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return {
    data,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

module.exports = { paginate };
