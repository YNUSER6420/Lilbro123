-- Fix user_id type in books table
ALTER TABLE IF EXISTS books
ALTER COLUMN user_id TYPE TEXT;

-- Fix user_id type in bookmarks table
ALTER TABLE IF EXISTS bookmarks
ALTER COLUMN user_id TYPE TEXT;

-- Fix user_id type in reading_progress table
ALTER TABLE IF EXISTS reading_progress
ALTER COLUMN user_id TYPE TEXT;

-- Update RLS policies to use auth.uid()::text
DROP POLICY IF EXISTS "Users can only see their own books" ON books;
CREATE POLICY "Users can only see their own books"
ON books FOR SELECT
USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only insert their own books" ON books;
CREATE POLICY "Users can only insert their own books"
ON books FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only update their own books" ON books;
CREATE POLICY "Users can only update their own books"
ON books FOR UPDATE
USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only delete their own books" ON books;
CREATE POLICY "Users can only delete their own books"
ON books FOR DELETE
USING (user_id = auth.uid()::text);

-- Update bookmarks policies
DROP POLICY IF EXISTS "Users can only see their own bookmarks" ON bookmarks;
CREATE POLICY "Users can only see their own bookmarks"
ON bookmarks FOR SELECT
USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only insert their own bookmarks" ON bookmarks;
CREATE POLICY "Users can only insert their own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only update their own bookmarks" ON bookmarks;
CREATE POLICY "Users can only update their own bookmarks"
ON bookmarks FOR UPDATE
USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only delete their own bookmarks" ON bookmarks;
CREATE POLICY "Users can only delete their own bookmarks"
ON bookmarks FOR DELETE
USING (user_id = auth.uid()::text);

-- Update reading_progress policies
DROP POLICY IF EXISTS "Users can only see their own reading progress" ON reading_progress;
CREATE POLICY "Users can only see their own reading progress"
ON reading_progress FOR SELECT
USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only insert their own reading progress" ON reading_progress;
CREATE POLICY "Users can only insert their own reading progress"
ON reading_progress FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only update their own reading progress" ON reading_progress;
CREATE POLICY "Users can only update their own reading progress"
ON reading_progress FOR UPDATE
USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can only delete their own reading progress" ON reading_progress;
CREATE POLICY "Users can only delete their own reading progress"
ON reading_progress FOR DELETE
USING (user_id = auth.uid()::text);