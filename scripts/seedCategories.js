// scripts/seedCategories.js
// Seed cây danh mục tài nguyên theo đúng sơ đồ:
//
// Toán THCS
//   ├── Lớp 6  ── GK1 / HK1 / GK2 / HK2
//   ├── Lớp 7  ── GK1 / HK1 / GK2 / HK2
//   ├── Lớp 8  ── GK1 / HK1 / GK2 / HK2
//   └── Lớp 9  ── GK1 / HK1 / GK2 / HK2
// Toán THPT
//   ├── Lớp 10 ── GK1 / HK1 / GK2 / HK2
//   ├── Lớp 11 ── GK1 / HK1 / GK2 / HK2
//   ├── Lớp 12 ── GK1 / HK1 / GK2 / HK2
//   └── THPT Quốc Gia
//
// Chạy: node scripts/seedCategories.js
// (Admin vẫn có thể thêm/sửa/xoá category con bất kỳ lúc nào từ giao diện quản trị)

const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const Category = require("../models/category.model");
const slugify = require("../utils/slugify");

const SEMESTERS = ["Giữa kỳ 1", "Học kỳ 1", "Giữa kỳ 2", "Học kỳ 2"];

const TREE = [
  {
    name: "Toán THCS",
    children: ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"].map((name) => ({
      name,
      children: SEMESTERS.map((name) => ({ name })),
    })),
  },
  {
    name: "Toán THPT",
    children: [
      ...["Lớp 10", "Lớp 11", "Lớp 12"].map((name) => ({
        name,
        children: SEMESTERS.map((name) => ({ name })),
      })),
      { name: "THPT Quốc Gia" },
    ],
  },
];

async function upsertCategory(name, parent, order) {
  const slug = slugify(name);
  let category = await Category.findOne({ parent: parent || null, slug });
  if (!category) {
    category = await Category.create({
      name,
      slug,
      parent: parent || null,
      order,
    });
    console.log(`  + Tạo: ${name}`);
  } else {
    console.log(`  = Đã có: ${name}`);
  }
  return category;
}

async function seedNode(node, parentId, order) {
  const category = await upsertCategory(node.name, parentId, order);
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      await seedNode(node.children[i], category._id, i);
    }
  }
}

async function run() {
  await connectDB();

  console.log("Seeding category tree...");
  for (let i = 0; i < TREE.length; i++) {
    await seedNode(TREE[i], null, i);
  }
  console.log("Seed xong.");

  process.exit(0);
}

run().catch((err) => {
  console.error("Seed thất bại:", err);
  process.exit(1);
});
