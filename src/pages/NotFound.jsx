// src/pages/NotFound.jsx
// Halaman 404 — tampil saat route tidak ditemukan.

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '5rem' }}>🔍</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>404 — Halaman Tidak Ditemukan</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        Halaman yang Anda cari tidak tersedia.
      </p>
      <Link to="/admin" className="btn btn-primary">
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}

