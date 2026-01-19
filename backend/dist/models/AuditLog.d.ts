import mongoose, { Document } from 'mongoose';
export interface IAuditLog extends Document {
    adminId: mongoose.Types.ObjectId;
    action: string;
    resource: string;
    resourceId: string;
    oldValues?: any;
    newValues?: any;
    ip: string;
    userAgent: string;
    timestamp: Date;
}
declare const _default: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, mongoose.DefaultSchemaOptions> & IAuditLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IAuditLog>;
export default _default;
//# sourceMappingURL=AuditLog.d.ts.map