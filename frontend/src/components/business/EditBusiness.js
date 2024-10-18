import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import states from '../States';
import countries from '../Countries';
import categoriesList from '../Categories';

const EditBusiness = () => {
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
  const { id } = useParams();

  useEffect(() => {
    const fetchBusiness = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/businesses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setFormData({
          business_name: data.business_name || '',
          business_description: data.business_description || '',
          business_phone_number: data.business_phone_number || '',
          business_email: data.business_email || '',
          business_street_address: data.business_street_address || '',
          business_city: data.business_city || '',
          business_state: data.business_state || '',
          business_zip_code: data.business_zip_code || '',
          business_country: data.business_country || '',
          business_category: data.business_category || [],
        });
      } catch (error) {
        console.error('Error fetching business:', error);
        navigate('/');
      }
    };
    fetchBusiness();
  }, [id, navigate]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/businesses/update-business/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/my-businesses');
    } catch (error) {
      setError(error.response ? error.response.data.error : 'Error updating business');
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
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
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

  const errorMessageStyle = {
    color: 'red',
    textAlign: 'center',
  };

  return (
    <form onSubmit={handleUpdate} style={containerStyle}>
      <h2 style={headingStyle}>Edit Business</h2>
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
        <textarea
          name="business_description"
          value={formData.business_description}
          onChange={handleChange}
          required
          style={textareaStyle}
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
          <option value="">Select a state/province</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
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
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Business Categories</label>
        {categoriesList.map((category) => (
          <div key={category}>
            <input
              type="checkbox"
              name="business_category"
              value={category}
              checked={formData.business_category.includes(category)}
              onChange={handleCategoryChange}
            />
            <label>{category}</label>
          </div>
        ))}
      </div>
      {error && <p style={errorMessageStyle}>{error}</p>}
      <button type="submit" style={buttonStyle}>Update Business</button>
    </form>
  );
};

export default EditBusiness;



