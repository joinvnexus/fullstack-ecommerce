import Stripe from 'stripe';
import { IOrder } from '../models/Order.js';
import Order from '../models/Order.js';

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any,
    });
  }

  // Create Stripe payment intent
  async createStripePaymentIntent(order: IOrder) {
    try {
      // Convert amount to cents (Stripe uses smallest currency unit)
      const amount = Math.round(order.totals.grandTotal * 100);

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
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
      console.error('Error creating Stripe payment intent:', error);
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
      console.error('Error handling Stripe webhook:', error);
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
    );

    if (order) {
      // Send order confirmation email
      // Update inventory
      console.log(`✅ Order ${order.orderNumber} payment succeeded`);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    
    await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'pending',
        'payment.status': 'failed',
        updatedAt: new Date(),
      }
    );

    // Restore stock
    // await this.restoreOrderStock(orderId);
    
    console.log(`❌ Order ${orderId} payment failed`);
  }

  private async handlePaymentCancelled(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    
    await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'cancelled',
        'payment.status': 'cancelled',
        updatedAt: new Date(),
      }
    );

    // Restore stock
    // await this.restoreOrderStock(orderId);
    
    console.log(`❌ Order ${orderId} payment cancelled`);
  }

  private async handleRefund(charge: Stripe.Charge) {
    const order = await Order.findOne({ 'payment.chargeId': charge.id });
    
    if (order) {
      await Order.findByIdAndUpdate(
        order._id,
        {
          status: 'refunded',
          'payment.status': 'refunded',
          updatedAt: new Date(),
        }
      );

      // Restore stock if needed
      // await this.restoreOrderStock(order._id);
      
      console.log(`💰 Order ${order.orderNumber} refunded`);
    }
  }

  private async handleDispute(dispute: Stripe.Dispute) {
    const order = await Order.findOne({ 'payment.chargeId': dispute.charge });
    
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
      console.log(`⚠️ Order ${order.orderNumber} disputed`);
    }
  }

  // Create refund
  async createRefund(orderId: string, amount?: number) {
    try {
      const order = await Order.findById(orderId);
      
      if (!order || !order.payment.chargeId) {
        throw new Error('Order or charge ID not found');
      }

      const refund = await this.stripe.refunds.create({
        charge: order.payment.chargeId,
        amount: amount ? Math.round(amount * 100) : undefined,
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
        },
      });

      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        status: 'refunded',
        'payment.status': 'refunded',
        updatedAt: new Date(),
      });

      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  // Verify Stripe signature
  verifyStripeSignature(payload: string, signature: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      console.error('Error verifying Stripe signature:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
// cd backend
// npm install stripe @types/stripe