const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Ensure environment variables are loaded

// Create connection for database setup
const setupConnection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD, // Environment variable for password
});

console.log('Setting up database...');

// Read schema file
const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// Execute SQL commands
setupConnection.query(schemaSQL, (err) => {
  if (err) {
    console.error('Error executing SQL:', err);
    process.exit(1);
  }

  console.log('Database setup complete!');
  console.log('The hotelRooms database has been created with sample data.');
  setupConnection.end();
});
