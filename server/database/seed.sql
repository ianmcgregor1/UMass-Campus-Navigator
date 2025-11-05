-- Sample data for testing
USE umass_navigator;

-- Sample users (password is 'password123' for all)
INSERT INTO users (name, email, passwordHash) VALUES 
  ('John Smith', 'sample email 1', 'password123'),
  ('Jane Doe', 'sample email 2', 'password123'),
  ('Bob Wilson', 'sample email 3', 'password123');


-- Sample locations
INSERT INTO locations (name, location, type) VALUES
  ('Southwest Dorms', '{\"lat\": 42.3868, \"lng\": -72.5301}', 'residential'),
  ('Computer Science Building', '{\"lat\": 42.3908, \"lng\": -72.5267}', 'academic'),
  ('Lederle Graduate Research Center', '{\"lat\": 42.3914, \"lng\": -72.5258}', 'academic'),
  ('Hasbrouck Laboratory', '{\"lat\": 42.3900, \"lng\": -72.5289}', 'academic'),
  ('Central Dorms', '{\"lat\": 42.3925, \"lng\": -72.5242}', 'residential'),
  ('Goessmann Laboratory', '{\"lat\": 42.3897, \"lng\": -72.5277}', 'academic'),
  ('Morrill Science Center', '{\"lat\": 42.3902, \"lng\": -72.5253}', 'academic'),
  ('Northeast Dorms', '{\"lat\": 42.3951, \"lng\": -72.5230}', 'residential'),
  ('Thompson Hall', '{\"lat\": 42.3917, \"lng\": -72.5291}', 'residential');
    
-- Sample routes
INSERT INTO routes (name, stops, user_id) VALUES
  ('Monday Classes', '[1,2]', 1),
  ('Tuesday Classes', '[2,3]', 1),
  ('Lab Route', '[1,3]', 2),
  ('Economics Route', '[3,4]', 3);