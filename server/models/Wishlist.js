import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Đảm bảo mỗi user chỉ có 1 wishlist
WishlistSchema.index({ user: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

export default Wishlist;
