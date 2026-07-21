const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      dbName: process.env.DB_DATABASE,
    });
    console.log(`✅ MongoDB connected (db: ${process.env.DB_DATABASE})`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
