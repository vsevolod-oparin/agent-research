const crypto = require('crypto');

class UserStore {
  constructor() {
    this.users = [];
  }

  findByEmail(email) {
    return this.users.find(u => u.email === email.toLowerCase().trim());
  }

  add(user) {
    this.users.push(user);
  }
}

/**
 * Registers a user, checking for duplicate emails.
 * Returns { success, user?, error? }
 */
function registerUser(store, userData) {
  if (!userData || typeof userData !== 'object') {
    return { success: false, error: 'Invalid input' };
  }

  if (!userData.email) {
    return { success: false, error: 'Email is required' };
  }

  const email = String(userData.email).trim().toLowerCase();

  if (email === '') {
    return { success: false, error: 'Email is required' };
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  // Check for duplicate email
  if (store.findByEmail(email)) {
    return { success: false, error: 'Email already exists' };
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    name: userData.name || '',
  };

  store.add(user);

  return { success: true, user };
}

module.exports = { registerUser, UserStore };
