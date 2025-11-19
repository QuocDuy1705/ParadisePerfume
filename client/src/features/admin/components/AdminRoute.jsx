import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

/**
 * Component bảo vệ route admin
 * Chỉ cho phép user có isAdmin = true truy cập
 */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Kiểm tra có token không
  if (!token) {
    toast.error("Vui lòng đăng nhập để truy cập trang này");
    return <Navigate to="/auth" replace />;
  }

  try {
    // Decode token để lấy thông tin user
    const decodedToken = jwtDecode(token);

    // Kiểm tra token hết hạn
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Phiên đăng nhập đã hết hạn");
      return <Navigate to="/auth" replace />;
    }

    // Kiểm tra quyền admin
    if (!decodedToken.isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này");
      return <Navigate to="/" replace />;
    }

    // Cho phép truy cập
    return children;
  } catch (error) {
    console.error("Token validation error:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.error("Phiên đăng nhập không hợp lệ");
    return <Navigate to="/auth" replace />;
  }
};

export default AdminRoute;
