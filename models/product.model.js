const mongoose = require("mongoose");
const baseOptions = require("./base.model");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    images: {
      type: [String], // ✅ Mảng các URL ảnh
      required: [true, "Ảnh sản phẩm là bắt buộc"],
      validate: {
        validator: (val) => Array.isArray(val) && val.length > 0,
        message: "Phải có ít nhất 1 ảnh",
      },
    },
    description: {
      type: String,
      required: [true, "Mô tả sản phẩm là bắt buộc"],
      trim: true,
    },
    material: {
      type: String,
      required: [true, "Chất liệu sản phẩm là bắt buộc"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Giá là bắt buộc"],
    },
    details: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        stars: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    outStanding: {
      type: Boolean,
      default: false,
    },
  },
  {
    ...baseOptions,
  }
);

module.exports = mongoose.model("Product", productSchema);
