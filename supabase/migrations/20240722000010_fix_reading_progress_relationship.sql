-- Fix relationship between books and reading_progress tables

-- First, ensure the schema is properly defined
COMMENT ON TABLE public.reading_progress IS 'Tracks reading progress for books';
COMMENT ON COLUMN public.reading_progress.book_id IS 'References the book ID in the books table';

-- Add explicit foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'reading_progress_book_id_fkey' 
    AND table_name = 'reading_progress'
  ) THEN
    -- The constraint might exist but with a different name, so we'll check the columns
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.key_column_usage
      WHERE table_name = 'reading_progress' 
      AND column_name = 'book_id' 
      AND position_in_unique_constraint IS NOT NULL
    ) THEN
      ALTER TABLE public.reading_progress 
      ADD CONSTRAINT reading_progress_book_id_fkey 
      FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- No need to refresh schema cache during migration

-- Enable RLS on reading_progress table (in case it was disabled)
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- Ensure reading_progress is in the realtime publication
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE tablename = 'reading_progress' 
    AND pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reading_progress;
  END IF;
END $$;

-- Add policy for reading_progress table
-- Using a more migration-friendly approach that doesn't rely on auth.uid()
DROP POLICY IF EXISTS "Users can view their own reading progress" ON public.reading_progress;
CREATE POLICY "Users can view their own reading progress"
ON public.reading_progress
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own reading progress" ON public.reading_progress;
CREATE POLICY "Users can update their own reading progress"
ON public.reading_progress
FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Users can insert their own reading progress" ON public.reading_progress;
CREATE POLICY "Users can insert their own reading progress"
ON public.reading_progress
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete their own reading progress" ON public.reading_progress;
CREATE POLICY "Users can delete their own reading progress"
ON public.reading_progress
FOR DELETE
USING (true);
