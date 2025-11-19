import axios from "axios";

// Base URL từ environment variable hoặc mặc định localhost
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - thêm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý các lỗi phổ biến
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - xóa token và redirect về login
          console.error("Unauthorized - Token hết hạn hoặc không hợp lệ");
          localStorage.removeItem("token");
          if (window.location.pathname !== "/auth") {
            window.location.href = "/auth";
          }
          break;

        case 403:
          console.error("Forbidden - Không có quyền truy cập");
          break;

        case 404:
          console.error("Not Found - Không tìm thấy tài nguyên");
          break;

        case 500:
          console.error("Server Error - Lỗi máy chủ");
          break;

        default:
          console.error(`Error ${status}:`, data.message || "Unknown error");
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("Network Error - Không thể kết nối đến server");
    } else {
      // Lỗi khác
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
