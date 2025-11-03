import React, { useState, useEffect, useRef } from "react";
import { Send, Minimize2, Paperclip, X } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";
import "../assets/styles/chat.css";

const ChatBox = ({ onClose }) => {
  const { socket, isConnected, resetUnreadCount, sendMessage } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const conversationIdRef = useRef(null);

  // Update ref when conversationId changes
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation and messages
  useEffect(() => {
    const loadChat = async () => {
      try {
        // Get or create conversation
        const convRes = await api.get("/chat/conversation");
        const conv = convRes.data;
        setConversationId(conv._id);

        // Get messages
        const msgRes = await api.get(`/chat/messages/${conv._id}`);
        // Handle new pagination response format
        const messageData = msgRes.data;
        setMessages(
          Array.isArray(messageData) ? messageData : messageData.messages || []
        );

        // Mark as read
        await api.put(`/chat/messages/${conv._id}/read`);
        resetUnreadCount();
      } catch (error) {
        console.error("Load chat error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [resetUnreadCount]);

  // Listen for new messages from admin
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ ChatBox: No socket available");
      return;
    }

    if (!conversationId) {
      console.log("⚠️ ChatBox: No conversationId yet, waiting...");
      return;
    }

    console.log(
      "👂 ChatBox: Setting up socket listeners for conversationId:",
      conversationId
    );
    console.log("📍 conversationIdRef.current:", conversationIdRef.current);

    const handleNewAdminMessage = (message) => {
      console.log("📨 ChatBox: Received new admin message:", message);
      console.log("📨 Current conversationIdRef:", conversationIdRef.current);

      setMessages((prev) => {
        console.log("🔍 Checking for duplicates...");
        console.log("🔍 Current messages count:", prev.length);
        console.log("🔍 New message _id:", message._id);

        // Check if message already exists to prevent duplicates
        const messageExists = prev.some((msg) => {
          const isDuplicate = msg._id === message._id;
          if (isDuplicate) {
            console.log("⚠️  Found duplicate! Existing msg:", msg._id);
          }
          return isDuplicate;
        });

        if (messageExists) {
          console.log("⚠️  Message already exists, skipping");
          return prev;
        }

        console.log("✅ Adding admin message to list");
        return [...prev, message];
      }); // Mark as read if chat is open - use ref
      const currentConvId = conversationIdRef.current;
      if (currentConvId) {
        api.put(`/chat/messages/${currentConvId}/read`).catch(console.error);
      }
    };
    const handleAdminTyping = (data) => {
      console.log("⌨️  User received admin typing:", data);
      if (data.isTyping) {
        setIsAdminTyping(true);
        // Auto-hide after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsAdminTyping(false);
        }, 3000);
      } else {
        setIsAdminTyping(false);
      }
    };

    console.log("👂 ChatBox listening for new_admin_message and admin_typing");
    console.log("🔌 Socket connected:", socket.connected);
    console.log("📍 Socket ID:", socket.id);
    console.log(
      "🔢 Current listeners count:",
      socket.listeners("new_admin_message").length
    );

    // Remove all previous listeners to prevent duplicates
    socket.off("new_admin_message");
    socket.off("admin_typing");
    console.log("🧹 Removed all previous listeners");

    socket.on("new_admin_message", handleNewAdminMessage);
    socket.on("admin_typing", handleAdminTyping);

    console.log(
      "✅ Listeners added. New count:",
      socket.listeners("new_admin_message").length
    );

    return () => {
      console.log("🧹 ChatBox: Cleaning up socket listeners");
      console.log(
        "🔢 Listeners before cleanup:",
        socket.listeners("new_admin_message").length
      );
      socket.off("new_admin_message", handleNewAdminMessage);
      socket.off("admin_typing", handleAdminTyping);
      console.log(
        "🔢 Listeners after cleanup:",
        socket.listeners("new_admin_message").length
      );
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, conversationId]); // Need conversationId to wait for it to be loaded

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId || sending) return;

    setSending(true);
    try {
      // Send via API
      const res = await api.post("/chat/messages", {
        conversationId,
        message: newMessage.trim(),
      });

      // Also send via Socket.IO for realtime
      if (socket && isConnected) {
        sendMessage(conversationId, newMessage.trim());
        // Stop typing indicator after sending
        socket.emit("stop_typing", { conversationId });
      }

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn! Tối đa 5MB");
        return;
      }
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF) hoặc PDF");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !conversationId || uploading) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("conversationId", conversationId);

      const res = await api.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add message to UI
      setMessages((prev) => [...prev, res.data]);
      setSelectedFile(null);

      // Also emit via socket for realtime
      sendMessage(conversationId, res.data.message);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Lỗi upload file");
    } finally {
      setUploading(false);
    }
  };

  const cancelFileSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Emit typing event
    if (socket && conversationId && e.target.value.length > 0) {
      socket.emit("typing", { conversationId });
    } else if (socket && conversationId) {
      socket.emit("stop_typing", { conversationId });
    }
  };

  return (
    <div className="chat-box">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <h3>PARADISE</h3>
          <span className="chat-status">
            {isConnected ? "● Trực tuyến" : "○ Ngoại tuyến"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="chat-close-btn"
          aria-label="Minimize"
        >
          <Minimize2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">Đang tải...</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <p>Xin chào! 👋</p>
            <p>Chúng tôi có thể giúp gì cho bạn?</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.senderType === "admin" ? "admin" : "user"
              }`}
            >
              <div className="message-bubble">
                {msg.fileUrl && (
                  <div className="message-file">
                    {msg.fileType === "image" ? (
                      <img
                        src={`http://localhost:5000${msg.fileUrl}`}
                        alt={msg.fileName}
                        style={{ maxWidth: "200px", borderRadius: "8px" }}
                      />
                    ) : (
                      <a
                        href={`http://localhost:5000${msg.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#007bff" }}
                      >
                        📎 {msg.fileName}
                      </a>
                    )}
                  </div>
                )}
                <p>{msg.message}</p>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        {isAdminTyping && (
          <div className="chat-message admin">
            <div className="message-bubble typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span
                style={{ marginLeft: "8px", fontSize: "12px", color: "#666" }}
              >
                Admin đang nhập...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        {selectedFile && (
          <div
            style={{
              padding: "8px",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "12px" }}>📎 {selectedFile.name}</span>
            <button
              onClick={cancelFileSelection}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                marginLeft: "auto",
                padding: "4px 12px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {uploading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        )}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,.pdf"
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="chat-attach-btn"
            disabled={!isConnected || uploading}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <Paperclip size={18} color="#666" />
          </button>
          <input
            type="text"
            className="chat-input"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!isConnected || sending}
            style={{ flex: 1 }}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!newMessage.trim() || !isConnected || sending}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
