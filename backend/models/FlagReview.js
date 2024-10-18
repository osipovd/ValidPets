const pool = require('../db'); // Import the database connection pool.

class FlagReview { // Define the FlagReview class.
  constructor({ // Constructor for the FlagReview class, initializing properties.
    id, review_id, business_owner_id, flag_reason, admin_reviewed, admin_decision, admin_reason, appeal, created_at, updated_at, review_text, reviewer_name, business_name
  }) {
    this.id = id; // Initialize the id property.
    this.review_id = review_id; // Initialize the review_id property.
    this.business_owner_id = business_owner_id; // Initialize the business_owner_id property.
    this.flag_reason = flag_reason; // Initialize the flag_reason property.
    this.admin_reviewed = admin_reviewed || false; // Initialize the admin_reviewed property, defaulting to false.
    this.admin_decision = admin_decision || null; // Initialize the admin_decision property, defaulting to null.
    this.admin_reason = admin_reason || null; // Initialize the admin_reason property, defaulting to null.
    this.appeal = appeal || false; // Initialize the appeal property, defaulting to false.
    this.created_at = created_at || new Date(); // Initialize the created_at property, defaulting to the current date.
    this.updated_at = updated_at || new Date(); // Initialize the updated_at property, defaulting to the current date.
    this.review_text = review_text; // Initialize the review_text property.
    this.reviewer_name = reviewer_name; // Initialize the reviewer_name property.
    this.business_name = business_name; // Initialize the business_name property.
  }

  // Method to create a new flag review.
  static async create({ review_id, business_owner_id, flag_reason }) {
    try {
      const result = await pool.query(
        'INSERT INTO review_flags (review_id, business_owner_id, flag_reason, admin_reviewed, admin_decision, admin_reason, appeal, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [review_id, business_owner_id, flag_reason, false, null, null, false, new Date(), new Date()] // Insert new flag review into the database.
      );
      return new FlagReview(result.rows[0]); // Return the newly created FlagReview instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to find flag reviews by business owner ID.
  static async findByBusinessOwnerId(business_owner_id) {
    try {
      const result = await pool.query(
        `SELECT rf.*, r.comment AS review_text, u.first_name || ' ' || u.last_name AS reviewer_name, b.business_name, rf.admin_reason
         FROM review_flags rf
         JOIN reviews r ON rf.review_id = r.id
         JOIN users u ON r.user_id = u.id
         JOIN businesses b ON r.business_id = b.id
         WHERE rf.business_owner_id = $1`,
        [business_owner_id] // Query to find flag reviews by business owner ID, joining related tables for additional information.
      );
      return result.rows.map(row => new FlagReview(row)); // Map the results to FlagReview instances.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to update the decision on a flag review.
  static async updateDecision(flagId, admin_decision, admin_reason) {
    try {
      const result = await pool.query(
        'UPDATE review_flags SET admin_reviewed = TRUE, admin_decision = $1, admin_reason = $2, appeal = FALSE, updated_at = $3 WHERE id = $4 RETURNING *',
        [admin_decision, admin_reason, new Date(), flagId] // Update the flag review with the admin's decision.
      );
      if (result.rows.length === 0) {
        throw new Error('Flag not found'); // Throw an error if the flag review is not found.
      }
      if (admin_decision === 'approved') { // If the admin decision is to approve, soft delete the related review.
        await pool.query(
          'UPDATE reviews SET soft_deleted = TRUE WHERE id = (SELECT review_id FROM review_flags WHERE id = $1)',
          [flagId]
        );
      }
      return new FlagReview(result.rows[0]); // Return the updated FlagReview instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to mark a flag review as appealed.
  static async markAsAppealed(flagId, appeal_reason) {
    try {
      const result = await pool.query(
        'UPDATE review_flags SET appeal = TRUE, appeal_reason = $1, updated_at = $2 WHERE id = $3 RETURNING *',
        [appeal_reason, new Date(), flagId] // Update the flag review to mark it as appealed.
      );
      if (result.rows.length === 0) {
        throw new Error('Flag not found'); // Throw an error if the flag review is not found.
      }
      return new FlagReview(result.rows[0]); // Return the appealed FlagReview instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to find all flag reviews.
  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM review_flags'); // Query to find all flag reviews.
      return result.rows.map(row => new FlagReview(row)); // Map the results to FlagReview instances.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }
}

module.exports = FlagReview; // Export the FlagReview class for use in other parts of the application.
