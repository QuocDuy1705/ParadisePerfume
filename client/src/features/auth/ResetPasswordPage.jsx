import React, { useState, useEffect } from "react";
import axios from "axios";
import { showSuccess, showError, showWarning } from "../../core/utils/toast";
import { validatePasswordStrength } from "../../core/utils/validators";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../assets/styles/auth.css";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get email and token from URL params
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !token || !newPassword) {
      showWarning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      showWarning(passwordValidation.message);
      return;
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      showWarning("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        {
          email,
          token,
          newPassword,
        }
      );

      showSuccess(res.data.message);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (err) {
      showError(err.response?.data?.message || "Không thể đặt lại mật khẩu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="brand-title">ĐẶT LẠI MẬT KHẨU</h1>

      <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
        Nhập mã xác thực từ email và mật khẩu mới
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

        <input
          type="text"
          placeholder="Mã xác thực (6 số)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          maxLength={6}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />

        <PasswordStrengthMeter password={newPassword} />

        <button type="submit" className="btn-black" disabled={isLoading}>
          {isLoading ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
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
    </div>
  );
};

export default ResetPasswordPage;
