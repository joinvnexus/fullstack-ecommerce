import Order from '../../models/Order.js';
import type { IOrder } from '../../models/Order.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAdminAction } from './auditService.js';

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export const getOrders = async (filters: OrderFilters) => {
  const {
    page = 1,
    limit = 20,
    status,
    userId,
    startDate,
    endDate,
  } = filters;

  const query: any = {};

  if (status) query.status = status;
  if (userId) query.userId = userId;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query),
  ]);

  return {
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOrder = async (id: string) => {
  const order = await Order.findById(id)
    .populate('userId', 'name email')
    .populate('items.productId', 'title images');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return {
    success: true,
    data: order,
  };
};

export const updateOrderStatus = async (id: string, status: string, adminInfo: any) => {
  // Validate status
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  // Get old order for audit
  const oldOrder = await Order.findById(id);
  if (!oldOrder) {
    throw new AppError('Order not found', 404);
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate('userId', 'name email');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Log audit
  await logAdminAction({
    adminId: adminInfo.userId,
    action: 'update',
    resource: 'order',
    resourceId: id,
    oldValues: { status: oldOrder.status },
    newValues: { status },
    ip: adminInfo.ip || 'unknown',
    userAgent: adminInfo.userAgent || 'unknown',
  });

  return {
    success: true,
    message: 'Order status updated successfully',
    data: order,
  };
};

export const bulkUpdateOrderStatus = async (orderIds: string[], status: string, adminInfo: any) => {
  // Validate status
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const result = await Order.updateMany(
    { _id: { $in: orderIds } },
    { status }
  );

  // Log bulk action
  await logAdminAction({
    adminId: adminInfo.userId,
    action: `bulk_update_status`,
    resource: 'order',
    resourceId: orderIds.join(','),
    newValues: { status, orderIds },
    ip: adminInfo.ip || 'unknown',
    userAgent: adminInfo.userAgent || 'unknown',
  });

  return {
    success: true,
    message: `Updated ${result.modifiedCount} orders`,
    data: result,
  };
};