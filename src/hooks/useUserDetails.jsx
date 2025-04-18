// src/hooks/useUserDetails.jsx

import { useState, useEffect } from 'react';
import API from '../services/interceptor';

const useUserDetails = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try { 
        const response = await API.get(`/api/users/details/${userId}`);
        const formattedData = {
          ...response.data,
          dateOfBirth: response.data.dateOfBirth
            ? new Date(response.data.dateOfBirth).toISOString().split('T')[0]
            : '',
        };
        setData(formattedData);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Update user details
  const updateData = async (updatedData) => {
    try {
      const response = await API.put(`/api/users/details/${userId}`, updatedData);
      setData(updatedData);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { data, loading, error, updateData };
};

export default useUserDetails;
