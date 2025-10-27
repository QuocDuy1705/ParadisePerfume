import express from "express";
import {
  createVNPayUrl,
  vnpayReturn,
  createMoMoPayment,
  momoNotify,
  momoReturn,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// VNPay routes
router.post("/vnpay", verifyToken, createVNPayUrl);
router.get("/vnpay-return", vnpayReturn);

// MoMo routes
router.post("/momo", verifyToken, createMoMoPayment);
router.post("/momo-notify", momoNotify);
router.get("/momo-return", momoReturn);

export default router;
