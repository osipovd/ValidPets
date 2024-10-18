const express = require('express'); // Import the Express library.
const router = express.Router(); // Create a new router object.
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware to authenticate tokens.
const FlagReview = require('../models/FlagReview'); // Import the FlagReview model.

// Route to flag a review
router.post('/flag-review', authenticateToken, async (req, res) => {
  const { review_id, flag_reason } = req.body; // Extract the review ID and flag reason from the request body.
  const business_owner_id = req.user.id; // Get the business owner ID from the authenticated user.

  try {
    const flagReview = await FlagReview.create({ review_id, business_owner_id, flag_reason }); // Create a new flag review.
    res.status(201).json(flagReview); // Respond with the created flag review.
  } catch (err) {
    console.error('Error flagging review:', err.message); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route to fetch flagged reviews for the logged-in business owner
router.get('/my-cases', authenticateToken, async (req, res) => {
  const business_owner_id = req.user.id; // Get the business owner ID from the authenticated user.

  try {
    const cases = await FlagReview.findByBusinessOwnerId(business_owner_id); // Find flagged reviews by the business owner ID.
    res.status(200).json(cases); // Respond with the flagged reviews.
  } catch (err) {
    console.error('Error fetching cases:', err.message); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route to mark a flag review as appealed with reason
router.put('/appeal/:flagId', authenticateToken, async (req, res) => {
  const { flagId } = req.params; // Extract the flag ID from the request parameters.
  const { appeal_reason } = req.body; // Extract the appeal reason from the request body.

  try {
    const appealedFlagReview = await FlagReview.markAsAppealed(flagId, appeal_reason); // Mark the flag review as appealed.
    res.status(200).json(appealedFlagReview); // Respond with the appealed flag review.
  } catch (err) {
    console.error('Error marking flag review as appealed:', err.message); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

module.exports = router; // Export the router for use in other parts of the application.







