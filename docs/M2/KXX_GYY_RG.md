<h1>
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
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
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

Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor | Deskripsi |
| :--- | :--- |
| *Kasir* | *Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk memproses transaksi harian dan melayani pembayaran pelanggan. Karakteristik dari pengguna ini adalah mengutamakan kecepatan dan keakuratan saat bertransaksi.* |
| ... | ... |

---

# BAB 2: Deskripsi Kebutuhan Perangkat Lunak

## 2.1 Kebutuhan Pengguna Awal

Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format *User Story* (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | *Pengguna* |  *Mengakses sistem melalui proses registrasi atau login* | *Dapat menggunakan fitur-fitur sistem sesuai dengan perannya* |
| US-02 | *Pengguna* | *Menjelajahi peta dan informasi laporan yang tersedia* | *Dapat mengetahui permasalahan yang telah dilaporkan beserta lokasi dan detailnya* |
| US-03 | *Pengguna* | *Memberikan upvote pada laporan* | *Dapat menunjukkan bahwa suatu permasalahan dianggap penting atau relevan* |
| US-04 | *Pengguna* | *Membuat laporan permasalahan baru dengan memasukkan informasi yang diperlukan* | *Dapat menyampaikan permasalahan di lingkungan agar tercatat dan dapat ditindaklanjuti* |
| US-05 | *Admin* |  *Mengakses sistem melalui proses login* | *Dapat menggunakan fitur pengelolaan laporan sesuai dengan perannya* |
| US-06 | *Admin* |  *Memantau laporan yang tersedia beserta detailnya* | *Dapat mengetahui dan memahami permasalahan yang perlu ditindaklanjuti* |
| US-07 | *Admin* |  *Memperbarui status laporan* | *Dapat mencatat perkembangan penanganan permasalahan dan memberikan informasi terbaru kepada pengguna* |

## 2.2 Deskripsi Aktivitas

Buatlah daftar seluruh aktivitas yang terdapat dalam sistem solusi, lengkap dengan ID dan penjelasan. Telusuri hubungan aktivitas tersebut dengan *user story* yang sudah dituliskan sebelumnya. Bisa dibuat dalam bentuk tabel.

| ID | Aktivitas | Penjelasan | ID User Story |
| :--- | :--- | :--- | :--- |
| A01 | *Mengakses sistem* | *Admin maupun pengguna memulai proses mengakses sistem, yakni dengan melakukan login atau registrasi bagi pengguna yang belum mendaftar* | *US-01 dan US-05* |
| A02 | *Menjelajahi peta* | *Sistem akan menampilkan peta lokasi yang dipilih beserta informasi terkait laporan yang ada di daerah tersebut* | *US-02*|
| A03 | *Melihat informasi laporan* | *Sistem akan menampilkan informasi dan data terkait laporan yang ada, seperti alamat/lokasi, nama masalah, tag kategori, tingkat permasalahan, beserta foto dan deskripsi (jika ada)* | *US-02*|
| A04 | *Memberikan upvote* | *Pengguna dapat memberikan upvote pada masalah yang dianggap urgent atau relevan* | *US-03*|
| A05 | *Membuat laporan baru* | *Pengguna dapat membuat laporan baru dan memasukkan data terkait berupa lokasi (bisa langsung pilih di peta), nama masalah, tag kategori, tingkat permasalahan, serta foto dan deskripsi (opsional)* | *US-04*|
| A06 | *Memantau laporan* | *Admin dapat melakukan pemantauan terhadap laporan yang masuk dan sistem bisa  menampilkannya berdasarkan kategori, lokasi, ataupun tingkat permasalahan/urgensi, sehingga memudahkan admin dalam melakukan proses pemantauan ini* | *US-06*|
| A07 | *Memperbarui status  laporan* | *Admin dapat memperbarui status laporan sesuai dengan kondisi terkini dan sistem akan menyimpan informasi tersebut* | *US-07*|

## 2.3 Pemetaan Kebutuhan

Perhatikan kembali semua aktivitas yang telah didefinisikan pada tabel deskripsi aktivitas atau *activity diagram*. Jabarkan kebutuhan sistem yang akan dibuat dengan mengacu pada aktivitas-aktivitas tersebut. Setiap aktivitas (ID Aktivitas) dapat memiliki satu atau lebih kebutuhan yang berbeda. Pastikan untuk mengidentifikasi dan mengisi semua jenis kebutuhan yang relevan untuk setiap aktivitas, yaitu:

- **User Requirement**, yaitu kebutuhan dari sudut pandang pengguna (apa yang dapat dilakukan pengguna).
- **Business Requirement**, yaitu aturan, kebijakan, atau standar bisnis yang harus dipenuhi oleh sistem.
- **System Requirement**, yaitu kebutuhan yang menjelaskan apa yang harus dilakukan sistem dan bagaimana sistem harus bekerja dari segi performa, keamanan, keandalan, dsb.

Lengkapi juga dengan penjelasannya dan apakah keperluan tersebut perlu didukung oleh perangkat lunak atau tidak. Jenis kebutuhan tidak terbatas hanya dari tiga jenis di atas, dapat ditambahkan yang lain juga bila diperlukan, misalnya kebutuhan regulasi (*Legal*).

| ID Kebutuhan | ID Aktivitas | Jenis Kebutuhan | Deskripsi Kebutuhan | P/L |
| :--- | :--- | :--- | :--- | :--- |
| *R01* | *A01* | *User* | *Pengguna maupun admin dapat melakukan proses login atau registrasi (bagi pengguna baru).* | *Ya* |
| *R02* | *A01* | *System* | *Sistem harus memeriksa kredensial user sebelum memberikan akses akun* | *Tidak* |
| *R03* | *A02* | *User* | *Peta interaktif yang menampilkan informasi terkait laporan yang ada* | *Tidak* |
| *R04* | *A02* | *System* | *Sistem dapat mengintegrasikan map* | *Ya* |
| *R05* | *A03* | *User* | *Pengguna dapat melihat informasi mengenai laporan seperti alamat/lokasi, nama masalah, tag kategori, tingkat permasalahan, beserta foto dan deskripsi (jika ada)* | *Ya* |
| *R06* | *A03* | *System* | *Sistem memperlihatkan status kedaruratan suatu laporan* | *Ya* |
| *R07* | *A03* | *System* | *Sistem dapat menyajikan tampilan interaktif dan mudah dipahami untuk akses laporan* | *Ya* |
| *R08* | *A03* | *Business* | *Informasi yang ada harus sesuai UU ITE* | *Ya* |
| *R09* | *A04* | *User* | *Pengguna dapat melakukan upvote untuk suatu laporan yang dirasa urgent atau relevan* | *Ya* |
| *R10* | *A04* | *System* | *Sistem memiliki algoritma sehingga masalah yang punya banyak poin upvote akan muncul di atas (semacam trending gitu)* | *Ya* |
| *R11* | *A05* | *User* | *Pengguna dapat membuat laporan baru dan memasukkan data terkait laporan tersebut* | *Ya* |
| *R12* | *A06* | *User* | *Admin dapat mengakses informasi mengenai laporan kemudian memprosesnya* | *Ya* |
| *R13* | *A06* | *System* | *Sistem menyediakan proses sinkronisasi sesuai status laporan* | *Ya* |
| *R14* | *A06* | *Business* | *Hak akses data hanya untuk akun pihak yang berkepentingan saja* | *Ya* |
| *R15* | *A07* | *User* | *Admin dapat memperbarui status penanganan laporan* | *Ya* |
| *R16* | *A07* | *System* | *Sistem menyediakan proses sinkronisasi sesuai status laporan* | *Ya* |
| ... | ... | ... | ... | ... |

## 2.4 Kebutuhan Fungsional (KF)

Untuk setiap kebutuhan yang telah diidentifikasi sebagai "didukung oleh perangkat lunak", buatlah daftar kebutuhan fungsional P/L, lengkap dengan ID Kebutuhan Fungsional (KF) dan penjelasannya. Hubungkan ID Kebutuhan Fungsional dengan ID Pemetaan Kebutuhan dari sistem.

| ID KF | ID Kebutuhan | Penjelasan |
| :--- | :--- | :--- |
| *KF01* | *R01* | *Perangkat lunak dapat menampilkan pilihan antarmuka metode pembayaran (transfer bank, e-wallet, kartu kredit) setelah pengguna melakukan checkout.* |
| *KF02* | *R01* | *Perangkat lunak dapat mengirimkan permintaan otorisasi transaksi ke API Payment Gateway beserta nominal tagihan dan ID Pesanan.* |
| ... | ... | ... |

## 2.5 Kebutuhan Non-Fungsional (KNF)

Uraikan dengan ringkas Kebutuhan Non-Fungsional dalam tabel sebagai berikut. Isilah kolom kebutuhan dengan kalimat yang jelas, spesifik, dan terukur (kelak dapat diuji untuk dipenuhi). Kolom ID KNF adalah nomor Kebutuhan Non-Fungsional yang harus ditelusuri pada saat pengujian. Hubungkan ID Kebutuhan Non-Fungsional dengan ID Pemetaan Kebutuhan Umum dari sistem.

| ID KNF | ID Kebutuhan | Parameter | Deskripsi Kebutuhan |
| :--- | :--- | :--- | :--- |
| *KNF01* | *R02* | *Security* | *Ketika pengguna melakukan login, sistem hanya boleh memberikan akses kepada User dengan kredensial yang sudah terverifikasi.* |
| *KNF02* | *R04* | *Functional Stability* |*Ketika User mengakses peta, informasi yang disediakan sistem harus konsisten dengan visual dan tata letak yang jelas.* |
| *KNF03* | *R06* | *Interaction Capability* |*1. Ketika User ingin melihat detail laporan, alur dari home hingga mencapai halaman detail laporan dapat mudah dimengerti* <br><br> *2.Ketika User mengakses detail laporan, sistem harus menyajikan label status kedaruratan yang mudah dibedakan satu dengan yang lain*|
| *KNF04* | *R10* | *Functional Stability* |*Ketika jumlah upvote suatu laporan berubah, User dapat melihat trending melalui jumlah upvote dan urutan laporan berdasarkan data upvote terbaru.* |
| *KNF05* | *R10* | *Interaction Capability* |*Ketika User menggunakan fitur interaksi pada suatu laporan, User harus tahu tindakan interaksi sudah berhasil dilakukan atau tidak* |
| *KNF06* | *R11* | *Interaction Capability* |*Ketika User mengisi laporan, kuesioner yang ditanyakan sistem harus mudah dimengerti dan memiliki instruksi format file yang spesifik (contoh: pdf atau jpg), serta menjawab kebutuhan informasi User pihak lain (admin)* |
| *KNF07* | *R13* | *Functional Stability* |*Setelah User (masyarakat) mengirim laporan, sistem harus menampilkan data yang sama dengan data terakhir yang berhasil disimpan ketika diakses pihak User lain (admin)* |
| *KNF07* | *R16* | *Security* |*Ketika admin mengakses data laporan, sistem hanya boleh menampilkan data yang sesuai dengan hak masing-masing akun.* |


<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/
