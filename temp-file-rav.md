<!-- ket: file ini ntar dihapus, dibuat cuma biar gak konflik aja + malas bikin gdocs -->

revisi
1. tambahin atribut waktuLapor di Laporan
2. tambahin atribut sortType di kelas Homepage
3. tambahin atribut laporan di Laporan
4. perbaruiStatus() di Laporan kayaknya hapus aja(?)
5. tambahin atribut filterBy di kelas Homepage
6. tambahin atribut batasWaktu di Laporan

---

## 5.2 Kelas Homepage

**Nama Kelas:** *Homepage*  
**ID Kelas:** *C02*

Tabel 5.2.1. Operasi Kelas Homepage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *getDaftarLaporan() : daftarLaporan* | *Public* | *Mengambil daftar laporan untuk nantinya ditunjukkan ke pengguna, mengembalikan daftar laporan* |
| *refreshPage()* | *Public* | *Memuat ulang homepage sesuai permintaan pengguna, berupa prosedur yang akan melakukan ulang langkah-langkah serupa seperti ketika membuka Homepage* |
| *getSortBy(daftarLaporan: array [...] of laporan, sortBy: string) : daftarLaporan* | *Public* | *Mengurutkan laporan berdasarkan permintaan pengguna (popularitas, waktu, lokasi)* |
<!-- | *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* | -->

Tabel 5.2.2. Atribut Kelas Homepage

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *sortBy* | *Private* | *string* |
| *daftarLaporan* | *Private* | *array [...] of laporan* |
| *sortType* | *Private* | *SortType (enum)* |
| *filterBy* | *Private* | *string* |
| *...* | *...* | *...* |
<!-- | *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* | -->

### 5.2.1 Algoritma/Query

**Nama Kelas:** *Homepage*  
**Nama Operasi:** *getDaftarLaporan()*  
**ID Algoritma:** *Algo-005*

```text
ALGORITMA getDaftarLaporan

INPUT: Tidak ada
OUTPUT: daftarLaporan atau null

1. Jalankan query SELECT untuk mengambil seluruh data laporan [Q-005]
2. IF ada 1 atau lebih laporan THEN
        RETURN daftarLaporan
   ELSE
        RETURN null
   ENDIF
```

Tabel 5.2.1. Query Operasi getDaftarLaporan()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-005* | *SELECT * FROM daftarLaporan* | *Mengambil seluruh laporan yang ada* |
| *...* | *...* | *...* |

### 5.2.2 Algoritma/Query

<!-- *[Ulangi pola 5.1.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]* -->

**Nama Kelas:** *Homepage*
**Nama Operasi:** getSortBy(daftarLaporan, sortBy)
**ID Algoritma:** *Algo-006*

```text
ALGORITMA getSortBy

INPUT: daftarLaporan, sortBy
OUTPUT: daftarLaporan atau null

1. Ambil daftar laporan yang terdapat di homepage
2. Jalankan query SELECT dan ORDER BY untuk mengurutkan laporan [Q-006]
3. RETURN daftarLaporan
```
Tabel 5.2.1. Query Operasi getDaftarLaporan()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-006* | *SELECT * FROM laporan ORDER BY waktuLapor ASC* | *Contoh query jika ingin mengurutkan daftar laporan menaik berdasarkan waktuLapor* |
| *...* | *...* | *...* |

## 5.3 Kelas Laporan

**Nama Kelas:** *Laporan*  
**ID Kelas:** *C03*

Tabel 5.3.1. Operasi Kelas Laporan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *getDetailLaporan(idLaporan: String) : laporan* | *Public* | *Memberikan detail laporan berdasarkan lapo_ran yang diberikan* |
| *updateStatusLaporan(idLaporan: String, statusLaporan: StatusLaporan) : Boolean* | *Public* | *Memperbarui status laporan (BELUM_DILIHAT/DILIHAT/DIPERBAIKI/SELESAI), True jika berhasil, False jika gagal* |
| *hapusLaporan(idLaporan: String) : Boolean* | *Public* | *Menghapus laporan berdasarkan idLaporan, True jika berhasil, False jika gagal* |
| *simpanLaporan(namaMasalah: string, kategori: string, tingkatPermasalahan: TingkatPermasalahan, statusPrivasi: StatusPrivasi, foto: File, deskripsi: string, titikLokasi: Koordinat) : Boolean* | *Public* | *Menyimpan data laporan baru ke database, mengembalikan True jika berhasil tersimpan dan False jika tidak* |
| *tambahUpvote(idLaporan: String) : Boolean* | *Public* | *Menambahkan upvote yang berada dalam sebuah laporan, True jika berhasil menambahkan, False jika gagal* |
| *hitungSkorPopularitas(idLaporan: String) : Real* | *Public* | *Menghitung skor popularitas sebuah laporan, mengembalikan skor tersebut (bilangan real)* |
| *getJumlahUpvote(idLaporan: String) : Integer* | *Public* | *Memberikan jumlah upvote sebuah laporan, berupa integer* |
| *getSkorPopuler(idLaporan: String) : Real* | *Public* | *Memberikan skor popularitas sebuah laporan* |
||||

Tabel 5.3.2. Atribut Kelas Laporan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *laporan* | *Private* | *Laporan: <idLaporan: String, namaMasalah: String, kategori: String, tingkatPermasalahan: TingkatPermasalahan (enum), statusPrivasi: StatusPrivasi (enum), foto: File, deskripsi: String, statusLaporan: StatusLaporan (enum), titikLokasi: Koordinat, bobotUrgensi: Real, jumlahUpvote: Integer, skorPopuler: Real, skorUrgensi: Real>* |
| *idLaporan* | *Private* | *String* |
| *namaMasalah* | *Private* | *String* |
| *kategori* | *Private* | *String* |
| *tingkatPermasalahan* | *Private* | *TingkatPermasalahan (enum)* |
| *statusPrivasi* | *Private* | *StatusPrivasi (enum)* |
| *foto* | *Private* | *File* |
| *deskripsi* | *Private* | *String* |
| *statusLaporan* | *Private* | *StatusLaporan (enum)* |
| *titikLokasi* | *Private* | *Koordinat: <latitude : Real, longitude : Real>* |
| *bobotUrgensi* | *Private* | *Real* |
| *jumlahUpvote* | *Private* | *Integer* |
| *skorPopuler* | *Private* | *Real* |
| *skorUrgensi* | *Private* | *Real* |
| *batasWaktu* | *Private* | *Timestamp* |
||||
<!-- | *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* | -->

### 5.3.1 Algoritma/Query

**Nama Kelas:** *Laporan*  
**Nama Operasi:** *getDetailLaporan(idLaporan: String) : laporan*  
**ID Algoritma:** *Algo-007*

```text
ALGORITMA getDetailLaporan

INPUT: idLaporan
OUTPUT: laporan

1. Jalankan query SELECT untuk mengambil detail laporan berdasarkan ID [Q-007]
2. IF laporan ditemukan THEN
        RETURN laporan
   ELSE
        RETURN null
   ENDIF
```

Tabel 5.3.3. Query Operasi getDetailLaporan()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-007* | *SELECT * FROM daftarLaporan WHERE idLaporan = $1* | *Mencari laporan berdasarkan idLaporan* |
||||

### 5.3.2 Algoritma/Query
**Nama Kelas:** *Laporan*  
**Nama Operasi:** *updateStatusLaporan(idLaporan: String, statusLaporan: StatusLaporan) : Boolean*  
**ID Algoritma:** *Algo-008*

```text
ALGORITMA updateStatusLaporan

INPUT: idLaporan, statusLaporan
OUTPUT: Boolean

1. Jalankan query UPDATE berdasarkan statusLaporan dan idLaporan [Q-008]
2. IF perubahan berhasil THEN
        RETURN true
   ELSE
        RETURN false
   ENDIF
```

Tabel 5.3.4. Query Operasi updateStatusLaporan()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-008* | *UPDATE laporan SET statusLaporan = $1 WHERE idLaporan = $2* | *Memperbarui statusLaporan* |
||||

### 5.3.3 Algoritma/Query
**Nama Kelas:** *Laporan*  
**Nama Operasi:** *hapusLaporan(idLaporan: String) : Boolean*  
**ID Algoritma:** *Algo-009*

```text
ALGORITMA hapusLaporan

INPUT: idLaporan
OUTPUT: Boolean

1. Jalankan query DELETE berdasarkan idLaporan [Q-009]
2. IF satu record laporan berhasil dihapus THEN
        RETURN true
   ELSE
        RETURN false
   ENDIF
```

Tabel 5.3.5. Query Operasi hapusLaporan()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-009* | *DELETE FROM laporan WHERE idLaporan = $1* | *Menghapus data laporan berdasarkan ID* |
||||

### 5.3.4 Algoritma/Query
**Nama Kelas:** *Laporan*  
**Nama Operasi:** *simpanLaporan(namaMasalah: string, kategori: string, tingkatPermasalahan: TingkatPermasalahan, statusPrivasi: StatusPrivasi, foto: File, deskripsi: string, titikLokasi: Koordinat) : Boolean*  
**ID Algoritma:** *Algo-010*

```text
ALGORITMA simpanLaporan

INPUT: namaMasalah, kategori, tingkatPermasalahan, statusPrivasi, foto, deskripsi, titikLokasi
OUTPUT: Boolean

1. IF namaMasalah = null THEN
     RETURN false
   ENDIF

2. IF kategori = null THEN
     RETURN false
   ENDIF

3. IF tingkatPermasalahan = null THEN
     RETURN false
   ENDIF

4. IF statusPrivasi = null THEN
     RETURN false
   ENDIF

5. IF foto != null THEN
     Tambahkan foto ke daftar pembaruan list laporan
   ENDIF

6. IF deskripsi != null THEN
     Tambahkan deskripsi ke daftar pembaruan list laporan
   ENDIF

7. IF titikLokasi = null THEN
     RETURN false
   ENDIF

8. Jalankan query INSERT untuk menyimpan data pengguna [Q-010]

9. IF penyimpanan berhasil THEN
     RETURN true
   ELSE
     RETURN false
   ENDIF
```

Tabel 5.3.6. Query Operasi simpanLaporan()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-010* | *INSERT INTO laporan (namaMasalah, kategori, tingkatPermasalahan, statusPrivasi, titikLokasi) VALUES ($1, $2, $3, $4, $5)* | *Menyimpan data laporan baru ke database* |
||||

### 5.3.5 Algoritma/Query
**Nama Kelas:** *Laporan*  
**Nama Operasi:** *tambahUpvote(idLaporan: String) : Boolean*  
**ID Algoritma:** *Algo-011*

```text
ALGORITMA simpanLaporan

INPUT: idLaporan
OUTPUT: Boolean

1. Jalankan query UPDATE untuk menambahkan upvote [Q-011]
2. IF penambahan berhasil THEN
     RETURN true
   ELSE
     RETURN false
   ENDIF

```

Tabel 5.3.7. Query Operasi tambahUpvote()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-011* | *UPDATE laporan SET jumlah_upvote = jumlah_upvote + 1 WHERE idLaporan = $1* | *Menambahkan jumlahUpvote sebuah laporan* |
||||

### 5.3.6 Algoritma/Query
**Nama Kelas:** *Laporan*  
**Nama Operasi:** *getJumlahUpvote(idLaporan: String) : Integer*  
**ID Algoritma:** *Algo-012*

```text
ALGORITMA getJumlahUpvote

INPUT: idLaporan
OUTPUT: Integer

1. Jalankan query SELECT untuk mendapatkan jumlah upvote [Q-012]
2. IF pengambilan berhasil THEN
     RETURN jumlahUpvote
   ELSE
     RETURN null
   ENDIF

```

Tabel 5.3.8. Query Operasi getJumlahUpvote()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-012* | *SELECT jumlah_upvote FROM laporan WHERE id_laporan = $1* | *Mengambil jumlahUpvote sebuah laporan* |
||||

### 5.3.7 Algoritma/Query
**Nama Kelas:** *Laporan*  
**Nama Operasi:** *getSkorPopuler(idLaporan: String) : Real*  
**ID Algoritma:** *Algo-013*

```text
ALGORITMA getSkorPopuler

INPUT: idLaporan
OUTPUT: Real

1. Jalankan query SELECT untuk mendapatkan skor populer [Q-013]
2. IF pengambilan berhasil THEN
     RETURN skorPopuler
   ELSE
     RETURN null
   ENDIF

```

Tabel 5.3.9. Query Operasi getSkorPopuler()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-013* | *SELECT skor_populer FROM laporan WHERE id_laporan = $1* | *Mengambil skorPopuler sebuah laporan* |
||||

### 5.3.8 Algoritma/Query
**Nama Kelas:** *Laporan*
**Nama Operasi:** *hitungSkorPopularitas(idLaporan: String) : Real*
**ID Algoritma:** *Algo-014*

```text
ALGORITMA hitungSkorPopularitas

INPUT: idLaporan
OUTPUT: Real

1. Jalankan getSkorPopuler(idLaporan)
2. Jalankan operasi untuk menghitung skor populer
3. Kembalikan skor populer
```

Tabel 5.3.9. Query Operasi hitungSkorPopularitas()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *-* | *-* | *-* |
||||

---

<!-- PEMBATAS -->

## 5.9 Kelas HomepageView

**Nama Kelas:** *HomepageView*  
**ID Kelas:** *C09*

Tabel 5.9.1. Operasi Kelas HomepageView

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *tampilkanHomepage()* | *Public* | *Menampilkan homepage untuk pengguna, berupa prosedur tanpa parameter masukan* |
| *pilihFilter()* | *Public* | *Memilih filter dari pengguna |
| *tampilkanDaftarLaporan()* | *Public* | *Menampilkan daftar laporan untuk pengguna, berupa prosedur tanpa parameter masukan* |
| *tampilkanMenuFilterLaporan()* | *Public* | *Memilih filter dari pengguna, menghasilkan keluaran filterBy* |
||||

<!-- | *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* | -->

Tabel 5.9.2. Atribut Kelas HomepageView

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |
||||

## 5.10 Kelas LaporanView

**Nama Kelas:** *LaporanView*  
**ID Kelas:** *C10*

Tabel 5.10.1. Operasi Kelas LaporanView

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *tampilkanDetailLaporan()* | *Public* | *Menampilkan detail laporan untuk pengguna* |
| *tampilkanTanggapanTeratas()* | *Public* | *Menampilkan tanggapan teratas untuk pengguna* |
| *tampilkanForm()* | *Public* | *Menampilkan form untuk diisi pengguna* |
| *tampilkanErrorMsg()* | *Public* | *Menampilkan error message* |
| *tampilkanKonfirmasi()* | *Public* | *Menampilkan konfirmasi untuk menyimpan laporan bagi pengguna* |
| *tampilkanPesanBerhasil()* | *Public* | *Menampilkan pesan berhasil bagi pengguna* |
| *klikPost(dataForm)* | *Public* | *Pengklikan tombol post dari pengguna* |
| *klikYa(dataForm)* | *Public* | *Konfirmasi untuk post laporan dari pengguna* |
| *klikTidak()* | *Public* | *Konfirmasi untuk tidak jadi menge-post laporan dari pengguna* |
||||

<!-- | *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* | -->

Tabel 5.10.2. Atribut Kelas LaporanView

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *dataForm* | *Private* | *Laporan* |
||||

---

<!-- PEMBATAS -->

## 5.16 Kelas HomepageController

**Nama Kelas:** *HomepageController*  
**ID Kelas:** *C16*

Tabel 5.16.1. Operasi Kelas HomepageController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *loadHomepage()* | *Public* | *Memuat homepage, prosedur tanpa parameter yang dilakukan ketika pengguna memulai sesi baru di aplikasi* |
| *pilihLaporan()* | *Public* | *Memilih laporan berdasarkan aksi pengguna* |
| *urutkanLaporan(daftarLaporan: array [...] of laporan, sortBy: string, sortType: SortType): Boolean* | *Public* | *Mengurutkan laporan berdasarkan pilihan pengguna dengan sortType yang dipilih (ASC/DESC)* |
| *filterLaporan(daftarLaporan: array [...] of laporan, filterBy: string): Boolean* | *Public* | *Memfilter laporan berdasarkan pilihan pengguna* |
| *ambilListLaporan(): array [...] of laporan* | *Public* | *Mengambil daftar laporan yang tersedia* |
||||

<!-- | *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* | -->

Tabel 5.16.2. Atribut Kelas HomepageController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |
||||

### 5.16.1 Algoritma/Query

<!-- ID ALGORITMA PERLU DIGANTI -->
**Nama Kelas:** *HomepageController*  
**Nama Operasi:** *urutkanLaporan(daftarLaporan: array [...] of laporan, sortBy: string, sortType: SortType): Boolean*  
**ID Algoritma:** *[Algo-00X]*

<!-- ID QUERY PERLU DIGANTI -->
```text
ALGORITMA urutkanLaporan

INPUT: daftarLaporan, sortBy, sortType
OUTPUT: Boolean

1. Jalankan query SELECT dan ORDER BY untuk melakukan sorting pada daftar laporan [Q-00X]
2. IF sorting berhasil THEN
     RETURN true
   ELSE
     RETURN false
   ENDIF

```

Tabel 5.16.3. Query Operasi urutkanLaporan()

<!-- ID QUERY PERLU DIGANTI -->
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-00x* | *SELECT * FROM laporan ORDER BY waktuLapor ASC* | *Contoh query jika ingin mengurutkan daftar laporan menaik berdasarkan waktuLapor* |
||||

### 5.16.2 Algoritma/Query

<!-- ID ALGORITMA PERLU DIGANTI -->
**Nama Kelas:** *HomepageController*  
**Nama Operasi:** *filterLaporan(daftarLaporan: array [...] of laporan, filterBy: string): Boolean*
**ID Algoritma:** *[Algo-00X]*

<!-- ID QUERY PERLU DIGANTI -->
```text
ALGORITMA filterLaporan

INPUT: daftarLaporan, filterBy
OUTPUT: Boolean

1. Jalankan query SELECT untuk melakukan filtering pada daftar laporan [Q-00X]
2. IF filtering berhasil THEN
     RETURN true
   ELSE
     RETURN false
   ENDIF

```

Tabel 5.16.4. Query Operasi filterLaporan()

<!-- ID QUERY PERLU DIGANTI -->
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-00x* | *SELECT * FROM laporan WHERE kategori = $1* | *Contoh query jika ingin memfilter laporan berdasarkan kategori* |
||||

### 5.16.3 Algoritma/Query
<!-- ID ALGORITMA PERLU DIGANTI -->
**Nama Kelas:** *HomepageController*  
**Nama Operasi:** *ambilListLaporan(): array [...] of laporan* 
**ID Algoritma:** *Algo-00X*

<!-- ID QUERY PERLU DIGANTI -->
```text
ALGORITMA filterLaporan

INPUT: daftarLaporan, filterBy
OUTPUT: Boolean

1. Jalankan query SELECT untuk mengambil daftarLaporan [Q-00X]
2. IF laporan >= 1 THEN
     RETURN daftarLaporan
   ELSE
     RETURN []
   ENDIF

```

Tabel 5.16.4. Query Operasi filterLaporan()

<!-- ID QUERY PERLU DIGANTI -->
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-00x* | *SELECT * FROM laporan* | *Mengambil daftar laporan* |
||||

# 5.17 Kelas LaporanController

**Nama Kelas:** *LaporanController*  
**ID Kelas:** *C17*

Tabel 5.17.1. Operasi Kelas LaporanController

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *lihatDetailLaporan(laporan: Laporan)* | *Public* | *Menampilkan detail laporan sesuai permintaan pengguna* |
| *ambilDetailLaporan(idLaporan: String): laporan* | *Public* | *Memberikan detail laporan yang diminta, mengembalikan laporan* |
| *validasiKelengkapanData(namaMasalah: string, kategori: string, tingkatPermasalahan: TingkatPermasalahan, statusPrivasi: StatusPrivasi, titikLokasi: Koordinat) : Boolean* | *Public* | *Memeriksa kelengkapan data laporan yang ingin dilaporkan. Mengembalikan true bila data yang diperlukan lengkap* |
| *validasiFoto(foto: File) : Boolean* | *Public* | *Mengembalikan true jika format foto valid (JPG, JPEG, PNG)* |
| *buatIdUnik() : String* | *Public* | *Membuat ID unik setiap kali membuat laporan* |
| *simpanLaporan(namaMasalah: string, kategori: string, tingkatPermasalahan: TingkatPermasalahan, statusPrivasi: StatusPrivasi, foto: File, deskripsi: string, titikLokasi: Koordinat) : Boolean* | *Public* | *Menyimpan data laporan baru ke database, mengembalikan True jika berhasil tersimpan dan False jika tidak* |
| *updateStatusLaporan(idLaporan: String, statusLaporan: StatusLaporan) : Boolean* | *Public* | *Memperbarui status laporan (BELUM_DILIHAT/DILIHAT/DIPERBAIKI/SELESAI), True jika berhasil, False jika gagal* |
| *kirimPermintaanKonfirmasi()* | *Public* | *Mengirim permintaan konfirmasi untuk menyimpan laporan* |
| *setBatasWaktu2Minggu(idLaporan: String)* | *Public* | *Mengeset batas waktu 2 minggu untuk laporan yang tidak valid sebelum dihapus otomatis* |
| *cekBatasWaktu(idLaporan: String): Boolean* | *Public* | *Mengecek apabila batas waktu untuk laporan yang tidak valid sudah terlewati atau belum, mengembalikan True jika sudah lewat batas waktu* |
| *hapusLaporanOtomatis(idLaporan: String): Boolean* | *Public* | *Menghapus laporan otomatis apabila sudah melewati batas waktu* |
||||

Tabel 5.1.2. Atribut Kelas LaporanController

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |
||||

## 5.17.1 Algoritma/Query

<!-- ID ALGORITMA PERLU DIGANTI -->
**Nama Kelas:** *LaporanController*  
**Nama Operasi:** *validasiKelengkapanData(namaMasalah: string, kategori: string, tingkatPermasalahan: TingkatPermasalahan, statusPrivasi: StatusPrivasi, titikLokasi: Koordinat) : Boolean*  
**ID Algoritma:** *Algo-00X*

```text
ALGORITMA validasiKelengkapanData

INPUT: namaMasalah, kategori, tingkatPermasalahan, statuPrivasi, titikLokasi
OUTPUT: Boolean

1. IF namaMasalah = null THEN RETURN False
   ELSE IF kategori = null THEN RETURN False
   ELSE IF tingkatPermasalahan = null THEN RETURN False
   ELSE IF statusPrivasi = null THEN RETURN False
   ELSE IF titik lokasi = null THEN RETURN False
   ELSE RETURN True
```

Tabel 5.16.3. Query Operasi validasiKelengkapanData()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *-* | *-* | *-* |
||||

## 5.17.2 Algoritma/Query

<!-- ID ALGORITMA PERLU DIGANTI -->
**Nama Kelas:** *LaporanController*  
**Nama Operasi:** *validasiFoto(foto: File) : Boolean*  
**ID Algoritma:** *Algo-00X*

```text
ALGORITMA validasiFoto

INPUT: foto
OUTPUT: Boolean

1. IF foto memiliki format JPG/JPEG/PNG THEN
      RETURN True
   ELSE
      RETURN False
```

Tabel 5.16.4. Query Operasi validasiKelengkapanData()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *-* | *-* | *-* |
||||

## 5.17.3 Algoritma/Query

**Nama Kelas:** *LaporanController*
**Nama Operasi:** *simpanLaporan(namaMasalah: string, kategori: string, tingkatPermasalahan: TingkatPermasalahan, statusPrivasi: StatusPrivasi, foto: File, deskripsi: string, titikLokasi: Koordinat) : Boolean*  
**ID Algoritma:** *Algo-010*

```text
ALGORITMA simpanLaporan

INPUT: namaMasalah, kategori, tingkatPermasalahan, statusPrivasi, foto, deskripsi, titikLokasi
OUTPUT: Boolean

1. IF namaMasalah = null THEN
     RETURN false
   ENDIF

2. IF kategori = null THEN
     RETURN false
   ENDIF

3. IF tingkatPermasalahan = null THEN
     RETURN false
   ENDIF

4. IF statusPrivasi = null THEN
     RETURN false
   ENDIF

5. IF foto != null THEN
     Tambahkan foto ke daftar pembaruan list laporan
   ENDIF

6. IF deskripsi != null THEN
     Tambahkan deskripsi ke daftar pembaruan list laporan
   ENDIF

7. IF titikLokasi = null THEN
     RETURN false
   ENDIF

8. Jalankan query INSERT untuk menyimpan data pengguna [Q-010]

9. IF penyimpanan berhasil THEN
     RETURN true
   ELSE
     RETURN false
   ENDIF
```

Tabel 5.17.5. Query Operasi simpanLaporan()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-010* | *INSERT INTO laporan (namaMasalah, kategori, tingkatPermasalahan, statusPrivasi, titikLokasi) VALUES ($1, $2, $3, $4, $5)* | *Menyimpan data laporan baru ke database* |
||||

### 5.17.4 Algoritma/Query
**Nama Kelas:** *LaporanController*  
**Nama Operasi:** *updateStatusLaporan(idLaporan: String, statusLaporan: StatusLaporan) : Boolean*  
**ID Algoritma:** *Algo-008*

```text
ALGORITMA updateStatusLaporan

INPUT: idLaporan, statusLaporan
OUTPUT: Boolean

1. Jalankan query UPDATE berdasarkan statusLaporan dan idLaporan [Q-008]
2. IF perubahan berhasil THEN
        RETURN true
   ELSE
        RETURN false
   ENDIF
```

Tabel 5.17.6. Query Operasi updateStatusLaporan()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-008* | *UPDATE laporan SET statusLaporan = $1 WHERE idLaporan = $2* | *Memperbarui statusLaporan* |
||||

## 5.17.5 Algoritma/Query

<!-- ID ALGORITMA PERLU DIGANTI -->
**Nama Kelas:** *LaporanController*  
**Nama Operasi:** *setBatasWaktu2Minggu(idLaporan: String)*  
**ID Algoritma:** *Algo-00X*

<!-- ID QUERY PERLU DIGANTI -->
```text
ALGORITMA setBatasWaktu2Minggu

INPUT: idLaporan
OUTPUT: Tidak ada

1. Jalankan operasi UPDATE untuk mengupdate batasWaktu di sebuah laporan [Q-0XX]

```

<!-- ID QUERY PERLU DIGANTI -->
Tabel 5.16.7. Query Operasi setBatasWaktu2Minggu()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-0XX* | *UPDATE laporan SET batas_waktu = $1 WHERE id_laporan = $2* | *-* |
||||

## 5.17.6 Algoritma/Query

<!-- ID ALGORITMA PERLU DIGANTI -->
**Nama Kelas:** *LaporanController*  
**Nama Operasi:** *cekBatasWaktu(idLaporan: String): Boolean*  
**ID Algoritma:** *Algo-00X*

<!-- ID QUERY PERLU DIGANTI -->
```text
ALGORITMA cekBatasWaktu

INPUT: idLaporan
OUTPUT: Boolean

1. Jalankan operasi SELECT untuk mengambil batasWaktu laporan berdasarkan idLaporan
2. IF NOW() - batasWaktu <= 0 THEN
      RETURN True
   ELSE
      RETURN False

```

<!-- ID QUERY PERLU DIGANTI -->
Tabel 5.16.8. Query Operasi cekBatasWaktu()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-0XX* | *SELECT batas_waktu FROM laporan WHERE id_laporan = $1* | *Mengambil batasWaktu dari sebuah laporan* |
||||

## 5.17.6 Algoritma/Query

<!-- ID ALGORITMA PERLU DIGANTI -->
**Nama Kelas:** *LaporanController*  
**Nama Operasi:** *hapusLaporanOtomatis(idLaporan: String): Boolean*  
**ID Algoritma:** *Algo-00X*

```text
ALGORITMA hapusLaporanOtomatis

INPUT: idLaporan
OUTPUT: Boolean

1. IF cekBatasWaktu(idLaporan) THEN
      Jalankan query DELETE untuk menghapus laporan [Q-009]
      IF penghapusan berhasil THEN
          RETURN True
      ELSE
          RETURN False
   ELSE
      RETURN False

```

Tabel 5.16.9. Query Operasi hapusLaporanOtomatis()

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *Q-009* | *DELETE FROM laporan WHERE idLaporan = $1* | *Menghapus data laporan berdasarkan ID* |
||||

---

<!-- PEMBATAS -->

## 5.22 Kelas MapAPI

**Nama Kelas:** *MapAPI*  
**ID Kelas:** *C22*

Tabel 5.1.1. Operasi Kelas MapAPI

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *getAPIKey() : String* | *Public* | *Memberikan nilai apiKey* |
| *getBaseURL() : String* | *Public* | *Memberikan nilai baseURL* |
||||

Tabel 5.1.2. Atribut Kelas [Nama Kelas 1]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *apiKey* | *Private* | *String* |
| *baseURL* | *Private* | *String* |
||||

<!--
## template

## 5.1 Kelas [Nama Kelas 1]

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.1.1. Operasi Kelas [Nama Kelas 1]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.1.2. Atribut Kelas [Nama Kelas 1]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.1.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.1.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.1.2 Algoritma/Query

*[Ulangi pola 5.1.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*

## 5.2 Kelas [Nama Kelas Berikutnya]

*[Ulangi pola 5.1: nama dan ID kelas, tabel operasi, tabel atribut, serta subbab algoritma/query untuk operasi penting jika diperlukan.]*

<br>

---

| ** | ** | ** |