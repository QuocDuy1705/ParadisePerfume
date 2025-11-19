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
          <button type="submit" className="btn-black">
            CONTINUE
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
