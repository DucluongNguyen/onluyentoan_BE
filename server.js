const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const uploadRoutes = require("./routes/upload.route");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger"); // file vừa tạo
const errorHandler = require("./middlewares/error.middleware");

const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger route
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);

// Middleware phục vụ file tĩnh (xem ảnh)

app.use("/api/upload", uploadRoutes);
app.use(errorHandler); // luôn đặt cuối cùng

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
