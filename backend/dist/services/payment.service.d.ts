import Stripe from 'stripe';
import type { IOrder } from '../models/Order.js';
export declare class PaymentService {
    private stripe;
    constructor();
    createStripePaymentIntent(order: IOrder): Promise<{
        clientSecret: string | null;
        paymentIntentId: string;
    }>;
    handleStripeWebhook(event: Stripe.Event): Promise<void>;
    private handlePaymentSuccess;
    private handlePaymentFailure;
    private handlePaymentCancelled;
    private handleRefund;
    private handleDispute;
    createRefund(orderId: string, amount?: number): Promise<void>;
    verifyStripeSignature(payload: string, signature: string): Stripe.Event;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=payment.service.d.ts.map