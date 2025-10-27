import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// Kiểm tra token với async/await
export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError("Token không được cung cấp", 401);
    }

    // Verify token với Promise
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    // Lưu thông tin user từ token (id, email, isAdmin...)
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Token không hợp lệ", 403));
    }
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token đã hết hạn", 403));
    }
    next(error);
  }
}

// Kiểm tra quyền admin
export function isAdmin(req, res, next) {
  if (!req.user) {
    return next(new AppError("Vui lòng đăng nhập", 401));
  }

  if (!req.user.isAdmin) {
    return next(new AppError("Không có quyền truy cập (Admin only)", 403));
  }

  next();
}
