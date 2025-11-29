import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/authController.js";
import { getProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);
router.get("/profile", authMiddleware, getProfile);

export default router;
