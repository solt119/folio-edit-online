
-- Create table for storing visibility settings
CREATE TABLE IF NOT EXISTS visibility_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language VARCHAR(2) NOT NULL CHECK (language IN ('de', 'en')),
  visibility JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visibility_settings_language ON visibility_settings(language);

-- Enable Row Level Security
ALTER TABLE visibility_settings ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to read visibility settings
CREATE POLICY "Allow public read access" ON visibility_settings
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Policy to allow authenticated users to insert/update visibility settings
CREATE POLICY "Allow authenticated users to insert/update" ON visibility_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_visibility_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before each update
DROP TRIGGER IF EXISTS trigger_update_visibility_settings_updated_at ON visibility_settings;
CREATE TRIGGER trigger_update_visibility_settings_updated_at
  BEFORE UPDATE ON visibility_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_visibility_settings_updated_at();
