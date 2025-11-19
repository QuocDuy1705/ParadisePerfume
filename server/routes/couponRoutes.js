import express from "express";
import {
  getAllCoupons,
  getActiveCoupons,
  validateCoupon,
  applyCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveCoupons); // Get active coupons for display
router.post("/validate", protect, validateCoupon); // Validate coupon before checkout
router.post("/apply", protect, applyCoupon); // Apply coupon (called when order created)

// Admin routes
router.get("/", protect, admin, getAllCoupons); // Get all coupons
router.post("/", protect, admin, createCoupon); // Create coupon
router.put("/:id", protect, admin, updateCoupon); // Update coupon
router.delete("/:id", protect, admin, deleteCoupon); // Delete/deactivate coupon
router.get("/:id/stats", protect, admin, getCouponStats); // Get coupon statistics

export default router;
