const express = require("express");
const router = express.Router();
const {
  uploadResource,
  getResourcesByCategory,
  getResourceById,
  downloadResource,
  viewResource,
  deleteResource,
  updateResource,
} = require("../controllers/resource.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const uploadResourceFile = require("../middlewares/resourceUpload.middleware");

// Xem danh sách / xem trực tiếp / tải về: công khai, không cần đăng nhập
router.get("/", getResourcesByCategory);
router.get("/:id/view", viewResource);
router.get("/:id/download", downloadResource);
router.get("/:id", getResourceById);

// Upload / sửa / xoá: chỉ admin
router.post(
  "/",
  protect,
  restrictTo("admin"),
  uploadResourceFile.single("file"),
  uploadResource
);
router.put("/:id", protect, restrictTo("admin"), updateResource);
router.delete("/:id", protect, restrictTo("admin"), deleteResource);

/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: Quản lý tài nguyên (file) gắn trong danh mục dạng cây
 */

/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Lấy danh sách tài nguyên theo danh mục (công khai)
 *     tags: [Resource]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách tài nguyên
 *   post:
 *     summary: Upload tài nguyên mới — chỉ admin
 *     tags: [Resource]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - file
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: ObjectId của danh mục
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload thành công
 *       403:
 *         description: Không có quyền (không phải admin)
 */

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     summary: Lấy metadata 1 tài nguyên (title, mimeType, fileName...) — công khai
 *     tags: [Resource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Metadata tài nguyên
 *       404:
 *         description: Không tìm thấy tài nguyên
 */

/**
 * @swagger
 * /resources/{id}/view:
 *   get:
 *     summary: Xem trực tiếp trên trình duyệt (inline, không tải về) — PDF và .docx — công khai
 *     tags: [Resource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nội dung file (Content-Disposition inline)
 *       400:
 *         description: Định dạng chưa hỗ trợ xem trực tiếp (VD .doc cũ)
 *       404:
 *         description: Không tìm thấy tài nguyên
 */

/**
 * @swagger
 * /resources/{id}/download:
 *   get:
 *     summary: Tải tài nguyên về máy — công khai
 *     tags: [Resource]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File tài nguyên
 *       404:
 *         description: Không tìm thấy tài nguyên
 */

/**
 * @swagger
 * /resources/{id}:
 *   put:
 *     summary: Cập nhật tài nguyên — chỉ admin
 *     tags: [Resource]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xoá tài nguyên — chỉ admin
 *     tags: [Resource]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
 */

module.exports = router;
