const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query(
    'SELECT id, name, email FROM users WHERE email = ? AND passwordHash = ?',
    [email, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json({ user: results[0] });
    }
  );
});

// Register endpoint
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Check if user already exists
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new user
    db.query(
      'INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)',
      [name, email, password],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          user: {
            id: results.insertId,
            name,
            email
          }
        });
      }
    );
  });
});

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
