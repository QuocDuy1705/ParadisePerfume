import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../core/context/SocketContext";
import axios from "axios";
import "../../../assets/styles/adminChat.css";
import {
  MessageCircle,
  Send,
  X,
  Check,
  CheckCheck,
  User,
  Paperclip,
  Image as ImageIcon,
} from "lucide-react";

const AdminChat = () => {
  const { socket, isConnected, sendAdminReply } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedConversationRef = useRef(null);

  // Update ref when conversation changes
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/chat/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle new pagination response format
      const convData = response.data;
      setConversations(
        Array.isArray(convData) ? convData : convData.conversations || []
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/chat/messages/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle new pagination response format
      const messageData = response.data;
      setMessages(
        Array.isArray(messageData) ? messageData : messageData.messages || []
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Mark messages as read
  const markAsRead = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/chat/messages/${conversationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Close conversation
  const closeConversation = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/chat/conversations/${conversationId}/close`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchConversations();
      setSelectedConversation(null);
      setMessages([]);
    } catch (error) {
      console.error("Error closing conversation:", error);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Listen for new messages via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      console.log("📨 AdminChat: Received new message:", data);

      // Update conversation list
      fetchConversations();

      // Check if message is for currently selected conversation using ref
      const currentConv = selectedConversationRef.current;
      if (!currentConv || data.conversationId !== currentConv._id) {
        console.log("⚠️  Message not for selected conversation, skipping");
        return;
      }

      // Add message to list
      setMessages((prevMessages) => {
        // Check if message already exists
        const exists = prevMessages.some((msg) => msg._id === data._id);
        if (exists) {
          console.log("⚠️  Message already exists, skipping");
          return prevMessages;
        }

        console.log("✅ Adding new message to list");
        return [...prevMessages, data];
      });
    };

    const handleUserTyping = (data) => {
      console.log("⌨️  AdminChat: User typing event:", data);

      const currentConv = selectedConversationRef.current;
      if (!currentConv || data.conversationId !== currentConv._id) {
        return;
      }

      if (data.isTyping) {
        setIsUserTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsUserTyping(false);
        }, 3000);
      } else {
        setIsUserTyping(false);
      }
    };

    console.log("👂 AdminChat: Setting up socket listeners");
    console.log(
      "🔢 Current listeners count:",
      socket.listeners("new_message").length
    );

    // Remove all previous listeners to prevent duplicates
    socket.off("new_message");
    socket.off("user_typing");
    console.log("🧹 Removed all previous listeners");

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);

    console.log(
      "✅ Listeners added. New count:",
      socket.listeners("new_message").length
    );

    return () => {
      console.log("🧹 AdminChat: Cleaning up socket listeners");
      console.log(
        "🔢 Listeners before cleanup:",
        socket.listeners("new_message").length
      );
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      console.log(
        "🔢 Listeners after cleanup:",
        socket.listeners("new_message").length
      );
    };
  }, [socket]); // Remove selectedConversation from dependencies

  // Handle conversation selection
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
    await markAsRead(conversation._id);

    // Update unread count in conversations list
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  // Handle admin typing
  const handleAdminInputChange = (e) => {
    setInputMessage(e.target.value);
    if (socket && selectedConversation && e.target.value.length > 0) {
      socket.emit("admin_typing", {
        conversationId: selectedConversation._id,
        isTyping: true,
      });
    } else if (socket && selectedConversation && e.target.value.length === 0) {
      socket.emit("admin_typing", {
        conversationId: selectedConversation._id,
        isTyping: false,
      });
    }
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConversation) return;

    // Extract userId - handle both string and object formats
    const userId =
      typeof selectedConversation.userId === "object"
        ? selectedConversation.userId._id
        : selectedConversation.userId;

    const messageData = {
      conversationId: selectedConversation._id,
      userId: userId, // Send only the ID string, not the object
      message: inputMessage,
    };

    console.log("📤 Admin sending message with data:", messageData);
    console.log("📝 Selected conversation:", selectedConversation);
    console.log("📝 Extracted userId:", userId);
    console.log("🔌 Socket connected:", socket?.connected);
    console.log("📍 Socket ID:", socket?.id);

    // Send via Socket.IO
    sendAdminReply(messageData);

    // Stop typing indicator after sending
    if (socket && selectedConversation) {
      socket.emit("admin_typing", {
        conversationId: selectedConversation._id,
        isTyping: false,
      });
    }

    // Optimistically add to messages
    const newMessage = {
      _id: Date.now().toString(),
      conversationId: selectedConversation._id,
      senderType: "admin",
      senderName: "Admin",
      message: inputMessage,
      createdAt: new Date(),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === selectedConversation._id
          ? { ...conv, lastMessage: inputMessage, lastMessageTime: new Date() }
          : conv
      )
    );
  };

  // Handle file selection
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

  // Handle file upload
  const handleUploadFile = async () => {
    if (!selectedFile || !selectedConversation || uploading) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("conversationId", selectedConversation._id);

      const response = await axios.post(
        "http://localhost:5000/api/chat/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Add uploaded message to UI
      setMessages((prev) => [...prev, response.data]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Emit via socket
      sendAdminReply({
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
        message: response.data.message,
      });
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

  // Format time
  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    // If less than 1 minute
    if (diff < 60000) return "Vừa xong";

    // If less than 1 hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins} phút trước`;
    }

    // If today
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If this week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} ngày trước`;
    }

    // Otherwise show date
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div className="admin-chat-container">
      <div className="admin-chat-content">
        {/* Conversations List */}
        <div className="conversations-panel">
          <div className="panel-header">
            <div className="panel-header-left">
              <MessageCircle size={20} />
              <h2>Cuộc hội thoại</h2>
              <span className="conversation-count">{conversations.length}</span>
            </div>
            <span
              className={`status-indicator ${
                isConnected ? "online" : "offline"
              }`}
            >
              {isConnected ? "● Trực tuyến" : "○ Ngoại tuyến"}
            </span>
          </div>

          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <MessageCircle size={48} />
              <p>Chưa có cuộc hội thoại nào</p>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`conversation-item ${
                    selectedConversation?._id === conv._id ? "active" : ""
                  }`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="conversation-avatar">
                    <User size={24} />
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h3>{conv.userName}</h3>
                      <span className="conversation-time">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="conversation-preview">
                      <p>{conv.lastMessage || "Chưa có tin nhắn"}</p>
                      {conv.unreadCount > 0 && (
                        <span className="unread-badge">{conv.unreadCount}</span>
                      )}
                    </div>
                    <div className="conversation-meta">
                      <span className="user-email">{conv.userEmail}</span>
                      <span className={`status-badge ${conv.status}`}>
                        {conv.status === "active"
                          ? "Đang hoạt động"
                          : "Đã đóng"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages Panel */}
        <div className="messages-panel">
          {selectedConversation ? (
            <>
              <div className="messages-header">
                <div className="header-info">
                  <div className="user-avatar">
                    <User size={20} />
                  </div>
                  <div>
                    <h3>{selectedConversation.userName}</h3>
                    <p>{selectedConversation.userEmail}</p>
                  </div>
                </div>
                <button
                  className="close-conversation-btn"
                  onClick={() => closeConversation(selectedConversation._id)}
                  title="Đóng cuộc hội thoại"
                >
                  <X size={20} />
                  Đóng
                </button>
              </div>

              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="empty-messages">
                    <MessageCircle size={48} />
                    <p>Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      className={`message ${msg.senderType}`}
                    >
                      <div className="message-content">
                        <div className="message-bubble">
                          {msg.fileUrl && (
                            <div
                              className="message-file"
                              style={{ marginBottom: "8px" }}
                            >
                              {msg.fileType === "image" ? (
                                <img
                                  src={`http://localhost:5000${msg.fileUrl}`}
                                  alt={msg.fileName}
                                  style={{
                                    maxWidth: "300px",
                                    borderRadius: "8px",
                                    display: "block",
                                  }}
                                />
                              ) : (
                                <a
                                  href={`http://localhost:5000${msg.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#007bff",
                                    textDecoration: "none",
                                  }}
                                >
                                  📎 {msg.fileName}
                                </a>
                              )}
                            </div>
                          )}
                          <p>{msg.message}</p>
                          <div className="message-footer">
                            <span className="message-time">
                              {new Date(msg.createdAt).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            {msg.senderType === "admin" && (
                              <span className="message-status">
                                {msg.isRead ? (
                                  <CheckCheck size={14} />
                                ) : (
                                  <Check size={14} />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isUserTyping && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        background: "#f0f0f0",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        User đang nhập...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                {selectedFile && (
                  <div
                    style={{
                      padding: "10px",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "8px 8px 0 0",
                    }}
                  >
                    <ImageIcon size={16} color="#666" />
                    <span style={{ fontSize: "13px", flex: 1 }}>
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={cancelFileSelection}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                    >
                      <X size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleUploadFile}
                      disabled={uploading}
                      style={{
                        padding: "6px 16px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: uploading ? "not-allowed" : "pointer",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {uploading ? "Đang gửi..." : "Gửi file"}
                    </button>
                  </div>
                )}
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      selectedConversation.status === "closed" || uploading
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    title="Đính kèm file"
                  >
                    <Paperclip size={20} color="#666" />
                  </button>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={inputMessage}
                    onChange={handleAdminInputChange}
                    disabled={selectedConversation.status === "closed"}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    disabled={
                      !inputMessage.trim() ||
                      selectedConversation.status === "closed"
                    }
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <MessageCircle size={64} />
              <h3>Chọn một cuộc hội thoại</h3>
              <p>
                Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu trò
                chuyện
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
