const { pool } = require("../config/database");

// C06 - Tanggapan
class Tanggapan {
    #statusTanggapan;
    #waktuTanggapan;
    #deskripsiTanggapan;
    #idAdmin;

    constructor(data = {}) {
        this.#statusTanggapan = data.statusTanggapan;
        this.#waktuTanggapan = data.waktuTanggapan ?? null;
        this.#deskripsiTanggapan = data.deskripsiTanggapan ?? "";
        this.#idAdmin = data.idAdmin ?? null;
    }

    // Q-016 - Menyimpan tanggapan dengan parameterized query.
    async simpanTanggapan(idLaporan, idAdmin, dataPopupForm, client = pool) {
        this.#statusTanggapan = dataPopupForm.statusTanggapan;
        this.#deskripsiTanggapan = dataPopupForm.deskripsiTanggapan;
        this.#idAdmin = idAdmin;

        try {
            const result = await client.query(
                `INSERT INTO tanggapan
                    (id_laporan, id_admin, status_tanggapan, waktu_tanggapan, deskripsi_tanggapan)
                 VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)`,
                [idLaporan, this.#idAdmin, this.#statusTanggapan, this.#deskripsiTanggapan]
            );
            return result.rowCount === 1;
        } catch (err) {
            console.error("Simpan tanggapan error:", err.message);
            return false;
        }
    }

    // C06 - Membaca tanggapan terbaru dan hanya membuka identitas admin kepada admin.
    static async getTanggapanByLaporan(idLaporan, viewer, client = pool) {
        const result = await client.query(
            `SELECT t.status_tanggapan, t.waktu_tanggapan, t.deskripsi_tanggapan,
                    t.id_admin, p.nama AS nama_admin
             FROM tanggapan t
             LEFT JOIN pengguna p ON p.id_pengguna = t.id_admin
             WHERE t.id_laporan = $1
             ORDER BY t.waktu_tanggapan DESC, t.id_tanggapan DESC
             LIMIT 1`,
            [idLaporan]
        );
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            statusTanggapan: row.status_tanggapan,
            waktuTanggapan: row.waktu_tanggapan,
            deskripsiTanggapan: row.deskripsi_tanggapan,
            ...(viewer?.role === "admin" ? {
                idAdmin: row.id_admin,
                namaAdmin: row.nama_admin,
            } : {}),
        };
    }

    getIdAdmin() {
        return this.#idAdmin;
    }
}

module.exports = Tanggapan;
