import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("⚠️ No token found, socket not initialized");
      return;
    }

    // Initialize socket connection
    const socketUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    console.log("🔌 Connecting to socket:", socketUrl);

    const newSocket = io(socketUrl, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully");
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setIsConnected(false);
    });

    // Listen for new messages
    newSocket.on("new_message", (message) => {
      console.log("📨 New message received:", message);
      setUnreadCount((prev) => prev + 1);
    });

    newSocket.on("new_admin_message", (message) => {
      console.log("📨 New admin message received:", message);
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (conversationId, message) => {
    if (socket && isConnected) {
      socket.emit("send_message", {
        conversationId,
        message,
        timestamp: new Date(),
      });
    }
  };

  const sendAdminReply = (data) => {
    if (socket && isConnected) {
      console.log("📤 Sending admin reply:", data);
      socket.emit("admin_reply", data);
    }
  };

  const emitTyping = (data) => {
    if (socket && isConnected) {
      socket.emit("typing", data);
    }
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  const value = {
    socket,
    isConnected,
    unreadCount,
    sendMessage,
    sendAdminReply,
    emitTyping,
    resetUnreadCount,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
