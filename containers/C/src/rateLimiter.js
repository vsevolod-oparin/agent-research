/**
 * Sliding window rate limiter.
 * Tracks individual request timestamps per client and expires old ones.
 */
class RateLimiter {
  /**
   * @param {Object} options
   * @param {number} options.maxRequests - Maximum requests allowed per window
   * @param {number} options.windowMs - Time window in milliseconds
   */
  constructor({ maxRequests, windowMs }) {
    if (!maxRequests || maxRequests <= 0) {
      throw new Error('maxRequests must be a positive integer');
    }
    if (!windowMs || windowMs <= 0) {
      throw new Error('windowMs must be a positive number');
    }
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    /** @type {Map<string, number[]>} */
    this.clients = new Map();
  }

  /**
   * Check if a request from the given client should be allowed.
   * @param {string} clientId
   * @returns {boolean}
   */
  allow(clientId) {
    if (!clientId || typeof clientId !== 'string') {
      throw new Error('clientId must be a non-empty string');
    }

    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, []);
    }

    const timestamps = this.clients.get(clientId);

    // Remove expired timestamps (sliding window)
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
