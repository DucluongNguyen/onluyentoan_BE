const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

// router.get("/", protect, userController.getUsers);
// router.post("/", protect, userController.createUser);
router.post("/register", userController.register);

module.exports = router;
