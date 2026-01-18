import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IWishlist, {}, {}, {}, mongoose.Document<unknown, {}, IWishlist, {}, mongoose.DefaultSchemaOptions> & IWishlist & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IWishlist>;
export default _default;
//# sourceMappingURL=Wishlist.d.ts.map