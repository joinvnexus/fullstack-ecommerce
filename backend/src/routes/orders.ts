import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authenticate, authorizeAdmin } from '../utils/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { paymentService } from '../services/payment.service.js';
import mongoose from 'mongoose';
import { validate, createOrderSchema } from '../utils/validation.js';

const router = express.Router();

// Create order from cart
router.post('/', authenticate, validate(createOrderSchema), async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const {
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      notes,
      guestId
    } = req.body;

    console.log('Order creation request:', { userId, shippingAddress, shippingMethod });

    // Get user cart (or merge guest cart first)
    let cart;
    if (guestId) {
      // Merge guest cart with user cart
      const guestCart = await Cart.findOne({ guestId });
      if (guestCart && guestCart.items.length > 0) {
        const userCart = await Cart.findOne({ userId }) || new Cart({ userId, items: [] });
        
        // Merge items
        guestCart.items.forEach(guestItem => {
          const existingItemIndex = userCart.items.findIndex(userItem => 
            userItem.productId.toString() === guestItem.productId.toString() &&
            userItem.variantId?.toString() === guestItem.variantId?.toString()
          );

          if (existingItemIndex > -1) {
            userCart.items[existingItemIndex]!.quantity += guestItem.quantity;
          } else {
            userCart.items.push(guestItem);
          }
        });

        await userCart.save();
        cart = userCart;
        
        // Delete guest cart
        await Cart.deleteOne({ guestId });
      }
    }

    if (!cart) {
      cart = await Cart.findOne({ userId });
    }

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Calculate totals
    let subtotal = 0;
    for (const cartItem of cart.items) {
      subtotal += cartItem.unitPrice * cartItem.quantity;
    }
    const shippingCost = shippingMethod?.cost || 0;
    const tax = subtotal * 0.1;
    const grandTotal = subtotal + shippingCost + tax;

    // Prepare order data
    const orderData = {
      userId,
      shippingAddress: shippingAddress || user.addresses.find(addr => addr.isDefault),
      billingAddress: billingAddress || shippingAddress,
      contactInfo: {
        email: user.email,
        phone: user.phone || shippingAddress?.phone || '',
      },
      totals: {
        subtotal,
        shipping: shippingCost,
        tax,
        discount: 0,
        grandTotal,
      },
      currency: 'USD',
      status: 'pending' as const,
      payment: {
        provider: paymentMethod || 'pending',
        status: 'pending' as const,
        amount: grandTotal,
        currency: 'USD',
      },
      shippingMethod: shippingMethod || {
        name: 'Standard Shipping',
        cost: 0,
        estimatedDays: 7,
      },
      notes,
    };

    console.log('Order data prepared:', orderData);

    // Use MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    let order;

    try {
      // Populate product details
      await cart.populate({
        path: 'items.productId',
        select: 'title sku price stock',
      });

      // Validate stock and prepare order items
      const orderItems = [];
      let actualSubtotal = 0;

      for (const cartItem of cart.items) {
        const product = cartItem.productId as any;

        if (product.stock < cartItem.quantity) {
          throw new AppError(`Insufficient stock for ${product.title}`, 400);
        }

        const itemTotal = cartItem.unitPrice * cartItem.quantity;
        actualSubtotal += itemTotal;

        orderItems.push({
          productId: product._id,
          variantId: cartItem.variantId,
          name: product.title,
          sku: product.sku,
          quantity: cartItem.quantity,
          unitPrice: cartItem.unitPrice,
          totalPrice: itemTotal,
        });
      }

      // Recalculate totals
      const actualTax = actualSubtotal * 0.1;
      const actualGrandTotal = actualSubtotal + shippingCost + actualTax;

      orderData.totals.subtotal = actualSubtotal;
      orderData.totals.tax = actualTax;
      orderData.totals.grandTotal = actualGrandTotal;
      orderData.payment.amount = actualGrandTotal;

      // Create order
      order = new Order({
        ...orderData,
        items: orderItems,
      });

      // Generate order number
      if (!order.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        order.orderNumber = `ORD${year}${month}${day}${randomNum}`;
      }

      await order.save({ session });

      // Reserve stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        }, { session });
      }

      // Clear user cart
      cart.items = [];
      await cart.save({ session });

      // Commit transaction
      await session.commitTransaction();
      console.log('Order created successfully:', order.orderNumber);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// Get user orders
router.get('/my-orders', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;
    const { page = 1, limit = 10, status } = req.query;

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId,
    }).populate('items.productId', 'title slug images');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Get all orders
router.get('/', authenticate, authorizeAdmin, async (req, res, next) => {
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

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    if (search) {
      // Search by order number or customer email
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
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

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: orders,
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

// Admin: Update order status
router.patch('/:id/status', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { 
        $set: { 
          status,
          ...(trackingNumber && { trackingNumber }),
          updatedAt: new Date(),
        } 
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // TODO: Send notification to customer about status change

    res.json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Process refund
router.post('/:id/refund', authenticate, authorizeAdmin, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const order = await Order.findById(new mongoose.Types.ObjectId(id)).session(session);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status !== 'delivered') {
      throw new AppError('Only delivered orders can be refunded', 400);
    }

    const refundAmount = amount || order.totals.grandTotal;

    // Update order status
    order.status = 'refunded';
    order.payment.status = 'refunded';

    // Add refund note
    order.notes = `${order.notes || ''}\nRefund processed: ${refundAmount} - ${reason}`;

    await order.save({ session });

    // Process refund with payment provider
    await paymentService.createRefund(order._id.toString(), refundAmount);

    // Restock products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      }, { session });
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

export default router;
