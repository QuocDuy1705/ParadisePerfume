import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { sanitizeMessage } from "../utils/sanitizer.js";

// Get or create conversation for current user
export const getOrCreateConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({ userId });

    // Create new conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        status: "active",
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error("Get/Create conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all conversations (Admin only)
export const getAllConversations = async (req, res) => {
  try {
    const {
      search,
      status,
      sortBy = "lastMessageTime",
      order = "desc",
      limit = 50,
      skip = 0,
    } = req.query;

    // Build query
    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = order === "desc" ? -1 : 1;

    // Execute query
    const conversations = await Conversation.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("userId", "firstName lastName email");

    // Get total count for pagination
    const total = await Conversation.countDocuments(query);

    res.json({
      conversations,
      total,
      hasMore: parseInt(skip) + conversations.length < total,
    });
  } catch (error) {
    console.error("Get all conversations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, before, after } = req.query;

    // Build query
    const query = { conversationId };

    // Cursor-based pagination
    if (before) {
      // Load older messages (scroll up)
      query.createdAt = { $lt: new Date(before) };
    } else if (after) {
      // Load newer messages (realtime updates)
      query.createdAt = { $gt: new Date(after) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: before ? -1 : 1 }) // Reverse if loading older
      .limit(parseInt(limit));

    // If loading older, reverse back to chronological order
    const result = before ? messages.reverse() : messages;

    // Return with pagination info
    res.json({
      messages: result,
      hasMore: messages.length === parseInt(limit),
      oldest: result.length > 0 ? result[0].createdAt : null,
      newest: result.length > 0 ? result[result.length - 1].createdAt : null,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Sanitize and validate message
    let sanitizedMessage;
    try {
      sanitizedMessage = sanitizeMessage(message);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    // Create message
    const newMessage = await Message.create({
      conversationId,
      senderId: userId,
      senderType: user.isAdmin ? "admin" : "user",
      senderName: `${user.firstName} ${user.lastName}`,
      message: sanitizedMessage,
    });

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: sanitizedMessage.substring(0, 100),
      lastMessageTime: new Date(),
      $inc: { unreadCount: user.isAdmin ? 0 : 1 },
    });

    // Emit socket event
    const io = req.app.get("io");
    if (user.isAdmin) {
      // Admin reply - emit to user
      const conversation = await Conversation.findById(conversationId);
      io.to(`user_${conversation.userId}`).emit(
        "new_admin_message",
        newMessage
      );
    } else {
      // User message - emit to admin
      io.to("admin_room").emit("new_message", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user.isAdmin) {
      // Admin reading messages - mark user messages as read
      await Message.updateMany(
        { conversationId, senderType: "user", isRead: false },
        { isRead: true, readAt: new Date() }
      );

      // Reset unread count
      await Conversation.findByIdAndUpdate(conversationId, {
        unreadCount: 0,
      });

      // Emit socket event to user
      const io = req.app.get("io");
      const conversation = await Conversation.findById(conversationId);
      io.to(`user_${conversation.userId}`).emit("messages_read", {
        conversationId,
        readBy: "admin",
        readAt: new Date(),
      });
    } else {
      // User reading messages - mark admin messages as read
      await Message.updateMany(
        { conversationId, senderType: "admin", isRead: false },
        { isRead: true, readAt: new Date() }
      );

      // Emit to admin room
      const io = req.app.get("io");
      io.to("admin_room").emit("messages_read", {
        conversationId,
        readBy: userId,
        readAt: new Date(),
      });
    }

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Close conversation (Admin only)
export const closeConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Conversation.findByIdAndUpdate(conversationId, {
      status: "closed",
    });

    res.json({ message: "Conversation closed" });
  } catch (error) {
    console.error("Close conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload file in chat
export const uploadChatFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { conversationId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Get file info
    const fileUrl = `/uploads/chat/${req.file.filename}`;
    const fileType = req.file.mimetype.startsWith("image/") ? "image" : "file";

    // Create message with file
    const newMessage = await Message.create({
      conversationId,
      senderId: userId,
      senderType: user.isAdmin ? "admin" : "user",
      senderName: `${user.firstName} ${user.lastName}`,
      message: `Sent a ${fileType}`,
      fileUrl: fileUrl,
      fileType: fileType,
      fileName: req.file.originalname,
    });

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: `[${fileType}] ${req.file.originalname}`,
      lastMessageTime: new Date(),
      $inc: { unreadCount: user.isAdmin ? 0 : 1 },
    });

    // Emit socket event
    const io = req.app.get("io");
    if (user.isAdmin) {
      const conversation = await Conversation.findById(conversationId);
      io.to(`user_${conversation.userId}`).emit(
        "new_admin_message",
        newMessage
      );
    } else {
      io.to("admin_room").emit("new_message", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Upload chat file error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
