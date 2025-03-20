const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const connection = require('../db');

class User {
  // Create a new user
  static async create(userData) {
    const { username, email, password, role = 'user' } = userData;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
      
      connection.query(
        query,
        [username, email, hashedPassword, role],
        (err, result) => {
          if (err) {
            // Check if error is due to duplicate email
            if (err.code === 'ER_DUP_ENTRY') {
              return reject(new Error('Email already in use'));
            }
            return reject(err);
          }
          
          resolve({
            id: result.insertId,
            username,
            email,
            role
          });
        }
      );
    });
  }
  
  // Find user by email
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) return resolve(null);
          resolve(results[0]);
        }
      );
    });
  }
  
  // Find user by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [id],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) return resolve(null);
          resolve(results[0]);
        }
      );
    });
  }
  
  // Validate user credentials
  static async validatePassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}

module.exports = User;