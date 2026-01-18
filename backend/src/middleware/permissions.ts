import type { Request, Response, NextFunction } from 'express';
import { hasPermission } from '../utils/rolePermissions.js';
import { AppError } from './errorHandler.js';

// Middleware to check specific permission
export const checkPermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Check if user has the required permission
    if (!hasPermission(user.role, resource, action)) {
      res.status(403).json({
        message: 'Insufficient permissions',
        required: `${resource}.${action}`,
        role: user.role
      });
      return;
    }

    next();
  };
};

// Middleware to check multiple permissions (OR condition)
export const checkAnyPermission = (permissions: Array<{ resource: string; action: string }>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Check if user has any of the required permissions
    const hasAnyPermission = permissions.some(({ resource, action }) =>
      hasPermission(user.role, resource, action)
    );

    if (!hasAnyPermission) {
      res.status(403).json({
        message: 'Insufficient permissions',
        required: permissions.map(p => `${p.resource}.${p.action}`),
        role: user.role
      });
      return;
    }

    next();
  };
};

// Middleware to check admin role only (backward compatibility)
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  next();
};

// Helper function to validate role
export const validateRole = (role: string): boolean => {
  const validRoles = ['customer', 'admin', 'manager', 'support', 'vendor'];
  return validRoles.includes(role);
};

// Middleware to validate role changes
export const validateRoleChange = (req: Request, res: Response, next: NextFunction): void => {
  const { role } = req.body;

  if (!role) {
    res.status(400).json({ message: 'Role is required' });
    return;
  }

  if (!validateRole(role)) {
    res.status(400).json({
      message: 'Invalid role',
      validRoles: ['customer', 'admin', 'manager', 'support', 'vendor']
    });
    return;
  }

  next();
};