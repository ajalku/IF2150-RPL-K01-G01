import { jsonBody, request } from "./apiClient.js";

// C13 - Mengirim hasil pemeriksaan, tanggapan, dan status dalam satu permintaan.
export const simpanHasilTanggapan = (idLaporan, data) =>
  request(`/api/laporan/${idLaporan}/tanggapan`, jsonBody("POST", data));
