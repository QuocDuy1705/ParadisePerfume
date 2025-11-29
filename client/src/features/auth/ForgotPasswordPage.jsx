import React, { useState } from "react";
import axios from "axios";
import { showSuccess, showError, showWarning } from "../../core/utils/toast";
import { validateEmail } from "../../core/utils/validators";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/auth.css";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      showWarning(emailValidation.message);
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        {
          email,
        }
      );

      showSuccess(res.data.message);
      setEmailSent(true);

      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        navigate(`/reset-password?email=${email}`);
      }, 2000);
    } catch (err) {
      showError(
        err.response?.data?.message || "Không thể gửi email khôi phục!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="brand-title">QUÊN MẬT KHẨU</h1>

      {!emailSent ? (
        <>
          <p
            style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}
          >
            Nhập email của bạn để nhận mã xác thực đặt lại mật khẩu
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <button type="submit" className="btn-black" disabled={isLoading}>
              {isLoading ? "ĐANG GỬI..." : "GỬI MÃ XÁC THỰC"}
            </button>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <a
                href="/auth"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                ← Quay lại đăng nhập
              </a>
            </div>
          </form>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
          <h2 style={{ marginBottom: "10px" }}>Email đã được gửi!</h2>
          <p style={{ color: "#666" }}>
            Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn.
          </p>
          <p style={{ color: "#999", fontSize: "14px", marginTop: "20px" }}>
            Đang chuyển đến trang đặt lại mật khẩu...
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
