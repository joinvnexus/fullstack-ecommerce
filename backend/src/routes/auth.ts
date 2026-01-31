//backend/src/routes/auth.ts
import express from "express";
import { validate } from "../utils/validation.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  addressSchema,
  changePasswordSchema,
} from "../utils/validation.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
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
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers.js";
import { loginLimiter, registerLimiter, profileLimiter, passwordChangeLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

// Routes - using stricter rate limiters
router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);

router.post('/refresh', refresh);

router.get('/me', authenticate, profileLimiter, getProfile as any);
router.put('/me', authenticate, validate(updateProfileSchema), updateProfile as any);

router.post('/me/address', authenticate, validate(addressSchema), addAddress as any);
router.delete('/me/address/:index', authenticate, deleteAddress as any);

router.put('/password', authenticate, passwordChangeLimiter, validate(changePasswordSchema), changePassword as any);

router.get('/addresses', authenticate, getAddresses as any);
router.put('/addresses/:index', authenticate, validate(addressSchema), updateAddress as any);

router.post('/logout', authenticate, logout as any);

// Password reset routes
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
