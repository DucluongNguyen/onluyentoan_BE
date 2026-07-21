const mongoose = require("mongoose");
const baseOptions = require("./base.model");

// Category dạng cây (self-reference qua "parent") để mô tả sơ đồ:
// Tài nguyên -> Toán THCS/THPT -> Lớp -> Học kỳ/Giữa kỳ -> ...
// Admin có thể tạo category con ở bất kỳ cấp nào, không giới hạn độ sâu.
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null = danh mục gốc
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    ...baseOptions,
  }
);

// Không cho phép 2 category con cùng cấp trùng slug
categorySchema.index({ parent: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
