const express = require('express');
const router = express.Router();
const pool = require('../db'); 
const authenticateToken = require('../middleware/authenticateToken'); 
const checkAdmin = require('../middleware/checkAdmin'); 
const FlagReview = require('../models/FlagReview'); 

// Admin dashboard route
router.get('/dashboard', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT * FROM users WHERE soft_deleted = FALSE'); // Fetch all active users from the database.
    const businessesResult = await pool.query('SELECT * FROM businesses WHERE soft_deleted = FALSE'); // Fetch all active businesses from the database.

    const users = usersResult.rows; // Store the fetched users.
    const businesses = businessesResult.rows; // Store the fetched businesses.

    res.json({ users, businesses }); // Respond with the users and businesses data.
  } catch (err) {
    console.error(err); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route to fetch all users (Admin only)
router.get('/users', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT * FROM users'); // Fetch all users from the database.
    const users = usersResult.rows; // Store the fetched users.
    res.json(users); // Respond with the users data.
  } catch (err) {
    console.error(err); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route to fetch all businesses (Admin only)
router.get('/businesses', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const businessesResult = await pool.query('SELECT * FROM businesses WHERE soft_deleted = FALSE'); // Fetch all active businesses from the database.
    const businesses = businessesResult.rows; // Store the fetched businesses.
    res.json(businesses); // Respond with the businesses data.
  } catch (err) {
    console.error(err); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route to fetch all flagged reviews (Admin only)
router.get('/flagged-reviews', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const flaggedReviewsResult = await pool.query(`
      SELECT rf.id, rf.review_id, rf.flag_reason, rf.admin_decision, rf.admin_reason, rf.appeal, rf.appeal_reason, 
             r.comment as review_text, u.first_name || ' ' || u.last_name as reviewer_name, 
             b.business_name
      FROM review_flags rf
      JOIN reviews r ON rf.review_id = r.id
      JOIN users u ON r.user_id = u.id
      JOIN businesses b ON r.business_id = b.id
    `); // Fetch all flagged reviews along with related review, user, and business data.
    const flaggedReviews = flaggedReviewsResult.rows; // Store the fetched flagged reviews.
    res.json(flaggedReviews); // Respond with the flagged reviews data.
  } catch (err) {
    console.error(err); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route for admin to review flagged reviews (Initial Decision)
router.put('/review/:flagId', authenticateToken, checkAdmin, async (req, res) => {
  const { flagId } = req.params; // Extract the flagId parameter from the request.
  const { admin_decision, admin_reason } = req.body; // Extract the admin_decision and admin_reason from the request body.

  try {
    const updatedFlagReview = await FlagReview.updateDecision(flagId, admin_decision, admin_reason); // Update the flagged review decision.

    if (admin_decision === 'approved') {
      await pool.query('UPDATE reviews SET soft_deleted = TRUE WHERE id = (SELECT review_id FROM review_flags WHERE id = $1)', [flagId]); // Soft delete the related review if the decision is approved.
    }

    res.status(200).json(updatedFlagReview); // Respond with the updated flagged review.
  } catch (err) {
    console.error('Error updating flag review decision:', err.message); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route for admin to review appeals
router.put('/review-appeal/:flagId', authenticateToken, checkAdmin, async (req, res) => {
  const { flagId } = req.params; // Extract the flagId parameter from the request.
  const { admin_decision, admin_reason } = req.body; // Extract the admin_decision and admin_reason from the request body.

  try {
    const result = await pool.query(
      'UPDATE review_flags SET admin_decision = $1, admin_reason = $2, appeal = FALSE, updated_at = $3 WHERE id = $4 RETURNING *',
      [admin_decision, admin_reason, new Date(), flagId]
    ); // Update the flagged review decision for an appeal.

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Flagged review not found' }); // Respond with a 404 status if the flagged review is not found.
    }

    if (admin_decision === 'approved') {
      await pool.query(
        'UPDATE reviews SET soft_deleted = TRUE WHERE id = (SELECT review_id FROM review_flags WHERE id = $1)',
        [flagId]
      ); // Soft delete the related review if the decision is approved.
    }

    res.status(200).json(result.rows[0]); // Respond with the updated flagged review.
  } catch (err) {
    console.error('Error updating appeal decision:', err.message); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

// Route to fetch a single flagged review by ID (Admin only)
router.get('/flagged-review/:flagId', authenticateToken, checkAdmin, async (req, res) => {
  const { flagId } = req.params; // Extract the flagId parameter from the request.

  try {
    const result = await pool.query(
      `SELECT rf.*, r.comment AS review_text, u.first_name || ' ' || u.last_name AS reviewer_name, b.business_name
       FROM review_flags rf
       JOIN reviews r ON rf.review_id = r.id
       JOIN users u ON r.user_id = u.id
       JOIN businesses b ON r.business_id = b.id
       WHERE rf.id = $1`,
      [flagId]
    ); // Fetch the flagged review along with related review, user, and business data.

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Flagged review not found' }); // Respond with a 404 status if the flagged review is not found.
    }

    res.json(result.rows[0]); // Respond with the flagged review data.
  } catch (err) {
    console.error(err); // Log any errors.
    res.status(500).json({ error: 'Internal server error' }); // Respond with a 500 status and an error message.
  }
});

module.exports = router; // Export the router for use in other parts of the application.







