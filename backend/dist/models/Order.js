import mongoose, { Document, Schema } from 'mongoose';
const OrderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
});
const AddressSchema = new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
});
const PaymentInfoSchema = new Schema({
    provider: {
        type: String,
        enum: ['pending', 'stripe', 'bkash', 'nagad', 'sslcommerz'],
        required: true,
    },
    intentId: { type: String },
    chargeId: { type: String },
    transactionId: { type: String },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'refunded'],
        default: 'pending',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
});
const OrderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    shippingAddress: { type: AddressSchema, required: true },
    billingAddress: { type: AddressSchema },
    contactInfo: {
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    totals: {
        subtotal: { type: Number, required: true, min: 0 },
        shipping: { type: Number, required: true, min: 0 },
        tax: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0 },
        grandTotal: { type: Number, required: true, min: 0 },
    },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending',
    },
    payment: { type: PaymentInfoSchema, required: true },
    shippingMethod: {
        name: { type: String, required: true },
        cost: { type: Number, required: true, min: 0 },
        estimatedDays: { type: Number, required: true, min: 1 },
    },
    notes: { type: String },
    trackingNumber: { type: String },
}, { timestamps: true });
// Generate order number before saving
OrderSchema.pre('save', async function () {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        this.orderNumber = `ORD${year}${month}${day}${randomNum}`;
    }
});
// Indexes for faster queries
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'payment.status': 1 });
export default mongoose.model('Order', OrderSchema);
//# sourceMappingURL=Order.js.map