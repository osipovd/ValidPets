import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import states from './States';
import categories from './Categories';

const Home = () => {
  const [term, setTerm] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    try {
      const response = await axios.get('http://localhost:5000/api/businesses/search', {
        params: {
          term: term || '',
          city: city || '',
          state: state || '',
          category: category || ''
        }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching businesses:', error.response ? error.response.data : error.message);
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

  const headerStyle = {
    textAlign: 'center',
    color: '#3b5998',
    marginBottom: '20px',
  };

  const formGroupStyle = {
    marginBottom: '15px',
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

  const resultsHeaderStyle = {
    textAlign: 'center',
    color: '#333',
    marginTop: '20px',
  };

  const resultItemStyle = {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
  };

  const centeredTextStyle = {
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2>Search for Businesses</h2>
      </div>
      <form onSubmit={handleSearch}>
        <div style={formGroupStyle}>
          <input
            type="text"
            placeholder="Search term..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <input
            type="text"
            placeholder="City..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <select value={state} onChange={(e) => setState(e.target.value)} style={inputStyle}>
            <option value="">State...</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div style={formGroupStyle}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="">Category...</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={buttonStyle}>Search</button>
      </form>
      <div style={resultsHeaderStyle}>
        <h3>Search Results</h3>
      </div>
      <div>
        {!hasSearched ? (
          <p style={centeredTextStyle}>Start your search to find businesses.</p>
        ) : results.length > 0 ? (
          results.map((business) => (
            <div key={business.id} style={resultItemStyle}>
              <h4><Link to={`/business/${business.id}`}>{business.business_name}</Link></h4>
              <p>{business.business_description}</p>
              <p>{business.business_city}, {business.business_state}</p>
            </div>
          ))
        ) : (
          <p style={centeredTextStyle}>No businesses found</p>
        )}
      </div>
    </div>
  );
};

export default Home;

