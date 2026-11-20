
/**
 * Component Testing PenggunaView
 * Framework: Vitest + React Testing Library
 * Kelas: C17
 * Total: 8 Test Cases
 */

import React from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

import {
  render,
  fireEvent,
  waitFor,
  cleanup,
  within,
} from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

// =====================================
// MOCK SERVICES
// =====================================

vi.mock("../src/services/authService.js", () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock("../src/services/profileService.js", () => ({
  hapusAkun: vi.fn(),
}));

// Mock ProfilView
vi.mock("../src/view/ProfilView.jsx", () => ({
  default: ({ onHapusAkun }) => (
    <div>
      <h2>Profil Pengguna</h2>
      <button onClick={onHapusAkun}>
        Hapus Akun
      </button>
    </div>
  ),
}));

// Mock DialogKonfirmasi
vi.mock("../src/components/DialogKonfirmasi.jsx", () => ({
  default: ({
    onYa,
    onBatal,
    pesanError,
    sibuk,
  }) => (
    <div data-testid="dialog-konfirmasi">
      <p>Konfirmasi Hapus Akun</p>

      {pesanError && (
        <p role="alert">{pesanError}</p>
      )}

      <button
        type="button"
        onClick={onYa}
        disabled={sibuk}
      >
        Ya, Hapus Akun
      </button>

      <button
        type="button"
        onClick={onBatal}
      >
        Batal
      </button>
    </div>
  ),
}));

// =====================================
// IMPORT
// =====================================

import PenggunaView from "../src/view/PenggunaView.jsx";

import {
  login as requestLogin,
  register as requestRegister,
} from "../src/services/authService.js";

import {
  hapusAkun as requestHapusAkun,
} from "../src/services/profileService.js";

// =====================================
// SETUP
// =====================================

beforeEach(() => {
  cleanup();
  vi.resetAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// =====================================
// HELPERS
// =====================================

const dataValid = {
  nama: "Samantha",
  nik: "1234567890123456",
  email: "samantha@example.com",
  noTelp: "081234567890",
  password: "Password1!",
  konfirmasiPassword: "Password1!",
};

const sesiValid = {
  idPengguna: 1,
  role: "warga",
};

// Isi formulir registrasi
function isiRegistrasi(container, data) {
  for (const [name, value] of Object.entries(data)) {
    const input = container.querySelector(
      `[name="${name}"]`
    );

    expect(input).not.toBeNull();

    fireEvent.change(input, {
      target: { value },
    });
  }
}

// Isi formulir login
function isiLogin(container, email, password) {
  const emailInput = container.querySelector(
    "#login-email"
  );

  const passwordInput = container.querySelector(
    "#login-password"
  );

  expect(emailInput).not.toBeNull();
  expect(passwordInput).not.toBeNull();

  fireEvent.change(emailInput, {
    target: { value: email },
  });

  fireEvent.change(passwordInput, {
    target: { value: password },
  });
}

// Render halaman registrasi
function bukaRegistrasi() {
  const hasilRender = render(<PenggunaView />);

  const ui = within(hasilRender.container);

  fireEvent.click(
    ui.getByRole("button", {
      name: /daftar sekarang/i,
    })
  );

  return hasilRender;
}

// Render profil
function bukaProfil(props = {}) {
  const hasilRender = render(
    <PenggunaView
      mode="profil"
      sesi={sesiValid}
      {...props}
    />
  );

  return hasilRender;
}

// Buka dialog hapus akun
function bukaDialogHapus(container) {
  const ui = within(container);

  fireEvent.click(
    ui.getByRole("button", {
      name: /^hapus akun$/i,
    })
  );

  return ui.getByTestId("dialog-konfirmasi");
}

// =====================================
// TC01 - REGISTER NEGATIVE
// =====================================

describe("PenggunaView.handleRegister", () => {

  it("C17-UT01 - Menolak NIK tidak valid", () => {
    const { container } = bukaRegistrasi();
    const ui = within(container);

    isiRegistrasi(container, {
      ...dataValid,
      nik: "12345",
    });

    const tombol = ui.getByRole("button", {
      name: /^daftar$/i,
    });

    fireEvent.submit(tombol.closest("form"));

    expect(
      ui.getByText(
        "NIK harus terdiri dari 16 digit angka."
      )
    ).toBeInTheDocument();

    expect(requestRegister).not.toHaveBeenCalled();
  });

  // =====================================
  // TC04 - REGISTER NORMAL
  // =====================================

  it("C17-UT04 - Registrasi berhasil", async () => {
    requestRegister.mockResolvedValue({
      message: "Registration Succeeded",
      idPengguna: 1,
    });

    const { container } = bukaRegistrasi();
    const ui = within(container);

    isiRegistrasi(container, dataValid);

    const tombol = ui.getByRole("button", {
      name: /^daftar$/i,
    });

    fireEvent.submit(tombol.closest("form"));

    await waitFor(() => {
      expect(requestRegister).toHaveBeenCalledWith({
        nama: "Samantha",
        nik: "1234567890123456",
        email: "samantha@example.com",
        password: "Password1!",
        noTelp: "081234567890",
      });
    });

    await waitFor(() => {
      expect(
        ui.getByText(
          /registrasi berhasil! silakan masuk/i
        )
      ).toBeInTheDocument();
    });

    expect(
      container.querySelector("#login-email")
    ).toHaveValue("samantha@example.com");
  });

});

// =====================================
// TC02 & TC05 - LOGIN
// =====================================

describe("PenggunaView.handleLogin", () => {

  // TC02 - NORMAL
  it("C17-UT02 - Login berhasil", async () => {
    const hasilLogin = {
      message: "Login succeeded.",
      role: "warga",
    };

    requestLogin.mockResolvedValue(hasilLogin);

    const onLoginSuccess = vi.fn();

    const { container } = render(
      <PenggunaView
        onLoginSuccess={onLoginSuccess}
      />
    );

    const ui = within(container);

    isiLogin(
      container,
      "samantha@example.com",
      "Password1!"
    );

    const tombol = ui.getByRole("button", {
      name: /^masuk$/i,
    });

    fireEvent.submit(tombol.closest("form"));

    await waitFor(() => {
      expect(requestLogin).toHaveBeenCalledWith(
        "samantha@example.com",
        "Password1!"
      );
    });

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledWith(
        hasilLogin
      );
    });

    expect(
      ui.getByText(
        "Login berhasil. Anda sudah masuk ke RAWAT."
      )
    ).toBeInTheDocument();

    expect(
      container.querySelector("#login-password")
    ).toHaveValue("");
  });

  // TC05 - NEGATIVE
  it("C17-UT05 - Login gagal", async () => {
    requestLogin.mockRejectedValue(
      new Error("Email atau password salah")
    );

    const onLoginSuccess = vi.fn();

    const { container } = render(
      <PenggunaView
        onLoginSuccess={onLoginSuccess}
      />
    );

    const ui = within(container);

    isiLogin(
      container,
      "samantha@example.com",
      "WrongPass1!"
    );

    const tombol = ui.getByRole("button", {
      name: /^masuk$/i,
    });

    fireEvent.submit(tombol.closest("form"));

    await waitFor(() => {
      expect(requestLogin).toHaveBeenCalledWith(
        "samantha@example.com",
        "WrongPass1!"
      );
    });

    await waitFor(() => {
      expect(
        ui.getByText("Email atau password salah")
      ).toBeInTheDocument();
    });

    expect(onLoginSuccess).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(tombol).not.toBeDisabled();
    });
  });

});

// =====================================
// TC03 & TC06 - HAPUS AKUN
// =====================================

describe("PenggunaView.konfirmasiHapusAkun", () => {

  // TC03 - NEGATIVE
  it("C17-UT03 - Hapus akun gagal", async () => {
    requestHapusAkun.mockRejectedValue(
      new Error("Gagal menghapus akun.")
    );

    const onAkunDihapus = vi.fn();

    const { container } = bukaProfil({
      onAkunDihapus,
    });

    bukaDialogHapus(container);

    const ui = within(container);

    const dialog = ui.getByTestId(
      "dialog-konfirmasi"
    );

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: /ya, hapus akun/i,
      })
    );

    await waitFor(() => {
      expect(requestHapusAkun)
        .toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        ui.getByTestId("dialog-konfirmasi")
      ).toHaveTextContent(
        "Gagal menghapus akun."
      );
    });

    expect(
      ui.getByTestId("dialog-konfirmasi")
    ).toBeInTheDocument();

    expect(onAkunDihapus).not.toHaveBeenCalled();
  });

  // TC06 - NORMAL
  it("C17-UT06 - Hapus akun berhasil", async () => {
    requestHapusAkun.mockResolvedValue({
      message: "Akun berhasil dihapus.",
    });

    const onAkunDihapus = vi.fn();

    const { container } = bukaProfil({
      onAkunDihapus,
    });

    const dialog = bukaDialogHapus(container);
    const ui = within(container);

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: /ya, hapus akun/i,
      })
    );

    await waitFor(() => {
      expect(requestHapusAkun)
        .toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(onAkunDihapus).toHaveBeenCalledWith(
        "Akun berhasil dihapus.",
        "success"
      );
    });

    await waitFor(() => {
      expect(
        ui.queryByTestId("dialog-konfirmasi")
      ).not.toBeInTheDocument();
    });
  });

});

// =====================================
// TC07 & TC08 - BATAL HAPUS AKUN
// =====================================

describe("PenggunaView.batalHapusAkun", () => {

  // TC07 - NORMAL
  it("C17-UT07 - Membatalkan hapus akun", async () => {
    const { container } = bukaProfil();
    const ui = within(container);

    const dialog = bukaDialogHapus(container);

    fireEvent.click(
      within(dialog).getByRole("button", {
        name: /^batal$/i,
      })
    );

    await waitFor(() => {
      expect(
        ui.queryByTestId("dialog-konfirmasi")
      ).not.toBeInTheDocument();
    });

    expect(requestHapusAkun).not.toHaveBeenCalled();
  });

  // TC08 - NEGATIVE
  it("C17-UT08 - Tidak bisa batal saat proses hapus berlangsung", async () => {

    let resolveHapus;

    const pendingHapus = new Promise(resolve => {
      resolveHapus = resolve;
    });

    requestHapusAkun.mockReturnValue(pendingHapus);

    const onAkunDihapus = vi.fn();

    const { container } = bukaProfil({
      onAkunDihapus,
    });

    const ui = within(container);

    const dialog = bukaDialogHapus(container);

    // Mulai proses hapus
    fireEvent.click(
      within(dialog).getByRole("button", {
        name: /ya, hapus akun/i,
      })
    );

    await waitFor(() => {
      expect(requestHapusAkun)
        .toHaveBeenCalledTimes(1);
    });

    // Coba batalkan saat request pending
    fireEvent.click(
      within(dialog).getByRole("button", {
        name: /^batal$/i,
      })
    );

    // Dialog harus tetap terbuka
    expect(
      ui.getByTestId("dialog-konfirmasi")
    ).toBeInTheDocument();

    expect(onAkunDihapus).not.toHaveBeenCalled();

    // Selesaikan Promise
    resolveHapus({
      message: "Akun berhasil dihapus.",
    });

    await waitFor(() => {
      expect(onAkunDihapus).toHaveBeenCalledWith(
        "Akun berhasil dihapus.",
        "success"
      );
    });

    await waitFor(() => {
      expect(
        ui.queryByTestId("dialog-konfirmasi")
      ).not.toBeInTheDocument();
    });
  });

});
