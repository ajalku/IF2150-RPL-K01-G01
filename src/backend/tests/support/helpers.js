// Pembantu pengujian: mengganti koneksi database asli dengan pool palsu,
// sehingga pengujian tidak membutuhkan PostgreSQL maupun paket `pg`.
const path = require("node:path");

const fakePool = {
    query: async () => { throw new Error("fakePool.query belum di-mock"); },
    connect: async () => { throw new Error("fakePool.connect belum di-mock"); },
};

const dbPath = require.resolve(path.join(__dirname, "../../src/config/database"));
require.cache[dbPath] = {
    id: dbPath,
    filename: dbPath,
    loaded: true,
    exports: { pool: fakePool, dbConnect: async () => {} },
};

function fakeRes() {
    return {
        statusCode: 200,
        body: undefined,
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; },
    };
}

function fakeReq({ params = {}, query = {}, body = {}, session = {} } = {}) {
    return { params, query, body, session };
}

// Client transaksi palsu yang mencatat urutan query yang dikirim
function fakeClient(handler = async () => ({ rowCount: 1, rows: [] })) {
    const log = [];
    return {
        log,
        released: false,
        async query(sql, params) {
            const kalimat = String(sql).trim().split(/\s+/)[0].toUpperCase();
            log.push(kalimat === "BEGIN" || kalimat === "COMMIT" || kalimat === "ROLLBACK" ? kalimat : String(sql).trim());
            return handler(sql, params);
        },
        release() { this.released = true; },
    };
}

const ID_LAPORAN = "11111111-1111-4111-8111-111111111111";
const ID_PENGGUNA = "22222222-2222-4222-8222-222222222222";

module.exports = { fakePool, fakeRes, fakeReq, fakeClient, ID_LAPORAN, ID_PENGGUNA };
