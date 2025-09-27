/**
 * useAPI - Custom hook for API calls with Axios
 * Provides loading, data, and error states for API requests
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic API request function
  const request = useCallback(async (config) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api(config);
      
      return {
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      const errorStatus = err.response?.status || 500;
      
      setError({
        message: errorMessage,
        status: errorStatus,
        details: err.response?.data || null
      });
      
      return {
        success: false,
        error: errorMessage,
        status: errorStatus,
        details: err.response?.data || null
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // GET request
  const get = useCallback((url, config = {}) => {
    return request({
      method: 'GET',
      url,
      ...config
    });
  }, [request]);

  // POST request
  const post = useCallback((url, data, config = {}) => {
    return request({
      method: 'POST',
      url,
      data,
      ...config
    });
  }, [request]);

  // PUT request
  const put = useCallback((url, data, config = {}) => {
    return request({
      method: 'PUT',
      url,
      data,
      ...config
    });
  }, [request]);

  // PATCH request
  const patch = useCallback((url, data, config = {}) => {
    return request({
      method: 'PATCH',
      url,
      data,
      ...config
    });
  }, [request]);

  // DELETE request
  const del = useCallback((url, config = {}) => {
    return request({
      method: 'DELETE',
      url,
      ...config
    });
  }, [request]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError
  };
};

// Hook for a single API resource with data state
export const useAPIResource = (initialFetch) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (config) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api(config);
      setData(response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch data
  const refetch = useCallback(() => {
    if (initialFetch) {
      return fetchData(initialFetch);
    }
  }, [fetchData, initialFetch]);

  // Clear data
  const clearData = useCallback(() => {
    setData(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    if (initialFetch) {
      fetchData(initialFetch);
    }
  }, [fetchData, initialFetch]);

  return {
    data,
    loading,
    error,
    fetchData,
    refetch,
    clearData,
    clearError,
    setData
  };
};

export default useAPI;