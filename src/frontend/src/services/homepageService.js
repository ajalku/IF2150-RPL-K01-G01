import { request } from "./apiClient.js";

// GET /api/homepage — daftar laporan + penanda sudahUpvote/bisaUpvote untuk pengguna yang login
export function muatHomepage(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([kunci, nilai]) => {
    if (nilai !== undefined && nilai !== "") query.set(kunci, nilai);
  });
  return request(`/api/homepage?${query}`);
}
