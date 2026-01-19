import mongoose, { Document, Schema } from 'mongoose';
const PermissionSchema = new Schema({
    name: { type: String, required: true, unique: true },
    resource: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });
// Compound index for efficient permission checking
PermissionSchema.index({ resource: 1, action: 1 });
export default mongoose.model('Permission', PermissionSchema);
//# sourceMappingURL=Permission.js.map