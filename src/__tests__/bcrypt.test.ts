import { hashPassword, comparePassword } from '@/lib/auth/bcrypt';

const TEST_PASSWORD = 'mySecurePassword123!';

describe('hashPassword', () => {
  it('should return a hashed string', async () => {
    const hash = await hashPassword(TEST_PASSWORD);

    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should return a different hash each time (salt is random)', async () => {
    const hash1 = await hashPassword(TEST_PASSWORD);
    const hash2 = await hashPassword(TEST_PASSWORD);

    expect(hash1).not.toBe(hash2);
  });

  it('should create hashes with 12 salt rounds', async () => {
    const hash = await hashPassword(TEST_PASSWORD);

    // bcrypt hashes encode the salt rounds as the second field: $2b$12$...
    const saltRounds = parseInt(hash.split('$')[2], 10);

    expect(saltRounds).toBe(12);
  });

  it('should produce a valid bcrypt hash format', async () => {
    const hash = await hashPassword(TEST_PASSWORD);

    // bcrypt hash format: $2b$<rounds>$<salt+hash>
    expect(hash).toMatch(/^\$2[ab]?\$\d{2}\$[A-Za-z0-9./]{53}$/);
  });

  it('should handle empty string password', async () => {
    const hash = await hashPassword('');

    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });
});

describe('comparePassword', () => {
  it('should return true for correct password', async () => {
    const hash = await hashPassword(TEST_PASSWORD);
    const result = await comparePassword(TEST_PASSWORD, hash);

    expect(result).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const hash = await hashPassword(TEST_PASSWORD);
    const result = await comparePassword('wrongPassword', hash);

    expect(result).toBe(false);
  });

  it('should return false for empty string when password is not empty', async () => {
    const hash = await hashPassword(TEST_PASSWORD);
    const result = await comparePassword('', hash);

    expect(result).toBe(false);
  });

  it('should return true for correct password even with different hash instances', async () => {
    const hash1 = await hashPassword(TEST_PASSWORD);
    const hash2 = await hashPassword(TEST_PASSWORD);

    // Both hashes are different, but both should match the original password
    expect(await comparePassword(TEST_PASSWORD, hash1)).toBe(true);
    expect(await comparePassword(TEST_PASSWORD, hash2)).toBe(true);
  });

  it('should return false when comparing against an invalid hash', async () => {
    const result = await comparePassword(TEST_PASSWORD, 'not-a-valid-bcrypt-hash');

    expect(result).toBe(false);
  });

  it('should handle case-sensitive password comparison', async () => {
    const hash = await hashPassword(TEST_PASSWORD);

    expect(await comparePassword('mysecurepassword123!', hash)).toBe(false);
    expect(await comparePassword('MYSECUREPASSWORD123!', hash)).toBe(false);
  });
});
