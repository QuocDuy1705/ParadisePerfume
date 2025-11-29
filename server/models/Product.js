import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true }, // Men, Women, Mini, Giftset
    price: { type: Number, required: true },
    image: { type: String, required: true },
    detailUrl: { type: String, required: true },
    notes: [{ type: String }],
    rating: { type: Number, default: 0 }, // 0 - 5
    numReviews: { type: Number, default: 0 }, // Số lượng reviews
  },
  { timestamps: true }
);

// Indexes for better query performance
productSchema.index({ category: 1 }); // Filter by category
productSchema.index({ name: "text" }); // Text search
productSchema.index({ price: 1 }); // Sort by price
productSchema.index({ rating: -1 }); // Sort by rating
productSchema.index({ createdAt: -1 }); // Sort by newest
productSchema.index({ category: 1, price: 1 }); // Compound index for category + price queries

const Product = mongoose.model("Product", productSchema);

export default Product;
