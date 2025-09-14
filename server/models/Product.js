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
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
