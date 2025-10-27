const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product API",
      version: "1.0.0",
      description: "API tài liệu sản phẩm sử dụng Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // đường dẫn chứa swagger comment
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
