const { pool } = require("../config/database");
const Laporan = require("./Laporan");

// C05 - Upvote
// Atribut DPPL (waktuUpvote, statusUpvote) diwujudkan sebagai kolom tabel `upvote`
// (waktu_upvote, status_upvote). Satu baris = satu dukungan dari satu pengguna
// pada satu laporan; PRIMARY KEY (id_pengguna, id_laporan) mencegah dukungan ganda.
class Upvote {
    // Q-025: apakah pengguna sudah mendukung laporan ini?
    static async sudahUpvote(idPengguna, idLaporan) {
        const result = await pool.query(
            `SELECT 1 FROM upvote
             WHERE id_pengguna = $1 AND id_laporan = $2 AND status_upvote = TRUE
             LIMIT 1`,
            [idPengguna, idLaporan]
        );
        return result.rowCount === 1;
    }

    // Q-015: simpan upvote + naikkan jumlah_upvote/skor_populer laporan dalam SATU transaksi.
    // true  -> upvote tersimpan
    // false -> pengguna ternyata sudah pernah upvote (mis. dua klik hampir bersamaan)
    static async upvote(idPengguna, idLaporan) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const sisip = await client.query(
                `INSERT INTO upvote (id_pengguna, id_laporan, waktu_upvote, status_upvote)
                 VALUES ($1, $2, CURRENT_TIMESTAMP, TRUE)
                 ON CONFLICT (id_pengguna, id_laporan) DO NOTHING`,
                [idPengguna, idLaporan]
            );
            if (sisip.rowCount === 0) {
                await client.query("ROLLBACK");
                return false;
            }
            const naik = await Laporan.tambahUpvote(idLaporan, client);
            if (!naik) {
                await client.query("ROLLBACK");
                return false;
            }
            await client.query("COMMIT");
            return true;
        } catch (err) {
            await client.query("ROLLBACK").catch(() => {});
            throw err;
        } finally {
            client.release();
        }
    }

    // Satu query untuk banyak laporan sekaligus (menghindari N+1 saat render homepage).
    // Mengembalikan Set berisi id_laporan yang sudah di-upvote pengguna.
    static async getDiupvoteOleh(idPengguna, daftarIdLaporan) {
        if (!Array.isArray(daftarIdLaporan) || daftarIdLaporan.length === 0) return new Set();
        const result = await pool.query(
            `SELECT id_laporan FROM upvote
             WHERE id_pengguna = $1 AND id_laporan = ANY($2::uuid[]) AND status_upvote = TRUE`,
            [idPengguna, daftarIdLaporan]
        );
        return new Set(result.rows.map(row => row.id_laporan));
    }
}

module.exports = Upvote;
