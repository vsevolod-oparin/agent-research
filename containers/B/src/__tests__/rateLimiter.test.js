const { RateLimiter } = require('../rateLimiter');

describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Constructor validation
  test('throws if maxRequests is not a positive integer', () => {
    expect(() => new RateLimiter(0, 1000)).toThrow();
    expect(() => new RateLimiter(-1, 1000)).toThrow();
    expect(() => new RateLimiter(1.5, 1000)).toThrow();
    expect(() => new RateLimiter(null, 1000)).toThrow();
  });

  test('throws if windowMs is not a positive number', () => {
    expect(() => new RateLimiter(5, 0)).toThrow();
    expect(() => new RateLimiter(5, -100)).toThrow();
    expect(() => new RateLimiter(5, null)).toThrow();
  });

  // Basic functionality
  test('allows requests up to the limit', () => {
    limiter = new RateLimiter(3, 1000);
    expect(limiter.allow('user1')).toBe(true);
    expect(limiter.allow('user1')).toBe(true);
    expect(limiter.allow('user1')).toBe(true);
  });

  test('denies requests over the limit', () => {
    limiter = new RateLimiter(2, 1000);
    expect(limiter.allow('user1')).toBe(true);
    expect(limiter.allow('user1')).toBe(true);
    expect(limiter.allow('user1')).toBe(false);
  });

  test('tracks clients independently', () => {
    limiter = new RateLimiter(1, 1000);
    expect(limiter.allow('user1')).toBe(true);
    expect(limiter.allow('user2')).toBe(true);
    expect(limiter.allow('user1')).toBe(false);
    expect(limiter.allow('user2')).toBe(false);
  });

  // Time window behavior
  test('resets after time window expires', () => {
    limiter = new RateLimiter(2, 1000);
    expect(limiter.allow('user1')).toBe(true);
    expect(limiter.allow('user1')).toBe(true);
    expect(limiter.allow('user1')).toBe(false);

    jest.advanceTimersByTime(1001);

    expect(limiter.allow('user1')).toBe(true);
  });

  test('sliding window: old requests expire individually', () => {
    limiter = new RateLimiter(2, 1000);

    expect(limiter.allow('user1')).toBe(true);   // t=0
    jest.advanceTimersByTime(500);
    expect(limiter.allow('user1')).toBe(true);   // t=500
    expect(limiter.allow('user1')).toBe(false);  // t=500, at limit

    jest.advanceTimersByTime(501);                // t=1001, first request expired
    expect(limiter.allow('user1')).toBe(true);   // allowed again
  });

  // Edge: invalid clientId
  test('throws on empty or non-string clientId', () => {
    limiter = new RateLimiter(5, 1000);
    expect(() => limiter.allow('')).toThrow();
    expect(() => limiter.allow(null)).toThrow();
    expect(() => limiter.allow(undefined)).toThrow();
    expect(() => limiter.allow(123)).toThrow();
  });

  // Special characters in client ID
  test('handles special characters in clientId', () => {
    limiter = new RateLimiter(2, 1000);
    expect(limiter.allow('user@example.com')).toBe(true);
    expect(limiter.allow('user@example.com')).toBe(true);
    expect(limiter.allow('user@example.com')).toBe(false);
  });

  // Boundary: exactly at limit = 1
  test('works with limit of 1', () => {
    limiter = new RateLimiter(1, 500);
    expect(limiter.allow('x')).toBe(true);
    expect(limiter.allow('x')).toBe(false);
    jest.advanceTimersByTime(501);
    expect(limiter.allow('x')).toBe(true);
  });

  // Large number of clients
  test('handles many distinct clients', () => {
    limiter = new RateLimiter(1, 1000);
    for (let i = 0; i < 1000; i++) {
      expect(limiter.allow(`client-${i}`)).toBe(true);
    }
  });
});
