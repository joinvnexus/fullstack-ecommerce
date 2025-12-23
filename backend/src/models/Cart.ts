//backend/src/models/Cart.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  addedAt: Date;
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  guestId?: string;
  items: ICartItem[];
  subtotal: number;
  currency: string;
  updatedAt: Date;
  calculateSubtotal(): Promise<void>;
}

const CartItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Schema.Types.ObjectId },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  addedAt: { type: Date, default: Date.now },
});

const CartSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    guestId: { type: String, index: true },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD' },
  },
  { timestamps: true }
);

// Calculate subtotal before saving
CartSchema.methods.calculateSubtotal = async function (): Promise<void> {
  const total = this.items.reduce(
    (sum: number, item: ICartItem) => sum + item.unitPrice * item.quantity,
    0
  );
  this.subtotal = total;
};

// Auto-calculate subtotal before save
CartSchema.pre<ICart>('save', async function () {
  await this.calculateSubtotal();
  this.updatedAt = new Date();
});


export default mongoose.model<ICart>('Cart', CartSchema);