import Category from '../../models/Category.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAdminAction } from './auditService.js';

export interface CategoryFilters {
  page?: number;
  limit?: number;
  parent?: string;
  search?: string;
}

export const getCategories = async (filters: CategoryFilters) => {
  const {
    page = 1,
    limit = 20,
    parent,
    search,
  } = filters;

  const query: any = {};

  if (parent) query.parent = parent;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find(query)
      .populate('parent', 'name')
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Category.countDocuments(query),
  ]);

  return {
    success: true,
    data: categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCategory = async (id: string) => {
  const category = await Category.findById(id)
    .populate('parent', 'name')
    .populate('children', 'name slug');

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return {
    success: true,
    data: category,
  };
};

export const createCategory = async (categoryData: any, adminInfo: any) => {
  // Check for duplicate slug
  const existingSlug = await Category.findOne({ slug: categoryData.slug });
  if (existingSlug) {
    throw new AppError('Category with this slug already exists', 400);
  }

  const category = new Category(categoryData);
  await category.save();

  // Update parent children if parent exists
  if (categoryData.parent) {
    await Category.findByIdAndUpdate(categoryData.parent, {
      $push: { children: category._id }
    });
  }

  // Log audit
  await logAdminAction({
    adminId: adminInfo.userId,
    action: 'create',
    resource: 'category',
    resourceId: category._id.toString(),
    newValues: categoryData,
    ip: adminInfo.ip || 'unknown',
    userAgent: adminInfo.userAgent || 'unknown',
  });

  return {
    success: true,
    message: 'Category created successfully',
    data: category,
  };
};

export const updateCategory = async (id: string, updates: any, adminInfo: any) => {
  // Get old category for audit
  const oldCategory = await Category.findById(id);
  if (!oldCategory) {
    throw new AppError('Category not found', 404);
  }

  // Check for duplicate slug
  if (updates.slug) {
    const existingSlug = await Category.findOne({
      slug: updates.slug,
      _id: { $ne: id },
    });
    if (existingSlug) {
      throw new AppError('Another category with this slug exists', 400);
    }
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('parent', 'name');

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Update parent children references if parent changed
  if (updates.parent !== undefined) {
    // Remove from old parent
    if (oldCategory.parent) {
      await Category.findByIdAndUpdate(oldCategory.parent, {
        $pull: { children: id }
      });
    }
    // Add to new parent
    if (updates.parent) {
      await Category.findByIdAndUpdate(updates.parent, {
        $push: { children: id }
      });
    }
  }

  // Log audit
  await logAdminAction({
    adminId: adminInfo.userId,
    action: 'update',
    resource: 'category',
    resourceId: id,
    oldValues: oldCategory.toObject(),
    newValues: updates,
    ip: adminInfo.ip || 'unknown',
    userAgent: adminInfo.userAgent || 'unknown',
  });

  return {
    success: true,
    message: 'Category updated successfully',
    data: category,
  };
};

export const deleteCategory = async (id: string, adminInfo: any) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Check if category has children
  if (category.children && category.children.length > 0) {
    throw new AppError('Cannot delete category with children. Move or delete children first.', 400);
  }

  // Remove from parent children
  if (category.parent) {
    await Category.findByIdAndUpdate(category.parent, {
      $pull: { children: id }
    });
  }

  await Category.findByIdAndDelete(id);

  // Log audit
  await logAdminAction({
    adminId: adminInfo.userId,
    action: 'delete',
    resource: 'category',
    resourceId: id,
    ip: adminInfo.ip || 'unknown',
    userAgent: adminInfo.userAgent || 'unknown',
  });

  return {
    success: true,
    message: 'Category deleted successfully',
  };
};