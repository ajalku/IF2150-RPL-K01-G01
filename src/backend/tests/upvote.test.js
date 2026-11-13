const { describe, it, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const { fakePool, fakeRes, fakeReq, fakeClient, ID_LAPORAN, ID_PENGGUNA } = require("./support/helpers");

const Laporan = require("../src/models/Laporan");
const Upvote = require("../src/models/Upvote");
const UpvoteController = require("../src/controllers/UpvoteController");

afterEach(() => mock.restoreAll());

const reqWarga = (idLaporan = ID_LAPORAN) =>
    fakeReq({ params: { idLaporan }, session: { idPengguna: ID_PENGGUNA, role: "warga" } });

describe("UpvoteController.prosesUpvote (UC06)", () => {
    it("berhasil: 201 dengan jumlah upvote terbaru", async () => {
        mock.method(Laporan, "getDetailLaporan", async () => ({ milikSaya: false }));
        mock.method(Upvote, "sudahUpvote", async () => false);
        const upvote = mock.method(Upvote, "upvote", async () => true);
        mock.method(Laporan, "getJumlahUpvote", async () => 5);

        const res = fakeRes();
        await UpvoteController.prosesUpvote(reqWarga(), res);

        assert.equal(res.statusCode, 201);
        assert.deepEqual(res.body, { message: "Upvote berhasil.", sudahUpvote: true, jumlahUpvote: 5 });
        // idPengguna harus dari session, bukan dari klien
        assert.deepEqual(upvote.mock.calls[0].arguments, [ID_PENGGUNA, ID_LAPORAN]);
    });

    it("400 jika id laporan bukan UUID", async () => {
        const res = fakeRes();
        await UpvoteController.prosesUpvote(reqWarga("bukan-uuid"), res);
        assert.equal(res.statusCode, 400);
    });

    it("403 jika admin mencoba upvote (RBAC)", async () => {
        const res = fakeRes();
        const req = fakeReq({ params: { idLaporan: ID_LAPORAN }, session: { idPengguna: ID_PENGGUNA, role: "admin" } });
        await UpvoteController.prosesUpvote(req, res);
        assert.equal(res.statusCode, 403);
    });

    it("404 jika laporan tidak ada atau tidak boleh dilihat", async () => {
        mock.method(Laporan, "getDetailLaporan", async () => null);
        const res = fakeRes();
        await UpvoteController.prosesUpvote(reqWarga(), res);
        assert.equal(res.statusCode, 404);
    });

    it("403 jika laporan milik sendiri", async () => {
        mock.method(Laporan, "getDetailLaporan", async () => ({ milikSaya: true }));
        const upvote = mock.method(Upvote, "upvote", async () => true);
        const res = fakeRes();
        await UpvoteController.prosesUpvote(reqWarga(), res);
        assert.equal(res.statusCode, 403);
        assert.equal(upvote.mock.callCount(), 0);
    });

    it("409 dan tidak menyimpan lagi jika sudah pernah upvote", async () => {
        mock.method(Laporan, "getDetailLaporan", async () => ({ milikSaya: false }));
        mock.method(Upvote, "sudahUpvote", async () => true);
        const upvote = mock.method(Upvote, "upvote", async () => true);
        const res = fakeRes();
        await UpvoteController.prosesUpvote(reqWarga(), res);
        assert.equal(res.statusCode, 409);
        assert.equal(upvote.mock.callCount(), 0);
    });

    it("409 jika dua klik bersamaan (Upvote.upvote mengembalikan false)", async () => {
        mock.method(Laporan, "getDetailLaporan", async () => ({ milikSaya: false }));
        mock.method(Upvote, "sudahUpvote", async () => false);
        mock.method(Upvote, "upvote", async () => false);
        const res = fakeRes();
        await UpvoteController.prosesUpvote(reqWarga(), res);
        assert.equal(res.statusCode, 409);
    });

    it("500 dengan pesan yang bisa dipahami jika database error", async () => {
        mock.method(Laporan, "getDetailLaporan", async () => { throw new Error("db down"); });
        mock.method(console, "error", () => {});
        const res = fakeRes();
        await UpvoteController.prosesUpvote(reqWarga(), res);
        assert.equal(res.statusCode, 500);
        assert.match(res.body.message, /gagal/i);
    });
});

describe("Upvote (model)", () => {
    it("upvote(): BEGIN -> INSERT -> UPDATE laporan -> COMMIT dalam satu transaksi", async () => {
        const client = fakeClient();
        mock.method(fakePool, "connect", async () => client);
        const hasil = await Upvote.upvote(ID_PENGGUNA, ID_LAPORAN);

        assert.equal(hasil, true);
        assert.equal(client.log[0], "BEGIN");
        assert.match(client.log[1], /^INSERT INTO upvote/);
        assert.match(client.log[2], /^UPDATE laporan/);
        assert.equal(client.log[3], "COMMIT");
        assert.equal(client.released, true);
    });

    it("upvote(): duplikat -> ROLLBACK, false, dan skor laporan tidak disentuh", async () => {
        const client = fakeClient(async (sql) =>
            /INSERT INTO upvote/.test(sql) ? { rowCount: 0, rows: [] } : { rowCount: 1, rows: [] });
        mock.method(fakePool, "connect", async () => client);

        assert.equal(await Upvote.upvote(ID_PENGGUNA, ID_LAPORAN), false);
        assert.ok(!client.log.some(q => /^UPDATE laporan/.test(q)));
        assert.equal(client.log.at(-1), "ROLLBACK");
        assert.equal(client.released, true);
    });

    it("upvote(): error di tengah transaksi -> ROLLBACK, client dilepas, error diteruskan", async () => {
        const client = fakeClient(async (sql) => {
            if (/^\s*UPDATE laporan/.test(sql)) throw new Error("boom");
            return { rowCount: 1, rows: [] };
        });
        mock.method(fakePool, "connect", async () => client);

        await assert.rejects(() => Upvote.upvote(ID_PENGGUNA, ID_LAPORAN), /boom/);
        assert.equal(client.log.at(-1), "ROLLBACK");
        assert.equal(client.released, true);
    });

    it("getDiupvoteOleh(): daftar kosong tidak mengirim query", async () => {
        const q = mock.method(fakePool, "query", async () => ({ rows: [] }));
        const hasil = await Upvote.getDiupvoteOleh(ID_PENGGUNA, []);
        assert.equal(hasil.size, 0);
        assert.equal(q.mock.callCount(), 0);
    });

    it("getDiupvoteOleh(): satu query untuk seluruh daftar, hasil berupa Set", async () => {
        const q = mock.method(fakePool, "query", async () => ({ rows: [{ id_laporan: "a" }] }));
        const hasil = await Upvote.getDiupvoteOleh(ID_PENGGUNA, ["a", "b", "c"]);
        assert.equal(q.mock.callCount(), 1);
        assert.deepEqual([...hasil], ["a"]);
    });
});
