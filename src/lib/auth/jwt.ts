import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../env";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    default:
      return 7 * 24 * 60 * 60;
  }
}

const signOptions = (expiresIn: string): SignOptions => ({
  expiresIn: parseExpiresIn(expiresIn),
});

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, signOptions(env.JWT_EXPIRES_IN));
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, signOptions(env.JWT_REFRESH_EXPIRES_IN));
}

export function generateTokenPair(payload: JWTPayload): TokenPair {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export function verifyToken<T extends JWTPayload>(token: string): T | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as T;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded !== "object") return null;
  return decoded as JWTPayload;
}
