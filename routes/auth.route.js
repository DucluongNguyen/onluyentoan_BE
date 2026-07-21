const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Xác thực người dùng
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email đã tồn tại
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập và nhận token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công và trả về token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại (kèm role)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */

module.exports = router;
