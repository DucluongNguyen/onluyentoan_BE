// models/BaseSchema.js (có thể dùng lại)
const mongoose = require("mongoose");

const baseOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};

module.exports = baseOptions;
