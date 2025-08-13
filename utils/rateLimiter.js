// utils/rateLimiter.js

const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 5;

const ipRequestMap = new Map();

export function rateLimit(req) {
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";

  const now = Date.now();
  const entry = ipRequestMap.get(ip) || { count: 0, lastRequestTime: now };

  if (now - entry.lastRequestTime > rateLimitWindowMs) {
    // Reset rate limit window
    ipRequestMap.set(ip, { count: 1, lastRequestTime: now });
    return { success: true };
  }

  if (entry.count >= maxRequestsPerWindow) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  ipRequestMap.set(ip, { count: entry.count + 1, lastRequestTime: entry.lastRequestTime });
  return { success: true };
}
