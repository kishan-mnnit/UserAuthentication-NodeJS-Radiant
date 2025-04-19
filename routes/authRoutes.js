const express = require('express');
const router = express.Router();

// Import authentication controller functions
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/authcontroller');

// Import middleware to protect private routes
const isAuth = require('../middleware/authMiddleware');

// Route to register a new user
router.post('/register', register);

// Route to log in an existing user
router.post('/login', login);

// Route to log out a user (requires authentication)
router.post('/logout', isAuth, logout);

// Route to initiate forgot password process
router.post('/forgot-password', forgotPassword);

// Route to reset password using token from email
router.post('/reset-password/:token', resetPassword);

// Export the configured router
module.exports = router;
