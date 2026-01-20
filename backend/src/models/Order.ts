import mongoose, { Document, Schema } from 'mongoose';

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

const OrderItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
});

const AddressSchema: Schema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const PaymentInfoSchema: Schema = new Schema({
  provider: {
    type: String,
    enum: ['stripe', 'bkash', 'nagad', 'sslcommerz'],
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

const OrderSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

// Generate order number before saving
OrderSchema.pre<IOrder>('save', async function () {
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

export default mongoose.model<IOrder>('Order', OrderSchema);