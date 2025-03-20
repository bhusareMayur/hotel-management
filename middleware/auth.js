const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT secret key - should be in environment variables in production
const JWT_SECRET = 'hotel_management_secret_key';

// Create JWT token
exports.createToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Auth middleware to protect routes
exports.authenticateUser = async (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;
  
  // Check if no token
  if (!token) {
    return res.redirect('/login');
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user to request
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.clearCookie('token');
    res.redirect('/login');
  }
};

// Optional auth middleware - doesn't redirect if no token
exports.optionalAuth = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    req.user = null;
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (err) {
    req.user = null;
    res.clearCookie('token');
  }
  
  next();
};

// Admin only middleware
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('error', { 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};