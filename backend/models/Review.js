const pool = require('../db'); // Import the database connection pool.
const jwt = require('jsonwebtoken'); // Import the JSON Web Token library for handling JWTs.

class Review { // Define the Review class.
  constructor({ id, business_id, user_id, rating, comment, response, created_at, updated_at, user_full_name, business_name, soft_deleted }) { // Constructor for the Review class, initializing properties.
    this.id = id; // Initialize the id property.
    this.business_id = business_id; // Initialize the business_id property.
    this.user_id = user_id; // Initialize the user_id property.
    this.rating = rating; // Initialize the rating property.
    this.comment = comment; // Initialize the comment property.
    this.response = response; // Initialize the response property.
    this.created_at = created_at; // Initialize the created_at property.
    this.updated_at = updated_at; // Initialize the updated_at property.
    this.user_full_name = user_full_name; // Initialize the user_full_name property.
    this.business_name = business_name; // Initialize the business_name property.
    this.soft_deleted = soft_deleted; // Initialize the soft_deleted property.
  }

  // Method to create a new review.
  static async create({ business_id, user_id, rating, comment }) {
    try {
      // Check if the business exists and is not soft deleted.
      const businessResult = await pool.query('SELECT user_id FROM businesses WHERE id = $1 AND soft_deleted = FALSE', [business_id]);
      if (businessResult.rows.length === 0) {
        throw new Error('Business not found or has been deleted');
      }
      // Check if the user is trying to review their own business.
      if (businessResult.rows[0].user_id === user_id) {
        throw new Error('You cannot leave a review on your own business');
      }

      // Insert the new review into the database.
      const result = await pool.query(
        'INSERT INTO reviews (business_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
        [business_id, user_id, rating, comment]
      );
      return new Review(result.rows[0]); // Return the newly created Review instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to add a response to a review.
  static async addResponse(reviewId, userId, response) {
    try {
      // Check if the review exists and is not soft deleted.
      const reviewResult = await pool.query('SELECT business_id FROM reviews WHERE id = $1 AND soft_deleted = FALSE', [reviewId]);
      if (reviewResult.rows.length === 0) {
        throw new Error('Review not found or has been deleted');
      }
      // Check if the user is authorized to respond to the review.
      const businessResult = await pool.query('SELECT user_id FROM businesses WHERE id = $1 AND soft_deleted = FALSE', [reviewResult.rows[0].business_id]);
      if (businessResult.rows[0].user_id !== userId) {
        throw new Error('You are not authorized to respond to this review');
      }

      // Update the review with the response.
      const result = await pool.query(
        'UPDATE reviews SET response = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [response, reviewId]
      );
      if (result.rows.length === 0) {
        throw new Error('Review not found or has been deleted');
      }
      return new Review(result.rows[0]); // Return the updated Review instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to get reviews by business ID.
  static async getByBusinessId(business_id) {
    try {
      // Query to get reviews for a specific business, excluding soft-deleted reviews and users.
      const result = await pool.query(
        `SELECT r.*, u.first_name || ' ' || u.last_name AS user_full_name
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.business_id = $1 AND r.soft_deleted = FALSE AND u.soft_deleted = FALSE`,
        [business_id]
      );
      return result.rows.map(row => new Review(row)); // Return the reviews as Review instances.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to get a review by its ID.
  static async getById(id) {
    try {
      // Query to get a review by its ID, excluding soft-deleted reviews and users.
      const result = await pool.query(
        `SELECT r.*, u.first_name || ' ' || u.last_name AS user_full_name
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.id = $1 AND r.soft_deleted = FALSE AND u.soft_deleted = FALSE`,
        [id]
      );
      if (result.rows.length === 0) {
        return null; // Return null if the review is not found.
      }
      return new Review(result.rows[0]); // Return the review as a Review instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to update a review.
  static async update(id, { rating, comment }) {
    try {
      // Update the review with the new rating and comment.
      const result = await pool.query(
        'UPDATE reviews SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND soft_deleted = FALSE RETURNING *',
        [rating, comment, id]
      );
      if (result.rows.length === 0) {
        throw new Error('Review not found or has been deleted');
      }
      return new Review(result.rows[0]); // Return the updated Review instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to edit a response to a review.
  static async editResponse(reviewId, userId, response) {
    try {
      // Check if the review exists and is not soft deleted.
      const reviewResult = await pool.query('SELECT business_id FROM reviews WHERE id = $1 AND soft_deleted = FALSE', [reviewId]);
      if (reviewResult.rows.length === 0) {
        throw new Error('Review not found or has been deleted');
      }
      // Check if the user is authorized to edit the response.
      const businessResult = await pool.query('SELECT user_id FROM businesses WHERE id = $1 AND soft_deleted = FALSE', [reviewResult.rows[0].business_id]);
      if (businessResult.rows[0].user_id !== userId) {
        throw new Error('You are not authorized to edit this response');
      }

      // Update the review with the new response.
      const result = await pool.query(
        'UPDATE reviews SET response = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND soft_deleted = FALSE RETURNING *',
        [response, reviewId]
      );
      if (result.rows.length === 0) {
        throw new Error('Review not found or has been deleted');
      }
      return new Review(result.rows[0]); // Return the updated Review instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to get reviews by user ID.
  static async getByUserId(user_id) {
    try {
      // Query to get reviews for a specific user.
      const result = await pool.query(
        `SELECT r.*, b.business_name, u.first_name || ' ' || u.last_name AS user_full_name
         FROM reviews r
         JOIN businesses b ON r.business_id = b.id
         JOIN users u ON r.user_id = u.id
         WHERE r.user_id = $1`,
        [user_id]
      );
      return result.rows.map(row => new Review(row)); // Return the reviews as Review instances.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }
}

module.exports = Review; // Export the Review class for use in other parts of the application.





