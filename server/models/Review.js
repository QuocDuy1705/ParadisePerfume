import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    verified: {
      type: Boolean,
      default: false, // true nếu user đã mua sản phẩm
    },
    helpful: {
      type: Number,
      default: 0, // Số người thấy review hữu ích
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo mỗi user chỉ review 1 lần cho mỗi sản phẩm
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Index để query nhanh
ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1 });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
