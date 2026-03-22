/**
 * Sliding window rate limiter.
 * Tracks individual request timestamps per client and expires them
 * as they fall outside the window.
 */
class RateLimiter {
  /**
   * @param {number} maxRequests - Maximum requests allowed per window
   * @param {number} windowMs - Time window in milliseconds
   */
  constructor(maxRequests, windowMs) {
    if (!Number.isInteger(maxRequests) || maxRequests < 1) {
      throw new Error('maxRequests must be a positive integer');
    }
    if (typeof windowMs !== 'number' || windowMs <= 0) {
      throw new Error('windowMs must be a positive number');
    }
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.clients = new Map();
  }

  /**
   * Check if a request from the given client is allowed.
   * @param {string} clientId - The client identifier
   * @returns {boolean} true if allowed, false if rate limited
   */
  allow(clientId) {
    if (typeof clientId !== 'string' || clientId.length === 0) {
      throw new Error('clientId must be a non-empty string');
    }

    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, []);
    }

    const timestamps = this.clients.get(clientId);

    // Remove expired timestamps
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
