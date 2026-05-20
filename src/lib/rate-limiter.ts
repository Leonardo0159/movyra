// Rate limiter usando Redis para prevenir abuso de endpoints admin
import { redis } from "@/lib/redis";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  reset: number;
}

/**
 * Implementa um rate limiter simples com sliding window usando Redis.
 * @param key - Chave única para identificar o cliente (ex: userId, IP)
 * @param limit - Número máximo de requisições permitidas
 * @param windowSeconds - Janela de tempo em segundos
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const redisKey = `ratelimit:${key}`;

  try {
    // Remove entradas expiradas
    await redis.zremrangebyscore(redisKey, 0, windowStart);

    // Conta requisições na janela atual
    const requestCount = await redis.zcard(redisKey);

    if (requestCount >= limit) {
      // Obtém o timestamp da requisição mais antiga na janela para calcular reset
      const oldestRequest = await redis.zrange(redisKey, 0, 0, "WITHSCORES");
      const resetTime = oldestRequest.length > 1
        ? Math.ceil((parseInt(oldestRequest[1]) + windowSeconds * 1000) / 1000)
        : Math.ceil((now + windowSeconds * 1000) / 1000);

      return {
        success: false,
        remaining: 0,
        limit,
        reset: resetTime,
      };
    }

    // Adiciona a requisição atual
    await redis.zadd(redisKey, now, `${now}:${Math.random()}`);

    // Define TTL para a chave
    await redis.expire(redisKey, windowSeconds);

    return {
      success: true,
      remaining: limit - requestCount - 1,
      limit,
      reset: Math.ceil((now + windowSeconds * 1000) / 1000),
    };
  } catch {
    // Se Redis falhar, permite a requisição (fail-open)
    return {
      success: true,
      remaining: limit,
      limit,
      reset: Math.ceil((now + windowSeconds * 1000) / 1000),
    };
  }
}

// Limites específicos para endpoints admin
export const adminUploadRateLimit = (userId: string) =>
  rateLimit(`admin:upload:${userId}`, 10, 60); // 10 requisições por minuto

export const adminEncodingRateLimit = (userId: string) =>
  rateLimit(`admin:encoding:${userId}`, 5, 60); // 5 requisições por minuto
