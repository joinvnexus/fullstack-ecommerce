import type { Response } from 'express';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import AuthUtils from './auth.js';

// Helper to generate tokens and set cookies
export const generateAndSetTokens = async (res: Response, user: any) => {
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

  return { accessToken, refreshTokenResult };
};

// Helper to clear user response data
export const sanitizeUserResponse = (user: any) => {
  const { password: pwd, ...userResponse } = user.toObject ? user.toObject() : user;
  return userResponse;
};