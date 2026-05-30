import { Schema, model } from 'mongoose';

const PriceTierSchema = new Schema({
  minQuantity: {
    type: Number,
    required: true,
    min: [1, 'Minimum quantity for pricing tier must be at least 1'],
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: [0.01, 'Price per unit must be greater than 0'],
  },
});

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Product title must be at least 3 characters'],
      maxlength: [100, 'Product title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moq: {
      type: Number,
      required: true,
      default: 10,
      min: [1, 'MOQ must be at least 1'],
    },
    priceTiers: {
      type: [PriceTierSchema],
      required: true,
      validate: [
        (val: any[]) => val.length > 0,
        'At least one pricing tier is required',
      ],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    leadTime: {
      type: String,
      default: '7-15 days',
    },
    shippingOrigin: {
      type: String,
      default: 'Dhaka',
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
ProductSchema.pre(/^find/, function (this: any, next) {
  if (this.getOptions().skipDeletedFilter) {
    return next();
  }
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Indexes for performance optimization
ProductSchema.index({ category: 1 });
ProductSchema.index({ supplier: 1 });
ProductSchema.index({ moq: 1, 'priceTiers.0.pricePerUnit': 1 });
ProductSchema.index({ title: 'text', description: 'text' });

export const Product = model('Product', ProductSchema);
export default Product;
