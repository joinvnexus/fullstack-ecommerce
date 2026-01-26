// backend/src/middleware/rateLimiter.ts
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import logger from '../utils/logger.js';

const keyByUserOrIp = (req: any) =>
  req.user ? `user_${req.user.userId}` : ipKeyGenerator(req);

// 🔐 Auth limiter (login / register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 50 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.',
  keyGenerator: keyByUserOrIp,
  handler: (req, res) => {
    logger.warn(
      `Auth rate limit exceeded: ${req.method} ${req.path} IP: ${req.ip}`
    );
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
    });
  },
});

// 👤 Profile limiter
export const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByUserOrIp,
});
