const { RateLimiter } = require('../src/rateLimiter');

describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    jest.useFakeTimers();
    limiter = new RateLimiter(3, 1000); // 3 requests per 1000ms
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Basic functionality
  test('allows requests under the limit', () => {
    expect(limiter.allow('client1')).toBe(true);
    expect(limiter.allow('client1')).toBe(true);
    expect(limiter.allow('client1')).toBe(true);
  });

  test('rejects requests over the limit', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    expect(limiter.allow('client1')).toBe(false);
  });

  // Time window reset
  test('allows requests again after time window expires', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    expect(limiter.allow('client1')).toBe(false);

    jest.advanceTimersByTime(1001);

    expect(limiter.allow('client1')).toBe(true);
  });

  // Per-client isolation
  test('tracks clients independently', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    expect(limiter.allow('client1')).toBe(false);

    // Different client should still be allowed
    expect(limiter.allow('client2')).toBe(true);
  });

  // Sliding window behavior
  test('only counts requests within current window', () => {
    limiter.allow('client1'); // t=0
    jest.advanceTimersByTime(500);
    limiter.allow('client1'); // t=500
    jest.advanceTimersByTime(600);
    // t=1100 - first request should have expired
    limiter.allow('client1'); // t=1100
    limiter.allow('client1'); // t=1100
    expect(limiter.allow('client1')).toBe(false); // 3rd in window
  });

  // Edge cases
  test('handles empty clientId', () => {
    expect(limiter.allow('')).toBe(true);
  });

  test('works with limit of 1', () => {
    const strictLimiter = new RateLimiter(1, 1000);
    expect(strictLimiter.allow('c')).toBe(true);
    expect(strictLimiter.allow('c')).toBe(false);
  });

  test('constructor requires positive maxRequests', () => {
    expect(() => new RateLimiter(0, 1000)).toThrow();
    expect(() => new RateLimiter(-1, 1000)).toThrow();
  });

  test('constructor requires positive windowMs', () => {
    expect(() => new RateLimiter(5, 0)).toThrow();
    expect(() => new RateLimiter(5, -100)).toThrow();
  });

  // Concurrent clients at scale
  test('handles many clients without interference', () => {
    for (let i = 0; i < 100; i++) {
      expect(limiter.allow(`client-${i}`)).toBe(true);
    }
  });

  // Partial window expiry
  test('correctly expires old timestamps in sliding window', () => {
    limiter.allow('c'); // t=0
    jest.advanceTimersByTime(400);
    limiter.allow('c'); // t=400
    jest.advanceTimersByTime(400);
    limiter.allow('c'); // t=800
    expect(limiter.allow('c')).toBe(false); // t=800, 3 in window

    jest.advanceTimersByTime(300);
    // t=1100: request at t=0 expired, but t=400 and t=800 still in window
    expect(limiter.allow('c')).toBe(true); // 2 in window + this = 3
    expect(limiter.allow('c')).toBe(false); // would be 4
  });
});
