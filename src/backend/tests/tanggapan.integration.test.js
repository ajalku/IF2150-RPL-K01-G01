const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { after, before, test } = require("node:test");

const testDatabaseName = process.env.TEST_DB_NAME;

if (!testDatabaseName) {
    test("INT setup requires TEST_DB_NAME containing test", {
        skip: "Set TEST_DB_NAME to a dedicated PostgreSQL database whose name contains 'test'.",
    }, () => {});
} else {
    if (!testDatabaseName.toLowerCase().includes("test")) {
        throw new Error("Integration tests aborted: TEST_DB_NAME must contain 'test'.");
    }

    require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
    process.env.DB_NAME = testDatabaseName;
    process.env.DB_HOST = process.env.TEST_DB_HOST || process.env.DB_HOST || "localhost";
    process.env.DB_PORT = process.env.TEST_DB_PORT || process.env.DB_PORT || "5432";
    process.env.DB_USER = process.env.TEST_DB_USER || process.env.DB_USER;
    process.env.DB_PASSWORD = process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD;
    process.env.NODE_ENV = "test";
    process.env.SESSION_SECRET = process.env.TEST_SESSION_SECRET || "rawat-integration-test-session";

    const express = require("express");
    const bcrypt = require("bcrypt");
    const { performance } = require("node:perf_hooks");
    const { pool } = require("../src/config/database");
    const sessionMiddleware = require("../src/config/session");
    const authRoutes = require("../src/routes/authRoutes");
    const laporanRoutes = require("../src/routes/laporanRoutes");

    const app = express();
    app.use(express.json());
    app.use(sessionMiddleware);
    app.use("/api/auth", authRoutes);
    app.use("/api/laporan", laporanRoutes);

    const akunUji = [];
    const triggerUji = [];
    let databaseSiap = false;
    let server;
    let baseUrl;
    let admin;
    let adminUntukHapus;
    let warga;
    let cookieAdmin;
    let cookieAdminUntukHapus;
    let cookieWarga;

    async function jalankanSqlFile(namaFile) {
        const sql = fs.readFileSync(path.join(__dirname, "../db", namaFile), "utf8");
        await pool.query(sql);
    }

    async function siapkanSkemaDanMigrasi() {
        const database = await pool.query("SELECT current_database() AS database_name");
        const namaAktual = database.rows[0].database_name;
        if (!namaAktual.toLowerCase().includes("test")) {
            throw new Error(`Integration tests aborted: connected to non-test database '${namaAktual}'.`);
        }
        assert.equal(namaAktual, testDatabaseName);

        for (const namaFile of ["schema.sql", "schema_laporan.sql", "schema_sessions.sql"]) {
            await jalankanSqlFile(namaFile);
        }
        const direktoriDb = path.resolve(__dirname, "../db");
        const migrasi = fs.readdirSync(direktoriDb)
            .filter(namaFile => /^migration_.*\.sql$/.test(namaFile))
            .sort();
        for (const namaFile of migrasi) {
            await jalankanSqlFile(namaFile);
        }
    }

    function nikAcak() {
        return `${crypto.randomInt(1, 10)}${Array.from(
            { length: 15 },
            () => crypto.randomInt(0, 10)
        ).join("")}`;
    }

    async function buatAkun(role, nama) {
        const idPengguna = crypto.randomUUID();
        const email = `${nama.toLowerCase()}-${idPengguna}@example.test`;
        const password = "RawatIntegration!2026";
        const hashPassword = await bcrypt.hash(password, 4);
        await pool.query(
            `INSERT INTO pengguna
                (id_pengguna, nama, nik, email, hash_password, no_telp, role)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [idPengguna, nama, nikAcak(), email, hashPassword, "081234567890", role]
        );
        akunUji.push(idPengguna);
        return { idPengguna, email, password };
    }

    async function buatLaporan() {
        const idLaporan = crypto.randomUUID();
        await pool.query(
            `INSERT INTO laporan
                (id_laporan, id_pengguna, nama_masalah, kategori, tingkat_permasalahan,
                 status_privasi, deskripsi, bobot_urgensi, skor_populer)
             VALUES ($1, $2, 'Jalan berlubang uji', 'Jalan', 'SEDANG',
                     'PUBLIK', 'Laporan untuk pengujian tanggapan.', 2, 0)`,
            [idLaporan, warga.idPengguna]
        );
        await pool.query(
            `INSERT INTO lokasi (id_laporan, latitude, longitude, alamat)
             VALUES ($1, -6.9, 107.6, 'Lokasi uji')`,
            [idLaporan]
        );
        return idLaporan;
    }

    async function login(akun) {
        const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: akun.email, password: akun.password }),
        });
        assert.equal(response.status, 200);
        const cookie = response.headers.get("set-cookie");
        assert.ok(cookie, "Login harus membuat cookie sesi.");
        return cookie.split(";")[0];
    }

    async function postTanggapan(idLaporan, cookie, body) {
        return fetch(`${baseUrl}/api/laporan/${idLaporan}/tanggapan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
            },
            body: JSON.stringify(body),
        });
    }

    before(async () => {
        await siapkanSkemaDanMigrasi();
        databaseSiap = true;

        admin = await buatAkun("admin", "Admin Utama Uji");
        adminUntukHapus = await buatAkun("admin", "Admin Hapus Uji");
        warga = await buatAkun("warga", "Warga Uji");

        server = app.listen(0);
        await new Promise((resolve, reject) => {
            server.once("listening", resolve);
            server.once("error", reject);
        });
        const address = server.address();
        baseUrl = `http://127.0.0.1:${address.port}`;

        cookieAdmin = await login(admin);
        cookieAdminUntukHapus = await login(adminUntukHapus);
        cookieWarga = await login(warga);
    });

    after(async () => {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close(error => error ? reject(error) : resolve());
            });
        }
        try {
            for (const { trigger, functionName } of triggerUji) {
                await pool.query(`DROP TRIGGER IF EXISTS ${trigger} ON laporan`);
                await pool.query(`DROP FUNCTION IF EXISTS ${functionName}()`);
            }
            if (databaseSiap && akunUji.length > 0) {
                await pool.query(
                    "DELETE FROM user_sessions WHERE sess->>'idPengguna' = ANY($1::text[])",
                    [akunUji]
                );
                await pool.query(
                    "DELETE FROM pengguna WHERE id_pengguna = ANY($1::uuid[])",
                    [akunUji]
                );
            }
        } finally {
            await pool.end();
        }
    });

    test("INT-TC01 tanggapan valid tersimpan dan status laporan berubah", async (t) => {
        const idLaporan = await buatLaporan();
        const mulai = performance.now();
        const response = await postTanggapan(idLaporan, cookieAdmin, {
            statusTanggapan: true,
            deskripsiTanggapan: "Laporan telah diperiksa.",
            catatanPemeriksaan: "Lokasi dan foto sesuai.",
            statusLaporan: "DIPERBAIKI",
        });
        const durasiMs = performance.now() - mulai;
        t.diagnostic(`Waktu respons POST tanggapan: ${durasiMs.toFixed(2)} ms`);
        assert.equal(response.status, 200);
        assert.ok(durasiMs <= 5000, "Sinkronisasi status harus selesai dalam maksimal 5 detik.");

        const result = await pool.query(
            `SELECT t.id_admin, t.status_tanggapan, t.deskripsi_tanggapan,
                    l.status_laporan, l.status_validasi, l.catatan_pemeriksaan
             FROM tanggapan t
             JOIN laporan l ON l.id_laporan = t.id_laporan
             WHERE t.id_laporan = $1`,
            [idLaporan]
        );
        assert.equal(result.rowCount, 1);
        assert.equal(result.rows[0].id_admin, admin.idPengguna);
        assert.equal(result.rows[0].status_tanggapan, true);
        assert.equal(result.rows[0].deskripsi_tanggapan, "Laporan telah diperiksa.");
        assert.equal(result.rows[0].status_laporan, "DIPERBAIKI");
        assert.equal(result.rows[0].status_validasi, "VALID");
        assert.equal(result.rows[0].catatan_pemeriksaan, "Lokasi dan foto sesuai.");

        const detailWarga = await fetch(`${baseUrl}/api/laporan/${idLaporan}`, {
            headers: { Cookie: cookieWarga },
        });
        assert.equal(detailWarga.status, 200);
        const detail = await detailWarga.json();
        assert.equal(detail.laporan.statusLaporan, "DIPERBAIKI");
    });

    test("INT-TC02 idAdmin palsu pada body diabaikan dan id sesi yang disimpan", async () => {
        const idLaporan = await buatLaporan();
        const response = await postTanggapan(idLaporan, cookieAdmin, {
            statusTanggapan: true,
            deskripsiTanggapan: "",
            statusLaporan: "DILIHAT",
            idAdmin: crypto.randomUUID(),
        });
        assert.equal(response.status, 200);

        const result = await pool.query(
            "SELECT id_admin FROM tanggapan WHERE id_laporan = $1",
            [idLaporan]
        );
        assert.equal(result.rows[0].id_admin, admin.idPengguna);
    });

    test("INT-TC03 kegagalan update status me-rollback tanggapan dan pemeriksaan", async () => {
        const idLaporan = await buatLaporan();
        const suffix = crypto.randomBytes(4).toString("hex");
        const functionName = `rawat_test_suppress_${suffix}`;
        const trigger = `rawat_test_suppress_${suffix}`;
        triggerUji.push({ trigger, functionName });
        await pool.query(
            `CREATE FUNCTION ${functionName}() RETURNS trigger
             LANGUAGE plpgsql AS $$
             BEGIN
                 IF NEW.id_laporan = '${idLaporan}'::uuid THEN
                     RETURN NULL;
                 END IF;
                 RETURN NEW;
             END;
             $$`
        );
        await pool.query(
            `CREATE TRIGGER ${trigger}
             BEFORE UPDATE OF status_laporan ON laporan
             FOR EACH ROW EXECUTE FUNCTION ${functionName}()`
        );

        const response = await postTanggapan(idLaporan, cookieAdmin, {
            statusTanggapan: false,
            deskripsiTanggapan: "Alasan laporan tidak valid.",
            catatanPemeriksaan: "Pemeriksaan uji.",
            statusLaporan: "SELESAI",
        });
        assert.equal(response.status, 404);

        const result = await pool.query(
            `SELECT l.status_laporan, l.status_validasi, COUNT(t.id_tanggapan)::int AS jumlah_tanggapan
             FROM laporan l
             LEFT JOIN tanggapan t ON t.id_laporan = l.id_laporan
             WHERE l.id_laporan = $1
             GROUP BY l.id_laporan`,
            [idLaporan]
        );
        assert.equal(result.rows[0].jumlah_tanggapan, 0);
        assert.equal(result.rows[0].status_laporan, "BELUM_DILIHAT");
        assert.equal(result.rows[0].status_validasi, "BELUM_DIPERIKSA");
    });

    test("INT-TC04 migration_tanggapan_id_admin dapat dijalankan dua kali", async () => {
        await jalankanSqlFile("migration_tanggapan_id_admin.sql");
        await jalankanSqlFile("migration_tanggapan_id_admin.sql");
        const result = await pool.query(
            `SELECT column_name
             FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'tanggapan'
               AND column_name = 'id_admin'`
        );
        assert.equal(result.rowCount, 1);
    });

    test("INT-TC05 route nyata menolak non-admin dengan 403 dan tanpa sesi dengan 401", async () => {
        const idLaporan = crypto.randomUUID();
        const tanpaSesi = await fetch(`${baseUrl}/api/laporan/${idLaporan}/tanggapan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
        assert.equal(tanpaSesi.status, 401);

        const nonAdmin = await postTanggapan(idLaporan, cookieWarga, {});
        assert.equal(nonAdmin.status, 403);
    });

    test("INT-TC06 detail laporan melalui HTTP menyamarkan identitas admin dari warga", async () => {
        const idLaporan = await buatLaporan();
        await pool.query(
            `INSERT INTO tanggapan (id_laporan, id_admin, status_tanggapan, deskripsi_tanggapan)
             VALUES ($1, $2, TRUE, 'Ditinjau oleh admin.')`,
            [idLaporan, admin.idPengguna]
        );

        const detailWarga = await fetch(`${baseUrl}/api/laporan/${idLaporan}`, {
            headers: { Cookie: cookieWarga },
        });
        assert.equal(detailWarga.status, 200);
        const responsWarga = await detailWarga.json();
        assert.equal(Object.hasOwn(responsWarga.laporan.tanggapanTeratas, "idAdmin"), false);
        assert.equal(Object.hasOwn(responsWarga.laporan.tanggapanTeratas, "namaAdmin"), false);

        const detailAdmin = await fetch(`${baseUrl}/api/laporan/${idLaporan}`, {
            headers: { Cookie: cookieAdmin },
        });
        assert.equal(detailAdmin.status, 200);
        const responsAdmin = await detailAdmin.json();
        assert.equal(responsAdmin.laporan.tanggapanTeratas.idAdmin, admin.idPengguna);
        assert.equal(responsAdmin.laporan.tanggapanTeratas.namaAdmin, "Admin Utama Uji");
    });

    test("INT-TC07 penghapusan akun admin mempertahankan tanggapan dengan id_admin NULL", async () => {
        const idLaporan = await buatLaporan();
        const response = await postTanggapan(idLaporan, cookieAdminUntukHapus, {
            statusTanggapan: true,
            deskripsiTanggapan: "Tanggapan tetap tersimpan.",
            statusLaporan: "DILIHAT",
        });
        assert.equal(response.status, 200);

        await pool.query("DELETE FROM pengguna WHERE id_pengguna = $1", [
            adminUntukHapus.idPengguna,
        ]);
        const result = await pool.query(
            "SELECT id_admin, deskripsi_tanggapan FROM tanggapan WHERE id_laporan = $1",
            [idLaporan]
        );
        assert.equal(result.rowCount, 1);
        assert.equal(result.rows[0].id_admin, null);
        assert.equal(result.rows[0].deskripsi_tanggapan, "Tanggapan tetap tersimpan.");
    });

    test("INT-TC08 route menolak UUID tidak valid dan laporan yang tidak ditemukan", async () => {
        const idTidakAda = crypto.randomUUID();
        const idTidakValid = await postTanggapan("bukan-uuid", cookieAdmin, {
            statusTanggapan: true,
            statusLaporan: "SELESAI",
        });
        assert.equal(idTidakValid.status, 404);

        const laporanTidakAda = await postTanggapan(idTidakAda, cookieAdmin, {
            statusTanggapan: true,
            statusLaporan: "SELESAI",
        });
        assert.equal(laporanTidakAda.status, 404);
        const tanggapan = await pool.query(
            "SELECT COUNT(*)::int AS jumlah FROM tanggapan WHERE id_laporan = $1",
            [idTidakAda]
        );
        assert.equal(tanggapan.rows[0].jumlah, 0);
    });
}
