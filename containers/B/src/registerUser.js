let nextId = 1;

class UserStore {
  constructor() {
    this.users = [];
  }

  findByEmail(email) {
    return this.users.find(u => u.email === email.toLowerCase().trim());
  }

  add(user) {
    this.users.push(user);
    return user;
  }
}

/**
 * Registers a new user after validating input and checking for duplicates.
 * @param {UserStore} store - The user store
 * @param {object} data - { email, name }
 * @returns {object} The created user
 */
function registerUser(store, data) {
  if (!data || typeof data !== 'object') {
    throw new Error('User data is required');
  }

  const { name } = data;
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Valid email is required');
  }

  // Validate name
  if (!name || (typeof name === 'string' && name.trim().length === 0)) {
    throw new Error('Name is required');
  }

  // Check for duplicates (THE BUG FIX)
  if (store.findByEmail(email)) {
    throw new Error('Email already registered');
  }

  const user = { id: nextId++, email, name };
  return store.add(user);
}

module.exports = { registerUser, UserStore };
