import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redis = globalForRedis.redis ?? new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) {
      console.warn("Redis unavailable, cache operations will gracefully fallback");
      return null; // Stop retrying
    }
    return Math.min(times * 200, 2000); // Exponential backoff
  },
});

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

redis.on("error", (err) => {
  // Only log in development to avoid noise in production logs
  if (process.env.NODE_ENV === "development") {
    console.error("Redis Client Error", err.message);
  }
});

export default redis;
