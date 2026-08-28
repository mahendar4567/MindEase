import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
  return `http://${hostname}:5000`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // CRITICAL: send and receive HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
