// middlewares/resourceUpload.middleware.js
// Cấu hình upload riêng cho tài nguyên học tập (khác với upload.middleware.js
// vốn chỉ cho phép ảnh sản phẩm). Cho phép tài liệu học tập phổ biến.
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "resources");

// Tạo sẵn thư mục lưu file nếu chưa có
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `resource-${uniqueSuffix}${ext}`);
  },
});

// Chỉ cho phép PDF — để có thể xem trực tiếp (preview) trên trình duyệt bằng
// trình xem PDF gốc, thay vì phải tải nhiều loại file khác nhau.
const ALLOWED_MIMETYPES = ["application/pdf"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error("Định dạng file không được hỗ trợ. Chỉ chấp nhận file PDF."),
      false
    );
};

const uploadResource = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = uploadResource;
module.exports.UPLOAD_DIR = UPLOAD_DIR;
