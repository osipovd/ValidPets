const pool = require('../db'); // Import the database connection pool.

const checkAdmin = async (req, res, next) => { // Define an asynchronous middleware function named checkAdmin.
  try {
    const userId = req.user.id; // Extract the user ID from the request object (assumed to be set by previous middleware).
    const result = await pool.query('SELECT is_admin FROM users WHERE id = $1 AND soft_deleted = FALSE', [userId]); // Query the database to check if the user is an admin and not soft deleted.

    if (result.rows.length === 0) { // If no user is found, return a 404 Not Found status with an error message.
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0]; // Extract the user information from the query result.

    if (!user.is_admin) { // If the user is not an admin, return a 403 Forbidden status with an error message.
      return res.status(403).json({ error: 'Access denied' });
    }

    next(); // If the user is an admin, call the next middleware function in the request-response cycle.
  } catch (err) { // If there is an error during the process, log the error and return a 500 Internal Server Error status with an error message.
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = checkAdmin; // Export the checkAdmin middleware function for use in other parts of the application.


