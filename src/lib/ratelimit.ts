/**
 * Simple in-memory rate limiter (per IP).
 * Suitable for early dev. For production, swap in Upstash Redis as described in PROJECT.md.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 1000; // 1 minute

export function rateLimit(identifier: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const existing = windows.get(identifier);

  if (!existing || now >= existing.resetAt) {
    windows.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - existing.count };
}

export function resetRateLimit(identifier: string) {
  windows.delete(identifier);
}
