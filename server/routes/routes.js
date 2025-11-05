const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all routes for a specific user
router.get('/:userId/routes', (req, res) => {
  const { userId } = req.params;
  
  db.query(
    'SELECT * FROM routes WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// GET specific route for a user with all locations
router.get('/:userId/routes/:routeId', (req, res) => {
  const { userId, routeId } = req.params;
  
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
      
      // Get all locations for this route
      db.query('SELECT * FROM locations WHERE route_id = ?', [routeId], (err, locationResults) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.json({
          ...routeResults[0],
          locations: locationResults
        });
      });
    }
  );
});

// CREATE new route for a user
router.post('/:userId/routes', (req, res) => {
  const { userId } = req.params;
  const { name, stops } = req.body;
  
  db.query(
    'INSERT INTO routes (name, stops, user_id) VALUES (?, ?)',
    [name, stops, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: results.insertId,
        name,
        stops,
        userId
      });
    }
  );
});

// UPDATE route (must belong to user)
router.put('/:userId/routes/:routeId', (req, res) => {
  const { userId, routeId } = req.params;
  const { name } = req.body;
  
  db.query(
    'UPDATE routes SET name = ? WHERE id = ? AND user_id = ?',
    [name, routeId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Route not found for this user' });
      }
      res.json({ message: 'Route updated successfully' });
    }
  );
});

// DELETE route (must belong to user)
router.delete('/:userId/routes/:routeId', (req, res) => {
  const { userId, routeId } = req.params;
  
  db.query(
    'DELETE FROM routes WHERE id = ? AND user_id = ?',
    [routeId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Route not found for this user' });
      }
      res.json({ message: 'Route deleted successfully' });
    }
  );
});

module.exports = router;
