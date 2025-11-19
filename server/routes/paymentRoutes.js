import express from "express";
import {
  createBankOrder,
  createCODOrder,
  confirmPayment,
  checkPaymentStatus,
  createGuestCODOrder,
  createGuestBankOrder,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ==================== AUTHENTICATED ROUTES ====================
// TP Bank QR Code Payment Routes
router.post("/create-bank-order", verifyToken, createBankOrder);
router.post("/confirm-payment/:orderId", verifyToken, confirmPayment);
router.get("/check-status/:orderId", verifyToken, checkPaymentStatus);

// COD Payment Route
router.post("/create-cod-order", verifyToken, createCODOrder);

// ==================== GUEST CHECKOUT ROUTES ====================
// Guest không cần token, có thể mua hàng trực tiếp
router.post("/guest/create-cod-order", createGuestCODOrder);
router.post("/guest/create-bank-order", createGuestBankOrder);

export default router;
