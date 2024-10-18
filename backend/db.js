// Import the Pool class from the 'pg' library to handle database connections
const { Pool } = require('pg');

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Create a new Pool instance with the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL from the .env file
});

// Export the pool instance so it can be used in other parts of the application
module.exports = pool;

