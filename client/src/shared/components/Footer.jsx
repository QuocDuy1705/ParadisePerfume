import { useState } from "react";
import { Mail, Facebook, Instagram, Send } from "lucide-react";
import { showSuccess, showError } from "../../core/utils/toast";
import api from "../../core/utils/api";
import "../../assets/styles/footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showError("Vui lòng nhập email hợp lệ");
      return;
    }

    setLoading(true);
    try {
      // Call newsletter subscription API
      await api.post("/newsletter/subscribe", { email });
      showSuccess("Đăng ký nhận tin thành công!");
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      showError(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <Mail className="newsletter-icon" />
            <div className="newsletter-text">
              <h3>ĐĂNG KÝ NHẬN BẢN TIN</h3>
              <p>Nhận thông tin mới nhất về sản phẩm và ưu đãi độc quyền</p>
            </div>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "..." : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Column 1: About */}
          <div className="footer-column">
            <h4 className="footer-title">VỀ PARADISE</h4>
            <ul className="footer-links">
              <li>
                <a href="/about">Giới thiệu</a>
              </li>
              <li>
                <a href="/stores">Hệ thống cửa hàng</a>
              </li>
              <li>
                <a href="/careers">Tuyển dụng</a>
              </li>
              <li>
                <a href="/sustainability">Phát triển bền vững</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div className="footer-column">
            <h4 className="footer-title">DỊCH VỤ KHÁCH HÀNG</h4>
            <ul className="footer-links">
              <li>
                <a href="/contact">Liên hệ</a>
              </li>
              <li>
                <a href="/faq">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="/shipping">Chính sách giao hàng</a>
              </li>
              <li>
                <a href="/returns">Đổi trả & Hoàn tiền</a>
              </li>
              <li>
                <a href="/warranty">Bảo hành sản phẩm</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Shopping Guide */}
          <div className="footer-column">
            <h4 className="footer-title">HƯỚNG DẪN MUA HÀNG</h4>
            <ul className="footer-links">
              <li>
                <a href="/how-to-order">Cách đặt hàng</a>
              </li>
              <li>
                <a href="/payment">Phương thức thanh toán</a>
              </li>
              <li>
                <a href="/privacy">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="/terms">Điều khoản sử dụng</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="footer-column">
            <h4 className="footer-title">KẾT NỐI VỚI CHÚNG TÔI</h4>
            <div className="footer-contact">
              <p className="contact-item">
                <strong>Hotline:</strong> 1800 123 456
              </p>
              <p className="contact-item">
                <strong>Email:</strong> paradisesupport@gmail.com
              </p>
              <p className="contact-item">
                <strong>Giờ làm việc:</strong> 8:00 - 22:00 (hàng ngày)
              </p>
            </div>
            <div className="footer-social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>© 2025 Paradise Perfume. All rights reserved.</p>
            <p className="footer-tagline">
              Nơi hương thơm kể câu chuyện của bạn
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
