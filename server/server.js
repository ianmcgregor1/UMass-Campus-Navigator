const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './server/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
const db = require('./config/db');

// Routes
const userRoutes = require('./routes/users');
const routeRoutes = require('./routes/routes');
const locationRoutes = require('./routes/locations');

app.use('/api/users', userRoutes);
app.use('/api/users', routeRoutes);
app.use('/api/locations', locationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'UMass Navigator API is running',
    timestamp: new Date()
  });
});

// Start server
if(process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
  });
};

module.exports = app;