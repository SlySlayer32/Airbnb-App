-- Create user_dashboard_layouts table
CREATE TABLE user_dashboard_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  components JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_dashboard_layouts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own layout
CREATE POLICY "users_manage_own_layout" ON user_dashboard_layouts
FOR ALL USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_dashboard_layouts_user_id ON user_dashboard_layouts(user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_dashboard_layouts_updated_at
    BEFORE UPDATE ON user_dashboard_layouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
