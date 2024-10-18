const pool = require('../db'); // Import the database connection pool.
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to handle JSON Web Tokens (JWT).

class Business { // Define the Business class.
  constructor({ // Constructor for the Business class, initializing properties.
    id, user_id, business_name, business_description, business_phone_number, business_email, business_street_address, business_city, business_state, business_zip_code, business_country, business_category, soft_deleted
  }) {
    this.id = id; // Initialize the id property.
    this.user_id = user_id; // Initialize the user_id property.
    this.business_name = business_name; // Initialize the business_name property.
    this.business_description = business_description; // Initialize the business_description property.
    this.business_phone_number = business_phone_number; // Initialize the business_phone_number property.
    this.business_email = business_email; // Initialize the business_email property.
    this.business_street_address = business_street_address; // Initialize the business_street_address property.
    this.business_city = business_city; // Initialize the business_city property.
    this.business_state = business_state; // Initialize the business_state property.
    this.business_zip_code = business_zip_code; // Initialize the business_zip_code property.
    this.business_country = business_country; // Initialize the business_country property.
    this.business_category = typeof business_category === 'string' ? JSON.parse(business_category) : business_category; // Parse business_category if it is a string, otherwise assign it directly.
    this.soft_deleted = soft_deleted; // Initialize the soft_deleted property to indicate if the business is soft deleted.
  }

  // Method to register a new business or reactivate a soft-deleted one.
  static async register({ // Register method to handle business registration.
    user_id, business_name, business_description, business_phone_number, business_email, business_street_address, business_city, business_state, business_zip_code, business_country, business_category
  }) {
    try {
      // Check if a business with the same phone number or email already exists.
      const existingBusiness = await pool.query(
        'SELECT * FROM businesses WHERE (business_phone_number = $1 OR business_email = $2) AND user_id = $3',
        [business_phone_number, business_email, user_id]
      );

      if (existingBusiness.rows.length > 0) { // If an existing business is found.
        const business = existingBusiness.rows[0];
        if (business.soft_deleted) { // If the existing business is soft-deleted, reactivate it.
          const reactivatedBusiness = await pool.query(
            'UPDATE businesses SET business_name = $1, business_description = $2, business_street_address = $3, business_city = $4, business_state = $5, business_zip_code = $6, business_country = $7, business_category = $8, soft_deleted = FALSE WHERE id = $9 RETURNING *',
            [business_name, business_description, business_street_address, business_city, business_state, business_zip_code, business_country, `{${business_category.map(category => `"${category}"`).join(',')}}`, business.id]
          );
          return new Business(reactivatedBusiness.rows[0]); // Return the reactivated business.
        } else {
          throw new Error('A business with this phone number or email already exists.');
        }
      }

      const formattedCategories = `{${business_category.map(category => `"${category}"`).join(',')}}`; // Correctly format the array literal for business categories.

      // Insert the new business into the database.
      const result = await pool.query(
        `INSERT INTO businesses 
         (user_id, business_name, business_description, business_phone_number, business_email, business_street_address, business_city, business_state, business_zip_code, business_country, business_category) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [user_id, business_name, business_description, business_phone_number, business_email, business_street_address, business_city, business_state, business_zip_code, business_country, formattedCategories]
      );

      return new Business(result.rows[0]); // Return the newly created business.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to search for businesses, excluding soft deleted ones.
  static async search({ term, city, state, category }) {
    try {
      const conditions = ['soft_deleted = FALSE']; // Ensure only active (not soft-deleted) businesses are returned.
      const values = [];
      let paramIndex = 1;

      if (term) { // If a search term is provided.
        conditions.push(`(business_name ILIKE $${paramIndex} OR business_description ILIKE $${paramIndex})`);
        values.push(`%${term}%`);
        paramIndex++;
      }

      if (city) { // If a city is provided.
        conditions.push(`business_city ILIKE $${paramIndex}`);
        values.push(`%${city}%`);
        paramIndex++;
      }

      if (state) { // If a state is provided.
        conditions.push(`business_state ILIKE $${paramIndex}`);
        values.push(`%${state}%`);
        paramIndex++;
      }

      if (category) { // If a category is provided.
        conditions.push(`$${paramIndex} = ANY (business_category)`);
        values.push(category);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''; // Combine conditions into a SQL WHERE clause.

      const result = await pool.query(`SELECT * FROM businesses ${whereClause}`, values); // Execute the query.

      return result.rows.map(row => new Business(row)); // Map the results to Business instances.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to get a business by ID, including soft deleted ones.
  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM businesses WHERE id = $1', [id]); // Query the database by business ID.
      if (result.rows.length === 0) {
        return null; // Return null if no business is found.
      }
      return new Business(result.rows[0]); // Return the found business.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to get businesses by user ID, including soft deleted ones.
  static async getBusinessesByUserId(user_id) {
    try {
      const result = await pool.query('SELECT * FROM businesses WHERE user_id = $1', [user_id]); // Query the database by user ID.
      return result.rows.map(row => new Business(row)); // Map the results to Business instances.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to soft delete a business.
  static async softDelete(id) {
    try {
      const result = await pool.query('UPDATE businesses SET soft_deleted = TRUE WHERE id = $1 RETURNING *', [id]); // Update the business to soft delete it.
      if (result.rows.length === 0) {
        throw new Error('Business not found'); // Throw an error if the business is not found.
      }
      return new Business(result.rows[0]); // Return the soft-deleted business.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to soft delete a business, ensuring only the owner can perform the deletion.
  static async ownerSoftDelete(id, user_id) {
    try {
      // Ensure that only the business owner can soft delete the business.
      const businessResult = await pool.query('SELECT * FROM businesses WHERE id = $1 AND user_id = $2', [id, user_id]);
      if (businessResult.rows.length === 0) {
        throw new Error('Business not found or you are not authorized to delete this business'); // Throw an error if the business is not found or the user is not authorized.
      }

      // Soft delete the business by setting the soft_deleted flag to TRUE.
      const result = await pool.query('UPDATE businesses SET soft_deleted = TRUE WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        throw new Error('Business not found'); // Throw an error if the business is not found.
      }

      return new Business(result.rows[0]); // Return the soft-deleted business.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Method to reactivate a business.
  static async reactivate(id) {
    try {
      const result = await pool.query('UPDATE businesses SET soft_deleted = FALSE WHERE id = $1 RETURNING *', [id]); // Update the business to reactivate it.
      if (result.rows.length === 0) {
        throw new Error('Business not found'); // Throw an error if the business is not found.
      }
      return new Business(result.rows[0]); // Return the reactivated business.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }
}

module.exports = Business; // Export the Business class for use in other parts of the application.
