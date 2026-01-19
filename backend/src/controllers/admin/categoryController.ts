import type { Request, Response, NextFunction } from 'express';
import * as categoryService from '../../services/admin/categoryService.js';

// Helper to get admin info from request
const getAdminInfo = (req: Request) => ({
  userId: (req as any).user?.userId,
  ip: req.ip || req.connection.remoteAddress,
  userAgent: req.get('User-Agent'),
});

// Get all categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, parent, search } = req.query;
    const result = await categoryService.getCategories({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      parent: parent as string,
      search: search as string,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get single category
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }
    const result = await categoryService.getCategory(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Create category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminInfo = getAdminInfo(req);
    const result = await categoryService.createCategory(req.body, adminInfo);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }
    const adminInfo = getAdminInfo(req);
    const result = await categoryService.updateCategory(id, req.body, adminInfo);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }
    const adminInfo = getAdminInfo(req);
    const result = await categoryService.deleteCategory(id, adminInfo);
    res.json(result);
  } catch (error) {
    next(error);
  }
};