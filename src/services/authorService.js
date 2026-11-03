// src/services/authorService.js
// Semua fungsi pemanggilan API terkait Author.

import apiClient from '../api/axios';

/**
 * Ambil semua author dari server.
 * @returns {Promise<Array>} Array objek author
 */
export const getAuthors = async () => {
  const response = await apiClient.get('/authors');
  // Tangani kedua format: array langsung atau { data: [...] }
  return Array.isArray(response.data) ? response.data : response.data.data;
};

/**
 * Tambah author baru.
 * @param {{ name: string, bio: string }} authorData - Data author yang akan dikirim
 * @returns {Promise<Object>} Objek author yang baru dibuat
 */
export const createAuthor = async (authorData) => {
  const response = await apiClient.post('/authors', authorData);
  return response.data;
};

