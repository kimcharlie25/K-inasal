/*
  # Add table_number field to orders table
  
  This migration adds a table_number field to store the table number
  from the URL parameter when orders are created.
*/

-- Add table_number column to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS table_number integer;

-- Create index on table_number for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_table_number ON orders(table_number);

