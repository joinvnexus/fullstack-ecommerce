import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'admin';
    phone?: string;
    addresses: Array<{
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        isDefault: boolean;
    }>;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map