const fs = require("fs");
const path = require("path");
const Resource = require("../models/resource.model");
const Category = require("../models/category.model");
const { successResponse, errorResponse } = require("../utils/response");

// POST /api/resources → Upload tài nguyên mới — chỉ admin
exports.uploadResource = async (req, res) => {
  try {
    const { title, description = "", category } = req.body;
    const file = req.file;

    if (!file) {
      return errorResponse({ res, message: "Cần chọn 1 file", status: 400 });
    }

    if (!title || !title.trim()) {
      // Xoá file vừa upload nếu thiếu dữ liệu bắt buộc, tránh rác trên disk
      fs.unlink(file.path, () => {});
      return errorResponse({
        res,
        message: "Tên tài nguyên là bắt buộc",
        status: 400,
      });
    }

    if (!category) {
      fs.unlink(file.path, () => {});
      return errorResponse({
        res,
        message: "Cần chọn danh mục cho tài nguyên",
        status: 400,
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      fs.unlink(file.path, () => {});
      return errorResponse({
        res,
        message: "Danh mục không tồn tại",
        status: 400,
      });
    }

    const resource = await Resource.create({
      title: title.trim(),
      description,
      category,
      fileName: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedBy: req.user._id,
    });

    return successResponse({ res, data: resource, status: 201 });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 400 });
  }
};

// GET /api/resources?category=:id → Danh sách tài nguyên trong 1 danh mục — cần đăng nhập
exports.getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return errorResponse({
        res,
        message: "Thiếu tham số category",
        status: 400,
      });
    }

    const resources = await Resource.find({ category })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .select("-filePath"); // không lộ đường dẫn vật lý trên server

    return successResponse({ res, data: resources });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 500 });
  }
};

// GET /api/resources/:id/download → Tải file — cần đăng nhập (user hoặc admin)
exports.downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return errorResponse({
        res,
        message: "Không tìm thấy tài nguyên",
        status: 404,
      });
    }

    if (!fs.existsSync(resource.filePath)) {
      return errorResponse({
        res,
        message: "File không còn tồn tại trên server",
        status: 404,
      });
    }

    resource.downloadCount += 1;
    await resource.save();

    return res.download(
      path.resolve(resource.filePath),
      resource.fileName
    );
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 500 });
  }
};

// GET /api/resources/:id/view → Xem PDF trực tiếp trên trình duyệt (không tải về) — cần đăng nhập
exports.viewResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return errorResponse({
        res,
        message: "Không tìm thấy tài nguyên",
        status: 404,
      });
    }

    if (resource.mimeType !== "application/pdf") {
      return errorResponse({
        res,
        message: "Chỉ có thể xem trực tiếp file PDF",
        status: 400,
      });
    }

    if (!fs.existsSync(resource.filePath)) {
      return errorResponse({
        res,
        message: "File không còn tồn tại trên server",
        status: 404,
      });
    }

    // "inline" thay vì "attachment" để trình duyệt render PDF thay vì tải xuống
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(resource.fileName)}"`
    );
    return fs.createReadStream(path.resolve(resource.filePath)).pipe(res);
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 500 });
  }
};

// DELETE /api/resources/:id → Xoá tài nguyên — chỉ admin
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return errorResponse({
        res,
        message: "Không tìm thấy tài nguyên",
        status: 404,
      });
    }

    // Xoá file vật lý trên disk, không chặn nếu lỗi (file có thể đã bị xoá thủ công)
    fs.unlink(resource.filePath, () => {});

    await resource.deleteOne();

    return successResponse({ res, data: { id: req.params.id } });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 500 });
  }
};

// PUT /api/resources/:id → Cập nhật tiêu đề/mô tả/danh mục — chỉ admin
exports.updateResource = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return errorResponse({
        res,
        message: "Không tìm thấy tài nguyên",
        status: 404,
      });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return errorResponse({
          res,
          message: "Danh mục không tồn tại",
          status: 400,
        });
      }
      resource.category = category;
    }
    if (title !== undefined) resource.title = title.trim();
    if (description !== undefined) resource.description = description;

    await resource.save();

    return successResponse({ res, data: resource });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 400 });
  }
};
