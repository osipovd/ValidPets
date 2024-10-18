const express = require('express'); // Import the Express library.
const router = express.Router(); // Create a new router object.
const Interaction = require('../models/Interaction'); // Import the Interaction model.
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware to authenticate tokens.
const pool = require('../db'); // Import the pool for database queries.

// Route to like/unlike a business
router.post('/like-business', authenticateToken, async (req, res) => {
  const { business_id } = req.body; // Extract the business ID from the request body.
  const user_id = req.user.id; // Get the user ID from the authenticated user.

  try {
    const newLike = await Interaction.toggleLikeBusiness(user_id, business_id); // Toggle the like status for the business.
    res.status(201).json(newLike); // Respond with the new like status.
  } catch (err) {
    console.error('Error liking business:', err.message); // Log any errors.
    res.status(400).json({ error: err.message }); // Respond with a 400 status and an error message.
  }
});

// Route to check if a business is liked by a user
router.get('/business/:business_id/is-liked', authenticateToken, async (req, res) => {
  const { business_id } = req.params; // Extract the business ID from the request parameters.
  const user_id = req.user.id; // Get the user ID from the authenticated user.

  try {
    const interactions = await Interaction.getByUserId(user_id); // Get all interactions for the user.
    const liked = interactions.some(interaction => interaction.business_id === parseInt(business_id) && interaction.type === 'like'); // Check if the business is liked.
    res.status(200).json({ liked }); // Respond with the like status.
  } catch (err) {
    console.error('Error checking if business is liked:', err.message); // Log any errors.
    res.status(400).json({ error: err.message }); // Respond with a 400 status and an error message.
  }
});

// Route to get liked businesses
router.get('/liked-businesses', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user.

  try {
    const result = await pool.query(`
      SELECT b.*
      FROM interactions i
      JOIN businesses b ON i.business_id = b.id
      WHERE i.user_id = $1 AND i.type = 'like'
    `, [userId]); // Query the database to get the liked businesses for the user.

    res.status(200).json(result.rows); // Respond with the liked businesses.
  } catch (error) {
    console.error('Error fetching liked businesses:', error.message); // Log any errors.
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

module.exports = router; // Export the router for use in other parts of the application.

