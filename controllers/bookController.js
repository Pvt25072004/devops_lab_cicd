const Book = require('../models/Book');

const bookController = {
  // Web view methods
  
  // Get all books - Web view
  getAllBooksWeb: async (req, res) => {
    try {
      const books = await Book.getAll();
      res.render('books/index', { 
        title: 'All Books',
        books,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('Error getting books:', error);
      res.render('books/index', {
        title: 'All Books',
        books: [],
        error: 'Error retrieving books'
      });
    }
  },

  // Show new book form
  newBookForm: (req, res) => {
    res.render('books/new', {
      title: 'Add New Book'
    });
  },

  // Get book by ID - Web view
  getBookByIdWeb: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.getById(id);
      
      if (!book) {
        return res.redirect('/books?error=Book not found');
      }

      res.render('books/show', {
        title: book.title,
        book
      });
    } catch (error) {
      console.error('Error getting book:', error);
      res.redirect('/books?error=Error retrieving book');
    }
  },

  // Show edit book form
  editBookForm: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.getById(id);
      
      if (!book) {
        return res.redirect('/books?error=Book not found');
      }

      res.render('books/edit', {
        title: `Edit ${book.title}`,
        book
      });
    } catch (error) {
      console.error('Error getting book for edit:', error);
      res.redirect('/books?error=Error retrieving book');
    }
  },

  // Create new book - Web form
  createBookWeb: async (req, res) => {
    try {
      const { title, author, published_year, genre, description } = req.body;

      // Basic validation
      if (!title || !author || !published_year || !genre) {
        return res.render('books/new', {
          title: 'Add New Book',
          error: 'All required fields must be filled'
        });
      }

      const newBook = await Book.create({
        title,
        author,
        published_year: parseInt(published_year),
        genre,
        description: description || null
      });

      res.redirect(`/books?success=Book "${title}" created successfully`);
    } catch (error) {
      console.error('Error creating book:', error);
      res.render('books/new', {
        title: 'Add New Book',
        error: 'Error creating book'
      });
    }
  },

  // Update book - Web form
  updateBookWeb: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, published_year, genre, description } = req.body;

      // Check if book exists
      const existingBook = await Book.getById(id);
      if (!existingBook) {
        return res.redirect('/books?error=Book not found');
      }

      // Basic validation
      if (!title || !author || !published_year || !genre) {
        return res.render('books/edit', {
          title: `Edit ${existingBook.title}`,
          book: existingBook,
          error: 'All required fields must be filled'
        });
      }

      const updatedBook = await Book.update(id, {
        title,
        author,
        published_year: parseInt(published_year),
        genre,
        description: description || null
      });

      res.redirect(`/books/${id}?success=Book updated successfully`);
    } catch (error) {
      console.error('Error updating book:', error);
      res.redirect(`/books/${id}?error=Error updating book`);
    }
  },

  // Delete book - Web form
  deleteBookWeb: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if book exists
      const existingBook = await Book.getById(id);
      if (!existingBook) {
        return res.redirect('/books?error=Book not found');
      }

      await Book.delete(id);
      res.redirect('/books?success=Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      res.redirect('/books?error=Error deleting book');
    }
  },

  // API methods (for potential API usage)
  
  // Get all books - API
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.getAll();
      res.json({
        success: true,
        data: books,
        message: 'Books retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting books:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving books',
        error: error.message
      });
    }
  },

  // Get book by ID - API
  getBookById: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.getById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      res.json({
        success: true,
        data: book,
        message: 'Book retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting book:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving book',
        error: error.message
      });
    }
  },

  // Create new book - API
  createBook: async (req, res) => {
    try {
      const { title, author, isbn, published_year, genre, description } = req.body;

      // Basic validation
      if (!title || !author) {
        return res.status(400).json({
          success: false,
          message: 'Title and author are required'
        });
      }

      const newBook = await Book.create({
        title,
        author,
        isbn,
        published_year,
        genre,
        description
      });

      res.status(201).json({
        success: true,
        data: newBook,
        message: 'Book created successfully'
      });
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating book',
        error: error.message
      });
    }
  },

  // Update book - API
  updateBook: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, isbn, published_year, genre, description } = req.body;

      // Check if book exists
      const existingBook = await Book.getById(id);
      if (!existingBook) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      // Basic validation
      if (!title || !author) {
        return res.status(400).json({
          success: false,
          message: 'Title and author are required'
        });
      }

      const updatedBook = await Book.update(id, {
        title,
        author,
        isbn,
        published_year,
        genre,
        description
      });

      res.json({
        success: true,
        data: updatedBook,
        message: 'Book updated successfully'
      });
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating book',
        error: error.message
      });
    }
  },

  // Delete book - API
  deleteBook: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if book exists
      const existingBook = await Book.getById(id);
      if (!existingBook) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      await Book.delete(id);

      res.json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting book',
        error: error.message
      });
    }
  }
};

module.exports = bookController;
