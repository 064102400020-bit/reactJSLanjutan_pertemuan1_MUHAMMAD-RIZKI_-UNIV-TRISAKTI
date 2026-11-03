// src/services/genreService.js
// Semua fungsi pemanggilan API terkait Genre.

import apiClient from '../api/axios';

/**
 * Ambil semua genre dari server.
 * @returns {Promise<Array>} Array objek genre
 */
export const getGenres = async () => {
  const response = await apiClient.get('/genres');
  // Tangani kedua format: array langsung atau { data: [...] }
  return Array.isArray(response.data) ? response.data : response.data.data;
};

/**
 * Tambah genre baru.
 * @param {{ name: string }} genreData - Data genre yang akan dikirim
 * @returns {Promise<Object>} Objek genre yang baru dibuat
 */
export const createGenre = async (genreData) => {
  const response = await apiClient.post('/genres', genreData);
  return response.data;
};

