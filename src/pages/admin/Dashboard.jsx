// src/pages/admin/Dashboard.jsx
// Halaman dashboard admin — ringkasan dan selamat datang.

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Selamat datang di panel administrasi BookAdmin</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">🏷️</div>
          <div className="stat-card-label">Genre</div>
          <div className="stat-card-value">—</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✍️</div>
          <div className="stat-card-label">Author</div>
          <div className="stat-card-value">—</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Gunakan menu di sidebar untuk mengelola data <strong>Genre</strong> dan <strong>Author</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

