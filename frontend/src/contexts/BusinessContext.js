import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const BusinessContext = createContext();

export const useBusiness = () => {
  return useContext(BusinessContext);
};

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [inactiveBusinesses, setInactiveBusinesses] = useState([]);

  const fetchBusinesses = async () => {
    const token = localStorage.getItem('token');
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

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <BusinessContext.Provider value={{ businesses, inactiveBusinesses, fetchBusinesses }}>
      {children}
    </BusinessContext.Provider>
  );
};













