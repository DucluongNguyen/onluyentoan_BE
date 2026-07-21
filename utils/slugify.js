// utils/slugify.js
// Chuyen ten tieng Viet co dau thanh slug an toan cho URL, vd:
// "Toan THCS" -> "toan-thcs", "Lop 10" -> "lop-10"
function slugify(str = "") {
  const COMBINING_MARKS_REGEX = new RegExp("[\\u0300-\\u036f]", "g");

  return str
    .toString()
    .normalize("NFD")
    .replace(COMBINING_MARKS_REGEX, "") // bo dau
    .replace(/đ/gi, "d") // chu "d" (dd Viet)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

module.exports = slugify;
