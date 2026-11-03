// src/pages/admin/AuthorPage.jsx
// Halaman admin untuk READ dan CREATE Author.
// Pola sama dengan GenrePage: useEffect + useState untuk fetch, form terpisah.

import { useState, useEffect } from 'react';
import { getAuthors, createAuthor } from '../../services/authorService';

export default function AuthorPage() {
  // ===== STATE =====
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // State form — author memiliki dua field: name dan bio
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  // Validasi error per field (untuk error 422 dari server)
  const [fieldErrors, setFieldErrors] = useState({});

  // ===== FETCH DATA =====
  const fetchAuthors = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAuthors();
      setAuthors(data ?? []);
    } catch (err) {
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
    fetchAuthors();
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
      errors.name = 'Nama author tidak boleh kosong.';
    }
    // bio bersifat opsional — tidak divalidasi wajib
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
      await createAuthor({
        name: formData.name.trim(),
        bio: formData.bio.trim() || undefined, // kirim undefined jika kosong
      });
      setSubmitSuccess(`Author "${formData.name.trim()}" berhasil ditambahkan!`);
      // Reset form setelah sukses
      setFormData({ name: '', bio: '' });
      // Refresh daftar author tanpa reload halaman
      await fetchAuthors();
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
    setFormData({ name: '', bio: '' });
    setFieldErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // ===== RENDER =====
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manajemen Author</h1>
          <p>Tambah dan lihat daftar penulis buku</p>
        </div>
      </div>

      {/* ===== FORM TAMBAH AUTHOR ===== */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-icon">➕</div>
          <h2>Tambah Author Baru</h2>
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
            <div className="form-grid two-col">
              {/* Field Nama */}
              <div className="form-group">
                <label htmlFor="author-name" className="form-label">
                  Nama Author <span className="required">*</span>
                </label>
                <input
                  id="author-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap penulis..."
                  className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                  disabled={submitting}
                  maxLength={150}
                />
                {fieldErrors.name && (
                  <span className="field-error">
                    {Array.isArray(fieldErrors.name)
                      ? fieldErrors.name[0]
                      : fieldErrors.name}
                  </span>
                )}
              </div>

              {/* Placeholder kolom kanan untuk layout dua kolom */}
              <div />

              {/* Field Bio — full width */}
              <div className="form-group full-width">
                <label htmlFor="author-bio" className="form-label">
                  Bio / Deskripsi
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>
                    (opsional)
                  </span>
                </label>
                <textarea
                  id="author-bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tulis biografi singkat penulis..."
                  className={`form-textarea ${fieldErrors.bio ? 'error' : ''}`}
                  disabled={submitting}
                  rows={3}
                />
                {fieldErrors.bio && (
                  <span className="field-error">
                    {Array.isArray(fieldErrors.bio)
                      ? fieldErrors.bio[0]
                      : fieldErrors.bio}
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
                  <>➕ Tambah Author</>
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

      {/* ===== TABEL DAFTAR AUTHOR ===== */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">✍️</div>
          <h2>Daftar Author</h2>
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
                  onClick={fetchAuthors}
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
            <span>Memuat data author...</span>
          </div>
        )}

        {/* Tabel data */}
        {!loading && !fetchError && (
          <div className="table-wrapper">
            {authors.length === 0 ? (
              /* Empty state */
              <div className="empty-state">
                <div className="empty-state-icon">✍️</div>
                <h3>Belum ada data author</h3>
                <p>Gunakan form di atas untuk menambahkan author pertama.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Nama Author</th>
                    <th>Bio</th>
                    <th style={{ width: '120px' }}>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author, index) => (
                    /* Gunakan author.id sebagai key yang stabil */
                    <tr key={author.id}>
                      <td className="table-row-number">{index + 1}</td>
                      <td>
                        <strong>{author.name}</strong>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {author.bio
                          ? author.bio.length > 80
                            ? `${author.bio.slice(0, 80)}...`
                            : author.bio
                          : <em>—</em>}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        #{author.id}
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

