const { describe, it, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const { fakeRes, fakeReq, ID_PENGGUNA } = require("./support/helpers");

const Laporan = require("../src/models/Laporan");
const Upvote = require("../src/models/Upvote");
const Homepage = require("../src/models/Homepage");
const HomepageController = require("../src/controllers/HomepageController");

afterEach(() => mock.restoreAll());

const sesi = { idPengguna: ID_PENGGUNA, role: "warga" };
const warga = { idPengguna: ID_PENGGUNA, role: "warga" };

describe("HomepageController.urutkanLaporan / filterLaporan", () => {
    it("bawaan: urgensi menurun", () => {
        assert.deepEqual(HomepageController.urutkanLaporan(), { sortBy: "urgensi", sortType: "desc" });
    });
    it("menerima urgensi, populer, dan waktu; tidak peka huruf besar-kecil", () => {
        for (const by of ["waktu", "urgensi", "populer"]) {
            assert.equal(HomepageController.urutkanLaporan(by.toUpperCase(), "ASC").sortBy, by);
        }
    });
    it("menolak kolom di luar daftar putih (mis. injeksi SQL)", () => {
        assert.equal(HomepageController.urutkanLaporan("skor_populer; DROP TABLE laporan", "asc"), null);
        assert.equal(HomepageController.urutkanLaporan("populer", "sideways"), null);
    });
    it("filter valid diteruskan, tanpa filter -> objek kosong", () => {
        assert.deepEqual(HomepageController.filterLaporan({}), {});
        assert.deepEqual(
            HomepageController.filterLaporan({ kategori: "Jalan", statusLaporan: Laporan.STATUS_LAPORAN[0], tingkatPermasalahan: "TINGGI" }),
            { kategori: "Jalan", statusLaporan: Laporan.STATUS_LAPORAN[0], tingkatPermasalahan: "TINGGI" }
        );
    });
    it("filter dengan nilai tidak dikenal -> null", () => {
        assert.equal(HomepageController.filterLaporan({ statusLaporan: "ASAL" }), null);
        assert.equal(HomepageController.filterLaporan({ tingkatPermasalahan: "DARURAT" }), null);
    });
});

describe("HomepageController.loadHomepage (UC04/UC06)", () => {
    it("200: mengembalikan daftar dan parameter yang dipakai", async () => {
        const ambil = mock.method(HomepageController, "ambilListLaporan", async () => [{ idLaporan: "x" }]);
        const res = fakeRes();
        await HomepageController.loadHomepage(fakeReq({ query: { sortBy: "waktu", sortType: "asc", limit: "1" }, session: sesi }), res);
        assert.equal(res.statusCode, 200);
        assert.equal(res.body.sortBy, "waktu");
        assert.equal(res.body.adaLagi, true); // 1 hasil == limit 1
        const opsi = ambil.mock.calls[0].arguments[1];
        assert.equal(opsi.limit, 1);
        assert.equal(opsi.offset, 0);
    });

    it("limit dibatasi maksimal 50", async () => {
        const ambil = mock.method(HomepageController, "ambilListLaporan", async () => []);
        const res = fakeRes();
        await HomepageController.loadHomepage(fakeReq({ query: { limit: "9999" }, session: sesi }), res);
        assert.equal(ambil.mock.calls[0].arguments[1].limit, 50);
        assert.equal(res.body.adaLagi, false);
    });

    it("400 untuk urutan, filter, atau halaman yang tidak valid", async () => {
        for (const query of [{ sortBy: "xx" }, { statusLaporan: "xx" }, { limit: "-1" }, { offset: "abc" }]) {
            const res = fakeRes();
            await HomepageController.loadHomepage(fakeReq({ query, session: sesi }), res);
            assert.equal(res.statusCode, 400, JSON.stringify(query));
        }
    });

    it("500 jika pengambilan data gagal", async () => {
        mock.method(HomepageController, "ambilListLaporan", async () => { throw new Error("db"); });
        mock.method(console, "error", () => {});
        const res = fakeRes();
        await HomepageController.loadHomepage(fakeReq({ session: sesi }), res);
        assert.equal(res.statusCode, 500);
    });
});

describe("Homepage (model)", () => {
    it("urutan bawaan: urgensi menurun", () => {
        const h = new Homepage();
        assert.equal(h.getSortBy(), "urgensi");
        assert.equal(h.getSortType(), "desc");
    });

    it("menandai sudahUpvote dan bisaUpvote dengan SATU query upvote (bukan per laporan)", async () => {
        mock.method(Laporan, "getDaftarLaporan", async () => [
            { idLaporan: "a", milikSaya: false },
            { idLaporan: "b", milikSaya: false },
            { idLaporan: "c", milikSaya: true },
        ]);
        const batch = mock.method(Upvote, "getDiupvoteOleh", async () => new Set(["a"]));
        const hasil = await new Homepage().getDaftarLaporan(warga);
        assert.equal(batch.mock.callCount(), 1);
        assert.deepEqual(batch.mock.calls[0].arguments[1], ["a", "b", "c"]);
        assert.deepEqual(hasil.map(l => [l.sudahUpvote, l.bisaUpvote]), [[true, true], [false, true], [false, false]]);
    });

    it("admin tidak mendapat tombol upvote", async () => {
        mock.method(Laporan, "getDaftarLaporan", async () => [{ idLaporan: "a", milikSaya: false }]);
        mock.method(Upvote, "getDiupvoteOleh", async () => new Set());
        const hasil = await new Homepage().getDaftarLaporan({ idPengguna: ID_PENGGUNA, role: "admin" });
        assert.equal(hasil[0].bisaUpvote, false);
    });

    it("meneruskan urutan, filter, dan halaman ke Laporan.getDaftarLaporan", async () => {
        const ambil = mock.method(Laporan, "getDaftarLaporan", async () => []);
        mock.method(Upvote, "getDiupvoteOleh", async () => new Set());
        const h = new Homepage({ sortBy: "waktu", sortType: "asc", filterBy: { kategori: "Jalan" } });
        await h.getDaftarLaporan(warga, { limit: 5, offset: 10 });
        assert.deepEqual(ambil.mock.calls[0].arguments[1],
            { kategori: "Jalan", sortBy: "waktu", sortType: "asc", limit: 5, offset: 10 });
    });
});
