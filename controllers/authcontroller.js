const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Register a new user
exports.register = async (req, res) => {
  // Destructure input data from the request body
  const { username, email, password } = req.body;

  // Hash the user's password using bcrypt (12 salt rounds for security)
  const hashed = await bcrypt.hash(password, 12);

  // Create a new user instance with the hashed password
  const user = new User({ username, email, password: hashed });

  // Save the new user to the database
  await user.save();

  // Send success response
  res.send('User registered');
};

// Log in an existing user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Find user in the database by username
  const user = await User.findOne({ username });

  // If user is not found, return error
  if (!user) return res.status(400).send('Invalid credentials');

  // Compare provided password with stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  // If passwords don't match, return error
  if (!isMatch) return res.status(400).send('Invalid credentials');

  // Set user ID in session for maintaining login state
  req.session.userId = user._id;

  // Send success response
  res.send('Logged in');
};

// Log out the current user
exports.logout = (req, res) => {
  // Destroy the user's session
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error logging out');

    // Clear the session cookie from the browser
    res.clearCookie('connect.sid');

    // Send success response
    res.send('Logged out');
  });
};

// Handle password reset request
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex');

  // Find user by email
  const user = await User.findOne({ email });

  // If user is not found, return error
  if (!user) return res.status(400).send('User not found');

  // Assign reset token and its expiry time to the user
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

  // Save the updated user document
  await user.save();

  // Generate the reset link with the token
  const resetLink = `http://localhost:3000/reset-password/${token}`;

  // Send password reset email
  await sendEmail(user.email, 'Password Reset', `<a href="${resetLink}">Reset Password</a>`);

  // Send success response
  res.send('Reset link sent');
};

// Handle password resetting using token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Find user with a valid reset token and check if it's not expired
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() } // Token must not be expired
  });

  // If token is invalid or expired, return error
  if (!user) return res.status(400).send('Invalid or expired token');

  // Hash the new password
  user.password = await bcrypt.hash(password, 12);

  // Clear the reset token and expiry
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  // Save the updated password
  await user.save();

  // Send success response
  res.send('Password reset successful');
};
