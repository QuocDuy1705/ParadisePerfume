import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import "../assets/styles/adminChat.css";
import { MessageCircle, Send, X, Check, CheckCheck, User } from "lucide-react";

const AdminChat = () => {
  const { socket, isConnected, sendAdminReply } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

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
      setConversations(response.data);
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
      setMessages(response.data);
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
      console.log("📨 Admin received new message:", data);

      // Update conversation list
      fetchConversations();

      // If this message is for the currently selected conversation, add it to messages
      if (
        selectedConversation &&
        data.conversationId === selectedConversation._id
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, selectedConversation]);

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

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation._id,
      userId: selectedConversation.userId,
      message: inputMessage,
    };

    // Send via Socket.IO
    sendAdminReply(messageData);

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
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={selectedConversation.status === "closed"}
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
