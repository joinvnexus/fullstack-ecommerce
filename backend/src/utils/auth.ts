import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { SignOptions } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

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
  static generateRefreshToken(payload: JwtPayload): string {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
    const options: SignOptions = { expiresIn: "30d" };
    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
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
  static setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
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

    res.cookie('refreshToken', refreshToken, cookieOptions);
  }

  // Clear authentication cookies
  static clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const decoded = AuthUtils.verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    // Attach user info to request
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Admin authorization middleware
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  if (user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }

  next();
};

export default AuthUtils;
