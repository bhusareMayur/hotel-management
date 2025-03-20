const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db'); // Make sure the path is correct for your project
const router = express.Router();
const session = require('express-session');

// Middleware for handling sessions
router.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Login route
router.get('/login', (req, res) => {
  res.render('login'); // Render login page
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.user = user[0];

    if (user[0].role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/login');
  });
});

module.exports = router;
