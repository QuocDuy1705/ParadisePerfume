import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/aiRecommendation.css";

const AIRecommendation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  // Fetch quiz questions on mount
  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  const fetchQuizQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ai/quiz");
      if (response.data.success) {
        setQuestions(response.data.data.questions);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError(
        "Không thể kết nối đến server. Vui lòng đảm bảo server đang chạy (npm start trong folder server)."
      );

      // Fallback: Use hardcoded questions if server not available
      setQuestions([
        {
          id: "gender",
          question: "Bạn đang tìm nước hoa cho?",
          type: "single",
          options: ["Nam", "Nữ", "Unisex"],
        },
        {
          id: "age",
          question: "Độ tuổi của bạn?",
          type: "single",
          options: ["Dưới 20", "20-30", "30-40", "Trên 40"],
        },
        {
          id: "occasion",
          question: "Dịp sử dụng chủ yếu?",
          type: "single",
          options: ["Hàng ngày", "Đi làm", "Đi chơi/Hẹn hò", "Dạ tiệc"],
        },
      ]);
    }
  };

  const handleAnswer = (questionId, answer) => {
    const currentQuestion = questions[step];

    if (currentQuestion.type === "multiple") {
      // Handle multiple choice
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter((a) => a !== answer)
        : [...currentAnswers, answer];

      setAnswers({
        ...answers,
        [questionId]: newAnswers,
      });
    } else {
      // Handle single choice
      setAnswers({
        ...answers,
        [questionId]: answer,
      });
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/recommend",
        {
          preferences: answers,
        }
      );

      if (response.data.success) {
        setRecommendations(response.data.data);
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      setError("Không thể tạo gợi ý. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setRecommendations(null);
    setError(null);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="ai-recommendation-container">
        <div className="ai-loading">
          <div className="ai-loading-spinner"></div>
          <h2>🤖 AI đang phân tích sở thích của bạn...</h2>
          <p>Chúng tôi đang tìm kiếm những sản phẩm hoàn hảo nhất cho bạn</p>
        </div>
      </div>
    );
  }

  if (recommendations) {
    return (
      <div className="ai-recommendation-container">
        <div className="ai-results">
          <h1>✨ Gợi Ý Dành Riêng Cho Bạn</h1>

          <div className="ai-analysis">
            <h3>📊 Phân Tích AI</h3>
            <p>{recommendations.analysis}</p>
          </div>

          <div className="ai-recommendations-grid">
            {recommendations.recommendations.map((rec, index) => (
              <div key={index} className="ai-recommendation-card">
                <div className="ai-card-badge">
                  <span className="ai-score">Phù hợp {rec.score}%</span>
                  <span className="ai-rank">#{index + 1}</span>
                </div>

                {rec.product && (
                  <>
                    <div className="ai-product-image">
                      <img
                        src={rec.product.image || "/images/default-perfume.jpg"}
                        alt={rec.product.name}
                        onError={(e) =>
                          (e.target.src = "/images/default-perfume.jpg")
                        }
                      />
                    </div>

                    <div className="ai-product-info">
                      <h3>{rec.product.name}</h3>
                      <p className="ai-product-type">{rec.product.type}</p>
                      <p className="ai-product-price">
                        {rec.product.price?.toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </>
                )}

                <div className="ai-recommendation-details">
                  <div className="ai-detail-section">
                    <h4>💡 Tại sao phù hợp?</h4>
                    <p>{rec.reason}</p>
                  </div>

                  <div className="ai-detail-section">
                    <h4>⭐ Tốt nhất cho</h4>
                    <p>{rec.bestFor}</p>
                  </div>

                  <div className="ai-detail-section">
                    <h4>✨ Tips sử dụng</h4>
                    <p>{rec.tips}</p>
                  </div>
                </div>

                {rec.product && (
                  <button
                    className="ai-view-product-btn"
                    onClick={() => handleViewProduct(rec.product._id)}
                  >
                    Xem Chi Tiết Sản Phẩm
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="ai-actions">
            <button className="ai-reset-btn" onClick={handleReset}>
              🔄 Làm Lại Quiz
            </button>
            <button
              className="ai-browse-btn"
              onClick={() => navigate("/products")}
            >
              🛍️ Xem Tất Cả Sản Phẩm
            </button>
          </div>

          {recommendations.mode === "fallback" && (
            <div className="ai-fallback-notice">
              ℹ️ Gợi ý này được tạo bởi hệ thống tự động. Để có gợi ý AI chính
              xác hơn, vui lòng liên hệ admin để kích hoạt AI.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="ai-recommendation-container">
        <div className="ai-loading">
          <div className="ai-loading-spinner"></div>
          <h2>Đang tải câu hỏi...</h2>
          {error && (
            <>
              <p className="error-message">{error}</p>
              <button
                className="retry-btn"
                onClick={fetchQuizQuestions}
                style={{
                  marginTop: "20px",
                  padding: "12px 30px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                🔄 Thử Lại
              </button>
              <p
                style={{ marginTop: "20px", fontSize: "0.9rem", color: "#999" }}
              >
                💡 Đảm bảo server đang chạy: <code>cd server && npm start</code>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step];
  const currentAnswer = answers[currentQuestion?.id];
  const isLastStep = step === questions.length - 1;
  const canProceed =
    currentAnswer &&
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  return (
    <div className="ai-recommendation-container">
      <div className="ai-quiz">
        <div className="ai-quiz-header">
          <h1>🤖 AI Tư Vấn Nước Hoa</h1>
          <p>Trả lời một vài câu hỏi để AI tìm nước hoa hoàn hảo cho bạn</p>
          <div className="ai-progress-bar">
            <div
              className="ai-progress-fill"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="ai-step-counter">
            Câu hỏi {step + 1} / {questions.length}
          </p>
        </div>

        {error && <div className="ai-error">⚠️ {error}</div>}

        <div className="ai-question-card">
          <h2>{currentQuestion.question}</h2>

          <div
            className={`ai-options ${
              currentQuestion.type === "multiple" ? "multiple" : "single"
            }`}
          >
            {currentQuestion.options.map((option, index) => {
              const isSelected =
                currentQuestion.type === "multiple"
                  ? (currentAnswer || []).includes(option)
                  : currentAnswer === option;

              return (
                <button
                  key={index}
                  className={`ai-option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                >
                  {option}
                  {isSelected && <span className="ai-checkmark">✓</span>}
                </button>
              );
            })}
          </div>

          {currentQuestion.type === "multiple" && (
            <p className="ai-hint">💡 Bạn có thể chọn nhiều đáp án</p>
          )}
        </div>

        <div className="ai-navigation">
          <button
            className="ai-nav-btn ai-prev-btn"
            onClick={handlePrevious}
            disabled={step === 0}
          >
            ← Câu Trước
          </button>

          {isLastStep ? (
            <button
              className="ai-nav-btn ai-submit-btn"
              onClick={handleSubmit}
              disabled={!canProceed}
            >
              ✨ Nhận Gợi Ý AI
            </button>
          ) : (
            <button
              className="ai-nav-btn ai-next-btn"
              onClick={handleNext}
              disabled={!canProceed}
            >
              Câu Tiếp →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
