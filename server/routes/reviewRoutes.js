import express from "express";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/product/:productId", getProductReviews);

// Protected routes
router.post("/", verifyToken, createReview);
router.put("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);
router.post("/:id/helpful", verifyToken, markHelpful);

export default router;
