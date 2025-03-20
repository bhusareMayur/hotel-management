const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const db = require('./db'); // Importing database connection
const bodyParser = require('body-parser');

const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static folder (for CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware (for handling user sessions)
app.use(session({
  secret: 'your_secret_key',  // Replace with your own secret key
  resave: false,
  saveUninitialized: false,
}));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Routes
app.use(authRoutes); // Authentication routes (login, signup, logout)

// Home route
app.get('/', (req, res) => {
  res.render('home'); // Home page
});

// Admin Dashboard route (Protected)
app.get('/admin/dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login'); // Redirect to login if not logged in as admin
  }
  res.render('admin-dashboard', { user: req.session.user }); // Render the admin dashboard
});

// Room booking page route (protected for users)
app.get('/booking', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }
  res.render('booking', { user: req.session.user }); // Render the booking page
});

// Error handling
app.use((req, res, next) => {
  res.status(404).send('Page not found'); // 404 error handling
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
