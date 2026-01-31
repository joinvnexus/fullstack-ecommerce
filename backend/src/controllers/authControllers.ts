import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import PasswordReset from '../models/PasswordReset.js';
import { AppError } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import logger from '../utils/logger.js';
import AuthUtils from '../utils/auth.js';
import { generateAndSetTokens, sanitizeUserResponse } from '../utils/authUtils.js';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// Register new user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    // Generate tokens and set cookies
    await generateAndSetTokens(res, user);

    // Sanitize user response
    const userResponse = sanitizeUserResponse(user);

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
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    // Generate tokens and set cookies
    await generateAndSetTokens(res, user);

    // Sanitize user response
    const userResponse = sanitizeUserResponse(user);

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
};

// Refresh access token
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token required' });
      return;
    }

    const decoded = AuthUtils.verifyRefreshToken(refreshToken);

    if (!decoded || !decoded.tokenId) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    // Check if refresh token exists in DB
    const tokenDoc = await RefreshToken.findOne({ tokenId: decoded.tokenId });
    if (!tokenDoc) {
      res.status(401).json({ message: 'Refresh token not found' });
      return;
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
};

// Get current user profile
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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
};

// Update user profile
export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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
};

// Add address
export const addAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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
};

// Delete address
export const deleteAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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
};

// Change password
export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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
};

// Get user addresses
export const getAddresses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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
};

// Logout
export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;

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
};

// Update address
export const updateAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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
};

// Forgot password - request password reset
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Even if user not found, don't reveal that
    // Just return success to prevent email enumeration
    if (!user) {
      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link will be sent.',
      });
      return;
    }

    // Delete any existing reset tokens for this user
    await PasswordReset.deleteMany({ userId: user._id });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save reset token to database
    await PasswordReset.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
      throw new AppError('Failed to send password reset email. Please try again.', 500);
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link will be sent.',
    });
  } catch (error) {
    next(error);
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new AppError('Token and new password are required', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    // Hash the token to find it in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid reset token
    const resetTokenDoc = await PasswordReset.findOne({
      token: hashedToken,
      expiresAt: { $gt: new Date() },
    });

    if (!resetTokenDoc) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Find user
    const user = await User.findById(resetTokenDoc.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update user's password
    user.password = newPassword;
    await user.save();

    // Delete the reset token
    await PasswordReset.deleteOne({ _id: resetTokenDoc._id });

    // Log the user out of all devices (optional - invalidate all refresh tokens)
    await RefreshToken.deleteMany({ userId: user._id });

    logger.info(`✅ Password reset successful for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset successful. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};