const express = require('express'); // Import the Express library.
const pool = require('../db'); // Import the database connection pool.
const router = express.Router(); // Create a new router object.
const Business = require('../models/Business'); // Import the Business model.
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware to authenticate tokens.
const bcrypt = require('bcrypt'); // Import the bcrypt library for password hashing and comparison.

// Route to register a new business
router.post('/register', authenticateToken, async (req, res) => {
  const {
    business_name,
    business_description,
    business_phone_number,
    business_email,
    business_street_address,
    business_city,
    business_state,
    business_zip_code,
    business_country,
    business_category
  } = req.body; // Extract the business details from the request body.

  try {
    const user_id = req.user.id; // Get the user ID from the authenticated user.

    const newBusiness = await Business.register({
      user_id,
      business_name,
      business_description,
      business_phone_number,
      business_email,
      business_street_address,
      business_city,
      business_state,
      business_zip_code,
      business_country,
      business_category
    }); // Register a new business.
    res.status(201).json(newBusiness); // Respond with the new business data.
  } catch (error) {
    console.error(error); // Log any errors.
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route for updating an existing business
router.put('/update-business/:id', authenticateToken, async (req, res) => {
  const {
    business_name,
    business_description,
    business_phone_number,
    business_email,
    business_street_address,
    business_city,
    business_state,
    business_zip_code,
    business_country,
    business_category
  } = req.body; // Extract the updated business details from the request body.

  try {
    const formattedCategories = `{${business_category.map(category => `"${category}"`).join(',')}}`; // Correctly format the array literal for the categories.
    const result = await pool.query(
      'UPDATE businesses SET business_name = $1, business_description = $2, business_phone_number = $3, business_email = $4, business_street_address = $5, business_city = $6, business_state = $7, business_zip_code = $8, business_country = $9, business_category = $10 WHERE id = $11 AND soft_deleted = FALSE RETURNING *',
      [business_name, business_description, business_phone_number, business_email, business_street_address, business_city, business_state, business_zip_code, business_country, formattedCategories, req.params.id]
    ); // Update the business in the database.

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' }); // Respond with a 404 status if the business is not found.
    }

    res.status(200).json(result.rows[0]); // Respond with the updated business data.
  } catch (error) {
    console.error(error); // Log any errors.
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to search for businesses
router.get('/search', async (req, res) => {
  const { term, city, state, category } = req.query; // Extract the search parameters from the query string.

  try {
    const businesses = await Business.search({ term, city, state, category }); // Search for businesses based on the parameters.
    res.status(200).json(businesses); // Respond with the search results.
  } catch (error) {
    console.error('Search Error Response:', error.message); // Log any errors.
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to get the user's businesses
router.get('/my-businesses', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id; // Get the user ID from the authenticated user.
    const result = await Business.getBusinessesByUserId(user_id); // Get the businesses associated with the user ID.
    res.status(200).json(result); // Respond with the user's businesses.
  } catch (error) {
    console.error(error); // Log any errors.
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to get a business by ID
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.getById(req.params.id); // Get the business by its ID.
    if (!business) {
      return res.status(404).json({ error: 'Business not found' }); // Respond with a 404 status if the business is not found.
    }
    res.status(200).json(business); // Respond with the business data.
  } catch (error) {
    console.error(error); // Log any errors.
    res.status(400).json({ error: error.message }); // Respond with a 400 status and an error message.
  }
});

// Route to soft delete a business
router.delete('/:id/delete', authenticateToken, async (req, res) => {
  const { id } = req.params; // Extract the business ID from the request parameters.
  const { password } = req.body; // Extract the password from the request body.
  const user_id = req.user.id; // Get the user ID from the authenticated user.

  try {
    // Verify password
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'User not found' }); // Respond with a 401 status if the user is not found.
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Incorrect password' }); // Respond with a 401 status if the password is incorrect.
    }

    // Soft delete business
    const business = await Business.softDelete(id);
    res.json({ message: 'Business successfully deleted', business }); // Respond with a success message and the soft-deleted business.
  } catch (err) {
    res.status(400).json({ error: err.message }); // Respond with a 400 status and an error message.
  }
});

// Route to reactivate a business
router.put('/:id/reactivate', authenticateToken, async (req, res) => {
  const { id } = req.params; // Extract the business ID from the request parameters.
  const user_id = req.user.id; // Get the user ID from the authenticated user.

  try {
    // Check if the business belongs to the user
    const businessResult = await pool.query('SELECT * FROM businesses WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (businessResult.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found or does not belong to the user' }); // Respond with a 404 status if the business is not found or does not belong to the user.
    }

    // Reactivate business
    const result = await pool.query('UPDATE businesses SET soft_deleted = FALSE WHERE id = $1 RETURNING *', [id]);
    res.json({ message: 'Business successfully reactivated', business: result.rows[0] }); // Respond with a success message and the reactivated business.
  } catch (err) {
    res.status(400).json({ error: err.message }); // Respond with a 400 status and an error message.
  }
});

module.exports = router; // Export the router for use in other parts of the application.



