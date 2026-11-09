// Pembungkus fetch untuk semua endpoint yang butuh login.
// - credentials: "include" agar cookie sesi (rawat.sid) ikut terkirim
// - 401 -> memberi tahu App lewat event, supaya pengguna dikembalikan ke halaman login
export async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, { credentials: "include", ...options });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Periksa backend Express.");
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event("rawat:sesi-habis"));
    const error = new Error(body.message || body.error || "Terjadi kesalahan. Coba lagi.");
    error.status = response.status;
    throw error;
  }
  return body;
}

export const jsonBody = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
