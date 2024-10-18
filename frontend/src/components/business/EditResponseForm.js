import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditResponseForm = ({ reviewId, initialResponse, onResponseSubmit }) => {
  const [responseText, setResponseText] = useState(initialResponse || '');
  const [error, setError] = useState('');
  const [hasUpdatedResponse, setHasUpdatedResponse] = useState(false);

  useEffect(() => {
    console.log('Initial Response received:', initialResponse);
    setResponseText(initialResponse || '');
  }, [initialResponse]);

  useEffect(() => {
    console.log('Current responseText state:', responseText);
  }, [responseText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Submitting with response:', responseText);
    try {
      const response = await axios.put(`http://localhost:5000/api/reviews/edit-response/${reviewId}`, {
        response: responseText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHasUpdatedResponse(true);
      onResponseSubmit(response.data.response);
    } catch (error) {
      console.error('Error updating response:', error.response ? error.response.data : error);
      setError(error.response ? error.response.data.error : 'Error updating response');
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

  const textareaStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
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

  if (hasUpdatedResponse) {
    console.log('Update successful, response updated:', responseText);
    return <p style={{ textAlign: 'center', color: '#28a745' }}>Response updated successfully!</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <h4 style={headingStyle}>Edit Response</h4>
      <textarea
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        required
        style={textareaStyle}
      />
      {error && <p style={errorMessageStyle}>{error}</p>}
      <button type="submit" style={buttonStyle}>Update Response</button>
    </form>
  );
};

export default EditResponseForm;







