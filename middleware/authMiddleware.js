// Middleware to check if the user is authenticated
module.exports = (req, res, next) => {
  // Check if session contains a valid userId
  if (req.session.userId) {
    // User is authenticated, proceed to next middleware or route handler
    next();
  } else {
    // User is not authenticated, send unauthorized response
    res.status(401).send('Unauthorized');
  }
};
