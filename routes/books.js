const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Web routes for EJS views
router.get('/', bookController.getAllBooksWeb);
router.get('/new', bookController.newBookForm);
router.get('/:id', bookController.getBookByIdWeb);
router.get('/:id/edit', bookController.editBookForm);
router.post('/', bookController.createBookWeb);
router.put('/:id', bookController.updateBookWeb);
router.delete('/:id', bookController.deleteBookWeb);

module.exports = router;
