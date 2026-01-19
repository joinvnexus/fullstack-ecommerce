import mongoose, { Document } from 'mongoose';
export interface IPermission extends Document {
    name: string;
    resource: string;
    action: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPermission, {}, {}, {}, mongoose.Document<unknown, {}, IPermission, {}, mongoose.DefaultSchemaOptions> & IPermission & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IPermission>;
export default _default;
//# sourceMappingURL=Permission.d.ts.map