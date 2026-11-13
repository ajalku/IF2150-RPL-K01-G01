const { describe, it, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const { fakePool, fakeRes, fakeReq, ID_PENGGUNA } = require("./support/helpers");

const Tutorial = require("../src/models/Tutorial");
const TutorialController = require("../src/controllers/TutorialController");

afterEach(() => mock.restoreAll());

const req = (body) => fakeReq({ body, session: { idPengguna: ID_PENGGUNA, role: "warga" } });
const TOTAL = Tutorial.getDaftarLangkah().length;

describe("Tutorial (model, C07)", () => {
    it("getLangkahSaatIni/getTotalLangkah", () => {
        const t = new Tutorial();
        assert.equal(t.getLangkahSaatIni(), 1);
        assert.equal(t.getTotalLangkah(), TOTAL);
        assert.ok(TOTAL >= 1);
    });
    it("setiap langkah punya judul dan isi", () => {
        for (const l of Tutorial.getDaftarLangkah()) {
            assert.ok(l.judul && l.isi);
        }
    });
    it("sudahLihat(): true hanya jika status_tutorial = true", async () => {
        mock.method(fakePool, "query", async () => ({ rowCount: 1, rows: [{ status_tutorial: true }] }));
        assert.equal(await Tutorial.sudahLihat(ID_PENGGUNA), true);
        mock.restoreAll();
        mock.method(fakePool, "query", async () => ({ rowCount: 1, rows: [{ status_tutorial: false }] }));
        assert.equal(await Tutorial.sudahLihat(ID_PENGGUNA), false);
        mock.restoreAll();
        mock.method(fakePool, "query", async () => ({ rowCount: 0, rows: [] }));
        assert.equal(await Tutorial.sudahLihat(ID_PENGGUNA), false);
    });
});

describe("TutorialController (UC05)", () => {
    it("startTutorial: mengembalikan langkah dan status", async () => {
        mock.method(Tutorial, "sudahLihat", async () => false);
        const res = fakeRes();
        await TutorialController.startTutorial(req(), res);
        assert.equal(res.statusCode, 200);
        assert.equal(res.body.sudahLihat, false);
        assert.equal(res.body.langkahSaatIni, 1);
        assert.equal(res.body.totalLangkah, TOTAL);
        assert.equal(res.body.langkah.length, TOTAL);
    });

    it("skipTutorial: menyimpan status dan 200", async () => {
        const simpan = mock.method(Tutorial, "tandaiSudahLihat", async () => true);
        const res = fakeRes();
        await TutorialController.skipTutorial(req(), res);
        assert.equal(res.statusCode, 200);
        assert.deepEqual(simpan.mock.calls[0].arguments, [ID_PENGGUNA]);
    });

    it("finishTutorial: ditolak jika belum di langkah terakhir", async () => {
        const simpan = mock.method(Tutorial, "tandaiSudahLihat", async () => true);
        const res = fakeRes();
        await TutorialController.finishTutorial(req({ langkahSaatIni: TOTAL - 1 }), res);
        assert.equal(res.statusCode, 400);
        assert.equal(simpan.mock.callCount(), 0);
    });

    it("finishTutorial: diterima di langkah terakhir", async () => {
        mock.method(Tutorial, "tandaiSudahLihat", async () => true);
        const res = fakeRes();
        await TutorialController.finishTutorial(req({ langkahSaatIni: TOTAL }), res);
        assert.equal(res.statusCode, 200);
    });

    it("finishTutorial: 500 jika penyimpanan gagal", async () => {
        mock.method(Tutorial, "tandaiSudahLihat", async () => false);
        const res = fakeRes();
        await TutorialController.finishTutorial(req({ langkahSaatIni: TOTAL }), res);
        assert.equal(res.statusCode, 500);
    });

    it("finishTutorial: body kosong tidak membuat server error", async () => {
        const res = fakeRes();
        await TutorialController.finishTutorial(fakeReq({ session: { idPengguna: ID_PENGGUNA } }), res);
        assert.equal(res.statusCode, 400);
    });
});
