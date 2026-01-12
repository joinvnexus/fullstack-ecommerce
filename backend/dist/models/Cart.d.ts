import mongoose, { Document } from 'mongoose';
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
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
    updatedAt: Date;
    calculateTotals(): Promise<void>;
}
declare const _default: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, mongoose.DefaultSchemaOptions> & ICart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ICart>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map