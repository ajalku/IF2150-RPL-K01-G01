const { pool } = require("../config/database");
const Laporan = require("../models/Laporan");
const Tanggapan = require("../models/Tanggapan");

const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BATAS_DESKRIPSI = 2000;
const BATAS_CATATAN = 1000;

// C20 - TanggapanController
class TanggapanController {
    // Algo-044 - Hasil valid tetap boleh tanpa deskripsi; hasil tidak valid wajib beralasan.
    static validasiTanggapan(dataPopupForm) {
        if (!dataPopupForm || typeof dataPopupForm.statusTanggapan !== "boolean") return false;
        if (typeof dataPopupForm.deskripsiTanggapan !== "string"
            || dataPopupForm.deskripsiTanggapan.length > BATAS_DESKRIPSI) return false;
        return dataPopupForm.statusTanggapan || dataPopupForm.deskripsiTanggapan.trim() !== "";
    }

    // Algo-045 - Menyimpan tanggapan; client opsional dipakai agar bagian transaksi tetap atomik.
    static async simpanTanggapan(idLaporan, dataPopupForm, client = pool) {
        if (!TanggapanController.validasiTanggapan(dataPopupForm)) return false;
        const tanggapan = new Tanggapan(dataPopupForm);
        return tanggapan.simpanTanggapan(idLaporan, dataPopupForm, client);
    }

    // Algo-046 - Memperbarui status dengan enum yang dipakai Model Laporan.
    static async simpanStatus(idLaporan, statusLaporan, client = pool) {
        if (!Laporan.STATUS_LAPORAN.includes(statusLaporan)) return false;
        return Laporan.updateStatusLaporan(idLaporan, statusLaporan, client);
    }

    // POST /api/laporan/:idLaporan/tanggapan - menyimpan pemeriksaan, tanggapan, dan status atomik.
    static async simpan(req, res) {
        const { idLaporan } = req.params;
        if (typeof idLaporan !== "string" || !REGEX_UUID.test(idLaporan)) {
            return res.status(404).json({ message: "Laporan tidak ditemukan" });
        }

        const body = req.body ?? {};
        if (body.deskripsiTanggapan !== undefined
            && typeof body.deskripsiTanggapan !== "string") {
            return res.status(400).json({ message: "Deskripsi tanggapan harus berupa teks." });
        }
        if (body.catatanPemeriksaan !== undefined
            && typeof body.catatanPemeriksaan !== "string") {
            return res.status(400).json({ message: "Catatan pemeriksaan harus berupa teks." });
        }

        const dataPopupForm = {
            statusTanggapan: body.statusTanggapan,
            deskripsiTanggapan: body.deskripsiTanggapan?.trim() ?? "",
        };
        const catatanPemeriksaan = body.catatanPemeriksaan?.trim() ?? "";
        const statusLaporan = typeof body.statusLaporan === "string"
            ? body.statusLaporan.trim().toUpperCase()
            : "";

        if (!TanggapanController.validasiTanggapan(dataPopupForm)) {
            return res.status(400).json({
                message: dataPopupForm.statusTanggapan === false
                    ? "Alasan tanggapan wajib diisi untuk laporan tidak valid (maksimal 2000 karakter)."
                    : "Hasil pemeriksaan atau deskripsi tanggapan tidak valid.",
            });
        }
        if (catatanPemeriksaan.length > BATAS_CATATAN) {
            return res.status(400).json({ message: "Catatan pemeriksaan maksimal 1000 karakter." });
        }
        if (!Laporan.STATUS_LAPORAN.includes(statusLaporan)) {
            return res.status(400).json({
                message: `Status harus salah satu dari: ${Laporan.STATUS_LAPORAN.join(", ")}`,
            });
        }

        let client;
        let transaksiAktif = false;
        try {
            client = await pool.connect();
            await client.query("BEGIN");
            transaksiAktif = true;

            const pemeriksaanTersimpan = await Laporan.simpanHasilPemeriksaan(
                idLaporan,
                dataPopupForm.statusTanggapan,
                catatanPemeriksaan || null,
                client
            );
            if (!pemeriksaanTersimpan) {
                await client.query("ROLLBACK");
                transaksiAktif = false;
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }

            const tanggapanTersimpan = await TanggapanController.simpanTanggapan(
                idLaporan,
                dataPopupForm,
                client
            );
            if (!tanggapanTersimpan) {
                throw new Error("Tanggapan gagal disimpan.");
            }

            const statusTersimpan = await TanggapanController.simpanStatus(
                idLaporan,
                statusLaporan,
                client
            );
            if (!statusTersimpan) {
                await client.query("ROLLBACK");
                transaksiAktif = false;
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }

            await client.query("COMMIT");
            transaksiAktif = false;
            return res.status(200).json({
                message: "Hasil pemeriksaan, tanggapan, dan status laporan berhasil disimpan.",
                statusLaporan,
            });
        } catch (err) {
            if (transaksiAktif) {
                try {
                    await client.query("ROLLBACK");
                } catch (rollbackError) {
                    console.error("Rollback tanggapan gagal:", rollbackError.message);
                }
            }
            console.error("Simpan hasil pemeriksaan dan tanggapan error:", err);
            return res.status(500).json({
                message: "Gagal menyimpan hasil pemeriksaan dan tanggapan. Silakan coba lagi.",
            });
        } finally {
            if (client) client.release();
        }
    }
}

module.exports = TanggapanController;
