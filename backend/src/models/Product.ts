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
    isFeatured: { type: Boolean, default: false },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

// Indexes
// Primary query patterns
ProductSchema.index({ category: 1, status: 1, price: 1 });
ProductSchema.index({ 'price.amount': 1 });

// Status-based queries (product listings, filters)
ProductSchema.index({ status: 1, createdAt: -1 });
ProductSchema.index({ status: 1, 'price.amount': 1 });

// Featured products queries
ProductSchema.index({ isFeatured: 1, status: 1, createdAt: -1 });

// Tag-based queries
ProductSchema.index({ tags: 1, status: 1 });

// Admin product management
ProductSchema.index({ status: 1, category: 1 });
ProductSchema.index({ sku: 1 });

// Text search index for title and description
ProductSchema.index({ title: 'text', description: 'text', 'seo.keywords': 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);