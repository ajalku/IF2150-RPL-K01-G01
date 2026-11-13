const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const test = require("node:test");
const Pengguna = require("../src/models/Pengguna");
const PenggunaController = require("../src/controllers/PenggunaController");
const { requireAuth } = require("../src/middleware/authMiddleware");
const { pool } = require("../src/config/database");

function makeResponse() {
    return {
        statusCode: null,
        body: null,
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

async function withStubs(stubs, callback) {
    const originals = Object.fromEntries(
        Object.keys(stubs).map(name => [name, Pengguna[name]])
    );
    Object.assign(Pengguna, stubs);
    try {
        await callback();
    } finally {
        Object.assign(Pengguna, originals);
    }
}

test("profile retrieval uses the authenticated session and returns sanitized fields", async () => {
    let requestedId;
    await withStubs({
        async getProfilPenggunaById(id) {
            requestedId = id;
            return {
                idPengguna: id,
                nama: "Warga",
                email: "warga@example.com",
                noTelp: "081234567890",
                role: "warga",
            };
        },
    }, async () => {
        const response = makeResponse();
        await PenggunaController.getProfile({
            session: { userId: "session-user-id" },
        }, response);

        assert.equal(response.statusCode, 200);
        assert.equal(requestedId, "session-user-id");
        assert.equal(response.body.pengguna.idPengguna, "session-user-id");
        assert.equal("hash_password" in response.body.pengguna, false);
    });
});

test("profile retrieval supports existing idPengguna sessions", async () => {
    let requestedId;
    await withStubs({
        async getProfilPenggunaById(id) {
            requestedId = id;
            return { idPengguna: id };
        },
    }, async () => {
        const response = makeResponse();
        await PenggunaController.getProfile({
            session: { idPengguna: "legacy-session-id" },
        }, response);
        assert.equal(requestedId, "legacy-session-id");
        assert.equal(response.statusCode, 200);
    });
});

test("authentication middleware rejects profile access without a session", () => {
    let statusCode;
    let continued = false;
    requireAuth({ session: null }, {
        status(code) {
            statusCode = code;
            return this;
        },
        json() {
            return this;
        },
    }, () => { continued = true; });

    assert.equal(statusCode, 401);
    assert.equal(continued, false);
});

test("profile update accepts valid data and only uses the session user ID", async () => {
    let updatedId;
    let updatedFields;
    await withStubs({
        async updateDataPengguna(id, changes) {
            updatedId = id;
            updatedFields = changes;
            return true;
        },
        async getProfilPenggunaById(id) {
            return {
                idPengguna: id,
                nama: "Nama Baru",
                email: "warga@example.com",
                noTelp: "081234567890",
                role: "warga",
            };
        },
    }, async () => {
        const response = makeResponse();
        await PenggunaController.updateProfile({
            session: { userId: "owner-id" },
            body: { nama: " Nama Baru ", noTelp: "081234567890" },
        }, response);

        assert.equal(response.statusCode, 200);
        assert.equal(updatedId, "owner-id");
        assert.deepEqual(updatedFields, { nama: "Nama Baru", noTelp: "081234567890" });
        assert.equal(response.body.pengguna.idPengguna, "owner-id");
    });
});

test("profile update rejects invalid values and protected or foreign-user fields", async () => {
    let updateCount = 0;
    await withStubs({
        async updateDataPengguna() {
            updateCount += 1;
            return true;
        },
    }, async () => {
        for (const body of [
            { nama: " " },
            { noTelp: "12345" },
            { role: "admin", nama: "Warga" },
            { userId: "another-user", nama: "Warga" },
        ]) {
            const response = makeResponse();
            await PenggunaController.updateProfile({
                session: { userId: "owner-id" },
                body,
            }, response);
            assert.equal(response.statusCode, 400);
        }
        assert.equal(updateCount, 0);
    });
});

test("profile model uses parameterized SQL with an allowlisted update", async () => {
    const querySebelumnya = pool.query;
    let call;
    try {
        pool.query = async (sql, values) => {
            call = { sql, values };
            return { rowCount: 1 };
        };

        const updated = await Pengguna.updateDataPengguna("owner-id", {
            nama: "Injected ' value",
            role: "admin",
            userId: "another-user",
        });

        assert.equal(updated, true);
        assert.match(call.sql, /SET nama = \$1/);
        assert.doesNotMatch(call.sql, /role|userId/);
        assert.deepEqual(call.values, ["Injected ' value", "owner-id"]);
    } finally {
        pool.query = querySebelumnya;
    }
});

test("profile model selects only non-credential fields", async () => {
    const querySebelumnya = pool.query;
    let call;
    try {
        pool.query = async (sql, values) => {
            call = { sql, values };
            return {
                rows: [{
                    id_pengguna: "owner-id",
                    nama: "Warga",
                    email: "warga@example.com",
                    no_telp: "081234567890",
                    role: "warga",
                    hash_password: "must-not-be-returned",
                }],
            };
        };

        const profile = await Pengguna.getProfilPenggunaById("owner-id");
        assert.deepEqual(call.values, ["owner-id"]);
        assert.doesNotMatch(call.sql, /hash_password|nik|status/);
        assert.deepEqual(profile, {
            idPengguna: "owner-id",
            nama: "Warga",
            email: "warga@example.com",
            noTelp: "081234567890",
            role: "warga",
        });
    } finally {
        pool.query = querySebelumnya;
    }
});

test("password update rejects wrong current passwords and mismatched confirmation", async () => {
    const hashPassword = await bcrypt.hash("Current-Password1", 4);
    let updateCount = 0;
    await withStubs({
        async getPenggunaById() {
            return { getHashPassword: () => hashPassword };
        },
        async updateDataPengguna() {
            updateCount += 1;
            return true;
        },
    }, async () => {
        const incorrectCurrent = makeResponse();
        await PenggunaController.changePassword({
            session: { userId: "owner-id" },
            body: {
                currentPassword: "Wrong-Password1",
                newPassword: "New-Password1",
                confirmPassword: "New-Password1",
            },
        }, incorrectCurrent);
        assert.equal(incorrectCurrent.statusCode, 401);

        const mismatchedConfirmation = makeResponse();
        await PenggunaController.changePassword({
            session: { userId: "owner-id" },
            body: {
                currentPassword: "Current-Password1",
                newPassword: "New-Password1",
                confirmPassword: "Different-Password1",
            },
        }, mismatchedConfirmation);
        assert.equal(mismatchedConfirmation.statusCode, 400);
        assert.equal(updateCount, 0);

        const reusedPassword = makeResponse();
        await PenggunaController.changePassword({
            session: { userId: "owner-id" },
            body: {
                currentPassword: "Current-Password1",
                newPassword: "Current-Password1",
                confirmPassword: "Current-Password1",
            },
        }, reusedPassword);
        assert.equal(reusedPassword.statusCode, 400);
        assert.equal(updateCount, 0);
    });
});

test("password update stores a new bcrypt hash without ending the active session", async () => {
    let storedHash = await bcrypt.hash("Current-Password1", 4);
    const session = { userId: "owner-id", idPengguna: "owner-id", role: "warga" };
    let savedId;
    await withStubs({
        async getPenggunaById() {
            return { getHashPassword: () => storedHash };
        },
        async updateDataPengguna(id, changes) {
            savedId = id;
            storedHash = changes.hashPassword;
            return true;
        },
        async getPenggunaByEmail() {
            return {
                getHashPassword: () => storedHash,
                getIdPengguna: () => "owner-id",
                getRole: () => "warga",
            };
        },
    }, async () => {
        const response = makeResponse();
        await PenggunaController.changePassword({
            session,
            body: {
                currentPassword: "Current-Password1",
                newPassword: "New-Password1",
                confirmPassword: "New-Password1",
            },
        }, response);

        assert.equal(response.statusCode, 200);
        assert.equal(savedId, "owner-id");
        assert.notEqual(storedHash, "new-password");
        assert.equal(await bcrypt.compare("New-Password1", storedHash), true);
        assert.deepEqual(session, {
            userId: "owner-id",
            idPengguna: "owner-id",
            role: "warga",
        });
        assert.equal("hashPassword" in response.body, false);

        const loginSession = {
            regenerate(callback) { callback(null); },
            save(callback) { callback(null); },
        };
        const loginResponse = makeResponse();
        await PenggunaController.login({
            body: { email: "warga@example.com", password: "New-Password1" },
            session: loginSession,
        }, loginResponse);

        assert.equal(loginResponse.statusCode, 200);
        assert.equal(loginSession.userId, "owner-id");
        assert.equal(loginSession.idPengguna, "owner-id");
    });
});
