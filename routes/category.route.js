const express = require("express");
const router = express.Router();
const {
  getCategoryTree,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

// Xem cây danh mục: công khai, không cần đăng nhập
router.get("/tree", getCategoryTree);
router.get("/:id", getCategoryById);

// Tạo / sửa / xoá danh mục: chỉ admin
router.post("/", protect, restrictTo("admin"), createCategory);
router.put("/:id", protect, restrictTo("admin"), updateCategory);
router.delete("/:id", protect, restrictTo("admin"), deleteCategory);

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Quản lý danh mục tài nguyên dạng cây (Toán THCS/THPT -> Lớp -> Học kỳ...)
 */

/**
 * @swagger
 * /categories/tree:
 *   get:
 *     summary: Lấy toàn bộ cây danh mục tài nguyên (công khai)
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Cây danh mục (nested)
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tạo danh mục mới (danh mục gốc hoặc danh mục con) — chỉ admin
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Lớp 10
 *               parent:
 *                 type: string
 *                 description: ObjectId danh mục cha, để trống nếu là danh mục gốc
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       403:
 *         description: Không có quyền (không phải admin)
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Đổi tên / di chuyển danh mục — chỉ admin
 *     tags: [Category]
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
 *     summary: Xoá danh mục (phải rỗng — không còn con hoặc tài nguyên) — chỉ admin
 *     tags: [Category]
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
 *       400:
 *         description: Danh mục còn con hoặc tài nguyên bên trong
 */

module.exports = router;
