7<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 2
<br>
REQUIREMENT GATHERING
</h1>
<br>

## *RAWAT (Ruang Aspirasi Warga dan Aduan Terpadu)*

### Untuk: *Agatha Tatianingseto*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K01* |
| Kelompok | *01*  |

| NIM | Nama |
|---|---|
| *13525103* | *Ravinka Fathia Adinegara* |
| *13525013* | *Samantha Michelle S Silaban* |
| *13525055* | *Syakira Azzahra Rachmania* |
| *13525043* | *Aufa Tatsbita Zahra* |
| *13525046* | *Ghiffari Arya Adhitya* |
---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Menambahkan user story 08 dan user story 09 pada 2.1* |
| *B* | |
| *C* | |
| ... | |

<br>
<br>

# BAB 1: Deskripsi Umum

## 1.1 Deskripsi Umum Sistem

<!-- Abstraksikan sistem solusi menurut sudut pandang pengguna yang telah ditentukan. Jelaskan secara ringkas mengenai apa saja ekspektasi pengguna terhadap sistem yang akan dikembangkan, alur kerja sistem yang diinginkan, serta harapan dari penerapan solusi dalam bentuk narasi.

> *Sistem adalah kesatuan utuh antara perangkat lunak, pengguna, perangkat keras, dan proses bisnis (urutan langkah logis yang dilakukan di dunia nyata untuk menyelesaikan suatu pekerjaan atau mencapai tujuan tertentu).* -->

Secara umum, sistem dengan nama RAWAT (Ruang Aspirasi Warga dan Aduan Terpadu adalah sebuah sistem yang memungkinkan pengubungan lebih lanjut antara para pengguna fasilitas umum seperti penduduk kota dan pengelolanya seperti pemerintah agar keluhan dan masalah terkait kerusakan fasilitas umum dapat ditangani dan pengelola dapat lebih mudah mengawasi fasilitas umum apa saja yang perlu perhatian lebih. Dalam sistem ini, pengguna dapat melapor hal-hal yang terasa mengganggu atau rusak di lingkungan atau di tempat publik. Pemerintah lokal dapat menggunakan sistem ini untuk mengawasi kondisi lapangan langsung dari warga yang menggunakan fasilitas yang tersedia.

Fungsi utama dari RAWAT adalah untuk melaporkan kondisi tertentu yang menyangkut fasilitas umum atau hal yang berkaitan dengan ruang masyarakat yang dinilai mengganggu banyak pengguna fasilitas, seperti pohon tumbang atau banyaknya ular yang berkeliaran. Dalam sistem ini, terdapat sebuah seksi yang memungkinkan pengguna untuk menuliskan lokasi, nama kerusakan, jenis kerusakan, tingkat urgensi, serta hal-hal yang bersifat opsional seperti foto dan deskripsi singkat. Laporan tersebut akan disimpan dan ditampilkan di suatu halaman yang dapat diurutkan berdasarkan urgensi, tag, waktu posting, atau jumlah upvote. Setiap laporan terdapat fitur upvote dan komentar agar masyarakat dapat lebih menekankan suatu isu. Untuk platform, dipilih sebagai web app sehingga dapat digunakan secara universal asalkan mempunyai browser dan koneksi internet.

Inovasi sistem ini dibandingkan dengan sistem yang sudah ada bisa dilihat dari hal-hal berikut.
* Sistem ini dapat mengkategorikan laporan berdasarkan urgensi.
* Sistem ini tidak perlu menginstall aplikasi dan dapat diakses melalui browser.
* Sistem ini mempunyai fitur komentar dan upvote untuk setiap postingannya.

Seperti yang telah disebutkan, fitur utama dari aplikasi adalah pelaporan fasilitas umum yang rusak. Berikut ini alur lengkap dari sistem kerja RAWAT.
1. Pengguna membuka peta dan memilih lokasi fasilitas atau ruang umum yang ingin dilaporkan.
2. Pengguna mengisi formulir yang berisi nama, tingkat penggunaan, jenis yang dapat ditulis sendiri atau memilih yang sudah ada, serta menambah foto dan deskripsi apabila dibutuhkan.
3. Pengguna menekan tombol simpan.
4. Sistem menyimpan laporan tersebut dan menampilkannya bersama laporan lain.
5. Admin mengecek laporan dan menangani laporan.
6. Admin menandai laporan tersebut sebagai selesai setelah ditangani.
7. Sistem menandai laporan tersebut sebagai selesai dan tidak menampilkannya di laman utama lagi.

## 1.2 Deskripsi Pengguna Perangkat Lunak

| Aktor | Deskripsi |
| :--- | :--- |
| *Pengguna* | *Pihak ini melaporkan isu-isu yang terjadi di daerah dan berhak memperoleh informasi terkait laporan yang tersedia. Karakteristik dari pengguna ini mengutamakan kemudahan pelaporan dan keakuratan informasi lingkungan* |
| *Admin* | *Pengguna ini bertugas memantau dan mengelola sistem. Pengguna ini mengutamakan kejelasan informasi di laporan dan integritas data laporan* |


---

# BAB 2: Deskripsi Kebutuhan Perangkat Lunak

## 2.1 Kebutuhan Pengguna Awal


| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | *Pengguna* |  *Mengakses sistem melalui proses registrasi atau login* | *Dapat menggunakan fitur-fitur sistem sesuai dengan perannya* |
| US-02 | *Pengguna* | *Menjelajahi peta dan informasi laporan yang tersedia* | *Dapat mengetahui permasalahan yang telah dilaporkan beserta lokasi dan detailnya* |
| US-03 | *Pengguna* | *Memberikan upvote pada laporan* | *Dapat menunjukkan bahwa suatu permasalahan dianggap penting atau relevan* |
| US-04 | *Pengguna* | *Membuat laporan permasalahan baru dengan memasukkan informasi yang diperlukan* | *Dapat menyampaikan permasalahan di lingkungan agar tercatat dan dapat ditindaklanjuti* |
| US-05 | *Admin* |  *Mengakses sistem melalui proses login* | *Dapat menggunakan fitur pengelolaan laporan sesuai dengan perannya* |
| US-06 | *Admin* |  *Memantau laporan yang tersedia beserta detailnya* | *Dapat mengetahui dan memahami permasalahan yang perlu ditindaklanjuti* |
| US-07 | *Admin* |  *Memperbarui status laporan* | *Dapat mencatat perkembangan penanganan permasalahan dan memberikan informasi terbaru kepada pengguna* |
| US-08 | *Pengguna* | *Memberikan komentar* | *Dapat memberikan komentar di bawah laporan pengguna lain untuk mendukung atau mengomentari laporan tersebut* |
| US-09 | *Pengguna* | *Mengelola profil* | *Dapat mengubah foto profil dan _display name_ yang akan ditampilkan ketika pengguna mengunggah laporan atau memberi komentar* |

## 2.2 Deskripsi Aktivitas



| ID | Aktivitas | Penjelasan | ID User Story |
| :--- | :--- | :--- | :--- |
| A01 | *Mengakses sistem* | *Admin maupun pengguna memulai proses mengakses sistem, yakni dengan melakukan login atau registrasi bagi pengguna yang belum mendaftar* | *US-01 dan US-05* |
| A02 | *Menjelajahi peta* | *Pengguna dapat mengakses peta lokasi yang dipilih beserta informasi terkait laporan yang ada di daerah tersebut* | *US-02*|
| A03 | *Melihat informasi laporan* | *Pengguna dapat melihat informasi dan data terkait laporan yang ada, seperti alamat/lokasi, nama masalah, tag kategori, tingkat permasalahan, beserta foto dan deskripsi (jika ada)* | *US-02*|
| A04 | *Memberikan upvote* | *Pengguna dapat memberikan upvote pada masalah yang dianggap urgent atau relevan* | *US-03*|
| A05 | *Membuat laporan baru* | *Pengguna dapat membuat laporan baru dan memasukkan data terkait berupa lokasi (bisa langsung pilih di peta), nama masalah, tag kategori, tingkat permasalahan, serta foto dan deskripsi (opsional)* | *US-04*|
| A06 | *Memantau laporan* | *Admin dapat melakukan pemantauan terhadap laporan yang masuk dan sistem bisa  menampilkannya berdasarkan kategori, lokasi, ataupun tingkat permasalahan/urgensi, sehingga memudahkan admin dalam melakukan proses pemantauan ini* | *US-06*|
| A07 | *Memperbarui status  laporan* | *Admin dapat memperbarui status laporan sesuai dengan kondisi terkini dan sistem akan menyimpan informasi tersebut* | *US-07*|

## 2.3 Pemetaan Kebutuhan

Berikut ini adalah tabel pemetaan kebutuhan yang disusun berdasarkan tabel deskripsi aktivitas yang tertera sebelumnya.

| ID Kebutuhan | ID Aktivitas | Jenis Kebutuhan | Deskripsi Kebutuhan | P/L |
| :--- | :--- | :--- | :--- | :--- |
| *R01* | *A01* | *User* | *Pengguna maupun admin dapat melakukan proses login atau registrasi (bagi pengguna baru).* | *Ya* |
| *R02* | *A01* | *System* | *Sistem harus memeriksa kredensial user sebelum memberikan akses akun* | *Ya* |
| *R03* | *A02* | *User* | *Pengguna dapat mengakses peta interaktif yang menampilkan informasi terkait laporan yang ada* | *Ya* |
| *R04* | *A02* | *System* | *Sistem dapat mengintegrasikan informasi terkait laporan pada map, terdapat ikon pada titik lokasi yang dilaporkan sesuai dengan kategorinya* | *Ya* |
| *R05* | *A03* | *User* | *Pengguna dapat melihat informasi mengenai laporan seperti alamat/lokasi, nama masalah, tag kategori, tingkat permasalahan, beserta foto dan deskripsi (jika ada)* | *Ya* |
| *R06* | *A03* | *System* | *Sistem memperlihatkan status kedaruratan suatu laporan* | *Ya* |
| *R07* | *A03* | *System* | *Sistem dapat menyajikan tampilan interaktif dan mudah dipahami untuk akses laporan* | *Ya* |
| *R08* | *A03* | *Business* | *Informasi yang ada harus sesi kondisi riil, bukan berita bohong, sesuai yang tercantum pada Pasal 28 Undang-Undang Nomor 1 Tahun 2024 tentang Informasi dan Transaksi Elektronik* | *Tidak* |
| *R09* | *A04* | *User* | *Pengguna dapat melakukan upvote untuk suatu laporan yang dirasa urgent atau relevan* | *Ya* |
| *R10* | *A04* | *System* | *Sistem memiliki algoritma sehingga masalah yang punya banyak poin upvote ataupun masalah yang tergolong urgent akan muncul di atas* | *Ya* |
| *R11* | *A05* | *User* | *Pengguna dapat membuat laporan baru dan memasukkan data terkait laporan tersebut* | *Ya* |
| *R12* | *A06* | *User* | *Admin dapat mengakses informasi mengenai laporan kemudian memprosesnya* | *Ya* |
| *R13* | *A06* | *System* | *Sistem menyediakan proses sinkronisasi sesuai status laporan* | *Ya* |
| *R14* | *A06* | *Business* | *Hak akses data hanya untuk akun pihak yang berkepentingan saja, sesuai dengan aspek confidentiality pada CIA Triad (Stallings, 2018)* | *Tidak* |
| *R15* | *A07* | *User* | *Admin dapat memperbarui status penanganan laporan* | *Ya* |



## 2.4 Kebutuhan Fungsional (KF)


| ID KF | ID Kebutuhan | Penjelasan |
| :--- | :--- | :--- |
| *KF01* | *R01* | *Perangkat lunak dapat menyediakan fitur registrasi akun untuk pengguna baru dan fitur login bagi admin maupun pengguna.* |
| *KF02* | *R02* | *Ketika pengguna atau admin hendak mengakses perangkat lunak, perangkat lunak dapat memvalidasi kredensial pengguna atau admin tersebut.* |
| *KF03* | *R04* | *Perangkat lunak dapat menampilkan peta interaktif yang terintegrasi dengan sistem berdasarkan data lokasi laporan yang tersimpan.* |
| *KF04* | *R04* | *Perangkat lunak dapat menampilkan informasi umum suatu laporan pada peta dengan menggunakan simbol, penanda, dan tata letak yang konsisten.* |
| *KF05* | *R05* | *Ketika pengguna hendak melihat detail laporan, perangkat lunak harus dapat menampilkan detail informasi berupa lokasi, nama masalah, kategori, tingkat permasalahan, serta foto dan deskripsi apabila tersedia.* |
| *KF06* | *R06* | *Perangkat lunak dapat menampilkan tingkat kedaruratan atau tingkat permasalahan pada setiap laporan dengan label yang sesuai dengan tingkat kedaruratannya.* |
| *KF07* | *R07* | *Perangkat lunak dapat menyediakan navigasi dari halaman utama hingga ke halaman detail laporan dan memberikan tutorial awal mengenai cara penggunaannya.* |
| *KF08* | *R08* | *Perangkat lunak harus menampilkan dan mengelola informasi laporan sesuai dengan ketentuan perundang-undangan* |
| *KF09* | *R09* | *Bila pengguna merasa laporan pengguna lain relevan, maka perangkat lunak harus memungkinkan pengguna memberikan upvote pada laporan tersebut.* |
| *KF10* | *R09* | *Ketika upvote yang dilakukan oleh pengguna gagal ataupun berhasil, perangkat lunak harus memberikan notifikasi singkat kepada pengguna .* |
| *KF11* | *R10* | *Perangkat lunak dapat menampilkan laporan yang sedang trending dengan mengurutkan atau memprioritaskan tampilan laporan berdasarkan jumlah upvote terbaru yang diperoleh.* |
| *KF12* | *R11* | *Ketika pengguna hendak membuat laporan baru, perangkat lunak harus menyediakan formulir isian untuk data yang diperlukan, seperti informasi lokasi, nama masalah, kategori, tingkat permasalahan, foto (opsional), dan deskripsi (opsional).* |
| *KF13* | *R11* | *Perangkat lunak dapat memberikan informasi mengenai format file foto yang dapat diinput oleh pengguna dan memvalidasi apakah input file dari pengguna sesuai dengan ketentuan, juga memberikan notifikasi apakah pengiriman laporan gagal/berhasil.* |
| *KF14* | *R12* | *Ketika admin hendak memeriksa laporan pengguna, perangkat lunak harus memungkinkan admin melihat dan memproses laporan yang masuk.* |
| *KF15* | *R13* | *Ketika ada laporan baru yang masuk, perangkat lunak dapat melakukan sinkronisasi dengan menyimpan dan menampilkan data terakhir yang berhasil diinput oleh user.* |
| *KF16* | *R14* | *Perangkat lunak dapat membatasi akses terhadap data dan fitur berdasarkan hak akses akun pengguna atau admin.* |
| *KF17* | *R15* | *Ketika terjadi perubahan status laporan di lapangan, perangkat lunak dapat memungkinkan admin memperbarui status penanganan laporan tersebut.* |
| *KF18* | *R16* | *Perangkat lunak dapat melakukan sinkronisasi dengan menyimpan dan menampilkan status laporan yang telah diperbarui oleh admin kepada pengguna.* |


## 2.5 Kebutuhan Non-Fungsional (KNF)

Berikut adalah kebutuhan non-fungsional perangkat lunak berdasarkan ISO/IEC 25010:2023.

| ID KNF | ID Kebutuhan | Parameter | Deskripsi Kebutuhan |
| :--- | :--- | :--- | :--- |
| *KNF01* | *R01* | *Security* | *Sistem harus melindungi kredensial User melalui koneksi terenkripsi HTTPS dan password harus disimpan dalam bentuk hash.* |
| *KNF02* | *R04* | *Compatibility* |*Sistem harus dapat mengirimkan data alamat ke layanan peta eksternal melalui API dan menggunakan hasil geocoding yang dikembalikan untuk menampilkan lokasi pada peta.* |
| *KNF03* | *R07* | *Interaction Capability* |*Sistem harus memenuhi 90% UI/UX guideline yang dibuat berdasarkan Nielsen’s 10 Usability Heuristics.*| 
| *KNF04* | *R10* | *Performance Efficiency* |*Sistem harus dapat menghitung 95% permintaan untuk menampilkan ranking laporan trending selama maksimal 2 detik.*|
| *KNF05* | *R10* | *Performance Efficiency* |*Sistem harus mampu melayani 1000 pengguna aktif secara bersamaan pada fitur trending dengan tingkat kegagalan request kurang dari 1%* |
| *KNF06* | *R11* | *Availability* |*Sistem harus menjaga layanan pelaporan tetap dapat diakses oleh User selama 24 jam per hari di luar pemeliharaan terjadwal.* |
| *KNF07* | *R11* | *Flexibility* |*Sistem harus dapat berfungsi pada Google Chrome, Microsoft Edge, dan Mozilla Firefox tanpa kehilangan fungsi utama* |
| *KNF08* | *R11* | *Interaction Capability* |*Apabila pengguna mengisi kuesioner dengan format yang salah, sistem harus dapat  menolak jawaban tersebut tanpa menghapus data lain yang telah diisi.*|
| *KNF09* | *R13* | *Performance Efficiency* |*Sistem harus menyelesaikan sinkronisasi perubahan status laporan dalam waktu maksimal 5 detik setelah perubahan status berhasil disimpan.* |
| *KNF10* | *R13* | *Reliability* |*Apabila terjadi gangguan sinkronisasi, sistem harus dapat kembali memulihkan status laporan ke kondisi terbaru tanpa kehilangan data laporan lain.* |
| *KNF10* | *R14* | *Security* |*Sistem harus menerapkan Role-Based Access Control (RBAC) dengan memeriksa role User pada setiap permintaan akses ke data yang dilindungi.* |



<br>

# Referensi
## Daftar Pustaka
- Republik Indonesia. (2024). Undang-Undang Nomor 1 Tahun 2024 tentang Perubahan Kedua atas Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik. Lembaran Negara RI Tahun 2024 Nomor 3.


- Stallings, W. (2018). Computer Security: Principles and Practice (4th ed.). Pearson.
