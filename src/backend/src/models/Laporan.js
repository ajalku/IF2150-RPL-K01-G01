const { pool } = require("../config/database");
const Lokasi = require("./Lokasi");

// ---- Konstanta domain ------------------------------------------------------
const BOBOT_URGENSI = { RENDAH: 1, SEDANG: 2, TINGGI: 3 };
const STATUS_LAPORAN = ["BELUM_DILIHAT", "DILIHAT", "DIPERBAIKI", "SELESAI"];
const STATUS_PRIVASI = ["PUBLIK", "ANONIM"];
const STATUS_VALIDASI = ["BELUM_DIPERIKSA", "VALID", "TIDAK_VALID"];
const BATAS_WAKTU_HARI = 14; // laporan tidak valid dihapus otomatis setelah 2 minggu

// Rumus skor populer (DPPL belum menetapkan rumus -> silakan ubah di sini saja)
const BOBOT_UPVOTE_PADA_SKOR = 1.0;
const BOBOT_URGENSI_PADA_SKOR = 2.0;

// Kolom yang boleh dipakai untuk ORDER BY (whitelist, mencegah SQL injection)
const KOLOM_URUT = {
    waktu: "l.waktu_lapor",
    populer: "l.skor_populer",
};

const SELECT_LAPORAN = `
    SELECT l.id_laporan, l.id_pengguna, l.nama_masalah, l.kategori,
           l.tingkat_permasalahan, l.status_privasi, l.foto, l.deskripsi,
           l.status_laporan, l.status_validasi, l.catatan_pemeriksaan,
           l.jumlah_upvote, l.skor_populer, l.batas_waktu, l.waktu_lapor,
           lo.latitude, lo.longitude, lo.alamat,
           p.nama AS nama_pelapor
    FROM laporan l
    JOIN lokasi   lo ON lo.id_laporan  = l.id_laporan
    JOIN pengguna p  ON p.id_pengguna  = l.id_pengguna
`;

class Laporan {
    static BOBOT_URGENSI = BOBOT_URGENSI;
    static STATUS_LAPORAN = STATUS_LAPORAN;
    static STATUS_PRIVASI = STATUS_PRIVASI;
    static STATUS_VALIDASI = STATUS_VALIDASI;

    // Mengubah baris database menjadi objek respons, sambil menerapkan
    // aturan privasi sesuai siapa yang melihat (viewer).
    static #format(row, viewer) {
        const isAdmin = viewer.role === "admin";
        const isPemilik = String(row.id_pengguna) === String(viewer.idPengguna);
        const bolehLihatPelapor = row.status_privasi === "PUBLIK" || isAdmin || isPemilik;

        return {
            idLaporan: row.id_laporan,
            namaMasalah: row.nama_masalah,
            kategori: row.kategori,
            tingkatPermasalahan: row.tingkat_permasalahan,
            statusPrivasi: row.status_privasi,
            foto: row.foto ? `/api/laporan/${row.id_laporan}/foto` : null,
            deskripsi: row.deskripsi,
            statusLaporan: row.status_laporan,
            statusValidasi: row.status_validasi,
            catatanPemeriksaan: (isAdmin || isPemilik) ? row.catatan_pemeriksaan : null,
            batasWaktu: (isAdmin || isPemilik) ? row.batas_waktu : null,
            jumlahUpvote: row.jumlah_upvote,
            skorPopuler: row.skor_populer,
            waktuLapor: row.waktu_lapor,
            lokasi: {
                latitude: row.latitude,
                longitude: row.longitude,
                alamat: row.alamat,
            },
            pelapor: bolehLihatPelapor ? row.nama_pelapor : null,
            milikSaya: isPemilik,
        };
    }

    static hitungSkor(jumlahUpvote, bobotUrgensi) {
        return jumlahUpvote * BOBOT_UPVOTE_PADA_SKOR + bobotUrgensi * BOBOT_URGENSI_PADA_SKOR;
    }

    // Menyimpan laporan + lokasinya dalam satu transaksi (keduanya berhasil atau keduanya batal)
    static async simpan({ idLaporan, idPengguna, namaMasalah, kategori, tingkatPermasalahan,
                          statusPrivasi, foto, deskripsi, lokasi }) {
        const bobot = BOBOT_URGENSI[tingkatPermasalahan];
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query(
                `INSERT INTO laporan
                    (id_laporan, id_pengguna, nama_masalah, kategori, tingkat_permasalahan,
                     status_privasi, foto, deskripsi, bobot_urgensi, skor_populer)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [idLaporan, idPengguna, namaMasalah, kategori, tingkatPermasalahan,
                 statusPrivasi, foto ?? null, deskripsi ?? null, bobot, Laporan.hitungSkor(0, bobot)]
            );
            await Lokasi.simpan(client, idLaporan, lokasi);
            await client.query("COMMIT");
            return idLaporan;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async getDetailLaporan(idLaporan, viewer) {
        const result = await pool.query(`${SELECT_LAPORAN} WHERE l.id_laporan = $1`, [idLaporan]);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        // Laporan tidak valid hanya boleh dilihat pemilik dan admin
        if (!Laporan.#bolehDilihat(row, viewer)) return null;
        return Laporan.#format(row, viewer);
    }

    static #bolehDilihat(row, viewer) {
        return row.status_validasi !== "TIDAK_VALID"
            || viewer.role === "admin"
            || String(row.id_pengguna) === String(viewer.idPengguna);
    }

    // Daftar laporan untuk homepage / peta. limit = null berarti tanpa batas.
    static async getDaftarLaporan(viewer, opsi = {}) {
        const {
            kategori, statusLaporan, statusValidasi, tingkatPermasalahan, idPengguna, bbox,
            sortBy = "waktu", sortType = "desc", limit = 20, offset = 0,
        } = opsi;

        const where = [];
        const params = [];
        const tambah = (kondisi, nilai) => {
            params.push(nilai);
            where.push(kondisi.replace("?", `$${params.length}`));
        };

        if (viewer.role !== "admin") {
            tambah("(l.status_validasi <> 'TIDAK_VALID' OR l.id_pengguna = ?)", viewer.idPengguna);
        }
        if (idPengguna !== undefined) tambah("l.id_pengguna = ?", idPengguna);
        if (kategori) tambah("l.kategori = ?", kategori);
        if (statusLaporan) tambah("l.status_laporan = ?", statusLaporan);
        if (statusValidasi) tambah("l.status_validasi = ?", statusValidasi);
        if (tingkatPermasalahan) tambah("l.tingkat_permasalahan = ?", tingkatPermasalahan);
        if (bbox) {
            tambah("lo.latitude  >= ?", bbox.minLat);
            tambah("lo.latitude  <= ?", bbox.maxLat);
            tambah("lo.longitude >= ?", bbox.minLon);
            tambah("lo.longitude <= ?", bbox.maxLon);
        }

        const kolom = KOLOM_URUT[sortBy] ?? KOLOM_URUT.waktu;
        const arah = String(sortType).toLowerCase() === "asc" ? "ASC" : "DESC";

        let sql = `${SELECT_LAPORAN}
                   ${where.length ? "WHERE " + where.join(" AND ") : ""}
                   ORDER BY ${kolom} ${arah}, l.id_laporan`;
        if (limit !== null) {
            params.push(limit, offset);
            sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
        }

        const result = await pool.query(sql, params);
        return result.rows.map(row => Laporan.#format(row, viewer));
    }

    // Nama file foto, hanya jika viewer berhak melihat laporannya (aturan sama dengan detail laporan)
    static async getFoto(idLaporan, viewer) {
        const result = await pool.query(
            `SELECT foto, id_pengguna, status_validasi FROM laporan WHERE id_laporan = $1`,
            [idLaporan]
        );
        if (result.rows.length === 0) return null;
        const row = result.rows[0];
        if (!row.foto || !Laporan.#bolehDilihat(row, viewer)) return null;
        return row.foto;
    }

    // Data minimal untuk pengecekan hak akses & status (tanpa filter privasi)
    static async getPemilik(idLaporan) {
        const result = await pool.query(
            `SELECT id_pengguna, status_validasi, batas_waktu
             FROM laporan WHERE id_laporan = $1`,
            [idLaporan]
        );
        if (result.rows.length === 0) return null;
        const row = result.rows[0];
        return {
            idPengguna: row.id_pengguna,
            statusValidasi: row.status_validasi,
            batasWaktu: row.batas_waktu,
        };
    }

    static async updateStatusLaporan(idLaporan, statusLaporan) {
        const result = await pool.query(
            `UPDATE laporan SET status_laporan = $1, waktu_diperbarui = NOW()
             WHERE id_laporan = $2`,
            [statusLaporan, idLaporan]
        );
        return result.rowCount === 1;
    }

    // Hasil pemeriksaan admin. Jika TIDAK_VALID, batas waktu 2 minggu langsung dipasang.
    static async simpanHasilPemeriksaan(idLaporan, valid, catatan) {
        const result = await pool.query(
            `UPDATE laporan
             SET status_validasi     = $1::varchar,
                 catatan_pemeriksaan = $2,
                 batas_waktu         = CASE WHEN $1::varchar = 'TIDAK_VALID'
                                            THEN NOW() + make_interval(days => $3::int)
                                            ELSE NULL END,
                 waktu_diperbarui    = NOW()
             WHERE id_laporan = $4`,
            [valid ? "VALID" : "TIDAK_VALID", catatan ?? null, BATAS_WAKTU_HARI, idLaporan]
        );
        return result.rowCount === 1;
    }

    // Pengguna meminta laporannya diperiksa ulang sebelum batas waktu berakhir
    static async kirimKonfirmasiUlang(idLaporan) {
        const result = await pool.query(
            `UPDATE laporan
             SET status_validasi = 'BELUM_DIPERIKSA', batas_waktu = NULL,
                 waktu_diperbarui = NOW()
             WHERE id_laporan = $1
               AND status_validasi = 'TIDAK_VALID'
               AND batas_waktu > NOW()`,
            [idLaporan]
        );
        return result.rowCount === 1;
    }

    // true jika batas waktu sudah terlewati
    static async cekBatasWaktu(idLaporan) {
        const result = await pool.query(
            `SELECT (batas_waktu IS NOT NULL AND batas_waktu <= NOW()) AS lewat
             FROM laporan WHERE id_laporan = $1`,
            [idLaporan]
        );
        return result.rows.length === 1 && result.rows[0].lewat === true;
    }

    // Mengembalikan { foto } jika terhapus, null jika laporan tidak ada.
    // (nama file foto dikembalikan agar pemanggil bisa menghapus filenya)
    static async hapusLaporan(idLaporan) {
        const result = await pool.query(
            `DELETE FROM laporan WHERE id_laporan = $1 RETURNING foto`,
            [idLaporan]
        );
        return result.rowCount === 1 ? { foto: result.rows[0].foto } : null;
    }

    static async hapusLaporanOtomatis(idLaporan) {
        if (!(await Laporan.cekBatasWaktu(idLaporan))) return null;
        return Laporan.hapusLaporan(idLaporan);
    }

    // Dipakai job berkala: hapus semua laporan tidak valid yang batas waktunya lewat.
    // Mengembalikan daftar nama file foto yang harus ikut dihapus dari disk.
    static async hapusSemuaKadaluarsa() {
        const result = await pool.query(
            `DELETE FROM laporan
             WHERE status_validasi = 'TIDAK_VALID' AND batas_waktu <= NOW()
             RETURNING foto`
        );
        return result.rows.map(row => row.foto).filter(Boolean);
    }

    // Disiapkan untuk modul Upvote: tambah 1 upvote + hitung ulang skor secara atomik
    static async tambahUpvote(idLaporan) {
        const result = await pool.query(
            `UPDATE laporan
             SET jumlah_upvote = jumlah_upvote + 1,
                 skor_populer  = (jumlah_upvote + 1) * $1 + bobot_urgensi * $2
             WHERE id_laporan = $3
             RETURNING jumlah_upvote`,
            [BOBOT_UPVOTE_PADA_SKOR, BOBOT_URGENSI_PADA_SKOR, idLaporan]
        );
        return result.rowCount === 1;
    }

    static async hitungSkorPopularitas(idLaporan) {
        const result = await pool.query(
            `UPDATE laporan
             SET skor_populer = jumlah_upvote * $1 + bobot_urgensi * $2
             WHERE id_laporan = $3
             RETURNING skor_populer`,
            [BOBOT_UPVOTE_PADA_SKOR, BOBOT_URGENSI_PADA_SKOR, idLaporan]
        );
        return result.rowCount === 1 ? result.rows[0].skor_populer : null;
    }
}

module.exports = Laporan;
