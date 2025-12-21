import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { SignOptions } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
}

// Ensure secrets exist
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

class AuthUtils {
  // Generate JWT token
  static generateToken(payload: JwtPayload): string {
    const expiresIn: number =
      Number(process.env.JWT_EXPIRE) || 7 * 24 * 60 * 60; // 7 days in seconds
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  // Verify JWT token
  static verifyToken(token: string): JwtPayload | null {
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
    const options: SignOptions = { expiresIn: "30d" };
    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }
}

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

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
