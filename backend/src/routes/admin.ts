import express from 'express';
import { authenticate, authorizeAdmin } from '../utils/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticate, authorizeAdmin);

// Dashboard stats
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const [totalRevenue, totalOrders, totalCustomers, totalProducts] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $in: ['processing', 'shipped', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$totals.grandTotal' } } }
      ]),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ status: 'active' }),
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Top products
    const topProducts = await Product.aggregate([
      { $match: { status: 'active' } },
      { $sample: { size: 5 } },
      { $project: { title: 1, price: 1, stock: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue: totalRevenue[0]?.total || 0,
          totalOrders,
          totalCustomers,
          totalProducts,
        },
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all products (admin view)
router.get('/products', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      category, 
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = {};
    sortOptions[sort as string] = order === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create product
router.post('/products', async (req, res, next) => {
  try {
    const productData = req.body;

    // Check for duplicate SKU
    const existingSku = await Product.findOne({ sku: productData.sku });
    if (existingSku) {
      throw new AppError('Product with this SKU already exists', 400);
    }

    // Check for duplicate slug
    const existingSlug = await Product.findOne({ slug: productData.slug });
    if (existingSlug) {
      throw new AppError('Product with this slug already exists', 400);
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Update product
router.put('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check for duplicate SKU
    if (updates.sku) {
      const existingSku = await Product.findOne({
        sku: updates.sku,
        _id: { $ne: id },
      });
      if (existingSku) {
        throw new AppError('Another product with this SKU exists', 400);
      }
    }

    // Check for duplicate slug
    if (updates.slug) {
      const existingSlug = await Product.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      });
      if (existingSlug) {
        throw new AppError('Another product with this slug exists', 400);
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete by setting status to archived
    const product = await Product.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      message: 'Product archived successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Bulk product operations
router.post('/products/bulk', async (req, res, next) => {
  try {
    const { action, productIds, data } = req.body;

    if (!action || !productIds || !Array.isArray(productIds)) {
      throw new AppError('Invalid request', 400);
    }

    let result;
    switch (action) {
      case 'delete':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { status: 'archived' }
        );
        break;
      case 'update_status':
        if (!data.status) {
          throw new AppError('Status is required', 400);
        }
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { status: data.status }
        );
        break;
      case 'update_price':
        if (!data.price) {
          throw new AppError('Price is required', 400);
        }
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { 'price.amount': data.price }
        );
        break;
      default:
        throw new AppError('Invalid action', 400);
    }

    res.json({
      success: true,
      message: `Bulk ${action} completed`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Get all orders (admin view)
router.get('/orders', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      startDate, 
      endDate,
      search 
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update order status
router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { 
        status,
        ...(trackingNumber && { trackingNumber }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// Get all users (admin view)
router.get('/users', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query: any = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = {};
    sortOptions[sort as string] = order === 'asc' ? 1 : -1;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'User role updated',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;