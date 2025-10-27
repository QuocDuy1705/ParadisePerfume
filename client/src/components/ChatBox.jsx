import React, { useState, useEffect, useRef } from "react";
import { Send, Minimize2 } from "lucide-react";
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
  const messagesEndRef = useRef(null);

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
        setMessages(msgRes.data);

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
    if (!socket) return;

    const handleNewAdminMessage = (message) => {
      setMessages((prev) => [...prev, message]);

      // Mark as read if chat is open
      if (conversationId) {
        api.put(`/chat/messages/${conversationId}/read`).catch(console.error);
      }
    };

    socket.on("new_admin_message", handleNewAdminMessage);

    return () => {
      socket.off("new_admin_message", handleNewAdminMessage);
    };
  }, [socket, conversationId]);

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
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected || sending}
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
  );
};

export default ChatBox;
