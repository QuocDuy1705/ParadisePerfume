import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Men, Women, Mini, Giftset
  bannerUrl: { type: String, required: true }, // ảnh banner
  subtitle: { type: String }, // mô tả ngắn
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
