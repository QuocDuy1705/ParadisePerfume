import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSocket } from "../../core/context/SocketContext";
import ChatBox from "./ChatBox";
import "../../assets/styles/chat.css";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useSocket();

  // Only show chat if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    return null; // Don't render chat button if not logged in
  }

  const toggleChat = () => {
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
            {unreadCount > 0 && (
              <span className="chat-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
};

export default ChatButton;
