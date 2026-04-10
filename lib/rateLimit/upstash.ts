import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const memoryHits = new Map<string, { count: number; resetAt: number }>();

export async function enforceRateLimit(key: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    const redis = new Redis({ url, token });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "10 m"),
      analytics: false,
      prefix: "client-orbit-support-ai"
    });

    const result = await ratelimit.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetMs: result.reset
    };
  }

  const now = Date.now();
  const bucket = memoryHits.get(key);
  if (!bucket || bucket.resetAt < now) {
    memoryHits.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return { success: true, remaining: 19, resetMs: now + 10 * 60 * 1000 };
  }

  bucket.count += 1;
  const success = bucket.count <= 20;
  return {
    success,
    remaining: Math.max(0, 20 - bucket.count),
    resetMs: bucket.resetAt
  };
}
