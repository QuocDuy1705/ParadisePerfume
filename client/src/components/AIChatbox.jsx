import React, { useState, useRef, useEffect } from "react";
import "../assets/styles/aiChatbox.css";
import api from "../core/utils/api";

const AIChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Xin chào! Tôi là AI tư vấn nước hoa của Paradise Perfume. Tôi có thể giúp bạn tìm kiếm mùi hương hoàn hảo. Bạn muốn tìm nước hoa cho mục đích gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    occasion: null,
    gender: null,
    preferences: [],
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Phân tích ý định của người dùng
      const intent = analyzeUserIntent(currentInput);

      console.log("🎯 User Intent:", intent);
      console.log("📝 Context:", conversationContext);

      // Gọi API để lấy recommendations
      const requestData = {
        preferences: {
          occasion: conversationContext.occasion || intent.occasion || "daily",
          gender: conversationContext.gender || intent.gender || "unisex",
          notes: [...conversationContext.preferences, ...intent.notes],
          budget: intent.budget,
          category: intent.category, // Thêm category vào request
        },
      };

      console.log("📤 Sending to API:", requestData);

      const response = await api.post("/ai/recommend", requestData, {
        timeout: 30000, // 30 seconds for AI processing
      });

      console.log("✅ API Response:", response.data);

      // Lấy recommendations từ response.data.data.recommendations
      const recommendations = response.data?.data?.recommendations || [];
      const analysis = response.data?.data?.analysis || "";

      console.log(`🎁 Got ${recommendations.length} recommendations`);

      // Tạo response message
      let botResponse = generateBotResponse(
        currentInput,
        intent,
        recommendations,
        analysis
      );

      // Cập nhật context
      setConversationContext((prev) => ({
        occasion: intent.occasion || prev.occasion,
        gender: intent.gender || prev.gender,
        preferences: [...new Set([...prev.preferences, ...intent.notes])],
      }));

      const botMessage = {
        type: "bot",
        text: botResponse,
        recommendations: recommendations.slice(0, 3),
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("❌ AI Chat Error:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error data:", error.response?.data);

      let errorText = "Xin lỗi, tôi gặp chút vấn đề. ";

      if (error.response) {
        // Server responded with error
        errorText +=
          error.response.data?.message || `Lỗi ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorText +=
          "Không thể kết nối với server. Vui lòng kiểm tra server đã chạy chưa.";
      } else {
        // Something else
        errorText += error.message || "Vui lòng thử lại.";
      }

      const errorMessage = {
        type: "bot",
        text: errorText,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }, 500);
    }
  };

  const analyzeUserIntent = (message) => {
    const msg = message.toLowerCase();
    const intent = {
      occasion: null,
      gender: null,
      notes: [],
      budget: null,
      category: null, // Thêm category để xử lý mini/giftset
    };

    // Phân tích category (mini/giftset)
    if (
      msg.includes("mini") ||
      msg.includes("size nhỏ") ||
      msg.includes("travel size")
    ) {
      intent.category = "Mini";
    } else if (
      msg.includes("giftset") ||
      msg.includes("gift set") ||
      msg.includes("bộ quà") ||
      msg.includes("set quà")
    ) {
      intent.category = "Giftset";
    }

    // Phân tích occasion
    if (
      msg.includes("đi làm") ||
      msg.includes("công sở") ||
      msg.includes("văn phòng")
    ) {
      intent.occasion = "daily";
    } else if (
      msg.includes("dạo phố") ||
      msg.includes("hẹn hò") ||
      msg.includes("date")
    ) {
      intent.occasion = "date";
    } else if (
      msg.includes("tiệc") ||
      msg.includes("sự kiện") ||
      msg.includes("dự tiệc")
    ) {
      intent.occasion = "party";
    } else if (
      msg.includes("thể thao") ||
      msg.includes("gym") ||
      msg.includes("tập luyện")
    ) {
      intent.occasion = "sport";
    }

    // Phân tích gender
    if (msg.includes("nam") || msg.includes("đàn ông") || msg.includes("men")) {
      intent.gender = "men";
    } else if (
      msg.includes("nữ") ||
      msg.includes("phụ nữ") ||
      msg.includes("women")
    ) {
      intent.gender = "women";
    } else if (msg.includes("unisex") || msg.includes("cho cả nam và nữ")) {
      intent.gender = "unisex";
    }

    // Phân tích notes/preferences
    if (msg.includes("hoa") || msg.includes("floral")) {
      intent.notes.push("floral");
    }
    if (msg.includes("gỗ") || msg.includes("woody") || msg.includes("trầm")) {
      intent.notes.push("woody");
    }
    if (
      msg.includes("cam quýt") ||
      msg.includes("citrus") ||
      msg.includes("tươi mát")
    ) {
      intent.notes.push("citrus");
    }
    if (
      msg.includes("ngọt") ||
      msg.includes("sweet") ||
      msg.includes("vanilla")
    ) {
      intent.notes.push("sweet");
    }
    if (
      msg.includes("mạnh mẽ") ||
      msg.includes("nồng") ||
      msg.includes("quyến rũ")
    ) {
      intent.notes.push("strong");
    }
    if (
      msg.includes("nhẹ nhàng") ||
      msg.includes("thanh lịch") ||
      msg.includes("tinh tế")
    ) {
      intent.notes.push("light");
    }

    // Phân tích budget
    if (
      msg.includes("rẻ") ||
      msg.includes("giá tốt") ||
      msg.includes("tiết kiệm")
    ) {
      intent.budget = "low";
    } else if (
      msg.includes("cao cấp") ||
      msg.includes("sang trọng") ||
      msg.includes("đắt")
    ) {
      intent.budget = "high";
    }

    return intent;
  };

  const generateBotResponse = (userMsg, intent, recommendations, analysis) => {
    let response = "";

    if (recommendations && recommendations.length > 0) {
      // Sử dụng analysis từ AI nếu có
      if (analysis) {
        response = `${analysis}\n\n`;
      } else if (intent.occasion) {
        const occasionText = {
          daily: "đi làm/công sở",
          date: "hẹn hò",
          party: "dự tiệc",
          sport: "thể thao",
        };
        response = `Tuyệt vời! Dựa trên nhu cầu ${
          occasionText[intent.occasion]
        } của bạn, tôi xin giới thiệu những lựa chọn sau:\n\n`;
      } else {
        response = "Đây là những gợi ý phù hợp với bạn:\n\n";
      }
    } else {
      response =
        "Bạn có thể cho tôi biết thêm về sở thích của bạn không? Ví dụ: bạn thích hương gỗ, hoa, hay cam quýt?";
    }

    return response;
  };

  const handleQuickReply = (text) => {
    setInputMessage(text);
  };

  const quickReplies = [
    "Nước hoa đi làm",
    "Nước hoa dạo phố",
    "Nước hoa nam",
    "Nước hoa nữ",
    "Nước hoa Mini",
    "Giftset quà tặng",
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        className={`ai-chat-button ${isOpen ? "hidden" : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Mở chat AI"
      >
        <span className="chat-icon">💬</span>
        <span className="chat-text">AI Tư Vấn</span>
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="ai-chatbox">
          {/* Header */}
          <div className="chatbox-header">
            <div className="header-info">
              <div className="bot-avatar">🤖</div>
              <div>
                <h3>AI Tư Vấn Paradise</h3>
                <p className="status">
                  <span className="status-dot"></span> Đang hoạt động
                </p>
              </div>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === "bot" && <div className="message-avatar">🤖</div>}
                <div className="message-content">
                  <p>{msg.text}</p>
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="recommendations">
                      {msg.recommendations.map((rec) => {
                        // Handle both product object and recommendation object structure
                        const product = rec.product || rec;
                        const productId = product._id || product.productId;
                        const productName = product.name || product.productName;
                        const productPrice = product.price || 0;
                        const productImage =
                          product.image || "/images/placeholder.jpg";
                        const productBrand = product.brand || "";

                        return (
                          <div
                            key={productId}
                            className="recommendation-card"
                            onClick={() =>
                              (window.location.href = `/product/${productId}`)
                            }
                          >
                            <img
                              src={productImage}
                              alt={productName}
                              loading="lazy"
                            />
                            <div className="rec-info">
                              <h4>{productName}</h4>
                              {productBrand && (
                                <p className="rec-brand">{productBrand}</p>
                              )}
                              <p className="rec-price">
                                {productPrice > 0
                                  ? `${productPrice.toLocaleString("vi-VN")}đ`
                                  : "Liên hệ"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {msg.type === "user" && (
                  <div className="message-avatar user-avatar">👤</div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
            >
              <span>➤</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbox;
