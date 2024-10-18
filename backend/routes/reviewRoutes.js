const express = require('express'); // Import the Express library.
const router = express.Router(); // Create a new router object.
const pool = require('../db'); // Import the database connection pool.
const Review = require('../models/Review'); // Import the Review model.
const Business = require('../models/Business'); // Import the Business model.
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware to authenticate tokens.

// Route to create a review
router.post('/', authenticateToken, async (req, res) => {
  const { business_id, rating, comment } = req.body; // Extract business ID, rating, and comment from the request body.
  const user_id = req.user.id; // Get the user ID from the authenticated user.

  try {
    const newReview = await Review.create({ business_id, user_id, rating, comment }); // Create a new review.
    res.status(201).json(newReview); // Respond with the new review.
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to get reviews by business ID
router.get('/business/:business_id', async (req, res) => {
  const { business_id } = req.params; // Extract the business ID from the request parameters.

  try {
    const reviews = await Review.getByBusinessId(business_id); // Get reviews for the business.
    res.status(200).json(reviews); // Respond with the reviews.
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to respond to a review
router.put('/response/:id', authenticateToken, async (req, res) => {
  const { response } = req.body; // Extract the response text from the request body.
  const user_id = req.user.id; // Get the user ID from the authenticated user.

  try {
    const updatedReview = await Review.addResponse(req.params.id, user_id, response); // Add a response to the review.
    res.status(200).json(updatedReview); // Respond with the updated review.
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to update a review
router.put('/:id', authenticateToken, async (req, res) => {
  const { rating, comment } = req.body; // Extract the rating and comment from the request body.
  const reviewId = req.params.id; // Get the review ID from the request parameters.
  const userId = req.user.id; // Get the user ID from the authenticated user.

  try {
    const review = await Review.getById(reviewId); // Get the review by ID.
    if (!review) {
      return res.status(404).json({ error: 'Review not found' }); // Respond with a 404 status if the review is not found.
    }
    if (review.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to edit this review' }); // Respond with a 403 status if the user is not authorized to edit the review.
    }

    const updatedReview = await Review.update(reviewId, { rating, comment }); // Update the review.
    res.status(200).json(updatedReview); // Respond with the updated review.
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to edit a response to a review
router.put('/edit-response/:id', authenticateToken, async (req, res) => {
  const { response } = req.body; // Extract the new response text from the request body.
  const user_id = req.user.id; // Get the user ID from the authenticated user.
  const reviewId = req.params.id; // Get the review ID from the request parameters.

  try {
    const review = await Review.getById(reviewId); // Get the review by ID.
    if (!review) {
      return res.status(404).json({ error: 'Review not found' }); // Respond with a 404 status if the review is not found.
    }

    const business = await Business.getById(review.business_id); // Get the business by ID.
    if (business.user_id !== user_id) {
      return res.status(403).json({ error: 'You are not authorized to edit this response' }); // Respond with a 403 status if the user is not authorized to edit the response.
    }

    const updatedReview = await Review.editResponse(reviewId, user_id, response); // Edit the response to the review.
    if (!updatedReview) {
      return res.status(404).json({ error: 'Failed to update response' }); // Respond with a 404 status if the response update fails.
    }
    res.status(200).json(updatedReview); // Respond with the updated review.
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to get reviews by user ID
router.get('/user/:user_id', authenticateToken, async (req, res) => {
  const { user_id } = req.params; // Extract the user ID from the request parameters.

  try {
    const reviews = await Review.getByUserId(user_id); // Get reviews by user ID.
    res.status(200).json(reviews); // Respond with the reviews.
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to fetch soft-deleted reviews for a specific business
router.get('/soft-deleted/business/:businessId', authenticateToken, async (req, res) => {
  const { businessId } = req.params; // Extract the business ID from the request parameters.
  try {
    const result = await pool.query(
      'SELECT * FROM reviews WHERE business_id = $1 AND soft_deleted = TRUE',
      [businessId]
    ); // Query the database for soft-deleted reviews for the business.
    res.status(200).json(result.rows); // Respond with the soft-deleted reviews.
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

module.exports = router; // Export the router for use in other parts of the application.




