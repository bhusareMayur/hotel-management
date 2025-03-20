const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const connection = require('./db');
const { optionalAuth, authenticateUser, requireAdmin } = require('./middleware/auth');
const authRoutes = require('./routes/auth');

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth routes
app.use('/', authRoutes);

// Apply optional auth to all routes to make user data available
app.use(optionalAuth);

// Public routes
app.get('/', (req, res) => {
  connection.query('SELECT * FROM rooms', (err, results) => {
    if (err) throw err;
    res.render('index', { 
      rooms: results,
      user: req.user 
    });
  });
});

// Protected routes
app.get('/my-bookings', authenticateUser, (req, res) => {
  connection.query(
    'SELECT b.*, r.room_number, r.room_type FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.guest_email = ?',
    [req.user.email],
    (err, results) => {
      if (err) throw err;
      res.render('my-bookings', { 
        bookings: results,
        user: req.user 
      });
    }
  );
});

// Admin routes
app.get('/admin/dashboard', authenticateUser, requireAdmin, (req, res) => {
  res.render('admin/dashboard', { user: req.user });
});

// API routes
// Get all rooms
app.get('/api/rooms', (req, res) => {
  connection.query('SELECT * FROM rooms', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get a specific room
app.get('/api/rooms/:id', (req, res) => {
  connection.query(
    'SELECT * FROM rooms WHERE id = ?', 
    [req.params.id],
    (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    }
  );
});

// Create a booking (protected)
app.post('/api/bookings', authenticateUser, (req, res) => {
  const { room_id, guest_name, check_in_date, check_out_date, total_price } = req.body;
  const guest_email = req.user.email; // Use logged in user's email
  
  connection.query(
    'INSERT INTO bookings (room_id, guest_name, guest_email, check_in_date, check_out_date, total_price) VALUES (?, ?, ?, ?, ?, ?)',
    [room_id, guest_name, guest_email, check_in_date, check_out_date, total_price],
    (err, results) => {
      if (err) throw err;
      
      // Update room availability
      connection.query(
        'UPDATE rooms SET is_available = FALSE WHERE id = ?',
        [room_id],
        (err) => {
          if (err) throw err;
          res.status(201).json({
            message: 'Booking created successfully',
            booking_id: results.insertId
          });
        }
      );
    }
  );
});

// Get all bookings (admin only)
app.get('/api/bookings', authenticateUser, requireAdmin, (req, res) => {
  connection.query(
    'SELECT b.*, r.room_number, r.room_type FROM bookings b JOIN rooms r ON b.room_id = r.id',
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

// Get user's bookings
app.get('/api/my-bookings', authenticateUser, (req, res) => {
  connection.query(
    'SELECT b.*, r.room_number, r.room_type FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.guest_email = ?',
    [req.user.email],
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});