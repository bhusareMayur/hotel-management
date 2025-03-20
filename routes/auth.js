const express = require('express');
const User = require('../models/User');
const { createToken } = require('../middleware/auth');
const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Render signup page
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Handle login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate user credentials
    const user = await User.validatePassword(email, password);
    
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }
    
    // Create token
    const token = createToken(user);
    
    // Set cookie
    res.cookie('token', token, { 
      httpOnly: true, 
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'An error occurred during login' });
  }
});

// Handle signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.render('signup', { error: 'Passwords do not match' });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.render('signup', { error: 'Email already in use' });
    }
    
    // Create new user
    const user = await User.create({ username, email, password });
    
    // Create token
    const token = createToken(user);
    
    // Set cookie
    res.cookie('token', token, { 
      httpOnly: true, 
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Redirect to home page
    res.redirect('/');
  } catch (err) {
    console.error('Signup error:', err);
    res.render('signup', { error: err.message || 'An error occurred during signup' });
  }
});

// Handle logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;