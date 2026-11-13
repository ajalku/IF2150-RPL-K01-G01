const Laporan = require("../models/Laporan");
const Homepage = require("../models/Homepage");

const SORT_BY = ["urgensi", "populer", "waktu"];
const SORT_TYPE = ["asc", "desc"];
const LIMIT_DEFAULT = 20;
const LIMIT_MAKS = 50;

const bilanganBulat = (nilai, bawaan, min, maks) => {
    if (nilai === undefined || nilai === "") return bawaan;
    const angka = Number(nilai);
    if (!Number.isInteger(angka) || angka < min) return null;
    return Math.min(angka, maks);
};

// C16 - HomepageController
class HomepageController {
    // Algo-029 (versi web). DPPL mengembalikan Boolean; di sini memvalidasi parameter urutan dari
    // query string dan mengembalikan { sortBy, sortType } atau null jika tidak valid. ORDER BY
    // sebenarnya dijalankan Laporan.getDaftarLaporan (kolom di-whitelist di sana).
    static urutkanLaporan(sortBy = "urgensi", sortType = "desc") {
        const by = String(sortBy).toLowerCase();
        const type = String(sortType).toLowerCase();
        if (!SORT_BY.includes(by) || !SORT_TYPE.includes(type)) return null;
        return { sortBy: by, sortType: type };
    }

    // Algo-030 (versi web). Mengembalikan objek filter yang valid, atau null jika ada nilai yang tidak valid.
    static filterLaporan({ kategori, statusLaporan, tingkatPermasalahan } = {}) {
        const filter = {};
        if (kategori) {
            if (typeof kategori !== "string" || kategori.length > 50) return null;
            filter.kategori = kategori;
        }
        if (statusLaporan) {
            if (!Laporan.STATUS_LAPORAN.includes(statusLaporan)) return null;
            filter.statusLaporan = statusLaporan;
        }
        if (tingkatPermasalahan) {
            if (!(tingkatPermasalahan in Laporan.BOBOT_URGENSI)) return null;
            filter.tingkatPermasalahan = tingkatPermasalahan;
        }
        return filter;
    }

    // Algo-031: ambil daftar laporan; hasil kosong berupa [] (bukan null) agar mudah dirender.
    static async ambilListLaporan(viewer, { sortBy, sortType, filterBy, limit, offset }) {
        const homepage = new Homepage({ sortBy, sortType, filterBy });
        return homepage.getDaftarLaporan(viewer, { limit, offset });
    }

    // Rute: GET /api/homepage?sortBy=&sortType=&kategori=&statusLaporan=&tingkatPermasalahan=&limit=&offset=
    static async loadHomepage(req, res) {
        try {
            const viewer = { idPengguna: req.session?.idPengguna, role: req.session?.role };
            const q = req.query ?? {};

            const urutan = HomepageController.urutkanLaporan(q.sortBy, q.sortType);
            if (!urutan) {
                return res.status(400).json({ message: "Parameter urutan tidak valid." });
            }
            const filterBy = HomepageController.filterLaporan(q);
            if (!filterBy) {
                return res.status(400).json({ message: "Parameter filter tidak valid." });
            }
            const limit = bilanganBulat(q.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);
            const offset = bilanganBulat(q.offset, 0, 0, Number.MAX_SAFE_INTEGER);
            if (limit === null || offset === null) {
                return res.status(400).json({ message: "Parameter halaman tidak valid." });
            }

            const daftarLaporan = await HomepageController.ambilListLaporan(viewer, {
                ...urutan, filterBy, limit, offset,
            });

            return res.status(200).json({
                daftarLaporan,
                sortBy: urutan.sortBy,
                sortType: urutan.sortType,
                limit,
                offset,
                adaLagi: daftarLaporan.length === limit,
                peran: viewer.role,
            });
        } catch (err) {
            console.error("Homepage error:", err);
            return res.status(500).json({ message: "Beranda gagal dimuat. Coba lagi." });
        }
    }
}

module.exports = HomepageController;
