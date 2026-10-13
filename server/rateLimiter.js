/**
 * rateLimiter.js
 * In-memory sliding window rate limiter for serverless endpoints.
 * Protects Gemini API calls from abuse without storing user data.
 */

const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute per IP

export function checkRateLimit(ip = 'unknown') {
  const now = Date.now();
  const clientWindow = requestCounts.get(ip) || [];

  // Filter timestamps within current sliding window
  const activeTimestamps = clientWindow.filter(timestamp => now - timestamp < WINDOW_MS);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = activeTimestamps[0];
    const resetSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds
    };
  }

  activeTimestamps.push(now);
  requestCounts.set(ip, activeTimestamps);

  // Periodically clean up old IP entries to prevent memory growth
  if (requestCounts.size > 1000) {
    for (const [key, timestamps] of requestCounts.entries()) {
      if (timestamps.every(t => now - t > WINDOW_MS)) {
        requestCounts.delete(key);
      }
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - activeTimestamps.length,
    resetSeconds: Math.ceil(WINDOW_MS / 1000)
  };
}
