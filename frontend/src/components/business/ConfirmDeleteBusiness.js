import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ConfirmDeleteBusiness = () => {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/businesses/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password },
      });
      navigate('/my-businesses');
    } catch (error) {
      setError(error.response?.data?.error || 'Error deleting business. Please try again.');
    }
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'center'
  };

  const headingStyle = {
    color: '#3b5998',
    marginBottom: '20px',
  };

  const formGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#1d1d1d',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#3b5998',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    flex: '1',
    margin: '0 10px',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    color: '#333',
  };

  const warningStyle = {
    color: 'red',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Confirm Delete Business</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p style={warningStyle}>
        Warning: Deleting this business cannot be undone. All reviews and business details will be permanently deleted.
      </p>
      <form onSubmit={handleDelete}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={buttonContainerStyle}>
          <button type="submit" style={buttonStyle}>Delete Business</button>
          <button type="button" style={cancelButtonStyle} onClick={() => navigate('/my-businesses')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmDeleteBusiness;



