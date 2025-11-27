/*
  # Create Tables Management System
  
  This migration creates a tables table for QR code-based table number detection.
*/

-- Create tables table
CREATE TABLE IF NOT EXISTS tables (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  qr_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for QR code scanning)
CREATE POLICY "Anyone can read tables"
  ON tables
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Authenticated users can manage tables"
  ON tables
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index on qr_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_tables_qr_url ON tables(qr_url);

