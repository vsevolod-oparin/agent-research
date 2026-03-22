const { registerUser, UserStore } = require('../registerUser');

describe('registerUser', () => {
  let store;

  beforeEach(() => {
    store = new UserStore();
  });

  // Basic registration
  test('registers a new user successfully', () => {
    const user = registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    expect(user).toMatchObject({ email: 'alice@example.com', name: 'Alice' });
    expect(user.id).toBeDefined();
  });

  test('registers multiple users with different emails', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    const bob = registerUser(store, { email: 'bob@example.com', name: 'Bob' });
    expect(bob.email).toBe('bob@example.com');
  });

  // Duplicate email detection (THE BUG FIX)
  test('throws when registering a duplicate email', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    expect(() => {
      registerUser(store, { email: 'alice@example.com', name: 'Alice2' });
    }).toThrow('Email already registered');
  });

  test('duplicate check is case-insensitive', () => {
    registerUser(store, { email: 'Alice@Example.com', name: 'Alice' });
    expect(() => {
      registerUser(store, { email: 'alice@example.com', name: 'Alice2' });
    }).toThrow('Email already registered');
  });

  test('duplicate check ignores leading/trailing whitespace', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    expect(() => {
      registerUser(store, { email: '  alice@example.com  ', name: 'Alice2' });
    }).toThrow('Email already registered');
  });

  // Input validation
  test('throws on missing email', () => {
    expect(() => registerUser(store, { name: 'Alice' })).toThrow('Valid email is required');
  });

  test('throws on empty email', () => {
    expect(() => registerUser(store, { email: '', name: 'Alice' })).toThrow('Valid email is required');
  });

  test('throws on invalid email format', () => {
    expect(() => registerUser(store, { email: 'notanemail', name: 'Alice' })).toThrow('Valid email is required');
  });

  test('throws on missing name', () => {
    expect(() => registerUser(store, { email: 'a@b.com' })).toThrow('Name is required');
  });

  test('throws on null input', () => {
    expect(() => registerUser(store, null)).toThrow();
  });

  test('throws on undefined input', () => {
    expect(() => registerUser(store, undefined)).toThrow();
  });

  // Special characters in email
  test('handles special characters in email', () => {
    const user = registerUser(store, { email: 'user+tag@example.com', name: 'User' });
    expect(user.email).toBe('user+tag@example.com');
  });

  // Unicode in name
  test('handles unicode in name', () => {
    const user = registerUser(store, { email: 'a@b.com', name: 'Taro Yamada' });
    expect(user.name).toBe('Taro Yamada');
  });
});
