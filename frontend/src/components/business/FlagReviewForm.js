import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FlagReviewForm = () => {
  const { reviewId, businessId } = useParams();
  const [flagReason, setFlagReason] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/flag-reviews/flag-review', {
        review_id: reviewId,
        flag_reason: flagReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Review flagged for admin review');
      navigate(`/business/${businessId}`);
    } catch (error) {
      console.error('Error flagging review:', error.response ? error.response.data : error.message);
      alert('Error flagging review');
    }
  };

  // Styles
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
  };

  const headingStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
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
      <h1 style={headingStyle}>Flag Review</h1>
      <form onSubmit={handleFlagSubmit}>
        <div>
          <label htmlFor="flagReason" style={labelStyle}>Reason for flagging:</label>
          <input
            id="flagReason"
            type="text"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

export default FlagReviewForm;




