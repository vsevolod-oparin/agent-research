/**
 * Sliding window rate limiter.
 * Allows max N requests per time window per client.
 */
class RateLimiter {
  constructor(maxRequests, windowMs) {
    if (maxRequests <= 0) {
      throw new Error('maxRequests must be positive');
    }
    if (windowMs <= 0) {
      throw new Error('windowMs must be positive');
    }
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.clients = new Map();
  }

  allow(clientId) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, []);
    }

    const timestamps = this.clients.get(clientId);

    // Remove timestamps outside the current window
    while (timestamps.length > 0 && timestamps[0] <= windowStart) {
      timestamps.shift();
    }

    if (timestamps.length >= this.maxRequests) {
      return false;
    }

    timestamps.push(now);
    return true;
  }
}

module.exports = { RateLimiter };
