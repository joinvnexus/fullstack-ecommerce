import mongoose, { Document, Schema } from 'mongoose';
const WishlistItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now },
    notes: { type: String },
});
const WishlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, default: 'My Wishlist' },
    items: [WishlistItemSchema],
    isDefault: { type: Boolean, default: true },
}, { timestamps: true });
// Create compound index for faster queries
WishlistSchema.index({ userId: 1, isDefault: 1 });
WishlistSchema.index({ userId: 1, 'items.productId': 1 });
// Method to check if product exists in wishlist
WishlistSchema.methods.hasProduct = function (productId) {
    return this.items.some((item) => item.productId.toString() === productId);
};
// Method to add product to wishlist
WishlistSchema.methods.addProduct = function (productId, notes) {
    if (!this.hasProduct(productId)) {
        this.items.push({
            productId: new mongoose.Types.ObjectId(productId),
            addedAt: new Date(),
            notes,
        });
    }
};
// Method to remove product from wishlist
WishlistSchema.methods.removeProduct = function (productId) {
    this.items = this.items.filter((item) => item.productId.toString() !== productId);
};
export default mongoose.model('Wishlist', WishlistSchema);
//# sourceMappingURL=Wishlist.js.map