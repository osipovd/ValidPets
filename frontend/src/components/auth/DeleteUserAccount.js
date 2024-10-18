import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteUserAccount = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.delete('http://localhost:5000/api/users/soft-delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { password }
      });

      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error deleting account');
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
  };

  const headingStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const warningStyle = {
    color: 'red',
    marginBottom: '20px',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#1d1d1d',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    backgroundColor: '#3b5998',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    display: 'block',
    margin: '20px auto',
  };

  const errorMessageStyle = {
    color: 'red',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Delete Account</h2>
      <p style={warningStyle}>Warning: Deleting your account will also delete any registered businesses or reviews.</p>
      {error && <p style={errorMessageStyle}>{error}</p>}
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
        <button type="submit" style={buttonStyle}>Delete Account</button>
      </form>
    </div>
  );
};

export default DeleteUserAccount;




