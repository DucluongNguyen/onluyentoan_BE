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

// Cho phép PDF và Word (.doc/.docx). PDF xem trực tiếp bằng pdf.js, .docx xem
// trực tiếp bằng mammoth (chuyển sang HTML ở client) — .doc (định dạng nhị
// phân cũ) chỉ hỗ trợ tải về vì không có thư viện xem trực tiếp đáng tin cậy.
const ALLOWED_MIMETYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error(
        "Định dạng file không được hỗ trợ. Chỉ chấp nhận file PDF hoặc Word (.doc, .docx)."
      ),
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
