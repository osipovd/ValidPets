import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched users:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (token) {
      fetchUsers();
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

  const headerStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const userContainerStyle = {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  };

  const userDetailStyle = {
    marginBottom: '10px',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Manage Users</h1>
      {users.map(user => (
        <div key={user.id} style={userContainerStyle}>
          <p style={userDetailStyle}><strong>ID:</strong> {user.id}</p>
          <p style={userDetailStyle}><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p style={userDetailStyle}><strong>Email:</strong> {user.email}</p>
          <p style={userDetailStyle}><strong>Phone:</strong> {user.phone_number || 'N/A'}</p>
          <p style={userDetailStyle}><strong>Address:</strong> {user.street_address || 'N/A'}</p>
          <p style={userDetailStyle}><strong>City:</strong> {user.city || 'N/A'}</p>
          <p style={userDetailStyle}><strong>State:</strong> {user.state_province || 'N/A'}</p>
          <p style={userDetailStyle}><strong>ZIP Code:</strong> {user.postal_code || 'N/A'}</p>
          <p style={userDetailStyle}><strong>Country:</strong> {user.country || 'N/A'}</p>
          <p style={userDetailStyle}><strong>Soft Deleted:</strong> {user.soft_deleted ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;






