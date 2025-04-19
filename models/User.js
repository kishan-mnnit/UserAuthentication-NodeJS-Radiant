const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  // Unique username for the user
  username: { type: String, unique: true },

  // Unique email address for the user
  email: { type: String, unique: true },

  // Hashed password
  password: String,

  // Token used for password reset
  resetToken: String,

  // Expiration time for the reset token
  resetTokenExpiry: Date
});

// Export the User model using the defined schema
module.exports = mongoose.model('User', userSchema);
