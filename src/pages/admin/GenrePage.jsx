// src/pages/admin/GenrePage.jsx
// Halaman admin untuk READ dan CREATE Genre.
// Pola: useEffect + useState untuk fetch, form terpisah dengan validasi.

import { useState, useEffect } from 'react';
import { getGenres, createGenre } from '../../services/genreService';

export default function GenrePage() {
  // ===== STATE =====
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // State form
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  // Validasi error per field (untuk error 422 dari server)
  const [fieldErrors, setFieldErrors] = useState({});

  // ===== FETCH DATA =====
  const fetchGenres = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getGenres();
      setGenres(data ?? []);
    } catch (err) {
      // Tampilkan pesan error yang informatif
      if (err.response) {
        setFetchError(`Server error ${err.response.status}: ${err.response.data?.message || 'Terjadi kesalahan pada server.'}`);
      } else if (err.request) {
        setFetchError('Tidak dapat terhubung ke server. Periksa koneksi internet atau coba lagi nanti.');
      } else {
        setFetchError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchGenres();
  }, []);

  // ===== FORM HANDLERS =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus error field saat pengguna mulai mengetik
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validasi form sederhana di sisi klien
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Nama genre tidak boleh kosong.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);
    setFieldErrors({});

    // Validasi klien
    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      await createGenre({ name: formData.name.trim() });
      setSubmitSuccess(`Genre "${formData.name.trim()}" berhasil ditambahkan!`);
      // Reset form setelah sukses
      setFormData({ name: '' });
      // Refresh daftar genre tanpa reload halaman
      await fetchGenres();
    } catch (err) {
      if (err.response?.status === 422) {
        // Error validasi dari server — tampilkan di dekat field
        const serverErrors = err.response.data?.errors || {};
        setFieldErrors(serverErrors);
        setSubmitError('Periksa kembali data yang Anda masukkan.');
      } else if (err.response?.status === 401) {
        setSubmitError('Aksi ini memerlukan autentikasi. Silakan hubungi administrator.');
      } else if (err.response) {
        setSubmitError(`Gagal menyimpan: ${err.response.data?.message || 'Terjadi kesalahan server.'}`);
      } else if (err.request) {
        setSubmitError('Tidak dapat terhubung ke server. Periksa koneksi internet.');
      } else {
        setSubmitError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '' });
    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // ===== RENDER =====
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manajemen Genre</h1>
          <p>Tambah dan lihat daftar genre buku</p>
        </div>
      </div>

      {/* ===== FORM TAMBAH GENRE ===== */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-icon">➕</div>
          <h2>Tambah Genre Baru</h2>
        </div>
        <div className="card-body">
          {/* Pesan sukses */}
          {submitSuccess && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>{submitSuccess}</span>
            </div>
          )}

          {/* Pesan error global submit */}
          {submitError && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="genre-name" className="form-label">
                  Nama Genre <span className="required">*</span>
                </label>
                <input
                  id="genre-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Fiksi, Thriller, Sejarah..."
                  className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                  disabled={submitting}
                  maxLength={100}
                />
                {/* Error validasi field name */}
                {fieldErrors.name && (
                  <span className="field-error">
                    {Array.isArray(fieldErrors.name)
                      ? fieldErrors.name[0]
                      : fieldErrors.name}
                  </span>
                )}
              </div>
            </div>

            <div className="form-actions">
              {/* Tombol dinonaktifkan saat sedang submit — cegah double submit */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Menyimpan...
                  </>
                ) : (
                  <>➕ Tambah Genre</>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={submitting}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== TABEL DAFTAR GENRE ===== */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">🏷️</div>
          <h2>Daftar Genre</h2>
        </div>

        {/* Error fetch */}
        {fetchError && (
          <div style={{ padding: '0 1.5rem' }}>
            <div className="alert alert-error" style={{ margin: '1rem 0' }}>
              <span className="alert-icon">⚠️</span>
              <div>
                <strong>Gagal memuat data</strong>
                <p style={{ marginTop: '0.25rem' }}>{fetchError}</p>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.375rem 0.75rem' }}
                  onClick={fetchGenres}
                >
                  🔄 Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner" />
            <span>Memuat data genre...</span>
          </div>
        )}

        {/* Tabel data */}
        {!loading && !fetchError && (
          <div className="table-wrapper">
            {genres.length === 0 ? (
              /* Empty state */
              <div className="empty-state">
                <div className="empty-state-icon">🏷️</div>
                <h3>Belum ada data genre</h3>
                <p>Gunakan form di atas untuk menambahkan genre pertama.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Nama Genre</th>
                    <th style={{ width: '120px' }}>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {genres.map((genre, index) => (
                    /* Gunakan genre.id sebagai key yang stabil */
                    <tr key={genre.id}>
                      <td className="table-row-number">{index + 1}</td>
                      <td>
                        <span className="badge badge-primary">{genre.name}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        #{genre.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

