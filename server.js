const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger");
require("dotenv").config();

const { createBooksTable } = require("./config/initDb");

// Import routes
const bookRoutes = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(
  helmet({
    hsts: false,
    contentSecurityPolicy: false,
  })
);
// server.js
app.use(
  cors({
    origin: "*", // Cho phép tất cả origins (hoặc chỉ định cụ thể)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ============================================================
// SWAGGER API DOCUMENTATION
// ============================================================
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "BookVault API Documentation",
  })
);

// ============================================================
// WEB ROUTES (EJS Views)
// ============================================================
app.use("/books", bookRoutes);

// ============================================================
// API ROUTES WITH SWAGGER DOCUMENTATION
// ============================================================

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated book ID
 *           example: 1
 *         title:
 *           type: string
 *           description: Book title
 *           example: "Clean Code"
 *         author:
 *           type: string
 *           description: Book author
 *           example: "Robert Martin"
 *         published_year:
 *           type: integer
 *           description: Year of publication
 *           example: 2008
 *         genre:
 *           type: string
 *           description: Book genre
 *           example: "Technology"
 *         description:
 *           type: string
 *           description: Book description
 *           example: "A handbook of agile software craftsmanship"
 *         isbn:
 *           type: string
 *           description: ISBN number
 *           example: "978-0132350884"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *
 *   responses:
 *     NotFound:
 *       description: Book not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Book not found"
 *
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Validation failed"
 */

/**
 * @swagger
 * tags:
 *   - name: Books API
 *     description: Book management REST API endpoints
 *   - name: System
 *     description: System health and status endpoints
 */

const apiBookRoutes = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books API]
 *     description: Retrieve a list of all books in the database
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   title: "Clean Code"
 *                   author: "Robert Martin"
 *                   published_year: 2008
 *                   genre: "Technology"
 *                   description: "A handbook of agile software craftsmanship"
 *                 - id: 2
 *                   title: "The Pragmatic Programmer"
 *                   author: "Andrew Hunt"
 *                   published_year: 1999
 *                   genre: "Technology"
 */
apiBookRoutes.get("/", require("./controllers/bookController").getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books API]
 *     description: Retrieve a single book by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Book found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
apiBookRoutes.get("/:id", require("./controllers/bookController").getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books API]
 *     description: Add a new book to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Clean Code"
 *               author:
 *                 type: string
 *                 example: "Robert Martin"
 *               published_year:
 *                 type: integer
 *                 example: 2008
 *               genre:
 *                 type: string
 *                 example: "Technology"
 *               description:
 *                 type: string
 *                 example: "A handbook of agile software craftsmanship"
 *               isbn:
 *                 type: string
 *                 example: "978-0132350884"
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
apiBookRoutes.post("/", require("./controllers/bookController").createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books API]
 *     description: Update an existing book's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               published_year:
 *                 type: integer
 *               genre:
 *                 type: string
 *               description:
 *                 type: string
 *               isbn:
 *                 type: string
 *           example:
 *             title: "Clean Code - Updated Edition"
 *             published_year: 2020
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
apiBookRoutes.put("/:id", require("./controllers/bookController").updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books API]
 *     description: Remove a book from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Book deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
apiBookRoutes.delete(
  "/:id",
  require("./controllers/bookController").deleteBook
);

app.use("/api/books", apiBookRoutes);

// ============================================================
// OTHER ROUTES
// ============================================================

// Root route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    success: req.query.success,
    error: req.query.error,
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     description: Check if the API is running and healthy
 *     responses:
 *       200:
 *         description: API is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-04T00:00:00.000Z"
 *                 environment:
 *                   type: string
 *                   example: "production"
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log("🚀 Starting server...");
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);

    // Try to initialize database
    try {
      await createBooksTable();
      console.log("✅ Database initialized successfully");
    } catch (dbError) {
      console.warn(
        "⚠️  Database initialization failed, but server will continue:",
        dbError.message
      );
      console.warn(
        "📝 You can still access the server, but database features may not work"
      );
    }

    // Start the server
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`📖 Local: http://localhost:${PORT}`);
        console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
        console.log(`📚 Swagger: http://localhost:${PORT}/swagger`);
        console.log(`🏥 Health: http://localhost:${PORT}/health`);
        console.log(`🔓 Using HTTP (not HTTPS) for development`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
