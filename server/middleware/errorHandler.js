// Custom Error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Not Found Error Handler
export const notFound = (req, res, next) => {
  const error = new AppError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log error cho development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  // Xử lý các loại lỗi cụ thể
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Không tìm thấy tài nguyên với id: ${err.value}`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} đã tồn tại trong hệ thống`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    const message = `Dữ liệu không hợp lệ: ${errors.join(", ")}`;
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Token không hợp lệ", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Token đã hết hạn", 401);
  }

  // Response
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message || "Lỗi máy chủ",
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
};

// Async handler wrapper để tránh try-catch lặp lại
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
