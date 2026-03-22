const { RateLimiter } = require('../src/rateLimiter');

describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    jest.useFakeTimers();
    limiter = new RateLimiter({ maxRequests: 3, windowMs: 1000 });
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

  test('blocks requests over the limit', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    expect(limiter.allow('client1')).toBe(false);
  });

  test('tracks clients independently', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    // client1 exhausted, client2 still has quota
    expect(limiter.allow('client1')).toBe(false);
    expect(limiter.allow('client2')).toBe(true);
  });

  // Window expiry
  test('resets after time window passes', () => {
    limiter.allow('client1');
    limiter.allow('client1');
    limiter.allow('client1');
    expect(limiter.allow('client1')).toBe(false);

    // Advance time past the window
    jest.advanceTimersByTime(1001);

    expect(limiter.allow('client1')).toBe(true);
  });

  test('sliding window: old requests expire individually', () => {
    limiter.allow('client1'); // t=0
    jest.advanceTimersByTime(400);
    limiter.allow('client1'); // t=400
    jest.advanceTimersByTime(400);
    limiter.allow('client1'); // t=800
    expect(limiter.allow('client1')).toBe(false); // t=800, 3 in window

    jest.advanceTimersByTime(201); // t=1001, first request expires
    expect(limiter.allow('client1')).toBe(true);
  });

  // Edge cases
  test('throws if maxRequests is 0 or negative', () => {
    expect(() => new RateLimiter({ maxRequests: 0, windowMs: 1000 })).toThrow();
    expect(() => new RateLimiter({ maxRequests: -1, windowMs: 1000 })).toThrow();
  });

  test('throws if windowMs is 0 or negative', () => {
    expect(() => new RateLimiter({ maxRequests: 5, windowMs: 0 })).toThrow();
    expect(() => new RateLimiter({ maxRequests: 5, windowMs: -100 })).toThrow();
  });

  test('handles empty clientId', () => {
    expect(() => limiter.allow('')).toThrow();
  });

  test('handles null/undefined clientId', () => {
    expect(() => limiter.allow(null)).toThrow();
    expect(() => limiter.allow(undefined)).toThrow();
  });

  // Concurrent clients
  test('handles many clients without interference', () => {
    for (let i = 0; i < 100; i++) {
      expect(limiter.allow(`client${i}`)).toBe(true);
    }
  });

  // Exact boundary
  test('allows exactly maxRequests and no more', () => {
    const precise = new RateLimiter({ maxRequests: 1, windowMs: 500 });
    expect(precise.allow('a')).toBe(true);
    expect(precise.allow('a')).toBe(false);
    jest.advanceTimersByTime(501);
    expect(precise.allow('a')).toBe(true);
    expect(precise.allow('a')).toBe(false);
  });

  // Large burst
  test('blocks burst of requests beyond limit', () => {
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(limiter.allow('burst'));
    }
    expect(results.filter(r => r === true).length).toBe(3);
    expect(results.filter(r => r === false).length).toBe(7);
  });
});
