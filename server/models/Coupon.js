import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null, // null = unlimited
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usagePerUser: {
      type: Number,
      default: 1, // Mỗi user chỉ dùng được 1 lần
    },
    usedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        orderAmount: Number,
        discountAmount: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableCategories: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, endDate: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date();

  // Check active status
  if (!this.isActive) {
    return { valid: false, message: "Mã giảm giá không còn hiệu lực" };
  }

  // Check dates
  if (now < this.startDate) {
    return { valid: false, message: "Mã giảm giá chưa có hiệu lực" };
  }

  if (now > this.endDate) {
    return { valid: false, message: "Mã giảm giá đã hết hạn" };
  }

  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: "Mã giảm giá đã hết lượt sử dụng" };
  }

  return { valid: true };
};

// Method to check if user can use this coupon
couponSchema.methods.canUserUse = function (userId) {
  const userUsage = this.usedBy.filter(
    (usage) => usage.userId.toString() === userId.toString()
  );

  if (userUsage.length >= this.usagePerUser) {
    return {
      valid: false,
      message: `Bạn đã sử dụng mã này ${this.usagePerUser} lần`,
    };
  }

  return { valid: true };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount, items = []) {
  // Check minimum order amount
  if (orderAmount < this.minOrderAmount) {
    return {
      valid: false,
      message: `Đơn hàng tối thiểu ${this.minOrderAmount.toLocaleString()}₫`,
      discount: 0,
    };
  }

  let discount = 0;

  if (this.discountType === "percentage") {
    discount = (orderAmount * this.discountValue) / 100;

    // Apply max discount cap if exists
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    // Fixed amount
    discount = this.discountValue;
  }

  // Discount cannot exceed order amount
  if (discount > orderAmount) {
    discount = orderAmount;
  }

  return {
    valid: true,
    discount: Math.round(discount),
    finalAmount: Math.round(orderAmount - discount),
  };
};

// Static method to find active coupons
couponSchema.statics.findActiveCoupons = function () {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
