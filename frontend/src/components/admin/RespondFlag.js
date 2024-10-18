import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RespondFlag = () => {
  const [adminDecision, setAdminDecision] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const { flagId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleDecisionChange = (event) => {
    setAdminDecision(event.target.value);
  };

  const handleReasonChange = (event) => {
    setAdminReason(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/review/${flagId}`, {
        admin_decision: adminDecision,
        admin_reason: adminReason,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error submitting decision:', error.response ? error.response.data : error.message);
    }
  };

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

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#1d1d1d',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
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

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Respond to Flagged Review</h1>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Decision:
          </label>
          <select value={adminDecision} onChange={handleDecisionChange} style={selectStyle}>
            <option value="">Select</option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Reason:
          </label>
          <textarea value={adminReason} onChange={handleReasonChange} style={textareaStyle}></textarea>
        </div>
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

export default RespondFlag;






