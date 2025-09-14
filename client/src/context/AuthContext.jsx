import React, { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Kiểm tra token hết hạn
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          return null;
        }

        return {
          id: decoded.id,
          email: decoded.email,
          isAdmin: decoded.isAdmin || false,
        };
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
    return null;
  });

  // Đăng nhập
  const login = ({ token }) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser({
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin || false,
    });
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
