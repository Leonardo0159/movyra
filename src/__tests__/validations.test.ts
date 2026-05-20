import { registerSchema, loginSchema, profileSchema } from '@/lib/auth/validations';

describe('registerSchema', () => {
  it('should validate correct email, password (min 8 chars), and optional name', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'securePass123',
      name: 'John Doe',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.password).toBe('securePass123');
      expect(result.data.name).toBe('John Doe');
    }
  });

  it('should validate without name (optional field)', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'securePass123',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBeUndefined();
    }
  });

  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'securePass123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((issue) => issue.path.includes('email'));
      expect(emailError).toBeDefined();
    }
  });

  it('should reject empty email', () => {
    const result = registerSchema.safeParse({
      email: '',
      password: 'securePass123',
    });

    expect(result.success).toBe(false);
  });

  it('should reject password less than 8 characters', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find((issue) => issue.path.includes('password'));
      expect(passwordError).toBeDefined();
    }
  });

  it('should reject exactly 7 character password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '1234567',
    });

    expect(result.success).toBe(false);
  });

  it('should accept exactly 8 character password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '12345678',
    });

    expect(result.success).toBe(true);
  });

  it('should reject missing email', () => {
    const result = registerSchema.safeParse({
      password: 'securePass123',
    });

    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
    });

    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('should validate correct email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'anypassword',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
      expect(result.data.password).toBe('anypassword');
    }
  });

  it('should validate with single character password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'a',
    });

    expect(result.success).toBe(true);
  });

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find((issue) => issue.path.includes('password'));
      expect(passwordError).toBeDefined();
    }
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'somepassword',
    });

    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const result = loginSchema.safeParse({
      password: 'somepassword',
    });

    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
    });

    expect(result.success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('should validate valid name (2-30 chars), avatarKey (avatar-1 to avatar-6), and optional avatarUrl', () => {
    const result = profileSchema.safeParse({
      name: 'John Doe',
      avatarKey: 'avatar-3',
      avatarUrl: 'https://example.com/avatar.jpg',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('John Doe');
      expect(result.data.avatarKey).toBe('avatar-3');
      expect(result.data.avatarUrl).toBe('https://example.com/avatar.jpg');
    }
  });

  it('should validate with only name (avatarKey and avatarUrl are optional)', () => {
    const result = profileSchema.safeParse({
      name: 'Jane',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.avatarKey).toBeUndefined();
      expect(result.data.avatarUrl).toBeUndefined();
    }
  });

  it('should accept name with exactly 2 characters', () => {
    const result = profileSchema.safeParse({
      name: 'Jo',
    });

    expect(result.success).toBe(true);
  });

  it('should accept name with exactly 30 characters', () => {
    const result = profileSchema.safeParse({
      name: 'a'.repeat(30),
    });

    expect(result.success).toBe(true);
  });

  it('should reject name less than 2 characters', () => {
    const result = profileSchema.safeParse({
      name: 'J',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((issue) => issue.path.includes('name'));
      expect(nameError).toBeDefined();
    }
  });

  it('should reject empty name', () => {
    const result = profileSchema.safeParse({
      name: '',
    });

    expect(result.success).toBe(false);
  });

  it('should reject name more than 30 characters', () => {
    const result = profileSchema.safeParse({
      name: 'a'.repeat(31),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((issue) => issue.path.includes('name'));
      expect(nameError).toBeDefined();
    }
  });

  it('should accept all valid avatarKeys (avatar-1 to avatar-6)', () => {
    for (let i = 1; i <= 6; i++) {
      const result = profileSchema.safeParse({
        name: 'Test User',
        avatarKey: `avatar-${i}`,
      });

      expect(result.success).toBe(true);
    }
  });

  it('should reject invalid avatarKey', () => {
    const result = profileSchema.safeParse({
      name: 'Test User',
      avatarKey: 'avatar-7',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const avatarError = result.error.issues.find((issue) => issue.path.includes('avatarKey'));
      expect(avatarError).toBeDefined();
    }
  });

  it('should reject avatarKey with wrong format', () => {
    const invalidKeys = ['avatar-0', 'avatar', 'Avatar-1', 'avatar-10', 'avatar-a', ''];

    for (const key of invalidKeys) {
      const result = profileSchema.safeParse({
        name: 'Test User',
        avatarKey: key,
      });

      expect(result.success).toBe(false);
    }
  });

  it('should reject invalid avatarUrl', () => {
    const result = profileSchema.safeParse({
      name: 'Test User',
      avatarUrl: 'not-a-url',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const urlError = result.error.issues.find((issue) => issue.path.includes('avatarUrl'));
      expect(urlError).toBeDefined();
    }
  });

  it('should accept valid avatarUrl', () => {
    const result = profileSchema.safeParse({
      name: 'Test User',
      avatarUrl: 'https://cdn.example.com/avatars/user.png',
    });

    expect(result.success).toBe(true);
  });

  it('should reject missing name', () => {
    const result = profileSchema.safeParse({
      avatarKey: 'avatar-1',
    });

    expect(result.success).toBe(false);
  });
});
