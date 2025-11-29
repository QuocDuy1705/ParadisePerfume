import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../core/context/AuthContext";
import { useCart } from "../../core/context/CartContext";
import { showSuccess, showError, showWarning } from "../../core/utils/toast";
import {
  validatePasswordStrength,
  validateEmail,
  validateName,
} from "../../core/utils/validators";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import "../../assets/styles/auth.css";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  // State cho login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State cho register
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const { syncGuestCartToServer } = useCart();

  // Google Login Handler
  const handleGoogleLogin = () => {
    // Create Google OAuth URL
    const googleClientId =
      process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
    const redirectUri = encodeURIComponent(
      window.location.origin + "/auth/google/callback"
    );
    const scope = encodeURIComponent("openid profile email");

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    // Open Google login in popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      googleAuthUrl,
      "Google Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for message from popup
    window.addEventListener("message", async (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        const { googleId, email, firstName, lastName, profilePicture } =
          event.data.user;

        try {
          const res = await axios.post(
            "http://localhost:5000/api/users/google",
            {
              googleId,
              email,
              firstName,
              lastName,
              profilePicture,
            }
          );

          localStorage.setItem("token", res.data.token);
          login(res.data);
          await syncGuestCartToServer();

          showSuccess("Đăng nhập Google thành công!");

          if (res.data.user.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/profile");
          }

          if (popup) popup.close();
        } catch (err) {
          showError(
            err.response?.data?.message || "Đăng nhập Google thất bại!"
          );
          if (popup) popup.close();
        }
      }
    });
  };

  // Xử lý login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email
    const emailValidation = validateEmail(loginEmail);
    if (!emailValidation.isValid) {
      showWarning(emailValidation.message);
      return;
    }

    // Validate password
    if (!loginPassword || loginPassword.length < 6) {
      showWarning("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem("token", res.data.token);

      // gọi context login
      login(res.data);

      // Sync guest cart to server
      await syncGuestCartToServer();

      showSuccess("Đăng nhập thành công!");

      // Check role
      if (res.data.user.isAdmin) {
        navigate("/admin"); // admin thì sang trang admin
      } else {
        navigate("/profile"); // user thường thì sang profile
      }

      console.log("User:", res.data.user);
    } catch (err) {
      showError(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  // Xử lý register
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate first name
    const firstNameValidation = validateName(firstName);
    if (!firstNameValidation.isValid) {
      showWarning(firstNameValidation.message);
      return;
    }

    // Validate last name
    const lastNameValidation = validateName(lastName);
    if (!lastNameValidation.isValid) {
      showWarning(lastNameValidation.message);
      return;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      showWarning(emailValidation.message);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      showWarning(passwordValidation.message);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        title,
        firstName,
        lastName,
        country,
        email,
        password,
      });

      showSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      setActiveTab("login"); // sau khi đăng ký thì chuyển sang login
    } catch (err) {
      showError(err.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="brand-title">ACCOUNT</h1>

      {/* Tabs */}
      <div className="auth-tabs">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          SIGN IN
        </button>
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          REGISTER
        </button>
      </div>

      {/* Login Form */}
      {activeTab === "login" && (
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />

          <div style={{ textAlign: "right", marginBottom: "15px" }}>
            <a
              href="/forgot-password"
              style={{
                color: "#666",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="btn-black">
            CONTINUE
          </button>

          <div
            className="divider"
            style={{ margin: "20px 0", textAlign: "center", color: "#999" }}
          >
            HOẶC
          </div>

          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.3s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              />
            </svg>
            Đăng nhập bằng Google
          </button>
        </form>
      )}

      {/* Register Form */}
      {activeTab === "register" && (
        <form className="auth-form" onSubmit={handleRegister}>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          >
            <option value="">Title</option>
            <option value="mr">Mr.</option>
            <option value="mrs">Mrs.</option>
            <option value="miss">Miss</option>
          </select>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Location of residence</option>
            <option value="us">United States</option>
            <option value="vn">Vietnam</option>
            <option value="fr">France</option>
          </select>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
          />
          <PasswordStrengthMeter password={password} />
          <p className="policy-text">
            By creating an account, I agree to PARADISE's{" "}
            <a href="/privacy">Privacy Policy</a> and{" "}
            <a href="/terms">Legal Statement</a>.
          </p>
          <button type="submit" className="btn-black">
            CONTINUE
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
