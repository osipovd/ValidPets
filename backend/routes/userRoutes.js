const express = require('express'); // Import the Express library.
const router = express.Router(); // Create a new router object.
const pool = require('../db'); // Import the database connection pool.
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords.
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for handling JWTs.
const User = require('../models/User'); // Import the User model.
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware to authenticate tokens.

// Route to get all users (protected route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE soft_deleted = FALSE'); // Query the database for all users who are not soft deleted.
    res.json(result.rows); // Respond with the retrieved users.
  } catch (err) {
    console.error(err); // Log any errors to the console.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route to sign up a new user
router.post('/signup', async (req, res) => {
  const {
    first_name, last_name, email, phone_number, date_of_birth, password, street_address, city, state_province, postal_code, country, admin_code
  } = req.body; // Extract the user details from the request body.

  try {
    const is_admin = admin_code === 'Riddles9278!'; // Check if the provided admin code is correct and set the is_admin flag accordingly.

    const user = await User.signup({
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      password,
      street_address,
      city,
      state_province,
      postal_code,
      country,
      is_admin // Include the is_admin flag.
    });

    res.status(201).json(user); // Respond with the newly created user.
  } catch (err) {
    res.status(400).json({ error: err.message }); // Respond with a 400 status and an error message.
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract the email and password from the request body.

  try {
    const { user, token } = await User.login({ email, password }); // Attempt to log in the user.
    res.json({ user, token }); // Respond with the user and token.
  } catch (error) {
    res.status(401).json({ message: error.message }); // Respond with a 401 status and an error message.
  }
});

// Edit user details route
router.put('/edit', authenticateToken, async (req, res) => {
  const {
    first_name, last_name, email, phone_number, date_of_birth, street_address, city, state_province, postal_code, country
  } = req.body; // Extract the user details from the request body.

  try {
    const user = await User.update(req.user.id, {
      first_name, last_name, email, phone_number, date_of_birth, street_address, city, state_province, postal_code, country
    }); // Update the user details.
    res.json(user); // Respond with the updated user.
  } catch (err) {
    res.status(400).json({ error: err.message }); // Respond with a 400 status and an error message.
  }
});

// Profile route
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1 AND soft_deleted = FALSE', [req.user.id]); // Query the database for the authenticated user.
    res.json(result.rows[0]); // Respond with the user details.
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Change password route
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body; // Extract the current and new passwords from the request body.
  const userId = req.user.id; // Get the user ID from the authenticated user.

  try {
    const result = await User.changePassword(userId, currentPassword, newPassword); // Attempt to change the user's password.
    res.json(result); // Respond with a success message.
  } catch (err) {
    res.status(400).json({ error: err.message }); // Respond with a 400 status and an error message.
  }
});

// Soft delete route
router.delete('/soft-delete', authenticateToken, async (req, res) => {
  const { password } = req.body; // Extract the password from the request body.

  try {
    const user = await User.softDelete(req.user.id, password); // Attempt to soft delete the user.
    res.json({ message: 'Account successfully deleted' }); // Respond with a success message.
  } catch (err) {
    res.status(400).json({ error: err.message }); // Respond with a 400 status and an error message.
  }
});

module.exports = router; // Export the router for use in other parts of the application.

