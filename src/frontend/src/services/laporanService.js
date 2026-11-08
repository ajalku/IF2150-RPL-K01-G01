import { request, jsonBody } from "./apiClient.js";

export function daftarLaporan(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([kunci, nilai]) => {
    if (nilai !== undefined && nilai !== "") query.set(kunci, nilai);
  });
  return request(`/api/laporan?${query}`);
}

export const laporanSaya = () => request("/api/laporan/saya");
export const detailLaporan = (id) => request(`/api/laporan/${id}`);

// FormData: jangan set Content-Type manual, browser mengisi boundary-nya sendiri
export const buatLaporan = (formData) => request("/api/laporan", { method: "POST", body: formData });

export const periksaLaporan = (id, valid, catatan) =>
  request(`/api/laporan/${id}/pemeriksaan`, jsonBody("PATCH", { valid, catatan }));

export const ubahStatusLaporan = (id, statusLaporan) =>
  request(`/api/laporan/${id}/status`, jsonBody("PATCH", { statusLaporan }));

export const konfirmasiUlang = (id) =>
  request(`/api/laporan/${id}/konfirmasi-ulang`, { method: "POST" });

export const hapusLaporan = (id) => request(`/api/laporan/${id}`, { method: "DELETE" });
