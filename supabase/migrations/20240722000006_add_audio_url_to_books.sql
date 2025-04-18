-- Add audio_url column to books table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'books' 
                   AND column_name = 'audio_url') THEN
        ALTER TABLE books ADD COLUMN audio_url TEXT;
    END IF;
END $$;

-- Enable realtime for books table
alter publication supabase_realtime add table books;
