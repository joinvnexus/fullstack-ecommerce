import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedisClient } from "../config/redis.js";

const redisClient = getRedisClient();

const redisStore = redisClient
  ? new RedisStore({
      sendCommand: (...args: string[]) => (redisClient.call as any)(...args),
    })
  : undefined;

export const createRateLimiter = () => {
  const options = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, try later",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: any) => {
      const user = (req as any).user;
      return user ? `user_${user.userId}` : ipKeyGenerator(req as any);
    },
    skip: (req: any) => ["/api/health", "/api/test"].includes(req.path),
  };

  if (redisStore) {
    (options as any).store = redisStore;
  }

  return rateLimit(options);
};
