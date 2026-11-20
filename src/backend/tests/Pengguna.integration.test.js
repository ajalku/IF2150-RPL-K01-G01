
/**
 * Integration Testing RAWAT
 * I-01: PenggunaController -> Pengguna
 * I-02: Pengguna -> PostgreSQL
 *
 * Tanpa mocking.
 */

require("dotenv").config();

const request = require("supertest");
const { pool } = require("../src/config/database");

const API_URL = "http://localhost:7001";

// Data unik supaya tidak bentrok dengan akun lain
const unik = (
  Date.now().toString() +
  Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
).slice(-16);

const dataTest = {
  nama: "Integration Test",
  nik: unik,
  email: `integration-${unik}@example.com`,
  password: "Password1!",
  noTelp: "081234567890",
};

const agent = request.agent(API_URL);

// =====================================
// SETUP & CLEANUP
// =====================================

beforeAll(async () => {
  if (!process.env.DB_NAME) {
    throw new Error("DB_NAME belum dikonfigurasi");
  }

  const result = await pool.query(
    "SELECT current_database() AS nama"
  );

  expect(result.rows[0].nama)
    .toBe(process.env.DB_NAME);

  console.log(
    "Database pengujian:",
    result.rows[0].nama
  );
});

afterAll(async () => {
  try {
    // Hanya hapus akun yang dibuat test ini
    await pool.query(
      "DELETE FROM pengguna WHERE email = $1",
      [dataTest.email]
    );
  } finally {
    await pool.end();
  }
});

// =====================================
// INT-TC01 - REGISTRASI
// =====================================

describe("I-01 & I-02 - Integrasi Pengguna", () => {

  test("INT-TC01 - Registrasi tersimpan di database", async () => {

    // Act: request ke Express asli
    const res = await agent
      .post("/api/auth/register")
      .send(dataTest);

    // Assert: respons controller
    expect(res.status).toBe(201);
    expect(res.body.idPengguna).toBeDefined();

    // Assert: data benar-benar masuk PostgreSQL
    const hasil = await pool.query(
      "SELECT * FROM pengguna WHERE email = $1",
      [dataTest.email]
    );

    expect(hasil.rows).toHaveLength(1);

    const pengguna = hasil.rows[0];

    expect(pengguna.nama).toBe(dataTest.nama);
    expect(pengguna.nik).toBe(dataTest.nik);
    expect(pengguna.email).toBe(dataTest.email);

    // Password harus tersimpan sebagai hash
    expect(pengguna.hash_password)
      .not.toBe(dataTest.password);

    expect(pengguna.hash_password).toBeTruthy();
  });

  // =====================================
  // INT-TC02 - LOGIN
  // =====================================

  test("INT-TC02 - Login berhasil dan sesi dikenali", async () => {

    // Act: login menggunakan akun TC01
    const res = await agent
      .post("/api/auth/login")
      .send({
        email: dataTest.email,
        password: dataTest.password,
      });

    // Assert: login berhasil
    expect(res.status).toBe(200);

    expect(res.body.message)
      .toBe("Login succeeded.");

    expect(res.body.role).toBe("warga");

    // Periksa sesi melalui endpoint /me
    const me = await agent
      .get("/api/auth/me");

    expect(me.status).toBe(200);

    expect(me.body.pengguna.email)
      .toBe(dataTest.email);

    expect(me.body.pengguna.role)
      .toBe("warga");
  });


// =====================================
// INT-TC03 - GET PROFILE
// I-01 & I-02
// =====================================

test("INT-TC03 - Profil berhasil diambil dari database", async () => {

  // Act: ambil profil menggunakan session login
  const res = await agent
    .get("/api/profile");

  // Assert: response backend
  expect(res.status).toBe(200);

  expect(res.body.pengguna).toBeDefined();

  expect(res.body.pengguna.nama)
    .toBe(dataTest.nama);

  expect(res.body.pengguna.email)
    .toBe(dataTest.email);

  expect(res.body.pengguna.noTelp)
    .toBe(dataTest.noTelp);

  expect(res.body.pengguna.role)
    .toBe("warga");

  // Verifikasi langsung ke PostgreSQL
  const hasil = await pool.query(
    `SELECT id_pengguna, nama, email, no_telp, role
     FROM pengguna
     WHERE email = $1`,
    [dataTest.email]
  );

  expect(hasil.rows).toHaveLength(1);

  expect(res.body.pengguna.idPengguna)
    .toBe(hasil.rows[0].id_pengguna);

  expect(res.body.pengguna.nama)
    .toBe(hasil.rows[0].nama);

  expect(res.body.pengguna.noTelp)
    .toBe(hasil.rows[0].no_telp);

});


// =====================================
// INT-TC04 - UPDATE PROFILE
// I-01 & I-02
// =====================================

test("INT-TC04 - Profil berhasil diperbarui di database", async () => {

  const dataBaru = {
    nama: "Integration Test Updated",
    noTelp: "081298765432",
  };

  // Act: ubah profil melalui API
  const res = await agent
    .put("/api/profile")
    .send(dataBaru);

  // Assert: response controller
  expect(res.status).toBe(200);

  expect(res.body.message)
    .toBe("Profile updated successfully.");

  expect(res.body.pengguna.nama)
    .toBe(dataBaru.nama);

  expect(res.body.pengguna.noTelp)
    .toBe(dataBaru.noTelp);

  // Verifikasi data tersimpan di PostgreSQL
  const hasil = await pool.query(
    `SELECT nama, no_telp
     FROM pengguna
     WHERE email = $1`,
    [dataTest.email]
  );

  expect(hasil.rows).toHaveLength(1);

  expect(hasil.rows[0].nama)
    .toBe(dataBaru.nama);

  expect(hasil.rows[0].no_telp)
    .toBe(dataBaru.noTelp);

  // Baca kembali melalui API
  const cekProfil = await agent.get("/api/profile");

  expect(cekProfil.status).toBe(200);

  expect(cekProfil.body.pengguna.nama)
    .toBe(dataBaru.nama);

  expect(cekProfil.body.pengguna.noTelp)
    .toBe(dataBaru.noTelp);

});


// =====================================
// INT-TC05 - CHANGE PASSWORD
// I-01 & I-02
// =====================================

test("INT-TC05 - Password berhasil diganti dan dapat digunakan", async () => {

  const passwordBaru = "NewPassword2!";

  // Ambil hash password sebelum perubahan
  const sebelum = await pool.query(
    `SELECT hash_password
     FROM pengguna
     WHERE email = $1`,
    [dataTest.email]
  );

  expect(sebelum.rows).toHaveLength(1);

  const hashLama = sebelum.rows[0].hash_password;

  // Act: ubah password melalui API
  const res = await agent
    .put("/api/profile/password")
    .send({
      currentPassword: dataTest.password,
      newPassword: passwordBaru,
      confirmPassword: passwordBaru,
    });

  // Assert
  expect(res.status).toBe(200);

  expect(res.body.message)
    .toBe("Password updated successfully.");

  // Ambil hash password setelah perubahan
  const sesudah = await pool.query(
    `SELECT hash_password
     FROM pengguna
     WHERE email = $1`,
    [dataTest.email]
  );

  expect(sesudah.rows).toHaveLength(1);

  const hashBaru = sesudah.rows[0].hash_password;

  // Hash harus berubah
  expect(hashBaru).not.toBe(hashLama);

  // Password tidak boleh disimpan plaintext
  expect(hashBaru).not.toBe(passwordBaru);

  // Verifikasi login menggunakan password baru
  const agentBaru = request.agent(API_URL);

  const loginBaru = await agentBaru
    .post("/api/auth/login")
    .send({
      email: dataTest.email,
      password: passwordBaru,
    });

  expect(loginBaru.status).toBe(200);

  expect(loginBaru.body.role)
    .toBe("warga");

  // Pastikan session login baru dikenali
  const me = await agentBaru.get("/api/auth/me");

  expect(me.status).toBe(200);

  expect(me.body.pengguna.email)
    .toBe(dataTest.email);

});


// =====================================
// INT-TC06 - HAPUS AKUN
// I-01 & I-02 & I-05
// =====================================

test("INT-TC06 - Akun berhasil dihapus dari database", async () => {

  // Pastikan akun masih tersedia
  const sebelum = await pool.query(
    `SELECT id_pengguna
     FROM pengguna
     WHERE email = $1`,
    [dataTest.email]
  );

  expect(sebelum.rows).toHaveLength(1);

  const idPengguna = sebelum.rows[0].id_pengguna;

  // Act: hapus akun melalui API
  // Sesuaikan endpoint dengan authRoutes/profileRoutes
  const endpointHapus =
    process.env.TEST_DELETE_ACCOUNT_ENDPOINT ||
    "/api/profile";

  const res = await agent
    .delete(endpointHapus);

  // Assert: controller berhasil menghapus
  expect(res.status).toBe(200);

  expect(res.body.message)
    .toBe("Akun berhasil dihapus.");

  // Verifikasi data sudah tidak ada
  const sesudah = await pool.query(
    `SELECT id_pengguna
     FROM pengguna
     WHERE id_pengguna = $1`,
    [idPengguna]
  );

  expect(sesudah.rows).toHaveLength(0);

  // Session lama tidak boleh bisa dipakai lagi
  const me = await agent.get("/api/auth/me");

  expect(me.status).toBe(401);

});


});
