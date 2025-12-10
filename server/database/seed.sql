-- Sample data for testing
USE umass_navigator;

-- Sample users (password is 'password123' for all)
INSERT INTO users (name, email, passwordHash) VALUES 
  ('Test Username', 'test@umass.edu', 'test'),
  ('John Smith', 'john.smith@umass.edu', 'password123'),
  ('Jane Doe', 'jane.doe@umass.edu', 'password123'),
  ('Bob Wilson', 'bob.wilson@umass.edu', 'password123');


-- Sample locations
TRUNCATE TABLE locations;
ALTER TABLE locations AUTO_INCREMENT = 1;
INSERT INTO locations (name, location, type) VALUES
  ('Southwest Dorms', '{\"lat\": 42.38185739595041, \"lng\":  -72.52871631123358}', 'residential'),
  ('Computer Science Building', '{\"lat\": 42.395088453911285, \"lng\": -72.53123637937763}', 'academic'), 
  ('Lederle Graduate Research Center', '{\"lat\": 42.39404185122906, \"lng\": -72.52763397557597}', 'academic'),
  ('Hasbrouck Laboratory', '{\"lat\": 42.391833074829066, \"lng\": -72.52596944616526}', 'academic'),
  ('Central Dorms', '{\"lat\": 42.3925, \"lng\": -72.5242}', 'residential'),
  ('Goessmann Laboratory', '{\"lat\": 42.39324781627424, \"lng\": -72.52768509819425}', 'academic'),
  ('Morrill Science Center', '{\"lat\": 42.38982171630032, \"lng\": -72.5245604054338}', 'academic'),
  ('Northeast Dorms', '{\"lat\": 42.39487849703764, \"lng\": -72.52491372501018}', 'residential'),
  ('Thompson Hall', '{\"lat\": 42.39018799152605, \"lng\": -72.53011443357023}', 'academic'),
  ('South College', '{\"lat\": 42.389405855192074, \"lng\": -72.52984650146699}', 'academic'),
  ('W.E.B Du Bois Library', '{\"lat\": 42.38987702345097, \"lng\": -72.52825802982485}', 'academic'),
  ('Sylvan Residential Area', '{\"lat\": 42.39775722039439, \"lng\": -72.52251684546555}', 'residential');

-- Sample routes
INSERT INTO routes (name, stops, user_id) VALUES
  ('Monday Classes', '[1,2]', 1),
  ('Tuesday Classes', '[2,3]', 1),
  ('Lab Route', '[1,3]', 2),
  ('Economics Route', '[3,4]', 3);