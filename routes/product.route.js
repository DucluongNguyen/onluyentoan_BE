const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  getOutStandingProduct,
} = require("../controllers/product.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/all", getAllProducts);
router.get("/out-standing", getOutStandingProduct);

router.get("/:id", getProductById);
router.post("/", protect, upload.array("files", 10), createProduct);
router.put("/:id", protect, updateProduct);

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Quản lý sản phẩm
 */

/**
 * @swagger
 * /product/all:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */

/**
 * @swagger
 * /product/out-standing:
 *   get:
 *     summary: Lấy sản phẩm nổi bật
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm nổi bật
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID sản phẩm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Product]
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
 *               - price
 *               - description
 *               - material
 *               - files
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               material:
 *                 type: string
 *               details:
 *                 type: string
 *               price:
 *                 type: number
 *               outStanding:
 *                 type: boolean
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID sản phẩm cần cập nhật
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               material:
 *                 type: string
 *               details:
 *                 type: string
 *               price:
 *                 type: number
 *               outStanding:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */

module.exports = router;
