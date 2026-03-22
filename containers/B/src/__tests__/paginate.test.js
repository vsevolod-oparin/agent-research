const { paginate } = require('../paginate');

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Basic pagination
  test('returns first page correctly', () => {
    const result = paginate(items, 1, 3);
    expect(result).toEqual({
      data: [1, 2, 3],
      total: 10,
      totalPages: 4,
      hasNext: true,
      hasPrev: false,
    });
  });

  test('returns middle page correctly', () => {
    const result = paginate(items, 2, 3);
    expect(result).toEqual({
      data: [4, 5, 6],
      total: 10,
      totalPages: 4,
      hasNext: true,
      hasPrev: true,
    });
  });

  test('returns last page with partial items', () => {
    const result = paginate(items, 4, 3);
    expect(result).toEqual({
      data: [10],
      total: 10,
      totalPages: 4,
      hasNext: false,
      hasPrev: true,
    });
  });

  test('returns full last page when items divide evenly', () => {
    const result = paginate(items, 2, 5);
    expect(result).toEqual({
      data: [6, 7, 8, 9, 10],
      total: 10,
      totalPages: 2,
      hasNext: false,
      hasPrev: true,
    });
  });

  // Empty array
  test('handles empty array', () => {
    const result = paginate([], 1, 5);
    expect(result).toEqual({
      data: [],
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });
  });

  // Single item
  test('handles single item array', () => {
    const result = paginate(['only'], 1, 10);
    expect(result).toEqual({
      data: ['only'],
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  // Page beyond range
  test('returns empty data for page beyond total pages', () => {
    const result = paginate(items, 100, 5);
    expect(result).toEqual({
      data: [],
      total: 10,
      totalPages: 2,
      hasNext: false,
      hasPrev: true,
    });
  });

  // Input validation
  test('throws on non-array items', () => {
    expect(() => paginate('not array', 1, 5)).toThrow('Items must be an array');
    expect(() => paginate(null, 1, 5)).toThrow('Items must be an array');
  });

  test('throws on page < 1', () => {
    expect(() => paginate(items, 0, 5)).toThrow('Page must be a positive integer');
    expect(() => paginate(items, -1, 5)).toThrow('Page must be a positive integer');
  });

  test('throws on non-integer page', () => {
    expect(() => paginate(items, 1.5, 5)).toThrow('Page must be a positive integer');
  });

  test('throws on pageSize < 1', () => {
    expect(() => paginate(items, 1, 0)).toThrow('Page size must be a positive integer');
    expect(() => paginate(items, 1, -5)).toThrow('Page size must be a positive integer');
  });

  test('throws on non-integer pageSize', () => {
    expect(() => paginate(items, 1, 2.5)).toThrow('Page size must be a positive integer');
  });

  // Generic type support
  test('works with objects', () => {
    const objs = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = paginate(objs, 1, 2);
    expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.hasNext).toBe(true);
  });

  test('works with strings', () => {
    const result = paginate(['a', 'b', 'c', 'd'], 2, 2);
    expect(result.data).toEqual(['c', 'd']);
  });

  // Large dataset
  test('handles large arrays efficiently', () => {
    const large = Array.from({ length: 10000 }, (_, i) => i);
    const result = paginate(large, 500, 20);
    expect(result.data.length).toBe(20);
    expect(result.data[0]).toBe(9980);
    expect(result.total).toBe(10000);
    expect(result.totalPages).toBe(500);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  // pageSize equals total items
  test('single page when pageSize >= total items', () => {
    const result = paginate(items, 1, 100);
    expect(result).toEqual({
      data: items,
      total: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  // pageSize of 1
  test('works with pageSize of 1', () => {
    const result = paginate(items, 5, 1);
    expect(result).toEqual({
      data: [5],
      total: 10,
      totalPages: 10,
      hasNext: true,
      hasPrev: true,
    });
  });
});
