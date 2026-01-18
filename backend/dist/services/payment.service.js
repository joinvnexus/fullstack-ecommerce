import Stripe from 'stripe';
import Order from '../models/Order.js';
export class PaymentService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || " ", {
            apiVersion: '2023-10-16',
        });
    }
    // Create Stripe payment intent
    async createStripePaymentIntent(order) {
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
        }
        catch (error) {
            console.error('Error creating Stripe payment intent:', error);
            throw error;
        }
    }
    // Handle Stripe webhook events
    async handleStripeWebhook(event) {
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSuccess(event.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailure(event.data.object);
                    break;
                case 'payment_intent.canceled':
                    await this.handlePaymentCancelled(event.data.object);
                    break;
                case 'charge.refunded':
                    await this.handleRefund(event.data.object);
                    break;
                case 'charge.dispute.created':
                    await this.handleDispute(event.data.object);
                    break;
            }
        }
        catch (error) {
            console.error('Error handling Stripe webhook:', error);
            throw error;
        }
    }
    async handlePaymentSuccess(paymentIntent) {
        const orderId = paymentIntent.metadata.orderId;
        const order = await Order.findByIdAndUpdate(orderId, {
            status: 'processing',
            'payment.status': 'succeeded',
            'payment.chargeId': paymentIntent.latest_charge,
            updatedAt: new Date(),
        }, { new: true });
        if (order) {
            // Send order confirmation email
            // Update inventory
            console.log(`✅ Order ${order.orderNumber} payment succeeded`);
        }
    }
    async handlePaymentFailure(paymentIntent) {
        const orderId = paymentIntent.metadata.orderId;
        await Order.findByIdAndUpdate(orderId, {
            status: 'pending',
            'payment.status': 'failed',
            updatedAt: new Date(),
        });
        // Restore stock
        // await this.restoreOrderStock(orderId);
        console.log(`❌ Order ${orderId} payment failed`);
    }
    async handlePaymentCancelled(paymentIntent) {
        const orderId = paymentIntent.metadata.orderId;
        await Order.findByIdAndUpdate(orderId, {
            status: 'cancelled',
            'payment.status': 'cancelled',
            updatedAt: new Date(),
        });
        // Restore stock
        // await this.restoreOrderStock(orderId);
        console.log(`❌ Order ${orderId} payment cancelled`);
    }
    async handleRefund(charge) {
        const order = await Order.findOne({ 'payment.chargeId': charge.id });
        if (order) {
            await Order.findByIdAndUpdate(order._id, {
                status: 'refunded',
                'payment.status': 'refunded',
                updatedAt: new Date(),
            });
            // Restore stock if needed
            // await this.restoreOrderStock(order._id);
            console.log(`💰 Order ${order.orderNumber} refunded`);
        }
    }
    async handleDispute(dispute) {
        const chargeId = typeof dispute.charge === 'string'
            ? dispute.charge
            : dispute.charge.id;
        const order = await Order.findOne({
            'payment.chargeId': chargeId
        });
        if (order) {
            await Order.findByIdAndUpdate(order._id, {
                status: 'pending',
                'payment.status': 'disputed',
                updatedAt: new Date(),
            });
            // Send notification to admin
            console.log(`⚠️ Order ${order.orderNumber} disputed`);
        }
    }
    // Create refund
    async createRefund(orderId, amount) {
        try {
            const order = await Order.findById(orderId);
            if (!order || !order.payment.chargeId) {
                throw new Error('Order or charge ID not found');
            }
            const refundParams = {
                charge: order.payment.chargeId,
                metadata: {
                    orderId: order._id.toString(),
                    orderNumber: order.orderNumber,
                },
            };
            if (amount) {
                refundParams.amount = Math.round(amount * 100);
            }
            const refund = await this.stripe.refunds.create(refundParams);
            // Update order status after successful refund
            await Order.findByIdAndUpdate(orderId, {
                status: 'refunded',
                'payment.status': 'refunded',
                updatedAt: new Date(),
            });
        }
        catch (error) {
            console.error('Error creating refund:', error);
            throw error;
        }
    }
    // Verify Stripe signature
    verifyStripeSignature(payload, signature) {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
        }
        catch (error) {
            console.error('Error verifying Stripe signature:', error);
            throw error;
        }
    }
}
export const paymentService = new PaymentService();
// cd backend
// npm install stripe @types/stripe
//# sourceMappingURL=payment.service.js.map