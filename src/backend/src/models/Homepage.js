const Laporan = require("./Laporan");
const Upvote = require("./Upvote");

// C02 - Homepage
// Atribut DPPL: sortBy, sortType, filterBy, daftarLaporan (semuanya private).
// filterBy pada DPPL berupa string; di sini berupa objek { kategori, statusLaporan, tingkatPermasalahan }
// supaya bisa diteruskan langsung ke Laporan.getDaftarLaporan (query berparameter).
class Homepage {
    #sortBy;
    #sortType;
    #filterBy;
    #daftarLaporan = [];

    constructor({ sortBy = "urgensi", sortType = "desc", filterBy = {} } = {}) {
        this.#sortBy = sortBy;
        this.#sortType = sortType;
        this.#filterBy = filterBy;
    }

    getSortBy() {
        return this.#sortBy;
    }

    getSortType() {
        return this.#sortType;
    }

    getFilterBy() {
        return this.#filterBy;
    }

    // Algo-005 / Algo-006: ambil daftar laporan (terurut + terfilter) lalu tandai mana
    // yang sudah/boleh di-upvote oleh pengguna yang sedang melihat.
    async getDaftarLaporan(viewer, { limit = 20, offset = 0 } = {}) {
        const daftar = await Laporan.getDaftarLaporan(viewer, {
            ...this.#filterBy,
            sortBy: this.#sortBy,
            sortType: this.#sortType,
            limit,
            offset,
        });

        const diupvote = await Upvote.getDiupvoteOleh(
            viewer.idPengguna,
            daftar.map(laporan => laporan.idLaporan)
        );

        this.#daftarLaporan = daftar.map(laporan => ({
            ...laporan,
            sudahUpvote: diupvote.has(laporan.idLaporan),
            // Sesuai SKPL KF09: upvote untuk laporan pengguna lain, dan hanya oleh warga
            bisaUpvote: viewer.role !== "admin" && !laporan.milikSaya,
        }));
        return this.#daftarLaporan;
    }
}

module.exports = Homepage;
