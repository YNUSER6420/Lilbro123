-- This migration enables Google OAuth in Supabase
-- Note: Supabase manages OAuth providers internally, so we don't need to insert into auth.providers

-- Enable realtime for users table
alter publication supabase_realtime add table users;

-- Ensure RLS is disabled for users table (default behavior)
