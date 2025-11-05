-- Sample data for testing
USE umass_navigator;

-- Sample users (password is 'password123' for all)
INSERT INTO users (name, password) VALUES 
  ('John Smith', 'password123'),
  ('Jane Doe', 'password123'),
  ('Bob Wilson', 'password123');

-- Sample routes
INSERT INTO routes (name, user_id) VALUES
  ('Monday Classes', 1),
  ('Tuesday Classes', 1),
  ('Lab Route', 2),
  ('Economics Route', 3);

-- Sample locations for John's Monday route (route_id = 1)
INSERT INTO locations (name, latitude, longitude, route_id) VALUES
  ('Southwest Dorms', 42.3868, -72.5301, 1),
  ('Computer Science Building', 42.3908, -72.5267, 1),
  ('Lederle Graduate Research Center', 42.3914, -72.5258, 1);

-- Sample locations for John's Tuesday route (route_id = 2)
INSERT INTO locations (name, latitude, longitude, route_id) VALUES
  ('Southwest Dorms', 42.3868, -72.5301, 2),
  ('Hasbrouck Laboratory', 42.3900, -72.5289, 2);

-- Sample locations for Jane's Lab route (route_id = 3)
INSERT INTO locations (name, latitude, longitude, route_id) VALUES
  ('Central Dorms', 42.3925, -72.5242, 3),
  ('Goessmann Laboratory', 42.3897, -72.5277, 3),
  ('Morrill Science Center', 42.3902, -72.5253, 3);

-- Sample locations for Bob's Economics route (route_id = 4)
INSERT INTO locations (name, latitude, longitude, route_id) VALUES
  ('Northeast Dorms', 42.3951, -72.5230, 4),
  ('Thompson Hall', 42.3917, -72.5291, 4);
