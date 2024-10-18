import React, { useState } from 'react';
import axios from 'axios';

const EditReviewForm = ({ review, onUpdate }) => {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [error, setError] = useState('');
  const [hasUpdated, setHasUpdated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/api/reviews/${review.id}`, {
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHasUpdated(true);
      onUpdate(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'Error updating review');
    }
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'left'
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

  const selectStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
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

  const reviewDetailsStyle = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
  };

  const reviewDetailItemStyle = {
    marginBottom: '10px',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={reviewDetailsStyle}>
        <p style={reviewDetailItemStyle}><strong>Business:</strong> {review.business_name}</p>
        <p style={reviewDetailItemStyle}><strong>Rating:</strong> {review.rating}</p>
        <p style={reviewDetailItemStyle}><strong>Comment:</strong> {review.comment}</p>
        <p style={reviewDetailItemStyle}><strong>Reviewed on:</strong> {new Date(review.created_at).toLocaleString()}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <h2 style={headingStyle}>Edit Review</h2>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Rating:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={selectStyle}>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>{star}</option>
            ))}
          </select>
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            style={textareaStyle}
          />
        </div>
        {error && <p style={errorMessageStyle}>{error}</p>}
        <button type="submit" style={buttonStyle}>Update Review</button>
      </form>
    </div>
  );
};

export default EditReviewForm;








