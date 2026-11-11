const assert = require("node:assert/strict");
const test = require("node:test");
const { pool } = require("../src/config/database");
const Laporan = require("../src/models/Laporan");
const Tanggapan = require("../src/models/Tanggapan");
const TanggapanController = require("../src/controllers/TanggapanController");
const LaporanController = require("../src/controllers/LaporanController");
const { authorizeRoles } = require("../src/middleware/roleMiddleware");

const clientBerhasil = {
    async query() {
        return { rowCount: 1 };
    },
};

// Algo-044 - Memastikan aturan validasi hasil dan deskripsi tanggapan.
test("validasiTanggapan menerima hasil valid tanpa deskripsi", () => {
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: true,
        deskripsiTanggapan: "",
    }), true);
});

test("validasiTanggapan menerima hasil tidak valid dengan alasan", () => {
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: false,
        deskripsiTanggapan: "Bukti laporan tidak sesuai.",
    }), true);
});

test("validasiTanggapan menolak hasil tidak valid tanpa alasan", () => {
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: false,
        deskripsiTanggapan: "  ",
    }), false);
});

// Q-016 - Memastikan penyimpanan menggunakan parameter dan mengembalikan hasil query.
test("simpanTanggapan berhasil dan gagal mengikuti hasil query", async () => {
    const data = { statusTanggapan: false, deskripsiTanggapan: "Tidak valid." };
    assert.equal(await TanggapanController.simpanTanggapan(
        "laporan-id", "admin-id", data, clientBerhasil
    ), true);

    const clientGagal = {
        async query() {
            throw new Error("database down");
        },
    };
    const logSebelumnya = console.error;
    console.error = () => {};
    try {
        assert.equal(await TanggapanController.simpanTanggapan(
            "laporan-id", "admin-id", data, clientGagal
        ), false);
    } finally {
        console.error = logSebelumnya;
    }
});

test("Model Tanggapan menyimpan id admin dengan query berparameter", async () => {
    let panggilan;
    const client = {
        async query(sql, values) {
            panggilan = { sql, values };
            return { rowCount: 1 };
        },
    };
    const model = new Tanggapan();
    await model.simpanTanggapan("laporan-id", "admin-id", {
        statusTanggapan: true,
        deskripsiTanggapan: "Ditinjau.",
    }, client);

    assert.match(panggilan.sql, /VALUES \(\$1, \$2, \$3, CURRENT_TIMESTAMP, \$4\)/);
    assert.match(panggilan.sql, /id_admin/);
    assert.deepEqual(panggilan.values, ["laporan-id", "admin-id", true, "Ditinjau."]);
    assert.equal(model.getIdAdmin(), "admin-id");
});

test("pembacaan tanggapan terbaru hanya menyertakan identitas admin untuk admin", async () => {
    const client = {
        async query() {
            return {
                rows: [{
                    status_tanggapan: true,
                    waktu_tanggapan: "2026-11-11T00:00:00.000Z",
                    deskripsi_tanggapan: "Ditinjau.",
                    id_admin: "admin-id",
                    nama_admin: "Admin RAWAT",
                }],
            };
        },
    };

    const tanggapanWarga = await Tanggapan.getTanggapanByLaporan(
        "laporan-id", { role: "warga" }, client
    );
    assert.equal(Object.hasOwn(tanggapanWarga, "idAdmin"), false);
    assert.equal(Object.hasOwn(tanggapanWarga, "namaAdmin"), false);

    const tanggapanAdmin = await Tanggapan.getTanggapanByLaporan(
        "laporan-id", { role: "admin" }, client
    );
    assert.equal(tanggapanAdmin.idAdmin, "admin-id");
    assert.equal(tanggapanAdmin.namaAdmin, "Admin RAWAT");
});

// Algo-046 - Memastikan pembaruan status mengikuti keberhasilan model laporan.
test("simpanStatus berhasil dan gagal mengikuti pembaruan laporan", async () => {
    const updateSebelumnya = Laporan.updateStatusLaporan;
    try {
        Laporan.updateStatusLaporan = async () => true;
        assert.equal(await TanggapanController.simpanStatus("laporan-id", "DILIHAT"), true);

        Laporan.updateStatusLaporan = async () => false;
        assert.equal(await TanggapanController.simpanStatus("laporan-id", "DILIHAT"), false);
    } finally {
        Laporan.updateStatusLaporan = updateSebelumnya;
    }
});

// C20 - Memastikan perubahan pemeriksaan, tanggapan, dan status berada dalam transaksi.
test("simpan menggulung balik transaksi jika pembaruan status gagal", async () => {
    const connectSebelumnya = pool.connect;
    const simpanTanggapanSebelumnya = TanggapanController.simpanTanggapan;
    const simpanStatusSebelumnya = TanggapanController.simpanStatus;
    const simpanPemeriksaanSebelumnya = Laporan.simpanHasilPemeriksaan;
    const query = [];
    let responseStatus;
    let responseBody;
    let dilepas = false;
    const client = {
        async query(sql) {
            query.push(sql);
            return { rowCount: 1 };
        },
        release() {
            dilepas = true;
        },
    };

    try {
        pool.connect = async () => client;
        Laporan.simpanHasilPemeriksaan = async () => true;
        TanggapanController.simpanTanggapan = async () => true;
        TanggapanController.simpanStatus = async () => false;

        await TanggapanController.simpan({
            params: { idLaporan: "00000000-0000-0000-0000-000000000001" },
            session: { idPengguna: "admin-sesi", role: "admin" },
            body: {
                statusTanggapan: true,
                deskripsiTanggapan: "",
                statusLaporan: "SELESAI",
            },
        }, {
            status(code) {
                responseStatus = code;
                return this;
            },
            json(body) {
                responseBody = body;
                return this;
            },
        });

        assert.deepEqual(query, ["BEGIN", "ROLLBACK"]);
        assert.equal(responseStatus, 404);
        assert.equal(responseBody.message, "Laporan tidak ditemukan");
        assert.equal(dilepas, true);
    } finally {
        pool.connect = connectSebelumnya;
        TanggapanController.simpanTanggapan = simpanTanggapanSebelumnya;
        TanggapanController.simpanStatus = simpanStatusSebelumnya;
        Laporan.simpanHasilPemeriksaan = simpanPemeriksaanSebelumnya;
    }
});

test("simpan mengabaikan idAdmin klien dan menggunakan id dari sesi", async () => {
    const connectSebelumnya = pool.connect;
    const simpanTanggapanSebelumnya = TanggapanController.simpanTanggapan;
    const simpanStatusSebelumnya = TanggapanController.simpanStatus;
    const simpanPemeriksaanSebelumnya = Laporan.simpanHasilPemeriksaan;
    const query = [];
    let argumenTanggapan;
    let responseStatus;
    const client = {
        async query(sql) {
            query.push(sql);
            return { rowCount: 1 };
        },
        release() {},
    };
    const req = {
        params: { idLaporan: "00000000-0000-0000-0000-000000000001" },
        session: { idPengguna: "admin-sesi", role: "admin" },
        body: {
            statusTanggapan: true,
            deskripsiTanggapan: "",
            statusLaporan: "SELESAI",
            idAdmin: "admin-palsu",
        },
    };
    const res = {
        status(code) {
            responseStatus = code;
            return this;
        },
        json() {
            return this;
        },
    };

    try {
        pool.connect = async () => client;
        Laporan.simpanHasilPemeriksaan = async () => true;
        TanggapanController.simpanTanggapan = async (...args) => {
            argumenTanggapan = args;
            return true;
        };
        TanggapanController.simpanStatus = async () => true;

        await TanggapanController.simpan(req, res);

        assert.equal(responseStatus, 200);
        assert.equal(argumenTanggapan[1], "admin-sesi");
        assert.equal(Object.hasOwn(argumenTanggapan[2], "idAdmin"), false);
        assert.deepEqual(query, ["BEGIN", "COMMIT"]);
    } finally {
        pool.connect = connectSebelumnya;
        TanggapanController.simpanTanggapan = simpanTanggapanSebelumnya;
        TanggapanController.simpanStatus = simpanStatusSebelumnya;
        Laporan.simpanHasilPemeriksaan = simpanPemeriksaanSebelumnya;
    }
});

test("detail laporan hanya mengirim id dan nama admin dalam respons admin", async () => {
    const querySebelumnya = pool.query;
    const getDetailSebelumnya = Laporan.getDetailLaporan;
    pool.query = async () => ({
        rows: [{
            status_tanggapan: true,
            waktu_tanggapan: "2026-11-11T00:00:00.000Z",
            deskripsi_tanggapan: "Ditinjau.",
            id_admin: "admin-id",
            nama_admin: "Admin RAWAT",
        }],
    });
    Laporan.getDetailLaporan = async () => ({ idLaporan: "laporan-id" });

    const panggilDetail = async (session) => {
        let body;
        await LaporanController.detail({
            params: { idLaporan: "00000000-0000-0000-0000-000000000001" },
            session,
        }, {
            status() {
                return this;
            },
            json(value) {
                body = value;
                return this;
            },
        });
        return body.laporan.tanggapanTeratas;
    };

    try {
        const responsWarga = await panggilDetail({ idPengguna: "warga-id", role: "warga" });
        assert.equal(Object.hasOwn(responsWarga, "idAdmin"), false);
        assert.equal(Object.hasOwn(responsWarga, "namaAdmin"), false);

        const responsAdmin = await panggilDetail({ idPengguna: "admin-id", role: "admin" });
        assert.equal(responsAdmin.idAdmin, "admin-id");
        assert.equal(responsAdmin.namaAdmin, "Admin RAWAT");
    } finally {
        pool.query = querySebelumnya;
        Laporan.getDetailLaporan = getDetailSebelumnya;
    }
});

test("handler menolak sesi tanpa pengguna dan role non-admin", async () => {
    for (const [session, statusDiharapkan] of [
        [null, 401],
        [{ idPengguna: "warga-id", role: "warga" }, 403],
    ]) {
        let responseStatus;
        await TanggapanController.simpan({
            params: { idLaporan: "00000000-0000-0000-0000-000000000001" },
            session,
            body: {},
        }, {
            status(code) {
                responseStatus = code;
                return this;
            },
            json() {
                return this;
            },
        });
        assert.equal(responseStatus, statusDiharapkan);
    }
});

// Auth - Pengguna non-admin wajib ditolak oleh middleware otorisasi yang sudah ada.
test("akses endpoint ditolak untuk pengguna non-admin", () => {
    let status;
    let diteruskan = false;
    const middleware = authorizeRoles("admin");
    middleware(
        { session: { idPengguna: "warga-id", role: "warga" } },
        {
            status(kode) {
                status = kode;
                return this;
            },
            json() {
                return this;
            },
        },
        () => { diteruskan = true; }
    );
    assert.equal(status, 403);
    assert.equal(diteruskan, false);
});

test("akses tanpa sesi ditolak dengan 401", () => {
    let status;
    authorizeRoles("admin")(
        { session: null },
        {
            status(kode) {
                status = kode;
                return this;
            },
            json() {
                return this;
            },
        },
        () => assert.fail("Middleware tidak boleh meneruskan request tanpa sesi")
    );
    assert.equal(status, 401);
});

// C13 - Pembatalan konfirmasi tidak memanggil aksi penyimpanan.
test("batal konfirmasi tidak menyimpan atau mengubah laporan", async () => {
    const { simpanJikaTerkonfirmasi } = await import(
        "../../frontend/src/utils/tanggapanForm.js"
    );
    let jumlahSimpan = 0;
    const simpan = () => { jumlahSimpan += 1; };
    assert.equal(simpanJikaTerkonfirmasi(false, simpan), false);
    assert.equal(jumlahSimpan, 0);
});
