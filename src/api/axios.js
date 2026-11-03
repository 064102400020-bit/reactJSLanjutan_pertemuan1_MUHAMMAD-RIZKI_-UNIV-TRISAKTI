// src/api/axios.js
// Konfigurasi instance axios terpusat.
// Base URL dibaca dari environment variable VITE_API_BASE_URL.

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000, // 15 detik timeout
});

export default apiClient;

