const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

type LocalEntry = { count: number; resetAt: number };

const localRateLimits = new Map<string, LocalEntry>();

export type RateLimitResult =
  | { success: true; remaining: number; resetAt: number }
  | { success: false; remaining: 0; resetAt: number; unavailable?: boolean };

function checkLocalRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = localRateLimits.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + RATE_WINDOW_MS;
    localRateLimits.set(key, { count: 1, resetAt });
    return { success: true, remaining: RATE_LIMIT - 1, resetAt };
  }

  entry.count += 1;
  return entry.count <= RATE_LIMIT
    ? { success: true, remaining: RATE_LIMIT - entry.count, resetAt: entry.resetAt }
    : { success: false, remaining: 0, resetAt: entry.resetAt };
}

export async function checkChatRateLimit(clientId: string): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    if (process.env.NODE_ENV !== "production") {
      return checkLocalRateLimit(clientId);
    }

    return { success: false, remaining: 0, resetAt: Date.now(), unavailable: true };
  }

  const key = `portfolio:chat-rate-limit:${clientId}`;
  const script = `
    local count = redis.call("INCR", KEYS[1])
    if count == 1 then redis.call("PEXPIRE", KEYS[1], ARGV[1]) end
    local ttl = redis.call("PTTL", KEYS[1])
    return { count, ttl }
  `;

  try {
    const response = await fetch(redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", script, "1", key, RATE_WINDOW_MS]),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Rate-limit store returned ${response.status}`);

    const payload = (await response.json()) as {
      result?: [number, number];
      error?: string;
    };
    if (payload.error || !Array.isArray(payload.result)) {
      throw new Error(payload.error || "Invalid rate-limit response");
    }

    const [count, ttl] = payload.result;
    const resetAt = Date.now() + Math.max(ttl, 0);
    return count <= RATE_LIMIT
      ? { success: true, remaining: RATE_LIMIT - count, resetAt }
      : { success: false, remaining: 0, resetAt };
  } catch (error) {
    console.error("Chat rate limiter unavailable", error);
    return { success: false, remaining: 0, resetAt: Date.now(), unavailable: true };
  }
}
