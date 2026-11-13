
const { test, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");

const Pengguna = require("../src/models/Pengguna");
const PenggunaController = require("../src/controllers/PenggunaController");

afterEach(() => mock.restoreAll());

// =====================================================
// TEST DATA & TEST DOUBLE
// =====================================================

const VALID = Object.freeze({
    nama: "Penguji RAWAT",
    nik: "3273010101010001",
    email: "penguji@example.test",
    password: "Password123!",
    noTelp: "081234567890",
});

const PASSWORD_ERROR =
    "Password harus minimal 8 karakter, mengandung huruf kapital, angka, dan simbol";

function responseDouble() {
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

function requestDouble(body, { session } = {}) {
    return {
        body,
        session: session ?? {},
    };
}

function stubNoDuplicate() {
    const email = mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => null
    );

    const nik = mock.method(
        Pengguna,
        "getPenggunaByNIK",
        async () => null
    );

    return { email, nik };
}

function stubSuccessfulRegistration(id = 17) {
    const lookup = stubNoDuplicate();

    const hash = mock.method(
        bcrypt,
        "hash",
        async () => "$2b$12$dummy-hash"
    );

    const save = mock.method(
        Pengguna.prototype,
        "simpanDataPengguna",
        async () => id
    );

    return { ...lookup, hash, save };
}

// =====================================================
// UC01 — REGISTRASI
// =====================================================

// REG-01: Registrasi berhasil

test("REG-01 input valid: 201, akun disimpan dan password di-hash", async () => {
    const { email, nik, hash, save } =
        stubSuccessfulRegistration(17);

    const res = responseDouble();

    await PenggunaController.register(
        requestDouble({ ...VALID }),
        res
    );

    assert.equal(res.statusCode, 201);

    assert.deepEqual(res.body, {
        message: "Registration Succeeded",
        idPengguna: 17,
    });

    assert.equal(email.mock.callCount(), 1);
    assert.equal(nik.mock.callCount(), 1);
    assert.equal(hash.mock.callCount(), 1);
    assert.equal(save.mock.callCount(), 1);

    assert.deepEqual(
        hash.mock.calls[0].arguments,
        [VALID.password, 12]
    );

    assert.notEqual(
        res.body.password,
        VALID.password
    );
});

// -----------------------------------------------------
// REG-02 s.d. REG-12 dan REG-19 s.d. REG-21
// Equivalence Partitioning & Boundary Value Analysis
// -----------------------------------------------------

const invalidRegistration = [
    [
        "REG-02 nama kosong",
        { nama: "" },
        "Data belum lengkap",
    ],
    [
        "REG-03 NIK kosong",
        { nik: "" },
        "Data belum lengkap",
    ],
    [
        "REG-04 NIK 15 digit",
        { nik: "1".repeat(15) },
        "NIK tidak valid",
    ],
    [
        "REG-05 NIK 17 digit",
        { nik: "1".repeat(17) },
        "NIK tidak valid",
    ],
    [
        "REG-06 NIK mengandung huruf",
        { nik: "123456789012345a" },
        "NIK tidak valid",
    ],
    [
        "REG-07 email tanpa @",
        { email: "emailinvalid" },
        "Email tidak valid",
    ],
    [
        "REG-08 password 7 karakter",
        { password: "Abc123!" },
        PASSWORD_ERROR,
    ],
    [
        "REG-09 password 73 byte",
        { password: "Ab1!" + "a".repeat(69) },
        PASSWORD_ERROR,
    ],
    [
        "REG-10 noTelp tidak diawali 08",
        { noTelp: "071234567890" },
        "Nomor telepon tidak valid",
    ],
    [
        "REG-11 noTelp terlalu pendek",
        { noTelp: "081234567" },
        "Nomor telepon tidak valid",
    ],
    [
        "REG-12 field wajib tidak dikirim",
        { email: undefined },
        "Data belum lengkap",
    ],
    [
        "REG-19 password tanpa huruf kapital",
        { password: "password123!" },
        PASSWORD_ERROR,
    ],
    [
        "REG-20 password tanpa angka",
        { password: "Password!" },
        PASSWORD_ERROR,
    ],
    [
        "REG-21 password tanpa simbol",
        { password: "Password123" },
        PASSWORD_ERROR,
    ],
];

for (const [id, changes, expectedMessage] of invalidRegistration) {
    test(`${id}: HTTP 400 dan database tidak diakses`, async () => {
        const lookup = mock.method(
            Pengguna,
            "getPenggunaByEmail",
            async () => {
                throw new Error(
                    "Database seharusnya tidak diakses"
                );
            }
        );

        const res = responseDouble();

        await PenggunaController.register(
            requestDouble({
                ...VALID,
                ...changes,
            }),
            res
        );

        assert.equal(res.statusCode, 400);
        assert.equal(res.body.message, expectedMessage);
        assert.equal(lookup.mock.callCount(), 0);
    });
}

// -----------------------------------------------------
// REG-13 & REG-14: Boundary Value Password
// -----------------------------------------------------

test("REG-13 password tepat 8 karakter: diterima", async () => {
    const { hash, save } = stubSuccessfulRegistration(18);

    const password = "Abc123!x";

    assert.equal(Buffer.byteLength(password, "utf8"), 8);

    const res = responseDouble();

    await PenggunaController.register(
        requestDouble({
            ...VALID,
            password,
        }),
        res
    );

    assert.equal(res.statusCode, 201);
    assert.equal(hash.mock.callCount(), 1);
    assert.equal(save.mock.callCount(), 1);
});

test("REG-14 password tepat 72 byte: diterima", async () => {
    const { hash, save } = stubSuccessfulRegistration(19);

    const password = "Ab1!" + "a".repeat(68);

    assert.equal(Buffer.byteLength(password, "utf8"), 72);

    const res = responseDouble();

    await PenggunaController.register(
        requestDouble({
            ...VALID,
            password,
        }),
        res
    );

    assert.equal(res.statusCode, 201);
    assert.equal(hash.mock.callCount(), 1);
    assert.equal(save.mock.callCount(), 1);
});

// -----------------------------------------------------
// REG-15 & REG-16: Duplicate Account
// -----------------------------------------------------

test("REG-15 email sudah terdaftar: HTTP 409", async () => {
    mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => ({})
    );

    const lookupNik = mock.method(
        Pengguna,
        "getPenggunaByNIK",
        async () => null
    );

    const save = mock.method(
        Pengguna.prototype,
        "simpanDataPengguna",
        async () => 100
    );

    const res = responseDouble();

    await PenggunaController.register(
        requestDouble({ ...VALID }),
        res
    );

    assert.equal(res.statusCode, 409);

    assert.equal(
        res.body.message,
        "Email atau NIK sudah terdaftar"
    );

    assert.equal(lookupNik.mock.callCount(), 0);
    assert.equal(save.mock.callCount(), 0);
});

test("REG-16 NIK sudah terdaftar: HTTP 409", async () => {
    mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => null
    );

    mock.method(
        Pengguna,
        "getPenggunaByNIK",
        async () => ({})
    );

    const save = mock.method(
        Pengguna.prototype,
        "simpanDataPengguna",
        async () => 100
    );

    const res = responseDouble();

    await PenggunaController.register(
        requestDouble({ ...VALID }),
        res
    );

    assert.equal(res.statusCode, 409);
    assert.equal(save.mock.callCount(), 0);
});

// -----------------------------------------------------
// REG-17 & REG-18: Error Handling
// -----------------------------------------------------

test("REG-17 unique constraint violation: HTTP 409", async () => {
    mock.method(console, "error", () => {});

    stubNoDuplicate();

    mock.method(
        bcrypt,
        "hash",
        async () => "hash"
    );

    mock.method(
        Pengguna.prototype,
        "simpanDataPengguna",
        async () => {
            const error = new Error("duplicate key");
            error.code = "23505";
            throw error;
        }
    );

    const res = responseDouble();

    await PenggunaController.register(
        requestDouble({ ...VALID }),
        res
    );

    assert.equal(res.statusCode, 409);
});

test("REG-18 database error: HTTP 500 tanpa detail internal", async () => {
    mock.method(console, "error", () => {});

    mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => {
            throw new Error("DB_SECRET");
        }
    );

    const res = responseDouble();

    await PenggunaController.register(
        requestDouble({ ...VALID }),
        res
    );

    assert.equal(res.statusCode, 500);

    assert.equal(
        res.body.message,
        "Something went wrong"
    );

    assert.doesNotMatch(
        JSON.stringify(res.body),
        /DB_SECRET/
    );
});

// =====================================================
// UC02 — LOGIN
// =====================================================

// Mock objek Pengguna yang diperoleh dari database

function loginUser({
    role = "warga",
    id = 17,
    hash = "hash-from-db",
} = {}) {
    return {
        getHashPassword: () => hash,
        getIdPengguna: () => id,
        getRole: () => role,
    };
}

// Mock Express Session

function sessionDouble({
    regenerateError = null,
    saveError = null,
} = {}) {
    return {
        regenerate(callback) {
            callback(regenerateError);
        },

        save(callback) {
            callback(saveError);
        },
    };
}

// -----------------------------------------------------
// LOG-01 s.d. LOG-04: Invalid Input
// -----------------------------------------------------

const invalidLogin = [
    [
        "LOG-01 email kosong",
        { email: "" },
    ],
    [
        "LOG-02 password kosong",
        { password: "" },
    ],
    [
        "LOG-03 email tidak dikirim",
        { email: undefined },
    ],
    [
        "LOG-04 password bukan string",
        { password: 12345 },
    ],
];

for (const [id, changes] of invalidLogin) {
    test(`${id}: HTTP 400, database tidak diakses`, async () => {
        const lookup = mock.method(
            Pengguna,
            "getPenggunaByEmail",
            async () => null
        );

        const res = responseDouble();

        await PenggunaController.login(
            requestDouble({
                email: VALID.email,
                password: VALID.password,
                ...changes,
            }),
            res
        );

        assert.equal(res.statusCode, 400);

        assert.equal(
            res.body.message,
            "Email and password are required."
        );

        assert.equal(lookup.mock.callCount(), 0);
    });
}

// -----------------------------------------------------
// LOG-05 & LOG-06: Invalid Credentials
// -----------------------------------------------------

test("LOG-05 email tidak terdaftar: HTTP 401", async () => {
    mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => null
    );

    const compare = mock.method(
        bcrypt,
        "compare",
        async () => true
    );

    const res = responseDouble();

    await PenggunaController.login(
        requestDouble({
            email: VALID.email,
            password: VALID.password,
        }),
        res
    );

    assert.equal(res.statusCode, 401);

    assert.equal(
        res.body.message,
        "Wrong Email or Password"
    );

    assert.equal(compare.mock.callCount(), 0);
});

test("LOG-06 password salah: HTTP 401", async () => {
    mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => loginUser()
    );

    mock.method(
        bcrypt,
        "compare",
        async () => false
    );

    const session = {
        regenerate: mock.fn(() => {
            throw new Error(
                "Session tidak boleh dibuat"
            );
        }),
    };

    const res = responseDouble();

    await PenggunaController.login(
        requestDouble(
            {
                email: VALID.email,
                password: "WrongPassword123!",
            },
            { session }
        ),
        res
    );

    assert.equal(res.statusCode, 401);

    assert.equal(
        res.body.message,
        "Wrong Email or Password"
    );

    assert.equal(
        session.regenerate.mock.callCount(),
        0
    );
});

// -----------------------------------------------------
// LOG-07a & LOG-07b: Login Success
// -----------------------------------------------------

for (const role of ["warga", "admin"]) {
    const id = role === "warga" ? "LOG-07a" : "LOG-07b";

    test(`${id} login ${role} berhasil: HTTP 200 dan session tersimpan`, async () => {
        mock.method(
            Pengguna,
            "getPenggunaByEmail",
            async () => loginUser({ role })
        );

        const compare = mock.method(
            bcrypt,
            "compare",
            async () => true
        );

        const session = sessionDouble();

        const regenerate = mock.method(
            session,
            "regenerate"
        );

        const save = mock.method(
            session,
            "save"
        );

        const res = responseDouble();

        await PenggunaController.login(
            requestDouble(
                {
                    email: VALID.email,
                    password: VALID.password,
                },
                { session }
            ),
            res
        );

        assert.equal(res.statusCode, 200);

        assert.deepEqual(res.body, {
            message: "Login succeeded.",
            role,
        });

        assert.equal(session.idPengguna, 17);
        assert.equal(session.role, role);

        assert.equal(regenerate.mock.callCount(), 1);
        assert.equal(save.mock.callCount(), 1);

        assert.deepEqual(
            compare.mock.calls[0].arguments,
            [VALID.password, "hash-from-db"]
        );
    });
}

// -----------------------------------------------------
// LOG-08: Session Regeneration Failure
// -----------------------------------------------------

test("LOG-08 gagal regenerate session: HTTP 500", async () => {
    mock.method(console, "error", () => {});

    mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => loginUser()
    );

    mock.method(
        bcrypt,
        "compare",
        async () => true
    );

    const session = sessionDouble({
        regenerateError: new Error("session failure"),
    });

    const save = mock.method(session, "save");

    const res = responseDouble();

    await PenggunaController.login(
        requestDouble(
            {
                email: VALID.email,
                password: VALID.password,
            },
            { session }
        ),
        res
    );

    assert.equal(res.statusCode, 500);
    assert.equal(save.mock.callCount(), 0);
});

// -----------------------------------------------------
// LOG-09: Session Save Failure
// -----------------------------------------------------

test("LOG-09 gagal menyimpan session: HTTP 500", async () => {
    mock.method(console, "error", () => {});

    mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => loginUser()
    );

    mock.method(
        bcrypt,
        "compare",
        async () => true
    );

    const session = sessionDouble({
        saveError: new Error("session save failure"),
    });

    const res = responseDouble();

    await PenggunaController.login(
        requestDouble(
            {
                email: VALID.email,
                password: VALID.password,
            },
            { session }
        ),
        res
    );

    assert.equal(res.statusCode, 500);
});

// -----------------------------------------------------
// LOG-10: Database Error
// -----------------------------------------------------

test("LOG-10 database error: HTTP 500 tanpa detail internal", async () => {
    mock.method(console, "error", () => {});

    mock.method(
        Pengguna,
        "getPenggunaByEmail",
        async () => {
            throw new Error("DB_SECRET");
        }
    );

    const res = responseDouble();

    await PenggunaController.login(
        requestDouble({
            email: VALID.email,
            password: VALID.password,
        }),
        res
    );

    assert.equal(res.statusCode, 500);

    assert.equal(
        res.body.message,
        "Something went wrong"
    );

    assert.doesNotMatch(
        JSON.stringify(res.body),
        /DB_SECRET/
    );
});
