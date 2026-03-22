const { paginate } = require('../src/paginate');

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Basic pagination
  test('returns first page correctly', () => {
    const result = paginate(items, 1, 3);
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.total).toBe(10);
    expect(result.totalPages).toBe(4);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
  });

  test('returns middle page correctly', () => {
    const result = paginate(items, 2, 3);
    expect(result.data).toEqual([4, 5, 6]);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(true);
  });

  test('returns last page with partial results', () => {
    const result = paginate(items, 4, 3);
    expect(result.data).toEqual([10]);
    expect(result.totalPages).toBe(4);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  test('returns last full page correctly', () => {
    const result = paginate(items, 2, 5);
    expect(result.data).toEqual([6, 7, 8, 9, 10]);
    expect(result.totalPages).toBe(2);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  // Exact fit
  test('handles items that fit exactly in pages', () => {
    const result = paginate([1, 2, 3, 4], 2, 2);
    expect(result.data).toEqual([3, 4]);
    expect(result.totalPages).toBe(2);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  // Single item
  test('handles single item', () => {
    const result = paginate([42], 1, 10);
    expect(result.data).toEqual([42]);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  // Empty array
  test('handles empty array', () => {
    const result = paginate([], 1, 10);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  // Page beyond total pages
  test('returns empty data for page beyond total', () => {
    const result = paginate(items, 100, 5);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(10);
    expect(result.totalPages).toBe(2);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  // Page size equals total items
  test('all items on one page', () => {
    const result = paginate(items, 1, 10);
    expect(result.data).toEqual(items);
    expect(result.totalPages).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  // Page size larger than total items
  test('page size larger than total items', () => {
    const result = paginate(items, 1, 100);
    expect(result.data).toEqual(items);
    expect(result.totalPages).toBe(1);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  // Invalid inputs
  test('throws on page < 1', () => {
    expect(() => paginate(items, 0, 5)).toThrow('Page must be >= 1');
  });

  test('throws on negative page', () => {
    expect(() => paginate(items, -1, 5)).toThrow('Page must be >= 1');
  });

  test('throws on pageSize < 1', () => {
    expect(() => paginate(items, 1, 0)).toThrow('Page size must be >= 1');
  });

  test('throws on negative pageSize', () => {
    expect(() => paginate(items, 1, -5)).toThrow('Page size must be >= 1');
  });

  test('throws on non-array items', () => {
    expect(() => paginate('not array', 1, 5)).toThrow('Items must be an array');
  });

  test('throws on null items', () => {
    expect(() => paginate(null, 1, 5)).toThrow('Items must be an array');
  });

  // Generic types
  test('works with string arrays', () => {
    const result = paginate(['a', 'b', 'c', 'd'], 1, 2);
    expect(result.data).toEqual(['a', 'b']);
  });

  test('works with object arrays', () => {
    const objs = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = paginate(objs, 2, 2);
    expect(result.data).toEqual([{ id: 3 }]);
  });

  // Large dataset
  test('handles large dataset efficiently', () => {
    const large = Array.from({ length: 10000 }, (_, i) => i);
    const result = paginate(large, 500, 20);
    expect(result.data).toHaveLength(20);
    expect(result.data[0]).toBe(9980);
    expect(result.total).toBe(10000);
    expect(result.totalPages).toBe(500);
  });

  // Does not mutate original array
  test('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    paginate(original, 1, 2);
    expect(original).toEqual(copy);
  });

  // Non-integer page/pageSize
  test('throws on non-integer page', () => {
    expect(() => paginate(items, 1.5, 5)).toThrow('Page must be an integer');
  });

  test('throws on non-integer pageSize', () => {
    expect(() => paginate(items, 1, 2.5)).toThrow('Page size must be an integer');
  });
});
