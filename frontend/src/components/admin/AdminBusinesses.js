import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/businesses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    if (token) {
      fetchBusinesses();
    }
  }, [token]);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: '0',
  };

  const listItemStyle = {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
    fontSize: '18px',
  };

  const linkStyle = {
    color: '#3b5998',
    textDecoration: 'none',
    transition: 'color 0.3s',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Manage Businesses</h1>
      <ul style={listStyle}>
        {businesses.length === 0 && <p>No businesses available.</p>}
        {businesses.map(business => (
          <li key={business.id} style={listItemStyle}>
            <Link to={`/business/${business.id}`} style={linkStyle}>
              {business.business_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBusinesses;






