/**
 * Paginates an array of items.
 * Returns { data, total, totalPages, hasNext, hasPrev }
 */
function paginate(items, page, pageSize) {
  const total = items.length;
  const effectivePageSize = Math.max(1, pageSize);
  const totalPages = total === 0 ? 0 : Math.ceil(total / effectivePageSize);
  const effectivePage = Math.max(1, page);

  const startIndex = (effectivePage - 1) * effectivePageSize;
  const data = items.slice(startIndex, startIndex + effectivePageSize);

  return {
    data,
    total,
    totalPages,
    hasNext: effectivePage < totalPages,
    hasPrev: effectivePage > 1,
  };
}

module.exports = { paginate };
