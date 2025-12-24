import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    variantId?: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export interface IOrderAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
    email: string;
}
export interface IPaymentInfo {
    provider: 'stripe' | 'bkash' | 'nagad' | 'sslcommerz';
    intentId?: string;
    chargeId?: string;
    transactionId?: string;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
    amount: number;
    currency: string;
}
export interface IOrder extends Document {
    orderNumber: string;
    userId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IOrderAddress;
    billingAddress?: IOrderAddress;
    contactInfo: {
        email: string;
        phone: string;
    };
    totals: {
        subtotal: number;
        shipping: number;
        tax: number;
        discount: number;
        grandTotal: number;
    };
    currency: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    payment: IPaymentInfo;
    shippingMethod: {
        name: string;
        cost: number;
        estimatedDays: number;
    };
    notes?: string;
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IOrder>;
export default _default;
//# sourceMappingURL=Order.d.ts.map