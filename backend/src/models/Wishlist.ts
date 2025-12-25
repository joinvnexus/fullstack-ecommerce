import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
  addedAt: Date;
  notes?: string;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  items: IWishlistItem[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasProduct(productId: string): boolean;
  addProduct(productId: string, notes?: string): void;
  removeProduct(productId: string): void;
}

const WishlistItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  addedAt: { type: Date, default: Date.now },
  notes: { type: String },
});

const WishlistSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, default: 'My Wishlist' },
    items: [WishlistItemSchema],
    isDefault: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create compound index for faster queries
WishlistSchema.index({ userId: 1, isDefault: 1 });
WishlistSchema.index({ userId: 1, 'items.productId': 1 });

// Method to check if product exists in wishlist
WishlistSchema.methods.hasProduct = function(productId: string): boolean {
return this.items.some((item: IWishlistItem) => item.productId.toString() === productId);
};

// Method to add product to wishlist
WishlistSchema.methods.addProduct = function(productId: string, notes?: string): void {
  if (!this.hasProduct(productId)) {
    this.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      addedAt: new Date(),
      notes,
    });
  }
};

// Method to remove product from wishlist
WishlistSchema.methods.removeProduct = function(productId: string): void {
this.items = this.items.filter((item: IWishlistItem) => item.productId.toString() !== productId);
};

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);