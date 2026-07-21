require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/user.model');
(async () => {
  await connectDB();
  const user = await User.create({
    name: 'Admin',
    email: 'admin@onluyentoan.com',
    password: 'adminonluyentoan',
    role: 'admin',
  });
  console.log('Created admin:', user.email);
  process.exit(0);
})();
