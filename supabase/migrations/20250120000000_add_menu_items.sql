/*
  # Add Menu Items
  
  This migration adds all menu items from the menu extraction.
  IDs are auto-generated using gen_random_uuid().
  
  First, we create the required categories, then insert menu items.
*/

-- ============================================
-- CREATE CATEGORIES FIRST
-- ============================================

INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('grill', 'GRILL', '🔥', 1, true),
  ('sticks', 'STICKS', '🍢', 2, true),
  ('sizzling', 'SIZZLING', '🍳', 3, true),
  ('soup', 'SOUP', '🍲', 4, true),
  ('sides-desserts', 'SIDES & DESSERTS', '🍰', 5, true),
  ('beverage', 'BEVERAGE', '🥤', 6, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- GRILL CATEGORY
-- ============================================

-- INASAL PAA (Grilled Chicken Leg Quarters)
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('INASAL PAA', 'Grilled Chicken Leg Quarters', 185, 'grill', false, true);

-- Variations for INASAL PAA
INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Ala Carte', 185 FROM menu_items WHERE name = 'INASAL PAA'
UNION ALL
SELECT id, 'With Plain Rice', 200 FROM menu_items WHERE name = 'INASAL PAA'
UNION ALL
SELECT id, 'With Garlic Rice', 210 FROM menu_items WHERE name = 'INASAL PAA';

-- INIHAW NA LIEMPO (Grilled Pork Belly)
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('INIHAW NA LIEMPO', 'Grilled Pork Belly', 200, 'grill', false, true);

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Ala Carte', 200 FROM menu_items WHERE name = 'INIHAW NA LIEMPO'
UNION ALL
SELECT id, 'With Plain Rice', 215 FROM menu_items WHERE name = 'INIHAW NA LIEMPO'
UNION ALL
SELECT id, 'With Garlic Rice', 225 FROM menu_items WHERE name = 'INIHAW NA LIEMPO';

-- NASAL PECHO (Grilled Chicken Breast with Wings)
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('NASAL PECHO', 'Grilled Chicken Breast with Wings', 195, 'grill', false, true);

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Ala Carte', 195 FROM menu_items WHERE name = 'NASAL PECHO'
UNION ALL
SELECT id, 'With Plain Rice', 205 FROM menu_items WHERE name = 'NASAL PECHO'
UNION ALL
SELECT id, 'With Garlic Rice', 220 FROM menu_items WHERE name = 'NASAL PECHO';

-- BBQ RIBS
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('BBQ RIBS', 'BBQ Ribs', 315, 'grill', false, true);

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Ala Carte', 315 FROM menu_items WHERE name = 'BBQ RIBS'
UNION ALL
SELECT id, 'With Plain Rice', 330 FROM menu_items WHERE name = 'BBQ RIBS'
UNION ALL
SELECT id, 'With Garlic Rice', 340 FROM menu_items WHERE name = 'BBQ RIBS';

-- NASAL BONELESS (Grilled Chicken Boneless Leg Quarters)
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('NASAL BONELESS', 'Grilled Chicken Boneless Leg Quarters', 195, 'grill', false, true);

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Ala Carte', 195 FROM menu_items WHERE name = 'NASAL BONELESS'
UNION ALL
SELECT id, 'With Plain Rice', 205 FROM menu_items WHERE name = 'NASAL BONELESS'
UNION ALL
SELECT id, 'With Garlic Rice', 220 FROM menu_items WHERE name = 'NASAL BONELESS';

-- INIHAW NA PUSIT
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('INIHAW NA PUSIT', 'Grilled Squid', 180, 'grill', false, true);

-- SALMON
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('SALMON', 'Grilled Salmon', 230, 'grill', false, true);

-- ============================================
-- STICKS CATEGORY
-- ============================================

INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
('CHICKEN', 'Chicken Sticks', 20, 'sticks', false, true),
('PORK BBQ', 'Pork BBQ Sticks', 65, 'sticks', false, true),
('ATAY NG MANOK', 'Chicken Liver Sticks', 80, 'sticks', false, true),
('BALUNBALUNAN', 'Chicken Gizzard Sticks', 80, 'sticks', false, true),
('ISOL', 'Chicken Intestine Sticks', 90, 'sticks', false, true),
('HOTDOG', 'Hotdog Sticks', 50, 'sticks', false, true);

-- ============================================
-- SIZZLING CATEGORY
-- ============================================

INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
('CHICKEN SISIG', 'Sizzling Chicken Sisig', 20, 'sizzling', false, true),
('SALMON SISIG', 'Sizzling Salmon Sisig', 220, 'sizzling', false, true),
('SIZZLING KANSI', 'Sizzling Bacolod style Beef shank/bone marrow', 360, 'sizzling', false, true);

-- ============================================
-- SOUP CATEGORY
-- ============================================

-- BACHOY
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('BACHOY', 'Pork Noodle Soup', 190, 'soup', false, true);

-- KANSI
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('KANSI', 'Bacolod style Beef shank/bone marrow soup with Batuan fruit', 385, 'soup', false, true);

-- KANSI SOUP BROTH
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('KANSI SOUP BROTH', 'Kansi Soup Broth', 30, 'soup', false, true);

-- MUNGGO (Mung Beans Soup)
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('MUNGGO', 'Mung Beans Soup', 70, 'soup', false, true);

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Solo', 70 FROM menu_items WHERE name = 'MUNGGO'
UNION ALL
SELECT id, 'Bowl', 100 FROM menu_items WHERE name = 'MUNGGO';

-- ============================================
-- SIDES & DESSERTS CATEGORY
-- ============================================

INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
('ENSALADA', 'Tomatoes w/ Onions & Salted Egg', 115, 'sides-desserts', false, true),
('GINISANG KANGKONG', 'Stir-fried Water Spinach', 90, 'sides-desserts', false, true),
('BUKO JELLO', 'Coconut Jello', 100, 'sides-desserts', false, true),
('SABA CON YELO', 'Banana with Ice', 80, 'sides-desserts', false, true),
('HALO-HALO', 'Mixed Shaved Ice Dessert', 175, 'sides-desserts', false, true),
('TURON', 'Fried Banana Spring Roll', 130, 'sides-desserts', false, true),
('MUNGGO TURON', 'Mung Bean Spring Roll', 130, 'sides-desserts', false, true),
('PEACH PINYA', 'Peach and Pineapple', 150, 'sides-desserts', false, true);

-- INIHAW NA TALONG (Grilled eggplant w/ Tomatoes & Onions)
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('INIHAW NA TALONG', 'Grilled eggplant w/ Tomatoes & Onions', 140, 'sides-desserts', false, true);

-- Add-on for INIHAW NA TALONG
INSERT INTO add_ons (menu_item_id, name, price, category)
SELECT id, 'Add Salted Egg', 30, 'extras' FROM menu_items WHERE name = 'INIHAW NA TALONG';

-- PLAIN RICE
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('PLAIN RICE', 'Plain Rice', 25, 'sides-desserts', false, true);

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Half Rice', 25 FROM menu_items WHERE name = 'PLAIN RICE'
UNION ALL
SELECT id, 'Whole Rice', 40 FROM menu_items WHERE name = 'PLAIN RICE';

-- GARLIC RICE
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('GARLIC RICE', 'Garlic Rice', 45, 'sides-desserts', false, true);

-- ============================================
-- BEVERAGE CATEGORY
-- ============================================

INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
('SODA IN CAN', 'Coke, Coke Zero, Sprite, Royal, Sarsi', 85, 'beverage', false, true),
('Black GULAMAN', 'Black Gulaman Drink', 60, 'beverage', false, true),
('ALLMyTea', 'All My Tea', 65, 'beverage', false, true),
('ALLMyTea Lite', 'All My Tea Lite', 75, 'beverage', false, true),
('BOTTLED WATER', 'Bottled Water', 40, 'beverage', false, true),
('CALAMANSI JUICE', 'Calamansi Juice (Hot/Cold)', 65, 'beverage', false, true);

-- COFFEE
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('COFFEE', 'Coffee', 60, 'beverage', false, true);

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Hot', 60 FROM menu_items WHERE name = 'COFFEE'
UNION ALL
SELECT id, 'Iced', 80 FROM menu_items WHERE name = 'COFFEE';

-- BEER
INSERT INTO menu_items (name, description, base_price, category, popular, available)
VALUES ('BEER', 'Beer', 70, 'beverage', false, true);

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'San Mig Light', 70 FROM menu_items WHERE name = 'BEER'
UNION ALL
SELECT id, 'Pale Pilsen', 75 FROM menu_items WHERE name = 'BEER';

