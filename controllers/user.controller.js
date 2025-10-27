const User = require("../models/user.model");
const { sendEmail } = require("../services/emailService");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// exports.createUser = async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// exports.getUsers = async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// };

exports.register = catchAsync(async (req, res, next) => {
  const { username, phone } = req.body;

  // 🧩 Ở đây bạn có thể lưu user vào database
  // const newUser = await User.create({ username, email });

  // ✅ Gửi thông báo cho admin
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "🔔 Có user mới đăng ký",
      html: `
        <h2>Thông báo: User mới</h2>
        <p><b>Tên:</b> ${username}</p>
        <p><b>Số điện thoại:</b> ${phone}</p>
        <p>Thời gian: ${new Date().toLocaleString("vi-VN")}</p>
      `,
    });

    res.status(201).json({
      status: "success",
      message: "Đăng ký thành công, admin đã nhận được thông báo!",
    });
  } catch (err) {
    console.error(err);
    next(new AppError("Không thể gửi mail thông báo cho admin", 500));
  }
});
