-- Run this in your Supabase SQL Editor

-- Alter the table_number column in the orders table to TEXT
-- This allows names like "VIP" and "Delivery" to be stored correctly.
ALTER TABLE orders 
ALTER COLUMN table_number TYPE TEXT;
