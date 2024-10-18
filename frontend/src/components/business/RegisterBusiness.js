import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import states from '../States';
import countries from '../Countries';
import categoriesList from '../Categories';
import { useBusiness } from '../../contexts/BusinessContext';

const RegisterBusiness = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    business_phone_number: '',
    business_email: '',
    business_street_address: '',
    business_city: '',
    business_state: '',
    business_zip_code: '',
    business_country: '',
    business_category: [],
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { fetchBusinesses } = useBusiness();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      if (checked) {
        return { ...prevData, business_category: [...prevData.business_category, value] };
      } else {
        return { ...prevData, business_category: prevData.business_category.filter((category) => category !== value) };
      }
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/businesses/register', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBusinesses();
      navigate('/profile');
    } catch (error) {
      console.error('Error Response:', error.response);
      setError(error.response ? error.response.data.error : 'Error registering business');
    }
  };

  const formStyle = {
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

  const selectStyle = inputStyle;

  const buttonStyle = {
    backgroundColor: '#3b5998',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
  };

  return (
    <form onSubmit={handleRegister} style={formStyle}>
      <h2 style={headingStyle}>Register Business</h2>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Name</label>
        <input
          type="text"
          name="business_name"
          value={formData.business_name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Description</label>
        <input
          type="text"
          name="business_description"
          value={formData.business_description}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Phone Number</label>
        <input
          type="text"
          name="business_phone_number"
          value={formData.business_phone_number}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Email</label>
        <input
          type="email"
          name="business_email"
          value={formData.business_email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Street Address</label>
        <input
          type="text"
          name="business_street_address"
          value={formData.business_street_address}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business City</label>
        <input
          type="text"
          name="business_city"
          value={formData.business_city}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business State</label>
        <select
          name="business_state"
          value={formData.business_state}
          onChange={handleChange}
          required
          style={selectStyle}
        >
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Zip Code</label>
        <input
          type="text"
          name="business_zip_code"
          value={formData.business_zip_code}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Country</label>
        <select
          name="business_country"
          value={formData.business_country}
          onChange={handleChange}
          required
          style={selectStyle}
        >
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Categories</label>
        {categoriesList.map((category) => (
          <div key={category} style={{ marginBottom: '5px' }}>
            <input
              type="checkbox"
              name="business_category"
              value={category}
              onChange={handleCategoryChange}
              style={{ marginRight: '10px' }}
            />
            <label>{category}</label>
          </div>
        ))}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" style={buttonStyle}>Register Business</button>
    </form>
  );
};

export default RegisterBusiness;




