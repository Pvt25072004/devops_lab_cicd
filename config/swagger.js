// config/swagger.js
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookVault API",
      version: "1.0.0",
      description: "API Documentation for BookVault - A Book Management System",
      contact: {
        name: "API Support",
        email: "support@bookvault.com",
      },
    },
    servers: [
      {
        url: "http://3.106.188.212:3001",
        description: "Development server",
      },
      {
        url: "http://3.106.188.212:3001",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Books",
        description: "Book management endpoints",
      },
    ],
  },
  // Path to API docs (routes files)
  apis: ["./routes/*.js", "./controllers/*.js", "./server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
