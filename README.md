# Tugas React JS Lanjutan #1 - Admin Panel Genre & Author

**Nama:** Muhammad Rizki  
**Instansi:** Universitas Trisakti  

---

## 📌 Deskripsi Proyek
Proyek frontend React JS ini mengimplementasikan fitur **READ** dan **CREATE** untuk data **Genre** dan **Author** pada panel administrasi (**Admin**). Dibangun menggunakan **Vite**, **React 19**, **React Router v7**, dan **Axios**.

### Fitur Utama:
- **Admin Dashboard Layout**: Sidebar navigasi, topbar dinamis, dan mobile-responsive drawer.
- **Manajemen Genre**:
  - READ: Menampilkan daftar genre dalam tabel data.
  - CREATE: Form penambahan genre dengan validasi client-side & server-side, pencegahan double submit, reset form otomatis, dan re-fetch data tanpa reload halaman.
- **Manajemen Author**:
  - READ: Menampilkan daftar nama dan bio penulis.
  - CREATE: Form input 2 kolom untuk nama lengkap dan biografi.
- **Feedback & Error Handling**: Loading spinner, alert error/sukses terintegrasi, dan pesan validasi field.

---

## 🚀 Cara Menjalankan Proyek

1. **Clone repository:**
   ```bash
   git clone https://github.com/064102400020-bit/reactJSLanjutan_pertemuan1_MUHAMMAD-RIZKI_-UNIV-TRISAKTI.git
   cd reactJSLanjutan_pertemuan1_MUHAMMAD-RIZKI_-UNIV-TRISAKTI
   ```

2. **Setup Environment:**
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173/` di browser Anda.

---

## 📁 Struktur Kode
- `src/api/axios.js`: Konfigurasi Axios instance terpusat dengan `VITE_API_BASE_URL`.
- `src/services/`: File service per entitas (`genreService.js` dan `authorService.js`).
- `src/layouts/AdminLayout.jsx`: Layout panel admin dengan navigasi sidebar.
- `src/pages/admin/`: Komponen halaman `GenrePage.jsx`, `AuthorPage.jsx`, dan `Dashboard.jsx`.
- `src/index.css`: Styling kustom modern dan responsif.
