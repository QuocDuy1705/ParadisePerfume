import express from "express";
import {
  getOrCreateConversation,
  getAllConversations,
  getMessages,
  sendMessage,
  markAsRead,
  closeConversation,
  reopenConversation,
  uploadChatFile,
} from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";
import {
  chatMessageLimiter,
  conversationLimiter,
} from "../middleware/rateLimiter.js";
import { chatUpload, handleUploadError } from "../middleware/upload.js";

const router = express.Router();

// User routes
router.get(
  "/conversation",
  protect,
  // conversationLimiter, // Temporarily disabled for development
  getOrCreateConversation
);
router.get("/messages/:conversationId", protect, getMessages);
router.post("/messages", protect, chatMessageLimiter, sendMessage);
router.post(
  "/upload",
  protect,
  chatUpload.single("file"),
  handleUploadError,
  uploadChatFile
);
router.put("/messages/:conversationId/read", protect, markAsRead);

// Admin routes
router.get("/conversations", protect, getAllConversations);
router.put("/conversations/:conversationId/close", protect, closeConversation);
router.put(
  "/conversations/:conversationId/reopen",
  protect,
  reopenConversation
);

export default router;
