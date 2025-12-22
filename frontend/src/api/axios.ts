import axios from 'axios';

// 1. Create a preset version of axios with your backend URL
const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Before any request leaves the browser, this function checks if we have a token.
// If we do, it pins it to the request header so the server knows who we are.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;