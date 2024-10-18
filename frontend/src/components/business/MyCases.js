import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/flag-reviews/my-cases', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [token]);

  const handleAppealClick = (caseId) => {
    navigate(`/appeal/${caseId}`);
  };

  const pendingCases = cases.filter(caseItem => !caseItem.admin_decision && !caseItem.appeal);
  const resolvedCases = cases.filter(caseItem => caseItem.admin_decision && !caseItem.appeal);
  const appealingCases = cases.filter(caseItem => caseItem.appeal);

  if (cases.length === 0) {
    return <div>No cases found.</div>;
  }

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

  const caseStyle = {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
  };

  const caseDetailStyle = {
    marginBottom: '10px',
    fontSize: '16px',
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
    marginTop: '10px',
  };

  const centeredTextStyle = {
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '20px',
  };

  const renderCases = (caseList, title) => (
    <div>
      <h2 style={headingStyle}>{title}</h2>
      {caseList.length === 0 ? (
        <p style={centeredTextStyle}>No {title.toLowerCase()} cases.</p>
      ) : (
        caseList.map((caseItem) => (
          <div key={caseItem.id} style={caseStyle}>
            <p style={caseDetailStyle}><strong>Review ID:</strong> {caseItem.review_id}</p>
            <p style={caseDetailStyle}><strong>Review Text:</strong> {caseItem.review_text}</p>
            <p style={caseDetailStyle}><strong>Reviewer Name:</strong> {caseItem.reviewer_name}</p>
            <p style={caseDetailStyle}><strong>Business Name:</strong> {caseItem.business_name}</p>
            <p style={caseDetailStyle}><strong>Flag Reason:</strong> {caseItem.flag_reason}</p>
            <p style={caseDetailStyle}><strong>Status:</strong> {caseItem.admin_decision ? caseItem.admin_decision : 'Pending'}</p>
            {caseItem.admin_decision && (
              <p style={caseDetailStyle}><strong>Admin Reason:</strong> {caseItem.admin_reason}</p>
            )}
            {caseItem.admin_decision === 'rejected' && !caseItem.appeal && (
              <button style={buttonStyle} onClick={() => handleAppealClick(caseItem.id)}>Appeal</button>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>My Cases</h1>
      {renderCases(pendingCases, 'Pending Cases')}
      {renderCases(resolvedCases, 'Resolved Cases')}
      {renderCases(appealingCases, 'Appealing Cases')}
    </div>
  );
};

export default MyCases;















