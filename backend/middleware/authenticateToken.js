const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library, which is used to work with JSON Web Tokens (JWT).

const authenticateToken = (req, res, next) => { // Define a middleware function named authenticateToken.
  const authHeader = req.headers['authorization']; // Extract the 'authorization' header from the incoming request.
  const token = authHeader && authHeader.split(' ')[1]; // Check if the authorization header exists. If it does, split the header value by a space and take the second part as the token.

  if (!token) { // If no token is found, return a 401 Unauthorized status.
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // Verify the token using the secret key from environment variables.
    if (err) { // If there is an error during verification (e.g., token is invalid or expired), return a 403 Forbidden status.
      return res.sendStatus(403);
    }

    req.user = user; // If verification is successful, attach the decoded user information to the request object.
    next(); // Call the next middleware function in the request-response cycle.
  });
};

module.exports = authenticateToken; // Export the authenticateToken middleware function for use in other parts of the application.

