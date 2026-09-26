import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For sending cookies
});

// Interceptor to add auth token if stored in local storage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling errors globally (like 401 unauthorized)
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., clear store, redirect to login)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Don't reload if we're already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || new Error(error.message));
  }
);

export default axiosClient;
