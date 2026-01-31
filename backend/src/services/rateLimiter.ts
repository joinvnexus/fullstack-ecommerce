import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const createRateLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, try later",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const user = (req as any).user;
      return user ? `user_${user.userId}` : ipKeyGenerator(req as any);
    },
    skip: (req) => ["/api/health", "/api/test"].includes(req.path),
  });
};
