// const mysql = require('mysql2');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config(); // Ensure environment variables are loaded

// // Create connection for database setup
// const setupConnection = mysql.createConnection({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD, // Environment variable for password
// });

// console.log('Setting up database...');

// // Read schema file
// const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// // Execute SQL commands
// setupConnection.query(schemaSQL, (err) => {
//   if (err) {
//     console.error('Error executing SQL:', err);
//     process.exit(1);
//   }

//   console.log('Database setup complete!');
//   console.log('The hotelRooms database has been created with sample data.');
//   setupConnection.end();
// });



const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306; // Default to 3306
const dbName = process.env.DB_NAME;

if (!dbHost || !dbUser || !dbPassword || !dbName) {
    console.error('Missing database environment variables.');
    process.exit(1);
}

const setupConnection = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: dbPort,
});

console.log('Setting up database...');

const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

setupConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}; USE ${dbName}; ${schemaSQL}`, (err) => {
    if (err) {
        console.error('Error executing SQL:', err);
        process.exit(1);
    }
    console.log('Database setup complete!');
    setupConnection.end();
});