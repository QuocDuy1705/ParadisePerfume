import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByCategory,
  searchProducts,
} from "../controllers/productController.js";
import { cacheMiddleware } from "../middleware/cache.js";

const router = express.Router();

// Cache GET requests for 10 minutes (600 seconds)
router.get("/", cacheMiddleware(600), getProducts);
router.get("/category/:category", cacheMiddleware(600), getProductsByCategory);
router.get("/search", cacheMiddleware(300), searchProducts); // Cache search for 5 mins
router.get("/:id", cacheMiddleware(600), getProductById);

// No cache for mutations
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
