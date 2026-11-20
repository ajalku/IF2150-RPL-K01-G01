const assert = require("node:assert/strict");
const test = require("node:test");
const { pool } = require("../src/config/database");
const Laporan = require("../src/models/Laporan");
const Tanggapan = require("../src/models/Tanggapan");
const TanggapanController = require("../src/controllers/TanggapanController");
const LaporanController = require("../src/controllers/LaporanController");
const { authorizeRoles } = require("../src/middleware/roleMiddleware");

function responseRecorder() {
    return {
        statusCode: undefined,
        body: undefined,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };
}

function requestSimpan(overrides = {}) {
    return {
        params: { idLaporan: "00000000-0000-0000-0000-000000000001" },
        session: { idPengguna: "admin-sesi", role: "admin" },
        body: {
            statusTanggapan: true,
            deskripsiTanggapan: "",
            statusLaporan: "SELESAI",
        },
        ...overrides,
    };
}

test("C20-UT01 validasiTanggapan menerima hasil valid tanpa deskripsi", () => {
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: true,
        deskripsiTanggapan: "",
    }), true);
});

test("C20-UT02 validasiTanggapan menerima hasil tidak valid dengan alasan", () => {
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: false,
        deskripsiTanggapan: "Bukti laporan tidak sesuai.",
    }), true);
});

test("C20-UT03 validasiTanggapan menolak alasan kosong atau hanya spasi", () => {
    for (const deskripsiTanggapan of ["", "  \t\n"]) {
        assert.equal(TanggapanController.validasiTanggapan({
            statusTanggapan: false,
            deskripsiTanggapan,
        }), false);
    }
});

test("C20-UT04 simpanTanggapan mengikuti hasil penyimpanan model", async () => {
    const data = { statusTanggapan: false, deskripsiTanggapan: "Tidak valid." };
    const clientBerhasil = {
        async query() {
            return { rowCount: 1 };
        },
    };
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

test("C06-UT01 Model Tanggapan menyimpan id admin dengan query berparameter", async () => {
    let panggilan;
    const client = {
        async query(sql, values) {
            panggilan = { sql, values };
            return { rowCount: 1 };
        },
    };
    const model = new Tanggapan();
    assert.equal(await model.simpanTanggapan("laporan-id", "admin-id", {
        statusTanggapan: true,
        deskripsiTanggapan: "Ditinjau.",
    }, client), true);

    assert.match(panggilan.sql, /VALUES \(\$1, \$2, \$3, CURRENT_TIMESTAMP, \$4\)/);
    assert.match(panggilan.sql, /id_admin/);
    assert.deepEqual(panggilan.values, ["laporan-id", "admin-id", true, "Ditinjau."]);
    assert.equal(model.getIdAdmin(), "admin-id");
});

test("C06-UT02 getTanggapanByLaporan hanya membuka identitas admin kepada admin", async () => {
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

test("C20-UT05 simpanStatus mengikuti hasil pembaruan laporan", async () => {
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

test("C20-UT06 simpan menggulung balik transaksi jika pembaruan status gagal", async () => {
    const connectSebelumnya = pool.connect;
    const simpanTanggapanSebelumnya = TanggapanController.simpanTanggapan;
    const simpanStatusSebelumnya = TanggapanController.simpanStatus;
    const simpanPemeriksaanSebelumnya = Laporan.simpanHasilPemeriksaan;
    const query = [];
    const response = responseRecorder();
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

        await TanggapanController.simpan(requestSimpan(), response);

        assert.deepEqual(query, ["BEGIN", "ROLLBACK"]);
        assert.equal(response.statusCode, 404);
        assert.equal(response.body.message, "Laporan tidak ditemukan");
        assert.equal(dilepas, true);
    } finally {
        pool.connect = connectSebelumnya;
        TanggapanController.simpanTanggapan = simpanTanggapanSebelumnya;
        TanggapanController.simpanStatus = simpanStatusSebelumnya;
        Laporan.simpanHasilPemeriksaan = simpanPemeriksaanSebelumnya;
    }
});

test("C20-UT07 simpan mengabaikan idAdmin dari body dan memakai identitas sesi", async () => {
    const connectSebelumnya = pool.connect;
    const simpanTanggapanSebelumnya = TanggapanController.simpanTanggapan;
    const simpanStatusSebelumnya = TanggapanController.simpanStatus;
    const simpanPemeriksaanSebelumnya = Laporan.simpanHasilPemeriksaan;
    const query = [];
    let argumenTanggapan;
    const response = responseRecorder();
    const client = {
        async query(sql) {
            query.push(sql);
            return { rowCount: 1 };
        },
        release() {},
    };
    const req = requestSimpan({
        body: {
            statusTanggapan: true,
            deskripsiTanggapan: "",
            statusLaporan: "SELESAI",
            idAdmin: "admin-palsu",
        },
    });

    try {
        pool.connect = async () => client;
        Laporan.simpanHasilPemeriksaan = async () => true;
        TanggapanController.simpanTanggapan = async (...args) => {
            argumenTanggapan = args;
            return true;
        };
        TanggapanController.simpanStatus = async () => true;

        await TanggapanController.simpan(req, response);

        assert.equal(response.statusCode, 200);
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

test("C20-UT08 detail laporan menyembunyikan identitas admin dari warga", async () => {
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
        const response = responseRecorder();
        await LaporanController.detail({
            params: { idLaporan: "00000000-0000-0000-0000-000000000001" },
            session,
        }, response);
        return response.body.laporan.tanggapanTeratas;
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

test("C20-UT09 handler menolak sesi tanpa pengguna dan role non-admin", async () => {
    for (const [session, statusDiharapkan] of [
        [null, 401],
        [{ idPengguna: "warga-id", role: "warga" }, 403],
    ]) {
        const response = responseRecorder();
        await TanggapanController.simpan(requestSimpan({ session, body: {} }), response);
        assert.equal(response.statusCode, statusDiharapkan);
    }
});

test("C20-UT10 middleware menolak akses pengguna non-admin", () => {
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

test("C20-UT11 middleware menolak request tanpa sesi dengan 401", () => {
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

test("C13-UT01 pembatalan konfirmasi tidak memanggil aksi penyimpanan", async () => {
    const { simpanJikaTerkonfirmasi } = await import(
        "../../frontend/src/utils/tanggapanForm.js"
    );
    let jumlahSimpan = 0;
    const simpan = () => { jumlahSimpan += 1; };
    assert.equal(simpanJikaTerkonfirmasi(false, simpan), false);
    assert.equal(jumlahSimpan, 0);
});

test("C13-UT02 konfirmasi memanggil aksi penyimpanan tepat satu kali", async () => {
    const { simpanJikaTerkonfirmasi } = await import(
        "../../frontend/src/utils/tanggapanForm.js"
    );
    let jumlahSimpan = 0;
    const hasil = simpanJikaTerkonfirmasi(true, () => {
        jumlahSimpan += 1;
        return "tersimpan";
    });
    assert.equal(hasil, "tersimpan");
    assert.equal(jumlahSimpan, 1);
});

test("C20-UT12 validasiTanggapan menerima deskripsi tepat 2000 karakter", () => {
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: false,
        deskripsiTanggapan: "x".repeat(2000),
    }), true);
});

test("C20-UT13 validasiTanggapan menolak deskripsi 2001 karakter", () => {
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: false,
        deskripsiTanggapan: "x".repeat(2001),
    }), false);
});

test("C20-UT14 validasiTanggapan menolak status atau deskripsi dengan tipe tidak valid", () => {
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: "true",
        deskripsiTanggapan: "",
    }), false);
    assert.equal(TanggapanController.validasiTanggapan({
        statusTanggapan: true,
        deskripsiTanggapan: null,
    }), false);
    assert.equal(TanggapanController.validasiTanggapan(null), false);
});

test("C06-UT03 simpanTanggapan mengembalikan false saat INSERT tidak membuat baris", async () => {
    const model = new Tanggapan();
    assert.equal(await model.simpanTanggapan("laporan-id", null, {
        statusTanggapan: true,
        deskripsiTanggapan: "",
    }, {
        async query() {
            return { rowCount: 0 };
        },
    }), false);
    assert.equal(model.getIdAdmin(), null);
});

test("C06-UT04 getTanggapanByLaporan mengembalikan null jika laporan belum ditanggapi", async () => {
    const tanggapan = await Tanggapan.getTanggapanByLaporan(
        "laporan-id",
        { role: "warga" },
        { async query() { return { rows: [] }; } }
    );
    assert.equal(tanggapan, null);
});

test("C06-UT05 tanggapan lama dengan id_admin NULL aman dibaca admin", async () => {
    const tanggapan = await Tanggapan.getTanggapanByLaporan(
        "laporan-id",
        { role: "admin" },
        {
            async query() {
                return {
                    rows: [{
                        status_tanggapan: false,
                        waktu_tanggapan: "2020-01-01T00:00:00.000Z",
                        deskripsi_tanggapan: "Alasan lama.",
                        id_admin: null,
                        nama_admin: null,
                    }],
                };
            },
        }
    );
    assert.equal(tanggapan.idAdmin, null);
    assert.equal(tanggapan.namaAdmin, null);
});

test("C06-UT06 simpanTanggapan menerima id_admin NULL untuk kompatibilitas data lama", async () => {
    let values;
    const model = new Tanggapan();
    assert.equal(await model.simpanTanggapan("laporan-id", null, {
        statusTanggapan: true,
        deskripsiTanggapan: "",
    }, {
        async query(_sql, parameter) {
            values = parameter;
            return { rowCount: 1 };
        },
    }), true);
    assert.equal(values[1], null);
    assert.equal(model.getIdAdmin(), null);
});

test("C20-UT15 simpanTanggapan tidak menyimpan form yang tidak valid", async () => {
    let jumlahQuery = 0;
    assert.equal(await TanggapanController.simpanTanggapan(
        "laporan-id",
        "admin-id",
        { statusTanggapan: false, deskripsiTanggapan: " " },
        {
            async query() {
                jumlahQuery += 1;
                return { rowCount: 1 };
            },
        }
    ), false);
    assert.equal(jumlahQuery, 0);
});

test("C20-UT16 simpanStatus menerima status pertama dalam urutan domain", async () => {
    const updateSebelumnya = Laporan.updateStatusLaporan;
    let args;
    try {
        Laporan.updateStatusLaporan = async (...nilai) => {
            args = nilai;
            return true;
        };
        assert.equal(await TanggapanController.simpanStatus(
            "laporan-id", Laporan.STATUS_LAPORAN[0]
        ), true);
        assert.equal(args[1], "BELUM_DILIHAT");
    } finally {
        Laporan.updateStatusLaporan = updateSebelumnya;
    }
});

test("C20-UT17 simpanStatus menerima status terakhir dalam urutan domain", async () => {
    const updateSebelumnya = Laporan.updateStatusLaporan;
    let args;
    try {
        Laporan.updateStatusLaporan = async (...nilai) => {
            args = nilai;
            return true;
        };
        assert.equal(await TanggapanController.simpanStatus(
            "laporan-id", Laporan.STATUS_LAPORAN.at(-1)
        ), true);
        assert.equal(args[1], "SELESAI");
    } finally {
        Laporan.updateStatusLaporan = updateSebelumnya;
    }
});

test("C20-UT18 simpanStatus menolak status di luar enum", async () => {
    const updateSebelumnya = Laporan.updateStatusLaporan;
    let dipanggil = false;
    try {
        Laporan.updateStatusLaporan = async () => {
            dipanggil = true;
            return true;
        };
        assert.equal(await TanggapanController.simpanStatus("laporan-id", "TIDAK_VALID"), false);
        assert.equal(dipanggil, false);
    } finally {
        Laporan.updateStatusLaporan = updateSebelumnya;
    }
});

test("C20-UT19 simpanStatus melaporkan laporan yang tidak ditemukan", async () => {
    const updateSebelumnya = Laporan.updateStatusLaporan;
    try {
        Laporan.updateStatusLaporan = async () => false;
        assert.equal(await TanggapanController.simpanStatus("laporan-hilang", "SELESAI"), false);
    } finally {
        Laporan.updateStatusLaporan = updateSebelumnya;
    }
});

test("C20-UT20 handler menolak format idLaporan yang tidak valid sebelum transaksi", async () => {
    const connectSebelumnya = pool.connect;
    let koneksiDibuka = false;
    const response = responseRecorder();
    try {
        pool.connect = async () => {
            koneksiDibuka = true;
            throw new Error("Tidak boleh membuka koneksi");
        };
        await TanggapanController.simpan(requestSimpan({
            params: { idLaporan: "bukan-uuid" },
        }), response);
        assert.equal(response.statusCode, 404);
        assert.equal(koneksiDibuka, false);
    } finally {
        pool.connect = connectSebelumnya;
    }
});

test("C20-UT21 handler menerima catatan pemeriksaan tepat 1000 karakter", async () => {
    const connectSebelumnya = pool.connect;
    const simpanPemeriksaanSebelumnya = Laporan.simpanHasilPemeriksaan;
    const simpanTanggapanSebelumnya = TanggapanController.simpanTanggapan;
    const simpanStatusSebelumnya = TanggapanController.simpanStatus;
    const query = [];
    const response = responseRecorder();
    const client = {
        async query(sql) {
            query.push(sql);
            return { rowCount: 1 };
        },
        release() {},
    };
    try {
        pool.connect = async () => client;
        Laporan.simpanHasilPemeriksaan = async () => true;
        TanggapanController.simpanTanggapan = async () => true;
        TanggapanController.simpanStatus = async () => true;
        await TanggapanController.simpan(requestSimpan({
            body: {
                statusTanggapan: true,
                deskripsiTanggapan: "",
                catatanPemeriksaan: "x".repeat(1000),
                statusLaporan: "SELESAI",
            },
        }), response);
        assert.equal(response.statusCode, 200);
        assert.deepEqual(query, ["BEGIN", "COMMIT"]);
    } finally {
        pool.connect = connectSebelumnya;
        Laporan.simpanHasilPemeriksaan = simpanPemeriksaanSebelumnya;
        TanggapanController.simpanTanggapan = simpanTanggapanSebelumnya;
        TanggapanController.simpanStatus = simpanStatusSebelumnya;
    }
});

test("C20-UT22 handler menolak catatan pemeriksaan 1001 karakter", async () => {
    const connectSebelumnya = pool.connect;
    let koneksiDibuka = false;
    const response = responseRecorder();
    try {
        pool.connect = async () => {
            koneksiDibuka = true;
            throw new Error("Tidak boleh membuka koneksi");
        };
        await TanggapanController.simpan(requestSimpan({
            body: {
                statusTanggapan: true,
                deskripsiTanggapan: "",
                catatanPemeriksaan: "x".repeat(1001),
                statusLaporan: "SELESAI",
            },
        }), response);
        assert.equal(response.statusCode, 400);
        assert.equal(koneksiDibuka, false);
    } finally {
        pool.connect = connectSebelumnya;
    }
});
