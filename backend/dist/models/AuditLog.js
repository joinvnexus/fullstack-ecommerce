import mongoose, { Document, Schema } from 'mongoose';
const AuditLogSchema = new Schema({
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String, required: true },
    oldValues: { type: Schema.Types.Mixed },
    newValues: { type: Schema.Types.Mixed },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
}, { timestamps: true });
// Index for efficient querying
AuditLogSchema.index({ adminId: 1, timestamp: -1 });
AuditLogSchema.index({ resource: 1, timestamp: -1 });
export default mongoose.model('AuditLog', AuditLogSchema);
//# sourceMappingURL=AuditLog.js.map