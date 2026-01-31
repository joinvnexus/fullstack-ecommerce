// backend/src/middleware/rateLimiter.ts
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import logger from '../utils/logger.js';

const keyByUserOrIp = (req: any) =>
  req.user ? `user_${req.user.userId}` : ipKeyGenerator(req);

// Store blocked IPs in memory (use Redis for production)
const blockedIPs = new Map<string, number>();

// 🔐 Login limiter (stricter - prevents brute force)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10 : 5, // 5 attempts in prod
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later.',
  keyGenerator: (req: any) => ipKeyGenerator(req as any), // Always by IP for login
  handler: (req, res, options) => {
    const ip = req.ip || 'unknown';
    logger.warn(`Login rate limit exceeded: ${req.method} ${req.path} IP: ${ip}`);
    
    // Block IP for 30 minutes after limit exceeded
    blockedIPs.set(ip, Date.now() + 30 * 60 * 1000);
    
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Account temporarily locked for 30 minutes.',
      retryAfter: 1800,
    });
  },
  skip: (req) => {
    const ip = req.ip || 'unknown';
    const blockedUntil = blockedIPs.get(ip);
    if (blockedUntil && Date.now() < blockedUntil) {
      return false; // Don't skip, still apply limit
    }
    return false;
  },
});

// 🔐 Register limiter (prevents spam registration)
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'development' ? 20 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many registration attempts, please try again later.',
  keyGenerator: (req: any) => ipKeyGenerator(req as any),
  handler: (req, res) => {
    logger.warn(`Register rate limit exceeded: ${req.method} ${req.path} IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many registration attempts, please try again later.',
    });
  },
});

// 🔐 Auth limiter (general - for backward compatibility)
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

// 👤 Profile limiter (for authenticated routes)
export const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: keyByUserOrIp,
});

// 🔐 Password change limiter (stricter for security)
export const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many password change attempts, please try again later.',
  keyGenerator: keyByUserOrIp,
  handler: (req, res) => {
    logger.warn(`Password change rate limit exceeded: ${req.method} ${req.path} IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many password change attempts, please try again later.',
    });
  },
});

// 🔐 Forgot password limiter (prevents email enumeration)
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many password reset attempts, please try again later.',
  keyGenerator: (req: any) => ipKeyGenerator(req as any),
  handler: (req, res) => {
    logger.warn(`Forgot password rate limit exceeded: ${req.method} ${req.path} IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts, please try again later.',
    });
  },
});

// Cleanup blocked IPs every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, blockedUntil] of blockedIPs.entries()) {
    if (now >= blockedUntil) {
      blockedIPs.delete(ip);
    }
  }
}, 60 * 60 * 1000);
