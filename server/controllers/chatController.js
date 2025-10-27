import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

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
    const conversations = await Conversation.find()
      .sort({ lastMessageTime: -1 })
      .populate("userId", "name email");

    res.json(conversations);
  } catch (error) {
    console.error("Get all conversations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, before } = req.query;

    const query = { conversationId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(messages.reverse());
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

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Create message
    const newMessage = await Message.create({
      conversationId,
      senderId: userId,
      senderType: user.isAdmin ? "admin" : "user",
      senderName: `${user.firstName} ${user.lastName}`,
      message: message.trim(),
    });

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message.trim().substring(0, 100),
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

    if (user.role === "admin") {
      // Admin reading messages - mark user messages as read
      await Message.updateMany(
        { conversationId, senderType: "user", isRead: false },
        { isRead: true }
      );

      // Reset unread count
      await Conversation.findByIdAndUpdate(conversationId, {
        unreadCount: 0,
      });
    } else {
      // User reading messages - mark admin messages as read
      await Message.updateMany(
        { conversationId, senderType: "admin", isRead: false },
        { isRead: true }
      );
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
