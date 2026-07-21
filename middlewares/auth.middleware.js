const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Người dùng không tồn tại" });
      }

      return next();
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  }

  return res.status(401).json({ message: "Không có token" });
};

// Chỉ cho phép các role được liệt kê đi tiếp (dùng sau middleware `protect`)
// Ví dụ: router.post('/', protect, restrictTo('admin'), controller)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Không có token" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    return next();
  };
};
