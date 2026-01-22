import express from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { validate } from '../utils/validation.js';
import { registerSchema, loginSchema, updateProfileSchema, addressSchema, changePasswordSchema } from '../utils/validation.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
  register,
  login,
  refresh,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  changePassword,
  getAddresses,
  logout,
  updateAddress,
} from '../controllers/authControllers.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 50 : 5,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for auth route: ${req.method} ${req.path} from IP: ${req.ip}`);
    res.status(429).json({ success: false, message: 'Too many authentication attempts, please try again later.' });
  },
});

const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for profile
  message: 'Too many profile requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const user = (req as any).user;
    return user ? `user_${user.userId}` : ipKeyGenerator(req as any);
  },
});

// Routes
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.get('/me', profileLimiter, authenticate, getProfile as any);
router.put('/me', authenticate, validate(updateProfileSchema), updateProfile as any);
router.post('/me/address', authenticate, validate(addressSchema), addAddress as any);
router.delete('/me/address/:index', authenticate, deleteAddress as any);
router.put('/password', authenticate, validate(changePasswordSchema), changePassword as any);
router.get('/addresses', authenticate, getAddresses as any);
router.post('/logout', authenticate, logout as any);
router.put('/addresses/:index', authenticate, validate(addressSchema), updateAddress as any);

export default router;
