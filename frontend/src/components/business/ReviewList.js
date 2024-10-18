import React from 'react';

const ReviewList = ({ reviews }) => {
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

  const reviewStyle = {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
  };

  const detailStyle = {
    marginBottom: '10px',
    fontSize: '16px',
  };

  const responseStyle = {
    color: '#555',
    fontStyle: 'italic',
  };

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} style={reviewStyle}>
            <p style={detailStyle}><strong>Rating:</strong> {review.rating}</p>
            <p style={detailStyle}><strong>Comment:</strong> {review.comment}</p>
            <p style={detailStyle}><strong>Reviewer:</strong> {review.user_full_name}</p>
            <p style={detailStyle}><strong>Reviewed on:</strong> {new Date(review.created_at).toLocaleString()}</p>
            <p style={{...detailStyle, ...responseStyle}}><strong>Response:</strong> {review.response || 'No response yet'}</p>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#888' }}>No reviews yet</p>
      )}
    </div>
  );
};

export default ReviewList;


