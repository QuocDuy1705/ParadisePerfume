import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/aiFeature.css";

const AIFeatureCard = () => {
  return (
    <section className="ai-feature-section">
      <div className="ai-feature-container">
        <div className="ai-feature-content">
          <div className="ai-feature-icon">
            <span className="ai-robot">🤖</span>
            <div className="ai-glow"></div>
          </div>

          <h2 className="ai-feature-title">Tìm Nước Hoa Hoàn Hảo Với AI</h2>

          <p className="ai-feature-description">
            Công nghệ AI tiên tiến giúp bạn khám phá những mùi hương phù hợp
            nhất với phong cách và cá tính của mình. Chỉ cần trả lời vài câu hỏi
            đơn giản.
          </p>

          <div className="ai-feature-benefits">
            <div className="ai-benefit">
              <span className="benefit-icon">✨</span>
              <span>Phân tích AI chính xác</span>
            </div>
            <div className="ai-benefit">
              <span className="benefit-icon">🎯</span>
              <span>Gợi ý cá nhân hóa</span>
            </div>
            <div className="ai-benefit">
              <span className="benefit-icon">⚡</span>
              <span>Kết quả tức thì</span>
            </div>
          </div>

          <Link to="/ai-recommend" className="ai-feature-btn">
            <span className="btn-icon">🚀</span>
            <span className="btn-text">Bắt Đầu Ngay - Miễn Phí</span>
            <span className="btn-arrow">→</span>
          </Link>

          <p className="ai-feature-note">
            💡 Chỉ mất 2 phút để tìm nước hoa trong mơ của bạn
          </p>
        </div>

        <div className="ai-feature-visual">
          <div className="ai-visual-card">
            <div className="visual-header">
              <div className="visual-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="visual-title">AI Recommendation</span>
            </div>
            <div className="visual-content">
              <div className="visual-question">
                <span className="q-icon">❓</span>
                <div className="q-text">
                  <p>Bạn đang tìm nước hoa cho?</p>
                  <div className="q-options">
                    <span className="option selected">Nam</span>
                    <span className="option">Nữ</span>
                    <span className="option">Unisex</span>
                  </div>
                </div>
              </div>

              <div className="visual-ai-thinking">
                <div className="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>AI đang phân tích...</p>
              </div>

              <div className="visual-result">
                <div className="result-badge">95% phù hợp</div>
                <p className="result-name">Dior Sauvage EDT</p>
                <p className="result-reason">
                  Hoàn hảo cho phong cách nam tính, lịch lãm...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatureCard;
