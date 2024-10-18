import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const Profile = () => {
  const [user, setUser] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMMM do, yyyy');
  };

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

  const paragraphStyle = {
    marginBottom: '10px',
    color: '#1d1d1d',
  };

  const strongStyle = {
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Profile</h1>
      <p style={paragraphStyle}><strong style={strongStyle}>First Name:</strong> {user.first_name}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>Last Name:</strong> {user.last_name}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>Email:</strong> {user.email}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>Phone Number:</strong> {user.phone_number}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>Date of Birth:</strong> {formatDate(user.date_of_birth)}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>Street Address:</strong> {user.street_address}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>City:</strong> {user.city}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>State/Province:</strong> {user.state_province}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>Postal Code:</strong> {user.postal_code}</p>
      <p style={paragraphStyle}><strong style={strongStyle}>Country:</strong> {user.country}</p>
    </div>
  );
};

export default Profile;







