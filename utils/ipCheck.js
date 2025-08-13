// utils/ipCheck.js

const blacklist = ["123.45.67.89", "100.200.300.400"];

export function isBlacklistedIP(req) {
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  return blacklist.includes(ip);
}
