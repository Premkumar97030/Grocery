import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for attaching Authorization Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('freshcart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local storage
      if (localStorage.getItem('freshcart_token')) {
        localStorage.removeItem('freshcart_token');
        localStorage.removeItem('freshcart_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
