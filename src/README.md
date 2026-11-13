
# RAWAT — Sistem Pelaporan Masalah Fasilitas Publik

## 1. Deskripsi Aplikasi

**RAWAT** merupakan aplikasi berbasis web yang memungkinkan warga melaporkan permasalahan fasilitas dan ruang publik, memantau perkembangan laporan, serta berpartisipasi melalui fitur upvote.

Sistem menyediakan dua peran pengguna:

- **Warga:** Membuat laporan, melihat dan mencari laporan, memberikan upvote, mengelola laporan milik sendiri, serta mengelola profil.
- **Admin:** Memeriksa validitas laporan, mengubah status penanganan, memberikan tanggapan, dan memantau laporan yang ditangani.

## 2. Teknologi yang Digunakan

| Komponen | Teknologi | Versi |
|---|---|---|
| Bahasa Backend | JavaScript (Node.js) | Sesuaikan dengan `node -v` |
| Framework Backend | Express.js | Lihat `backend/package.json` |
| Bahasa Frontend | JavaScript (JSX) | ECMAScript |
| Framework Frontend | React | Lihat `frontend/package.json` |
| Build Tool Frontend | Vite | Lihat `frontend/package.json` |
| Basis Data | PostgreSQL | Sesuaikan dengan instalasi |
| Database Driver | node-postgres (`pg`) | Lihat `backend/package.json` |
| Autentikasi | express-session | Lihat `backend/package.json` |
| Penyimpanan Session | connect-pg-simple | Lihat `backend/package.json` |
| Password Hashing | bcrypt | Lihat `backend/package.json` |
| Pengujian Backend | Node.js Test Runner (`node:test`) | Mengikuti versi Node.js |

Aplikasi menggunakan arsitektur **client-server** dan menerapkan pola **Model-View-Controller (MVC)** pada backend.

## 3. Prasyarat dan Instalasi

Pastikan perangkat telah memiliki:

1. Node.js dan npm.
2. PostgreSQL.
3. pgAdmin 4 (opsional, untuk pengelolaan database).
4. Git.
5. Browser modern.

### 3.1 Clone Repository

```bash
git clone https://github.com/ajalku/IF2150-RPL-K01-G01.git
cd IF2150-RPL-K01-G01/src
```

### 3.2 Instalasi Backend

```bash
cd backend
npm install
```

### 3.3 Instalasi Frontend

Buka terminal baru dari direktori `src`:

```bash
cd frontend
npm install
```

## 4. Konfigurasi Aplikasi

### 4.1 Membuat Database PostgreSQL

1. Jalankan PostgreSQL.
2. Buka pgAdmin 4.
3. Buat database baru, misalnya `rawat`.
4. Buka Query Tool pada database tersebut.
5. Jalankan file SQL pada folder `backend/db` sesuai urutan berikut.

| Urutan | File SQL | Fungsi |
|---|---|---|
| 1 | `schema.sql` | Membuat tabel `pengguna` |
| 2 | `schema_laporan.sql` | Membuat tabel `laporan` dan `lokasi` |
| 3 | `migration_tanggapan.sql` | Membuat tabel `tanggapan` |
| 4 | `migration_tanggapan_id_admin.sql` | Menambahkan relasi Admin pada tanggapan |
| 5 | `migration_upvote.sql` | Membuat tabel `upvote` |
| 6 | `migration_tutorial.sql` | Menambahkan atribut status tutorial |
| 7 | `schema_sessions.sql` | Membuat tabel penyimpanan session |
| 8 | `migration_index_urgensi.sql` | Menambahkan indeks untuk optimasi sorting urgensi |

### 4.2 Konfigurasi Environment Variable

Buat file `.env` pada direktori `backend`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ISI_PASSWORD_POSTGRES
DB_NAME=rawat

SESSION_SECRET=GANTI_DENGAN_SECRET_ACAK_YANG_KUAT
```

Sesuaikan kredensial PostgreSQL dengan konfigurasi lokal.

Untuk membuat akun Admin pengujian, tambahkan:

```env
ADMIN_NAME=Admin RAWAT
ADMIN_NIK=3273010101010001
ADMIN_EMAIL=admin@example.test
ADMIN_PASSWORD=AdminRawat123!
ADMIN_PHONE=081234567890
```

### 4.3 Membuat Akun Admin Awal

Setelah database dan tabel `pengguna` tersedia, jalankan perintah berikut dari direktori `backend`:

```bash
node scripts/seedAdmin.js
```

Script akan memeriksa keberadaan akun berdasarkan email sebelum membuat akun Admin baru.

Akun yang dibuat mempunyai role `admin`.


## 5. Cara Menjalankan Aplikasi

### 5.1 Menjalankan Backend

Pastikan PostgreSQL aktif.

Buka terminal dari direktori `src/backend`:

```bash
npm run dev
```

Backend menggunakan konfigurasi database pada `.env`.

### 5.2 Menjalankan Frontend

Buka terminal lain dari direktori `src/frontend`:

```bash
npm run dev
```

Buka URL yang ditampilkan Vite pada terminal, biasanya:

```text
http://localhost:5173
```

### 5.3 Menjalankan Pengujian Backend

(instruksi lebih lengkap ada di folder test untuk masing-masing fitur beserta hasilnya)

## 6. Akun dan Data Uji

### 6.1 Akun Warga

Akun Warga dapat dibuat melalui halaman Registrasi aplikasi.

### 6.2 Akun Admin

Akun Admin disiapkan menggunakan `seedAdmin.js`.

| Field | Nilai contoh |
|---|---|
| Email | admin@example.test |
| Password | AdminRawat123! |
| Role | admin |

Kredensial tersebut berlaku apabila konfigurasi `.env` menggunakan nilai contoh dan script seed berhasil dijalankan.

### 6.3 Data Laporan Pengujian

Untuk menguji fitur laporan:

1. Login sebagai Warga.
2. Buat laporan baru menggunakan formulir.
3. Isi informasi permasalahan dan lokasi.
4. Simpan laporan.
5. Login sebagai Admin untuk menguji pemeriksaan dan penanganan laporan.

Data laporan disimpan pada tabel `laporan` dan `lokasi`.

## 7. Modul dan Fitur yang Diimplementasikan

| Modul | Fitur | Penanggung Jawab |
|---|---|---|
| Akun | Registrasi, Login, Logout, Session, Profil | [Samantha Michelle S. Silaban] |
| Tutorial | Panduan penggunaan aplikasi | [Aufa Tatsbita Zahra] |
| Laporan | Membuat, melihat detail, mencari, memfilter, dan mengurutkan laporan | [Ravinka Fathia Adinegara] |
| Lokasi + peta| Menyimpan lokasi laporan dan menampilkan peta | [Ghiffari Arya Adhitya + Ravinka Fathia Adinegara] |
| Pemeriksaan Laporan | Validasi laporan oleh Admin, Memperbarui status dan memberikan tanggapan | [Syakira Azzahra Rachmania] |
| Upvote | Memberikan dukungan pada laporan | [Aufa Tatsbita Zahra] |
| Homepage | Menampilkan daftar laporan, sorting, filtering, dan pagination | [Aufa Tatsbita Zahra] |

## 8. Struktur Basis Data

Basis data menggunakan PostgreSQL dengan tabel berikut.

### 8.1 Tabel `pengguna`

Menyimpan informasi akun Warga dan Admin.

| Atribut | Tipe Data | Keterangan |
|---|---|---|
| `id_pengguna` | UUID | Primary Key |
| `nama` | VARCHAR(100) | Nama pengguna |
| `nik` | VARCHAR(16) | NIK unik |
| `email` | VARCHAR(255) | Email unik |
| `hash_password` | VARCHAR(255) | Password terenkripsi dengan hash |
| `no_telp` | VARCHAR(20) | Nomor telepon |
| `role` | VARCHAR(20) | `warga` atau `admin` |
| `status_izin` | VARCHAR(20) | Status izin lokasi |
| `status_tutorial` | BOOLEAN | Status tutorial |
| `latitude` | DOUBLE PRECISION | Koordinat pengguna |
| `longitude` | DOUBLE PRECISION | Koordinat pengguna |

### 8.2 Tabel `laporan`

Menyimpan informasi laporan permasalahan.

Atribut:

`id_laporan`, `id_pengguna`, `nama_masalah`, `kategori`, `tingkat_permasalahan`, `status_privasi`, `foto`, `deskripsi`, `status_laporan`, `status_validasi`, `catatan_pemeriksaan`, `bobot_urgensi`, `jumlah_upvote`, `skor_populer`, `batas_waktu`, `waktu_lapor`, `waktu_diperbarui`.

- Primary Key: `id_laporan`
- Foreign Key: `id_pengguna` → `pengguna.id_pengguna`

### 8.3 Tabel `lokasi`

Menyimpan lokasi geografis laporan.

Atribut:

`id_lokasi`, `id_laporan`, `latitude`, `longitude`, `alamat`.

- Primary Key: `id_lokasi`
- Foreign Key: `id_laporan` → `laporan.id_laporan`

### 8.4 Tabel `tanggapan`

Menyimpan tanggapan terhadap laporan.

Atribut:

`id_tanggapan`, `id_laporan`, `id_admin`, `status_tanggapan`, `waktu_tanggapan`, `deskripsi_tanggapan`.

- Primary Key: `id_tanggapan`
- Foreign Key: `id_laporan` → `laporan.id_laporan`
- Foreign Key: `id_admin` → `pengguna.id_pengguna`

### 8.5 Tabel `upvote`

Menyimpan dukungan pengguna pada laporan.

Atribut:

`id_pengguna`, `id_laporan`, `waktu_upvote`, `status_upvote`.

- Composite Primary Key: (`id_pengguna`, `id_laporan`)
- Foreign Key: `id_pengguna` → `pengguna.id_pengguna`
- Foreign Key: `id_laporan` → `laporan.id_laporan`

### 8.6 Tabel `user_sessions`

Menyimpan data session autentikasi.

| Atribut | Tipe Data | Keterangan |
|---|---|---|
| `sid` | VARCHAR | Primary Key |
| `sess` | JSON | Data session |
| `expire` | TIMESTAMP | Waktu kedaluwarsa |



Definisi lengkap tabel, constraint, dan migration dapat dilihat pada folder:

`backend/db/`

## 9. Catatan Pengujian

1. Database dan seluruh tabel yang diperlukan harus tersedia sebelum pengujian integrasi.
2. Fitur yang membutuhkan autentikasi harus diuji menggunakan role yang sesuai.
3. Akun Warga dapat dibuat melalui Registrasi, sedangkan akun Admin dapat dibuat menggunakan `seedAdmin.js`.
4. Pengujian yang menghapus akun sebaiknya menggunakan akun khusus testing.
5. Pengujian performa dilakukan menggunakan Chrome DevTools dan PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)`.
