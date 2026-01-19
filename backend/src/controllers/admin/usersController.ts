import type { Request, Response, NextFunction } from 'express';
import * as userService from '../../services/admin/userService.js';

// Helper to get admin info from request
const getAdminInfo = (req: Request) => ({
  userId: (req as any).user?.userId,
  ip: req.ip || req.connection.remoteAddress,
  userAgent: req.get('User-Agent'),
});

// Get all users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, role, search } = req.query;
    const result = await userService.getUsers({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      role: role as string,
      search: search as string,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Update user role (admin only)
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const adminInfo = getAdminInfo(req);
    const result = await userService.updateUserRole(id, role, adminInfo);
    res.json(result);
  } catch (error) {
    next(error);
  }
};