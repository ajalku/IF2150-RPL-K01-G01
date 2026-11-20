
/**
 * Unit Testing Pengguna.js
 * Framework: Jest
 * Jumlah: 8 Test Cases
 * Jenis: Normal
 *
 * Satu test case untuk setiap method utama.
 */

// =====================================
// MOCK DATABASE
// =====================================

jest.mock("../src/config/database", () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { pool } = require("../src/config/database");
const Pengguna = require("../src/models/Pengguna");

// =====================================
// DATA DUMMY
// =====================================

const dataPengguna = {
  id_pengguna: 1,
  nama: "Samantha",
  nik: "1234567890123456",
  email: "samantha@example.com",
  hash_password: "hashed-password",
  no_telp: "081234567890",
  role: "warga",
};

// =====================================
// SETUP
// =====================================

beforeEach(() => {
  jest.clearAllMocks();
});

// =====================================
// TC01 - SIMPAN DATA PENGGUNA
// =====================================

describe("Pengguna.simpanDataPengguna", () => {

  test("C16-UT01 - Berhasil menyimpan pengguna baru", async () => {

    // Arrange
    pool.query.mockResolvedValue({
      rows: [{ id_pengguna: 1 }],
      rowCount: 1,
    });

    const pengguna = new Pengguna(dataPengguna);

    // Act
    const hasil = await pengguna.simpanDataPengguna();

    // Assert
    expect(hasil).toBe(1);

    expect(pool.query).toHaveBeenCalledTimes(1);

    const [query, values] = pool.query.mock.calls[0];

    expect(query).toContain("INSERT INTO pengguna");

    expect(values).toEqual([
      "Samantha",
      "1234567890123456",
      "samantha@example.com",
      "hashed-password",
      "081234567890",
    ]);
  });
});

// =====================================
// TC02 - GET PENGGUNA BY EMAIL
// =====================================

describe("Pengguna.getPenggunaByEmail", () => {

  test("C16-UT02 - Berhasil mencari pengguna berdasarkan email", async () => {

    // Arrange
    pool.query.mockResolvedValue({
      rows: [dataPengguna],
      rowCount: 1,
    });

    // Act
    const hasil = await Pengguna.getPenggunaByEmail(
      "samantha@example.com"
    );

    // Assert
    expect(hasil).toBeInstanceOf(Pengguna);

    expect(hasil.getEmail()).toBe(
      "samantha@example.com"
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM pengguna"),
      ["samantha@example.com"]
    );
  });
});

// =====================================
// TC03 - GET PENGGUNA BY ID
// =====================================

describe("Pengguna.getPenggunaById", () => {

  test("C16-UT03 - Berhasil mencari pengguna berdasarkan ID", async () => {

    // Arrange
    pool.query.mockResolvedValue({
      rows: [dataPengguna],
      rowCount: 1,
    });

    // Act
    const hasil = await Pengguna.getPenggunaById(1);

    // Assert
    expect(hasil).toBeInstanceOf(Pengguna);

    expect(hasil.getIdPengguna()).toBe(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM pengguna"),
      [1]
    );
  });
});

// =====================================
// TC04 - GET PROFIL PENGGUNA BY ID
// =====================================

describe("Pengguna.getProfilPenggunaById", () => {

  test("C16-UT04 - Berhasil mengambil profil pengguna", async () => {

    // Arrange
    pool.query.mockResolvedValue({
      rows: [dataPengguna],
      rowCount: 1,
    });

    // Act
    const hasil = await Pengguna.getProfilPenggunaById(1);

    // Assert
    expect(hasil).toEqual({
      idPengguna: 1,
      nama: "Samantha",
      email: "samantha@example.com",
      noTelp: "081234567890",
      role: "warga",
    });

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining(
        "SELECT id_pengguna, nama, email, no_telp, role"
      ),
      [1]
    );
  });
});

// =====================================
// TC05 - UPDATE DATA PENGGUNA
// =====================================

describe("Pengguna.updateDataPengguna", () => {

  test("C16-UT05 - Berhasil memperbarui data pengguna", async () => {

    // Arrange
    pool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ id_pengguna: 1 }],
    });

    const dataBaru = {
      nama: "Samantha Baru",
      noTelp: "081234567890",
    };

    // Act
    const hasil = await Pengguna.updateDataPengguna(
      1,
      dataBaru
    );

    // Assert
    expect(hasil).toBe(true);

    expect(pool.query).toHaveBeenCalledTimes(1);

    const [query, values] = pool.query.mock.calls[0];

    expect(query).toContain("UPDATE pengguna");
    expect(query).toContain("nama = $1");
    expect(query).toContain("no_telp = $2");
    expect(query).toContain("WHERE id_pengguna = $3");

    expect(values).toEqual([
      "Samantha Baru",
      "081234567890",
      1,
    ]);
  });
});

// =====================================
// TC06 - HAPUS DATA PENGGUNA
// =====================================

describe("Pengguna.hapusDataPengguna", () => {

  test("C16-UT06 - Berhasil menghapus data pengguna", async () => {

    // Arrange
    pool.query.mockResolvedValue({
      rowCount: 1,
    });

    const pengguna = new Pengguna(dataPengguna);

    // Act
    const hasil = await pengguna.hapusDataPengguna();

    // Assert
    expect(hasil).toBe(true);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM pengguna"),
      [1]
    );
  });
});

// =====================================
// TC07 - HAPUS AKUN
// =====================================

describe("Pengguna.hapusAkun", () => {

  test("C16-UT07 - Berhasil menghapus akun pengguna", async () => {

    // Arrange
    pool.query.mockResolvedValue({
      rowCount: 1,
    });

    const pengguna = new Pengguna(dataPengguna);

    // Spy untuk memastikan method delegasi dipanggil
    const spyHapus = jest.spyOn(
      pengguna,
      "hapusDataPengguna"
    );

    // Act
    const hasil = await pengguna.hapusAkun();

    // Assert
    expect(hasil).toBe(true);

    expect(spyHapus).toHaveBeenCalledTimes(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM pengguna"),
      [1]
    );

    spyHapus.mockRestore();
  });
});

// =====================================
// TC08 - GET PENGGUNA BY NIK
// =====================================

describe("Pengguna.getPenggunaByNIK", () => {

  test("C16-UT08 - Berhasil mencari pengguna berdasarkan NIK", async () => {

    // Arrange
    pool.query.mockResolvedValue({
      rows: [dataPengguna],
      rowCount: 1,
    });

    // Act
    const hasil = await Pengguna.getPenggunaByNIK(
      "1234567890123456"
    );

    // Assert
    expect(hasil).toBeInstanceOf(Pengguna);

    expect(hasil.getIdPengguna()).toBe(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM pengguna"),
      ["1234567890123456"]
    );
  });
});



// =====================================
// TC09 - HAPUS AKUN GAGAL
// NEGATIVE
// =====================================

describe("Pengguna.hapusAkun - Negative", () => {

  test("C16-UT09 - Penghapusan akun gagal ketika data tidak ditemukan", async () => {

    // Arrange: database tidak menghapus baris
    pool.query.mockResolvedValue({
      rowCount: 0,
    });

    const pengguna = new Pengguna(dataPengguna);

    // Act
    const hasil = await pengguna.hapusAkun();

    // Assert
    expect(hasil).toBe(false);

    expect(pool.query).toHaveBeenCalledTimes(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM pengguna"),
      [1]
    );
  });

});
