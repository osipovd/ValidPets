// Import necessary modules from React, react-router-dom, and axios
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the AppealForm functional component
const AppealForm = () => {
  // Get the flagId from the URL parameters
  const { flagId } = useParams();

  // State for storing the appeal reason input by the user
  const [appealReason, setAppealReason] = useState('');

  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  // Handle the submission of the appeal form
  const handleAppealSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make a PUT request to the API to submit the appeal
      await axios.put(`http://localhost:5000/api/flag-reviews/appeal/${flagId}`, {
        appeal_reason: appealReason
      }, {
        headers: { Authorization: `Bearer ${token}` } // Set the Authorization header
      });
      alert('Appeal submitted'); // Alert the user that the appeal was submitted
      navigate('/my-cases'); // Navigate to the "my-cases" page
    } catch (error) {
      console.error('Error submitting appeal:', error.response ? error.response.data : error.message); // Log the error
      alert('Error submitting appeal'); // Alert the user about the error
    }
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#1d1d1d',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
  };

  const buttonStyle = {
    backgroundColor: '#3b5998',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    display: 'block',
    margin: '20px auto',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Appeal Form</h1>
      <form onSubmit={handleAppealSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="appealReason" style={labelStyle}>Reason for appeal:</label>
          <input
            id="appealReason"
            type="text"
            value={appealReason}
            onChange={(e) => setAppealReason(e.target.value)} // Update appealReason state on input change
            required // Make the input field required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

export default AppealForm;





