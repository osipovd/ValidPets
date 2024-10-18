import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
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
        console.error('Error fetching flagged reviews:', error);
      }
    };

    if (token) {
      fetchFlaggedReviews();
    }
  }, [token]);

  const pendingReviews = flaggedReviews.filter(review => !review.admin_decision);
  const resolvedReviews = flaggedReviews.filter(review => review.admin_decision && !review.appeal);
  const appealingReviews = flaggedReviews.filter(review => review.appeal);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  const headerStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const linkContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  };

  const linkStyle = {
    color: '#3b5998',
    textDecoration: 'none',
    transition: 'color 0.3s',
    fontSize: '18px',
  };

  const sectionHeaderStyle = {
    color: '#3b5998',
    marginBottom: '10px',
    textAlign: 'center',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: '0',
  };

  const listItemStyle = {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  };

  const detailStyle = {
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

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Admin Dashboard</h1>
      <div style={linkContainerStyle}>
        <Link to="/admin/users" style={linkStyle}>Manage Users</Link>
        <Link to="/admin/businesses" style={linkStyle}>Manage Businesses</Link>
      </div>
      <div>
        <h2 style={sectionHeaderStyle}>Flagged Reviews</h2>
        <h3 style={sectionHeaderStyle}>Pending</h3>
        <ul style={listStyle}>
          {pendingReviews.map(review => (
            <li key={review.id} style={listItemStyle}>
              <p style={detailStyle}><strong>Review ID:</strong> {review.review_id}</p>
              <p style={detailStyle}><strong>Business Name:</strong> {review.business_name}</p>
              <p style={detailStyle}><strong>Review Text:</strong> {review.review_text}</p>
              <p style={detailStyle}><strong>Reviewer Name:</strong> {review.reviewer_name}</p>
              <p style={detailStyle}><strong>Flag Reason:</strong> {review.flag_reason}</p>
              <p style={detailStyle}><strong>Status:</strong> {capitalizeFirstLetter('Pending')}</p>
              {!review.admin_reviewed && (
                <Link to={`/admin/respond-flag/${review.id}`}>
                  <button style={buttonStyle}>Respond</button>
                </Link>
              )}
            </li>
          ))}
        </ul>
        {pendingReviews.length === 0 && (
          <p style={centeredTextStyle}>No pending cases.</p>
        )}
        <h3 style={sectionHeaderStyle}>Appealing</h3>
        <ul style={listStyle}>
          {appealingReviews.map(review => (
            <li key={review.id} style={listItemStyle}>
              <p style={detailStyle}><strong>Review ID:</strong> {review.review_id}</p>
              <p style={detailStyle}><strong>Business Name:</strong> {review.business_name}</p>
              <p style={detailStyle}><strong>Review Text:</strong> {review.review_text}</p>
              <p style={detailStyle}><strong>Reviewer Name:</strong> {review.reviewer_name}</p>
              <p style={detailStyle}><strong>Flag Reason:</strong> {review.flag_reason}</p>
              <p style={detailStyle}><strong>Status:</strong> {capitalizeFirstLetter('Appealing')}</p>
              <Link to={`/admin/review-appeal/${review.id}`}>
                <button style={buttonStyle}>Respond to Appeal</button>
              </Link>
            </li>
          ))}
        </ul>
        {appealingReviews.length === 0 && (
          <p style={centeredTextStyle}>No appealing cases.</p>
        )}
        <h3 style={sectionHeaderStyle}>Resolved</h3>
        <ul style={listStyle}>
          {resolvedReviews.map(review => (
            <li key={review.id} style={listItemStyle}>
              <p style={detailStyle}><strong>Review ID:</strong> {review.review_id}</p>
              <p style={detailStyle}><strong>Business Name:</strong> {review.business_name}</p>
              <p style={detailStyle}><strong>Review Text:</strong> {review.review_text}</p>
              <p style={detailStyle}><strong>Reviewer Name:</strong> {review.reviewer_name}</p>
              <p style={detailStyle}><strong>Flag Reason:</strong> {review.flag_reason}</p>
              <p style={detailStyle}><strong>Status:</strong> {capitalizeFirstLetter(review.admin_decision)}</p>
              <p style={detailStyle}><strong>Admin Reason:</strong> {review.admin_reason}</p>
            </li>
          ))}
        </ul>
        {resolvedReviews.length === 0 && (
          <p style={centeredTextStyle}>No resolved cases.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;























