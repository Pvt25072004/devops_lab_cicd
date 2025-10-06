-- Create database (run this in PostgreSQL as a superuser)
-- CREATE DATABASE books_db;

-- Connect to the books_db database and run the following:

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    published_year INTEGER,
    genre VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO books (title, author, isbn, published_year, genre, description) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925, 'Fiction', 'A classic American novel about the Jazz Age and the American Dream.'),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960, 'Fiction', 'A gripping tale of racial injustice and childhood innocence in the American South.'),
('1984', 'George Orwell', '9780451524935', 1949, 'Science Fiction', 'A dystopian social science fiction novel about totalitarian control.'),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 1813, 'Romance', 'A romantic novel that critiques the British landed gentry at the end of the 18th century.'),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769174', 1951, 'Fiction', 'A controversial coming-of-age story about teenage rebellion and alienation.');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_published_year ON books(published_year);
