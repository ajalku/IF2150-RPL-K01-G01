const crypto = require("crypto");
const fs = require("fs");
const Laporan = require("../models/Laporan");
const Lokasi = require("../models/Lokasi");
const MapAPIService = require("../services/MapAPIService");
const { hapusFileFoto } = require("../middleware/uploadMiddleware");

const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class LaporanController {
    // ---- Helper privat -----------------------------------------------------
    static #viewer(req) {
        return { idPengguna: req.session.idPengguna, role: req.session.role };
    }

    static #buatIdUnik() {
        return crypto.randomUUID();
    }

    static #idValid(id) {
        return typeof id === "string" && REGEX_UUID.test(id);
    }

    static #teks(nilai) {
        return typeof nilai === "string" ? nilai.trim() : "";
    }

    // Mengembalikan pesan error, atau "" jika data lengkap dan valid
    static #validasiKelengkapanData({ namaMasalah, kategori, tingkatPermasalahan, statusPrivasi, deskripsi, lokasi }) {
        if (namaMasalah === "" || kategori === "" || !tingkatPermasalahan || !statusPrivasi || !lokasi) {
            return "Data belum lengkap";
        }
        if (namaMasalah.length > 150) return "Nama masalah maksimal 150 karakter";
        if (kategori.length > 50) return "Kategori maksimal 50 karakter";
        if (!(tingkatPermasalahan in Laporan.BOBOT_URGENSI)) {
            return `Tingkat permasalahan harus salah satu dari: ${Object.keys(Laporan.BOBOT_URGENSI).join(", ")}`;
        }
        if (!Laporan.STATUS_PRIVASI.includes(statusPrivasi)) {
            return `Status privasi harus salah satu dari: ${Laporan.STATUS_PRIVASI.join(", ")}`;
        }
        if (deskripsi.length > 2000) return "Deskripsi maksimal 2000 karakter";
        return "";
    }

    // Cek isi file (magic bytes), bukan hanya Content-Type yang bisa dipalsukan.
    static async #validasiFoto(pathFile) {
        const handle = await fs.promises.open(pathFile, "r");
        try {
            const buf = Buffer.alloc(8);
            await handle.read(buf, 0, 8, 0);
            const jpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
            const png = buf.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
            return jpeg || png;
        } finally {
            await handle.close();
        }
    }

    // Lokasi dari koordinat (peta) atau, jika koordinat tidak dikirim, dari alamat (geocoding)
    static async #tentukanLokasi(body) {
        const { latitude, longitude, alamat } = body ?? {};
        const adaKoordinat = [latitude, longitude].some(v => v !== undefined && v !== "");

        if (adaKoordinat) {
            const lokasi = Lokasi.dariInput(latitude, longitude, alamat);
            return lokasi
                ? { lokasi }
                : { error: { status: 400, message: "Koordinat lokasi tidak valid" } };
        }

        if (typeof alamat === "string" && alamat.trim() !== "") {
            let hasil;
            try {
                hasil = await MapAPIService.geocode(alamat.trim());
            } catch (err) {
                console.error("Geocoding error:", err.message);
                return { error: { status: 502, message: "Layanan peta tidak dapat dihubungi. Pilih titik langsung di peta." } };
            }
            if (!hasil) {
                return { error: { status: 400, message: "Alamat tidak ditemukan. Pilih titik langsung di peta." } };
            }
            return { lokasi: Lokasi.dariInput(hasil.latitude, hasil.longitude, hasil.alamat) };
        }

        return { lokasi: null };
    }

    // ---- Handler -----------------------------------------------------------

    // POST /api/laporan  (multipart/form-data)  -- UC07 Mengunggah Laporan Baru
    static async buat(req, res) {
        const foto = req.file ?? null;
        let berhasil = false;
        try {
            const body = req.body ?? {};
            const namaMasalah = LaporanController.#teks(body.namaMasalah);
            const kategori = LaporanController.#teks(body.kategori);
            const tingkatPermasalahan = LaporanController.#teks(body.tingkatPermasalahan).toUpperCase();
            const statusPrivasi = LaporanController.#teks(body.statusPrivasi).toUpperCase();
            const deskripsi = LaporanController.#teks(body.deskripsi);

            const { lokasi, error: errLokasi } = await LaporanController.#tentukanLokasi(body);
            if (errLokasi) return res.status(errLokasi.status).json({ message: errLokasi.message });

            const error = LaporanController.#validasiKelengkapanData({
                namaMasalah, kategori, tingkatPermasalahan, statusPrivasi, deskripsi, lokasi,
            });
            if (error !== "") return res.status(400).json({ message: error });

            if (foto && !(await LaporanController.#validasiFoto(foto.path))) {
                return res.status(400).json({ message: "Format foto harus JPG, JPEG, atau PNG" });
            }

            const idLaporan = await Laporan.simpan({
                idLaporan: LaporanController.#buatIdUnik(),
                idPengguna: req.session.idPengguna,
                namaMasalah, kategori, tingkatPermasalahan, statusPrivasi, deskripsi, lokasi,
                foto: foto?.filename ?? null,
            });

            berhasil = true;
            return res.status(201).json({ message: "Laporan berhasil dikirim", idLaporan });
        } catch (err) {
            console.error("Buat laporan error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        } finally {
            // Jika laporan gagal disimpan, jangan tinggalkan file foto yatim di disk
            if (!berhasil && foto) await hapusFileFoto(foto.filename);
        }
    }

    // GET /api/laporan?sortBy=waktu|populer&sortType=asc|desc&kategori=&statusLaporan=&tingkatPermasalahan=&page=&limit=
    static async daftar(req, res) {
        try {
            const q = req.query ?? {};
            const limit = Math.min(Math.max(parseInt(q.limit, 10) || 20, 1), 100);
            const page = Math.max(parseInt(q.page, 10) || 1, 1);

            if (q.statusLaporan && !Laporan.STATUS_LAPORAN.includes(q.statusLaporan)) {
                return res.status(400).json({ message: "Status laporan tidak valid" });
            }
            if (q.statusValidasi && !Laporan.STATUS_VALIDASI.includes(q.statusValidasi)) {
                return res.status(400).json({ message: "Status validasi tidak valid" });
            }
            if (q.tingkatPermasalahan && !(q.tingkatPermasalahan in Laporan.BOBOT_URGENSI)) {
                return res.status(400).json({ message: "Tingkat permasalahan tidak valid" });
            }

            const laporan = await Laporan.getDaftarLaporan(LaporanController.#viewer(req), {
                kategori: LaporanController.#teks(q.kategori) || undefined,
                statusLaporan: q.statusLaporan || undefined,
                statusValidasi: q.statusValidasi || undefined,
                tingkatPermasalahan: q.tingkatPermasalahan || undefined,
                sortBy: q.sortBy,
                sortType: q.sortType,
                limit,
                offset: (page - 1) * limit,
            });
            return res.status(200).json({ laporan, page, limit });
        } catch (err) {
            console.error("Daftar laporan error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    // GET /api/laporan/saya  -- "Laporan Saya" di halaman profil
    static async saya(req, res) {
        try {
            const laporan = await Laporan.getDaftarLaporan(LaporanController.#viewer(req), {
                idPengguna: req.session.idPengguna,
                limit: null,
            });
            return res.status(200).json({ laporan });
        } catch (err) {
            console.error("Laporan saya error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    // GET /api/laporan/:idLaporan  -- UC04 Melihat Laporan
    static async detail(req, res) {
        try {
            const { idLaporan } = req.params;
            if (!LaporanController.#idValid(idLaporan)) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }
            const laporan = await Laporan.getDetailLaporan(idLaporan, LaporanController.#viewer(req));
            if (laporan === null) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }
            return res.status(200).json({ laporan });
        } catch (err) {
            console.error("Detail laporan error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    // PATCH /api/laporan/:idLaporan/status  (admin)  -- UC09
    static async updateStatus(req, res) {
        try {
            const { idLaporan } = req.params;
            const statusLaporan = LaporanController.#teks(req.body?.statusLaporan).toUpperCase();

            if (!Laporan.STATUS_LAPORAN.includes(statusLaporan)) {
                return res.status(400).json({
                    message: `Status harus salah satu dari: ${Laporan.STATUS_LAPORAN.join(", ")}`,
                });
            }
            if (!LaporanController.#idValid(idLaporan)
                || !(await Laporan.updateStatusLaporan(idLaporan, statusLaporan))) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }
            return res.status(200).json({ message: "Status laporan diperbarui", statusLaporan });
        } catch (err) {
            console.error("Update status error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    // PATCH /api/laporan/:idLaporan/pemeriksaan  (admin)  -- UC08
    // body: { valid: true|false, catatan?: string }
    static async periksa(req, res) {
        try {
            const { idLaporan } = req.params;
            const { valid } = req.body ?? {};
            const catatan = LaporanController.#teks(req.body?.catatan);

            if (typeof valid !== "boolean") {
                return res.status(400).json({ message: "Field 'valid' harus true atau false" });
            }
            if (catatan.length > 1000) {
                return res.status(400).json({ message: "Catatan maksimal 1000 karakter" });
            }
            if (!LaporanController.#idValid(idLaporan)
                || !(await Laporan.simpanHasilPemeriksaan(idLaporan, valid, catatan || null))) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }
            return res.status(200).json({
                message: valid
                    ? "Laporan dinyatakan valid"
                    : "Laporan dinyatakan tidak valid. Pelapor punya waktu 2 minggu untuk konfirmasi ulang sebelum laporan dihapus otomatis.",
            });
        } catch (err) {
            console.error("Periksa laporan error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    // POST /api/laporan/:idLaporan/konfirmasi-ulang  (pemilik laporan)  -- UC08 alternatif 1
    static async konfirmasiUlang(req, res) {
        try {
            const { idLaporan } = req.params;
            if (!LaporanController.#idValid(idLaporan)) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }
            const data = await Laporan.getPemilik(idLaporan);
            if (data === null || String(data.idPengguna) !== String(req.session.idPengguna)) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }
            if (data.statusValidasi !== "TIDAK_VALID") {
                return res.status(409).json({ message: "Laporan ini tidak sedang dinyatakan tidak valid" });
            }
            if (await Laporan.cekBatasWaktu(idLaporan)
                || !(await Laporan.kirimKonfirmasiUlang(idLaporan))) {
                return res.status(409).json({ message: "Batas waktu konfirmasi ulang sudah terlewati" });
            }
            return res.status(200).json({ message: "Konfirmasi ulang terkirim. Laporan akan diperiksa kembali oleh admin." });
        } catch (err) {
            console.error("Konfirmasi ulang error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    // DELETE /api/laporan/:idLaporan  (pemilik atau admin)
    static async hapus(req, res) {
        try {
            const { idLaporan } = req.params;
            if (!LaporanController.#idValid(idLaporan)) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }
            const data = await Laporan.getPemilik(idLaporan);
            const isAdmin = req.session.role === "admin";
            const isPemilik = data !== null && String(data.idPengguna) === String(req.session.idPengguna);
            if (data === null || (!isAdmin && !isPemilik)) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }

            const terhapus = await Laporan.hapusLaporan(idLaporan);
            if (terhapus === null) {
                return res.status(404).json({ message: "Laporan tidak ditemukan" });
            }
            await hapusFileFoto(terhapus.foto);
            return res.status(200).json({ message: "Laporan dihapus" });
        } catch (err) {
            console.error("Hapus laporan error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
}

module.exports = LaporanController;
