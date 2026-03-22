const { registerUser, UserStore } = require('../src/registerUser');

describe('registerUser', () => {
  let store;

  beforeEach(() => {
    store = new UserStore();
  });

  // Normal registration
  test('registers a new user successfully', () => {
    const result = registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    expect(result.success).toBe(true);
    expect(result.user.email).toBe('alice@example.com');
    expect(result.user.name).toBe('Alice');
    expect(result.user.id).toBeDefined();
  });

  // DUPLICATE EMAIL BUG FIX - the core test
  test('rejects registration with duplicate email', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    const result = registerUser(store, { email: 'alice@example.com', name: 'Alice 2' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  test('rejects duplicate email case-insensitively', () => {
    registerUser(store, { email: 'Alice@Example.COM', name: 'Alice' });
    const result = registerUser(store, { email: 'alice@example.com', name: 'Alice 2' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  // Different emails should work
  test('allows different emails', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    const result = registerUser(store, { email: 'bob@example.com', name: 'Bob' });
    expect(result.success).toBe(true);
  });

  // Validation edge cases
  test('rejects missing email', () => {
    const result = registerUser(store, { name: 'Alice' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/email.*required/i);
  });

  test('rejects empty email', () => {
    const result = registerUser(store, { email: '', name: 'Alice' });
    expect(result.success).toBe(false);
  });

  test('rejects invalid email format', () => {
    const result = registerUser(store, { email: 'not-an-email', name: 'Alice' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/invalid.*email/i);
  });

  test('rejects null input', () => {
    const result = registerUser(store, null);
    expect(result.success).toBe(false);
  });

  test('rejects undefined input', () => {
    const result = registerUser(store, undefined);
    expect(result.success).toBe(false);
  });

  // Trims whitespace from email
  test('trims whitespace from email before checking', () => {
    registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    const result = registerUser(store, { email: '  alice@example.com  ', name: 'Alice 2' });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  // Stores user properly
  test('stored user has an id', () => {
    const result = registerUser(store, { email: 'alice@example.com', name: 'Alice' });
    expect(typeof result.user.id).toBe('string');
    expect(result.user.id.length).toBeGreaterThan(0);
  });
});
