const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");

// POST /api/upload – upload nhiều file
router.post("/", upload.array("files", 10), (req, res) => {
  const fileInfos = req.files.map((file) => ({
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
    size: file.size,
  }));
  res.json({ message: "Tải lên thành công", files: fileInfos });
});

module.exports = router;
