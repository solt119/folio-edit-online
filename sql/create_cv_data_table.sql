
-- Create table for storing CV data
CREATE TABLE IF NOT EXISTS cv_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language VARCHAR(2) NOT NULL CHECK (language IN ('de', 'en')),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cv_data_language ON cv_data(language);

-- Enable Row Level Security
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to read CV data
CREATE POLICY "Allow public read access" ON cv_data
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Policy to allow authenticated users to insert/update CV data
CREATE POLICY "Allow authenticated users to insert/update" ON cv_data
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_cv_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before each update
DROP TRIGGER IF EXISTS trigger_update_cv_data_updated_at ON cv_data;
CREATE TRIGGER trigger_update_cv_data_updated_at
  BEFORE UPDATE ON cv_data
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_data_updated_at();
