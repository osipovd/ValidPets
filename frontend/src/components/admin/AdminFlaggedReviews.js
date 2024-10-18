import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFlaggedReviews = () => {
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFlaggedReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/flagged-reviews', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFlaggedReviews(response.data);
      } catch (error) {
        console.error('Error fetching flagged reviews:', error.response ? error.response.data : error.message);
      }
    };

    fetchFlaggedReviews();
  }, [token]);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const headerStyle = {
    color: '#3b5998',
    marginBottom: '20px',
  };

  const sectionHeaderStyle = {
    color: '#3b5998',
    marginBottom: '10px',
  };

  const reviewContainerStyle = {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  };

  const reviewDetailStyle = {
    marginBottom: '10px',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Flagged Reviews</h1>
      <div>
        <h2 style={sectionHeaderStyle}>Pending Reviews</h2>
        {flaggedReviews.filter(review => review.status === 'Pending').map(review => (
          <div key={review.id} style={reviewContainerStyle}>
            <p style={reviewDetailStyle}><strong>Review ID:</strong> {review.review_id}</p>
            <p style={reviewDetailStyle}><strong>Review Text:</strong> {review.review_text}</p>
            <p style={reviewDetailStyle}><strong>Reviewer Name:</strong> {review.reviewer_name}</p>
            <p style={reviewDetailStyle}><strong>Business Name:</strong> {review.business_name}</p>
            <p style={reviewDetailStyle}><strong>Flag Reason:</strong> {review.flag_reason}</p>
            <p style={reviewDetailStyle}><strong>Status:</strong> {review.status}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 style={sectionHeaderStyle}>Resolved Reviews</h2>
        {flaggedReviews.filter(review => review.status === 'Resolved').map(review => (
          <div key={review.id} style={reviewContainerStyle}>
            <p style={reviewDetailStyle}><strong>Review ID:</strong> {review.review_id}</p>
            <p style={reviewDetailStyle}><strong>Review Text:</strong> {review.review_text}</p>
            <p style={reviewDetailStyle}><strong>Reviewer Name:</strong> {review.reviewer_name}</p>
            <p style={reviewDetailStyle}><strong>Business Name:</strong> {review.business_name}</p>
            <p style={reviewDetailStyle}><strong>Flag Reason:</strong> {review.flag_reason}</p>
            <p style={reviewDetailStyle}><strong>Status:</strong> {review.status}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 style={sectionHeaderStyle}>Appealed Reviews</h2>
        {flaggedReviews.filter(review => review.status === 'Appealed').map(review => (
          <div key={review.id} style={reviewContainerStyle}>
            <p style={reviewDetailStyle}><strong>Review ID:</strong> {review.review_id}</p>
            <p style={reviewDetailStyle}><strong>Review Text:</strong> {review.review_text}</p>
            <p style={reviewDetailStyle}><strong>Reviewer Name:</strong> {review.reviewer_name}</p>
            <p style={reviewDetailStyle}><strong>Business Name:</strong> {review.business_name}</p>
            <p style={reviewDetailStyle}><strong>Flag Reason:</strong> {review.flag_reason}</p>
            <p style={reviewDetailStyle}><strong>Status:</strong> {review.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFlaggedReviews;



