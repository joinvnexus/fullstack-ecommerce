import mongoose, { Document, Schema } from 'mongoose';
const CategorySchema = new Schema({
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
}, { timestamps: true });
// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });
export default mongoose.model('Category', CategorySchema);
//# sourceMappingURL=Category.js.map