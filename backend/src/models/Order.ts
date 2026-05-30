import { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be greater than 0'],
  },
});

const OrderSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0.01, 'Total amount must be greater than 0'],
    },
    paymentMethod: {
      type: String,
      enum: ['bank', 'mfs', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    deliveryStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
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
OrderSchema.pre(/^find/, function (this: any, next) {
  if (this.getOptions().skipDeletedFilter) {
    return next();
  }
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Indexes for performance optimization
OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ supplier: 1, createdAt: -1 });

export const Order = model('Order', OrderSchema);
export default Order;
