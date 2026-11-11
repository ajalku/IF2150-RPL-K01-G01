const { pool } = require("../config/database");

// C06 - Tanggapan
class Tanggapan {
    #statusTanggapan;
    #waktuTanggapan;
    #deskripsiTanggapan;

    constructor(data = {}) {
        this.#statusTanggapan = data.statusTanggapan;
        this.#waktuTanggapan = data.waktuTanggapan ?? null;
        this.#deskripsiTanggapan = data.deskripsiTanggapan ?? "";
    }

    // Q-016 - Menyimpan tanggapan dengan parameterized query.
    async simpanTanggapan(idLaporan, dataPopupForm, client = pool) {
        this.#statusTanggapan = dataPopupForm.statusTanggapan;
        this.#deskripsiTanggapan = dataPopupForm.deskripsiTanggapan;

        try {
            const result = await client.query(
                `INSERT INTO tanggapan
                    (id_laporan, status_tanggapan, waktu_tanggapan, deskripsi_tanggapan)
                 VALUES ($1, $2, CURRENT_TIMESTAMP, $3)`,
                [idLaporan, this.#statusTanggapan, this.#deskripsiTanggapan]
            );
            return result.rowCount === 1;
        } catch (err) {
            console.error("Simpan tanggapan error:", err.message);
            return false;
        }
    }

    // Deviasi opsional DPPL - membaca tanggapan terakhir untuk ditampilkan pada laporan.
    static async getTanggapanByLaporan(idLaporan, client = pool) {
        const result = await client.query(
            `SELECT status_tanggapan, waktu_tanggapan, deskripsi_tanggapan
             FROM tanggapan
             WHERE id_laporan = $1
             ORDER BY waktu_tanggapan DESC, id_tanggapan DESC
             LIMIT 1`,
            [idLaporan]
        );
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            statusTanggapan: row.status_tanggapan,
            waktuTanggapan: row.waktu_tanggapan,
            deskripsiTanggapan: row.deskripsi_tanggapan,
        };
    }
}

module.exports = Tanggapan;
