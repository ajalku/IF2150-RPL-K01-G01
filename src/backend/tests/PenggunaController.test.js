
/**
 * Unit Testing PenggunaController
 * Framework: Jest
 * Jumlah: 24 Test Cases
 * Kategori: Mendalam
 *
 * 8 public methods x 3 test cases:
 * - Normal
 * - Boundary
 * - Negative
 */

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../src/models/Pengguna", () => jest.fn());

const bcrypt = require("bcrypt");
const Pengguna = require("../src/models/Pengguna");
const PenggunaController = require("../src/controllers/PenggunaController");

// =========================================
// DATA DUMMY
// =========================================

const validData = {
  nama: "Samantha",
  nik: "1234567890123456",
  email: "samantha@example.com",
  password: "Password1!",
  noTelp: "081234567890",
};

const profile = {
  idPengguna: 1,
  nama: "Samantha",
  noTelp: "081234567890",
};

// =========================================
// HELPER MOCK
// =========================================

// Mock response Express
function response() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);

  return res;
}

// Mock session Express
function session(idPengguna = 1) {
  return {
    idPengguna,
    role: "warga",

    regenerate: jest.fn(cb => cb(null)),
    save: jest.fn(cb => cb(null)),
    destroy: jest.fn(cb => cb(null)),
  };
}

// Mock objek pengguna
function user({
  role = "warga",
  hash = "stored-hash",
  id = 1,
} = {}) {
  return {
    getIdPengguna: jest.fn().mockReturnValue(id),
    getRole: jest.fn().mockReturnValue(role),
    getHashPassword: jest.fn().mockReturnValue(hash),

    getNama: jest.fn().mockReturnValue("Samantha"),
    getEmail: jest.fn().mockReturnValue(validData.email),
    getNoTelp: jest.fn().mockReturnValue(validData.noTelp),

    hapusDataPengguna: jest.fn().mockResolvedValue(true),
  };
}

// =========================================
// SETUP SEBELUM SETIAP TEST
// =========================================

beforeEach(() => {
  jest.resetAllMocks();

  Pengguna.getPenggunaByEmail = jest.fn().mockResolvedValue(null);
  Pengguna.getPenggunaByNIK = jest.fn().mockResolvedValue(null);
  Pengguna.getPenggunaById = jest.fn().mockResolvedValue(null);

  Pengguna.getProfilPenggunaById = jest
    .fn()
    .mockResolvedValue(null);

  Pengguna.updateDataPengguna = jest
    .fn()
    .mockResolvedValue(true);

  Pengguna.mockImplementation(() => ({
    simpanDataPengguna: jest.fn().mockResolvedValue(1),
  }));

  bcrypt.hash.mockResolvedValue("new-hash");
  bcrypt.compare.mockResolvedValue(false);

  // Mencegah pesan error yang sengaja diuji
  // memenuhi output terminal
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// =========================================
// 1. REGISTER
// TC01 - TC03
// =========================================

describe("PenggunaController.register", () => {

  // TC01: NORMAL
  test("TC01 - Registrasi berhasil dengan data valid", async () => {
    const req = {
      body: { ...validData },
    };
    const res = response();

    await PenggunaController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({
      message: "Registration Succeeded",
      idPengguna: 1,
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(
      validData.password,
      12
    );

    expect(Pengguna.getPenggunaByEmail)
      .toHaveBeenCalledWith(validData.email);

    expect(Pengguna.getPenggunaByNIK)
      .toHaveBeenCalledWith(validData.nik);
  });

  // TC02: BOUNDARY
  test("TC02 - Password tepat 8 karakter diterima", async () => {
    const req = {
      body: {
        ...validData,
        password: "Abcdef1!",
      },
    };
    const res = response();

    await PenggunaController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(bcrypt.hash).toHaveBeenCalledWith(
      "Abcdef1!",
      12
    );
  });

  // TC03: NEGATIVE
  test("TC03 - NIK tidak valid ditolak", async () => {
    const req = {
      body: {
        ...validData,
        nik: "12345",
      },
    };
    const res = response();

    await PenggunaController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "NIK tidak valid",
    });

    expect(Pengguna).not.toHaveBeenCalled();
  });
});

// =========================================
// 2. LOGIN
// TC04 - TC06
// =========================================

describe("PenggunaController.login", () => {

  // TC04: NORMAL
  test("TC04 - Login berhasil dengan kredensial valid", async () => {
    const account = user();

    Pengguna.getPenggunaByEmail.mockResolvedValue(account);
    bcrypt.compare.mockResolvedValue(true);

    const req = {
      body: {
        email: validData.email,
        password: validData.password,
      },
      session: session(),
    };
    const res = response();

    await PenggunaController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "Login succeeded.",
      role: "warga",
    });

    expect(req.session.regenerate).toHaveBeenCalledTimes(1);
    expect(req.session.save).toHaveBeenCalledTimes(1);

    expect(req.session.idPengguna).toBe(1);
    expect(req.session.role).toBe("warga");
  });

  // TC05: BOUNDARY
  test("TC05 - Email hanya spasi ditolak", async () => {
    const req = {
      body: {
        email: "   ",
        password: validData.password,
      },
    };
    const res = response();

    await PenggunaController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Email and password are required.",
    });

    expect(Pengguna.getPenggunaByEmail)
      .not.toHaveBeenCalled();
  });

  // TC06: NEGATIVE
  test("TC06 - Login dengan password salah ditolak", async () => {
    Pengguna.getPenggunaByEmail.mockResolvedValue(user());
    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: {
        email: validData.email,
        password: "WrongPass1!",
      },
      session: session(),
    };
    const res = response();

    await PenggunaController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      message: "Wrong Email or Password",
    });

    expect(req.session.regenerate).not.toHaveBeenCalled();
  });
});

// =========================================
// 3. GET PROFILE
// TC07 - TC09
// =========================================

describe("PenggunaController.getProfile", () => {

  // TC07: NORMAL
  test("TC07 - Berhasil mengambil profil pengguna", async () => {
    Pengguna.getProfilPenggunaById.mockResolvedValue(profile);

    const req = {
      session: session(1),
    };
    const res = response();

    await PenggunaController.getProfile(req, res);

    expect(Pengguna.getProfilPenggunaById)
      .toHaveBeenCalledWith(1);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      pengguna: profile,
    });
  });

  // TC08: BOUNDARY
  test("TC08 - Session tanpa ID pengguna menghasilkan 404", async () => {
    const req = {
      session: {},
    };
    const res = response();

    await PenggunaController.getProfile(req, res);

    expect(Pengguna.getProfilPenggunaById)
      .toHaveBeenCalledWith(undefined);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      message: "User not found.",
    });
  });

  // TC09: NEGATIVE
  test("TC09 - Kegagalan database menghasilkan 500", async () => {
    Pengguna.getProfilPenggunaById.mockRejectedValue(
      new Error("Database unavailable")
    );

    const req = {
      session: session(),
    };
    const res = response();

    await PenggunaController.getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong",
    });
  });
});

// =========================================
// 4. UBAH PROFIL
// TC10 - TC12
// =========================================

describe("PenggunaController.ubahProfil", () => {

  // TC10: NORMAL
  test("TC10 - Berhasil memperbarui nama dan nomor telepon", async () => {
    const updatedProfile = {
      ...profile,
      nama: "Nama Baru",
    };

    Pengguna.getProfilPenggunaById.mockResolvedValue(
      updatedProfile
    );

    const req = {
      session: session(),
      body: {
        nama: "  Nama Baru  ",
        noTelp: "081234567890",
      },
    };
    const res = response();

    await PenggunaController.ubahProfil(req, res);

    expect(Pengguna.updateDataPengguna)
      .toHaveBeenCalledWith(1, {
        nama: "Nama Baru",
        noTelp: "081234567890",
      });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "Profile updated successfully.",
      pengguna: updatedProfile,
    });
  });

  // TC11: BOUNDARY
  test("TC11 - Nama tepat 100 karakter diterima", async () => {
    const nama = "A".repeat(100);

    Pengguna.getProfilPenggunaById.mockResolvedValue({
      ...profile,
      nama,
    });

    const req = {
      session: session(),
      body: {
        nama,
      },
    };
    const res = response();

    await PenggunaController.ubahProfil(req, res);

    expect(Pengguna.updateDataPengguna)
      .toHaveBeenCalledWith(1, { nama });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // TC12: NEGATIVE
  test("TC12 - Perubahan field role ditolak", async () => {
    const req = {
      session: session(),
      body: {
        role: "admin",
      },
    };
    const res = response();

    await PenggunaController.ubahProfil(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: "Protected profile fields cannot be changed.",
    });

    expect(Pengguna.updateDataPengguna)
      .not.toHaveBeenCalled();
  });
});

// =========================================
// 5. CHANGE PASSWORD
// TC13 - TC15
// =========================================

describe("PenggunaController.changePassword", () => {

  const passwordBody = {
    currentPassword: "OldPass1!",
    newPassword: "NewPass1!",
    confirmPassword: "NewPass1!",
  };

  function correctOldDifferentNew() {
    Pengguna.getPenggunaById.mockResolvedValue(user());

    bcrypt.compare
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
  }

  // TC13: NORMAL
  test("TC13 - Berhasil mengganti password", async () => {
    correctOldDifferentNew();

    const req = {
      body: { ...passwordBody },
      session: session(),
    };
    const res = response();

    await PenggunaController.changePassword(req, res);

    expect(bcrypt.compare).toHaveBeenNthCalledWith(
      1,
      "OldPass1!",
      "stored-hash"
    );

    expect(bcrypt.compare).toHaveBeenNthCalledWith(
      2,
      "NewPass1!",
      "stored-hash"
    );

    expect(bcrypt.hash).toHaveBeenCalledWith(
      "NewPass1!",
      12
    );

    expect(Pengguna.updateDataPengguna)
      .toHaveBeenCalledWith(1, {
        hashPassword: "new-hash",
      });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "Password updated successfully.",
    });
  });

  // TC14: BOUNDARY
  test("TC14 - Password baru tepat 8 karakter diterima", async () => {
    correctOldDifferentNew();

    const req = {
      body: {
        ...passwordBody,
        newPassword: "Abcdef1!",
        confirmPassword: "Abcdef1!",
      },
      session: session(),
    };
    const res = response();

    await PenggunaController.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(bcrypt.hash).toHaveBeenCalledWith(
      "Abcdef1!",
      12
    );
  });

  // TC15: NEGATIVE
  test("TC15 - Password lama salah ditolak", async () => {
    Pengguna.getPenggunaById.mockResolvedValue(user());
    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: { ...passwordBody },
      session: session(),
    };
    const res = response();

    await PenggunaController.changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      message: "Current password is incorrect.",
    });

    expect(Pengguna.updateDataPengguna)
      .not.toHaveBeenCalled();
  });
});

// =========================================
// 6. HAPUS AKUN
// TC16 - TC18
// =========================================

describe("PenggunaController.hapusAkun", () => {

  // TC16: NORMAL
  test("TC16 - Warga berhasil menghapus akun", async () => {
    const account = user({
      role: "warga",
    });

    Pengguna.getPenggunaById.mockResolvedValue(account);

    const req = {
      session: session(1),
    };
    const res = response();

    await PenggunaController.hapusAkun(req, res);

    expect(account.hapusDataPengguna)
      .toHaveBeenCalledTimes(1);

    expect(req.session.destroy)
      .toHaveBeenCalledTimes(1);

    expect(res.clearCookie)
      .toHaveBeenCalledWith("rawat.sid");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "Akun berhasil dihapus.",
    });
  });

  // TC17: BOUNDARY
  test("TC17 - Hapus akun tanpa ID session ditolak", async () => {
    const req = {
      session: {},
    };
    const res = response();

    await PenggunaController.hapusAkun(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      message: "Please log in to continue.",
    });

    expect(Pengguna.getPenggunaById)
      .not.toHaveBeenCalled();
  });

  // TC18: NEGATIVE
  test("TC18 - Admin tidak boleh menghapus akun", async () => {
    Pengguna.getPenggunaById.mockResolvedValue(
      user({ role: "admin" })
    );

    const req = {
      session: session(),
    };
    const res = response();

    await PenggunaController.hapusAkun(req, res);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      message: "Hanya warga yang dapat menghapus akun.",
    });
  });
});

// =========================================
// 7. ME (CURRENT USER)
// TC19 - TC21
// =========================================

describe("PenggunaController.me", () => {

  // TC19: NORMAL
  test("TC19 - Berhasil mendapatkan pengguna yang login", async () => {
    Pengguna.getPenggunaById.mockResolvedValue(user());

    const req = {
      session: session(1),
    };
    const res = response();

    await PenggunaController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      pengguna: {
        idPengguna: 1,
        nama: "Samantha",
        email: validData.email,
        noTelp: validData.noTelp,
        role: "warga",
      },
    });
  });

  // TC20: BOUNDARY
  test("TC20 - Akun tidak ditemukan, session dihapus", async () => {
    Pengguna.getPenggunaById.mockResolvedValue(null);

    const req = {
      session: session(1),
    };
    const res = response();

    await PenggunaController.me(req, res);

    expect(req.session.destroy)
      .toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      message: "Please log in to continue.",
    });
  });

  // TC21: NEGATIVE
  test("TC21 - Kegagalan mengambil pengguna menghasilkan 500", async () => {
    Pengguna.getPenggunaById.mockRejectedValue(
      new Error("DB error")
    );

    const req = {
      session: session(1),
    };
    const res = response();

    await PenggunaController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong",
    });
  });
});

// =========================================
// 8. LOGOUT
// TC22 - TC24
// =========================================

describe("PenggunaController.logout", () => {

  // TC22: NORMAL
  test("TC22 - Logout berhasil", () => {
    const req = {
      session: session(1),
    };
    const res = response();

    PenggunaController.logout(req, res);

    expect(req.session.destroy)
      .toHaveBeenCalledTimes(1);

    expect(res.clearCookie)
      .toHaveBeenCalledWith("rawat.sid");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "Logout succeeded.",
    });
  });

  // TC23: BOUNDARY
  test("TC23 - Logout tanpa ID pengguna tetap berhasil", () => {
    const req = {
      session: session(),
    };

    delete req.session.idPengguna;

    const res = response();

    PenggunaController.logout(req, res);

    expect(req.session.destroy)
      .toHaveBeenCalledTimes(1);

    expect(res.clearCookie)
      .toHaveBeenCalledWith("rawat.sid");

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // TC24: NEGATIVE
  test("TC24 - Kegagalan destroy session menghasilkan 500", () => {
    const req = {
      session: session(1),
    };

    req.session.destroy.mockImplementation(cb => {
      cb(new Error("session store error"));
    });

    const res = response();

    PenggunaController.logout(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong",
    });

    expect(res.clearCookie).not.toHaveBeenCalled();
  });
});
