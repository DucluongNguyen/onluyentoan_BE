require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/user.model');
(async () => {
  await connectDB();
  const user = await User.findOne({ email: 'admin@onluyentoan.com' });
  if (!user) {
    console.log('Không tìm thấy user admin@onluyentoan.com');
    process.exit(1);
  }
  user.password = 'adminonluyentoan';
  await user.save();
  console.log('Đã đổi mật khẩu cho:', user.email);
  process.exit(0);
})();
