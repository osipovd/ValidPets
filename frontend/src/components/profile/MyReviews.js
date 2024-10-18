import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditReviewForm from './EditReviewForm';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [hasEditedReview, setHasEditedReview] = useState({});
  const userId = parseInt(localStorage.getItem('userId'), 10);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log('Fetching reviews for user ID:', userId);
        const response = await axios.get(`http://localhost:5000/api/reviews/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched user reviews:', response.data);
        setReviews(response.data);

        const editedReviews = response.data.reduce((acc, review) => {
          acc[review.id] = review.updated_at && review.updated_at !== review.created_at;
          return acc;
        }, {});
        setHasEditedReview(editedReviews);
      } catch (error) {
        console.error('Error fetching user reviews:', error.response ? error.response.data : error.message);
      }
    };

    fetchReviews();
  }, [userId, token]);

  const handleReviewUpdate = async (updatedReview) => {
    try {
      await axios.put(`http://localhost:5000/api/reviews/${updatedReview.id}`, updatedReview, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get(`http://localhost:5000/api/reviews/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data);
      const editedReviews = response.data.reduce((acc, review) => {
        acc[review.id] = review.updated_at && review.updated_at !== review.created_at;
        return acc;
      }, {});
      setHasEditedReview(editedReviews);
    } catch (error) {
      console.error('Error updating review:', error.response ? error.response.data : error.message);
    }
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const reviewItemStyle = {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  const reviewDetailItemStyle = {
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
    display: 'inline-block',
    margin: '10px 0',
  };

  const centeredTextStyle = {
    textAlign: 'center',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
    marginBottom: '20px',
  };

  const headingStyle = {
    textAlign: 'center',
    color: '#3b5998',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>My Reviews</h2>
      {reviews.length === 0 && <p style={centeredTextStyle}>You have not left any reviews yet.</p>}
      {reviews.map((review) => (
        <div key={review.id} style={reviewItemStyle}>
          <p style={reviewDetailItemStyle}><strong>Business:</strong> {review.business_name || ''}</p>
          <p style={reviewDetailItemStyle}><strong>Rating:</strong> {review.rating}</p>
          <p style={reviewDetailItemStyle}><strong>Comment:</strong> {review.comment}</p>
          <p style={reviewDetailItemStyle}><strong>Reviewed on:</strong> {new Date(review.created_at).toLocaleString()}</p>
          {review.response && (
            <p style={reviewDetailItemStyle}><strong>Response:</strong> {review.response}</p>
          )}
          {review.soft_deleted && (
            <p style={reviewDetailItemStyle}><strong>Status:</strong> This review was soft deleted because it violated validpets policies.</p>
          )}
          {!hasEditedReview[review.id] && !review.soft_deleted && (
            <EditReviewForm review={review} onUpdate={handleReviewUpdate} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MyReviews;
























