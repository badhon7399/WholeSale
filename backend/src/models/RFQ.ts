import { Schema, model } from 'mongoose';

const BidSchema = new Schema({
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  offeredPrice: {
    type: Number,
    required: true,
    min: [0.01, 'Offered price must be greater than 0'],
  },
  message: {
    type: String,
    required: true,
    minlength: [5, 'Bid message must be at least 5 characters'],
    maxlength: [1000, 'Bid message cannot exceed 1000 characters'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RFQSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, 'RFQ title must be at least 5 characters'],
      maxlength: [150, 'RFQ title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'RFQ quantity must be at least 1'],
    },
    targetPrice: {
      type: Number,
      required: true,
      min: [0.01, 'Target price must be greater than 0'],
    },
    deliveryLocation: {
      type: String,
      required: true,
    },
    requiredDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    bids: {
      type: [BidSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Query middleware to automatically exclude soft deleted records
RFQSchema.pre(/^find/, function (this: any, next) {
  if (this.getOptions().skipDeletedFilter) {
    return next();
  }
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Indexes for performance optimization
RFQSchema.index({ buyer: 1, status: 1 });
RFQSchema.index({ category: 1, status: 1 });
RFQSchema.index({ status: 1, createdAt: -1 });

export const RFQ = model('RFQ', RFQSchema);
export default RFQ;
