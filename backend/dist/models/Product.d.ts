import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IProduct>;
export default _default;
//# sourceMappingURL=Product.d.ts.map