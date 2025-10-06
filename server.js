const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
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
    hsts: false, // Disable HTTP Strict Transport Security
    contentSecurityPolicy: false, // Disable CSP that might enforce HTTPS
  })
); // Security headers - configured for HTTP
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride("_method")); // Override HTTP methods

// Routes
app.use("/books", bookRoutes);

// API routes (optional for API usage)
const apiBookRoutes = express.Router();
apiBookRoutes.get("/", require("./controllers/bookController").getAllBooks);
apiBookRoutes.get("/:id", require("./controllers/bookController").getBookById);
apiBookRoutes.post("/", require("./controllers/bookController").createBook);
apiBookRoutes.put("/:id", require("./controllers/bookController").updateBook);
apiBookRoutes.delete(
  "/:id",
  require("./controllers/bookController").deleteBook
);
app.use("/api/books", apiBookRoutes);

// Root route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    success: req.query.success,
    error: req.query.error,
  });
});

// Add health check endpoint
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

    // Try to initialize database, but don't fail if it's not available
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

    // Start the server only if not in test environment
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`📖 Local access: http://localhost:${PORT}`);
        console.log(`🌐 Network access: http://0.0.0.0:${PORT}`);
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
