const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all locations for a specific route (must belong to user)
router.get('/:userId/routes/:routeId/locations', (req, res) => {
  const { userId, routeId } = req.params;
  
  // Verify route belongs to user
  db.query(
    'SELECT * FROM routes WHERE id = ? AND user_id = ?',
    [routeId, userId],
    (err, routeResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (routeResults.length === 0) {
        return res.status(404).json({ error: 'Route not found for this user' });
      }
      
      // Get locations
      db.query(
        'SELECT * FROM locations WHERE route_id = ?',
        [routeId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(results);
        }
      );
    }
  );
});

// GET specific location (route must belong to user)
router.get('/:userId/routes/:routeId/locations/:locationId', (req, res) => {
  const { userId, routeId, locationId } = req.params;
  
  // Verify route belongs to user
  db.query(
    'SELECT * FROM routes WHERE id = ? AND user_id = ?',
    [routeId, userId],
    (err, routeResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (routeResults.length === 0) {
        return res.status(404).json({ error: 'Route not found for this user' });
      }
      
      // Get specific location
      db.query(
        'SELECT * FROM locations WHERE id = ? AND route_id = ?',
        [locationId, routeId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (results.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
          }
          res.json(results[0]);
        }
      );
    }
  );
});

// CREATE new location for a route (must belong to user)
router.post('/:userId/routes/:routeId/locations', (req, res) => {
  const { userId, routeId } = req.params;
  const { name, location, type } = req.body;
  
  // Verify route belongs to user
  db.query(
    'SELECT * FROM routes WHERE id = ? AND user_id = ?',
    [routeId, userId],
    (err, routeResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (routeResults.length === 0) {
        return res.status(404).json({ error: 'Route not found for this user' });
      }
      
      // Create location
      db.query(
        'INSERT INTO locations (name, location, type, route_id) VALUES (?, ?, ?, ?)',
        [name, location, type, routeId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({
            id: results.insertId,
            name,
            location,
            type,
            route_id: parseInt(routeId)
          });
        }
      );
    }
  );
});

// UPDATE location (route must belong to user)
router.put('/:userId/routes/:routeId/locations/:locationId', (req, res) => {
  const { userId, routeId, locationId } = req.params;
  const { name, location, type } = req.body;
  
  // Verify route belongs to user
  db.query(
    'SELECT * FROM routes WHERE id = ? AND user_id = ?',
    [routeId, userId],
    (err, routeResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (routeResults.length === 0) {
        return res.status(404).json({ error: 'Route not found for this user' });
      }
      
      // Update location
      db.query(
        'UPDATE locations SET name = ?, location = ?, type = ? WHERE id = ? AND route_id = ?',
        [name, location, type, locationId, routeId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Location not found' });
          }
          res.json({ message: 'Location updated successfully' });
        }
      );
    }
  );
});

// DELETE location (route must belong to user)
router.delete('/:userId/routes/:routeId/locations/:locationId', (req, res) => {
  const { userId, routeId, locationId } = req.params;
  
  // Verify route belongs to user
  db.query(
    'SELECT * FROM routes WHERE id = ? AND user_id = ?',
    [routeId, userId],
    (err, routeResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (routeResults.length === 0) {
        return res.status(404).json({ error: 'Route not found for this user' });
      }
      
      // Delete location
      db.query(
        'DELETE FROM locations WHERE id = ? AND route_id = ?',
        [locationId, routeId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Location not found' });
          }
          res.json({ message: 'Location deleted successfully' });
        }
      );
    }
  );
});

module.exports = router;
