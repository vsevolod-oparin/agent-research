const crypto = require('crypto');

/**
 * Simple in-memory user store.
 */
class UserStore {
  constructor() {
    this.users = [];
  }

  findByEmail(email) {
    const normalized = email.trim().toLowerCase();
    return this.users.find(u => u.email === normalized);
  }

  add(user) {
    this.users.push(user);
  }

  count() {
    return this.users.length;
  }
}

/**
 * Registers a new user after validating input and checking for duplicate emails.
 * @param {UserStore} store
 * @param {Object} userData
 * @returns {Object} The created user (without password)
 */
function registerUser(store, userData) {
  if (!userData || typeof userData !== 'object') {
    throw new Error('User data is required');
  }

  const { email, name, password } = userData;

  // Validate required fields
  if (!email || typeof email !== 'string' || email.trim() === '') {
    throw new Error('Email is required');
  }

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Name is required');
  }

  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Validate email format (basic check)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Invalid email format');
  }

  // CHECK FOR DUPLICATE EMAIL (the bug fix)
  if (store.findByEmail(normalizedEmail)) {
    throw new Error('Email already registered');
  }

  // Hash the password
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    name: name.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  store.add(user);

  // Return user without sensitive data
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

module.exports = { registerUser, UserStore };
