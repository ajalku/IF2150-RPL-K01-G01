
const assert = require("node:assert/strict");
const { test, afterEach, mock } = require("node:test");
const bcrypt = require("bcrypt");

const Pengguna = require("../src/models/Pengguna");
const PenggunaController = require("../src/controllers/PenggunaController");
const { requireAuth } = require("../src/middleware/authMiddleware");
const { pool } = require("../src/config/database");

// ============================================
// HELPER DAN TEST DOUBLE
// ============================================

afterEach(() => mock.restoreAll());

const USER_ID = 17;
const CURRENT_PASSWORD = "CurrentPassword1!";
const NEW_PASSWORD = "NewPassword123!";

const PROFILE = {
    idPengguna: USER_ID,
    nama: "Warga RAWAT",
    email: "warga@example.com",
    noTelp: "081234567890",
    role: "warga",
};

const PASSWORD_ERROR =
    "Password harus minimal 8 karakter, mengandung huruf kapital, angka, dan simbol";

function makeResponse() {
    return {
        statusCode: 200,
        body: null,
        clearedCookie: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(body) {
            this.body = body;
            return this;
        },

        clearCookie(name) {
            this.clearedCookie = name;
            return this;
        },
    };
}

function makeRequest(body = {}, role = "warga") {
    return {
        body,
        session: {
            idPengguna: USER_ID,
            role,
        },
    };
}

function makeUser(role = "warga", passwordHash = "hash") {
    return {
        getIdPengguna: () => USER_ID,
        getRole: () => role,
        getHashPassword: () => passwordHash,
        getNama: () => PROFILE.nama,
        getEmail: () => PROFILE.email,
        getNoTelp: () => PROFILE.noTelp,
        hapusDataPengguna: async () => true,
    };
}

function mockErrorLog() {
    mock.method(console, "error", () => {});
}

// ============================================
// A. MELIHAT PROFIL
// ============================================

// PROF-01: Berhasil mengambil profil
test("PROF-01 mengambil profil berdasarkan session", async () => {
    const getProfile = mock.method(
        Pengguna,
        "getProfilPenggunaById",
        async () => ({ ...PROFILE })
    );

    const res = makeResponse();

    await PenggunaController.getProfile(
        makeRequest(),
        res
    );

    assert.equal(res.statusCode, 200);
    assert.equal(getProfile.mock.callCount(), 1);

    assert.deepEqual(
        getProfile.mock.calls[0].arguments,
        [USER_ID]
    );

    assert.deepEqual(res.body.pengguna, PROFILE);

    assert.equal(
        "hashPassword" in res.body.pengguna,
        false
    );
});

// PROF-02: Tidak login
test("PROF-02 akses profil tanpa session ditolak", () => {
    const res = makeResponse();
    let nextCalled = false;

    requireAuth(
        { session: null },
        res,
        () => {
            nextCalled = true;
        }
    );

    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
});

// PROF-03: Pengguna tidak ditemukan
test("PROF-03 profil tidak ditemukan: HTTP 404", async () => {
    mock.method(
        Pengguna,
        "getProfilPenggunaById",
        async () => null
    );

    const res = makeResponse();

    await PenggunaController.getProfile(
        makeRequest(),
        res
    );

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.message, "User not found.");
});

// PROF-04: Database error
test("PROF-04 pengambilan profil gagal: HTTP 500", async () => {
    mockErrorLog();

    mock.method(
        Pengguna,
        "getProfilPenggunaById",
        async () => {
            throw new Error("DB_SECRET");
        }
    );

    const res = makeResponse();

    await PenggunaController.getProfile(
        makeRequest(),
        res
    );

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.message, "Something went wrong");

    assert.doesNotMatch(
        JSON.stringify(res.body),
        /DB_SECRET/
    );
});

// ============================================
// B. MENGUBAH PROFIL
// ============================================

// PROF-05: Update nama dan nomor telepon
test("PROF-05 perubahan profil valid: HTTP 200", async () => {
    const update = mock.method(
        Pengguna,
        "updateDataPengguna",
        async () => true
    );

    mock.method(
        Pengguna,
        "getProfilPenggunaById",
        async () => ({
            ...PROFILE,
            nama: "Nama Baru",
        })
    );

    const res = makeResponse();

    await PenggunaController.ubahProfil(
        makeRequest({
            nama: " Nama Baru ",
            noTelp: "081234567890",
        }),
        res
    );

    assert.equal(res.statusCode, 200);

    assert.deepEqual(
        update.mock.calls[0].arguments,
        [
            USER_ID,
            {
                nama: "Nama Baru",
                noTelp: "081234567890",
            },
        ]
    );

    assert.equal(
        res.body.pengguna.nama,
        "Nama Baru"
    );
});

// PROF-06: Nama kosong
// PROF-07: Nomor telepon tidak valid
// PROF-08: Role tidak boleh diubah
// PROF-09: ID pengguna lain tidak boleh diubah
// PROF-10: Field tidak didukung
// PROF-11: Body kosong

const invalidProfileCases = [
    {
        id: "PROF-06",
        name: "nama kosong",
        body: { nama: " " },
        message: "Nama wajib diisi dan maksimal 100 karakter.",
    },
    {
        id: "PROF-07",
        name: "nomor telepon tidak valid",
        body: { noTelp: "12345" },
        message: "Nomor telepon tidak valid.",
    },
    {
        id: "PROF-08",
        name: "mengubah role",
        body: {
            nama: "Warga",
            role: "admin",
        },
        message: "Protected profile fields cannot be changed.",
    },
    {
        id: "PROF-09",
        name: "mengubah ID pengguna",
        body: {
            nama: "Warga",
            userId: 999,
        },
        message: "Protected profile fields cannot be changed.",
    },
    {
        id: "PROF-10",
        name: "field tidak didukung",
        body: { alamatRahasia: "test" },
        message: "Unsupported profile field.",
    },
    {
        id: "PROF-11",
        name: "body kosong",
        body: {},
        message: "No profile fields to update.",
    },
];

for (const tc of invalidProfileCases) {
    test(`${tc.id} ${tc.name}: HTTP 400`, async () => {
        const update = mock.method(
            Pengguna,
            "updateDataPengguna",
            async () => true
        );

        const res = makeResponse();

        await PenggunaController.ubahProfil(
            makeRequest(tc.body),
            res
        );

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.message, tc.message);

        assert.equal(update.mock.callCount(), 0);
    });
}

// PROF-12: Update pengguna tidak ditemukan
test("PROF-12 update profil gagal: HTTP 404", async () => {
    mock.method(
        Pengguna,
        "updateDataPengguna",
        async () => false
    );

    const res = makeResponse();

    await PenggunaController.ubahProfil(
        makeRequest({ nama: "Nama Baru" }),
        res
    );

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.message, "User not found.");
});

// PROF-13: Kesalahan database
test("PROF-13 update profil database error: HTTP 500", async () => {
    mockErrorLog();

    mock.method(
        Pengguna,
        "updateDataPengguna",
        async () => {
            throw new Error("Database error");
        }
    );

    const res = makeResponse();

    await PenggunaController.ubahProfil(
        makeRequest({ nama: "Nama Baru" }),
        res
    );

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.message, "Something went wrong");
});

// ============================================
// C. MENGUBAH PASSWORD
// ============================================

// PASS-01: Password lama salah
test("PASS-01 password lama salah: HTTP 401", async () => {
    const hash = await bcrypt.hash(CURRENT_PASSWORD, 4);

    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => makeUser("warga", hash)
    );

    const update = mock.method(
        Pengguna,
        "updateDataPengguna",
        async () => true
    );

    const res = makeResponse();

    await PenggunaController.changePassword(
        makeRequest({
            currentPassword: "WrongPassword1!",
            newPassword: NEW_PASSWORD,
            confirmPassword: NEW_PASSWORD,
        }),
        res
    );

    assert.equal(res.statusCode, 401);
    assert.equal(update.mock.callCount(), 0);
});

// PASS-02: Konfirmasi password berbeda
test("PASS-02 konfirmasi password berbeda: HTTP 400", async () => {
    const update = mock.method(
        Pengguna,
        "updateDataPengguna",
        async () => true
    );

    const res = makeResponse();

    await PenggunaController.changePassword(
        makeRequest({
            currentPassword: CURRENT_PASSWORD,
            newPassword: NEW_PASSWORD,
            confirmPassword: "DifferentPassword1!",
        }),
        res
    );

    assert.equal(res.statusCode, 400);
    assert.equal(update.mock.callCount(), 0);
});

// PASS-03: Password baru sama dengan lama
test("PASS-03 password baru sama dengan lama: HTTP 400", async () => {
    const hash = await bcrypt.hash(CURRENT_PASSWORD, 4);

    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => makeUser("warga", hash)
    );

    const update = mock.method(
        Pengguna,
        "updateDataPengguna",
        async () => true
    );

    const res = makeResponse();

    await PenggunaController.changePassword(
        makeRequest({
            currentPassword: CURRENT_PASSWORD,
            newPassword: CURRENT_PASSWORD,
            confirmPassword: CURRENT_PASSWORD,
        }),
        res
    );

    assert.equal(res.statusCode, 400);
    assert.equal(update.mock.callCount(), 0);
});

// PASS-04 s.d. PASS-08:
// Pengujian kompleksitas password

const invalidPasswords = [
    {
        id: "PASS-04",
        name: "kurang dari 8 karakter",
        password: "Abc123!",
    },
    {
        id: "PASS-05",
        name: "lebih dari 72 byte",
        password: "Ab1!" + "a".repeat(69),
    },
    {
        id: "PASS-06",
        name: "tanpa huruf kapital",
        password: "password123!",
    },
    {
        id: "PASS-07",
        name: "tanpa angka",
        password: "Password!",
    },
    {
        id: "PASS-08",
        name: "tanpa simbol",
        password: "Password123",
    },
];

for (const tc of invalidPasswords) {
    test(`${tc.id} ${tc.name}: HTTP 400`, async () => {
        const getUser = mock.method(
            Pengguna,
            "getPenggunaById",
            async () => makeUser()
        );

        const update = mock.method(
            Pengguna,
            "updateDataPengguna",
            async () => true
        );

        const res = makeResponse();

        await PenggunaController.changePassword(
            makeRequest({
                currentPassword: CURRENT_PASSWORD,
                newPassword: tc.password,
                confirmPassword: tc.password,
            }),
            res
        );

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.message, PASSWORD_ERROR);
        assert.equal(getUser.mock.callCount(), 0);
        assert.equal(update.mock.callCount(), 0);
    });
}

// PASS-09: Password berhasil diperbarui
test("PASS-09 password valid: hash baru tersimpan", async () => {
    const oldHash = await bcrypt.hash(CURRENT_PASSWORD, 4);

    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => makeUser("warga", oldHash)
    );

    let storedHash = null;

    const update = mock.method(
        Pengguna,
        "updateDataPengguna",
        async (id, changes) => {
            storedHash = changes.hashPassword;
            return true;
        }
    );

    const req = makeRequest({
        currentPassword: CURRENT_PASSWORD,
        newPassword: NEW_PASSWORD,
        confirmPassword: NEW_PASSWORD,
    });

    const res = makeResponse();

    await PenggunaController.changePassword(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(update.mock.callCount(), 1);

    assert.equal(
        update.mock.calls[0].arguments[0],
        USER_ID
    );

    assert.equal(
        await bcrypt.compare(NEW_PASSWORD, storedHash),
        true
    );

    assert.equal(
        await bcrypt.compare(CURRENT_PASSWORD, storedHash),
        false
    );

    assert.equal(req.session.idPengguna, USER_ID);
    assert.equal(req.session.role, "warga");

    assert.equal("hashPassword" in res.body, false);
});

// PASS-10: Akun tidak ditemukan
test("PASS-10 akun tidak ditemukan: HTTP 404", async () => {
    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => null
    );

    const res = makeResponse();

    await PenggunaController.changePassword(
        makeRequest({
            currentPassword: CURRENT_PASSWORD,
            newPassword: NEW_PASSWORD,
            confirmPassword: NEW_PASSWORD,
        }),
        res
    );

    assert.equal(res.statusCode, 404);
});

// PASS-11: Field password tidak lengkap
test("PASS-11 field password tidak lengkap: HTTP 400", async () => {
    const res = makeResponse();

    await PenggunaController.changePassword(
        makeRequest({
            currentPassword: CURRENT_PASSWORD,
            newPassword: NEW_PASSWORD,
        }),
        res
    );

    assert.equal(res.statusCode, 400);
});

// ============================================
// D. MENGHAPUS AKUN
// ============================================

// DEL-01: Warga berhasil menghapus akun
test("DEL-01 warga berhasil menghapus akun", async () => {
    const pengguna = makeUser("warga");

    const hapus = mock.method(
        pengguna,
        "hapusDataPengguna",
        async () => true
    );

    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => pengguna
    );

    const req = makeRequest();

    req.session.destroy = (callback) => {
        callback(null);
    };

    const destroy = mock.method(req.session, "destroy");

    const res = makeResponse();

    await PenggunaController.hapusAkun(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(hapus.mock.callCount(), 1);
    assert.equal(destroy.mock.callCount(), 1);
    assert.equal(res.clearedCookie, "rawat.sid");
});

// DEL-02: Admin tidak boleh hapus akun sendiri
test("DEL-02 admin tidak boleh menghapus akun: HTTP 403", async () => {
    const pengguna = makeUser("admin");

    const hapus = mock.method(
        pengguna,
        "hapusDataPengguna",
        async () => true
    );

    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => pengguna
    );

    const req = makeRequest({}, "admin");
    const res = makeResponse();

    await PenggunaController.hapusAkun(req, res);

    assert.equal(res.statusCode, 403);
    assert.equal(hapus.mock.callCount(), 0);
});

// DEL-03: Akun tidak ditemukan
test("DEL-03 akun tidak ditemukan: HTTP 404", async () => {
    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => null
    );

    const res = makeResponse();

    await PenggunaController.hapusAkun(
        makeRequest(),
        res
    );

    assert.equal(res.statusCode, 404);
});

// DEL-04: Penghapusan database gagal
test("DEL-04 penghapusan gagal: session tetap aktif", async () => {
    const pengguna = makeUser();

    mock.method(
        pengguna,
        "hapusDataPengguna",
        async () => false
    );

    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => pengguna
    );

    const req = makeRequest();

    req.session.destroy = mock.fn(() => {
        throw new Error("Session tidak boleh dihapus");
    });

    const res = makeResponse();

    await PenggunaController.hapusAkun(req, res);

    assert.equal(res.statusCode, 404);
    assert.equal(req.session.destroy.mock.callCount(), 0);
});

// DEL-05: Session gagal diakhiri setelah akun terhapus
test("DEL-05 session gagal diakhiri setelah akun terhapus", async () => {
    mockErrorLog();

    const pengguna = makeUser();

    const hapus = mock.method(
        pengguna,
        "hapusDataPengguna",
        async () => true
    );

    mock.method(
        Pengguna,
        "getPenggunaById",
        async () => pengguna
    );

    const req = makeRequest();

    req.session.destroy = (callback) => {
        callback(new Error("Session store error"));
    };

    const res = makeResponse();

    await PenggunaController.hapusAkun(req, res);

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.accountDeleted, true);
    assert.equal(res.clearedCookie, "rawat.sid");
    assert.equal(hapus.mock.callCount(), 1);
});

// DEL-06: Tidak login
test("DEL-06 menghapus akun tanpa login: HTTP 401", async () => {
    const res = makeResponse();

    await PenggunaController.hapusAkun(
        { session: null },
        res
    );

    assert.equal(res.statusCode, 401);
});

// ============================================
// E. PENGUJIAN MODEL / DATABASE QUERY
// ============================================

// MODEL-01: Query profil tidak mengambil kredensial
test("MODEL-01 profil tidak mengambil password/NIK", async () => {
    const query = mock.method(
        pool,
        "query",
        async () => ({
            rows: [{
                id_pengguna: USER_ID,
                nama: PROFILE.nama,
                email: PROFILE.email,
                no_telp: PROFILE.noTelp,
                role: PROFILE.role,
            }],
        })
    );

    const result = await Pengguna.getProfilPenggunaById(
        USER_ID
    );

    const [sql, values] = query.mock.calls[0].arguments;

    assert.deepEqual(values, [USER_ID]);

    assert.doesNotMatch(
        sql,
        /\bhash_password\b|\bnik\b/i
    );

    assert.deepEqual(result, PROFILE);
});

// MODEL-02: SQL update hanya menerima field tertentu
test("MODEL-02 update memakai parameterized SQL dan allowlist", async () => {
    const query = mock.method(
        pool,
        "query",
        async () => ({
            rowCount: 1,
        })
    );

    const updated = await Pengguna.updateDataPengguna(
        USER_ID,
        {
            nama: "Nama Baru",
            role: "admin",
            userId: 999,
        }
    );

    assert.equal(updated, true);

    const [sql, values] = query.mock.calls[0].arguments;

    assert.match(sql, /SET nama = \$1/);
    assert.doesNotMatch(sql, /role|userId/i);

    assert.deepEqual(
        values,
        ["Nama Baru", USER_ID]
    );
});

// MODEL-03: Penghapusan menggunakan ID pengguna
test("MODEL-03 delete menggunakan parameter ID", async () => {
    const query = mock.method(
        pool,
        "query",
        async () => ({
            rowCount: 1,
        })
    );

    const pengguna = new Pengguna({
        id_pengguna: USER_ID,
        nama: PROFILE.nama,
        nik: "3273010101010001",
        email: PROFILE.email,
        no_telp: PROFILE.noTelp,
        hash_password: "hash",
        role: "warga",
    });

    const deleted = await pengguna.hapusDataPengguna();

    assert.equal(deleted, true);

    const [sql, values] = query.mock.calls[0].arguments;

    assert.match(sql, /DELETE FROM pengguna/i);
    assert.match(sql, /WHERE id_pengguna = \$1/i);
    assert.deepEqual(values, [USER_ID]);
});
