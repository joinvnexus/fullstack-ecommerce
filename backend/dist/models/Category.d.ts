import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, mongoose.DefaultSchemaOptions> & ICategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ICategory>;
export default _default;
//# sourceMappingURL=Category.d.ts.map