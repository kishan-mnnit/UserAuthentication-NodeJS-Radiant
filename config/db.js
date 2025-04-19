const mongoose = require('mongoose');

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variable
    await mongoose.connect(process.env.MONGO_URI);

    // Log success message on successful connection
    console.log('MongoDB connected');
  } catch (err) {
    // Log error message if connection fails
    console.error(err.message);

    // Exit the process with failure
    process.exit(1);
  }
};

// Export the database connection function for use in other files
module.exports = connectDB;
