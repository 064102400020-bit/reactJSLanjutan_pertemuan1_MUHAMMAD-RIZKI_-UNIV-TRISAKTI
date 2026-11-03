// src/layouts/AdminLayout.jsx
// Layout utama admin: sidebar + topbar + area konten.
// Sidebar responsive — bisa dibuka/tutup di mobile.

import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

// Konfigurasi menu navigasi sidebar
const NAV_ITEMS = [
  { to: '/admin', icon: '🏠', label: 'Dashboard', end: true },
  { to: '/admin/genres', icon: '🏷️', label: 'Genre' },
  { to: '/admin/authors', icon: '✍️', label: 'Author' },
];

// Peta judul halaman berdasarkan pathname
const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/genres': 'Manajemen Genre',
  '/admin/authors': 'Manajemen Author',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin Panel';

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Overlay gelap saat sidebar terbuka di mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h2>📚 BookAdmin</h2>
          <span>Panel Administrasi</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Menu Utama</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ===== KONTEN UTAMA ===== */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Tombol hamburger hanya tampil di mobile */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <span className="topbar-title">{pageTitle}</span>
          </div>

          <div className="topbar-user">
            <span>Admin</span>
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        {/* Konten halaman (dirender dari route anak) */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

