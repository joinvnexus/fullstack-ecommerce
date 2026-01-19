import type { Request, Response, NextFunction } from 'express';
import * as orderService from '../../services/admin/orderService.js';

// Helper to get admin info from request
const getAdminInfo = (req: Request) => ({
  userId: (req as any).user?.userId,
  ip: req.ip || req.connection.remoteAddress,
  userAgent: req.get('User-Agent'),
});

// Get all orders
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, status, userId, startDate, endDate } = req.query;
    const result = await orderService.getOrders({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status: status as string,
      userId: userId as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get single order
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    const result = await orderService.getOrder(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    const adminInfo = getAdminInfo(req);
    const result = await orderService.updateOrderStatus(id, status, adminInfo);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Bulk update order status
export const bulkUpdateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderIds, status } = req.body;
    const adminInfo = getAdminInfo(req);
    const result = await orderService.bulkUpdateOrderStatus(orderIds, status, adminInfo);
    res.json(result);
  } catch (error) {
    next(error);
  }
};