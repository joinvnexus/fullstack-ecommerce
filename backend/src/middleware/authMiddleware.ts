import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import AuthUtils from '../utils/auth.js';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: 'customer' | 'admin';
  };
}

const getClientIP = (req: Request): string => {
  return req.ip || req.socket.remoteAddress || 'unknown';
};

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const clientIP = getClientIP(req);

  try {
    const token = req.cookies.accessToken;

    if (!token) {
      logger.warn('Authentication failed: no token provided', {
        ip: clientIP,
        path: req.path,
        method: req.method,
      });
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = AuthUtils.verifyToken(token);

    if (!decoded) {
      logger.warn('Authentication failed: invalid or expired token', {
        ip: clientIP,
        path: req.path,
        method: req.method,
      });
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    (req as AuthenticatedRequest).user = decoded;
    logger.debug('Authentication successful', {
      userId: decoded.userId,
      email: decoded.email,
      ip: clientIP,
    });
    next();
  } catch (error) {
    logger.error('Authentication error', {
      ip: clientIP,
      path: req.path,
      method: req.method,
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Admin authorization middleware
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (user.role !== 'admin') {
    logger.warn('Authorization denied: admin access required', {
      userId: user.userId,
      email: user.email,
      ip: getClientIP(req),
      path: req.path,
    });
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  next();
};