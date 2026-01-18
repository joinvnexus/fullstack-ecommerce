import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  name: string; // 'create_product', 'update_order', etc.
  resource: string; // 'product', 'order', 'user'
  action: string; // 'create', 'read', 'update', 'delete'
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    resource: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// Compound index for efficient permission checking
PermissionSchema.index({ resource: 1, action: 1 });

export default mongoose.model<IPermission>('Permission', PermissionSchema);