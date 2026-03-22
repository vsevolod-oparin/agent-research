const { registerUser, UserStore } = require('../src/registerUser');

describe('registerUser', () => {
  let store;

  beforeEach(() => {
    store = new UserStore();
  });

  // Basic registration
  test('registers a new user successfully', () => {
    const user = registerUser(store, { email: 'alice@example.com', name: 'Alice', password: 'pass123' });
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('alice@example.com');
    expect(user.name).toBe('Alice');
  });

  test('registered user can be found by email', () => {
    registerUser(store, { email: 'bob@example.com', name: 'Bob', password: 'pass123' });
    const found = store.findByEmail('bob@example.com');
    expect(found).toBeDefined();
    expect(found.name).toBe('Bob');
  });

  // THE BUG: duplicate email detection
  test('throws error when registering duplicate email', () => {
    registerUser(store, { email: 'dup@example.com', name: 'First', password: 'pass123' });
    expect(() => {
      registerUser(store, { email: 'dup@example.com', name: 'Second', password: 'pass456' });
    }).toThrow('Email already registered');
  });

  test('duplicate check is case-insensitive', () => {
    registerUser(store, { email: 'Test@Example.com', name: 'First', password: 'pass123' });
    expect(() => {
      registerUser(store, { email: 'test@example.com', name: 'Second', password: 'pass456' });
    }).toThrow('Email already registered');
  });

  test('duplicate check ignores leading/trailing whitespace', () => {
    registerUser(store, { email: 'trim@example.com', name: 'First', password: 'pass123' });
    expect(() => {
      registerUser(store, { email: '  trim@example.com  ', name: 'Second', password: 'pass456' });
    }).toThrow('Email already registered');
  });

  // Input validation
  test('throws on missing email', () => {
    expect(() => {
      registerUser(store, { name: 'NoEmail', password: 'pass123' });
    }).toThrow('Email is required');
  });

  test('throws on empty email', () => {
    expect(() => {
      registerUser(store, { email: '', name: 'NoEmail', password: 'pass123' });
    }).toThrow('Email is required');
  });

  test('throws on invalid email format', () => {
    expect(() => {
      registerUser(store, { email: 'notanemail', name: 'Bad', password: 'pass123' });
    }).toThrow('Invalid email format');
  });

  test('throws on missing name', () => {
    expect(() => {
      registerUser(store, { email: 'a@b.com', password: 'pass123' });
    }).toThrow('Name is required');
  });

  test('throws on missing password', () => {
    expect(() => {
      registerUser(store, { email: 'a@b.com', name: 'Test' });
    }).toThrow('Password is required');
  });

  // Does not store plaintext password
  test('does not store plaintext password', () => {
    const user = registerUser(store, { email: 'secure@example.com', name: 'Secure', password: 'mypassword' });
    expect(user.password).toBeUndefined();
    const stored = store.findByEmail('secure@example.com');
    expect(stored.password).toBeUndefined();
    expect(stored.passwordHash).toBeDefined();
    expect(stored.passwordHash).not.toBe('mypassword');
  });

  // Multiple unique users
  test('allows multiple users with different emails', () => {
    registerUser(store, { email: 'a@example.com', name: 'A', password: 'p1' });
    registerUser(store, { email: 'b@example.com', name: 'B', password: 'p2' });
    registerUser(store, { email: 'c@example.com', name: 'C', password: 'p3' });
    expect(store.count()).toBe(3);
  });

  // Null/undefined input
  test('throws on null input', () => {
    expect(() => registerUser(store, null)).toThrow();
  });

  test('throws on undefined input', () => {
    expect(() => registerUser(store, undefined)).toThrow();
  });
});
