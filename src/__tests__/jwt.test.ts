// Set environment variables BEFORE importing any modules that depend on them
process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

import {
  signAccessToken,
  signRefreshToken,
  generateTokenPair,
  verifyToken,
  decodeToken,
  JWTPayload,
} from '@/lib/auth/jwt';
import jwt from 'jsonwebtoken';

const TEST_PAYLOAD: JWTPayload = {
  userId: 'user-123',
  email: 'test@example.com',
};

describe('signAccessToken', () => {
  it('should create a valid token with userId and email', () => {
    const token = signAccessToken(TEST_PAYLOAD);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts

    const decoded = jwt.decode(token) as JWTPayload & { iat: number; exp: number };
    expect(decoded).not.toBeNull();
    expect(decoded.userId).toBe(TEST_PAYLOAD.userId);
    expect(decoded.email).toBe(TEST_PAYLOAD.email);
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp).toBeDefined();
  });

  it('should use the correct secret for signing', () => {
    const token = signAccessToken(TEST_PAYLOAD);

    // Should verify successfully with the same secret
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    expect(verified).toMatchObject(TEST_PAYLOAD);
  });

  it('should have an expiry time of 7 days (default)', () => {
    const token = signAccessToken(TEST_PAYLOAD);
    const decoded = jwt.decode(token) as { exp: number; iat: number };

    const expiresIn = decoded.exp - decoded.iat;
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;

    expect(expiresIn).toBe(sevenDaysInSeconds);
  });
});

describe('signRefreshToken', () => {
  it('should create a valid token with userId and email', () => {
    const token = signRefreshToken(TEST_PAYLOAD);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const decoded = jwt.decode(token) as JWTPayload & { iat: number; exp: number };
    expect(decoded).not.toBeNull();
    expect(decoded.userId).toBe(TEST_PAYLOAD.userId);
    expect(decoded.email).toBe(TEST_PAYLOAD.email);
  });

  it('should have a longer expiry than access token (30 days default)', () => {
    const accessToken = signAccessToken(TEST_PAYLOAD);
    const refreshToken = signRefreshToken(TEST_PAYLOAD);

    const accessDecoded = jwt.decode(accessToken) as { exp: number; iat: number };
    const refreshDecoded = jwt.decode(refreshToken) as { exp: number; iat: number };

    const accessExpiresIn = accessDecoded.exp - accessDecoded.iat;
    const refreshExpiresIn = refreshDecoded.exp - refreshDecoded.iat;

    expect(refreshExpiresIn).toBeGreaterThan(accessExpiresIn);

    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    expect(refreshExpiresIn).toBe(thirtyDaysInSeconds);
  });
});

describe('generateTokenPair', () => {
  it('should return both accessToken and refreshToken', () => {
    const tokens = generateTokenPair(TEST_PAYLOAD);

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('should return different tokens for access and refresh', () => {
    const tokens = generateTokenPair(TEST_PAYLOAD);

    expect(tokens.accessToken).not.toBe(tokens.refreshToken);
  });

  it('should return tokens that contain the correct payload', () => {
    const tokens = generateTokenPair(TEST_PAYLOAD);

    const accessDecoded = jwt.decode(tokens.accessToken) as JWTPayload;
    const refreshDecoded = jwt.decode(tokens.refreshToken) as JWTPayload;

    expect(accessDecoded.userId).toBe(TEST_PAYLOAD.userId);
    expect(accessDecoded.email).toBe(TEST_PAYLOAD.email);
    expect(refreshDecoded.userId).toBe(TEST_PAYLOAD.userId);
    expect(refreshDecoded.email).toBe(TEST_PAYLOAD.email);
  });
});

describe('verifyToken', () => {
  it('should successfully verify a valid access token', () => {
    const token = signAccessToken(TEST_PAYLOAD);
    const result = verifyToken(token);

    expect(result).not.toBeNull();
    expect(result).toMatchObject(TEST_PAYLOAD);
  });

  it('should successfully verify a valid refresh token', () => {
    const token = signRefreshToken(TEST_PAYLOAD);
    const result = verifyToken(token);

    expect(result).not.toBeNull();
    expect(result).toMatchObject(TEST_PAYLOAD);
  });

  it('should return null for an invalid token', () => {
    const result = verifyToken('invalid-token-string');

    expect(result).toBeNull();
  });

  it('should return null for a malformed token', () => {
    const result = verifyToken('not.a.jwt');

    expect(result).toBeNull();
  });

  it('should return null for an empty string', () => {
    const result = verifyToken('');

    expect(result).toBeNull();
  });

  it('should return null for a token signed with a different secret', () => {
    const differentSecret = 'different-secret-key-that-is-also-32-chars!';
    const token = jwt.sign(TEST_PAYLOAD, differentSecret);

    const result = verifyToken(token);

    expect(result).toBeNull();
  });

  it('should return null for an expired token', () => {
    // Create a token that expired 1 second ago
    const expiredToken = jwt.sign(
      { ...TEST_PAYLOAD, iat: Math.floor(Date.now() / 1000) - 10, exp: Math.floor(Date.now() / 1000) - 1 },
      process.env.JWT_SECRET!,
    );

    const result = verifyToken(expiredToken);

    expect(result).toBeNull();
  });
});

describe('decodeToken', () => {
  it('should decode a valid token without verification', () => {
    const token = signAccessToken(TEST_PAYLOAD);
    const result = decodeToken(token);

    expect(result).not.toBeNull();
    expect(result).toMatchObject(TEST_PAYLOAD);
  });

  it('should decode a token even if it is expired', () => {
    const expiredToken = jwt.sign(
      { ...TEST_PAYLOAD, iat: Math.floor(Date.now() / 1000) - 10, exp: Math.floor(Date.now() / 1000) - 1 },
      process.env.JWT_SECRET!,
    );

    const result = decodeToken(expiredToken);

    expect(result).not.toBeNull();
    expect(result).toMatchObject(TEST_PAYLOAD);
  });

  it('should decode a token signed with a different secret', () => {
    const differentSecret = 'different-secret-key-that-is-also-32-chars!';
    const token = jwt.sign(TEST_PAYLOAD, differentSecret);

    const result = decodeToken(token);

    expect(result).not.toBeNull();
    expect(result).toMatchObject(TEST_PAYLOAD);
  });

  it('should return null for a malformed token', () => {
    const result = decodeToken('not-a-valid-token');

    expect(result).toBeNull();
  });

  it('should return null for an empty string', () => {
    const result = decodeToken('');

    expect(result).toBeNull();
  });

  it('should return null for non-object decoded values', () => {
    // jwt.decode can theoretically return non-object values for certain inputs
    // We test the guard clause by passing something that decodes to null
    const result = decodeToken('random-gibberish-that-is-not-jwt');

    expect(result).toBeNull();
  });
});
