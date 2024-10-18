import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BusinessResponseForm = ({ onResponseSubmit }) => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:5000/api/reviews/response/${reviewId}`, {
        response: responseText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/business/${response.data.business_id}`);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'Error submitting response');
    }
  };

  const formStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'left',
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

  const textareaStyle = {
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

  const errorMessageStyle = {
    color: 'red',
    textAlign: 'center',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headingStyle}>Respond to Review</h2>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Response:</label>
        <textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          required
          style={textareaStyle}
        />
      </div>
      {error && <p style={errorMessageStyle}>{error}</p>}
      <button type="submit" style={buttonStyle}>Submit Response</button>
    </form>
  );
};

export default BusinessResponseForm;




