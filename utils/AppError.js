// utils/appError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // lỗi do app, không phải crash hệ thống

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
