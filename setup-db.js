const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './server/.env' });

console.log('Setting up database...');

// Create connection to MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }

  console.log('Connected to MySQL');

  // Read and execute schema file
  const schemaPath = path.join(__dirname, 'server', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  connection.query(schema, (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      connection.end();
      process.exit(1);
    }

    console.log('Database and tables created');

    // Read and execute seed file
    const seedPath = path.join(__dirname, 'server', 'database', 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');

    connection.query(seed, (err) => {
      if (err) {
        console.error('Error inserting sample data:', err.message);
        connection.end();
        process.exit(1);
      }

      console.log('Sample data inserted');
      console.log('Database setup complete');

      connection.end();
    });
  });
});
