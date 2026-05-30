import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['buyer', 'supplier', 'admin'],
      default: 'buyer',
    },
    companyName: {
      type: String,
      default: '',
    },
    companyAddress: {
      type: String,
      default: '',
    },
    tradeLicense: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
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
UserSchema.pre(/^find/, function (this: any, next) {
  if (this.getOptions().skipDeletedFilter) {
    return next();
  }
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Indexes for performance optimization
UserSchema.index({ role: 1, isVerified: 1 });

export const User = model('User', UserSchema);
export default User;
