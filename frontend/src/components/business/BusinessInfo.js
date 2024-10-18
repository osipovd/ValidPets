import React from 'react';

// Define a functional component named BusinessInfo that takes a single prop 'business'
const BusinessInfo = ({ business }) => { 
  // Check if the 'business' prop is not provided (falsy), return a loading message
  if (!business) {
    return <p>Loading...</p>;
  }

  // Define styles for the component
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'left',
  };

  const headingStyle = {
    color: '#3b5998',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const detailStyle = {
    marginBottom: '10px',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      {/* Display the business name and its average rating */}
      <h2 style={headingStyle}>{business.business_name} ({business.averageRating})</h2>
      {/* Display the business description */}
      <p style={detailStyle}><strong>Description:</strong> {business.business_description}</p>
      {/* Display the business phone number */}
      <p style={detailStyle}><strong>Phone Number:</strong> {business.business_phone_number}</p>
      {/* Display the business email */}
      <p style={detailStyle}><strong>Email:</strong> {business.business_email}</p>
      {/* Display the business street address */}
      <p style={detailStyle}><strong>Street Address:</strong> {business.business_street_address}</p>
      {/* Display the business city */}
      <p style={detailStyle}><strong>City:</strong> {business.business_city}</p>
      {/* Display the business state or province */}
      <p style={detailStyle}><strong>State/Province:</strong> {business.business_state}</p>
      {/* Display the business postal code */}
      <p style={detailStyle}><strong>Postal Code:</strong> {business.business_zip_code}</p>
      {/* Display the business country */}
      <p style={detailStyle}><strong>Country:</strong> {business.business_country}</p>
      {/* Display the business categories, joined by commas */}
      <p style={detailStyle}><strong>Categories:</strong> {business.business_category.join(', ')}</p>
    </div>
  );
};

// Export the BusinessInfo component as the default export
export default BusinessInfo;


