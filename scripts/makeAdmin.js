// scripts/makeAdmin.js
// Gán quyền admin cho 1 tài khoản đã đăng ký (theo email).
// Không có UI cho việc này vì lý do bảo mật — chỉ chạy tay từ server.
//
// Chạy: node scripts/makeAdmin.js user@example.com

const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const User = require("../models/user.model");

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error("Cách dùng: node scripts/makeAdmin.js <email>");
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    console.error(`Không tìm thấy user với email: ${email}`);
    process.exit(1);
  }

  console.log(`Đã cấp quyền admin cho: ${user.email}`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Thất bại:", err);
  process.exit(1);
});
