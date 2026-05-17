import redis from "./redis";

const CACHE_PREFIX = "movyra:";

function namespacedKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

async function isRedisAvailable(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

export async function get<T>(key: string): Promise<T | null> {
  try {
    if (!(await isRedisAvailable())) {
      console.warn("Redis unavailable, cache get returning null");
      return null;
    }
    const data = await redis.get(namespacedKey(key));
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.warn(`Cache get failed for key: ${key}`, error);
    return null;
  }
}

export async function set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  try {
    if (!(await isRedisAvailable())) {
      console.warn("Redis unavailable, cache set skipped");
      return;
    }
    const data = JSON.stringify(value);
    const nsKey = namespacedKey(key);
    if (ttlSeconds) {
      await redis.setex(nsKey, ttlSeconds, data);
    } else {
      await redis.set(nsKey, data);
    }
  } catch (error) {
    console.warn(`Cache set failed for key: ${key}`, error);
  }
}

export async function del(key: string): Promise<void> {
  try {
    if (!(await isRedisAvailable())) {
      console.warn("Redis unavailable, cache delete skipped");
      return;
    }
    await redis.del(namespacedKey(key));
  } catch (error) {
    console.warn(`Cache delete failed for key: ${key}`, error);
  }
}
