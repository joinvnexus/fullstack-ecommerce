import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';
import { authenticate, authorizeAdmin } from '../utils/auth.js';
import { validate } from '../utils/validation.js';
import { createProductSchema } from '../utils/validation.js';
import { AppError } from '../middleware/errorHandler.js';
import { cacheService } from '../services/cache.service.js';
import { logAdminAction } from '../services/admin/auditService.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      status = 'active',
      search,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    // Create cache key from query parameters
    const cacheKey = `products:${JSON.stringify({
      page,
      limit,
      category,
      minPrice,
      maxPrice,
      status,
      search,
      sort,
      order,
    })}`;

    // Check cache first
    const cachedResult = await cacheService.getCachedProductsList(cacheKey);
    if (cachedResult) {
      return res.json({
        success: true,
        data: cachedResult.products,
        pagination: cachedResult.pagination,
        cached: true,
      });
    }

    // Build query
    const query: any = {};

    // Filter by status (default: active)
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = Number(minPrice);
      if (maxPrice) query['price.amount'].$lte = Number(maxPrice);
    }

    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    const sortOptions: any = {};
    sortOptions[sort as string] = order === 'asc' ? 1 : -1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit));
    const result = {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    };

    // Cache the result for 30 minutes
    await cacheService.cacheProductsList(cacheKey, result, 1800);

    res.json({
      success: true,
      data: products,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

// Get single product by slug (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Get related products (same category)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
    })
      .limit(4)
      .select('title slug price images');

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  validate(createProductSchema),
  async (req, res, next) => {
    try {
      const productData = req.body;

      // Check if slug already exists
      const existingProduct = await Product.findOne({ 
        slug: productData.slug 
      });
      if (existingProduct) {
        throw new AppError('Product with this slug already exists', 400);
      }

      // Check if SKU already exists
      const existingSku = await Product.findOne({ 
        sku: productData.sku 
      });
      if (existingSku) {
        throw new AppError('Product with this SKU already exists', 400);
      }

      // Check if category exists
      const category = await Category.findById(productData.category);
      if (!category) {
        throw new AppError('Category not found', 404);
      }

      const product = new Product(productData);
      await product.save();

      // Log audit action
      await logAdminAction({
        adminId: (req as any).user.userId,
        action: 'create',
        resource: 'product',
        resourceId: product._id.toString(),
        newValues: productData,
        ip: req.ip || req.connection.remoteAddress || '',
        userAgent: req.get('User-Agent') || '',
      });

      // Invalidate cache
      await cacheService.invalidateProductsCache();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update product (admin only)
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Convert id to ObjectId
      const productId = new mongoose.Types.ObjectId(id);

      // If updating slug, check for duplicates
      if (updates.slug) {
        const existingProduct = await Product.findOne({
          slug: updates.slug,
          _id: { $ne: productId },
        });
        if (existingProduct) {
          throw new AppError('Another product with this slug exists', 400);
        }
      }

      // If updating SKU, check for duplicates
      if (updates.sku) {
        const existingSku = await Product.findOne({
          sku: updates.sku,
          _id: { $ne: productId },
        });
        if (existingSku) {
          throw new AppError('Another product with this SKU exists', 400);
        }
      }

      const oldProduct = await Product.findById(productId);
      if (!oldProduct) {
        throw new AppError('Product not found', 404);
      }

      const product = await Product.findByIdAndUpdate(
        productId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      // Log audit action
      await logAdminAction({
        adminId: (req as any).user.userId,
        action: 'update',
        resource: 'product',
        resourceId: productId.toString(),
        oldValues: oldProduct.toObject(),
        newValues: updates,
        ip: req.ip || req.connection.remoteAddress || '',
        userAgent: req.get('User-Agent') || '',
      });

      // Invalidate cache
      await cacheService.invalidateProductsCache();
      await cacheService.invalidateProductCache(productId.toString());

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete product (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Convert id to ObjectId
    const productId = new mongoose.Types.ObjectId(id);

    const oldProduct = await Product.findById(productId);
    if (!oldProduct) {
      throw new AppError('Product not found', 404);
    }

    // Soft delete: change status to archived
    const product = await Product.findByIdAndUpdate(
      productId,
      { status: 'archived' },
      { new: true }
    );

    // Log audit action
    await logAdminAction({
      adminId: (req as any).user.userId,
      action: 'delete',
      resource: 'product',
      resourceId: productId.toString(),
      oldValues: oldProduct.toObject(),
      ip: req.ip || req.connection.remoteAddress || '',
      userAgent: req.get('User-Agent') || '',
    });

    // Invalidate cache
    await cacheService.invalidateProductsCache();
    await cacheService.invalidateProductCache(productId.toString());

    res.json({
      success: true,
      message: 'Product archived successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Get products by category
router.get('/category/:categorySlug', async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Find category
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Get all subcategories (if any)
    const categoryIds = [category._id];
    if (category.children && category.children.length > 0) {
      categoryIds.push(...category.children);
    }

    // Build query
    const query = {
      category: { $in: categoryIds },
      status: 'active',
    };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: products,
      category,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;