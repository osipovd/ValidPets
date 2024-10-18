import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [inactiveBusinesses, setInactiveBusinesses] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/businesses/my-businesses', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBusinesses(response.data.filter(business => !business.soft_deleted));
          setInactiveBusinesses(response.data.filter(business => business.soft_deleted));
        } catch (error) {
          console.error('Error fetching businesses:', error.response ? error.response.data : error.message);
        }
      }
    };
    fetchBusinesses();
  }, [token]);

  const handleEdit = (id) => {
    navigate(`/edit-business/${id}`);
  };

  const handleDelete = (id) => {
    navigate(`/confirm-delete-business/${id}`);
  };

  const handleReactivate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/businesses/${id}/reactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusinesses((prevBusinesses) =>
        [...prevBusinesses, ...inactiveBusinesses.filter(business => business.id === id).map(business => ({ ...business, soft_deleted: false }))]
          .sort((a, b) => a.business_name.localeCompare(b.business_name))
      );
      setInactiveBusinesses((prevBusinesses) =>
        prevBusinesses.filter(business => business.id !== id)
      );
    } catch (error) {
      console.error('Error reactivating business:', error.response ? error.response.data : error.message);
    }
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '20px auto',
  };

  const headingStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const subheadingStyle = {
    color: '#333',
    marginTop: '20px',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
  };

  const listItemStyle = {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const buttonStyle = {
    backgroundColor: '#3b5998',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    marginLeft: '10px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>My Businesses</h2>
      <h3 style={subheadingStyle}>Active Businesses</h3>
      <ul style={listStyle}>
        {businesses.map((business) => (
          <li key={business.id} style={listItemStyle}>
            <Link to={`/business/${business.id}`}>{business.business_name}</Link>
            <div>
              <button onClick={() => handleEdit(business.id)} style={buttonStyle}>Edit</button>
              <button onClick={() => handleDelete(business.id)} style={buttonStyle}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <h3 style={subheadingStyle}>Inactive Businesses</h3>
      <ul style={listStyle}>
        {inactiveBusinesses.map((business) => (
          <li key={business.id} style={listItemStyle}>
            <Link to={`/business/${business.id}`}>{business.business_name}</Link>
            <button onClick={() => handleReactivate(business.id)} style={buttonStyle}>Reactivate</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBusinesses;
















