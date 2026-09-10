import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000, // 3 segundos antes de fallback
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
