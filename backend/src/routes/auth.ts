import express from 'express';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { authenticate } from '../utils/auth.js';
import { validate } from '../utils/validation.js';
import { registerSchema, loginSchema, updateProfileSchema, addressSchema, changePasswordSchema } from '../utils/validation.js';
import AuthUtils from '../utils/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Register new user
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      role: 'customer',
    });

    await user.save();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (emailError) {
      logger.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // Generate JWT tokens
    const accessToken = AuthUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshTokenResult = AuthUtils.generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Save refresh token to DB
    await RefreshToken.create({
      userId: user._id,
      tokenId: refreshTokenResult.tokenId,
      token: refreshTokenResult.token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Set cookies
    AuthUtils.setAuthCookies(res, accessToken, refreshTokenResult);

    // Remove password safely using destructuring
    const { password: pwd, ...userResponse } = user.toObject();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT tokens
    const accessToken = AuthUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshTokenResult = AuthUtils.generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Save refresh token to DB
    await RefreshToken.create({
      userId: user._id,
      tokenId: refreshTokenResult.tokenId,
      token: refreshTokenResult.token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Set cookies
    AuthUtils.setAuthCookies(res, accessToken, refreshTokenResult);

    // Remove password safely
    const { password: pwd, ...userResponse } = user.toObject();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Refresh access token
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = AuthUtils.verifyRefreshToken(refreshToken);

    if (!decoded || !decoded.tokenId) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check if refresh token exists in DB
    const tokenDoc = await RefreshToken.findOne({ tokenId: decoded.tokenId });
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Delete the old refresh token (rotation)
    await RefreshToken.deleteOne({ tokenId: decoded.tokenId });

    // Generate new tokens
    const newAccessToken = AuthUtils.generateToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    const newRefreshTokenResult = AuthUtils.generateRefreshToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    // Save new refresh token to DB
    await RefreshToken.create({
      userId: tokenDoc.userId,
      tokenId: newRefreshTokenResult.tokenId,
      token: newRefreshTokenResult.token,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Set new cookies
    AuthUtils.setAuthCookies(res, newAccessToken, newRefreshTokenResult);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const userData = await User.findById(user.userId).select('-password');

    if (!userData) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/me', authenticate, validate(updateProfileSchema), async (req, res, next) => {
  try {
    const user = (req as any).user;
    const updates = req.body;

    const userData = await User.findByIdAndUpdate(
      user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!userData) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
});

// Add address
router.post('/me/address', authenticate, validate(addressSchema), async (req, res, next) => {
  try {
    const user = (req as any).user;
    const address = req.body;

    // If this is the first address or if isDefault is true, update other addresses
    if (address.isDefault) {
      await User.updateOne(
        { _id: user.userId },
        { $set: { 'addresses.$[].isDefault': false } }
      );
    }

    const userData = await User.findByIdAndUpdate(
      user.userId,
      { $push: { addresses: address } },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Address added successfully',
      data: userData?.addresses,
    });
  } catch (error) {
    next(error);
  }
});

// Delete address
router.delete('/me/address/:index', authenticate, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const indexParam = req.params.index;
    if (!indexParam) {
      throw new AppError('Address index is required', 400);
    }

    const index = parseInt(indexParam);
    if (isNaN(index)) {
      throw new AppError('Invalid address index', 400);
    }

    const userData = await User.findById(user.userId);
    if (!userData) {
      throw new AppError('User not found', 404);
    }

    if (index < 0 || index >= userData.addresses.length) {
      throw new AppError('Invalid address index', 400);
    }

    // Remove address at index
    userData.addresses.splice(index, 1);
    await userData.save();

    res.json({
      success: true,
      message: 'Address removed successfully',
      data: userData.addresses,
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/password', authenticate, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const user = (req as any).user;
    const { currentPassword, newPassword } = req.body;

    const userData = await User.findById(user.userId);
    if (!userData) {
      throw new AppError('User not found', 404);
    }

    const isValid = await userData.comparePassword(currentPassword);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    userData.password = newPassword;
    await userData.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get user addresses
router.get('/addresses', authenticate, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const userData = await User.findById(user.userId).select('addresses');

    if (!userData) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: userData.addresses,
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const user = (req as any).user;

    // Delete all refresh tokens for the user
    await RefreshToken.deleteMany({ userId: user.userId });

    // Clear authentication cookies
    AuthUtils.clearAuthCookies(res);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Update address
router.put('/addresses/:index', authenticate, validate(addressSchema), async (req, res, next) => {
  try {
    const user = (req as any).user;
    const indexParam = req.params.index;
    if (!indexParam) {
      throw new AppError('Address index is required', 400);
    }

    const index = parseInt(indexParam);
    if (isNaN(index)) {
      throw new AppError('Invalid address index', 400);
    }

    const address = req.body;

    const userData = await User.findById(user.userId);
    if (!userData) {
      throw new AppError('User not found', 404);
    }

    if (index < 0 || index >= userData.addresses.length) {
      throw new AppError('Invalid address index', 400);
    }

    // If updating to default, unset other defaults
    if (address.isDefault) {
      userData.addresses.forEach((addr, i) => {
        if (i !== index) {
          addr.isDefault = false;
        }
      });
    }

    userData.addresses[index] = address;
    await userData.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: userData.addresses,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
