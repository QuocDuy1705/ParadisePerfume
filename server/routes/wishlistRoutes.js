import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(verifyToken);

// Get wishlist
router.get("/", getWishlist);

// Add to wishlist
router.post("/add", addToWishlist);

// Remove from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// Clear wishlist
router.delete("/clear", clearWishlist);

export default router;
