import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import logger from '../utils/logger.js';
import { getRedisClient } from '../config/redis.js';

const keyByUserOrIp = (req: any) =>
  req.user ? `user_${req.user.userId}` : ipKeyGenerator(req);

const redisClient = getRedisClient();

const redisStore = redisClient
  ? new RedisStore({
      sendCommand: (...args: string[]) => (redisClient.call as any)(...args),
    })
  : undefined;

const BLOCKED_IP_TTL = 30 * 60; // 30 minutes in seconds

const checkBlockedIP = async (ip: string): Promise<boolean> => {
  if (!redisClient) {
    return false;
  }
  const blocked = await redisClient.get(`blocked_ip:${ip}`);
  return blocked !== null;
};

const blockIP = async (ip: string): Promise<void> => {
  if (!redisClient) {
    return;
  }
  await redisClient.setex(`blocked_ip:${ip}`, BLOCKED_IP_TTL, '1');
};

const createLimiter = (options: Record<string, unknown>) => {
  const config: Record<string, unknown> = { ...options };
  if (redisStore) {
    config.store = redisStore;
  }
  return rateLimit(config as any);
};

// Login limiter (stricter - prevents brute force)
export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10 : 5, // 5 attempts in prod
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later.',
  keyGenerator: (req: any) => ipKeyGenerator(req as any),
  handler: (req: any, res: any) => {
    const ip = req.ip || 'unknown';
    logger.warn(`Login rate limit exceeded: ${req.method} ${req.path} IP: ${ip}`);
    void blockIP(ip);
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Account temporarily locked for 30 minutes.',
      retryAfter: 1800,
    });
  },
  skip: (req: any) => {
    const ip = req.ip || 'unknown';
    void checkBlockedIP(ip);
    return false;
  },
});

// Register limiter (prevents spam registration)
export const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'development' ? 20 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many registration attempts, please try again later.',
  keyGenerator: (req: any) => ipKeyGenerator(req as any),
  handler: (req: any, res: any) => {
    logger.warn(`Register rate limit exceeded: ${req.method} ${req.path} IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many registration attempts, please try again later.',
    });
  },
});

// Auth limiter (general - for backward compatibility)
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 50 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.',
  keyGenerator: keyByUserOrIp,
  handler: (req: any, res: any) => {
    logger.warn(
      `Auth rate limit exceeded: ${req.method} ${req.path} IP: ${req.ip}`
    );
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
    });
  },
});

// Profile limiter (for authenticated routes)
export const profileLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByUserOrIp,
});

// Password change limiter (stricter for security)
export const passwordChangeLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many password change attempts, please try again later.',
  keyGenerator: keyByUserOrIp,
  handler: (req: any, res: any) => {
    logger.warn(`Password change rate limit exceeded: ${req.method} ${req.path} IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many password change attempts, please try again later.',
    });
  },
});

// Forgot password limiter (prevents email enumeration)
export const forgotPasswordLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many password reset attempts, please try again later.',
  keyGenerator: (req: any) => ipKeyGenerator(req as any),
  handler: (req: any, res: any) => {
    logger.warn(`Forgot password rate limit exceeded: ${req.method} ${req.path} IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts, please try again later.',
    });
  },
});
