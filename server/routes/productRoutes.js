import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByCategory,
  searchProducts, // nhớ import hàm search
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts); // Lấy toàn bộ
router.get("/category/:category", getProductsByCategory); // API lọc theo category
router.get("/search", searchProducts); // 🔍 API tìm kiếm (đặt trước :id)
router.get("/:id", getProductById); // Lấy theo id
router.post("/", addProduct); // Thêm mới
router.put("/:id", updateProduct); // Cập nhật theo id
router.delete("/:id", deleteProduct); // Xóa theo id

export default router;
