import type { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../../services/admin/dashboardService.js';

// Get dashboard stats
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};