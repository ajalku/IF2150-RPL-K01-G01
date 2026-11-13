const assert = require("node:assert/strict");
const test = require("node:test");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");
const Laporan = require("../src/models/Laporan");
const Lokasi = require("../src/models/Lokasi");
const LaporanController = require("../src/controllers/LaporanController");
const LokasiController = require("../src/controllers/LokasiController");
const MapAPIService = require("../src/services/MapAPIService");
const { pool } = require("../src/config/database");
const { UPLOAD_DIR, uploadFoto } = require("../src/middleware/uploadMiddleware");
const { requireAuth } = require("../src/middleware/authMiddleware");

const ID_LAPORAN = "00000000-0000-0000-0000-000000000001";

function request(overrides = {}) {
    return {
        body: {},
        query: {},
        params: {},
        session: { idPengguna: "pengguna-1", role: "warga" },
        ...overrides,
    };
}

function response() {
    return {
        statusCode: 200,
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

async function withMock(target, key, replacement, callback) {
    const original = target[key];
    target[key] = replacement;
    try {
        return await callback();
    } finally {
        target[key] = original;
    }
}

async function withMocks(overrides, callback) {
    const originals = overrides.map(({ target, key }) => ({
        target,
        key,
        value: target[key],
    }));
    overrides.forEach(({ target, key, replacement }) => {
        target[key] = replacement;
    });
    try {
        return await callback();
    } finally {
        originals.reverse().forEach(({ target, key, value }) => {
            target[key] = value;
        });
    }
}

async function withUploadServer(callback) {
    const app = express();
    app.post("/upload", uploadFoto, (req, res) => {
        res.status(201).json({ filename: req.file.filename });
    });
    const server = await new Promise((resolve) => {
        const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
    });
    try {
        const { port } = server.address();
        await callback(`http://127.0.0.1:${port}/upload`);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((err) => err ? reject(err) : resolve());
        });
    }
}

const dataLaporanValid = {
    namaMasalah: "Jalan berlubang",
    kategori: "Jalan",
    tingkatPermasalahan: "TINGGI",
    statusPrivasi: "PUBLIK",
    latitude: "-6.9",
    longitude: "107.6",
    deskripsi: "",
};

test("BE-LAP-01: membuat laporan menyimpan koordinat terkonversi dan mengembalikan ID", async () => {
    let dataTersimpan;
    await withMock(Laporan, "simpan", async (data) => {
        dataTersimpan = data;
        return data.idLaporan;
    }, async () => {
        const res = response();
        await LaporanController.buat(request({ body: dataLaporanValid }), res);

        assert.equal(res.statusCode, 201);
        assert.equal(res.body.message, "Laporan berhasil dikirim");
        assert.match(res.body.idLaporan, /^[0-9a-f-]{36}$/i);
        assert.equal(dataTersimpan.idPengguna, "pengguna-1");
        assert.deepEqual(dataTersimpan.lokasi.getKoordinat(), {
            latitude: -6.9,
            longitude: 107.6,
        });
    });
});

test("BE-LAP-13: daftar menolak status validasi dan urgensi yang tidak dikenal", async () => {
    let jumlahPanggilan = 0;
    await withMock(Laporan, "getDaftarLaporan", async () => {
        jumlahPanggilan += 1;
        return [];
    }, async () => {
        for (const query of [
            { statusValidasi: "MERAGUKAN" },
            { tingkatPermasalahan: "DARURAT" },
        ]) {
            const res = response();
            await LaporanController.daftar(request({ query }), res);
            assert.equal(res.statusCode, 400);
        }
        assert.equal(jumlahPanggilan, 0);
    });
});

test("BE-LAP-02: menolak laporan tanpa field wajib tanpa menyimpan", async () => {
    let jumlahSimpan = 0;
    await withMock(Laporan, "simpan", async () => { jumlahSimpan += 1; }, async () => {
        const res = response();
        await LaporanController.buat(request({ body: { ...dataLaporanValid, namaMasalah: " " } }), res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.message, "Data belum lengkap");
        assert.equal(jumlahSimpan, 0);
    });
});

test("BE-LAP-09: middleware upload menolak tipe file selain JPG/PNG", async () => {
    await withUploadServer(async (url) => {
        const formData = new FormData();
        formData.append("foto", new Blob(["teks"], { type: "text/plain" }), "catatan.txt");
        const hasil = await fetch(url, { method: "POST", body: formData });

        assert.equal(hasil.status, 400);
        assert.match((await hasil.json()).message, /Format foto harus JPG, JPEG, atau PNG/);
    });
});

test("BE-LAP-09: middleware upload menolak foto yang lebih besar dari 5 MB", async () => {
    await withUploadServer(async (url) => {
        const fotoBesar = new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("foto", fotoBesar, "besar.jpg");
        const hasil = await fetch(url, { method: "POST", body: formData });

        assert.equal(hasil.status, 400);
        assert.match((await hasil.json()).message, /Ukuran foto maksimal 5 MB/);
    });
});

test("BE-LAP-06: menolak koordinat parsial, bukan angka, atau di luar rentang", async () => {
    let jumlahSimpan = 0;
    await withMock(Laporan, "simpan", async () => { jumlahSimpan += 1; }, async () => {
        const kasus = [
            { latitude: "-6.9", longitude: undefined },
            { latitude: "abc", longitude: "107.6" },
            { latitude: "91", longitude: "107.6" },
        ];
        for (const lokasi of kasus) {
            const res = response();
            await LaporanController.buat(request({
                body: { ...dataLaporanValid, ...lokasi },
            }), res);

            assert.equal(res.statusCode, 400);
            assert.equal(res.body.message, "Koordinat lokasi tidak valid");
        }
        assert.equal(jumlahSimpan, 0);
    });
});

test("BE-LAP-16: model menyembunyikan laporan tidak valid dari pengguna lain", async () => {
    const querySebelumnya = pool.query;
    pool.query = async () => ({
        rows: [{
            id_laporan: ID_LAPORAN,
            id_pengguna: "pemilik-lain",
            nama_masalah: "Masalah",
            kategori: "Jalan",
            tingkat_permasalahan: "SEDANG",
            status_privasi: "PUBLIK",
            foto: null,
            deskripsi: "",
            status_laporan: "BELUM_DILIHAT",
            status_validasi: "TIDAK_VALID",
            catatan_pemeriksaan: "Catatan rahasia",
            batas_waktu: null,
            jumlah_upvote: 0,
            skor_populer: 0,
            waktu_lapor: "2026-01-01",
            latitude: -6.9,
            longitude: 107.6,
            alamat: "Bandung",
            nama_pelapor: "Pemilik",
        }],
    });
    try {
        const hasil = await Laporan.getDetailLaporan(ID_LAPORAN, {
            idPengguna: "pengguna-1",
            role: "warga",
        });
        assert.equal(hasil, null);
    } finally {
        pool.query = querySebelumnya;
    }
});

test("BE-LAP-16: model menyamarkan nama pelapor pada laporan anonim", async () => {
    const querySebelumnya = pool.query;
    pool.query = async () => ({
        rows: [{
            id_laporan: ID_LAPORAN,
            id_pengguna: "pemilik-lain",
            nama_masalah: "Masalah",
            kategori: "Jalan",
            tingkat_permasalahan: "SEDANG",
            status_privasi: "ANONIM",
            foto: null,
            deskripsi: "",
            status_laporan: "BELUM_DILIHAT",
            status_validasi: "VALID",
            catatan_pemeriksaan: null,
            batas_waktu: null,
            jumlah_upvote: 0,
            skor_populer: 0,
            waktu_lapor: "2026-01-01",
            latitude: -6.9,
            longitude: 107.6,
            alamat: "Bandung",
            nama_pelapor: "Nama Pelapor",
        }],
    });
    try {
        const hasil = await Laporan.getDetailLaporan(ID_LAPORAN, {
            idPengguna: "pengguna-1",
            role: "warga",
        });
        assert.equal(hasil.pelapor, null);
        assert.equal(hasil.lokasi.alamat, "Bandung");
    } finally {
        pool.query = querySebelumnya;
    }
});

test("BE-LAP-07: alamat tidak ditemukan menolak pembuatan laporan", async () => {
    let jumlahSimpan = 0;
    await withMock(MapAPIService, "geocode", async () => null, async () =>
        withMock(Laporan, "simpan", async () => { jumlahSimpan += 1; }, async () => {
            const body = { ...dataLaporanValid, latitude: undefined, longitude: undefined, alamat: "Alamat fiktif" };
            const res = response();
            await LaporanController.buat(request({ body }), res);

            assert.equal(res.statusCode, 400);
            assert.match(res.body.message, /Alamat tidak ditemukan/);
            assert.equal(jumlahSimpan, 0);
        })
    );
});

test("BE-LAP-03: menolak laporan tanpa lokasi", async () => {
    let jumlahSimpan = 0;
    await withMock(Laporan, "simpan", async () => { jumlahSimpan += 1; }, async () => {
        const body = { ...dataLaporanValid, latitude: undefined, longitude: undefined };
        const res = response();
        await LaporanController.buat(request({ body }), res);

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.message, "Data belum lengkap");
        assert.equal(jumlahSimpan, 0);
    });
});

test("BE-LAP-04: menolak field laporan yang melebihi panjang maksimum", async () => {
    const kasus = [
        [{ namaMasalah: "x".repeat(151) }, "Nama masalah maksimal 150 karakter"],
        [{ kategori: "x".repeat(51) }, "Kategori maksimal 50 karakter"],
        [{ deskripsi: "x".repeat(2001) }, "Deskripsi maksimal 2000 karakter"],
    ];
    let jumlahSimpan = 0;
    await withMock(Laporan, "simpan", async () => { jumlahSimpan += 1; }, async () => {
        for (const [perubahan, pesan] of kasus) {
            const res = response();
            await LaporanController.buat(request({
                body: { ...dataLaporanValid, ...perubahan },
            }), res);
            assert.equal(res.statusCode, 400);
            assert.equal(res.body.message, pesan);
        }
        assert.equal(jumlahSimpan, 0);
    });
});

test("BE-LAP-05: menolak urgensi dan privasi yang tidak dikenal", async () => {
    const kasus = [
        [{ tingkatPermasalahan: "DARURAT" }, /Tingkat permasalahan harus salah satu/],
        [{ statusPrivasi: "RAHASIA" }, /Status privasi harus salah satu/],
    ];
    let jumlahSimpan = 0;
    await withMock(Laporan, "simpan", async () => { jumlahSimpan += 1; }, async () => {
        for (const [perubahan, pesan] of kasus) {
            const res = response();
            await LaporanController.buat(request({
                body: { ...dataLaporanValid, ...perubahan },
            }), res);
            assert.equal(res.statusCode, 400);
            assert.match(res.body.message, pesan);
        }
        assert.equal(jumlahSimpan, 0);
    });
});

test("BE-LAP-08: kegagalan geocoding saat membuat laporan menghasilkan 502", async () => {
    const logSebelumnya = console.error;
    console.error = () => {};
    try {
        await withMock(MapAPIService, "geocode", async () => {
            throw new Error("service unavailable");
        }, async () => {
            const body = { ...dataLaporanValid, latitude: undefined, longitude: undefined, alamat: "Bandung" };
            const res = response();
            await LaporanController.buat(request({ body }), res);

            assert.equal(res.statusCode, 502);
            assert.match(res.body.message, /Layanan peta tidak dapat dihubungi/);
        });
    } finally {
        console.error = logSebelumnya;
    }
});

test("BE-LAP-10: controller menolak foto yang isi filenya bukan JPEG atau PNG", async () => {
    const namaFile = `test-invalid-${crypto.randomUUID()}.jpg`;
    const pathFoto = path.join(UPLOAD_DIR, namaFile);
    await fs.promises.writeFile(pathFoto, Buffer.from("not an image"));
    let jumlahSimpan = 0;

    try {
        await withMock(Laporan, "simpan", async () => { jumlahSimpan += 1; }, async () => {
            const res = response();
            await LaporanController.buat(request({
                body: dataLaporanValid,
                file: { path: pathFoto, filename: namaFile },
            }), res);

            assert.equal(res.statusCode, 400);
            assert.equal(res.body.message, "Format foto harus JPG, JPEG, atau PNG");
            assert.equal(jumlahSimpan, 0);
        });
        await assert.rejects(fs.promises.access(pathFoto), { code: "ENOENT" });
    } finally {
        await fs.promises.unlink(pathFoto).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
    }
});

test("BE-LAP-11: kegagalan model saat membuat laporan menjadi HTTP 500", async () => {
    const logSebelumnya = console.error;
    console.error = () => {};
    try {
        await withMock(Laporan, "simpan", async () => {
            throw new Error("database down");
        }, async () => {
            const res = response();
            await LaporanController.buat(request({ body: dataLaporanValid }), res);

            assert.equal(res.statusCode, 500);
            assert.equal(res.body.message, "Something went wrong");
        });
    } finally {
        console.error = logSebelumnya;
    }
});

test("BE-LAP-11: file foto dihapus jika penyimpanan laporan gagal", async () => {
    const namaFile = `test-failed-save-${crypto.randomUUID()}.png`;
    const pathFoto = path.join(UPLOAD_DIR, namaFile);
    await fs.promises.writeFile(pathFoto, Buffer.from("89504e470d0a1a0a", "hex"));
    const logSebelumnya = console.error;
    console.error = () => {};
    try {
        await withMock(Laporan, "simpan", async () => {
            throw new Error("database down");
        }, async () => {
            const res = response();
            await LaporanController.buat(request({
                body: dataLaporanValid,
                file: { path: pathFoto, filename: namaFile },
            }), res);
            assert.equal(res.statusCode, 500);
        });
        await assert.rejects(fs.promises.access(pathFoto), { code: "ENOENT" });
    } finally {
        console.error = logSebelumnya;
        await fs.promises.unlink(pathFoto).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
    }
});

test("BE-LAP-12: daftar meneruskan filter dan pagination ke model", async () => {
    let opsi;
    await withMock(Laporan, "getDaftarLaporan", async (_viewer, filters) => {
        opsi = filters;
        return [];
    }, async () => {
        const res = response();
        await LaporanController.daftar(request({
            query: { kategori: "Jalan", statusLaporan: "DILIHAT", page: "3", limit: "10" },
        }), res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.body, { laporan: [], page: 3, limit: 10 });
        assert.equal(opsi.kategori, "Jalan");
        assert.equal(opsi.statusLaporan, "DILIHAT");
        assert.equal(opsi.offset, 20);
    });
});

test("BE-LAP-13: daftar menolak status laporan yang tidak dikenal", async () => {
    let modelDipanggil = false;
    await withMock(Laporan, "getDaftarLaporan", async () => { modelDipanggil = true; }, async () => {
        const res = response();
        await LaporanController.daftar(request({ query: { statusLaporan: "RUSAK" } }), res);

        assert.equal(res.statusCode, 400);
        assert.equal(modelDipanggil, false);
    });
});

test("BE-LAP-14: detail laporan melampirkan tanggapan teratas", async () => {
    const detailSebelumnya = Laporan.getDetailLaporan;
    const tanggapanSebelumnya = require("../src/models/Tanggapan").getTanggapanByLaporan;
    try {
        Laporan.getDetailLaporan = async () => ({ idLaporan: ID_LAPORAN, namaMasalah: "Jalan berlubang" });
        require("../src/models/Tanggapan").getTanggapanByLaporan = async () => ({ deskripsiTanggapan: "Ditinjau" });
        const res = response();
        await LaporanController.detail(request({ params: { idLaporan: ID_LAPORAN } }), res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.laporan.tanggapanTeratas.deskripsiTanggapan, "Ditinjau");
    } finally {
        Laporan.getDetailLaporan = detailSebelumnya;
        require("../src/models/Tanggapan").getTanggapanByLaporan = tanggapanSebelumnya;
    }
});

test("BE-LAP-15: detail menolak ID yang bukan UUID sebelum mengakses model", async () => {
    let modelDipanggil = false;
    await withMock(Laporan, "getDetailLaporan", async () => { modelDipanggil = true; }, async () => {
        const res = response();
        await LaporanController.detail(request({ params: { idLaporan: "bukan-uuid" } }), res);

        assert.equal(res.statusCode, 404);
        assert.equal(modelDipanggil, false);
    });
});

test("BE-LAP-17: middleware autentikasi menolak request tanpa sesi", () => {
    const res = response();
    let dilanjutkan = false;
    requireAuth(request({ session: null }), res, () => { dilanjutkan = true; });

    assert.equal(res.statusCode, 401);
    assert.equal(dilanjutkan, false);
});

test("BE-LAP-16: detail yang tidak dapat dilihat pengguna mengembalikan 404", async () => {
    await withMock(Laporan, "getDetailLaporan", async () => null, async () => {
        const res = response();
        await LaporanController.detail(request({ params: { idLaporan: ID_LAPORAN } }), res);

        assert.equal(res.statusCode, 404);
        assert.equal(res.body.message, "Laporan tidak ditemukan");
    });
});

test("BE-ADM-01: admin dapat menyimpan hasil pemeriksaan valid", async () => {
    let args;
    await withMock(Laporan, "simpanHasilPemeriksaan", async (...values) => {
        args = values;
        return true;
    }, async () => {
        const res = response();
        await LaporanController.periksa(request({
            params: { idLaporan: ID_LAPORAN },
            body: { valid: true, catatan: "  Sudah diverifikasi.  " },
        }), res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(args, [ID_LAPORAN, true, "Sudah diverifikasi."]);
    });
});

test("BE-ADM-03: hasil pemeriksaan non-boolean ditolak", async () => {
    let modelDipanggil = false;
    await withMock(Laporan, "simpanHasilPemeriksaan", async () => { modelDipanggil = true; }, async () => {
        const res = response();
        await LaporanController.periksa(request({
            params: { idLaporan: ID_LAPORAN },
            body: { valid: "true" },
        }), res);

        assert.equal(res.statusCode, 400);
        assert.equal(modelDipanggil, false);
    });
});

test("BE-ADM-02: hasil pemeriksaan tidak valid tersimpan dengan alasan", async () => {
    let args;
    await withMock(Laporan, "simpanHasilPemeriksaan", async (...values) => {
        args = values;
        return true;
    }, async () => {
        const res = response();
        await LaporanController.periksa(request({
            params: { idLaporan: ID_LAPORAN },
            body: { valid: false, catatan: "  Bukti tidak ditemukan.  " },
        }), res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(args, [ID_LAPORAN, false, "Bukti tidak ditemukan."]);
    });
});

test("BE-ADM-02: model memasang batas waktu 14 hari untuk pemeriksaan tidak valid", async () => {
    const querySebelumnya = pool.query;
    let panggilan;
    pool.query = async (sql, values) => {
        panggilan = { sql, values };
        return { rowCount: 1 };
    };
    try {
        assert.equal(await Laporan.simpanHasilPemeriksaan(
            ID_LAPORAN, false, "Bukti tidak ditemukan."
        ), true);
        assert.equal(panggilan.values[0], "TIDAK_VALID");
        assert.equal(panggilan.values[2], 14);
        assert.match(panggilan.sql, /make_interval\(days => \$3::int\)/);
    } finally {
        pool.query = querySebelumnya;
    }
});

test("BE-ADM-04: catatan pemeriksaan lebih dari 1000 karakter ditolak", async () => {
    let modelDipanggil = false;
    await withMock(Laporan, "simpanHasilPemeriksaan", async () => { modelDipanggil = true; }, async () => {
        const res = response();
        await LaporanController.periksa(request({
            params: { idLaporan: ID_LAPORAN },
            body: { valid: true, catatan: "x".repeat(1001) },
        }), res);

        assert.equal(res.statusCode, 400);
        assert.equal(modelDipanggil, false);
    });
});

test("BE-ADM-05: pemeriksaan laporan yang tidak ditemukan mengembalikan 404", async () => {
    await withMock(Laporan, "simpanHasilPemeriksaan", async () => false, async () => {
        const res = response();
        await LaporanController.periksa(request({
            params: { idLaporan: ID_LAPORAN },
            body: { valid: true },
        }), res);

        assert.equal(res.statusCode, 404);
    });
});

test("BE-ADM-06: status penanganan valid diteruskan ke model", async () => {
    let args;
    await withMock(Laporan, "updateStatusLaporan", async (...values) => {
        args = values;
        return true;
    }, async () => {
        const res = response();
        await LaporanController.updateStatus(request({
            params: { idLaporan: ID_LAPORAN },
            body: { statusLaporan: " selesai " },
        }), res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(args, [ID_LAPORAN, "SELESAI"]);
    });
});

test("BE-ADM-07: status penanganan yang tidak valid ditolak", async () => {
    let modelDipanggil = false;
    await withMock(Laporan, "updateStatusLaporan", async () => { modelDipanggil = true; }, async () => {
        const res = response();
        await LaporanController.updateStatus(request({
            params: { idLaporan: ID_LAPORAN },
            body: { statusLaporan: "RUSAK" },
        }), res);

        assert.equal(res.statusCode, 400);
        assert.equal(modelDipanggil, false);
    });
});

test("BE-ADM-06b: pembaruan status laporan yang tidak ditemukan mengembalikan 404", async () => {
    await withMock(Laporan, "updateStatusLaporan", async () => false, async () => {
        const res = response();
        await LaporanController.updateStatus(request({
            params: { idLaporan: ID_LAPORAN },
            body: { statusLaporan: "SELESAI" },
        }), res);

        assert.equal(res.statusCode, 404);
    });
});

test("BE-ADM-10: pemilik dapat mengirim konfirmasi ulang sebelum batas waktu", async () => {
    await withMocks([
        { target: Laporan, key: "getPemilik", replacement: async () => ({
            idPengguna: "pengguna-1",
            statusValidasi: "TIDAK_VALID",
        }) },
        { target: Laporan, key: "cekBatasWaktu", replacement: async () => false },
        { target: Laporan, key: "kirimKonfirmasiUlang", replacement: async () => true },
    ], async () => {
        const res = response();
        await LaporanController.konfirmasiUlang(request({
            params: { idLaporan: ID_LAPORAN },
        }), res);

        assert.equal(res.statusCode, 200);
    });
});

test("BE-ADM-10: model mengubah laporan tidak valid yang belum kedaluwarsa", async () => {
    const querySebelumnya = pool.query;
    let panggilan;
    pool.query = async (sql, values) => {
        panggilan = { sql, values };
        return { rowCount: 1 };
    };
    try {
        assert.equal(await Laporan.kirimKonfirmasiUlang(ID_LAPORAN), true);
        assert.deepEqual(panggilan.values, [ID_LAPORAN]);
        assert.match(panggilan.sql, /status_validasi = 'TIDAK_VALID'/);
        assert.match(panggilan.sql, /batas_waktu > NOW\(\)/);
        assert.match(panggilan.sql, /status_validasi = 'BELUM_DIPERIKSA'/);
    } finally {
        pool.query = querySebelumnya;
    }
});

test("BE-ADM-11: pengguna yang bukan pemilik tidak dapat konfirmasi ulang", async () => {
    await withMock(Laporan, "getPemilik", async () => ({
        idPengguna: "pemilik-lain",
        statusValidasi: "TIDAK_VALID",
    }), async () => {
        const res = response();
        await LaporanController.konfirmasiUlang(request({
            params: { idLaporan: ID_LAPORAN },
        }), res);

        assert.equal(res.statusCode, 404);
    });
});

test("BE-ADM-11: konfirmasi ulang ditolak jika laporan tidak berstatus TIDAK_VALID", async () => {
    await withMock(Laporan, "getPemilik", async () => ({
        idPengguna: "pengguna-1",
        statusValidasi: "VALID",
    }), async () => {
        const res = response();
        await LaporanController.konfirmasiUlang(request({
            params: { idLaporan: ID_LAPORAN },
        }), res);

        assert.equal(res.statusCode, 409);
    });
});

test("BE-ADM-12: konfirmasi ulang ditolak setelah batas waktu", async () => {
    await withMocks([
        { target: Laporan, key: "getPemilik", replacement: async () => ({
            idPengguna: "pengguna-1",
            statusValidasi: "TIDAK_VALID",
        }) },
        { target: Laporan, key: "cekBatasWaktu", replacement: async () => true },
        { target: Laporan, key: "kirimKonfirmasiUlang", replacement: async () => {
            assert.fail("Konfirmasi tidak boleh dikirim setelah batas waktu");
        } },
    ], async () => {
        const res = response();
        await LaporanController.konfirmasiUlang(request({
            params: { idLaporan: ID_LAPORAN },
        }), res);

        assert.equal(res.statusCode, 409);
    });
});

test("BE-LOC-02: geocode menolak alamat kosong tanpa memanggil layanan peta", async () => {
    let layananDipanggil = false;
    await withMock(MapAPIService, "geocode", async () => { layananDipanggil = true; }, async () => {
        const res = response();
        await LokasiController.ambilLokasiLaporan(request({ query: { alamat: "  " } }), res);

        assert.equal(res.statusCode, 400);
        assert.equal(layananDipanggil, false);
    });
});

test("BE-LOC-03: geocode mengembalikan 404 jika alamat tidak ditemukan", async () => {
    await withMock(MapAPIService, "geocode", async () => null, async () => {
        const res = response();
        await LokasiController.ambilLokasiLaporan(request({
            query: { alamat: "Alamat tidak dikenal" },
        }), res);

        assert.equal(res.statusCode, 404);
        assert.equal(res.body.message, "Alamat tidak ditemukan");
    });
});

test("BE-LOC-04: geocode mengembalikan 502 jika layanan peta gagal", async () => {
    const logSebelumnya = console.error;
    console.error = () => {};
    try {
        await withMock(MapAPIService, "geocode", async () => {
            throw new Error("service unavailable");
        }, async () => {
            const res = response();
            await LokasiController.ambilLokasiLaporan(request({
                query: { alamat: "Bandung" },
            }), res);

            assert.equal(res.statusCode, 502);
            assert.equal(res.body.message, "Layanan peta tidak dapat dihubungi");
        });
    } finally {
        console.error = logSebelumnya;
    }
});

test("BE-LOC-01: geocode mengembalikan hasil layanan peta", async () => {
    const hasil = { latitude: -6.9, longitude: 107.6, alamat: "Bandung" };
    await withMock(MapAPIService, "geocode", async () => hasil, async () => {
        const res = response();
        await LokasiController.ambilLokasiLaporan(request({ query: { alamat: " Bandung " } }), res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.body, hasil);
    });
});

test("BE-LOC-05: laporan terdekat tersaring dan diurutkan berdasarkan jarak", async () => {
    const kandidat = [
        { idLaporan: "jauh", lokasi: { latitude: 0.2, longitude: 0 } },
        { idLaporan: "dekat-2", lokasi: { latitude: 0.01, longitude: 0 } },
        { idLaporan: "dekat-1", lokasi: { latitude: 0.001, longitude: 0 } },
    ];
    await withMock(Laporan, "getDaftarLaporan", async () => kandidat, async () => {
        const res = response();
        await LokasiController.cariLaporanTerdekat(request({
            query: { latitude: "0", longitude: "0" },
        }), res);

        assert.equal(res.statusCode, 200);
        assert.equal(res.body.radiusKm, 5);
        assert.deepEqual(res.body.laporan.map((laporan) => laporan.idLaporan), ["dekat-1", "dekat-2"]);
        assert.ok(res.body.laporan[0].jarakKm < res.body.laporan[1].jarakKm);
    });
});

test("BE-LOC-09: laporan terdekat menghasilkan daftar kosong jika tidak ada kandidat", async () => {
    await withMock(Laporan, "getDaftarLaporan", async () => [], async () => {
        const res = response();
        await LokasiController.cariLaporanTerdekat(request({
            query: { latitude: "-6.9", longitude: "107.6" },
        }), res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.body.laporan, []);
        assert.equal(res.body.radiusKm, 5);
    });
});

test("BE-LOC-07: laporan terdekat menolak koordinat bukan angka dan di luar rentang", async () => {
    let modelDipanggil = false;
    await withMock(Laporan, "getDaftarLaporan", async () => { modelDipanggil = true; }, async () => {
        for (const latitude of ["abc", "91"]) {
            const res = response();
            await LokasiController.cariLaporanTerdekat(request({
                query: { latitude, longitude: "0" },
            }), res);
            assert.equal(res.statusCode, 400);
        }
        assert.equal(modelDipanggil, false);
    });
});

test("BE-LOC-08: laporan terdekat menolak radius lebih dari batas", async () => {
    const res = response();
    await LokasiController.cariLaporanTerdekat(request({
        query: { latitude: "0", longitude: "0", radius: "51" },
    }), res);

    assert.equal(res.statusCode, 400);
});

test("BE-LOC-06: laporan terdekat menolak permintaan tanpa koordinat", async () => {
    const res = response();
    await LokasiController.cariLaporanTerdekat(request(), res);

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /Lokasi pengguna belum tersedia/);
});

test("BE-LOC-08: laporan terdekat menolak radius nol, negatif, dan bukan angka", async () => {
    for (const radius of ["0", "-1", "abc"]) {
        const res = response();
        await LokasiController.cariLaporanTerdekat(request({
            query: { latitude: "0", longitude: "0", radius },
        }), res);

        assert.equal(res.statusCode, 400);
    }
});

test("model Lokasi menolak koordinat yang bukan angka dan membersihkan alamat", () => {
    assert.equal(Lokasi.dariInput("", "107.6"), null);
    const lokasi = Lokasi.dariInput("-6.9", "107.6", "  Bandung  ");
    assert.deepEqual(lokasi.getKoordinat(), { latitude: -6.9, longitude: 107.6 });
    assert.equal(lokasi.getAlamat(), "Bandung");
});

test("model Laporan membatalkan transaksi jika penyimpanan lokasi gagal", async () => {
    const connectSebelumnya = pool.connect;
    const query = [];
    let dilepas = false;
    const client = {
        async query(sql) {
            query.push(sql);
            if (sql.startsWith("INSERT INTO lokasi")) throw new Error("database down");
            return { rowCount: 1 };
        },
        release() { dilepas = true; },
    };

    pool.connect = async () => client;
    try {
        await assert.rejects(Laporan.simpan({
            idLaporan: ID_LAPORAN,
            idPengguna: "pengguna-1",
            namaMasalah: "Jalan berlubang",
            kategori: "Jalan",
            tingkatPermasalahan: "TINGGI",
            statusPrivasi: "PUBLIK",
            lokasi: Lokasi.dariInput("-6.9", "107.6"),
        }), /database down/);

        assert.equal(query[0], "BEGIN");
        assert.match(query[1], /INSERT INTO laporan/);
        assert.match(query[2], /INSERT INTO lokasi/);
        assert.equal(query[3], "ROLLBACK");
        assert.equal(dilepas, true);
    } finally {
        pool.connect = connectSebelumnya;
    }
});
