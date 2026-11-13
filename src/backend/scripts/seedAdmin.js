
require("dotenv").config();

const bcrypt = require("bcrypt");
const { pool } = require("../src/config/database");

async function seedAdmin() {
    const nama = process.env.ADMIN_NAME || "Admin RAWAT";
    const nik = process.env.ADMIN_NIK;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const noTelp = process.env.ADMIN_PHONE;

    if (!nik || !email || !password || !noTelp) {
        throw new Error(
            "ADMIN_NIK, ADMIN_EMAIL, ADMIN_PASSWORD, dan ADMIN_PHONE wajib diisi di .env"
        );
    }

    if (!/^\d{16}$/.test(nik)) {
        throw new Error("ADMIN_NIK harus terdiri dari 16 digit");
    }

    if (!/^08\d{8,13}$/.test(noTelp)) {
        throw new Error("ADMIN_PHONE tidak valid");
    }

    const validPassword =
        Buffer.byteLength(password, "utf8") >= 8 &&
        Buffer.byteLength(password, "utf8") <= 72 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

    if (!validPassword) {
        throw new Error("ADMIN_PASSWORD tidak memenuhi aturan password");
    }

    // Cek apakah email sudah digunakan.
    const existing = await pool.query(
        "SELECT id_pengguna, role FROM pengguna WHERE email = $1",
        [email]
    );

    if (existing.rows.length > 0) {
        if (existing.rows[0].role !== "admin") {
            throw new Error(
                "Email sudah digunakan oleh akun non-Admin. Seed dibatalkan."
            );
        }

        console.log("Akun Admin sudah tersedia. Tidak membuat duplikat.");
        return;
    }

    // Jangan memakai NIK milik pengguna lain.
    const existingNik = await pool.query(
        "SELECT id_pengguna FROM pengguna WHERE nik = $1",
        [nik]
    );

    if (existingNik.rows.length > 0) {
        throw new Error("NIK sudah digunakan oleh akun lain.");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO pengguna
            (nama, nik, email, hash_password, no_telp, role)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id_pengguna, nama, email, role`,
        [
            nama,
            nik,
            email,
            hashPassword,
            noTelp,
            "admin",
        ]
    );

    console.log("Akun Admin berhasil dibuat:");
    console.log(result.rows[0]);
}

seedAdmin()
    .catch((error) => {
        console.error("Gagal membuat akun Admin:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
