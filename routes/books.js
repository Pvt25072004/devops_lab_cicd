// routes/books.js
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

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
 *           example: Clean Code
 *         author:
 *           type: string
 *           description: Book author
 *           example: Robert Martin
 *         published_year:
 *           type: integer
 *           description: Year of publication
 *           example: 2008
 *         genre:
 *           type: string
 *           description: Book genre
 *           example: Technology
 *         description:
 *           type: string
 *           description: Book description
 *           example: A handbook of agile software craftsmanship
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
 *                 example: Book not found
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
 *                 example: Validation failed
 */

// ============================================================
// WEB ROUTES (EJS Views) - Not documented in Swagger
// ============================================================
// These routes render HTML pages, not API endpoints
router.get("/", bookController.getAllBooksWeb);
router.get("/new", bookController.newBookForm);
router.get("/:id", bookController.getBookByIdWeb);
router.get("/:id/edit", bookController.editBookForm);
router.post("/", bookController.createBookWeb);
router.put("/:id", bookController.updateBookWeb);
router.delete("/:id", bookController.deleteBookWeb);

module.exports = router;
