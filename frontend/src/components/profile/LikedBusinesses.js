import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LikedBusinesses = () => {
  const [likedBusinesses, setLikedBusinesses] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLikedBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/interactions/liked-businesses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikedBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching liked businesses:', error.response ? error.response.data : error.message);
      }
    };

    if (token) {
      fetchLikedBusinesses();
    }
  }, [token]);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'center', // Center the text within the container
  };

  const headingStyle = {
    color: '#3b5998',
    marginBottom: '20px',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    display: 'inline-block', // Align the list items in the center
  };

  const listItemStyle = {
    marginBottom: '10px',
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

  if (likedBusinesses.length === 0) {
    return <p style={centeredTextStyle}>No liked businesses yet.</p>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Liked Businesses</h2>
      <ul style={listStyle}>
        {likedBusinesses.map(business => (
          <li key={business.id} style={listItemStyle}>
            <Link to={`/business/${business.id}`}>{business.business_name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikedBusinesses;


