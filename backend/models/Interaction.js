const pool = require('../db'); // Import the database connection pool.

class Interaction { // Define the Interaction class.
  constructor({ // Constructor for the Interaction class, initializing properties.
    id, user_id, business_id, type, created_at,
  }) {
    this.id = id; // Initialize the id property.
    this.user_id = user_id; // Initialize the user_id property.
    this.business_id = business_id; // Initialize the business_id property.
    this.type = type; // Initialize the type property.
    this.created_at = created_at; // Initialize the created_at property.
  }

  // Method to create a new interaction.
  static async create({
    user_id, business_id, type,
  }) {
    try {
      const result = await pool.query(
        `INSERT INTO interactions (user_id, business_id, type) 
         VALUES ($1, $2, $3) RETURNING *`,
        [user_id, business_id, type] // Insert new interaction into the database.
      );

      return new Interaction(result.rows[0]); // Return the newly created Interaction instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to delete an interaction.
  static async delete({
    user_id, business_id, type,
  }) {
    try {
      const result = await pool.query(
        `DELETE FROM interactions 
         WHERE user_id = $1 AND business_id = $2 AND type = $3 RETURNING *`,
        [user_id, business_id, type] // Delete interaction from the database based on user_id, business_id, and type.
      );

      if (result.rows.length === 0) {
        throw new Error('Interaction not found'); // Throw an error if the interaction is not found.
      }

      return { message: 'Interaction deleted successfully' }; // Return a success message if the interaction is deleted.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to toggle a like interaction for a business.
  static async toggleLikeBusiness(user_id, business_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM interactions WHERE user_id = $1 AND business_id = $2 AND type = 'like'`,
        [user_id, business_id] // Check if a like interaction already exists for the user and business.
      );

      if (result.rows.length > 0) {
        return this.delete({ user_id, business_id, type: 'like' }); // If it exists, delete the interaction.
      } else {
        return this.create({ user_id, business_id, type: 'like' }); // If it does not exist, create a new interaction.
      }
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to get interactions by user ID.
  static async getByUserId(user_id) {
    try {
      const result = await pool.query(
        'SELECT * FROM interactions WHERE user_id = $1',
        [user_id] // Query to get interactions by user ID.
      );
      return result.rows.map(row => new Interaction(row)); // Map the results to Interaction instances.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }
}

module.exports = Interaction; // Export the Interaction class for use in other parts of the application.

