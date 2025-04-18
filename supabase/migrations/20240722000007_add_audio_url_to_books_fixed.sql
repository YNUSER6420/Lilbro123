-- Check if audio_url column exists before adding it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'audio_url') THEN
    ALTER TABLE books ADD COLUMN audio_url TEXT;
  END IF;
END $$;
