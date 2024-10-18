// Import the express framework
const express = require('express');

// Import the cors middleware to enable CORS (Cross-Origin Resource Sharing)
const cors = require('cors');

// Import the dotenv library to load environment variables from a .env file
const dotenv = require('dotenv');

// Load environment variables from the .env file into process.env
dotenv.config();

// Create an Express application instance
const app = express();

// Define the port number for the server, using the value from the environment variables or defaulting to 5000
const port = process.env.PORT || 5000;

// Use the cors middleware to allow cross-origin requests
app.use(cors());

// Use the express.json middleware to parse JSON request bodies
app.use(express.json());

// Import route modules for different parts of the application
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const flagReviewRoutes = require('./routes/flagReviewRoutes'); // Import flag review routes

// Mount the route modules on specific paths
app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/flag-reviews', flagReviewRoutes); // Add the flag review routes

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log a message when the server starts
});



