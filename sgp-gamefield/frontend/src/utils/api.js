import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto-inject token if available in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agriquest_token');
  if (token) {
    config.headers['x-auth-token'] = token;
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
