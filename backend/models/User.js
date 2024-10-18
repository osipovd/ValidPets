const pool = require('../db'); // Import the database connection pool.
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing.
const jwt = require('jsonwebtoken'); // Import JSON Web Token library for handling JWTs.

class User { // Define the User class.
  constructor({ id, first_name, last_name, email, phone_number, date_of_birth, password, street_address, city, state_province, postal_code, country, soft_deleted, is_admin }) { // Constructor for the User class, initializing properties.
    this.id = id; // Initialize the id property.
    this.first_name = first_name; // Initialize the first_name property.
    this.last_name = last_name; // Initialize the last_name property.
    this.email = email; // Initialize the email property.
    this.phone_number = phone_number; // Initialize the phone_number property.
    this.date_of_birth = date_of_birth; // Initialize the date_of_birth property.
    this.password = password; // Initialize the password property.
    this.street_address = street_address; // Initialize the street_address property.
    this.city = city; // Initialize the city property.
    this.state_province = state_province; // Initialize the state_province property.
    this.postal_code = postal_code; // Initialize the postal_code property.
    this.country = country; // Initialize the country property.
    this.soft_deleted = soft_deleted; // Initialize the soft_deleted property.
    this.is_admin = is_admin; // Initialize the is_admin property.
  }

  // Static method to sign up a new user.
  static async signup({ first_name, last_name, email, phone_number, date_of_birth, password, street_address, city, state_province, postal_code, country, is_admin = false }) {
    try {
      // Check if the email is already in use and the user is not soft deleted.
      const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1 AND soft_deleted = FALSE', [email]);
      // Check if the phone number is already in use and the user is not soft deleted.
      const phoneCheck = await pool.query('SELECT * FROM users WHERE phone_number = $1 AND soft_deleted = FALSE', [phone_number]);

      // Throw an error if the email is already in use.
      if (emailCheck.rows.length > 0) {
        throw new Error('Email already in use');
      }
      // Throw an error if the phone number is already in use.
      if (phoneCheck.rows.length > 0) {
        throw new Error('Phone number already in use');
      }

      // Hash the password using bcrypt.
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database.
      const result = await pool.query(
        'INSERT INTO users (first_name, last_name, email, phone_number, date_of_birth, password, street_address, city, state_province, postal_code, country, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        [first_name, last_name, email, phone_number, date_of_birth, hashedPassword, street_address, city, state_province, postal_code, country, is_admin]
      );

      return new User(result.rows[0]); // Return the newly created User instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Static method to log in a user.
  static async login({ email, password }) {
    try {
      // Query the database for a user with the provided email.
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      // Throw an error if the user is not found.
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Compare the provided password with the stored hashed password.
      const isMatch = await bcrypt.compare(password, user.password);

      // Throw an error if the passwords do not match.
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      // Reactivate the user and their related businesses and reviews if the user is soft deleted.
      if (user.soft_deleted) {
        await pool.query('UPDATE users SET soft_deleted = FALSE WHERE id = $1', [user.id]);
        await pool.query('UPDATE businesses SET soft_deleted = FALSE WHERE user_id = $1', [user.id]);
        await pool.query('UPDATE reviews SET soft_deleted = FALSE WHERE user_id = $1', [user.id]);
        user.soft_deleted = false;
      }

      // Generate a JWT token for the user.
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      delete user.password; // Remove the password from the user object.
      return { user: new User(user), token }; // Return the user and the token.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Static method to update user details.
  static async update(userId, { first_name, last_name, email, phone_number, date_of_birth, street_address, city, state_province, postal_code, country, is_admin }) {
    try {
      // Update the user details in the database.
      const result = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, date_of_birth = $5, street_address = $6, city = $7, state_province = $8, postal_code = $9, country = $10, is_admin = $11 WHERE id = $12 AND soft_deleted = FALSE RETURNING *',
        [first_name, last_name, email, phone_number, date_of_birth, street_address, city, state_province, postal_code, country, is_admin, userId]
      );

      // Throw an error if the user is not found.
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return new User(result.rows[0]); // Return the updated User instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Static method to change a user's password.
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Query the database for the user.
      const result = await pool.query('SELECT * FROM users WHERE id = $1 AND soft_deleted = FALSE', [userId]);
      const user = result.rows[0];

      // Throw an error if the user is not found.
      if (!user) {
        throw new Error('User not found');
      }

      // Compare the current password with the stored hashed password.
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      // Throw an error if the passwords do not match.
      if (!validPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash the new password.
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database.
      await pool.query('UPDATE users SET password = $1 WHERE id = $2 AND soft_deleted = FALSE', [hashedPassword, userId]);

      return { message: 'Password changed successfully' }; // Return a success message.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }

  // Static method to soft delete a user.
  static async softDelete(userId, password) {
    try {
      // Query the database for the user.
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = result.rows[0];

      // Throw an error if the user is not found.
      if (!user) {
        throw new Error('User not found');
      }

      // Compare the provided password with the stored hashed password.
      const validPassword = await bcrypt.compare(password, user.password);
      // Throw an error if the passwords do not match.
      if (!validPassword) {
        throw new Error('Incorrect password');
      }

      // Soft delete the user by setting the soft_deleted flag to TRUE.
      const deleteUser = await pool.query('UPDATE users SET soft_deleted = TRUE WHERE id = $1 RETURNING *', [userId]);

      // Soft delete the user's related businesses and reviews.
      await pool.query('UPDATE businesses SET soft_deleted = TRUE WHERE user_id = $1', [userId]);
      await pool.query('UPDATE reviews SET soft_deleted = TRUE WHERE user_id = $1', [userId]);

      // Throw an error if the user is not found.
      if (deleteUser.rows.length === 0) {
        throw new Error('User not found');
      }

      return new User(deleteUser.rows[0]); // Return the soft deleted User instance.
    } catch (err) {
      throw new Error(err.message); // Throw an error if something goes wrong.
    }
  }
}

module.exports = User; // Export the User class for use in other parts of the application.



