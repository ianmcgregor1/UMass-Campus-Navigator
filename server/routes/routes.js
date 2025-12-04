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
      // Parse stops JSON string back to array
      const parsedResults = results.map(route => ({
        ...route,
        stops: typeof route.stops === 'string' ? JSON.parse(route.stops) : route.stops
      }));
      res.json(parsedResults);
    }
  );
});

// GET specific route for a user
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
      
      const route = routeResults[0];
      // Parse stops JSON string back to array
      route.stops = typeof route.stops === 'string' ? JSON.parse(route.stops) : route.stops;
      
      res.json(route);
    }
  );
});

// CREATE new route for a user
router.post('/:userId/routes', (req, res) => {
  const { userId } = req.params;
  const { name, stops } = req.body;
  
  // Convert stops array to JSON string
  const stopsJson = JSON.stringify(stops);
  
  db.query(
    'INSERT INTO routes (name, stops, user_id) VALUES (?, ?, ?)',
    [name, stopsJson, userId],
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
  const { name, stops } = req.body;
  
  // Convert stops array to JSON string if provided
  const stopsJson = stops ? JSON.stringify(stops) : undefined;
  
  // Build dynamic query based on what fields are provided
  let query = 'UPDATE routes SET ';
  const params = [];
  
  if (name !== undefined) {
    query += 'name = ?';
    params.push(name);
  }
  
  if (stopsJson !== undefined) {
    if (params.length > 0) query += ', ';
    query += 'stops = ?';
    params.push(stopsJson);
  }
  
  query += ' WHERE id = ? AND user_id = ?';
  params.push(routeId, userId);
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Route not found for this user' });
    }
    res.json({ message: 'Route updated successfully' });
  });
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
