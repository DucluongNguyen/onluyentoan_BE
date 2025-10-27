const Product = require("../models/product.model");
const { successResponse, errorResponse } = require("../utils/response");

// GET /api/products → Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return successResponse({ res, data: products });
  } catch (err) {
    return errorResponse({ res, error: err });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).lean();

    if (!product) {
      return errorResponse({
        res,
        message: "Không tìm thấy sản phẩm",
        status: 404,
      });
    }

    return successResponse({ res, data: product });
  } catch (err) {
    return errorResponse({ res, error: err.message, status: 500 });
  }
};

// POST /api/products → Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      details,
      rating,
      material,
      price,
      outStanding,
    } = req.body;
    // ✅ Lấy đường dẫn file từ multer
    const images = req.files?.map((file) => file?.path) || [];

    if (images.length === 0) {
      return errorResponse({ res, message: "Cần ít nhất 1 ảnh", status: 400 });
    }

    const product = await Product.create({
      title,
      description,
      price,
      material,
      details,
      images,
      outStanding,
    });

    return successResponse({ res: res, data: product });
  } catch (err) {
    console.log({ err });
    res
      .status(400)
      .json({ message: "Tạo sản phẩm thất bại", error: err.message });
  }
};

// PUT /api/products/:id → Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Cập nhật sản phẩm thất bại", error: err.message });
  }
};

exports.getOutStandingProduct = async (req, res) => {
  try {
    const outStanding = await Product.find({ outStanding: true });
    return successResponse({ res, data: outStanding });
  } catch (error) {
    return errorResponse({
      res,
      message: error?.message,
      status: 400,
    });
  }
};
