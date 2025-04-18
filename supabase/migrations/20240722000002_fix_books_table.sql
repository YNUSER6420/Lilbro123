-- Drop existing foreign key constraint
ALTER TABLE IF EXISTS public.books DROP CONSTRAINT IF EXISTS books_user_id_fkey;

-- Modify books table to use UUID for user_id
ALTER TABLE public.books ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Add foreign key constraint with compatible types
ALTER TABLE public.books ADD CONSTRAINT books_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update bookmarks table
ALTER TABLE IF EXISTS public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey;
ALTER TABLE public.bookmarks ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update reading_progress table
ALTER TABLE IF EXISTS public.reading_progress DROP CONSTRAINT IF EXISTS reading_progress_user_id_fkey;
ALTER TABLE public.reading_progress ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
ALTER TABLE public.reading_progress ADD CONSTRAINT reading_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
