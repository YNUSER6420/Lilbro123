-- Add narration settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS narration_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  voice VARCHAR(255) NOT NULL DEFAULT 'en-US-Neural2-F',
  speed DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  quality VARCHAR(50) NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_narration_settings_book_id ON narration_settings(book_id);
CREATE INDEX IF NOT EXISTS idx_narration_settings_user_id ON narration_settings(user_id);

-- Enable realtime for narration_settings
alter publication supabase_realtime add table narration_settings;

-- Add RLS policies for narration_settings
ALTER TABLE narration_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own narration settings" ON narration_settings;
CREATE POLICY "Users can view their own narration settings"
  ON narration_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own narration settings" ON narration_settings;
CREATE POLICY "Users can insert their own narration settings"
  ON narration_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own narration settings" ON narration_settings;
CREATE POLICY "Users can update their own narration settings"
  ON narration_settings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own narration settings" ON narration_settings;
CREATE POLICY "Users can delete their own narration settings"
  ON narration_settings FOR DELETE
  USING (auth.uid() = user_id);
