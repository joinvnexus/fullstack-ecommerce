import User from '../../models/User.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAdminAction } from './auditService.js';

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export const getUsers = async (filters: UserFilters) => {
  const {
    page = 1,
    limit = 20,
    role,
    search,
  } = filters;

  const query: any = {};

  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return {
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateUserRole = async (id: string, role: string, adminInfo: any) => {
  // Validate role
  const validRoles = ['customer', 'admin'];
  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  // Get old user for audit
  const oldUser = await User.findById(id);
  if (!oldUser) {
    throw new AppError('User not found', 404);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Log audit
  await logAdminAction({
    adminId: adminInfo.userId,
    action: 'update',
    resource: 'user',
    resourceId: id,
    oldValues: { role: oldUser.role },
    newValues: { role },
    ip: adminInfo.ip || 'unknown',
    userAgent: adminInfo.userAgent || 'unknown',
  });

  return {
    success: true,
    message: 'User role updated successfully',
    data: user,
  };
};