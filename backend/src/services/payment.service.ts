import Stripe from 'stripe';
import mongoose from 'mongoose';
import type { IOrder } from '../models/Order.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { emailService } from './email.service.js';

export class PaymentService {
  private stripe: Stripe | null = null;
  private initialized = false;
  private webhookSecret: string = '';

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Validate required environment variables
    if (!stripeSecretKey) {
      logger.error('❌ STRIPE_SECRET_KEY environment variable is required');
      this.initialized = false;
      return;
    }

    if (!stripeWebhookSecret) {
      logger.error('❌ STRIPE_WEBHOOK_SECRET environment variable is required');
      this.initialized = false;
      return;
    }

    // Validate key format (basic check)
    if (!stripeSecretKey.startsWith('sk_')) {
      logger.error('❌ Invalid STRIPE_SECRET_KEY format. Expected sk_test_ or sk_live_');
      this.initialized = false;
      return;
    }

    if (!stripeWebhookSecret.startsWith('whsec_')) {
      logger.error('❌ Invalid STRIPE_WEBHOOK_SECRET format. Expected whsec_ prefix');
      this.initialized = false;
      return;
    }

    try {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16' as any,
      });
      this.webhookSecret = stripeWebhookSecret;
      this.initialized = true;
      logger.info('✅ Stripe payment service initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize Stripe:', error);
      this.initialized = false;
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized || !this.stripe) {
      throw new Error('Stripe payment service is not properly configured. Please check your environment variables.');
    }
  }

  // Create Stripe payment intent
  async createStripePaymentIntent(order: IOrder) {
    this.ensureInitialized();
    
    try {
      // Convert amount to cents (Stripe uses smallest currency unit)
      const amount = Math.round(order.totals.grandTotal * 100);

      // Create payment intent
      const paymentIntent = await this.stripe!.paymentIntents.create({
        amount,
        currency: order.currency.toLowerCase(),
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          userId: order.userId.toString(),
        },
        description: `Order #${order.orderNumber}`,
        shipping: {
          address: {
            line1: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postal_code: order.shippingAddress.zipCode,
            country: order.shippingAddress.country,
          },
          name: order.contactInfo.email,
          phone: order.shippingAddress.phone,
        },
      });

      // Update order with payment intent
      await Order.findByIdAndUpdate(order._id, {
        'payment.intentId': paymentIntent.id,
        'payment.provider': 'stripe',
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      logger.error('Error creating Stripe payment intent:', error);
      throw error;
    }
  }

  // Handle Stripe webhook events
  async handleStripeWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.canceled':
          await this.handlePaymentCancelled(event.data.object as Stripe.PaymentIntent);
          break;
        case 'charge.refunded':
          await this.handleRefund(event.data.object as Stripe.Charge);
          break;
        case 'charge.dispute.created':
          await this.handleDispute(event.data.object as Stripe.Dispute);
          break;
      }
    } catch (error) {
      logger.error('Error handling Stripe webhook:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'processing',
        'payment.status': 'succeeded',
        'payment.chargeId': paymentIntent.latest_charge as string,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('items.productId');

    if (order) {
      // Send order confirmation email
      try {
        const user = await User.findById(order.userId);
        if (user) {
          await emailService.sendOrderConfirmation({
            user,
            order,
            items: order.items
          });
        }
      } catch (emailError) {
        logger.error('Failed to send order confirmation email:', emailError);
      }

      // Update inventory
      logger.info(`✅ Order ${order.orderNumber} payment succeeded`);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (order) {
        await Order.findByIdAndUpdate(
          orderId,
          {
            status: 'pending',
            'payment.status': 'failed',
            updatedAt: new Date(),
          },
          { session }
        );

        // Restore stock
        await this.restoreOrderStock(order, session);
      }

      await session.commitTransaction();
      logger.error(`❌ Order ${orderId} payment failed`);
    } catch (error) {
      await session.abortTransaction();
      logger.error(`Error handling payment failure for order ${orderId}:`, error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async handlePaymentCancelled(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (order) {
        await Order.findByIdAndUpdate(
          orderId,
          {
            status: 'cancelled',
            'payment.status': 'cancelled',
            updatedAt: new Date(),
          },
          { session }
        );

        // Restore stock
        await this.restoreOrderStock(order, session);
      }

      await session.commitTransaction();
      logger.error(`❌ Order ${orderId} payment cancelled`);
    } catch (error) {
      await session.abortTransaction();
      logger.error(`Error handling payment cancellation for order ${orderId}:`, error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async handleRefund(charge: Stripe.Charge) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findOne({ 'payment.chargeId': charge.id }).session(session);

      if (order) {
        await Order.findByIdAndUpdate(
          order._id,
          {
            status: 'refunded',
            'payment.status': 'refunded',
            updatedAt: new Date(),
          },
          { session }
        );

        // Restore stock
        await this.restoreOrderStock(order, session);

        logger.info(`💰 Order ${order.orderNumber} refunded`);
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      logger.error(`Error handling refund for charge ${charge.id}:`, error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async handleDispute(dispute: Stripe.Dispute) {
    const chargeId = typeof dispute.charge === 'string'
      ? dispute.charge
      : dispute.charge.id;
    const order = await Order.findOne({
      'payment.chargeId': chargeId
    });
    
    if (order) {
      await Order.findByIdAndUpdate(
        order._id,
        {
          status: 'pending',
          'payment.status': 'disputed',
          updatedAt: new Date(),
        }
      );

      // Send notification to admin
      logger.warn(`⚠️ Order ${order.orderNumber} disputed`);
    }
  }

  // Create refund
  async createRefund(orderId: string, amount?: number) {
    this.ensureInitialized();
    
    try {
      const order = await Order.findById(orderId);
      
      if (!order || !order.payment.chargeId) {
        throw new Error('Order or charge ID not found');
      }

      const refundParams: Stripe.RefundCreateParams = {
        charge: order.payment.chargeId,
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
        },
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await this.stripe!.refunds.create(refundParams);

      // Update order status after successful refund
      await Order.findByIdAndUpdate(orderId, {
        status: 'refunded',
        'payment.status': 'refunded',
        updatedAt: new Date(),
      });

    } catch (error) {
      logger.error('Error creating refund:', error);
      throw error;
    }
  }

  // Restore order stock when payment fails or is cancelled
  private async restoreOrderStock(order: any, session?: any) {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      }, session ? { session } : {});
    }
    logger.info(`🔄 Stock restored for order ${order.orderNumber}`);
  }

  // Verify Stripe signature
  verifyStripeSignature(payload: string, signature: string) {
    this.ensureInitialized();
    
    try {
      return this.stripe!.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
    } catch (error) {
      logger.error('Error verifying Stripe signature:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
