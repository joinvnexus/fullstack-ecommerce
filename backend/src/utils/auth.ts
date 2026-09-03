import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { SignOptions } from "jsonwebtoken";
import type { Response } from "express";
import RefreshToken from "../models/RefreshToken.js";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
  tokenId?: string; // For refresh token rotation
}

class AuthUtils {
  // Generate JWT token
  static generateToken(payload: JwtPayload): string {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const expiresIn: number =
      Number(process.env.JWT_EXPIRE) || 7 * 24 * 60 * 60; // 7 days in seconds
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  // Verify JWT token
  static verifyToken(token: string): JwtPayload | null {
    const JWT_SECRET = process.env.JWT_SECRET as string;
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare password
  static async comparePassword(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Generate refresh token
  static generateRefreshToken(payload: Omit<JwtPayload, 'tokenId'>): { token: string; tokenId: string } {
    const tokenId = crypto.randomUUID();
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
    const options: SignOptions = { expiresIn: "30d" };
    const token = jwt.sign({ ...payload, tokenId }, JWT_REFRESH_SECRET, options);
    return { token, tokenId };
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): JwtPayload | null {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }

  // Set authentication cookies
  static setAuthCookies(res: Response, accessToken: string, refreshTokenResult: { token: string; tokenId: string }): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: (Number(process.env.JWT_EXPIRE) || 7 * 24 * 60 * 60) * 1000,
    });

    res.cookie('refreshToken', refreshTokenResult.token, cookieOptions);
  }

  // Clear authentication cookies
  static clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}

export default AuthUtils;

// Generate tokens and set cookies for a user (combines token generation + DB storage + cookies)
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

// Strip sensitive fields from user object for safe response
export const sanitizeUserResponse = (user: any) => {
  const { password: pwd, ...userResponse } = user.toObject ? user.toObject() : user;
  return userResponse;
};
