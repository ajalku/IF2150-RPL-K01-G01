const { pool } = require("../config/database");

// Isi tutorial navigasi (UC05). Urutan array = urutan langkah.
const DAFTAR_LANGKAH = Object.freeze([
    {
        judul: "Sampaikan laporan Anda",
        isi: "Menemukan trotoar rusak atau lampu padam? Tekan Buat Laporan, isi lokasi dan kondisinya, lalu kirim.",
    },
    {
        judul: "Dukung laporan warga",
        isi: "Tekan dukungan pada laporan yang juga Anda alami. Makin banyak dukungan, makin terlihat masalahnya. Satu akun hanya bisa mendukung satu kali per laporan.",
    },
    {
        judul: "Pantau tindak lanjutnya",
        isi: "Label status pada setiap laporan menunjukkan prosesnya, dari menunggu verifikasi hingga selesai. Peta Interaktif menampilkan laporan di sekitar Anda.",
    },
]);

// C07 - Tutorial
// Atribut DPPL: langkahSaatIni, totalLangkah (private).
// Di sisi server, objek ini hanya menyimpan keadaan sesaat satu permintaan; keadaan langkah
// yang sebenarnya dipegang TutorialView (client) karena HTTP bersifat stateless.
class Tutorial {
    #langkahSaatIni;
    #totalLangkah;

    constructor(langkahSaatIni = 1) {
        this.#langkahSaatIni = langkahSaatIni;
        this.#totalLangkah = DAFTAR_LANGKAH.length;
    }

    // Algo-018
    getLangkahSaatIni() {
        return this.#langkahSaatIni;
    }

    // Algo-019
    getTotalLangkah() {
        return this.#totalLangkah;
    }

    static getDaftarLangkah() {
        return DAFTAR_LANGKAH;
    }

    // Pengganti Pengguna.sudahLihatTutorial() pada DPPL: status disimpan di kolom
    // pengguna.status_tutorial (lihat db/migration_tutorial.sql).
    static async sudahLihat(idPengguna) {
        const result = await pool.query(
            `SELECT status_tutorial FROM pengguna WHERE id_pengguna = $1`,
            [idPengguna]
        );
        return result.rowCount === 1 && result.rows[0].status_tutorial === true;
    }

    static async tandaiSudahLihat(idPengguna) {
        const result = await pool.query(
            `UPDATE pengguna SET status_tutorial = TRUE WHERE id_pengguna = $1`,
            [idPengguna]
        );
        return result.rowCount === 1;
    }
}

module.exports = Tutorial;
