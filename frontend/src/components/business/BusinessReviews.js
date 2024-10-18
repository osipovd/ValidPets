import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BusinessReviews = ({ businessId, userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/business/${businessId}`);
        setReviews(response.data);
        console.log('Reviews data:', response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error.response ? error.response.data : error.message);
      }
    };

    fetchReviews();
  }, [businessId]);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '20px auto',
  };

  const headingStyle = {
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const reviewItemStyle = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
  };

  const reviewDetailStyle = {
    marginBottom: '10px',
    fontSize: '16px',
  };

  const buttonStyle = {
    backgroundColor: '#3b5998',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    marginTop: '10px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Reviews</h2>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(review => (
        <div key={review.id} style={reviewItemStyle}>
          <p style={reviewDetailStyle}><strong>Rating:</strong> {review.rating}</p>
          <p style={reviewDetailStyle}><strong>Comment:</strong> {review.comment}</p>
          <p style={reviewDetailStyle}><strong>Reviewer:</strong> {review.user_full_name}</p>
          <p style={reviewDetailStyle}><strong>Reviewed on:</strong> {new Date(review.created_at).toLocaleString()}</p>
          <p style={reviewDetailStyle}><strong>Response:</strong> {review.response || 'No response yet'}</p>
          {businessId === review.business_id && review.user_id !== userId && !review.response && (
            <Link to={`/business/${businessId}/respond-review/${review.id}`}>
              <button style={buttonStyle}>Respond to Review</button>
            </Link>
          )}
          {businessId === review.business_id && review.user_id !== userId && review.response && (
            <Link to={`/business/${businessId}/edit-response/${review.id}`}>
              <button style={buttonStyle}>Edit Response</button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default BusinessReviews;















