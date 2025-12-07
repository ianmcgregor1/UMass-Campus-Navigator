const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all locations (global pool of campus locations)
router.get('/', (req, res) => {
  db.query('SELECT * FROM locations', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Parse location JSON string back to object
    const parsedResults = results.map(location => ({
      ...location,
      location: typeof location.location === 'string' ? JSON.parse(location.location) : location.location
    }));
    
    res.json(parsedResults);
  });
});

module.exports = router;
