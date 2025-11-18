import express from "express";
import {
  createBankOrder,
  createCODOrder,
  confirmPayment,
  checkPaymentStatus,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// TP Bank QR Code Payment Routes
router.post("/create-bank-order", verifyToken, createBankOrder);
router.post("/confirm-payment/:orderId", verifyToken, confirmPayment);
router.get("/check-status/:orderId", verifyToken, checkPaymentStatus);

// COD Payment Route
router.post("/create-cod-order", verifyToken, createCODOrder);

export default router;
