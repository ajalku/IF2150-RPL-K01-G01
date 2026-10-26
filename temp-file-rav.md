<!-- ket: file ini ntar dihapus, dibuat cuma biar gak konflik aja + malas bikin gdocs -->

revisi
1. tambahin atribut waktuLapor di Laporan
2. tambahin atribut sortType di kelas Homepage
3. tambahin atribut laporan di Laporan
4. perbaruiStatus() di Laporan kayaknya hapus aja(?)
5. tambahin atribut filterBy di kelas Homepage

---

## 5.2 Kelas Homepage

**Nama Kelas:** *Homepage*  
**ID Kelas:** *C02*

Tabel 5.2.1. Operasi Kelas Homepage

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *getDaftarLaporan() : daftarLaporan* | *Public* | *Mengambil daftar laporan untuk nantinya ditunjukkan ke pengguna, mengembalikan daftar laporan* |
| *refreshPage()* | *Private* | *Memuat ulang homepage sesuai permintaan pengguna, berupa prosedur yang akan melakukan ulang langkah-langkah serupa seperti ketika membuka Homepage* |
| *getSortBy(daftarLaporan: array [...] of laporan, sortBy: string) : daftarLaporan* | *Public* | *Mengurutkan laporan berdasarkan permintaan pengguna (popularitas, waktu, lokasi)* |
<!-- | *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* | -->

Tabel 5.2.2. Atribut Kelas [Nama Kelas 1]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *sortBy* | *Public* | *string* |
| *daftarLaporan* | *Public* | *array [...] of laporan* |
| *sortType* | *Public* | *string* |
| *filterBy* | *Public* | *string* |
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
| *Q-006* | *SELECT * FROM daftarLaporan ORDER BY waktuLapor ASC* | *Contoh query jika ingin mengurutkan daftar laporan menaik berdasarkan waktuLapor* |
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
| *hitungSkorPopularitas(idLaporan: String) : Real* | *Private* | *Menghitung skor popularitas sebuah laporan, mengembalikan skor tersebut (bilangan real)* |
| *getJumlahUpvote(idLaporan: String) : Integer* | *Public* | *Memberikan jumlah upvote sebuah laporan, berupa integer* |
| *getSkorPopuler(idLaporan: String) : Real* | *Private* | *Memberikan skor popularitas sebuah laporan* |
||||

Tabel 5.3.2. Atribut Kelas [Nama Kelas 1]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *laporan* | *Private* | *Laporan: <idLaporan: String, namaMasalah: String, kategori: String, tingkatPermasalahan: TingkatPermasalahan (enum), statusPrivasi: StatusPrivasi (enum), foto: File, deskripsi: String, statusLaporan: StatusLaporan (enum), titikLokasi: Koordinat, bobotUrgensi: Real, jumlahUpvote: Integer, skorPopuler: Real, skorUrgensi: Real>* |
| *idLaporan* | *Private* | *String* |
| *namaMasalah* | *Public* | *String* |
| *kategori* | *Public* | *String* |
| *tingkatPermasalahan* | *Public* | *TingkatPermasalahan (enum)* |
| *statusPrivasi* | *Private* | *StatusPrivasi (enum)* |
| *foto* | *Public* | *File* |
| *deskripsi* | *Public* | *String* |
| *statusLaporan* | *Public* | *StatusLaporan (enum)* |
| *titikLokasi* | *Public* | *Koordinat: <latitude : Real, longitude : Real>* |
| *bobotUrgensi* | *Private* | *Real* |
| *jumlahUpvote* | *Public* | *Integer* |
| *skorPopuler* | *Private* | *Real* |
| *skorUrgensi* | *Private* | *Real* |
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

Tabel 5.1.2. Atribut Kelas HomepageView

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |
||||

5.10 Kelas LaporanView

**Nama Kelas:** *LaporanView*  
**ID Kelas:** *C10*

Tabel 5.9.1. Operasi Kelas LaporanView

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

Tabel 5.9.2. Atribut Kelas LaporanView

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *-* | *-* | *-* |
||||




---

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