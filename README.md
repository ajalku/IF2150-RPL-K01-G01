
# Tugas Besar IF2150 Rekayasa Perangkat Lunak

---

## 1. Overview

Setiap milestone, asisten akan merilis materi/spesifikasi baru ke **repository original** yang ada di organisasi GitHub mata kuliah ini. Kelompok bekerja di **hasil fork** dari repository tersebut, dan setiap ada milestone baru, kelompok melakukan **sync** untuk pull update tersebut ke repo hasil fork.

--- 
## 2. Repository Structure

Repository original disusun per milestone:

```
docs/
	assets/                        # aset dokumen umum
	KXX_GYY_AI-Usage.md            # dokumentasi penggunaan AI
	KXX_GYY_Logbook.md             # dokumentasi logbook pekerjaan kelompok
	M1/                            # milestone 1
		assets/                    # gambar, diagram, dll untuk milestone ini
			diagram/               # diagram UML, activity, dll
		KXX_GYY_Form-Asistensi.md  # dokumentasi asistensi
		KXX_GYY_Template1_TB.md    # dokumen tugas besar
	M2/                            # milestone 2
		...
	...
src/                               # source code perangkat lunak
```

**Penting:** setiap rilis milestone baru hanya akan **menambah** folder/file baru. Asisten tidak akan mengubah isi folder milestone yang sudah rilis sebelumnya. Ini artinya kelompok bebas mengedit apapun yang sudah dikerjakan di folder-folder lama tanpa takut tertimpa saat sync.

---

## 3. Initial Setup

Lakukan ini **sekali saja** di awal.

1. **Fork repository.** Satu orang perwakilan kelompok membuka repository original [IF2150-RPL](https://github.com/RPL-24/IF2150-RPL), klik tombol **Fork**, lalu pilih tujuan fork ke **akun pribadi** perwakilan tersebut.
2. **Ganti nama repository hasil fork.** Repository original bernama `IF2150-RPL`. Saat melakukan fork, ganti nama repository menjadi format `IF2150-RPL-KXX-GYY`, dengan `XX` adalah nomor kelas (contoh: `01`) dan `YY` adalah nomor kelompok (contoh: `10`). Misalnya, kelas 01 kelompok 10 akan menamai repo fork-nya `IF2150-RPL-K01-G10`.
3. **Set repo menjadi public, lalu invite anggota kelompok.** Perwakilan yang fork tadi otomatis jadi owner dari repo fork tersebut. Repo hasil fork **wajib public**: buka **Settings → General → Danger Zone → Change visibility**, lalu ubah ke **Public**. Selain itu, tetap invite semua anggota kelompok sebagai collaborator supaya bisa push/commit langsung: masuk ke **Settings → Collaborators and teams → Add people**, lalu invite satu per satu. Setiap anggota hanya akan punya akses commit ke repo fork kelompok sendiri, bukan ke repo kelompok lain atau ke organisasi.
4. **Aktifkan notifikasi rilis.** Buka repository original (bukan fork kalian), klik tombol **Watch → Custom**, lalu centang **Releases**. Dengan ini kalian akan otomatis dapat notifikasi setiap kali asisten merilis tubes baru, tanpa perlu bolak-balik cek manual.

---

## 4. Working Rules

- **Secara default, kerjakan progres langsung di branch `main`** pada repo fork kelompok, ini bukan keharusan teknis, hanya disederhanakan supaya tidak ada risiko salah push ke branch yang salah. Kelompok yang sudah nyaman dengan git boleh memakai branch working tambahan, asal branch `main` tetap dijaga untuk menerima update sync dari asisten, dan progres di branch tambahan rutin digabungkan (merge) dari `main` setiap kali selesai sync.
- **Jangan mengubah atau menghapus** folder milestone yang sudah pernah dirilis sebelumnya, supaya proses sync ke depannya tetap lancar.
- Commit sesering mungkin dengan message yang jelas. Riwayat commit yang rapi memudahkan asisten memahami progres kelompok saat menilai. Kelompok bisa mengikuti standar [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) untuk format commit messages yang lebih terstruktur.

---

## 5. Receiving New Milestone Updates (Sync)

Saat asisten merilis milestone baru, perhatikan yang perlu kelompok lakukan.

1. Buka `main` branch repository **fork** kelompok. Akan muncul keterangan _"This branch is X commits behind"_. 
2. Klik tombol **Sync fork**, lalu **Update branch**. Materi milestone baru akan otomatis masuk ke branch `main` fork kelompok, tergabung dengan progres yang sudah kelompok kerjakan.
3. Jika proses sync berhasil tanpa keterangan konflik, kelompok bisa langsung lanjut kerja seperti biasa.
4. Jika GitHub meminta kelompok membuat **pull request** untuk resolve konflik, artinya ada bentrokan file, segera hubungi asisten sebelum mencoba resolve sendiri, terutama jika belum familiar dengan proses merge conflict.

---

## 6. Submission Mechanism per Milestone

Pengumpulan milestone **tidak dilihat dari commit terakhir**, melainkan dari **tag** yang kelompok buat sebelum deadline.

Cara membuat tag submission:

1. Pastikan semua perubahan untuk milestone ini sudah di-commit ke branch `main` fork kelompok.
2. Buka tab **Releases** di repo fork kelompok → **Draft a new release**.
3. Di bagian tag, ketik tag baru dengan format `vX.Y`, dengan `X` adalah nomor milestone pengerjaan tugas dan `Y` adalah nomor revisi pada milestone tersebut.
4. Pastikan target rilis mengarah ke branch `main` (commit terakhir kelompok saat itu).

Contoh penggunaan format tag:

| Tag | Keterangan |
| :--- | :--- |
| `v1.0` | Release milestone pertama |
| `v1.1` | Revisi pertama pada milestone pertama |
| `v2.0` | Release milestone kedua |

Khusus pengumpulan final, kelompok **WAJIB** membuat release dengan format tag di atas.

Tag inilah yang jadi bukti resmi apa yang kelompok kumpulkan untuk milestone tersebut. Ulangi langkah ini di setiap deadline milestone.

---

<br>
<p align="center">
	<text>Selamat mengerjakan!</text>
	<br>
	<text>Tim Asisten RPL 2024</text>
</p>

## 7. Fitur Tanggapan (Milestone 9)

### Skema dan migrasi

Tabel `tanggapan` menyimpan hasil pemeriksaan boolean, waktu tanggapan, deskripsi, serta `id_admin UUID` yang nullable dan merujuk ke `pengguna(id_pengguna)` dengan `ON DELETE SET NULL`. Relasi laporan tetap menggunakan `ON DELETE CASCADE`.

Pastikan koneksi PostgreSQL yang dipakai sesuai variabel `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` di `src/backend/.env`. Jalankan skema laporan terlebih dahulu jika belum ada, kemudian migrasi:

```powershell
psql -h <DB_HOST> -p <DB_PORT> -U <DB_USER> -d <DB_NAME> -f src/backend/db/schema_laporan.sql
psql -h <DB_HOST> -p <DB_PORT> -U <DB_USER> -d <DB_NAME> -f src/backend/db/migration_tanggapan.sql
psql -h <DB_HOST> -p <DB_PORT> -U <DB_USER> -d <DB_NAME> -f src/backend/db/migration_tanggapan_id_admin.sql
```

`schema_laporan.sql` mengasumsikan tabel `pengguna` sudah tersedia. Migrasi `migration_tanggapan_id_admin.sql` idempoten dan harus dijalankan setelah `migration_tanggapan.sql`; tanggapan lama tetap tersimpan dengan `id_admin = NULL`.

### Endpoint

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `POST` | `/api/laporan/:idLaporan/tanggapan` | Admin | Menyimpan pemeriksaan, tanggapan, dan status penanganan dalam satu transaksi. |
| `PATCH` | `/api/laporan/:idLaporan/status` | Admin | Memperbarui status penanganan saja. |

Contoh body untuk endpoint tanggapan:

```json
{
  "statusTanggapan": false,
  "deskripsiTanggapan": "Alasan laporan tidak valid.",
  "catatanPemeriksaan": "Catatan pemeriksaan admin.",
  "statusLaporan": "DILIHAT"
}
```

`statusTanggapan` harus boolean. Deskripsi wajib jika nilainya `false`; jika `true`, deskripsi boleh kosong. `statusLaporan` menerima `BELUM_DILIHAT`, `DILIHAT`, `DIPERBAIKI`, atau `SELESAI`.
Identitas admin tidak dikirim pada body: server mengambil `idAdmin` dari `req.session.idPengguna` dan mengabaikan `idAdmin` dari klien.

Detail laporan (`GET /api/laporan/:idLaporan`) menyertakan tanggapan terbaru dan waktunya untuk semua pengguna. Hanya respons untuk role `admin` yang juga memuat `idAdmin` dan `namaAdmin`; respons non-admin tidak memuat kedua properti tersebut.

### Menyiapkan akun admin uji

Belum ada kredensial admin uji yang disediakan di repository. Buat akun uji melalui halaman registrasi, lalu ubah rolenya langsung di PostgreSQL (ganti alamat email dengan email akun tersebut):

```sql
UPDATE pengguna SET role = 'admin' WHERE email = 'admin-uji@example.test';
```

Login menggunakan akun itu untuk membuka halaman **Periksa Laporan**. Jangan gunakan akun admin produksi sebagai akun uji.

Jalankan unit test backend dari direktori `src/backend` dengan `npm test`.
