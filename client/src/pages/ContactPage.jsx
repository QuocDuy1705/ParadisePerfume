import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";
import api from "../utils/api";
import "../assets/styles/info-pages.css";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/contact", formData);
      showSuccess("Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ bạn sớm.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      showError(
        error.response?.data?.message ||
          "Gửi tin nhắn thất bại. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-page">
      <div className="info-container">
        {/* Header */}
        <div className="info-header">
          <h1 className="info-title">LIÊN HỆ</h1>
          <p className="info-subtitle">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông
            tin, Paradise sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>

        {/* Contact Boxes */}
        <div className="contact-boxes">
          <div className="contact-box">
            <Phone className="contact-box-icon" />
            <h3 className="contact-box-title">ĐIỆN THOẠI</h3>
            <p className="contact-box-text">1800 123 456</p>
            <p className="contact-box-text">(028) 3822 xxxx</p>
          </div>

          <div className="contact-box">
            <Mail className="contact-box-icon" />
            <h3 className="contact-box-title">EMAIL</h3>
            <p className="contact-box-text">paradisesupport@gmail.com</p>
            <p className="contact-box-text">sales@paradise.vn</p>
          </div>

          <div className="contact-box">
            <MapPin className="contact-box-icon" />
            <h3 className="contact-box-title">ĐỊA CHỈ</h3>
            <p className="contact-box-text">123 Nguyễn Huệ, Quận 1</p>
            <p className="contact-box-text">TP. Hồ Chí Minh</p>
          </div>

          <div className="contact-box">
            <Clock className="contact-box-icon" />
            <h3 className="contact-box-title">GIỜ LÀM VIỆC</h3>
            <p className="contact-box-text">Thứ 2 - Chủ nhật</p>
            <p className="contact-box-text">8:00 - 22:00</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="info-content">
          <div className="content-section">
            <h2 className="section-title">GỬI TIN NHẮN</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">HỌ VÀ TÊN *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">CHỦ ĐỀ *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Vấn đề cần hỗ trợ"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">NỘI DUNG *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "ĐANG GỬI..." : "GỬI TIN NHẮN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
