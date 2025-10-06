const pool = require('../config/database');

class Book {
  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(bookData) {
    const { title, author, isbn, published_year, genre, description } = bookData;
    try {
      const result = await pool.query(
        'INSERT INTO books (title, author, isbn, published_year, genre, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, author, isbn, published_year, genre, description]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, bookData) {
    const { title, author, isbn, published_year, genre, description } = bookData;
    try {
      const result = await pool.query(
        'UPDATE books SET title = $1, author = $2, isbn = $3, published_year = $4, genre = $5, description = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [title, author, isbn, published_year, genre, description, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Book;
