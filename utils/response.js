// utils/response.js

exports.successResponse = ({ res, data, status = 200 }) => {
  return res.status(status).json({
    success: true,
    message: "Thành công",
    data,
  });
};

exports.errorResponse = ({ res, message = "Lỗi server", status = 500 }) => {
  return res.status(status).json({
    success: false,
    message,
    error: null,
  });
};
