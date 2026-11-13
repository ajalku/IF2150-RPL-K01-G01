
export async function login(email, passwordInput) {
  let response;
  try {
    response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password: passwordInput }),
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Periksa backend Express.");
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || body.error || "Login gagal. Coba lagi.");
  }
  return body;
}


export async function register(data) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      result.message || result.error || "Registrasi gagal."
    );
    error.status = response.status;
    throw error;
  }

  return result;
}


// Mengambil data pengguna dari sesi aktif. Mengembalikan null jika belum login.
export async function getSesi() {
  let response;
  try {
    response = await fetch("/api/auth/me", { credentials: "include" });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Periksa backend Express.");
  }
  if (response.status === 401) return null;

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Gagal memeriksa sesi login.");
  return body.pengguna;
}

export async function logout() {
  const response = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("Gagal keluar dari akun.");
}
