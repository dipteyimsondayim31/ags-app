interface RateLimitRecord {
  failures: number;
  resetTime: number;
}

const failureCache = new Map<string, RateLimitRecord>();

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = failureCache.get(ip);

  if (!record) {
    return { allowed: true, remaining: MAX_FAILURES };
  }

  if (now > record.resetTime) {
    failureCache.delete(ip);
    return { allowed: true, remaining: MAX_FAILURES };
  }

  if (record.failures >= MAX_FAILURES) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_FAILURES - record.failures };
}

export function recordFailure(ip: string): void {
  const now = Date.now();
  const record = failureCache.get(ip);

  if (!record || now > record.resetTime) {
    failureCache.set(ip, {
      failures: 1,
      resetTime: now + WINDOW_MS,
    });
  } else {
    record.failures += 1;
  }
}

export function resetLimit(ip: string): void {
  failureCache.delete(ip);
}
