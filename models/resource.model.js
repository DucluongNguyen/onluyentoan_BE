const mongoose = require("mongoose");
const baseOptions = require("./base.model");

// Tài nguyên (file) gắn vào 1 danh mục trong cây (Category).
// Chỉ admin được tạo/xoá (kiểm tra ở route bằng middleware restrictTo("admin")).
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tên tài nguyên là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Tài nguyên phải thuộc 1 danh mục"],
    },
    fileName: {
      type: String, // tên file gốc lúc upload
      required: true,
    },
    filePath: {
      type: String, // đường dẫn vật lý trên server (dùng để đọc file khi tải về)
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // bytes
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    ...baseOptions,
  }
);

resourceSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model("Resource", resourceSchema);
