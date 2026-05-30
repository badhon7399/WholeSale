import { Schema, model } from 'mongoose';

const AuditLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetEntity: {
      type: String,
      required: true,
      enum: ['User', 'Product', 'Order', 'RFQ', 'Category'],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Optimize query performance
AuditLogSchema.index({ performedBy: 1, createdAt: -1 });
AuditLogSchema.index({ targetEntity: 1, targetId: 1 });

export const AuditLog = model('AuditLog', AuditLogSchema);
export default AuditLog;
