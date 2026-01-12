import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parent?: mongoose.Types.ObjectId;
  children: mongoose.Types.ObjectId[];
  treePath: string[];
  sortOrder: number;
  seoMeta?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    children: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    treePath: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    seoMeta: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

// Indexes
CategorySchema.index({ parent: 1 });

export default mongoose.model<ICategory>('Category', CategorySchema);