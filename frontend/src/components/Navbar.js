import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBusiness } from '../contexts/BusinessContext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { businesses, inactiveBusinesses, fetchBusinesses } = useBusiness();
  const token = localStorage.getItem('token');
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasBusinesses, setHasBusinesses] = useState(false);

  const memoizedFetchBusinesses = useCallback(fetchBusinesses, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAdmin(response.data.is_admin);
          memoizedFetchBusinesses();
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [token, memoizedFetchBusinesses]);

  useEffect(() => {
    setHasBusinesses(businesses.length > 0 || inactiveBusinesses.length > 0);
  }, [businesses, inactiveBusinesses]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
    window.location.reload();
  };

  const navbarStyle = {
    backgroundColor: '#3b5998',
    padding: '10px 20px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  };

  const navbarListStyle = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
  };

  const navbarItemStyle = {
    margin: '0 10px',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  };

  const buttonStyle = {
    backgroundColor: '#f7f7f7',
    color: '#3b5998',
    cursor: 'pointer',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  };

  return (
    <nav style={navbarStyle}>
      <ul style={navbarListStyle}>
        <li style={navbarItemStyle}><Link to="/" style={linkStyle}>Home</Link></li>
        {!token && <li style={navbarItemStyle}><Link to="/login" style={linkStyle}>Login</Link></li>}
        {!token && <li style={navbarItemStyle}><Link to="/signup" style={linkStyle}>Signup</Link></li>}
        {token && <li style={navbarItemStyle}><Link to="/profile" style={linkStyle}>Profile</Link></li>}
        {token && <li style={navbarItemStyle}><Link to="/my-reviews" style={linkStyle}>My Reviews</Link></li>}
        {token && <li style={navbarItemStyle}><Link to="/liked-businesses" style={linkStyle}>Liked Businesses</Link></li>}
        {token && <li style={navbarItemStyle}><Link to="/settings" style={linkStyle}>Settings</Link></li>}
        {token && hasBusinesses && <li style={navbarItemStyle}><Link to="/my-businesses" style={linkStyle}>My Businesses</Link></li>}
        {token && hasBusinesses && <li style={navbarItemStyle}><Link to="/my-cases" style={linkStyle}>My Cases</Link></li>}
        {isAdmin && <li style={navbarItemStyle}><Link to="/admin/dashboard" style={linkStyle}>Admin Dashboard</Link></li>}
        {token && <li style={navbarItemStyle}><button onClick={handleLogout} style={buttonStyle}>Logout</button></li>}
      </ul>
    </nav>
  );
};

export default Navbar;























