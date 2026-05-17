import { redis } from "../redis";

const SESSION_PREFIX = "session:";
const BLACKLIST_PREFIX = "blacklist:";

export async function storeSession(
  sessionId: string,
  userId: string,
  ttlSeconds: number
): Promise<void> {
  await redis.set(`${SESSION_PREFIX}${sessionId}`, userId, "EX", ttlSeconds);
}

export async function getSession(sessionId: string): Promise<string | null> {
  return redis.get(`${SESSION_PREFIX}${sessionId}`);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`${SESSION_PREFIX}${sessionId}`);
}

export async function blacklistToken(
  token: string,
  ttlSeconds: number
): Promise<void> {
  await redis.set(`${BLACKLIST_PREFIX}${token}`, "1", "EX", ttlSeconds);
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await redis.get(`${BLACKLIST_PREFIX}${token}`);
  return result !== null;
}

export function getSessionKey(sessionId: string): string {
  return `${SESSION_PREFIX}${sessionId}`;
}

export function getBlacklistKey(token: string): string {
  return `${BLACKLIST_PREFIX}${token}`;
}
