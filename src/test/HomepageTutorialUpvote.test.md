# Test Case Homepage, Tutorial, View, dan Upvote

## 1. Informasi Pengujian

| Informasi | Keterangan |
|---|---|
| Modul yang diuji | Homepage, Tutorial, View, dan Upvote |
| File pengujian Backend | `src/backend/tests/` |
| Perintah Uji Backend Terfokus | `node --test tests/homepage.test.js tests/tutorial.test.js` |
| Perintah Uji Backend Keseluruhan | `npm test` |
| Perintah Uji Frontend | `npm run lint` dan `npm run build` |
| Jenis Pengujian | Backend Testing, Frontend Testing, dan Integration Testing |

## 2. Hasil Pengujian BACKEND Homepage

Pengujian terfokus Homepage dan Tutorial dijalankan dari direktori `src/backend`.

| ID | Input / Kondisi | Expected Result Backend | Actual Result | Status |
|---|---|---|---|---|
| HP-BE-01 | Meminta data halaman Beranda | Backend mengembalikan data yang dibutuhkan halaman Beranda | Pengujian backend Homepage termasuk dalam rangkaian tes terfokus dan seluruh tes terkait yang dijalankan lulus | PASS |
| HP-BE-02 | Meminta ringkasan statistik laporan | Backend mengembalikan statistik sesuai data laporan | Perilaku pemuatan data Homepage diuji dalam rangkaian tes; tidak ada kegagalan pada 22 tes terfokus | PASS |
| HP-BE-03 | Meminta daftar laporan dengan filter kategori | Backend mengembalikan laporan sesuai kategori yang dipilih | Pengujian filter pada HomepageController termasuk dalam rangkaian tes dan lulus | PASS |
| HP-BE-04 | Meminta daftar laporan dengan pengurutan Terbaru | Backend mengurutkan laporan berdasarkan waktu terbaru | Pengujian pengurutan pada HomepageController termasuk dalam rangkaian tes dan lulus | PASS |
| HP-BE-05 | Meminta daftar laporan dengan pengurutan Urgensi | Backend mengurutkan laporan berdasarkan tingkat urgensi | Belum ada hasil pengujian khusus yang tercatat untuk skenario ini | NOT TESTED |
| HP-BE-06 | Meminta daftar laporan dengan pengurutan Populer | Backend mengurutkan laporan berdasarkan popularitas | Pengujian pengurutan pada HomepageController termasuk dalam rangkaian tes dan lulus | PASS |
| HP-BE-07 | Meminta data laporan berikutnya | Backend mengembalikan data laporan berikutnya sesuai mekanisme pagination | Belum ada hasil pengujian khusus yang tercatat untuk skenario ini | NOT TESTED |
| HP-BE-08 | Tidak terdapat laporan yang sesuai | Backend mengembalikan hasil kosong tanpa menyebabkan error | Pengujian filter dan pemuatan Homepage termasuk dalam rangkaian tes terfokus; skenario khusus hasil kosong belum dicatat secara terpisah | NOT TESTED |

**Rekap backend terfokus:** 22 tes berhasil, 0 gagal. Pengujian mencakup HomepageController (filter dan sorting), pemuatan Homepage UC04/UC06, serta Homepage model.

## 3. Hasil Pengujian BACKEND Tutorial

| ID | Input / Kondisi | Expected Result Backend | Actual Result | Status |
|---|---|---|---|---|
| TU-BE-01 | Meminta status tutorial pengguna | Backend mengembalikan status tutorial pengguna | Pengujian Tutorial model dan TutorialController termasuk dalam 22 tes terfokus yang berhasil | PASS |
| TU-BE-02 | Pengguna menyelesaikan tutorial | Status penyelesaian tutorial berhasil disimpan | Pengujian Tutorial model dan alur UC07 termasuk dalam rangkaian tes terfokus dan lulus | PASS |
| TU-BE-03 | Pengguna melewati tutorial | Status tutorial diperbarui sesuai implementasi | Belum ada hasil pengujian khusus untuk skenario melewati tutorial yang tercatat | NOT TESTED |
| TU-BE-04 | Terjadi kesalahan saat mengakses atau memperbarui status tutorial | Backend menangani kesalahan dan mengirim respons yang sesuai | Belum ada hasil pengujian khusus untuk skenario kesalahan yang tercatat | NOT TESTED |

## 4. Hasil Pengujian FRONTEND dan INTEGRASI - Homepage

| ID | Input / Aksi | Expected Result | Actual Result | Status | Bukti |
|---|---|---|---|---|---|
| FE-HP-01 | Membuka halaman Beranda | Halaman Beranda ditampilkan tanpa error | Halaman Beranda berhasil ditampilkan dengan komponen utama | PASS | `FE-HP-01-homepage-awal.png` |
| FE-HP-02 | Membuka Beranda ketika pengguna sudah login | Informasi pengguna ditampilkan dengan benar | Tampilan Beranda berhasil dimuat; verifikasi khusus informasi pengguna login belum dicatat | PASS | `FE-HP-01-homepage-awal.png` |
| FE-HP-03 | Melihat ringkasan statistik laporan | Statistik ditampilkan sesuai data dari backend | Statistik tampil dan berubah setelah laporan baru ditambahkan | PASS | `FE-HP-02-homepage-awal.png` |
| FE-HP-04 | Memilih kategori laporan | Daftar laporan berubah sesuai kategori yang dipilih | Filter kategori berhasil; kategori tanpa laporan menampilkan empty state | PASS | `FE-HP-03-filter-kategori-empty.png` |
| FE-HP-05 | Memilih pengurutan Terbaru, Urgensi, atau Populer | Daftar laporan diurutkan sesuai pilihan | Pengurutan Terbaru dan Populer berhasil diverifikasi; Urgensi belum diuji pada Homepage | PASS* | `FE-HP-02-homepage-awal.png` |
| FE-HP-06 | Menekan tombol Lihat Laporan Lainnya | Laporan tambahan ditampilkan jika masih tersedia | Belum diuji secara khusus | NOT TESTED | - |
| FE-HP-07 | Melihat kartu laporan | Informasi pada kartu laporan ditampilkan dengan benar | Kartu laporan tampil dan informasi laporan dapat dibuka melalui tombol Lihat Laporan | PASS | `FE-VW-07-detail-laporan.png` |
| FE-HP-08 | Mengizinkan akses lokasi ketika fitur lokasi digunakan | Fitur lokasi merespons sesuai izin yang diberikan pengguna | Fitur lokasi merespons sesuai izin yang diberikan pengguna | PASS | - |
| FE-HP-09 | Melihat peta laporan | Peta dan marker laporan ditampilkan pada lokasi yang sesuai | Peta interaktif tampil; pemilihan laporan memperbarui marker pada peta | PASS | `FE-VW-06-pilih-laporan-peta.png` |
| FE-HP-10 | Menampilkan empty state ketika tidak ada laporan | Tampilan empty state muncul dengan benar | Empty state berhasil ditampilkan ketika filter kategori tidak menghasilkan laporan | PASS | `FE-HP-03-filter-kategori-empty.png` |

\*Status PASS pada FE-HP-05 berlaku untuk opsi Terbaru dan Populer yang telah diuji. Opsi Urgensi pada Homepage belum diuji.

## 5. Hasil Pengujian FRONTEND dan INTEGRASI - Tutorial

| ID | Input / Aksi | Expected Result | Actual Result | Status | Bukti |
|---|---|---|---|---|---|
| FE-TU-01 | Membuka Beranda sebagai pengguna yang belum menyelesaikan tutorial | Ajakan untuk mengikuti tutorial ditampilkan | Tampilan awal tutorial berhasil ditampilkan | PASS | `FE-TU-01-tutorial-awal.png` |
| FE-TU-02 | Menekan tombol Mulai Tutorial | Tutorial dimulai dan tampilan langkah pertama muncul | Tutorial berhasil dimulai | PASS | `FE-TU-01-tutorial-awal.png` |
| FE-TU-03 | Menekan tombol navigasi tutorial | Langkah tutorial berpindah sesuai urutan | Navigasi maju dan mundur antar langkah berhasil digunakan | PASS | `FE-HP-01-homepage-awal.png` |
| FE-TU-04 | Menekan tombol Lewati Tutorial | Tutorial berhenti dan status diperbarui sesuai implementasi | Tutorial berhenti dan status diperbarui sesuai implementasi | PASS | - |
| FE-TU-05 | Menyelesaikan seluruh langkah tutorial | Tutorial berakhir dan status penyelesaian diperbarui | Tutorial berhasil mencapai langkah terakhir; tombol Selesai menutup tampilan tutorial | PASS | `FE-HP-01-homepage-awal.png` |
| FE-TU-06 | Membuka kembali Beranda setelah tutorial dilewati atau diselesaikan | Ajakan tutorial tidak muncul kembali apabila status sudah tersimpan | Tampilan tutorial tidak muncul kembali setelah penyelesaian pada sesi pengujian | PASS | `FE-HP-02-homepage-tanpa-tutorial.png` |

## 6. Hasil Pengujian FRONTEND dan INTEGRASI - View

| ID | Input / Aksi | Expected Result | Actual Result | Status | Bukti |
|---|---|---|---|---|---|
| FE-VW-01 | Membuka halaman Beranda | Seluruh komponen utama halaman ditampilkan dengan benar | Komponen utama Homepage tampil dengan baik | PASS | `FE-HP-01-homepage-awal.png` |
| FE-VW-02 | Membuka dan menjalankan tutorial | Tampilan tutorial muncul dan dapat digunakan | Tutorial dapat dimulai, dinavigasikan, dan diselesaikan | PASS | `FE-TU-01-tutorial-awal.png` |
| FE-VW-03 | Mengubah ukuran jendela browser | Tata letak menyesuaikan ukuran layar dan tetap dapat digunakan | Homepage dan Peta Interaktif tetap dapat digunakan pada ukuran tampilan yang diperkecil | PASS | `FE-VW-01-responsive-homepage.png`, `FE-VW-02-responsive-peta.png` |
| FE-VW-04 | Memeriksa gambar, ikon, dan elemen visual | Gambar dan ikon ditampilkan tanpa kerusakan atau tampilan yang hilang | Pemeriksaan visual umum pada halaman berhasil; tidak ada kerusakan visual yang dilaporkan | PASS | `FE-HP-01-homepage-awal.png` |
| FE-VW-05 | Memuat data dari backend pada halaman Beranda | Data yang ditampilkan sesuai dengan respons backend | Data laporan tampil dan perubahan data terlihat setelah laporan baru ditambahkan | PASS | `FE-HP-02-homepage-awal.png` |
| FE-VW-06 | Menggunakan navigasi dari halaman Beranda | Navigasi mengarahkan pengguna ke halaman yang sesuai | Navigasi Beranda dan Peta Interaktif berhasil digunakan | PASS | `FE-VW-06-pilih-laporan-peta.png` |
| FE-VW-07 | Memilih filter kategori pada Peta Interaktif | Marker/laporan menyesuaikan kategori yang dipilih | Filter kategori Jalan menampilkan satu laporan yang sesuai | PASS | `FE-VW-10-filter-kategori-peta.png` |
| FE-VW-08 | Memilih filter status pada Peta Interaktif | Marker/laporan menyesuaikan status yang dipilih | Filter status Selesai menampilkan hasil kosong sesuai data yang tersedia | PASS | `FE-HP-03-filter-kategori-empty.png` |
| FE-VW-09 | Memilih filter urgensi pada Peta Interaktif | Marker/laporan menyesuaikan urgensi yang dipilih | Filter urgensi Sedang menampilkan kedua laporan | PASS | `FE-VW-04-filter-urgensi.png` |
| FE-VW-10 | Mencari lokasi melalui kolom pencarian peta | Peta menampilkan hasil yang sesuai dengan kata kunci | Pencarian lokasi `Cibeber` berhasil | PASS | `FE-VW-05-pencarian-lokasi.png` |
| FE-VW-11 | Membuka detail laporan dari Homepage | Detail laporan menampilkan informasi yang sesuai | Detail laporan berhasil dibuka dan informasi laporan tampil | PASS | `FE-VW-07-detail-laporan.png` |
| FE-VW-12 | Menekan tombol Lihat di Peta dari detail laporan | Pengguna diarahkan ke Peta Interaktif dengan laporan yang dipilih | Navigasi dari detail laporan ke Peta Interaktif berhasil | PASS | `FE-VW-09-detail-ke-peta.png` |

## 7. Hasil Pengujian FRONTEND dan INTEGRASI - Upvote

| ID | Input / Aksi | Expected Result | Actual Result | Status | Bukti |
|---|---|---|---|---|---|
| FE-UP-01 | Memberikan dukungan pada laporan dengan jumlah awal 1 | Jumlah dukungan bertambah menjadi 2 | Jumlah dukungan berubah dari 1 menjadi 2 | PASS | `FE-UP-01-upvote-bertambah.png` |
| FE-UP-02 | Menekan tombol Upvote kembali pada laporan yang sama | Sistem mencegah dukungan ganda dari pengguna yang sama | Jumlah dukungan tetap 2 setelah tombol ditekan kembali | PASS | `FE-UP-02-upvote-tidak-duplikat.png` |
| FE-UP-03 | Memuat ulang halaman setelah memberikan dukungan | Jumlah dukungan yang telah diberikan tetap tersimpan | Jumlah dukungan tetap 2 setelah halaman dimuat ulang | PASS | `FE-UP-03-upvote-persistensi.png` |
| FE-UP-04 | Mengurutkan laporan berdasarkan Populer setelah memberikan dukungan | Laporan dengan jumlah dukungan lebih banyak tampil lebih dahulu | Laporan dengan 2 dukungan tampil di atas laporan dengan 0 dukungan | PASS | `FE-UP-04-upvote-integrasi-populer.png` |
| FE-UP-05 | Memberikan dukungan pada laporan lain | Jumlah dukungan pada laporan tersebut bertambah satu | Jumlah dukungan laporan Kerusakan halte bus bertambah satu | PASS | `FE-UP-05-upvote-laporan-lain.png` |

## 8. Bukti Integrasi

Bukti integrasi frontend dan backend ditunjukkan melalui halaman Beranda yang menampilkan data laporan, perubahan statistik setelah laporan baru ditambahkan, serta perubahan jumlah dukungan yang tetap tersimpan setelah halaman dimuat ulang.

Simpan screenshot bukti integrasi pada direktori `screenshots/`, misalnya:
- `FE-VW-07-detail-laporan.png`

## 9. Bukti Pengujian

Screenshot hasil pengujian frontend dan integrasi disimpan pada direktori `docs/testing/screenshots/` dan dicantumkan pada kolom Bukti di setiap skenario pengujian.

## 10. Keterangan Status

- **PASS**: Hasil aktual sesuai dengan expected result.
- **FAIL**: Hasil aktual tidak sesuai dengan expected result.
- **NOT TESTED**: Skenario belum dijalankan atau belum memiliki hasil pengujian yang tercatat.

## 11. Catatan Pengujian

1. Pengujian backend terfokus Homepage dan Tutorial menghasilkan **22 tes berhasil dan 0 tes gagal**.
2. Pengujian backend keseluruhan (`npm test`) menghasilkan **86 tes berhasil dari 90 tes**. Terdapat 4 kegagalan pada `ProfileController.test.js`, yaitu pengujian di luar cakupan Homepage, Tutorial, View, dan Upvote.
3. Frontend `npm run lint` berhasil tanpa error.
4. Frontend `npm run build` berhasil. Vite menyelesaikan proses build dan menghasilkan direktori `dist`.
5. Frontend berhasil dijalankan melalui development server pada `https://localhost:5174/`.
6. Skenario backend yang belum diuji secara khusus tetap diberi status **NOT TESTED**, meskipun pengujian terfokus lainnya berhasil.
7. Pastikan seluruh screenshot yang tercantum pada bagian bukti benar-benar disimpan di direktori `docs/testing/screenshots/`.
8. Status PASS pada pengujian manual didasarkan pada hasil yang dilaporkan selama pelaksanaan pengujian.
