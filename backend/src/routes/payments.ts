import express from 'express';
import Order from '../models/Order.js';
import { authenticate } from '../utils/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { paymentDemoService } from '../services/paymentDemo.js';

const router = express.Router();

// Process payment (demo version)
router.post('/process', authenticate, async (req, res, next) => {
  try {
    const { orderId, paymentMethod, phone } = req.body;
    const userId = (req as any).user.userId;

    // Get order
    const order = await Order.findOne({
      _id: orderId,
      userId,
      status: 'pending',
    });

    if (!order) {
      throw new AppError('Order not found or already processed', 404);
    }

    let paymentResult;
    const amount = order.totals.grandTotal;

    // Process based on payment method
    switch (paymentMethod) {
      case 'card':
        paymentResult = await paymentDemoService.processPayment(orderId, amount, 'Credit Card');
        break;
      
      case 'bkash':
        if (!phone) {
          throw new AppError('Phone number is required for bKash payment', 400);
        }
        paymentResult = await paymentDemoService.processBkashPayment(orderId, amount, phone);
        break;
      
      case 'nagad':
        if (!phone) {
          throw new AppError('Phone number is required for Nagad payment', 400);
        }
        paymentResult = await paymentDemoService.processNagadPayment(orderId, amount, phone);
        break;
      
      case 'paypal':
        paymentResult = await paymentDemoService.processPayment(orderId, amount, 'PayPal');
        break;
      
      default:
        throw new AppError('Invalid payment method', 400);
    }

    // Update order based on payment result
    if (paymentResult.success) {
      order.status = 'processing';
      order.payment.status = 'succeeded';
      order.payment.provider = paymentMethod;
      order.payment.transactionId = paymentResult.transactionId;
      
      // Add payment note
      if (order.notes) {
        order.notes += `\nPayment: ${paymentResult.message} (${paymentResult.transactionId})`;
      } else {
        order.notes = `Payment: ${paymentResult.message} (${paymentResult.transactionId})`;
      }
    } else {
      order.payment.status = 'failed';
      order.payment.provider = paymentMethod;
    }

    await order.save();

    res.json({
      success: true,
      message: paymentResult.message,
      data: {
        order,
        payment: paymentResult,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get payment methods
router.get('/methods', async (req, res, next) => {
  try {
    const methods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, MasterCard, or American Express',
        icon: '💳',
        supportedCurrencies: ['USD', 'BDT', 'EUR'],
        demoInfo: 'Demo: Use any card number. No real payment processed.',
      },
      {
        id: 'bkash',
        name: 'bKash',
        description: 'Mobile financial service in Bangladesh',
        icon: '📱',
        supportedCurrencies: ['BDT'],
        demoInfo: 'Demo: Enter any Bangladeshi phone number (01XXXXXXXXX)',
        requiresPhone: true,
      },
      {
        id: 'nagad',
        name: 'Nagad',
        description: 'Digital financial service in Bangladesh',
        icon: '📲',
        supportedCurrencies: ['BDT'],
        demoInfo: 'Demo: Enter any Bangladeshi phone number (01XXXXXXXXX)',
        requiresPhone: true,
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: '🌐',
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        demoInfo: 'Demo: No actual PayPal integration. Payment simulated.',
      },
    ];

    res.json({
      success: true,
      data: methods,
    });
  } catch (error) {
    next(error);
  }
});

export default router;