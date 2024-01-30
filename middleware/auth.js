const UnauthenticatedError = require('../errors/unauthenticated');

const authenticationMiddleware = async (req, res, next) => {
  // Check if the user's session has an authenticated user's ID (or another identifier)
  if (req.session && req.session.name) {
    try {
      // You can add additional checks here if needed, e.g., fetching user details
      // from the database and attaching them to the request object.
      // If the checks pass, call next() to continue to the next middleware
      next();
    } catch (error) {
      // Handle any errors that might occur during additional checks
      next(error);
    }
  } else {
    // If the session does not exist or does not have a user ID, throw an unauthenticated error
    next(new UnauthenticatedError('User is not authenticated'));
  }
};

module.exports = authenticationMiddleware;
