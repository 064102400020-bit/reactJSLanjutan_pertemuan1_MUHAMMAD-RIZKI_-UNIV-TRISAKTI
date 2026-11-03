// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import GenrePage from './pages/admin/GenrePage';
import AuthorPage from './pages/admin/AuthorPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL langsung ke /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Layout Admin dengan child routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="genres" element={<GenrePage />} />
          <Route path="authors" element={<AuthorPage />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
