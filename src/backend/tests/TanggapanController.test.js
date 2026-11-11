const assert = require("node:assert/strict");
const test = require("node:test");
const { pool } = require("../src/config/database");
const Laporan = require("../src/models/Laporan");
const Tanggapan = require("../src/models/Tanggapan");
const TanggapanController = require("../src/controllers/TanggapanController");
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
        "laporan-id", data, clientBerhasil
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
            "laporan-id", data, clientGagal
        ), false);
    } finally {
        console.error = logSebelumnya;
    }
});

test("Model Tanggapan menggunakan placeholder query berparameter", async () => {
    let panggilan;
    const client = {
        async query(sql, values) {
            panggilan = { sql, values };
            return { rowCount: 1 };
        },
    };
    const model = new Tanggapan();
    await model.simpanTanggapan("laporan-id", {
        statusTanggapan: true,
        deskripsiTanggapan: "Ditinjau.",
    }, client);

    assert.match(panggilan.sql, /VALUES \(\$1, \$2, CURRENT_TIMESTAMP, \$3\)/);
    assert.deepEqual(panggilan.values, ["laporan-id", true, "Ditinjau."]);
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
