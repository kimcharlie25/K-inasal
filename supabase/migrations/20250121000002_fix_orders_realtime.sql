/*
  # Fix Realtime for Orders
  
  This migration ensures realtime is properly enabled for orders and order_items tables.
  It sets REPLICA IDENTITY which is required for realtime to work.
*/

-- Set REPLICA IDENTITY to FULL for realtime to work properly
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE order_items REPLICA IDENTITY FULL;

-- Ensure tables are in the realtime publication
DO $$
BEGIN
  -- Add orders table to publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;

  -- Add order_items table to publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'order_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
  END IF;
END $$;

