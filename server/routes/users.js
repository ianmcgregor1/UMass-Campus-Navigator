const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all users
router.get('/', (req, res) => {
  db.query('SELECT id, name FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, name FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
});

// CREATE new user
router.post('/', (req, res) => {
  const { name, password } = req.body;
  
  db.query(
    'INSERT INTO users (name, password) VALUES (?, ?)',
    [name, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: results.insertId,
        name
      });
    }
  );
});

// UPDATE user
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;
  
  db.query(
    'UPDATE users SET name = ?, password = ? WHERE id = ?',
    [name, password, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    }
  );
});

// DELETE user
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
