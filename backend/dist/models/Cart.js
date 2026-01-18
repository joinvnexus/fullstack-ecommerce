//backend/src/models/Cart.ts
import mongoose, { Document, Schema } from 'mongoose';
const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: Schema.Types.ObjectId },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    addedAt: { type: Date, default: Date.now },
});
const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    guestId: { type: String, index: true },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD' },
}, { timestamps: true });
// Calculate totals before saving
CartSchema.methods.calculateTotals = async function () {
    // subtotal = Σ (item.price_at_time × item.quantity)
    this.subtotal = this.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    // For now, discount is 0 (to be implemented with coupons)
    this.discount = 0;
    // Tax rate (example: 10% - this could be configurable per region)
    const taxRate = 0.1;
    this.tax = (this.subtotal - this.discount) * taxRate;
    // Shipping rules (basic implementation - free shipping over $50, otherwise $5.99)
    this.shipping = this.subtotal - this.discount >= 50 ? 0 : 5.99;
    // total = subtotal - discount + tax + shipping
    this.total = this.subtotal - this.discount + this.tax + this.shipping;
};
// Auto-calculate totals before save
CartSchema.pre('save', async function () {
    await this.calculateTotals();
    this.updatedAt = new Date();
});
export default mongoose.model('Cart', CartSchema);
//# sourceMappingURL=Cart.js.map