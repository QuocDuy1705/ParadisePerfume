import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import helmet from "helmet";

// Load environment variables first
dotenv.config();
import connectDB from "./config/db.js";
import { sanitizeMessage } from "./utils/sanitizer.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

console.log("🔑 JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES" : "NO");

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Setup Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible to our router
app.set("io", io);

// ==================== SECURITY MIDDLEWARE ====================
// Helmet.js - Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "https://img.vietqr.io"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/coupons", couponRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("❌ Socket auth failed: No token");
    return next(new Error("Authentication error: No token"));
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET is not defined in environment variables!");
      return next(new Error("Server configuration error"));
    }

    console.log("🔐 Verifying with JWT_SECRET:", JWT_SECRET);
    console.log("📝 Token (first 50 chars):", token.substring(0, 50));

    // Thử verify với secret hiện tại
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ Token verified with current secret");
    } catch (err) {
      console.log(
        "⚠️ Failed with current secret, trying fallback 'yourSecretKey'..."
      );
      decoded = jwt.verify(token, "yourSecretKey");
      console.log("✅ Token verified with fallback secret 'yourSecretKey'");
      console.log(
        "⚠️ WARNING: Please logout and login again to get new token!"
      );
    }

    socket.userId = decoded.id;
    socket.isAdmin = decoded.isAdmin || false;

    console.log("✅ Socket authenticated:", {
      userId: decoded.id,
      email: decoded.email,
      isAdmin: socket.isAdmin,
    });

    next();
  } catch (error) {
    console.log("❌ Socket auth error details:");
    console.log("  - Error name:", error.name);
    console.log("  - Error message:", error.message);
    console.log("  - Token preview:", token.substring(0, 30) + "...");
    console.log("  - JWT_SECRET:", process.env.JWT_SECRET || "NOT SET");
    console.log("💡 Solution: Logout and login again to get a new valid token");

    return next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.userId} (Admin: ${socket.isAdmin})`);

  // Join user's personal room
  const userRoom = `user_${socket.userId}`;
  socket.join(userRoom);
  console.log(`👤 User joined room: ${userRoom}`);

  // If admin, join admin room
  if (socket.isAdmin) {
    socket.join("admin_room");
    console.log(`👑 Admin ${socket.userId} joined admin_room`);
  }

  // Handle new message from user
  socket.on("send_message", async (data) => {
    try {
      console.log("📨 User message received:", data);

      const { default: Message } = await import("./models/Message.js");
      const { default: Conversation } = await import(
        "./models/Conversation.js"
      );
      const { default: User } = await import("./models/User.js");

      // Get user info
      const user = await User.findById(socket.userId);
      const userName = user ? `${user.firstName} ${user.lastName}` : "User";

      // Sanitize message
      let sanitizedMessage;
      try {
        sanitizedMessage = sanitizeMessage(data.message);
      } catch (error) {
        console.log("❌ Invalid message:", error.message);
        socket.emit("error", { message: error.message });
        return;
      }

      // Save message to database
      const newMessage = await Message.create({
        conversationId: data.conversationId,
        senderId: socket.userId,
        senderType: "user",
        senderName: userName,
        message: sanitizedMessage,
        isRead: false,
      });

      // Update conversation
      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: sanitizedMessage.substring(0, 100),
        lastMessageTime: new Date(),
        $inc: { unreadCount: 1 },
      });

      // Emit to admin room with saved message data
      io.to("admin_room").emit("new_message", {
        _id: newMessage._id,
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        senderType: newMessage.senderType,
        senderName: newMessage.senderName,
        message: newMessage.message,
        isRead: newMessage.isRead,
        createdAt: newMessage.createdAt,
      });

      console.log(`✅ User message saved and sent to admin_room`);
    } catch (error) {
      console.error("❌ Error handling message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle admin reply
  socket.on("admin_reply", async (data) => {
    try {
      console.log("📨 Admin reply received:", data);

      const { default: Message } = await import("./models/Message.js");
      const { default: Conversation } = await import(
        "./models/Conversation.js"
      );
      const { default: User } = await import("./models/User.js");

      // Get admin info
      const admin = await User.findById(socket.userId);
      const adminName = admin
        ? `${admin.firstName} ${admin.lastName}`
        : "Admin";

      // Sanitize message
      let sanitizedMessage;
      try {
        sanitizedMessage = sanitizeMessage(data.message);
      } catch (error) {
        console.log("❌ Invalid admin message:", error.message);
        socket.emit("error", { message: error.message });
        return;
      }

      // Save message to database
      const newMessage = await Message.create({
        conversationId: data.conversationId,
        senderId: socket.userId,
        senderType: "admin",
        senderName: adminName,
        message: sanitizedMessage,
        isRead: false,
      });

      // Update conversation
      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: sanitizedMessage.substring(0, 100),
        lastMessageTime: new Date(),
      });

      // Emit to specific user with saved message data
      // Extract userId - handle both string and object formats
      const userId =
        typeof data.userId === "object" ? data.userId._id : data.userId;
      const targetRoom = `user_${userId}`;
      console.log(`📤 Emitting new_admin_message to room: ${targetRoom}`);
      console.log(`📤 userId type: ${typeof data.userId}, value:`, data.userId);

      io.to(targetRoom).emit("new_admin_message", {
        _id: newMessage._id,
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        senderType: newMessage.senderType,
        senderName: newMessage.senderName,
        message: newMessage.message,
        isRead: newMessage.isRead,
        createdAt: newMessage.createdAt,
      });

      console.log(`✅ Admin reply saved and sent to ${targetRoom}`);
    } catch (error) {
      console.error("❌ Error handling admin reply:", error);
      socket.emit("error", { message: "Failed to send reply" });
    }
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    console.log(
      `⌨️  User ${socket.userId} is typing in conversation ${data.conversationId}`
    );

    // User is typing - notify admin room with conversationId
    io.to("admin_room").emit("user_typing", {
      userId: socket.userId,
      conversationId: data.conversationId,
      isTyping: true,
    });
  });

  // Handle stop typing
  socket.on("stop_typing", (data) => {
    console.log(`⌨️  User ${socket.userId} stopped typing`);

    // User stopped typing - notify admin room
    io.to("admin_room").emit("user_typing", {
      userId: socket.userId,
      conversationId: data.conversationId,
      isTyping: false,
    });
  });

  // Handle admin typing indicator
  socket.on("admin_typing", async (data) => {
    console.log(
      `⌨️  Admin typing in conversation ${data.conversationId}, isTyping: ${data.isTyping}`
    );

    try {
      // Get conversation to find userId
      const { default: Conversation } = await import(
        "./models/Conversation.js"
      );
      const conversation = await Conversation.findById(data.conversationId);

      if (conversation) {
        // Notify specific user that admin is typing
        io.to(`user_${conversation.userId}`).emit("admin_typing", {
          conversationId: data.conversationId,
          isTyping: data.isTyping,
        });
      }
    } catch (error) {
      console.error("Error handling admin typing:", error);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`💬 Socket.IO enabled`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
