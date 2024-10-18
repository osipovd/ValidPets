import React from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
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
    marginBottom: '15px',
    textAlign: 'center',
  };

  const linkStyle = {
    color: '#3b5998',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Settings</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}>
          <Link to="/edit-profile" style={linkStyle}>Edit Profile</Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/change-password" style={linkStyle}>Change Password</Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/register-business" style={linkStyle}>Register Business</Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/delete-account" style={linkStyle}>Delete Account</Link>
        </li>
      </ul>
    </div>
  );
};

export default Settings;




