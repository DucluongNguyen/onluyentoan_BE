const Category = require("../models/category.model");
const Resource = require("../models/resource.model");
const slugify = require("../utils/slugify");
const { successResponse, errorResponse } = require("../utils/response");

// Dựng cây danh mục (nested) từ danh sách phẳng
// Lưu ý: dùng .lean() nên không đi qua transform toJSON của schema, phải tự
// map "_id" -> "id" (string) ở đây để frontend dùng thống nhất.
function buildTree(categories, parentId = null) {
  return categories
    .filter((cat) => String(cat.parent || "") === String(parentId || ""))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map((cat) => ({
      id: String(cat._id),
      name: cat.name,
      slug: cat.slug,
      parent: cat.parent ? String(cat.parent) : null,
      order: cat.order,
      children: buildTree(categories, cat._id),
    }));
}

// GET /api/categories/tree → Lấy toàn bộ cây danh mục tài nguyên
exports.getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const tree = buildTree(categories, null);
    return successResponse({ res, data: tree });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 500 });
  }
};

// GET /api/categories/:id → Lấy chi tiết 1 danh mục
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      return errorResponse({
        res,
        message: "Không tìm thấy danh mục",
        status: 404,
      });
    }
    return successResponse({ res, data: category });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 500 });
  }
};

// POST /api/categories → Tạo danh mục (category con hoặc gốc) — chỉ admin
exports.createCategory = async (req, res) => {
  try {
    const { name, parent = null, order = 0 } = req.body;

    if (!name || !name.trim()) {
      return errorResponse({
        res,
        message: "Tên danh mục là bắt buộc",
        status: 400,
      });
    }

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return errorResponse({
          res,
          message: "Danh mục cha không tồn tại",
          status: 400,
        });
      }
    }

    const slug = slugify(name);

    const exists = await Category.findOne({ parent: parent || null, slug });
    if (exists) {
      return errorResponse({
        res,
        message: "Đã tồn tại danh mục con cùng tên ở cấp này",
        status: 400,
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      parent: parent || null,
      order,
      createdBy: req.user?._id,
    });

    return successResponse({ res, data: category, status: 201 });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 400 });
  }
};

// PUT /api/categories/:id → Đổi tên / di chuyển danh mục — chỉ admin
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent, order } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return errorResponse({
        res,
        message: "Không tìm thấy danh mục",
        status: 404,
      });
    }

    // Không cho phép gán chính nó (hoặc con cháu của nó) làm cha của chính nó
    if (parent) {
      if (String(parent) === String(id)) {
        return errorResponse({
          res,
          message: "Danh mục không thể là cha của chính nó",
          status: 400,
        });
      }
      const descendantIds = await getDescendantIds(id);
      if (descendantIds.map(String).includes(String(parent))) {
        return errorResponse({
          res,
          message: "Không thể di chuyển danh mục vào chính con cháu của nó",
          status: 400,
        });
      }
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return errorResponse({
          res,
          message: "Danh mục cha không tồn tại",
          status: 400,
        });
      }
    }

    if (name && name.trim()) {
      category.name = name.trim();
      category.slug = slugify(name);
    }
    if (parent !== undefined) category.parent = parent || null;
    if (order !== undefined) category.order = order;

    await category.save();

    return successResponse({ res, data: category });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 400 });
  }
};

// Lấy toàn bộ id con cháu của 1 category (đệ quy)
async function getDescendantIds(categoryId) {
  const children = await Category.find({ parent: categoryId }).select("_id");
  let ids = children.map((c) => c._id);
  for (const child of children) {
    const grandChildren = await getDescendantIds(child._id);
    ids = ids.concat(grandChildren);
  }
  return ids;
}

// DELETE /api/categories/:id → Xoá danh mục — chỉ admin
// Chặn xoá nếu còn danh mục con hoặc tài nguyên bên trong, để tránh mất dữ liệu ngoài ý muốn.
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return errorResponse({
        res,
        message: "Không tìm thấy danh mục",
        status: 404,
      });
    }

    const childCount = await Category.countDocuments({ parent: id });
    if (childCount > 0) {
      return errorResponse({
        res,
        message: "Danh mục còn danh mục con, hãy xoá danh mục con trước",
        status: 400,
      });
    }

    const resourceCount = await Resource.countDocuments({ category: id });
    if (resourceCount > 0) {
      return errorResponse({
        res,
        message: "Danh mục còn tài nguyên, hãy xoá tài nguyên trước",
        status: 400,
      });
    }

    await category.deleteOne();

    return successResponse({ res, data: { id } });
  } catch (err) {
    return errorResponse({ res, message: err.message, status: 500 });
  }
};
