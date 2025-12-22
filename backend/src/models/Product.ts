import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  price: {
    amount: number;
    currency: string;
  };
  sku: string;
  stock: number;
  variants: Array<{
    name: string;
    options: Array<{
      _id?: mongoose.Types.ObjectId;
      name: string;
      priceAdjustment: number;
      skuSuffix: string;
    }>;
  }>;
  category: mongoose.Types.ObjectId;
  tags: string[];
  status: 'draft' | 'active' | 'archived';
  isFeatured: boolean;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true, index: 'text' },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    price: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'USD' },
    },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    variants: [
      {
        name: { type: String, required: true },
        options: [
          {
            name: { type: String, required: true },
            priceAdjustment: { type: Number, default: 0 },
            skuSuffix: { type: String, required: true },
          },
        ],
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
    tags: [{ type: String, index: true }],
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

// Indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, status: 1, price: 1 });
ProductSchema.index({ 'price.amount': 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);