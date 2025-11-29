import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSocket } from "../../core/context/SocketContext";
import ChatBox from "./ChatBox";
import "../../assets/styles/chat.css";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { socket, resetUnreadCount } = useSocket();
  const [localUnreadCount, setLocalUnreadCount] = useState(0);

  // Listen for new messages only when chat is CLOSED
  useEffect(() => {
    if (!socket || isOpen) {
      return; // Don't listen if chat is open
    }

    const handleNewAdminMessage = (message) => {
      console.log("📨 ChatButton: New admin message while chat closed");
      setLocalUnreadCount((prev) => prev + 1);
    };

    socket.on("new_admin_message", handleNewAdminMessage);

    return () => {
      socket.off("new_admin_message", handleNewAdminMessage);
    };
  }, [socket, isOpen]);

  // Only show chat if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    return null; // Don't render chat button if not logged in
  }

  const toggleChat = () => {
    if (!isOpen) {
      // Opening chat - reset unread
      setLocalUnreadCount(0);
      resetUnreadCount();
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Box */}
      {isOpen && <ChatBox onClose={() => setIsOpen(false)} />}

      {/* Floating Chat Button */}
      <button
        className="chat-float-button"
        onClick={toggleChat}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {localUnreadCount > 0 && (
              <span className="chat-badge">
                {localUnreadCount > 99 ? "99+" : localUnreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
};

export default ChatButton;
