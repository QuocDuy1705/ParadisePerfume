import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // dùng context
import "../assets/styles/auth.css";
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

  // Xử lý login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem("token", res.data.token);

      // gọi context login
      login(res.data);

      alert("Đăng nhập thành công!");

      // Check role
      if (res.data.user.isAdmin) {
        navigate("/admin"); // admin thì sang trang admin
      } else {
        navigate("/profile"); // user thường thì sang profile
      }

      console.log("User:", res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // Xử lý register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        title,
        firstName,
        lastName,
        country,
        email,
        password,
      });

      alert("Đăng ký thành công!");
      setActiveTab("login"); // sau khi đăng ký thì chuyển sang login
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
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
          />
          <p className="policy-text">
            By creating an account, I agree to PARADISE’s{" "}
            <a href="#">Privacy Policy</a> and <a href="#">Legal Statement</a>.
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
