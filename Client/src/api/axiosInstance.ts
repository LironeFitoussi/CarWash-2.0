// src/utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001', // Vite or process.env.API_URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;
