/**
 * API Service - Axios configuration and interceptors
 * Central HTTP client configuration for all API calls
 */
import axios from 'axios';
import { getStoredToken, removeStoredToken } from '../utils/storage';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      removeStoredToken();
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      // Show unauthorized message
      console.error('Access forbidden');
    }
    
    // Handle 500+ - Server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;