-- Migration to add description column to existing books table
-- Run this if you already have a books table without the description column

ALTER TABLE books ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing records with sample descriptions (optional)
UPDATE books SET description = 'A classic American novel about the Jazz Age and the American Dream.' WHERE title = 'The Great Gatsby' AND description IS NULL;
UPDATE books SET description = 'A gripping tale of racial injustice and childhood innocence in the American South.' WHERE title = 'To Kill a Mockingbird' AND description IS NULL;
UPDATE books SET description = 'A dystopian social science fiction novel about totalitarian control.' WHERE title = '1984' AND description IS NULL;
UPDATE books SET description = 'A romantic novel that critiques the British landed gentry at the end of the 18th century.' WHERE title = 'Pride and Prejudice' AND description IS NULL;
UPDATE books SET description = 'A controversial coming-of-age story about teenage rebellion and alienation.' WHERE title = 'The Catcher in the Rye' AND description IS NULL;
