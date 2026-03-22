const { paginate } = require('../src/paginate');

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Basic pagination
  test('returns first page correctly', () => {
    const result = paginate(items, 1, 3);
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.total).toBe(10);
    expect(result.totalPages).toBe(4); // ceil(10/3)
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
  });

  test('returns middle page correctly', () => {
    const result = paginate(items, 2, 3);
    expect(result.data).toEqual([4, 5, 6]);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(true);
  });

  test('returns last page with remaining items', () => {
    const result = paginate(items, 4, 3);
    expect(result.data).toEqual([10]);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  // Exact fit
  test('handles exact page fit', () => {
    const result = paginate(items, 2, 5);
    expect(result.data).toEqual([6, 7, 8, 9, 10]);
    expect(result.totalPages).toBe(2);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  // Single page
  test('all items fit on one page', () => {
    const result = paginate(items, 1, 20);
    expect(result.data).toEqual(items);
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

  // Out of bounds page
  test('returns empty data for page beyond total', () => {
    const result = paginate(items, 100, 3);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(10);
    expect(result.totalPages).toBe(4);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  // Page 0 or negative
  test('treats page < 1 as page 1', () => {
    const result = paginate(items, 0, 3);
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.hasPrev).toBe(false);
  });

  test('treats negative page as page 1', () => {
    const result = paginate(items, -5, 3);
    expect(result.data).toEqual([1, 2, 3]);
  });

  // Invalid pageSize
  test('treats pageSize < 1 as pageSize 1', () => {
    const result = paginate(items, 1, 0);
    expect(result.data).toEqual([1]);
    expect(result.totalPages).toBe(10);
  });

  // Generic types
  test('works with string arrays', () => {
    const result = paginate(['a', 'b', 'c', 'd'], 2, 2);
    expect(result.data).toEqual(['c', 'd']);
    expect(result.total).toBe(4);
  });

  test('works with object arrays', () => {
    const objs = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = paginate(objs, 1, 2);
    expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.hasNext).toBe(true);
  });

  // pageSize of 1
  test('pageSize of 1 gives one item per page', () => {
    const result = paginate(items, 5, 1);
    expect(result.data).toEqual([5]);
    expect(result.totalPages).toBe(10);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(true);
  });

  // Large dataset
  test('handles large arrays', () => {
    const large = Array.from({ length: 10000 }, (_, i) => i);
    const result = paginate(large, 100, 100);
    expect(result.data.length).toBe(100);
    expect(result.data[0]).toBe(9900);
    expect(result.total).toBe(10000);
    expect(result.totalPages).toBe(100);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  // Does not mutate input
  test('does not mutate the original array', () => {
    const original = [1, 2, 3];
    paginate(original, 1, 2);
    expect(original).toEqual([1, 2, 3]);
  });
});
