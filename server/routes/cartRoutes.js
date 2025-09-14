import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Lấy giỏ hàng của user
router.get("/", verifyToken, getCart);

// Thêm sản phẩm vào giỏ
router.post("/add", verifyToken, addToCart);

// Cập nhật số lượng sản phẩm
router.put("/update", verifyToken, updateCartItem);

// Xóa sản phẩm khỏi giỏ
router.delete("/remove", verifyToken, removeFromCart);

export default router;
