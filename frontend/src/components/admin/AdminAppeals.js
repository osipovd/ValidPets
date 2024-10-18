import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAppeals = () => {
  const [appealedReviews, setAppealedReviews] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppealedReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/appeals', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppealedReviews(response.data);
      } catch (error) {
        console.error('Error fetching appealed reviews:', error.response ? error.response.data : error.message);
      }
    };

    fetchAppealedReviews();
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

  const reviewItemStyle = {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    textAlign: 'center', 
  };

  const reviewDetailItemStyle = {
    marginBottom: '10px',
    fontSize: '16px',
    textAlign: 'center', 
  };

  const headingStyle = {
    color: '#3b5998',
    marginBottom: '20px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Appealed Reviews</h1>
      {appealedReviews.length === 0 && <p>No appealed reviews found.</p>}
      {appealedReviews.map(review => (
        <div key={review.id} style={reviewItemStyle}>
          <p style={reviewDetailItemStyle}><strong>Review ID:</strong> {review.review_id}</p>
          <p style={reviewDetailItemStyle}><strong>Review Text:</strong> {review.review_text}</p>
          <p style={reviewDetailItemStyle}><strong>Reviewer Name:</strong> {review.reviewer_name}</p>
          <p style={reviewDetailItemStyle}><strong>Business Name:</strong> {review.business_name}</p>
          <p style={reviewDetailItemStyle}><strong>Flag Reason:</strong> {review.flag_reason}</p>
          <p style={reviewDetailItemStyle}><strong>Status:</strong> {review.status}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminAppeals;


