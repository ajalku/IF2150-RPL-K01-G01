<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## *RAWAT (Ruang Aspirasi Warga dan Aduan Terpadu)*
<p align="left">
  <img src="././assets/logo_placeholder.png" width="20%">
</p>

### Untuk: *Agatha Tatianingseto*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K01* |
| Kelompok | *G01*  |

| NIM | Nama |
| --- | --- |
| *13525103* | *Ravinka Fathia Adinegara* |
| *13525013* | *Samantha Michelle S Silaban* |
| *13525055* | *Syakira Azzahra Rachmania* |
| *13525043* | *Aufa Tatsbita Zahra* |
| *13525046* | *Ghiffari Arya Adhitya* |
---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen ini ditulis untuk pengguna serta untuk pengembang sebagai laporan hasil perangkat lunak yang telah diuji. Pengujian dilakukan untuk mengetahui apakah implementasi perangkat lunak telah memenuhi dokumen-dokumen acuannya seperti SKPL, APL, dan DPPL. Sebagai laporan, dokumen ini memastikan apakah perangkat lunak mampu bekerja sesuai harapan, apakah perangkat lunak telah bekerja secara efektif, apakah sistem berfungsi dengan baik, baik secara fungsional maupun nonfungsional, serta apakah perangkat lunak dapat berjalan sebagaimana semestinya.

## 1.2 Lingkup Masalah
Guna membangun kota yang berkelanjutan, fasilitas publik yang aman dan universal menjadi instrumen utama yang tercantum pada Indikator SDG 11.7.1. Namun, pada kenyataannya fasilitas publik justru memiliki banyak catatan yang harus diperbaiki. Mulai dari infrastruktur layanan publik yang terbengkalai, akses jalan yang tidak ramah pejalan kaki, hingga maraknya aksi vandalisme. Sudah banyak metode untuk melaporkan fasilitas publik yang rusak, namun masih berjalan satu arah. Oleh karena itu, website RAWAT (Ruang Aspirasi Warga dan Aduan Terpadu) hadir untuk memfasilitasi sistem pelaporan yang lebih modern dan interaktif. Website ini diharapkan dapat meningkatkan _awareness_ masyarakat tentang kondisi fasilitas dan berkolaborasi dalam permintaan perbaikan fasilitas publik. Melalui fitur-fitur interaktif selayaknya media sosial, warga tidak hanya dapat menyampaikan laporan tetapi juga saling memvalidasi laporan, memberikan tanggapan, dan membangun kepedulian bersama terhadap fasilitas publik.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, dan antarmuka P/L.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *TC* | *Singkatan dari Test Case, yaitu satu kasus uji untuk skenario tertentu.* |
| *UT* | *Singkatan dari Unit Test, yaitu test case tingkat kelas/operasi.* |
| *INT* | *Singkatan dari Integration Test, yaitu test case yang menguji interaksi antarkomponen.* |
| *Boundary* | *Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya (SKPL, APL, DPPL), kecuali untuk ID pengujian yang baru diperkenalkan pada dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Sesuai SKPL* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Sesuai SKPL* |
| *Use Case* | *UCXX* | *Sesuai SKPL* |
| *Kelas* | *CXX* | *Sesuai DPPL* |
| *Antarmuka* | *I-XX* | *Sesuai DPPL* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |
| *...* | *...* | *...* |

## 1.5 Referensi
<!-- Cantumkan daftar buku, panduan, atau dokumentasi lain yang dirujuk dalam pembuatan dokumen dan pengembangan P/L, **minimal dokumen SKPL, APL, DPPL, dan Implementasi (Tugas 9)**. Tambahkan dokumentasi *framework*/*library*/*testing tool* atau referensi lain apabila digunakan. -->
Berikut ini adalah dokumentasi yang dirujuk oleh dokumen ini.
* [SKPL RAWAT](https://github.com/ajalku/IF2150-RPL-K01-G01/blob/main/docs/M5/K01_G01_SKPL.md)
* [APL RAWAT](https://github.com/ajalku/IF2150-RPL-K01-G01/blob/main/docs/M6/K01_G01_APL.md)
* [DPPL1 RAWAT](https://github.com/ajalku/IF2150-RPL-K01-G01/blob/main/docs/M7/K01_G01_DPPL.md)
* [DPPL2 RAWAT](https://github.com/ajalku/IF2150-RPL-K01-G01/blob/main/docs/M8/K01_G01_DPPL2.md)
* [Implementasi RAWAT](https://github.com/ajalku/IF2150-RPL-K01-G01/blob/main/docs/M9/K01_G01_Implementasi.md)

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
<!-- Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut bab demi bab, dengan maksimal 1 paragraf. -->
Dokumen ini terdiri atas 5 bab, yakni Pendahuluan, Deskripsi Umum perangkat Lunak, Implementasi, Hasil Pengujian, dan Traceability. Pada Pendahuluan, terdapat bagian Tujuan Penulisan Dokumen; Lingkup Masalah; Definisi, Istilah, dan Singkatan; Aturan Penomoran; Referensi; serta Deskripsi Umum Dokumen atau Ikhtisar. Bab 2 mencakup gambar dan narasi terkait aplikasi dan konteksnya. Bab 3 yang berisi implementasi berisi lingkungan implementasi, implementasi modul, implementasi antarmuka, dan file lain. Kemudian, bab 4 memiliki berbagai pengujian dari berbagai fungsi dan sudut pandang, seperti strategi dan kedalaman pengujian kelas, pengujian unit kelas, pengujian integrasi, pengujian use case, pengujian KNF, dan tangkapan layar sebagai bukti pengujian. Terakhir, traceability berisi pemetaan KF ke berbagai komponan lainnya.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

<!-- Bagian ini diisi dengan *System Overview*, dalam bentuk gambar dan narasi yang memberikan gambaran tentang aplikasi dan konteksnya. **Batasan dan keterkaitan** antara sistem yang dibangun dengan sistem lain di luarnya harus jelas. Deskripsi umum sistem perlu dilengkapi dengan pemodelan kasus yang dihadapi, seperti *use case diagram*. Berikan narasi yang jelas untuk setiap gambar yang ditampilkan.

Bagian ini dapat menyalin atau meringkas dari dokumen SKPL atau DPPL. -->

*RAWAT* merupakan perangkat lunak berbasis _website_ yang memfasilitasi pelaporan interaktif terkait kondisi dan kerusakan fasilitas atau infrastruktur publik. P/L ini berinteraksi dengan sistem pihak ketiga yaitu *Map API* untuk mendukung fitur lokasi pelaporan. Sistem mengirimkan data alamat yang dicatat ke layanan peta eksternal melalui API, lalu menerima dan memproses hasil tersebut untuk memvisualisasikan titik koordinat lokasi kerusakan pada peta interaktif yang dapat diakses pengguna. Sistem menerima input laporan dari *Pengguna* yang berisi nama masalah, lokasi, tingkat permasalahan, foto, deskripsi, serta data interaksi sosial berupa *upvote*. Seluruh data tersebut kemudian diolah dan dikelola di dalam sistem sehingga *Admin* dapat memantau, melakukan varifikasi laporan, dan memperbarui progres terkait laporan sesuai dengan kondisi lapangan.

Dalam memahami bentuk implementasi dari *RAWAT*, akan ditampilkan diagram use case dari perangkat lunak tersebut. Berikut ini adalah diagram use case yang telah dibuat.

<p align="center">
<img alt="Use Case Diagram" src="./assets/diagram.revisi2.drawio.png" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram RAWAT</i>
</p>

Use case diagram ini menjelaskan bagaimana aktor-aktor di sekeliling RAWAT dapat berinteraksi dengan sistem.  Misalnya, dalam use case di atas, terdapat beberapa fungsi pengguna dan aktor yang beririsan seperti dapat melakukan login, mendapatkan tutorial apabila baru pertama kali masuk aplikasi, serta mengakses peta interaktif dan memeriksa laporan. Selain fungsi yang beririsan, terdapat fungsi yang berbeda, seperti pengguna dapat melakukan pelaporan dan upvote, sementara admin dapat mengubah status laporan atau memberikan tanggapan.

Selain use case diagram, terdapat juga activity diagram yang dapat menjelaskan proses bisnis perangkat lunak. Berikut ini adalah activity diagram yang telah dibuat.

<p align="center">
<img alt="Use Case Diagram" src="./assets/diagram-activity-1-revisi-2.jpg" width="90%">
</p>
<p align="center">
<i>Gambar 2.2. Activity Diagram RAWAT</i>
</p>

Sesuai dengan activity diagram, pengguna dapat berinteraksi secara tidak langsung dengan admin dengan cara melaporkan sesuatu. Dengan melaporkan sesuatu, admin dapat melihat laporan dan menanggapi dengan cara mengubah-ubah status laporan, misalnya ketika laporan sudah dikaji atau sudah diperbaiki sehingga statusnya selesai. Sementara itu, sistem yang berinteraksi langsung dengan pengguna dapat memberikan feedback secara langsung seperti menyimpan laporan ke database serta menaruh laporan terbaru di paling atas.

<br>

---

# BAB 3: Implementasi

<!-- Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada). -->

## 3.1 Lingkungan Implementasi

<!-- Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai. -->

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *Prosesor i7 13700H Yoga* |
| *Operating System* | *Microsoft Windows [Version 10.0.26200.9974]* |
| *Bahasa Pemrograman* | *JavaScript; backend berjalan di Node.js versi v26.13.0* |
| *Framework/Library* | *Backend: Express.js 5.3.0, pg 8.23.1, express-session 1.19.0. Frontend: React 19.3.1, Vite 8.3.5, Leaflet 1.9.4, React-Leaflet 5.0.0.* |
| *DBMS* | *PostgreSQL versi 16.15* |
| *Development Tools* | *Visual Studio Code, Git, Node.js/np* |
| *Testing Tools* | *Node.js Test runner (npm test) di backend and frontend, ESLint (npm run lint), Vite (npm run build), UI manual di browser* |

## 3.2 Implementasi Modul

<!-- Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9). -->

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C01 | Pengguna | `../../src/backend/src/models/Pengguna.js` | - |
| 2 | C02 | Homepage | `../../src/backend/src/src/models/Homepage.js` | - |
| 3 | C03 | Laporan | `../../src/backend/src/src/models/Laporan.js` | - |
| 4 | C04 | Lokasi | `../../src/backend/src/src/models/Lokasi.js` | - |
| 5 | C05 | Upvote | `../../src/backend/src/src/models/Upvote.js` | - |
| 6 | C06 | Tanggapan | `../../src/backend/src/src/models/Tanggapan.js | - |
| 7 | C07 | Tutorial | `../../src/backend/src/src/models/Tutorial.js | - |
| 8 | C08 | PenggunaView | `../../src/frontend/src/view/PenggunaView.jsx` | - |
| 9 | C09 | HomepageView | `../../src/frontend/src/view/HomepageView.jsx` | - |
| 10 | C10 | LaporanView | `../../src/frontend/src/view/LaporanView.jsx` | - |
| 11 | C11 | LokasiView | `../../src/frontend/src/view/LokasiView.jsx` | - |
| 12 | C12 | UpvoteView | `../../src/frontend/src/view/UpvoteView.jsx` | - |
| 13 | C13 | TanggapanView | `../../src/frontend/src/view/TanggapanView.jsx` | - |
| 14 | C14 | TutorialView | `../../src/frontend/src/view/TutorialView.jsx` |
| 15 | C15 | PenggunaController | `../../src/backend/src/controllers/PenggunaController.js` | - |
| 16 | C16 | HomepageController | `../../src/backend/src/controllers/HomepageController.js` | - |
| 17 | C17 | LaporanController | `../../src/backend/src/controllers/LaporanController.js` | - |
| 18 | C18 | LokasiController | `../../src/backend/src/controllers/LokasiController.js` | - |
| 19 | C19 | UpvoteController | `../../src/backend/src/controllers/UpvoteController.js` | - |
| 20 | C20 | TanggapanController | `../../src/backend/src/controllers/TanggapanController.js` | - |
| 21 | C21 | TutorialController | `../../src/backend/src/controllers/TutorialController | - |
| 22 | C22 | MapAPI | `../../src/backend/src/config/mapApi.js` | - |
| 23 | C23 | MapAPIService | `../..src/backend/src/services/MapAPIService.js` | - |
| 24 | C24 | MapAPIView | `../../src/frontend/src/components/PetaLaporan.jsx` | - |
<!-- | 1 | *[C01]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[C02]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* | -->

## 3.3 Implementasi Antarmuka

<!-- Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL. -->

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | I-01 | Login Page | `../../src/frontend/src/view/PenggunaView.jsx` | - |
| 2 | I-02 | Registration Page | `../../src/frontend/src/view/PenggunaView.jsx` | - |
| 3 | I-03 | Homepage | `../../src/frontend/src/view/HomepageView.jsx` | - |
| 4 | I-04 | Page Laporan | `../../src/frontend/src/view/LaporanView.jsx` | - |
| 5 | I-05 | Buat Laporan | `../../src/frontend/src/view/BuatLaporanView.jsx` | - |
| 6 | I-06 | Periksa Laporan | `../../src/frontend/src/view/PeriksaLaporanView.jsx` | - |
| 7 | I-07 | Peta Interaktif | `../../src/frontend/src/view/LokasiView.jsx`; `../../src/frontend/src/components/PetaLaporan.jsx` | - |
| 8 | I-08 | Profil | `../../src/frontend/src/view/ProfilView.jsx` | - |

## 3.4 File Lain

<!-- Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*. -->

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | `../../src/backend/src/index.js` | Inisialisasi Express, middleware, dan route API. |
| 2 | `../../src/frontend/src/main.jsx`, `../../src/frontend/src/App.jsx` | Entry point frontend dan komponen root yang mengatur tampilan serta navigasi aplikasi. |
| 3 | `../../src/backend/src/routes/authRoutes.js`, `../../src/backend/src/routes/profileRoutes.js`; `../../src/backend/src/routes/laporanRoutes.js`; `../../src/backend/src/routes/lokasiRoutes.js`; `../../src/backend/src/routes/upvoteRoutes.js`; `../../src/backend/src/routes/tutorialRoutes.js`; `../../src/backend/src/routes/homepageRoutes.js` | Mendefinisikan endpoint API autentikasi, profil, laporan/tanggapan, lokasi, upvote, tutorial, dan homepage. |
| 4 | `../../src/backend/src/middleware/authMiddleware.js`, `../../src/backend/src/middleware/roleMiddleware.js`; `../../src/backend/src/middleware/uploadMiddleware.js` | Middleware autentikasi, pemeriksaan role, dan unggah berkas. |
| 5 | `../../src/backend/src/config/database.js`, `../../src/backend/src/config/session.js` | Konfigurasi koneksi PostgreSQL dan penyimpanan session. |
| 6 | `../../src/backend/src/jobs/pembersihLaporan.js` | Untuk membersihkan laporan yang melewati batas waktu. |
| 7 | `../../src/frontend/src/services/apiClient.js`, `../../src/frontend/src/services/authService.js`; `../../src/frontend/src/services/homepageService.js`; `../../src/frontend/src/services/laporanService.js`; `../../src/frontend/src/services/lokasiService.js`; `../../src/frontend/src/services/profileService.js`; `../../src/frontend/src/services/tanggapanService.js`; `../../src/frontend/src/services/tutorialService.js`; `../../src/frontend/src/services/upvoteService.js` | Service frontend yang digunakan untuk me-request API dan mengelola respons fitur. |
| 8 | `../../src/frontend/src/hooks/useData.js`; `../../src/frontend/src/hooks/useRute.js`; `../../src/frontend/src/utils/format.js`; `../../src/frontend/src/utils/jarak.js`; `../../src/frontend/src/utils/tanggapanForm.js` | Hook dan utilitas bersama untuk data, navigasi, format, jarak, dan formulir tanggapan. |
| 9 | `../../src/backend/db/schema.sql`; `../../src/backend/db/schema_laporan.sql`; `../../src/backend/db/schema_sessions.sql` | Skema awal basis data pengguna, laporan/lokasi, dan session. |
| 10 | `../../src/backend/db/migration_tanggapan.sql`; `../../src/backend/db/migration_tanggapan_id_admin.sql`; `../../src/backend/db/migration_upvote.sql`; `../../src/backend/db/migration_tutorial.sql`; `../../src/backend/db/migration_homepage.sql`; `../../src/backend/db/migration_index_urgensi.sql` | Migrasi tabel/kolom tanggapan, upvote, tutorial, homepage, dan indeks urgensi. |
| 11 | `../../src/backend/scripts/seedAdmin.js` | Membuat akun admin awal dari konfigurasi environment untuk kebutuhan pengembangan/pengujian. |
| 12 | `../../src/backend/tests/AuthController.test.js`; `../../src/backend/tests/LaporanLokasiController.test.js`; `../../src/backend/tests/ProfileController.test.js`; `../../src/backend/tests/TanggapanController.test.js`; ../../src/backend/tests/PenggunaController.test.js` ../../src/backend/tests/Pengguna.test.js`; ../../src/backend/tests/Pengguna.integration.test.js` ; `../../src/backend/tests/homepage.test.js`; `../../src/backend/tests/tutorial.test.js`; `../../src/backend/tests/upvote.test.js`; `../../src/frontend/tests/laporan-lokasi-services.test.js`; `../../src/frontend/tests/PenggunaView.test.js` | Tes yang dijalankan secara otomatis untuk backend dan frontend dalam fitur autentikasi, laporan/lokasi, profil, homepage, tutorial, tanggapan, dan upvote. |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| *C15* | *PenggunaController* | *Mendalam* | *Memuat `login()`, `registrasi()`, autetikasi, hashing password, serta validasi data* | *C15-UT01 s.d. C15-UT24* |
| *C01* | *Pengguna* | *Sedang* | *Melakukan operasi CRUD pada terdapat beberapa logika pengambilan keputusan.* | *C01-UT01 s.d. C01-UT09, INT-TC01 s.d. INT-TC06* |
| *C08* | *PenggunaView* | *Sedang* | *Terdapat operasi yang memengaruhi perilaku sistem* | *C08-UT01 s.d. C08-UT08, INT-TC07 s.d. INT-TC09* |
| *C02* | *Homepage* | *Mendalam* | *Memuat logika pengambilan daftar laporan, pengaturan pengurutan dan filter, serta penentuan status upvote pada setiap laporan.* | *C02-UT01 s.d. C02-UT04* |
| *C05* | *Upvote* | *Mendalam* | *Memuat logika penyimpanan upvote, pengelolaan transaksi basis data, pencegahan upvote duplikat, dan pengambilan data upvote pengguna.* | *C05-UT01 s.d. C05-UT05* |
| *C07* | *Tutorial* | *Mendalam* | *Memuat logika pengelolaan langkah tutorial, pengambilan status penyelesaian tutorial, dan penyimpanan status tutorial pengguna.* | *C07-UT01 s.d. C07-UT03* |
| *C09* | *HomepageView* | *Sedang* | *Mengelola tampilan halaman beranda, interaksi pengguna terhadap daftar laporan, filter, pengurutan, dan navigasi ke halaman lain.* | *FE-HP-01 s.d. FE-HP-10* |
| *C12* | *UpvoteView* | *Sedang* | *Mengelola tampilan dan interaksi pengguna dalam memberikan upvote pada laporan serta memperbarui informasi jumlah upvote.* | *FE-UP-01 s.d. FE-UP-05* |
| *C14* | *TutorialView* | *Sedang* | *Mengelola tampilan tutorial, navigasi antar langkah, serta interaksi pengguna untuk memulai, melewati, dan menyelesaikan tutorial.* | *FE-TU-01 s.d. FE-TU-06* |
| *C16* | *HomepageController* | *Mendalam* | *Memuat logika validasi parameter pengurutan dan filter, pengaturan pagination, serta penanganan respons dan kesalahan ketika memuat data homepage.* | *C16-UT01 s.d. C16-UT09* |
| *C19* | *UpvoteController* | *Mendalam* | *Memuat logika validasi ID laporan, pemeriksaan hak akses pengguna, pencegahan upvote pada laporan sendiri atau laporan yang sudah diupvote, serta penanganan kegagalan proses upvote.* | *C19-UT01 s.d. C19-UT08* |
| *C21* | *TutorialController* | *Mendalam* | *Memuat logika pengelolaan alur tutorial, validasi penyelesaian langkah terakhir, penyimpanan status tutorial, dan penanganan kegagalan proses.* | *C21-UT01 s.d. C21-UT06* |
| *C03* | *Laporan* | *Mendalam* | *Memuat logika transaksi penyimpanan (laporan + lokasi), aturan visibilitas berdasarkan status validasi dan privasi, perhitungan skor populer, pengurutan dan filter, serta penghapusan otomatis laporan kedaluwarsa.* | *C03-UT01 s.d. C03-UT09, BE-LAP-16 (model)* |
| *C04* | *Lokasi* | *Tidak perlu* | *Entity/value object yang hanya menyimpan latitude, longitude, dan alamat; parsing dan validasi diuji tidak langsung melalui controller (BE-LOC-05 s.d. BE-LOC-08) dan pengujian model Lokasi.* | *Tercakup melalui BE-LAP-01, BE-LAP-06, BE-LOC-05 s.d. BE-LOC-09* |
| *C10* | *LaporanView* | *Sedang* | *Mengelola tampilan daftar, detail, dan pembuatan laporan; interaksi formulir diuji secara manual.* | *FE-LAP-01 s.d. FE-LAP-06, FE-BUAT-01 s.d. FE-BUAT-12* |
| *C11* | *LokasiView* | *Sedang* | *Mengelola tampilan peta interaktif, pencarian alamat, filter, dan popup marker; interaksi UI diuji manual.* | *FE-LOC-01 s.d. FE-LOC-09* |
| *C13* | *TanggapanView* | *Sedang* | *Mengelola tampilan tanggapan admin pada detail laporan; diuji melalui pengujian use case UC09.* | *FE-ADM-01 s.d. FE-ADM-10* |
| *C17* | *LaporanController* | *Mendalam* | *Memuat validasi kelengkapan data, batas panjang field, validasi foto (magic bytes), pemeriksaan koordinat/geocoding, pemeriksaan dan perubahan status, konfirmasi ulang, serta pembersihan file saat gagal.* | *C17-UT01 s.d. C17-UT30, BE-LAP-01 s.d. BE-LAP-17, BE-ADM-01 s.d. BE-ADM-12* |
| *C18* | *LokasiController* | *Mendalam* | *Memuat algoritma Haversine, validasi koordinat dan radius, pencarian laporan terdekat, serta integrasi geocoding.* | *C18-UT01 s.d. C18-UT09, BE-LOC-01 s.d. BE-LOC-09* |
| *C22* | *MapAPI* | *Tidak perlu* | *Kelas konfigurasi (base URL, API key, timeout) tanpa logika; teruji tidak langsung melalui MapAPIService.* | *Tercakup melalui BE-LOC-01 s.d. BE-LOC-04, BE-LAP-07, BE-LAP-08* |
| *C23* | *MapAPIService* | *Mendalam* | *Memuat request HTTP ke layanan peta eksternal, parsing respons geocoding, penanganan timeout, dan kegagalan koneksi.* | *BE-LOC-01 s.d. BE-LOC-04, BE-LAP-07, BE-LAP-08* |
| *C24* | *MapAPIView* | *Sedang* | *Komponen PetaLaporan (Leaflet/React-Leaflet) menampilkan peta, marker, dan popup; diuji manual melalui UI.* | *FE-LOC-01 s.d. FE-LOC-09, FE-BUAT-05, FE-BUAT-06* |
| *C06* | *Tanggapan* | *Sedang* | *Menyimpan dan mengambil tanggapan admin; operasi CRUD diuji melalui TanggapanController.* | *Tercakup melalui C20-UT01 s.d. C20-UT06* |
| *C20* | *TanggapanController* | *Mendalam* | *Memuat validasi deskripsi tanggapan, penyertaan status, pemeriksaan hak akses admin, serta pembatasan modifikasi tanggapan.* | *C20-UT01 s.d. C20-UT06* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: 

Jalankan perintah berikut dari direktori `src/backend/`:
```bash
   npm test -- PenggunaController.test.js 
   npm test -- Pengguna.test.js
    npm test -- --coverage
```
(Untuk C08)
Jalankan perintah berikut dari direktori `src/frontend/`:

   ```bash
   npx vitest run tests/PenggunaView.test.jsx
   ```
Lokasi file test: 
- `src/backend/tests/PenggunaController.test.js`
- `src/backend/tests/Pengguna.test.js`
- `src/frontend/tests/PenggunaView.test.jsx.`

### 4.2.1 Kelas PenggunaController

**ID Kelas:** C15  
**Nama Kelas:** *PenggunaController*  
**Tingkat:** *Mendalam*

Tabel 4.2.1. Hasil Pengujian Unit Kelas C15

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C15-UT01* | *`register()`* | *Normal* | *Registrasi menggunakan nama, NIK 16 digit, email, password, dan nomor telepon valid* | *HTTP 201 dan password di-hash* | *HTTP 201 dan bycrypt dipanggil untuk melakukan hash* | *Pass* |
| *C15-UT02* | *`register()`* | *Batas* | *Registrasi dengan password tepat 8 karakter* | *HTTP 201 dan password diterima* | *HTTP 201 dan password diterima* | *Pass* |
| *C15-UT03* | *`register()`* | *Negatif* | *Registrasi dengan NIK 5 digit* | *HTTP 400, pesan NIK tidak valid* | *HTTP 400 dengan pesan yang sesuai* | *Pass* |
| *C15-UT04* | *`login()`* | *Normal* | *Login dengan email dan password valid* | *HTTP 200 dan sesi pengguna disimpan* | *HTTP 200 dan idPengguna dan role disimpan dalam mock session* | *Pass* |
| *C15-UT05* | *`login()`* | *Batas* | *Login menggunakan email berisi spasi saja* | *HTTP 400 dan password diwajibkan* | *HTTP 400 pesan Email and _password are required_| *Pass* |
| *C15-UT06* | *`register()`* | *Negatif* | *Login dengan password yang salah* | *HTTP 401, login ditolak* | *HTTP 401 dengan pesan Wrong Email or Password* | *Pass* |
| *C15-UT07* | *`getProfile()`* | *Normal* | *Mengambil profil pengguna dengan ID sesi 1* | *HTTP 200 dan data profil dikembalikan* | *HTTP 200 dan data profil sesuai mock* | *Pass* |
| *C15-UT08* | *`getProfile()`* | *Batas* | *Mengambil profil dengan sesi tanpa idPengguna* | *HTTP 404, pengguna tidak ditemukan* | *HTTP 404 pesan _User not found_| *Pass* |
| *C15-UT09* | *`getProfile()`* | *Negatif* | *Simulasi kegagalan database saat mengambil profil* | *HTTP 500, pesan kesalahan server* | *HTTP 500 dengan pesan Something went wrong* | *Pass* |
| *C15-UT10* | *`ubahProfil()`* | *Normal* | *Mengubah nama menjadi "  Nama Baru  " dan nomor telepon valid* | *HTTP 200, nama di-trim dan profil diperbarui* | *HTTP 200, nama dikirim sebagai Nama Baru pada pemanggilan model mock* | *Pass* |
| *C15-UT11* | *`ubahProfil()`* | *Batas* | *Mengubah nama dengan tepat 100 karakter* | *HTTP 200, nama diterima* | *HTTP 200, pembaruan nama diterima* | *Pass* |
| *C15-UT12* | *`ubahProfil()`* | *Negatif* | *Mengubah field terlindungi role menjadi admin* | *HTTP 400, perubahan field terlindungi ditolak* | *HTTP 400 dengan pesan Protected profile fields cannot be changed* | *Pass* |
| *C15-UT13* | *`changePassword()`* | *Normal* | *Mengganti password dengan password lama benar dan password baru valid serta berbeda* | *HTTP 200, password baru di-hash dan diperbarui* | *HTTP 200, pesan Password updated successfully dan hash baru dikirim ke model mock* | *Pass* |
| *C15-UT14* | *`changePassword()`* | *Batas* | *Mengganti password dengan password baru tepat 8 karakter (Abcdef1!)* | *HTTP 200, password baru diterima* | *HTTP 200, password diterima dan proses hashing dipanggil* | *Pass* |
| *C15-UT15* | *`changePassword()`* | *Negatif* | *Mengganti password menggunakan password lama yang salah* | *HTTP 401, perubahan password ditolak* | *HTTP 401 dengan pesan Current password is incorrect* | *Pass* |
| *C15-UT16* | *`hapusAkun()`* | *Normal* | *Pengguna dengan role warga melakukan penghapusan akun* | *HTTP 200, akun dihapus dan sesi diakhiri* | *HTTP 200, fungsi penghapusan akun dan destroy session mock dipanggil* | *Pass* |
| *C15-UT17* | *`hapusAkun()`* | *Batas* | *Menghapus akun tanpa ID pengguna dalam sesi* | *HTTP 401, penghapusan akun ditolak* | *HTTP 401 dengan pesan Please log in to continue* | *Pass* |
| *C15-UT18* | *`hapusAkun()`* | *Negatif* | *Pengguna dengan role admin mencoba menghapus akun* | *HTTP 403, akses penghapusan ditolak* | *HTTP 403 dengan pesan Hanya warga yang dapat menghapus akun* | *Pass* |
| *C15-UT19* | *`me()`* | *Normal* | *Mengambil informasi pengguna yang sedang login* | *HTTP 200, informasi pengguna dikembalikan* | *HTTP 200 dengan data ID, nama, email, nomor telepon, dan role sesuai mock* | *Pass* |
| *C15-UT20* | *`me()`* | *Batas* | *Mengambil informasi pengguna ketika akun tidak ditemukan* | *HTTP 401, sesi pengguna diakhiri* | *HTTP 401, pesan Please log in to continue dan destroy session mock dipanggil* | *Pass* |
| *C15-UT21* | *`me()`* | *Negatif* | *Simulasi kegagalan database saat mengambil informasi pengguna* | *HTTP 500, pesan kesalahan server* | *HTTP 500 dengan pesan Something went wrong* | *Pass* |
| *C15-UT22* | *`logout()`* | *Normal* | *Logout dengan sesi pengguna aktif* | *HTTP 200, sesi diakhiri dan cookie dihapus* | *HTTP 200, pesan Logout succeeded, destroy session dan clearCookie mock dipanggil* | *Pass* |
| *C15-UT23* | *`logout()`* | *Batas* | *Logout dengan sesi tanpa idPengguna* | *HTTP 200, logout tetap berhasil* | *HTTP 200, destroy session dan clearCookie mock dipanggil* | *Pass* |
| *C15-UT24* | *`logout()`* | *Negatif* | *Simulasi kegagalan proses destroy session* | *HTTP 500, pesan kesalahan server* | *HTTP 500 dengan pesan Something went wrong* | *Pass* |

Tabel 4.2.1b. Ringkasan Cakupan Kelas C15

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *registrasi(), login(), setIzinLokasi(), cekIzinLokasi(), cekStatusTutorial(), sudahLogin(), kirimKonfirmasiUlang(), ubahProfil(), hapusAkun()* |
| Operasi yang diuji | *register(), login(), getProfile(), ubahProfil(), changePassword(), hapusAkun(), me(), logout()* |
| ID Algoritma yang tercakup | *Algo-020, Algo-021, Algo-022, Algo-023, Algo-024, Algo-025* |
| Coverage (wajib ≥ 70%) | *Statement Coverage: 75,97%; Branch Coverage: 70,94%; Function Coverage: 100%; Line Coverage: 76,87%. Pengukuran menggunakan Jest dengan 24 test case Passed (bukti pengujian pada Subbab 4.6).* |

### 4.2.2 Kelas Pengguna

**ID Kelas:** C01
**Nama Kelas:** *Pengguna*  
**Tingkat:** *Sedang*

Tabel 4.2.2. Hasil Pengujian Unit Kelas C01

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C01-UT01* | *`simpanDataPengguna()`* | *Normal* | *Menyimpan data pengguna baru dengan nama, NIK, email, hash password, dan nomor telepon valid* | *Query INSERT dijalankan dan mengembalikan ID pengguna 1* | *Query INSERT dipanggil dengan parameter sesuai, ID pengguna 1 berhasil dikembalikan* | *Pass* |
| *C01-UT02* | *`getPenggunaByEmail()`* | *Normal* | *Mencari pengguna berdasarkan email samantha@example.com* | *Mengembalikan objek Pengguna dengan email yang sesuai* | *Objek Pengguna berhasil dikembalikan dengan email samantha@example.com* | *Pass* |
| *C01-UT03* | *`getPenggunaById()`* | *Normal* | *Mencari pengguna dengan ID 1* | *Mengembalikan objek Pengguna dengan ID 1* | *Objek Pengguna berhasil dikembalikan dengan ID 1* | *Pass* |
| *C01-UT04* | *`getProfilPenggunaById()`* | *Normal* | *Mengambil profil pengguna dengan ID 1* | *Mengembalikan data profil berisi ID, nama, email, nomor telepon, dan role* | *Data profil berhasil dikembalikan dengan seluruh atribut sesuai hasil mock* | *Pass* |
| *C01-UT05* | *`updateDataPengguna()`* | *Normal* | *Memperbarui nama menjadi Samantha Baru dan nomor telepon menjadi 081234567890 untuk pengguna ID 1* | *Query UPDATE dijalankan dengan parameter sesuai dan mengembalikan true* | *Query UPDATE dijalankan dengan parameter sesuai dan method mengembalikan true* | *Pass* |
| *C01-UT06* | *`hapusDataPengguna()`* | *Normal* | *Menghapus data pengguna dengan ID 1* | *Query DELETE dijalankan dan mengembalikan true* | *Query DELETE dijalankan dengan ID 1 dan method mengembalikan true* | *Pass* |
| *C01-UT07* | *`hapusAkun()`* | *Normal* | *Memanggil penghapusan akun pengguna dengan ID 1* | *Method hapusDataPengguna dipanggil dan mengembalikan true* | *Method hapusDataPengguna berhasil dipanggil satu kali dan mengembalikan true* | *Pass* |
| *C01-UT08* | *`getPenggunaByNIK()`* | *Normal* | *Mencari pengguna berdasarkan NIK 1234567890123456* | *Mengembalikan objek Pengguna dengan data yang sesuai* | *Objek Pengguna berhasil dikembalikan dengan ID 1 sesuai hasil mock* | *Pass* |
| *C01-UT09* | *`hapusAkun()`* | *Negatif* | *Penghapusan gagal karena database tidak menghapus baris apa pun * | *Tidak ada bagian database yang terhapus* | *Tidak ada bagian database yang terhapus* | *Pass* |

### 4.2.3 Kelas PenggunaViewView
**ID Kelas:** C08
**Nama Kelas:** *PenggunaView*  
**Tingkat:** *Sedang*

Tabel 4.2.3. Hasil Pengujian Unit Kelas C08


| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C08-UT01* | *`handleRegister()`* | *Negatif* | *Melakukan registrasi dengan NIK 12345 yang tidak memenuhi ketentuan 16 digit* | *Registrasi ditolak, pesan kesalahan NIK ditampilkan, dan request registrasi tidak dikirim* | *Pesan "NIK harus terdiri dari 16 digit angka." ditampilkan dan requestRegister tidak dipanggil* | *Pass* |
| *C08-UT02* | *`handleLogin()`* | *Normal* | *Melakukan login menggunakan email samantha@example.com dan password Password1! dengan respons service berhasil* | *Request login dikirim, callback onLoginSuccess dipanggil, pesan berhasil ditampilkan, dan input password dikosongkan* | *Request login dipanggil dengan kredensial sesuai, callback berhasil dijalankan, pesan "Login berhasil. Anda sudah masuk ke RAWAT." ditampilkan, dan input password dikosongkan* | *Pass* |
| *C08-UT03* | *`konfirmasiHapusAkun()`* | *Negatif* | *Melakukan konfirmasi penghapusan akun ketika service hapusAkun mengembalikan error "Gagal menghapus akun."* | *Pesan kegagalan ditampilkan, dialog konfirmasi tetap terbuka, dan callback keberhasilan tidak dipanggil* | *Pesan "Gagal menghapus akun." ditampilkan pada dialog, dialog tetap terbuka, dan onAkunDihapus tidak dipanggil* | *Pass* |
| *C08-UT04* | *`handleRegister()`* | *Normal* | *Melakukan registrasi dengan nama, NIK 16 digit, email, nomor telepon, password, dan konfirmasi password yang valid* | *Request registrasi dikirim ke authService, registrasi berhasil, halaman kembali ke login, dan pesan keberhasilan ditampilkan* | *Request register dipanggil dengan data yang sesuai, pesan "Registrasi berhasil! Silakan masuk menggunakan akun Anda." ditampilkan, dan email pengguna terisi pada form login* | *Pass* |
| *C08-UT05* | *`handleLogin()`* | *Negatif* | *Melakukan login menggunakan email valid dan password salah sehingga authService mengembalikan error "Email atau password salah"* | *Pesan kesalahan ditampilkan, callback onLoginSuccess tidak dipanggil, dan tombol login kembali aktif* | *Pesan "Email atau password salah" ditampilkan, onLoginSuccess tidak dipanggil, dan tombol login kembali aktif setelah request gagal* | *Pass* |
| *C08-UT06* | *`konfirmasiHapusAkun()`* | *Normal* | *Melakukan konfirmasi penghapusan akun ketika service hapusAkun mengembalikan respons berhasil* | *Request penghapusan akun diproses, callback onAkunDihapus dipanggil dengan status success, dan dialog konfirmasi ditutup* | *Service hapusAkun dipanggil satu kali, onAkunDihapus menerima pesan "Akun berhasil dihapus." dengan status success, dan dialog konfirmasi ditutup* | *Pass* |
| *C08-UT07* | *`batalHapusAkun()`* | *Normal* | *Membuka dialog konfirmasi penghapusan akun, kemudian menekan tombol Batal sebelum proses penghapusan dimulai* | *Dialog konfirmasi ditutup dan tidak ada request penghapusan akun yang dikirim* | *Dialog konfirmasi berhasil ditutup dan service hapusAkun tidak dipanggil* | *Pass* |
| *C08-UT08* | *`batalHapusAkun()`* | *Negatif* | *Mencoba membatalkan penghapusan akun ketika request hapusAkun masih berlangsung (pending)* | *Pembatalan ditolak, dialog tetap terbuka, dan callback keberhasilan belum dipanggil selama proses berlangsung* | *Dialog tetap terbuka ketika tombol Batal ditekan selama proses berlangsung; setelah request berhasil, onAkunDihapus dipanggil dan dialog ditutup* | *Pass* |


### 4.2.4 Kelas Homepage

**ID Kelas:** C02  
**Nama Kelas:** *Homepage*  
**Tingkat:** *Mendalam*

Tabel 4.2.4. Hasil Pengujian Unit Kelas C02

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C02-UT01* | *`getSortBy()` dan `getSortType()`* | *Normal* | *Membuat objek Homepage tanpa parameter pengurutan.* | *Pengurutan bawaan menggunakan urgensi secara menurun.* | *Nilai pengurutan yang dikembalikan adalah `urgensi` dan `desc`.* | *Pass* |
| *C02-UT02* | *`getDaftarLaporan()`* | *Normal* | *Mengambil daftar laporan yang terdiri atas laporan milik sendiri dan laporan milik pengguna lain, dengan satu laporan yang telah diupvote.* | *Status `sudahUpvote` dan `bisaUpvote` ditentukan sesuai kondisi setiap laporan. Pengambilan data upvote dilakukan melalui satu query untuk seluruh laporan.* | *Status setiap laporan sesuai kondisi. Method `getDiupvoteOleh()` dipanggil satu kali untuk seluruh daftar laporan.* | *Pass* |
| *C02-UT03* | *`getDaftarLaporan()`* | *Negatif* | *Mengambil daftar laporan menggunakan akun dengan role admin.* | *Admin tidak memperoleh hak untuk memberikan upvote pada laporan.* | *Nilai `bisaUpvote` pada laporan milik admin bernilai `false`.* | *Pass* |
| *C02-UT04* | *`getDaftarLaporan()`* | *Normal* | *Mengambil daftar laporan dengan parameter pengurutan waktu menaik, filter kategori Jalan, limit 5, dan offset 10.* | *Parameter pengurutan, filter, dan pagination diteruskan dengan benar ke `Laporan.getDaftarLaporan()`.* | *Seluruh parameter diteruskan sesuai nilai yang diberikan.* | *Pass* |

Tabel 4.2.4b. Ringkasan Cakupan Kelas C02

| Informasi | Keterangan |
| :--- | :--- |
| Operasi yang diuji | *`getSortBy()`, `getSortType()`, `getDaftarLaporan()`* |
| Jumlah test case | *4 test case* |
| Coverage | Line Coverage: 100,00%; Branch Coverage: 100,00%; Function Coverage: 100,00%. |

### 4.2.5 Kelas HomepageController

**ID Kelas:** C16  
**Nama Kelas:** *HomepageController*  
**Tingkat:** *Mendalam*

Tabel 4.2.5. Hasil Pengujian Unit Kelas C16

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C16-UT01* | *`urutkanLaporan()`* | *Normal* | *Memanggil fungsi tanpa parameter pengurutan.* | *Pengurutan bawaan menggunakan urgensi secara menurun.* | *Fungsi mengembalikan `sortBy: urgensi` dan `sortType: desc`.* | *Pass* |
| *C16-UT02* | *`urutkanLaporan()`* | *Normal* | *Memasukkan pilihan pengurutan waktu, urgensi, dan populer dengan variasi huruf besar dan kecil.* | *Ketiga pilihan pengurutan diterima tanpa memperhatikan kapitalisasi huruf.* | *Seluruh pilihan pengurutan berhasil diterima dan dikembalikan dalam bentuk huruf kecil.* | *Pass* |
| *C16-UT03* | *`urutkanLaporan()`* | *Negatif* | *Memasukkan nama kolom yang tidak diizinkan dan tipe pengurutan yang tidak valid.* | *Input pengurutan yang tidak valid ditolak.* | *Fungsi mengembalikan `null` untuk kolom dan tipe pengurutan yang tidak valid.* | *Pass* |
| *C16-UT04* | *`filterLaporan()`* | *Normal* | *Memasukkan filter kategori, status laporan, dan tingkat permasalahan yang valid.* | *Filter diteruskan sesuai nilai yang diberikan. Tanpa filter, fungsi mengembalikan objek kosong.* | *Fungsi mengembalikan objek filter sesuai masukan dan objek kosong ketika tidak terdapat filter.* | *Pass* |
| *C16-UT05* | *`filterLaporan()`* | *Negatif* | *Memasukkan status laporan dan tingkat permasalahan yang tidak dikenal.* | *Filter dengan nilai tidak valid ditolak.* | *Fungsi mengembalikan `null` untuk nilai filter yang tidak dikenal.* | *Pass* |
| *C16-UT06* | *`loadHomepage()`* | *Normal* | *Meminta data homepage dengan pengurutan waktu menaik dan limit 1.* | *HTTP 200, data laporan dikembalikan, serta parameter pengurutan dan pagination diterapkan.* | *HTTP 200 diterima. Parameter `sortBy`, `limit`, dan `offset` sesuai dengan masukan.* | *Pass* |
| *C16-UT07* | *`loadHomepage()`* | *Batas* | *Meminta data homepage dengan nilai limit 9999.* | *Nilai limit dibatasi maksimal 50.* | *Nilai limit yang diteruskan ke proses pengambilan data adalah 50.* | *Pass* |
| *C16-UT08* | *`loadHomepage()`* | *Negatif* | *Memasukkan parameter pengurutan, filter, limit, atau offset yang tidak valid.* | *Backend mengembalikan HTTP 400 dan menolak permintaan.* | *HTTP 400 dikembalikan untuk seluruh parameter yang tidak valid.* | *Pass* |
| *C16-UT09* | *`loadHomepage()`* | *Negatif* | *Mensimulasikan kegagalan ketika mengambil data laporan dari model.* | *Backend mengembalikan HTTP 500 ketika terjadi kegagalan pengambilan data.* | *HTTP 500 dikembalikan ketika proses pengambilan data menghasilkan error.* | *Pass* |

Tabel 4.2.5b. Ringkasan Cakupan Kelas C16

| Informasi | Keterangan |
| :--- | :--- |
| Operasi yang diuji | *`urutkanLaporan()`, `filterLaporan()`, `loadHomepage()`* |
| Jumlah test case | *9 test case* |
| Coverage | Line Coverage: 100,00%; Branch Coverage: 93,94%; Function Coverage: 100,00%. |

### 4.2.6 Kelas Upvote

**ID Kelas:** C05  
**Nama Kelas:** *Upvote*  
**Tingkat:** *Mendalam*

Tabel 4.2.6. Hasil Pengujian Unit Kelas C05

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C05-UT01* | *`upvote()`* | *Normal* | *Melakukan upvote menggunakan ID pengguna dan ID laporan yang valid.* | *Transaksi berjalan dengan urutan BEGIN, INSERT, UPDATE laporan, dan COMMIT. Koneksi dilepaskan setelah transaksi selesai.* | *Seluruh proses transaksi berjalan sesuai urutan dan koneksi berhasil dilepaskan.* | *Pass* |
| *C05-UT02* | *`upvote()`* | *Negatif* | *Melakukan upvote pada laporan yang sudah memiliki data upvote dari pengguna yang sama.* | *Transaksi dibatalkan menggunakan ROLLBACK dan skor laporan tidak diperbarui.* | *Fungsi mengembalikan `false`, proses UPDATE tidak dijalankan, dan transaksi diakhiri dengan ROLLBACK.* | *Pass* |
| *C05-UT03* | *`upvote()`* | *Negatif* | *Mensimulasikan kesalahan database ketika proses UPDATE laporan berlangsung.* | *Transaksi dibatalkan, koneksi dilepaskan, dan error diteruskan kepada pemanggil.* | *ROLLBACK dijalankan, koneksi berhasil dilepaskan, dan error diteruskan.* | *Pass* |
| *C05-UT04* | *`getDiupvoteOleh()`* | *Batas* | *Meminta data upvote pengguna dengan daftar ID laporan kosong.* | *Fungsi mengembalikan Set kosong tanpa menjalankan query database.* | *Fungsi mengembalikan Set kosong dan tidak menjalankan query.* | *Pass* |
| *C05-UT05* | *`getDiupvoteOleh()`* | *Normal* | *Meminta data upvote pengguna untuk tiga ID laporan sekaligus.* | *Pengambilan data dilakukan menggunakan satu query dan hasil dikembalikan dalam bentuk Set.* | *Query hanya dijalankan satu kali dan hasil berhasil dikembalikan sebagai Set.* | *Pass* |

Tabel 4.2.6b. Ringkasan Cakupan Kelas C05

| Informasi | Keterangan |
| :--- | :--- |
| Operasi yang diuji | *`upvote()`, `getDiupvoteOleh()`* |
| Jumlah test case | *5 test case* |
| Coverage | Line Coverage: 100,00%; Branch Coverage: 92,31%; Function Coverage: 80,00%. |

### 4.2.7 Kelas UpvoteController

**ID Kelas:** C19  
**Nama Kelas:** *UpvoteController*  
**Tingkat:** *Mendalam*

Tabel 4.2.7. Hasil Pengujian Unit Kelas C19

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C19-UT01* | *`prosesUpvote()`* | *Normal* | *Pengguna memberikan upvote pada laporan yang valid dan belum pernah diupvote.* | *HTTP 201 dan jumlah upvote terbaru dikembalikan. ID pengguna diambil dari session.* | *HTTP 201 diterima dengan informasi upvote berhasil dan jumlah upvote terbaru.* | *Pass* |
| *C19-UT02* | *`prosesUpvote()`* | *Negatif* | *Memasukkan ID laporan yang bukan UUID.* | *HTTP 400 dan permintaan ditolak.* | *HTTP 400 dikembalikan.* | *Pass* |
| *C19-UT03* | *`prosesUpvote()`* | *Negatif* | *Pengguna dengan role admin mencoba memberikan upvote.* | *HTTP 403 dan permintaan ditolak.* | *HTTP 403 dikembalikan.* | *Pass* |
| *C19-UT04* | *`prosesUpvote()`* | *Negatif* | *Memberikan upvote pada laporan yang tidak ditemukan atau tidak dapat dilihat.* | *HTTP 404 dan proses upvote tidak dilanjutkan.* | *HTTP 404 dikembalikan.* | *Pass* |
| *C19-UT05* | *`prosesUpvote()`* | *Negatif* | *Pengguna mencoba memberikan upvote pada laporan miliknya sendiri.* | *HTTP 403 dan proses penyimpanan upvote tidak dijalankan.* | *HTTP 403 dikembalikan dan fungsi penyimpanan upvote tidak dipanggil.* | *Pass* |
| *C19-UT06* | *`prosesUpvote()`* | *Negatif* | *Pengguna mencoba memberikan upvote pada laporan yang sudah pernah diupvote.* | *HTTP 409 dan penyimpanan upvote tidak dilakukan kembali.* | *HTTP 409 dikembalikan dan fungsi penyimpanan tidak dipanggil.* | *Pass* |
| *C19-UT07* | *`prosesUpvote()`* | *Negatif* | *Mensimulasikan dua permintaan upvote yang dilakukan secara bersamaan.* | *Permintaan kedua ditolak dengan HTTP 409 sehingga tidak terjadi upvote ganda.* | *HTTP 409 dikembalikan ketika proses penyimpanan upvote menghasilkan `false`.* | *Pass* |
| *C19-UT08* | *`prosesUpvote()`* | *Negatif* | *Mensimulasikan kegagalan database ketika memproses upvote.* | *HTTP 500 dan pesan kesalahan yang dapat dipahami dikembalikan.* | *HTTP 500 dikembalikan dengan pesan kegagalan proses upvote.* | *Pass* |

Tabel 4.2.7b. Ringkasan Cakupan Kelas C19

| Informasi | Keterangan |
| :--- | :--- |
| Operasi yang diuji | *`prosesUpvote()`* |
| Jumlah test case | *8 test case* |
| Coverage | Line Coverage: 100,00%; Branch Coverage: 93,75%; Function Coverage: 100,00%. |
### 4.2.8 Kelas Tutorial

**ID Kelas:** C07  
**Nama Kelas:** *Tutorial*  
**Tingkat:** *Mendalam*

Tabel 4.2.8. Hasil Pengujian Unit Kelas C07

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C07-UT01* | *`getLangkahSaatIni()` dan `getTotalLangkah()`* | *Normal* | *Membuat objek Tutorial tanpa perubahan langkah.* | *Langkah saat ini bernilai 1 dan total langkah sesuai jumlah langkah tutorial.* | *Langkah saat ini bernilai 1 dan total langkah sesuai daftar tutorial.* | *Pass* |
| *C07-UT02* | *`getDaftarLangkah()`* | *Normal* | *Memeriksa seluruh langkah yang tersedia pada daftar tutorial.* | *Setiap langkah memiliki judul dan isi.* | *Seluruh langkah memiliki atribut judul dan isi.* | *Pass* |
| *C07-UT03* | *`sudahLihat()`* | *Normal dan Negatif* | *Memeriksa status tutorial ketika nilai `status_tutorial` bernilai true, false, dan ketika data pengguna tidak ditemukan.* | *Fungsi mengembalikan true hanya ketika status tutorial bernilai true.* | *Fungsi mengembalikan true untuk status true dan false untuk status false maupun ketika data tidak ditemukan.* | *Pass* |

Tabel 4.2.8b. Ringkasan Cakupan Kelas C07

| Informasi | Keterangan |
| :--- | :--- |
| Operasi yang diuji | *`getLangkahSaatIni()`, `getTotalLangkah()`, `getDaftarLangkah()`, `sudahLihat()`* |
| Jumlah test case | *3 test case* |
| Coverage | Line Coverage: 100,00%; Branch Coverage: 100,00%; Function Coverage: 100,00%. |
### 4.2.9 Kelas TutorialController

**ID Kelas:** C21  
**Nama Kelas:** *TutorialController*  
**Tingkat:** *Mendalam*

Tabel 4.2.9. Hasil Pengujian Unit Kelas C21

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C21-UT01* | *`startTutorial()`* | *Normal* | *Pengguna meminta untuk memulai tutorial.* | *HTTP 200 dan daftar langkah, langkah saat ini, total langkah, serta status tutorial dikembalikan.* | *HTTP 200 diterima dan seluruh informasi tutorial dikembalikan sesuai kondisi pengguna.* | *Pass* |
| *C21-UT02* | *`skipTutorial()`* | *Normal* | *Pengguna memilih untuk melewati tutorial.* | *Status tutorial disimpan dan HTTP 200 dikembalikan.* | *HTTP 200 dikembalikan dan fungsi penyimpanan status dipanggil menggunakan ID pengguna dari session.* | *Pass* |
| *C21-UT03* | *`finishTutorial()`* | *Negatif* | *Pengguna mencoba menyelesaikan tutorial sebelum mencapai langkah terakhir.* | *HTTP 400 dan status penyelesaian tidak disimpan.* | *HTTP 400 dikembalikan dan fungsi penyimpanan tidak dipanggil.* | *Pass* |
| *C21-UT04* | *`finishTutorial()`* | *Normal* | *Pengguna menyelesaikan tutorial ketika berada pada langkah terakhir.* | *Status tutorial berhasil disimpan dan HTTP 200 dikembalikan.* | *HTTP 200 dikembalikan.* | *Pass* |
| *C21-UT05* | *`finishTutorial()`* | *Negatif* | *Mensimulasikan kegagalan penyimpanan status penyelesaian tutorial.* | *HTTP 500 dikembalikan ketika proses penyimpanan gagal.* | *HTTP 500 dikembalikan.* | *Pass* |
| *C21-UT06* | *`finishTutorial()`* | *Negatif* | *Mengirim permintaan penyelesaian tutorial tanpa body yang berisi langkah saat ini.* | *Permintaan ditolak dengan HTTP 400 tanpa menyebabkan server error.* | *HTTP 400 dikembalikan tanpa menyebabkan server error.* | *Pass* |

Tabel 4.2.9b. Ringkasan Cakupan Kelas C21

| Informasi | Keterangan |
| :--- | :--- |
| Operasi yang diuji | *`startTutorial()`, `skipTutorial()`, `finishTutorial()`* |
| Jumlah test case | *6 test case* |
| Coverage | Line Coverage: 100,00%; Branch Coverage: 90,91%; Function Coverage: 100,00%. |

### 4.2.10 Kelas LaporanController

**ID Kelas:** C17  
**Nama Kelas:** *LaporanController*  
**Tingkat:** *Mendalam*

Cara menjalankan unit test:
Jalankan perintah berikut dari direktori `src/backend/`:
```bash
node --test tests/LaporanLokasiController.test.js
```
Lokasi file test: `src/backend/tests/LaporanLokasiController.test.js`

Tabel 4.2.10. Hasil Pengujian Unit Kelas C17

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C17-UT01* | *`buat()`* | *Normal* | *Membuat laporan dengan field wajib (nama masalah, kategori, urgensi, privasi) dan koordinat valid (`-6.9`, `107.6`)* | *HTTP 201; ID laporan berformat UUID dikembalikan; koordinat dikonversi ke `Number` dan diteruskan ke model* | *HTTP 201, UUID dikembalikan, koordinat terkonversi sesuai* | *Pass* |
| *C17-UT02* | *`buat()`* | *Negatif* | *Membuat laporan tanpa nama masalah (hanya spasi)* | *HTTP 400; pesan `Data belum lengkap`; penyimpanan tidak dipanggil* | *HTTP 400 dan model `simpan` tidak dipanggil* | *Pass* |
| *C17-UT03* | *`buat()`* | *Negatif* | *Membuat laporan tanpa lokasi (latitude dan longitude tidak dikirim)* | *HTTP 400; pesan `Data belum lengkap`; penyimpanan tidak dipanggil* | *HTTP 400 dan model tidak dipanggil* | *Pass* |
| *C17-UT04* | *`buat()`* | *Batas* | *Nama masalah 151 karakter, kategori 51 karakter, deskripsi 2001 karakter* | *HTTP 400 untuk masing-masing batas panjang* | *HTTP 400 untuk ketiga kondisi batas* | *Pass* |
| *C17-UT05* | *`buat()`* | *Negatif* | *Urgensi `DARURAT` atau privasi `RAHASIA` (bukan nilai yang diizinkan)* | *HTTP 400; laporan ditolak* | *HTTP 400 untuk kedua nilai* | *Pass* |
| *C17-UT06* | *`buat()`* | *Negatif* | *Koordinat parsial (longitude kosong), bukan angka (`abc`), atau di luar rentang (latitude `91`)* | *HTTP 400; pesan `Koordinat lokasi tidak valid`* | *HTTP 400 untuk ketiga kondisi* | *Pass* |
| *C17-UT07* | *`buat()`* | *Negatif* | *Lokasi dikirim sebagai alamat, geocoding mengembalikan `null`* | *HTTP 400; pesan `Alamat tidak ditemukan`; penyimpanan tidak dipanggil* | *HTTP 400 dan model tidak dipanggil* | *Pass* |
| *C17-UT08* | *`buat()`* | *Negatif* | *Lokasi dikirim sebagai alamat, layanan geocoding melempar error* | *HTTP 502; pesan `Layanan peta tidak dapat dihubungi`* | *HTTP 502 dikembalikan* | *Pass* |
| *C17-UT09* | *`buat()` (middleware)* | *Negatif* | *Foto bertipe `text/plain` diunggah via multipart* | *HTTP 400; pesan `Format foto harus JPG, JPEG, atau PNG`* | *HTTP 400 dikembalikan* | *Pass* |
| *C17-UT10* | *`buat()` (middleware)* | *Batas* | *Foto bertipe `image/jpeg` berukuran tepat 5 MB + 1 byte* | *HTTP 400; pesan `Ukuran foto maksimal 5 MB`* | *HTTP 400 dikembalikan* | *Pass* |
| *C17-UT11* | *`buat()`* | *Negatif* | *Foto bernama `.jpg` tetapi isi file bukan JPEG/PNG (magic bytes tidak sesuai)* | *HTTP 400; pesan `Format foto harus JPG, JPEG, atau PNG`; file foto dihapus dari disk* | *HTTP 400 dan file dihapus (ENOENT pada `access`)* | *Pass* |
| *C17-UT12* | *`buat()`* | *Negatif* | *Model `Laporan.simpan` melempar error database* | *HTTP 500; pesan `Something went wrong`* | *HTTP 500 dikembalikan* | *Pass* |
| *C17-UT13* | *`buat()`* | *Negatif* | *Model `Laporan.simpan` gagal dan request menyertakan file foto* | *HTTP 500; file foto yatim dihapus dari disk setelah kegagalan* | *HTTP 500 dan file dihapus (ENOENT pada `access`)* | *Pass* |
| *C17-UT14* | *`daftar()`* | *Normal* | *Daftar laporan dengan filter `kategori=Jalan`, `statusLaporan=DILIHAT`, `page=3`, `limit=10`* | *HTTP 200; filter dan offset `20` diteruskan ke model* | *HTTP 200, offset `20`, filter sesuai* | *Pass* |
| *C17-UT15* | *`daftar()`* | *Negatif* | *Status laporan `RUSAK` (tidak valid)* | *HTTP 400; model tidak dipanggil* | *HTTP 400 dan model tidak dipanggil* | *Pass* |
| *C17-UT16* | *`daftar()`* | *Negatif* | *Status validasi `MERAGUKAN` atau urgensi `DARURAT`* | *HTTP 400; model tidak dipanggil* | *HTTP 400 untuk kedua kondisi* | *Pass* |
| *C17-UT17* | *`detail()`* | *Normal* | *ID laporan UUID yang valid; model mengembalikan data laporan* | *HTTP 200; tanggapan teratas dilampirkan* | *HTTP 200 dan `tanggapanTeratas` terlampir* | *Pass* |
| *C17-UT18* | *`detail()`* | *Negatif* | *ID laporan bukan UUID* | *HTTP 404; model tidak dipanggil* | *HTTP 404 dan model tidak dipanggil* | *Pass* |
| *C17-UT19* | *`detail()`* | *Negatif* | *Model mengembalikan `null` (laporan tidak ditemukan atau tidak boleh dilihat)* | *HTTP 404; pesan `Laporan tidak ditemukan`* | *HTTP 404 dikembalikan* | *Pass* |
| *C17-UT20* | *`periksa()`* | *Normal* | *Admin mengirim `valid: true` dengan catatan* | *HTTP 200; argumen `[idLaporan, true, catatan_trimmed]` diteruskan ke model* | *HTTP 200 dan argumen sesuai* | *Pass* |
| *C17-UT21* | *`periksa()`* | *Normal* | *Admin mengirim `valid: false` dengan catatan* | *HTTP 200; `false` dan catatan diteruskan ke model* | *HTTP 200 dan argumen sesuai* | *Pass* |
| *C17-UT22* | *`periksa()`* | *Negatif* | *Field `valid` bertipe string `"true"` (bukan boolean)* | *HTTP 400; model tidak dipanggil* | *HTTP 400 dan model tidak dipanggil* | *Pass* |
| *C17-UT23* | *`periksa()`* | *Batas* | *Catatan pemeriksaan 1001 karakter* | *HTTP 400; model tidak dipanggil* | *HTTP 400 dan model tidak dipanggil* | *Pass* |
| *C17-UT24* | *`periksa()`* | *Negatif* | *Laporan tidak ditemukan (model mengembalikan `false`)* | *HTTP 404* | *HTTP 404 dikembalikan* | *Pass* |
| *C17-UT25* | *`updateStatus()`* | *Normal* | *Admin mengirim `statusLaporan: " selesai "` (huruf kecil, spasi)* | *HTTP 200; status dinormalisasi menjadi `SELESAI` dan diteruskan ke model* | *HTTP 200 dan model menerima `SELESAI`* | *Pass* |
| *C17-UT26* | *`updateStatus()`* | *Negatif* | *Status penanganan `RUSAK` (tidak valid)* | *HTTP 400; model tidak dipanggil* | *HTTP 400 dan model tidak dipanggil* | *Pass* |
| *C17-UT27* | *`updateStatus()`* | *Negatif* | *Laporan tidak ditemukan (model mengembalikan `false`)* | *HTTP 404* | *HTTP 404 dikembalikan* | *Pass* |
| *C17-UT28* | *`konfirmasiUlang()`* | *Normal* | *Pemilik mengirim konfirmasi ulang; laporan berstatus `TIDAK_VALID` dan belum kedaluwarsa* | *HTTP 200* | *HTTP 200 dikembalikan* | *Pass* |
| *C17-UT29* | *`konfirmasiUlang()`* | *Negatif* | *Pengguna bukan pemilik atau laporan bukan `TIDAK_VALID`* | *HTTP 404 (bukan pemilik); HTTP 409 (status bukan `TIDAK_VALID`)* | *HTTP 404 dan HTTP 409 masing-masing sesuai* | *Pass* |
| *C17-UT30* | *`konfirmasiUlang()`* | *Negatif* | *Batas waktu konfirmasi ulang telah lewat* | *HTTP 409; `kirimKonfirmasiUlang` tidak dipanggil* | *HTTP 409 dan model tidak dipanggil* | *Pass* |

Tabel 4.2.10b. Ringkasan Cakupan Kelas C17

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`buat()`, `daftar()`, `ringkasan()`, `saya()`, `ditangani()`, `detail()`, `foto()`, `updateStatus()`, `periksa()`, `konfirmasiUlang()`, `hapus()`* |
| Operasi yang diuji | *`buat()`, `daftar()`, `detail()`, `periksa()`, `updateStatus()`, `konfirmasiUlang()`* |
| ID Algoritma yang tercakup | *Algo-039, Algo-040, Algo-041* |
| Jumlah test case | *30 test case (tercakup dalam 48 test backend laporan/lokasi)* |
| Coverage | *Belum diukur terpisah; tercakup bersama suite backend* |

### 4.2.11 Kelas LokasiController

**ID Kelas:** C18  
**Nama Kelas:** *LokasiController*  
**Tingkat:** *Mendalam*

Tabel 4.2.11. Hasil Pengujian Unit Kelas C18

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C18-UT01* | *`ambilLokasiLaporan()`* | *Normal* | *Geocode alamat `Bandung` yang ditemukan* | *HTTP 200; respons berisi latitude, longitude, dan alamat hasil geocoding* | *HTTP 200 dan hasil geocode dikembalikan* | *Pass* |
| *C18-UT02* | *`ambilLokasiLaporan()`* | *Negatif* | *Alamat berisi spasi saja* | *HTTP 400; pesan `Alamat wajib diisi`; layanan peta tidak dipanggil* | *HTTP 400 dan layanan peta tidak dipanggil* | *Pass* |
| *C18-UT03* | *`ambilLokasiLaporan()`* | *Negatif* | *Alamat tidak ditemukan (geocode mengembalikan `null`)* | *HTTP 404; pesan `Alamat tidak ditemukan`* | *HTTP 404 dikembalikan* | *Pass* |
| *C18-UT04* | *`ambilLokasiLaporan()`* | *Negatif* | *Layanan geocoding gagal (melempar error)* | *HTTP 502; pesan `Layanan peta tidak dapat dihubungi`* | *HTTP 502 dikembalikan* | *Pass* |
| *C18-UT05* | *`cariLaporanTerdekat()`* | *Normal* | *Koordinat valid `(0, 0)` tanpa parameter radius* | *HTTP 200; radius default 5 km; hasil hanya dalam radius dan diurutkan dari jarak terdekat* | *HTTP 200, `radiusKm: 5`, dan pengurutan sesuai* | *Pass* |
| *C18-UT06* | *`cariLaporanTerdekat()`* | *Negatif* | *Tanpa koordinat pengguna (query kosong)* | *HTTP 400; pesan `Lokasi pengguna belum tersedia`* | *HTTP 400 dikembalikan* | *Pass* |
| *C18-UT07* | *`cariLaporanTerdekat()`* | *Negatif* | *Latitude `abc` atau `91` (bukan angka atau di luar rentang)* | *HTTP 400 untuk kedua kondisi* | *HTTP 400 untuk kedua kondisi* | *Pass* |
| *C18-UT08* | *`cariLaporanTerdekat()`* | *Batas* | *Radius `0`, `-1`, `abc`, dan `51` (melebihi batas 50 km)* | *HTTP 400 untuk keempat kondisi* | *HTTP 400 untuk semua radius tidak valid* | *Pass* |
| *C18-UT09* | *`cariLaporanTerdekat()`* | *Normal* | *Radius valid dan tidak ada laporan di area* | *HTTP 200; daftar `laporan` kosong; `radiusKm: 5`* | *HTTP 200, daftar kosong, dan radius default 5 km* | *Pass* |

Tabel 4.2.11b. Ringkasan Cakupan Kelas C18

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`ambilLokasiLaporan()`, `cariLaporanTerdekat()`* |
| Operasi yang diuji | *`ambilLokasiLaporan()`, `cariLaporanTerdekat()`* |
| ID Algoritma yang tercakup | *Algo-039 (geocoding), Algo-040 (Haversine), Algo-041 (pencarian terdekat)* |
| Jumlah test case | *9 test case* |
| Coverage | *Belum diukur terpisah; tercakup bersama suite backend* |

### 4.2.12 Kelas Laporan (Model)

**ID Kelas:** C03  
**Nama Kelas:** *Laporan*  
**Tingkat:** *Mendalam*

Tabel 4.2.12. Hasil Pengujian Unit Kelas C03

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C03-UT01* | *`simpan()`* | *Normal* | *Menyimpan laporan dan lokasi dalam satu transaksi (mock client); client dipanggil dengan BEGIN, INSERT laporan, INSERT lokasi, COMMIT* | *Transaksi berjalan sesuai urutan; client dilepaskan* | *Query urutan sesuai; client dilepaskan* | *Pass* |
| *C03-UT02* | *`simpan()`* | *Negatif* | *Penyimpanan lokasi gagal (INSERT lokasi melempar error)* | *Transaksi dibatalkan (ROLLBACK); client dilepaskan; error diteruskan* | *ROLLBACK dijalankan; client dilepaskan; error diteruskan* | *Pass* |
| *C03-UT03* | *`getDetailLaporan()`* | *Normal* | *Memanggil dengan UUID valid dan data laporan tersedia; viewer adalah pemilik* | *Objek laporan dikembalikan dengan format lengkap termasuk lokasi* | *Objek laporan dikembalikan sesuai; lokasi terlampir* | *Pass* |
| *C03-UT04* | *`getDetailLaporan()`* | *Negatif* | *Viewer bukan pemilik melihat laporan `TIDAK_VALID`* | *Mengembalikan `null` (laporan disembunyikan)* | *`null` dikembalikan* | *Pass* |
| *C03-UT05* | *`#format()`* | *Normal* | *Laporan anonim dilihat bukan pemilik dan bukan admin* | *Field `pelapor` bernilai `null`* | *`pelapor` bernilai `null`* | *Pass* |
| *C03-UT06* | *`simpanHasilPemeriksaan()`* | *Normal* | *Menyimpan pemeriksaan `valid: true`* | *Status menjadi `VALID`; `rowCount: 1`* | *Status `VALID` dan query sesuai* | *Pass* |
| *C03-UT07* | *`simpanHasilPemeriksaan()`* | *Normal* | *Menyimpan pemeriksaan `valid: false`* | *Status `TIDAK_VALID`; batas waktu 14 hari dipasang via `make_interval(days => $3::int)`* | *Parameter `[0]='TIDAK_VALID'`, `[2]=14`; query berisi `make_interval`* | *Pass* |
| *C03-UT08* | *`kirimKonfirmasiUlang()`* | *Normal* | *Konfirmasi ulang pada laporan `TIDAK_VALID` yang belum kedaluwarsa* | *Status diubah ke `BELUM_DIPERIKSA`; query berisi `batas_waktu > NOW()`* | *Query sesuai; rowCount 1* | *Pass* |
| *C03-UT09* | *`cekBatasWaktu()`* | *Normal* | *Memanggil pada laporan dengan batas waktu yang sudah lewat* | *Mengembalikan `true`* | *Tercakup melalui BE-ADM-12* | *Pass* |

Tabel 4.2.12b. Ringkasan Cakupan Kelas C03

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`simpan()`, `getDetailLaporan()`, `getDaftarLaporan()`, `getRingkasan()`, `getPemilik()`, `updateStatusLaporan()`, `simpanHasilPemeriksaan()`, `kirimKonfirmasiUlang()`, `cekBatasWaktu()`, `hapusLaporan()`, `hapusSemuaKadaluarsa()`* |
| Operasi yang diuji | *`simpan()`, `getDetailLaporan()`, `simpanHasilPemeriksaan()`, `kirimKonfirmasiUlang()`, `getDaftarLaporan()` (tidak langsung melalui controller)* |
| Jumlah test case | *9 test case (model) + tercakup melalui 30 test case controller* |
| Coverage | *Belum diukur terpisah; tercakup bersama suite backend* |

### 4.2.13 Kelas Tanggapan

**ID Kelas:** *C06*  
**Nama Kelas:** *Tanggapan*  
**Tingkat:** *Mendalam*

Tabel 4.2.13. Hasil Pengujian Unit Kelas C06

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C06-UT01* | *`simpanTanggapan()`* | *Normal* | *Simpan tanggapan valid dengan `id_admin` dan query berparameter.* | *Satu baris tersimpan; parameter query dan `idAdmin` sesuai masukan.* | *Query dan nilai parameter sesuai; operasi menghasilkan `true`.* | *Pass* |
| *C06-UT02* | *`getTanggapanByLaporan()` (implementasi)* | *Normal* | *Baca tanggapan dengan admin dan warga sebagai viewer.* | *Isi tanggapan tersedia; identitas admin hanya ada pada hasil admin.* | *Kedua hasil sesuai aturan visibilitas.* | *Pass* |
| *C06-UT03* | *`simpanTanggapan()`* | *Negatif* | *Model menerima hasil query `rowCount = 0`.* | *Operasi menghasilkan `false`.* | *Menghasilkan `false`; `idAdmin` tetap `null` pada kasus data lama.* | *Pass* |
| *C06-UT04* | *`getTanggapanByLaporan()` (implementasi)* | *Negatif* | *Query mengembalikan tanpa baris.* | *Operasi menghasilkan `null`.* | *Menghasilkan `null`.* | *Pass* |
| *C06-UT05* | *`getTanggapanByLaporan()` (implementasi)* | *Batas* | *Baca tanggapan lama dengan `id_admin` dan nama admin bernilai `NULL`.* | *Tanggapan tetap terbaca; identitas admin bernilai `null`, bukan error.* | *Tanggapan terbaca dan kedua properti identitas bernilai `null`.* | *Pass* |
| *C06-UT06* | *`simpanTanggapan()`* | *Batas* | *Simpan tanggapan dengan `id_admin = NULL` untuk kompatibilitas data lama.* | *Query menerima `NULL`; satu baris dianggap tersimpan.* | *Parameter `id_admin` bernilai `null`; operasi menghasilkan `true`.* | *Pass* |

Pengujian `getTanggapanByLaporan()` adalah pengujian perilaku publik yang ada pada implementasi, tetapi operasi itu tidak tercantum pada daftar operasi C06 DPPL. DPPL juga belum menambahkan parameter `idAdmin` pada signature dan belum memperbarui query Q-016.

Tabel 4.2.13b. Ringkasan Cakupan Kelas C06

| Informasi | Keterangan |
| :--- | :--- |
| *Daftar operasi public pada DPPL* | *`simpanTanggapan(idLaporan:String, dataPopupForm:FormTanggapan): Boolean`* |
| *Operasi yang diuji* | *`simpanTanggapan()`; perilaku implementasi `getTanggapanByLaporan()` juga diuji* |
| *ID Algoritma yang tercakup* | *Algo-017* |
| *Coverage (wajib ≥ 70%)* | *100.00% baris / 100.00% cabang; Node.js `node:test` bawaan; bukti: `docs/M10/evidence/TanggapanController-coverage.txt`* |

### 4.2.14 Kelas TanggapanController

**ID Kelas:** *C20*  
**Nama Kelas:** *TanggapanController*  
**Tingkat:** *Mendalam*

Tabel 4.2.14. Hasil Pengujian Unit Kelas C20

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C20-UT01* | *`validasiTanggapan()`* | *Normal* | *Status valid, deskripsi kosong.* | *Form diterima.* | *Menghasilkan `true`.* | *Pass* |
| *C20-UT02* | *`validasiTanggapan()`* | *Normal* | *Status tidak valid dengan alasan berisi teks.* | *Form diterima.* | *Menghasilkan `true`.* | *Pass* |
| *C20-UT03* | *`validasiTanggapan()`* | *Negatif* | *Alasan kosong, spasi, tab, dan baris baru untuk laporan tidak valid.* | *Form ditolak.* | *Semua masukan menghasilkan `false`.* | *Pass* |
| *C20-UT04* | *`simpanTanggapan()`* | *Normal/Negatif* | *Simpan dengan query berhasil, lalu query melempar error.* | *Hasil mengikuti operasi model: `true` untuk satu baris, `false` jika gagal.* | *Kedua hasil sesuai; jalur error model menghasilkan `false`.* | *Pass* |
| *C20-UT05* | *`simpanStatus()`* | *Normal/Negatif* | *Model laporan mengembalikan berhasil lalu gagal.* | *Hasil mengikuti pembaruan laporan.* | *`true` dan `false` sesuai hasil model.* | *Pass* |
| *C20-UT06* | *`simpan()`* | *Negatif* | *Simulasikan pembaruan status gagal di tengah transaksi.* | *Transaksi di-rollback; client dilepas; respons 404.* | *Query transaksi `BEGIN`, `ROLLBACK`; respons 404; client dilepas.* | *Pass* |
| *C20-UT07* | *`simpan()`* | *Negatif/Keamanan* | *Body berisi `idAdmin` palsu; sesi memuat `admin-sesi`.* | *ID admin diambil dari sesi, bukan body; transaksi commit.* | *Argumen model memakai ID sesi dan transaksi commit.* | *Pass* |
| *C20-UT08* | *`LaporanController.detail()` terkait tanggapan* | *Keamanan* | *Ambil detail sebagai warga dan admin.* | *Identitas admin disembunyikan dari warga dan diberikan kepada admin.* | *Kedua respons sesuai aturan visibilitas.* | *Pass* |
| *C20-UT09* | *`simpan()`* | *Negatif* | *Sesi kosong lalu role warga.* | *Respons 401 lalu 403.* | *Handler menghasilkan status sesuai harapan.* | *Pass* |
| *C20-UT10* | *`authorizeRoles()` pada route* | *Negatif/Keamanan* | *Middleware admin menerima sesi warga.* | *Respons 403 dan handler tidak diteruskan.* | *Status 403; `next()` tidak dipanggil.* | *Pass* |
| *C20-UT11* | *`authorizeRoles()` pada route* | *Negatif/Keamanan* | *Middleware admin menerima request tanpa sesi.* | *Respons 401 dan handler tidak diteruskan.* | *Status 401; `next()` tidak dipanggil.* | *Pass* |
| *C20-UT12* | *`validasiTanggapan()`* | *Batas* | *Deskripsi tepat 2000 karakter.* | *Form diterima.* | *Menghasilkan `true`.* | *Pass* |
| *C20-UT13* | *`validasiTanggapan()`* | *Batas/Negatif* | *Deskripsi 2001 karakter.* | *Form ditolak.* | *Menghasilkan `false`.* | *Pass* |
| *C20-UT14* | *`validasiTanggapan()`* | *Negatif* | *Status bukan boolean, deskripsi bukan string, dan data `null`.* | *Form ditolak.* | *Semua masukan menghasilkan `false`.* | *Pass* |
| *C20-UT15* | *`simpanTanggapan()`* | *Negatif* | *Form laporan tidak valid; query diberi penghitung pemanggilan.* | *Model tidak dipanggil.* | *Menghasilkan `false`; query tidak dipanggil.* | *Pass* |
| *C20-UT16* | *`simpanStatus()`* | *Batas* | *Status pertama pada `Laporan.STATUS_LAPORAN`, `BELUM_DILIHAT`.* | *Status diteruskan ke model dan berhasil.* | *Argumen status sesuai; menghasilkan `true`.* | *Pass* |
| *C20-UT17* | *`simpanStatus()`* | *Batas* | *Status terakhir pada `Laporan.STATUS_LAPORAN`, `SELESAI`.* | *Status diteruskan ke model dan berhasil.* | *Argumen status sesuai; menghasilkan `true`.* | *Pass* |
| *C20-UT18* | *`simpanStatus()`* | *Negatif* | *Status di luar enum, `TIDAK_VALID`.* | *Model laporan tidak dipanggil; hasil `false`.* | *Model tidak dipanggil; hasil `false`.* | *Pass* |
| *C20-UT19* | *`simpanStatus()`* | *Negatif* | *Model laporan melaporkan ID tidak ditemukan.* | *Hasil `false`.* | *Menghasilkan `false`.* | *Pass* |
| *C20-UT20* | *`simpan()`* | *Negatif* | *`idLaporan` bukan UUID.* | *Ditolak sebelum koneksi/transaksi, respons 404.* | *Respons 404; koneksi tidak dibuka.* | *Pass* |
| *C20-UT21* | *`simpan()`* | *Batas* | *Catatan pemeriksaan tepat 1000 karakter.* | *Pemeriksaan diteruskan dan transaksi berhasil.* | *Respons 200; transaksi commit.* | *Pass* |
| *C20-UT22* | *`simpan()`* | *Batas/Negatif* | *Catatan pemeriksaan 1001 karakter.* | *Ditolak sebelum koneksi/transaksi, respons 400.* | *Respons 400; koneksi tidak dibuka.* | *Pass* |

Tabel 4.2.14b. Ringkasan Cakupan Kelas C20

| Informasi | Keterangan |
| :--- | :--- |
| *Daftar operasi public pada DPPL* | *`validasiTanggapan()`, `simpanTanggapan()`, `simpanStatus()`* |
| *Operasi yang diuji* | *Ketiga operasi DPPL; handler publik `simpan(req, res)` juga diuji karena dipakai route* |
| *ID Algoritma yang tercakup* | *Algo-044, Algo-045, Algo-046* |
| *Coverage (wajib ≥ 70%)* | *78.77% baris / 80.39% cabang; Node.js `node:test` bawaan; bukti: `docs/M10/evidence/TanggapanController-coverage.txt`* |

### 4.2.15 Kelas TanggapanView

**ID Kelas:** *C13*  
**Nama Kelas:** *TanggapanView*  
**Tingkat:** *Sedang*

Tabel 4.2.15. Hasil Pengujian Unit Kelas C13

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C13-UT01* | *`simpanJikaTerkonfirmasi()`* | *Negatif* | *Konfirmasi dibatalkan.* | *Callback penyimpanan tidak dipanggil.* | *Menghasilkan `false`; callback tidak dipanggil.* | *Pass* |
| *C13-UT02* | *`simpanJikaTerkonfirmasi()`* | *Normal* | *Konfirmasi diterima; callback mengembalikan `"tersimpan"`.* | *Callback dipanggil satu kali dan hasilnya diteruskan.* | *Callback dipanggil satu kali; hasil diteruskan.* | *Pass* |


<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| *I-01* | *PenggunaController* | *Pengguna (Model)* | *Controller - Model* | *INT-TC01, INT-TC02, INT-TC03, INT-TC04, INT-TC05, INT-TC06* |
| *I-02* | *Pengguna (Model)* | *PostgreSQL* | *Aplikasi - Basis Data* | *INT-TC01, INT-TC03, INT-TC04, INT-TC05, INT-TC06* |
| *I-03* | *authService* | *Express API Auth* | *Frontend - Backend (HTTP)* | *INT-TC07* |
| *I-04* | *profileService* | *Express API Profile* | *Frontend - Backend (HTTP)* | *INT-TC08* |
| *I-05* | *Express Session* | *PostgreSQL Session Store* | *Aplikasi - Basis Data* | *INT-TC02, INT-TC09* |
| *I-06* | *LaporanController* | *Laporan (Model)* | *Controller - Model* | *INT-TC10, INT-TC11* |
| *I-07* | *LaporanController* | *Lokasi (Model) + PostgreSQL* | *Controller - Model - Basis Data* | *INT-TC10* |
| *I-08* | *LokasiController* | *Laporan (Model) + MapAPIService* | *Controller - Model/Layanan* | *INT-TC12, INT-TC13* |
| *I-09* | *laporanService (FE)* | *Express API Laporan* | *Frontend - Backend (HTTP)* | *INT-TC14, INT-TC15* |
| *I-10* | *lokasiService (FE)* | *Express API Lokasi* | *Frontend - Backend (HTTP)* | *INT-TC16, INT-TC17* |
| *I-11* | *MapAPIService* | *Layanan Peta Eksternal (Nominatim)* | *Aplikasi - Layanan Eksternal* | *INT-TC18, INT-TC19* |


Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *INT-TC01* | *I-01, I-02* | *Normal: Registrasi pengguna* | *Kirim POST /api/auth/register dengan nama, NIK 16 digit, email unik, password valid, dan nomor telepon valid melalui Supertest. Kemudian baca ulang data dari PostgreSQL.* | *HTTP 201, akun tersimpan dalam database dengan atribut sesuai masukan, ID pengguna dikembalikan, dan password disimpan dalam bentuk hash.* | *HTTP 201 diterima, ID pengguna dikembalikan, data berhasil ditemukan kembali pada PostgreSQL dengan atribut sesuai, dan password tersimpan dalam bentuk hash.* | *Pass* |
| *INT-TC02* | *I-01, I-02, I-05* | *Normal: Login pengguna* | *Kirim POST /api/auth/login menggunakan email dan password akun yang telah diregistrasi, kemudian kirim GET /api/auth/me menggunakan cookie sesi yang sama melalui Supertest agent.* | *HTTP 200, login berhasil, role warga dikembalikan, sesi dikenali, dan endpoint /api/auth/me mengembalikan informasi pengguna yang sesuai.* | *HTTP 200 diterima, pesan Login succeeded. dan role warga dikembalikan. Request GET /api/auth/me menggunakan sesi yang sama berhasil mengembalikan HTTP 200 dengan email dan role pengguna sesuai.* | *Pass* |
| *INT-TC03* | *I-01, I-02* | *Normal: Mengambil profil pengguna* | *Kirim GET /api/profile menggunakan sesi login aktif, kemudian bandingkan respons API dengan data pengguna pada PostgreSQL.* | *HTTP 200, data profil pengguna dikembalikan dan sesuai dengan data yang tersimpan pada database.* | *HTTP 200 diterima, data nama, email, nomor telepon, dan role berhasil dikembalikan. ID, nama, dan nomor telepon sesuai dengan hasil query PostgreSQL.* | *Pass* |
| *INT-TC04* | *I-01, I-02* | *Normal: Memperbarui profil pengguna* | *Kirim PUT /api/profile dengan nama "Integration Test Updated" dan nomor telepon "081298765432", kemudian baca ulang data melalui API dan PostgreSQL.* | *HTTP 200, perubahan profil berhasil disimpan dan data yang dibaca ulang sesuai dengan masukan.* | *HTTP 200 diterima dengan pesan "Profile updated successfully.". Nama dan nomor telepon berhasil diperbarui pada PostgreSQL serta sesuai saat dibaca ulang melalui GET /api/profile.* | *Pass* |
| *INT-TC05* | *I-01, I-02* | *Normal: Mengganti password pengguna* | *Kirim PUT /api/profile/password menggunakan password lama yang benar dan password baru "NewPassword2!", kemudian periksa perubahan hash pada PostgreSQL dan lakukan login ulang.* | *HTTP 200, hash password berubah, password tidak tersimpan sebagai plaintext, dan login dengan password baru berhasil.* | *HTTP 200 diterima dengan pesan "Password updated successfully.". Hash password pada PostgreSQL berubah dan berbeda dari plaintext. Login menggunakan password baru berhasil dengan HTTP 200 dan sesi baru dikenali melalui GET /api/auth/me.* | *Pass* |
| *INT-TC06* | *I-01, I-02, I-05* | *Normal: Menghapus akun pengguna* | *Kirim request DELETE melalui endpoint penghapusan akun dengan sesi login aktif, kemudian periksa keberadaan akun di PostgreSQL dan validitas sesi sebelumnya.* | *HTTP 200, akun terhapus dari database dan sesi pengguna tidak lagi dapat digunakan.* | *HTTP 200 diterima dengan pesan "Akun berhasil dihapus.". Query PostgreSQL tidak menemukan akun yang dihapus, sedangkan GET /api/auth/me menggunakan sesi lama mengembalikan HTTP 401.* | *Pass* |
| *INT-TC07* | *I-03* | *Normal: Login pengguna melalui frontend* | *Masukkan email dan password akun dummy melalui halaman login PenggunaView, kemudian periksa request POST /api/auth/login menggunakan Chrome DevTools pada tab Network.* | *Frontend berhasil mengirim request login ke backend, backend mengembalikan HTTP 200, sesi autentikasi terbentuk, dan pengguna berhasil masuk ke aplikasi.* | *Request POST /api/auth/login berhasil diproses dengan HTTP 200. Pengguna berhasil login dan diarahkan ke halaman aplikasi dalam keadaan terautentikasi.* | *Pass* |
| *INT-TC08* | *I-03* | *Normal: Registrasi pengguna melalui frontend* | *Isi formulir registrasi PenggunaView menggunakan nama, NIK, email, nomor telepon, dan password dummy yang valid. Kirim formulir dan periksa request POST /api/auth/register melalui Chrome DevTools.* | *Frontend berhasil mengirim data registrasi ke backend, backend mengembalikan HTTP 201, dan akun baru berhasil dibuat.* | *Request POST /api/auth/register berhasil diproses dengan HTTP 201. Registrasi berhasil dan akun dummy dapat digunakan untuk melakukan login.* | *Pass* |
| *INT-TC09* | *I-04* | *Normal: Memperbarui profil pengguna melalui frontend* | *Login menggunakan akun dummy, buka halaman profil, ubah nama dan nomor telepon, kemudian simpan perubahan. Periksa request PUT /api/profile melalui Chrome DevTools dan muat ulang halaman.* | *Frontend berhasil mengirim perubahan profil ke backend, backend mengembalikan HTTP 200, dan data profil terbaru tetap tersimpan setelah halaman dimuat ulang.* | *Request PUT /api/profile berhasil diproses dengan HTTP 200. Nama dan nomor telepon berhasil diperbarui pada tampilan profil serta tetap sesuai setelah halaman dimuat ulang.* | *Pass* |
| *INT-TC10* | *I-06, I-07* | *Normal: Pembuatan laporan menyimpan data dan lokasi dalam satu transaksi* | *Buat laporan dengan field wajib dan koordinat valid melalui mock. Periksa bahwa model `Laporan.simpan` menerima data yang benar, `Lokasi.simpan` dipanggil dalam transaksi yang sama, dan ID laporan berformat UUID dikembalikan.* | *HTTP 201; koordinat terkonversi dengan benar; ID laporan berformat UUID.* | *HTTP 201 diterima; `dataTersimpan.lokasi.getKoordinat()` mengembalikan `{latitude: -6.9, longitude: 107.6}`; ID laporan berformat UUID. Transaksi mock mengikuti urutan BEGIN, INSERT laporan, INSERT lokasi, COMMIT.* | *Pass* |
| *INT-TC11* | *I-06* | *Normal: Transaksi dibatalkan jika penyimpanan lokasi gagal* | *Mock `pool.connect` mengembalikan client yang melempar error pada `INSERT INTO lokasi`. Panggil `Laporan.simpan`.* | *Error diteruskan; query urutan: BEGIN, INSERT laporan, INSERT lokasi, ROLLBACK; client dilepaskan.* | *Error `database down` diteruskan; urutan query sesuai; `dilepas === true`.* | *Pass* |
| *INT-TC12* | *I-08* | *Normal: Pencarian laporan terdekat menyaring dan mengurutkan berdasarkan jarak* | *Mock `Laporan.getDaftarLaporan` mengembalikan 3 kandidat pada jarak berbeda. Panggil `LokasiController.cariLaporanTerdekat` dengan koordinat `(0, 0)`.* | *HTTP 200; kandidat di luar radius 5 km dibuang; hasil diurutkan dari jarak terdekat.* | *HTTP 200; `laporan` berisi `["dekat-1", "dekat-2"]` terurut; `radiusKm: 5`.* | *Pass* |
| *INT-TC13* | *I-08* | *Normal: Geocode memanggil layanan peta dan mengembalikan hasil* | *Mock `MapAPIService.geocode` mengembalikan hasil geocode. Panggil `LokasiController.ambilLokasiLaporan` dengan alamat `Bandung`.* | *HTTP 200; respons berisi latitude, longitude, dan alamat.* | *HTTP 200 dan respons sesuai mock.* | *Pass* |
| *INT-TC14* | *I-09* | *Normal: laporanService.daftarLaporan mengirim query dan credentials dengan benar* | *Mock `fetch` untuk menangkap URL dan opsi. Panggil `daftarLaporan({ kategori: "Ruang Publik", page: 2, limit: 12 })`.* | *URL pathname `/api/laporan`; query sesuai; `credentials: "include"`.* | *Pathname, query parameters, dan credentials sesuai. Hasil JSON dikembalikan.* | *Pass* |
| *INT-TC15* | *I-09* | *Normal: laporanService.buatLaporan mengirim FormData tanpa Content-Type manual* | *Mock `fetch`. Panggil `buatLaporan(formData)`.* | *URL `/api/laporan`; method POST; headers undefined (browser mengisi boundary sendiri).* | *URL, method, body, dan headers sesuai.* | *Pass* |
| *INT-TC16* | *I-10* | *Normal: lokasiService.geocode meng-encode alamat pada URL* | *Mock `fetch`. Panggil `geocode("Jalan Asia Afrika, Bandung")`.* | *URL pathname `/api/lokasi/geocode`; parameter `alamat` ter-encode benar.* | *Pathname dan parameter sesuai.* | *Pass* |
| *INT-TC17* | *I-10* | *Normal: lokasiService.laporanTerdekat mengirim koordinat dan radius* | *Mock `fetch`. Panggil `laporanTerdekat(-6.9, 107.6, 10)`.* | *URL pathname `/api/lokasi/terdekat`; query `latitude=-6.9`, `longitude=107.6`, `radius=10`.* | *Semua parameter terkirim sesuai.* | *Pass* |
| *INT-TC18* | *I-11* | *Normal: MapAPIService mengirim request geocoding ke layanan peta* | *Unit test mengganti `MapAPIService.geocode` dengan mock yang mengembalikan koordinat. Controller memanggil dan mengembalikan HTTP 200.* | *Layanan dipanggil; hasil geocode diteruskan.* | *Hasil geocode dikembalikan oleh controller.* | *Pass* |
| *INT-TC19* | *I-11* | *Negatif: Layanan peta tidak dapat dihubungi* | *Mock `MapAPIService.geocode` melempar error. Controller mengembalikan HTTP 502.* | *HTTP 502; pesan kegagalan layanan.* | *HTTP 502 dikembalikan.* | *Pass* |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case Melakukan Registrasi Akun

**ID Use Case:** *UC01*  
**Nama Use Case:** *Melakukan Registrasi Akun*

Tabel 4.4.1. Hasil Pengujian Use Case UC01

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC01-TC01* | *KF01, KF02* | *Normal: Registrasi berhasil* | *1. Buka halaman registrasi.<br>2. Isi seluruh field dengan data valid dan email/NIK yang belum terdaftar.<br>3. Klik Daftar.<br>4. Periksa hasil registrasi dan database.* | *Nama: Pengguna Test<br>NIK: 1234567890123456<br>Email: registrasi.test@example.com<br>Password: Password1!<br>No. telepon: 081234567890* | *Registrasi berhasil dan pesan keberhasilan ditampilkan.* | *Registrasi berhasil dan pesan “Registrasi berhasil! Silahkan masuk menggunakan akun Anda.” ditampilkan. Beralih ke halaman login*  | *Pass* |
| *UC01-TC02* | *KF01, KF02* | *Alternatif 1: Data registrasi tidak lengkap* | *1. Buka halaman registrasi.<br>2. Kosongkan field nama atau NIK.<br>3. Klik Daftar.<br>4. Periksa pesan validasi.* | *Nama: kosong atau NIK: kosong* | *Registrasi ditolak dan sistem menampilkan pesan bahwa field wajib harus diisi tanpa menyimpan akun.* | *Registrasi tidak berhasil dan muncul tulisan “Please fill out this field” pada kolom yang belum terisi.* | *Pass* |
| *UC01-TC03* | *KF01, KF02* | *Alternatif 2: Format NIK tidak valid* | *1. Buka halaman registrasi.<br>2. Isi data lain dengan benar.<br>3. Masukkan NIK dengan panjang 15 digit atau mengandung huruf.<br>4. Klik Daftar.* | *NIK: 123456789012345 atau 12345678901234A6* | *Registrasi ditolak dan sistem menampilkan pesan bahwa NIK harus terdiri dari 16 digit angka.* | *Registrasi ditolak dan sistem menampilkan pesan “Please match the requested format” pada bagian field NIK.* | *Pass* |
| *UC01-TC04* | *KF01, KF02* | *Alternatif 3: Format password tidak valid* | *1. Buka halaman registrasi.<br>2. Isi data lain dengan benar.<br>3. Masukkan password yang tidak memenuhi ketentuan.<br>4. Klik Daftar.* | *Password: abcdefg atau password123!* | *Registrasi ditolak dan sistem menampilkan pesan ketentuan password minimal 8 karakter serta harus mengandung huruf kapital, angka, dan simbol.* | *Registrasi ditolak dan muncul pesan kesalahan “Kata sandi harus mengandung huruf kapital, angka, dan simbol”.* | *Pass* |

### 4.4.2 Use Case Melakukan Registrasi Akun

**ID Use Case:** *UC02*  
**Nama Use Case:** *Melakukan Proses Login*

Tabel 4.4.2. Hasil Pengujian Use Case UC02

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC02-TC01* | *KF01, KF02* | *Normal: Login berhasil* | *1. Buka halaman login.<br>2. Masukkan email dan password akun terdaftar.<br>3. Klik Masuk.<br>4. Periksa session dan halaman setelah login.* | *Email: initestAKU@gmail.com<br>Password: INIpasswordAKU123! (warga) Email: admin@example.test<br>Password: AdminRawat123! (admin)* | *Login berhasil dan pengguna diarahkan ke halaman utama sesuai role.* | *Login berhasil dan pengguna diarahkan ke halaman utama sesuai role.* | *Pass* |
| *UC02-TC02* | *KF01, KF02* | *Alternatif 1: Data login belum lengkap* | *1. Buka halaman login.<br>2. Kosongkan email atau password.<br>3. Klik Masuk.<br>4. Periksa validasi.* | *Email: kosong atau Password: kosong* | *Login ditolak, sistem menampilkan pesan bahwa email/password wajib diisi* | *Login ditolak, pada field yang kosong ditampilkan pesan “Please fill out this field”.* | *Pass* |
| *UC02-TC03* | *KF01, KF02* | *Alternatif 2: Email belum terdaftar* | *1. Buka halaman login.<br>2. Masukkan email yang tidak terdaftar dan password valid.<br>3. Klik Masuk.<br>4. Periksa respons autentikasi.* | *Email: tidakterdaftar@example.com<br>Password: Password1!* | *Login ditolak dan sistem menampilkan pesan kesalahan.* | *Login ditolak dan muncul pesan “Wrong Email or Password* | *Pass* |
| *UC02-TC04* | *KF01, KF02* | *Alternatif 3: Password tidak sesuai* | *1. Buka halaman login.<br>2. Masukkan email terdaftar dan password yang salah.<br>3. Klik Masuk.<br>4. Periksa pesan kesalahan.* | *Email: wawaw@gmail.com<br>Password: InstagramdanWA123!* | *Login ditolak dan pesan kesalahan kredensial ditampilkan.* | *Login ditolak dan muncul pesan “Wrong Email or Password* | *Pass* |

### 4.4.3 Use Case Mengakses Peta Interaktif

**ID Use Case:** *UC03*  
**Nama Use Case:** *Mengakses Peta Interaktif*

Tabel 4.4.3. Hasil Pengujian Use Case UC03

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC03-TC01* | *KF03, KF04* | *Normal: Peta dan penanda laporan tampil* | *1. Login sebagai warga.<br>2. Buka halaman Peta Interaktif.<br>3. Periksa tampilan peta, penanda laporan, legenda status, dan daftar laporan.* | *Halaman peta interaktif* | *Peta Leaflet tampil dengan tile OpenStreetMap; penanda laporan (marker) tampil sesuai kategori/status; legenda status ditampilkan; daftar laporan di samping peta tampil.* | *Sesuai; peta, marker, legenda, dan daftar laporan tampil.* | *Pass* |
| *UC03-TC02* | *KF03, KF04* | *Normal: Izin lokasi diberikan, peta berpusat di lokasi pengguna* | *1. Buka halaman peta.<br>2. Browser meminta izin lokasi; berikan izin.<br>3. Periksa pusat peta dan daftar laporan.* | *Izin lokasi: diberikan* | *Peta berpusat di lokasi pengguna; daftar menampilkan laporan dalam radius awal 5 km.* | *Sesuai; peta berpusat dan daftar hanya menampilkan laporan terdekat.* | *Pass* |
| *UC03-TC03* | *KF03, KF04* | *Alternatif 1: Izin lokasi ditolak* | *1. Buka halaman peta.<br>2. Tolak izin lokasi.<br>3. Periksa banner dan perilaku halaman.* | *Izin lokasi: ditolak* | *Banner menjelaskan lokasi tidak tersedia; halaman tetap menampilkan semua laporan dan pencarian manual tersedia.* | *Sesuai; banner tampil dan pencarian manual berfungsi.* | *Pass* |
| *UC03-TC04* | *KF03, KF04* | *Alternatif 1 lanjutan: Coba lagi setelah ditolak* | *1. Setelah izin ditolak, tekan tombol coba lagi.<br>2. Berikan izin lokasi.* | *Izin lokasi: diberikan setelah ditolak* | *Browser meminta izin lokasi kembali; peta dan daftar beralih ke area pengguna.* | *Sesuai.* | *Pass* |
| *UC03-TC05* | *KF03, KF04* | *Normal: Mencari alamat yang ditemukan* | *1. Masukkan alamat di kolom pencarian peta.<br>2. Tekan Enter/cari.* | *Alamat: Jalan Asia Afrika, Bandung* | *Peta berpusat ke hasil pencarian; daftar laporan di sekitar lokasi tampil.* | *Sesuai.* | *Pass* |
| *UC03-TC06* | *KF03, KF04* | *Alternatif 2: Alamat tidak ditemukan* | *1. Masukkan alamat yang tidak dikenal di kolom pencarian.<br>2. Tekan Enter.* | *Alamat: xyznotfound12345* | *Pesan `Lokasi tidak ditemukan.` tampil; pusat peta tidak berubah.* | *Sesuai.* | *Pass* |
| *UC03-TC07* | *KF03, KF04* | *Normal: Memilih marker pada peta* | *1. Klik marker laporan pada peta.<br>2. Periksa popup.* | *Marker laporan* | *Popup menampilkan nama, kategori, status, dan tautan ke detail laporan.* | *Sesuai.* | *Pass* |
| *UC03-TC08* | *KF03, KF04* | *Normal: Tidak ada laporan di area* | *1. Pindah ke area tanpa laporan atau gunakan filter yang tidak cocok.<br>2. Periksa tampilan.* | *Filter: area kosong* | *Pesan keadaan kosong yang sesuai ditampilkan.* | *Sesuai.* | *Pass* |
| *UC03-TC09* | *KF03, KF04* | *Alternatif 3: API peta gagal dimuat* | *1. Simulasikan kegagalan layanan geocoding (backend mengembalikan HTTP 502).<br>2. Periksa pesan error dan kemampuan muat ulang.* | *Layanan peta tidak tersedia* | *Pesan kegagalan layanan peta ditampilkan; pengguna diarahkan memilih titik langsung di peta.* | *Backend mengembalikan HTTP 502 dengan pesan sesuai. Test backend BE-LOC-04 lulus.* | *Pass* |

### 4.4.4 Use Case Melihat Detail Laporan

**ID Use Case:** *UC04*  
**Nama Use Case:** *Melihat Detail Laporan*

Tabel 4.4.4. Hasil Pengujian Use Case UC04

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC04-TC01* | *KF05, KF06* | *Normal: Detail laporan tersedia* | *1. Buka daftar laporan.<br>2. Pilih salah satu laporan.<br>3. Periksa halaman detail.* | *Laporan dengan data lengkap* | *Halaman detail menampilkan kategori, status, urgensi, lokasi, deskripsi, foto, nama pelapor, dan tanggapan admin (jika ada).* | *Sesuai; semua informasi detail tampil.* | *Pass* |
| *UC04-TC02* | *KF05, KF06* | *Normal: Foto dan deskripsi opsional tidak ada* | *1. Buka detail laporan yang tidak memiliki foto dan deskripsi.* | *Laporan tanpa foto dan deskripsi* | *Detail tetap tampil; deskripsi menggunakan teks pengganti; area foto tidak ditampilkan.* | *Sesuai; teks pengganti tampil dan foto tidak ditampilkan.* | *Pass* |
| *UC04-TC03* | *KF05, KF06* | *Normal: Navigasi ke peta dari detail* | *1. Buka detail laporan.<br>2. Tekan tombol `Lihat di peta`.* | *Tombol Lihat di peta* | *Halaman peta terbuka dengan koordinat laporan sebagai pusat dan laporan tersebut difokuskan.* | *Sesuai.* | *Pass* |
| *UC04-TC04* | *KF05, KF06* | *Alternatif 1: Detail gagal dimuat* | *1. Simulasikan kegagalan API detail laporan (ID tidak valid atau laporan tidak ditemukan).<br>2. Periksa respons.* | *ID: bukan-uuid atau ID tidak ada* | *HTTP 404; pesan `Laporan tidak ditemukan`.* | *Backend mengembalikan HTTP 404. Test BE-LAP-15 lulus.* | *Pass* |

### 4.4.5 Use Case Mendapat Tutorial Navigasi antar Halaman

**ID Use Case:** *UC05*  
**Nama Use Case:** *Mendapat Tutorial Navigasi antar Halaman*

Tabel 4.4.5. Hasil Pengujian Use Case UC05

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC05-TC01* | *KF07* | *Normal: Pengguna pertama kali login melihat tutorial awal* | *1. Login dengan akun baru.<br>2. Buka beranda.<br>3. Periksa dialog tutorial awal.* | *Akun baru pertama kali login* | *Tutorial navigasi langkah awal ditampilkan secara otomatis.* | *Tutorial awal ditampilkan dengan benar.* | *Pass* |
| *UC05-TC02* | *KF07* | *Normal: Pengguna menyelesaikan tutorial hingga langkah terakhir* | *1. Ikuti langkah tutorial hingga selesai.<br>2. Tekan Selesai.* | *Langkah terakhir tutorial* | *Status tutorial disimpan; tutorial tidak muncul kembali pada kunjungan berikutnya.* | *Status tutorial berhasil disimpan dan tidak muncul kembali.* | *Pass* |



### 4.4.6 Use Case Melakukan Upvote

**ID Use Case:** *UC06*  
**Nama Use Case:** *Melakukan Upvote*

Tabel 4.4.6. Hasil Pengujian Use Case UC06

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC06-TC01* | *KF09, KF10, KF11* | *Normal: Pengguna memberikan upvote pada laporan lain* | *1. Login sebagai warga.<br>2. Klik tombol upvote pada laporan milik pengguna lain.<br>3. Periksa jumlah upvote dan status.* | *Laporan pengguna lain yang belum diupvote* | *Jumlah upvote bertambah 1, status tombol berubah menjadi telah diupvote, notifikasi berhasil tampil.* | *Upvote bertambah, tombol berubah aktif, skor populer diperbarui.* | *Pass* |
| *UC06-TC02* | *KF09, KF10, KF11* | *Alternatif 1: Pengguna mencoba upvote kembali pada laporan yang sama* | *1. Klik tombol upvote pada laporan yang sudah diupvote.* | *Laporan yang sudah diupvote* | *Permintaan ditolak (HTTP 409), jumlah upvote tidak bertambah ganda.* | *Sesuai; duplikasi upvote dicegah oleh sistem.* | *Pass* |

### 4.4.7 Use Case Mengunggah Laporan Baru

**ID Use Case:** *UC07*  
**Nama Use Case:** *Mengunggah Laporan Baru*

Tabel 4.4.7. Hasil Pengujian Use Case UC07

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC07-TC01* | *KF12, KF13, KF15* | *Normal: Unggah laporan berhasil dengan lokasi* | *1. Login sebagai warga.<br>2. Buka halaman Buat Laporan.<br>3. Isi form dengan nama masalah, kategori, urgensi, privasi, dan pilih titik pada peta.<br>4. Tekan Kirim Laporan dan konfirmasi.* | *Nama masalah: Jalan berlubang<br>Kategori: Jalan<br>Urgensi: TINGGI<br>Lokasi: pilih di peta* | *Dialog konfirmasi tampil; setelah konfirmasi, laporan tersimpan dan pengguna diarahkan ke detail laporan baru.* | *Sesuai; dialog konfirmasi tampil, HTTP 201, diarahkan ke detail.* | *Pass* |
| *UC07-TC02* | *KF12, KF13, KF15* | *Alternatif 1: Data wajib kosong* | *1. Buka halaman Buat Laporan.<br>2. Kosongkan nama masalah atau kategori.<br>3. Tekan Kirim.* | *Nama masalah: kosong* | *Pesan validasi wajib tampil; dialog konfirmasi tidak dibuka.* | *Sesuai.* | *Pass* |
| *UC07-TC03* | *KF12, KF13, KF15* | *Alternatif 2: Tanpa lokasi* | *1. Isi form tanpa alamat dan tanpa titik peta.<br>2. Tekan Kirim.* | *Lokasi: tidak dipilih* | *Pesan untuk menandai lokasi atau mengisi alamat tampil.* | *Sesuai.* | *Pass* |
| *UC07-TC04* | *KF12, KF13, KF15* | *Alternatif 3: Format foto tidak sesuai* | *1. Pilih file bukan JPG/PNG atau foto > 5 MB.<br>2. Periksa validasi.* | *Foto: file .txt atau > 5 MB* | *File ditolak; input file dikosongkan; pesan kesalahan tampil.* | *Sesuai; frontend menolak dan backend mengembalikan HTTP 400 untuk kedua kondisi.* | *Pass* |
| *UC07-TC05* | *KF12, KF13, KF15* | *Alternatif 4: Konfirmasi pengiriman dibatalkan* | *1. Isi form valid.<br>2. Tekan Kirim Laporan.<br>3. Pada dialog konfirmasi, tekan Batal.* | *Dialog: Batal* | *Dialog tertutup; laporan tidak dikirim dan form tetap dapat diedit.* | *Sesuai.* | *Pass* |
| *UC07-TC06* | *KF12, KF13, KF15* | *Normal: Laporan dengan alamat yang di-geocode* | *1. Isi form dengan alamat (bukan titik peta).<br>2. Alamat berhasil di-geocode.<br>3. Konfirmasi pengiriman.* | *Alamat: Jalan Asia Afrika, Bandung* | *Titik laporan ditampilkan pada peta; koordinat digunakan saat mengirim.* | *Sesuai.* | *Pass* |
| *UC07-TC07* | *KF12, KF13, KF15* | *Alternatif 5: Alamat tidak ditemukan saat geocode* | *1. Isi form dengan alamat tidak dikenal.<br>2. Periksa pesan.* | *Alamat: Alamat fiktif* | *Pesan bahwa alamat tidak ditemukan; pengguna diarahkan memilih titik di peta.* | *Sesuai; backend mengembalikan HTTP 400.* | *Pass* |


### 4.4.8 Use Case Memeriksa Laporan

**ID Use Case:** *UC08*  
**Nama Use Case:** *Memeriksa Laporan*

Tabel 4.4.8. Hasil Pengujian Use Case UC08

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC08-TC01* | *KF08, KF14, KF15* | *Normal: Admin memeriksa laporan dan menyatakan valid* | *1. Login sebagai admin.<br>2. Buka endpoint pemeriksaan laporan.<br>3. Kirim `valid: true` dengan catatan.* | *valid: true<br>catatan: Sudah diverifikasi.* | *HTTP 200; status validasi menjadi VALID; catatan tersimpan.* | *HTTP 200; argumen `[idLaporan, true, "Sudah diverifikasi."]` diteruskan ke model.* | *Pass* |
| *UC08-TC02* | *KF08, KF14, KF15* | *Normal: Admin menyatakan laporan tidak valid* | *1. Kirim `valid: false` dengan catatan alasan.* | *valid: false<br>catatan: Bukti tidak ditemukan.* | *HTTP 200; status menjadi TIDAK_VALID; batas waktu konfirmasi 14 hari dipasang.* | *HTTP 200; model menerima `false`; query berisi `make_interval(days => 14)`.* | *Pass* |
| *UC08-TC03* | *KF08, KF14, KF15* | *Alternatif 1: Laporan tidak valid, dikonfirmasi ulang oleh pemilik* | *1. Pemilik membuka laporan yang dinyatakan tidak valid sebelum batas waktu.<br>2. Kirim konfirmasi ulang.* | *Pemilik mengirim konfirmasi ulang* | *HTTP 200; status kembali ke BELUM_DIPERIKSA; batas waktu dihapus.* | *HTTP 200; query berisi `status_validasi = 'BELUM_DIPERIKSA'` dan `batas_waktu > NOW()`.* | *Pass* |
| *UC08-TC04* | *KF08, KF14, KF15* | *Alternatif 2: Konfirmasi ulang ditolak karena batas waktu lewat* | *1. Batas waktu konfirmasi sudah terlewati.<br>2. Pemilik mencoba mengirim konfirmasi ulang.* | *Batas waktu: sudah lewat* | *HTTP 409; konfirmasi ulang ditolak; `kirimKonfirmasiUlang` tidak dipanggil.* | *HTTP 409 dan model tidak dipanggil.* | *Pass* |
| *UC08-TC05* | *KF08, KF14, KF15* | *Alternatif 3: Penghapusan otomatis laporan kedaluwarsa* | *1. Laporan TIDAK_VALID melewati batas waktu 14 hari tanpa konfirmasi ulang.<br>2. Job pembersih berkala dijalankan.* | *Batas waktu: lewat* | *Laporan dihapus otomatis; file foto yang terkait ikut dihapus.* | *Model `hapusSemuaKadaluarsa` menghapus laporan dengan `status_validasi = 'TIDAK_VALID' AND batas_waktu <= NOW()`; job `bersihkan()` menghapus file foto terkait. Teruji melalui kode `pembersihLaporan.js`.* | *Pass* |
| *UC08-TC06* | *KF08, KF14, KF15* | *Negatif: Pengguna non-admin mengakses endpoint pemeriksaan* | *1. Login sebagai warga.<br>2. Coba akses endpoint pemeriksaan.* | *Role: warga* | *HTTP 403; aksi ditolak oleh middleware role.* | *Test middleware role lulus (BE-ADM-08).* | *Pass* |


### 4.4.9 Use Case Memperbarui Status Penanganan Laporan

**ID Use Case:** *UC09*  
**Nama Use Case:** *Memperbarui Status Penanganan Laporan*

Tabel 4.4.9. Hasil Pengujian Use Case UC09

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC09-TC01* | *KF17, KF18* | *Normal* | *1. Login admin dan pilih laporan.<br>2. Buka form pemeriksaan/tanggapan.<br>3. Isi hasil valid, catatan, tanggapan, dan status.<br>4. Tinjau konfirmasi dan tekan “Simpan hasil”.<br>5. Periksa hasil pada daftar laporan admin.* | *Hasil valid; catatan pemeriksaan; tanggapan kosong; status `SELESAI`.* | *Sistem menyimpan tanggapan dan status; pesan berhasil ditampilkan dan laporan berstatus Valid/Selesai.* | *FE-TGP-03.1 menunjukkan konfirmasi hasil valid/status Selesai; FE-TGP-03.2 menunjukkan pesan berhasil dan laporan berstatus Valid/Selesai. Sesuai catatan uji manual lama.* | *Pass (catatan uji dan screenshot lama; tidak diuji ulang pada tag release)* |
| *UC09-TC02* | *KF17, KF18* | *Alternatif 1: admin membatalkan konfirmasi perubahan status* | *1. Login admin dan isi form tanggapan/status.<br>2. Tinjau konfirmasi.<br>3. Tekan “Batal”.<br>4. Pastikan form kembali tanpa penyimpanan.<br>5. Ubah status, simpan ulang, lalu konfirmasi.* | *Status awal `DILIHAT`; batalkan konfirmasi pertama; pilih `SELESAI` pada percobaan kedua.* | *Pembatalan tidak mengirim penyimpanan dan mengembalikan form; hanya konfirmasi kedua yang mengubah laporan.* | *FE-TGP-04.1/.2 menunjukkan dialog dengan tombol Batal, tetapi tidak menunjukkan tombol ditekan atau form dikembalikan. C13-UT01 hanya menguji utility, bukan UI.* | *[BELUM DIUJI]* |
| *UC09-TC03* | *KF17* | *Tambahan: validasi alasan untuk laporan tidak valid* | *1. Login admin.<br>2. Pilih hasil tidak valid dan kosongkan tanggapan.<br>3. Kirim form untuk ditinjau.* | *`statusTanggapan = false`; deskripsi kosong atau hanya spasi.* | *UI menampilkan validasi dan tidak mengirim penyimpanan.* | *FE-TGP-02.1 menunjukkan pesan “Alasan tanggapan wajib diisi” saat tanggapan kosong.* | *Pass (screenshot uji manual lama)* |
| *UC09-TC04* | *KF17* | *Tambahan: batas panjang masukan* | *1. Isi catatan pemeriksaan dan tanggapan hingga batas karakter.* | *Catatan maksimal 1000 karakter; tanggapan maksimal 2000 karakter.* | *Form membatasi catatan hingga 1000 karakter dan tanggapan hingga 2000 karakter.* | *FE-TGP-06 dan catatan uji manual lama menunjukkan form dengan teks panjang. Batas backend 2000/2001 dan 1000/1001 juga lulus pada C20-UT12/13 dan C20-UT21/22; jumlah karakter pada screenshot tidak terbaca persis.* | *Pass (bukti manual lama dan batas backend; hitungan UI persis tidak diverifikasi)* |
| *UC09-TC05* | *KF17, KF18* | *Tambahan: pelapor melihat hasil pemeriksaan pada detail laporan* | *1. Admin menyimpan hasil pemeriksaan tidak valid beserta alasan.<br>2. Pelapor membuka detail laporan.* | *Laporan `TIDAK_VALID`; alasan tanggapan dan batas konfirmasi ulang ditampilkan.* | *Detail laporan menampilkan hasil pemeriksaan, tanggapan admin, dan batas konfirmasi ulang kepada pelapor.* | *FE-TGP-05.1–05.4 dan catatan uji manual lama menunjukkan hasil tidak valid, tanggapan, serta batas konfirmasi ulang pada daftar/detail pelapor. Aksi kirim konfirmasi ulang tidak termasuk kasus ini.* | *Pass (catatan uji dan screenshot lama; tidak diuji ulang pada tag release)* |



### 4.4.10 Use Case Mengelola Profil

**ID Use Case:** *UC10*  
**Nama Use Case:** *Mengelola Profil*

Tabel 4.4.10. Hasil Pengujian Use Case UC10

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC10-TC01* | *KF16* | *Normal: Pengguna mengubah profil* | *1. Login menggunakan akun terdaftar.<br>2. Buka halaman Profil.<br>3. Klik Ubah Profil.<br>4. Masukkan nama dan nomor telepon baru.<br>5. Klik Simpan.<br>6. Muat ulang halaman untuk memeriksa perubahan.* | *Nama: Integration Test Updated<br>No. telepon: 081298765432* | *Sistem berhasil memperbarui data profil dan menampilkan informasi terbaru.* | *Nama dan nomor telepon pada informasi pribadi berubah.* | *Pass* |
| *UC10-TC02* | *KF16* | *Normal: Pengguna berhasil menghapus akun* | *1. Login menggunakan akun terdaftar.<br>2. Buka halaman Profil.<br>3. Klik Hapus Akun.<br>4. Pada dialog konfirmasi, klik Ya.<br>5.Coba login dengan email dan password akun yang dihapus.* | *Akun pengguna terdaftar<br>Konfirmasi: Ya* | *Ketika login menggunakan akun terhapus, terdapat pesan kesalahan. | *Ketika login menggunakan akun terhapus, dan muncul pesan kesalahan “Wrong email or password”.* | *Pass* |
| *UC10-TC03* | *KF16* | *Alternatif 1: Pengguna membatalkan penghapusan akun* | *1. Login menggunakan akun terdaftar.<br>2. Buka halaman Profil.<br>3. Klik Hapus Akun.<br>4. Ketika dialog konfirmasi muncul, klik Batal.<br>5. Periksa keberadaan akun dan tampilan halaman.* | *Akun pengguna terdaftar<br>Konfirmasi: Batal* | *Dialog konfirmasi ditutup dan akun pengguna tetap tersedia.* | *Akun pengguna tetap tersedia* | *Pass* |


<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Security* | *100% password pengguna baru disimpan dalam bentuk hash, bukan plaintext.* | *Registrasi akun dummy melalui frontend, kemudian inspeksi kolom hash_password pada tabel pengguna menggunakan PostgreSQL.* | *Password akun hasil registrasi tersimpan dalam kolom hash_password dan berbeda dari password plaintext yang dimasukkan* | *Pass* |
| *KNF01-TC02* | *KNF01* | *Security* | *100% pengiriman kredensial login dan registrasi melalui koneksi HTTPS.* | *Periksa protokol request login dan registrasi pada Chrome DevTools, tab Network → Headers → Request URL, serta validitas sertifikat HTTPS.* |*Request URL berbentuk HTTPS.* | *PASS* |
| *KNF10-TC01* | *KNF10* | *Security* | *100% percobaan akses profil tanpa sesi autentikasi ditolak dengan HTTP 401.* | *Pengujian manual menggunakan Google Chrome dan Chrome DevTools. Pengguna melakukan logout, kemudian mencoba mengakses kembali halaman profil dan endpoint GET /api/profile tanpa sesi autentikasi.* | *Akses profil ditolak, pengguna diarahkan ke halaman login, dan GET /api/profile menghasilkan HTTP 401.* | *Pass* |
| *KNF02-TC01* | *KNF02* | *Compatibility* | *100% data alamat berhasil dikirim ke layanan peta eksternal dan hasil geocoding dikembalikan untuk menampilkan lokasi pada peta.* | *Pengujian otomatis unit test backend: `LokasiController.getKoordinat()` mengirim alamat ke MapAPIService, respons geocoding divalidasi mengandung latitude dan longitude. Test case: BE-LOC-01 s.d. BE-LOC-04.* | *Seluruh 4 test case geocoding (forward & reverse) lulus; koordinat dan alamat berhasil dikembalikan dari mock layanan peta.* | *Pass* |
| *KNF10-TC02* | *KNF10* | *Security* | *100% percobaan akses endpoint laporan tanpa sesi autentikasi ditolak dengan HTTP 401.* | *Pengujian otomatis unit test backend: request ke endpoint pembuatan laporan (`POST /api/laporan`) dan pemeriksaan laporan admin tanpa middleware autentikasi aktif. Test case: BE-LAP-17 (authMiddleware).* | *Request tanpa sesi ditolak dengan HTTP 401 dan pesan "Please log in to continue".* | *Pass* |
| *KNF10-TC03* | *KNF10* | *Security* | *100% percobaan akses endpoint admin oleh pengguna non-admin ditolak dengan HTTP 403.* | *Pengujian otomatis unit test backend: request ke endpoint admin (`PUT /api/laporan/:id/status`) dengan role "warga". Test case: BE-ADM-08, BE-ADM-09.* | *Request dengan role warga ditolak dengan HTTP 403 dan pesan "Hanya admin".* | *Pass* |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

### 4.6.1 Bukti Hasil Pengujian

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C01-UT01 – C01-UT09* | *![alt text](assets/c01.png)* |
| *C15-UT01 – C15-UT24* | *![alt text](assets/C15.png)* |
| *C08-UT01 – C08-UT08* | *![alt text](assets/c08.png)* |
| *C15 (coverage)* | *![alt text](assets/C15COV.png)* |
| *C17-UT01 – C17-UT30* | Output Test Runner Backend Node.js: `PASS — 48 test laporan/lokasi lulus (tests/LaporanLokasiController.test.js)` |
| *C18-UT01 – C18-UT09* | Output Test Runner Backend Node.js: `PASS — 9 unit test lokasi lulus (tests/LaporanLokasiController.test.js)` |
| *C03-UT01 – C03-UT09* | Output Test Runner Backend Node.js: `PASS — unit test model Laporan/Lokasi lulus` |
| *INT-TC01 – INT-TC06* | *![alt text](assets/tc01-tc06.png)* |
| *INT-TC07 – INT-TC08* | ![alt text](assets/tc07.png) |
| *INT-TC09* | ![alt text](assets/tc09.png) |
| *INT-TC10 – INT-TC13* | Output Test Runner Backend Node.js (`LaporanLokasiController.test.js` skenario transaksi & controller-service) |
| *INT-TC14 – INT-TC19* | Output Test Runner Frontend Node.js (`laporan-lokasi-services.test.js` - 8 test lulus) |
| *UC01-TC01* | ![Halaman Registrasi](../../src/test/screenshots/halamanregis.png) ![Bukti Registrasi Database](../../src/test/screenshots/buktiintegrasi.png) |
| *UC01-TC02* | ![Validasi Nama Kosong](../../src/test/screenshots/errornama.png) |
| *UC01-TC03* | ![Validasi NIK 15 Digit](../../src/test/screenshots/nik15.png) ![Validasi NIK Mengandung Huruf](../../src/test/screenshots/nikhuruf.png) |
| *UC01-TC04* | ![Validasi Format Password](../../src/test/screenshots/sandiformat.png) ![Validasi Password 7 Karakter](../../src/test/screenshots/password7.png) |
| *UC02-TC01* | ![Halaman Login](../../src/test/screenshots/login.png) |
| *UC02-TC02* | ![Validasi Email Kosong](../../src/test/screenshots/emailkosong.png) ![Validasi Password Kosong](../../src/test/screenshots/passkosong.png) |
| *UC02-TC03* | *![Tidak terdaftar](../../src/test/screenshots/loginHapus.png)* |
| *UC02-TC04* | *![Tidak terdaftar](../../src/test/screenshots/loginHapus.png)* |
| *UC03-TC01* | ![Halaman Peta Interaktif](../../src/test/screenshots/FE-LOC-01.png) |
| *UC03-TC02* | ![Izin Lokasi Browser](../../src/test/screenshots/FE-LOC-02.png) |
| *UC03-TC03* | ![Izin Lokasi Ditolak](../../src/test/screenshots/FE-LOC-03.png) |
| *UC03-TC04* | ![Tombol Coba Lagi](../../src/test/screenshots/FE-LOC-04.png) |
| *UC03-TC05* | ![Pencarian Lokasi Ditemukan](../../src/test/screenshots/FE-LOC-05.png) |
| *UC03-TC06* | ![Pencarian Lokasi Tidak Ditemukan](../../src/test/screenshots/FE-LOC-06.png) |
| *UC03-TC07* | ![Marker Laporan Popup](../../src/test/screenshots/FE-LOC-09.png) |
| *UC03-TC08* | ![Keadaan Kosong Peta](../../src/test/screenshots/FE-LOC-08.png) |
| *UC04-TC01* | ![Daftar Laporan Warga](../../src/test/screenshots/FE-LAP-01.png) ![Detail Laporan](../../src/test/screenshots/FE-LAP-04.png) |
| *UC04-TC02* | ![Detail Tanpa Foto](../../src/test/screenshots/FE-VW-07-detail-laporan.png) |
| *UC04-TC03* | ![Detail ke Peta](../../src/test/screenshots/FE-LAP-06.png) |
| *UC05-TC01 – UC05-TC02* | ![Tutorial Awal](../../src/test/screenshots/FE-TU-01-tutorial-awal.png) |
| *UC06-TC01 – UC06-TC02* | ![Upvote Bertambah](../../src/test/screenshots/FE-UP-01-upvote-bertambah.png) ![Upvote Tidak Duplikat](../../src/test/screenshots/FE-UP-02-upvote-tidak-duplikat.png) |
| *UC07-TC01* | ![Halaman Buat Laporan](../../src/test/screenshots/FE-BUAT-01.png) ![Dialog Konfirmasi](../../src/test/screenshots/FE-BUAT-09.png) ![Konfirmasi Valid](../../src/test/screenshots/FE-BUAT-11.png) |
| *UC07-TC02* | ![Validasi Tanpa Nama Masalah](../../src/test/screenshots/FE-BUAT-02.png) |
| *UC07-TC03* | ![Validasi Tanpa Lokasi](../../src/test/screenshots/FE-BUAT-03.png) |
| *UC07-TC04* | ![Validasi Foto Lebih Dari 5MB](../../src/test/screenshots/FE-BUAT-08.png) |
| *UC07-TC05* | ![Batal Dialog Konfirmasi](../../src/test/screenshots/FE-BUAT-10.png) |
| *UC07-TC06* | ![Titik Lokasi Geocoding](../../src/test/screenshots/FE-BUAT-05.png) |
| *UC07-TC07* | ![Alamat Geocoding Tidak Ditemukan](../../src/test/screenshots/FE-BUAT-06.png) |
| *UC08-TC01 – UC08-TC06* | Output Test Runner Backend Node.js: `BE-ADM-01 s.d. BE-ADM-12 (LaporanLokasiController.test.js)` |
| *UC09-TC01 – UC09-TC03* | Output Test Runner Backend Node.js: `BE-ADM-06, BE-ADM-07, BE-ADM-06b (LaporanLokasiController.test.js)` |
| *UC10-TC01* | ![alt text](assets/AWALPROFIL.png)![alt text](assets/AKHIRPROFIL.png)|
| *UC10-TC02* | ![Konfirmasi Hapus Akun](../../src/test/screenshots/konfirmasiHapus.png) ![Login Ditolak Setelah Akun Dihapus](../../src/test/screenshots/loginHapus.png) ![Akun Terhapus dari Database](../../src/test/screenshots/dbHapus.png) |
| *UC10-TC03* | ![Dialog Konfirmasi Hapus Akun](../../src/test/screenshots/konfirmasiHapus.png)|
| *KNF01-TC01* | ![Bukti Password Hashing di Database](../../src/test/screenshots/buktiintegrasi.png) |
| *KNF01-TC02* | *![alt text](assets/reqURL.png)* |
| *KNF10-TC01* | ![alt text](assets/unauthorized.png) |
| *KNF02-TC01* | Output Test Runner Backend Node.js: `PASS — BE-LOC-01 s.d. BE-LOC-04 geocoding test (LaporanLokasiController.test.js)` |
| *KNF10-TC02* | Output Test Runner Backend Node.js: `PASS — BE-LAP-17 auth middleware rejection (LaporanLokasiController.test.js)` |
| *KNF10-TC03* | Output Test Runner Backend Node.js: `PASS — BE-ADM-08, BE-ADM-09 role-based access control (LaporanLokasiController.test.js)` |
| **INT-TC11 (Upvote)** | ![Upvote Berhasil](../../src/test/INT-TC11-Upvote-Berhasil.png) ![Upvote Tetap Tersimpan Setelah Refresh](../../src/test/INT-TC11-Upvote-Persist.png) |
| **INT-TC12 (Tutorial)** | ![Tutorial Ditampilkan](../../src/test/INT-TC12-Tutorial.png) ![Tutorial Tidak Muncul Kembali Setelah Refresh](../../src/test/INT-TC12-Tutorial-Persist.png) |
| **UC06-TC02** | ![Pencegahan Upvote Duplikat](../../src/test/UC06-TC02-Duplicate.png) |
| **UC04-TC03** | ![Filter Homepage Berhasil Diterapkan](../../src/test/UC04-TC03-Filter.png) |
| **INT-TC11 (Upvote)** | ![Upvote Berhasil](../../src/test/INT-TC11-Upvote-Berhasil.png) ![Upvote Tetap Tersimpan Setelah Refresh](../../src/test/INT-TC11-Upvote-Persist.png) |
| **INT-TC12 (Tutorial)** | ![Tutorial Ditampilkan](../../src/test/INT-TC12-Tutorial.png) ![Tutorial Tidak Muncul Kembali Setelah Refresh](../../src/test/INT-TC12-Tutorial-Persist.png) |
| **UC06-TC02** | ![Pencegahan Upvote Duplikat](../../src/test/UC06-TC02-Duplicate.png) |
| **UC04-TC03** | ![Filter Homepage Berhasil Diterapkan](../../src/test/UC04-TC03-Filter.png) |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF01* | *KNF01, KNF02* | *UC01, UC02* | *C01, C08, C15* | `Pengguna.js`, `PenggunaView.jsx`, `PenggunaController.js` | *UC01-TC01, UC01-TC02, UC01-TC03, UC01-TC04, UC02-TC01, UC02-TC02, UC02-TC03, UC02-TC04* | *C15-UT01 s.d. C15-UT06, C01-UT01 s.d. C01-UT03, C08-UT01, C08-UT02, C08-UT04, C08-UT05, INT-TC01, INT-TC02, INT-TC07, INT-TC08, KNF01-TC01, KNF01-TC02* |
| *KF02* | *KNF01, KNF10* | *UC01, UC02* | *C01, C08, C15* | `Pengguna.js`, `PenggunaView.jsx`, `PenggunaController.js`, `authMiddleware.js` | *UC01-TC02 s.d. UC01-TC04, UC02-TC02 s.d. UC02-TC04* | *C15-UT02, C15-UT03, C15-UT05, C15-UT06, C08-UT01, C08-UT05, INT-TC02, KNF10-TC01* |
| *KF03* | *-* | *UC03* | *C04, C11, C18, C22, C23, C24* | `Lokasi.js`, `LokasiView.jsx`, `LokasiController.js`, `mapApi.js`, `MapAPIService.js`, `PetaLaporan.jsx`, `lokasiService.js` | *UC03-TC01, UC03-TC02, UC03-TC03, UC03-TC04, UC03-TC05, UC03-TC06, UC03-TC08, UC03-TC09* | *C18-UT01 s.d. C18-UT09, INT-TC12, INT-TC13, INT-TC16, INT-TC17, INT-TC18, INT-TC19* |
| *KF04* | *-* | *UC03* | *C04, C11, C18, C24* | `LokasiView.jsx`, `PetaLaporan.jsx`, `LokasiController.js` | *UC03-TC01, UC03-TC07, UC03-TC08* | *C18-UT05, C18-UT09, FE-LOC-01, FE-LOC-09* |
| *KF05* | *-* | *UC04* | *C03, C10, C17* | `Laporan.js`, `LaporanView.jsx`, `LaporanController.js`, `laporanService.js` | *UC04-TC01, UC04-TC02, UC04-TC03, UC04-TC04* | *C17-UT17, C17-UT18, C17-UT19, C03-UT03, C03-UT04, C03-UT05, INT-TC14* |
| *KF06* | *-* | *UC04* | *C03, C10, C17* | `Laporan.js`, `LaporanView.jsx`, `LaporanController.js` | *UC04-TC01, UC04-TC02* | *C17-UT05, C17-UT14, C03-UT03* |
| *KF07* | *-* | *UC05* | *C07, C14, C21* | `Tutorial.js`, `TutorialView.jsx`, `TutorialController.js`, `tutorialService.js` | *UC05-TC01, UC05-TC02* | *C07-UT01 s.d. C07-UT03, C21-UT01 s.d. C21-UT06* |
| *KF08* | *-* | *UC08* | *C03, C17* | `Laporan.js`, `LaporanController.js`, `pembersihLaporan.js` | *UC08-TC01, UC08-TC02, UC08-TC03, UC08-TC04, UC08-TC05, UC08-TC06* | *C17-UT20 s.d. C17-UT24, C17-UT28 s.d. C17-UT30, C03-UT06 s.d. C03-UT09* |
| *KF09* | *-* | *UC06* | *C05, C12, C19* | `Upvote.js`, `UpvoteView.jsx`, `UpvoteController.js`, `upvoteService.js` | *UC06-TC01, UC06-TC02* | *C05-UT01 s.d. C05-UT05, C19-UT01 s.d. C19-UT08* |
| *KF10* | *-* | *UC06* | *C05, C12, C19* | `UpvoteView.jsx`, `UpvoteController.js` | *UC06-TC01, UC06-TC02* | *C19-UT01, C19-UT06, C19-UT07* |
| *KF11* | *-* | *UC06* | *C02, C03, C05, C16* | `Homepage.js`, `Laporan.js`, `HomepageController.js` | *UC06-TC01* | *C02-UT01 s.d. C02-UT04, C16-UT01 s.d. C16-UT03, C05-UT01* |
| *KF12* | *-* | *UC07* | *C03, C04, C10, C17, C18, C23* | `Laporan.js`, `Lokasi.js`, `BuatLaporanView.jsx`, `LaporanController.js`, `MapAPIService.js` | *UC07-TC01, UC07-TC02, UC07-TC03, UC07-TC05, UC07-TC06, UC07-TC07* | *C17-UT01 s.d. C17-UT08, C03-UT01, C03-UT02, INT-TC10, INT-TC15* |
| *KF13* | *-* | *UC07* | *C03, C10, C17* | `LaporanController.js`, `uploadMiddleware.js`, `BuatLaporanView.jsx` | *UC07-TC01, UC07-TC04* | *C17-UT09, C17-UT10, C17-UT11, C17-UT13* |
| *KF14* | *-* | *UC08* | *C03, C10, C17* | `Laporan.js`, `PeriksaLaporanView.jsx`, `LaporanController.js` | *UC08-TC01, UC08-TC02, UC08-TC06* | *C17-UT20 s.d. C17-UT24, C03-UT06, C03-UT07* |
| *KF15* | *-* | *UC07, UC08* | *C03, C04, C17* | `Laporan.js`, `Lokasi.js`, `LaporanController.js` | *UC07-TC01, UC08-TC01, UC08-TC02* | *C17-UT01, C17-UT12, C17-UT13, C03-UT01, C03-UT02, INT-TC10, INT-TC11* |
| *KF16* | *KNF10* | *UC10* | *C01, C08, C15* | `Pengguna.js`, `ProfilView.jsx`, `PenggunaController.js`, `roleMiddleware.js` | *UC10-TC01, UC10-TC02, UC10-TC03* | *C15-UT07 s.d. C15-UT18, C01-UT04 s.d. C01-UT07, C08-UT03, C08-UT06 s.d. C08-UT08, INT-TC03 s.d. INT-TC06, INT-TC09, KNF10-TC01* |
| *KF17* | *-* | *UC09* | *C03, C06, C10, C17, C20* | `Laporan.js`, `Tanggapan.js`, `PeriksaLaporanView.jsx`, `LaporanController.js`, `TanggapanController.js` | *UC09-TC01, UC09-TC02, UC09-TC03* | *C17-UT25, C17-UT26, C17-UT27* |
| *KF18* | *-* | *UC09* | *C03, C10, C17* | `Laporan.js`, `LaporanView.jsx`, `LaporanController.js`, `laporanService.js` | *UC09-TC01* | *C17-UT25, C17-UT27, INT-TC14* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Security* | *KF01, KF02 / UC01, UC02* | *KNF01-TC01, KNF01-TC02* |
| *KNF02* | *Compatibility* | *KF03, KF12 / UC03, UC07* | *KNF02-TC01* |
| *KNF03* | *Interaction Capability* | *Seluruh KF / Seluruh UC* | *Belum diuji secara formal (memerlukan evaluasi heuristik)* |
| *KNF04* | *Performance Efficiency* | *KF11 / UC06* | *Belum diuji (memerlukan load test)* |
| *KNF05* | *Performance Efficiency* | *KF11 / UC06* | *Belum diuji (memerlukan stress test)* |
| *KNF06* | *Availability* | *KF12 / UC07* | *Belum diuji (memerlukan monitoring uptime)* |
| *KNF07* | *Flexibility* | *Seluruh KF / Seluruh UC* | *Belum diuji secara formal (memerlukan cross-browser testing)* |
| *KNF08* | *Interaction Capability* | *KF12 / UC07* | *Tercakup melalui UC07-TC02, UC07-TC03, UC07-TC04* |
| *KNF09* | *Performance Efficiency* | *KF15, KF17 / UC08, UC09* | *Belum diuji (memerlukan pengukuran waktu sinkronisasi)* |
| *KNF10* | *Security* | *KF01, KF02, KF08, KF14, KF16, KF17 / UC01, UC02, UC08, UC09, UC10* | *KNF10-TC01, KNF10-TC02, KNF10-TC03* |
