import express from "express";
import {
  getOrCreateConversation,
  getAllConversations,
  getMessages,
  sendMessage,
  markAsRead,
  closeConversation,
} from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// User routes
router.get("/conversation", protect, getOrCreateConversation);
router.get("/messages/:conversationId", protect, getMessages);
router.post("/messages", protect, sendMessage);
router.put("/messages/:conversationId/read", protect, markAsRead);

// Admin routes
router.get("/conversations", protect, getAllConversations);
router.put("/conversations/:conversationId/close", protect, closeConversation);

export default router;
