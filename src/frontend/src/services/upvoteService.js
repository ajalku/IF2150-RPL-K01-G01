import { request } from "./apiClient.js";

// POST /api/upvote/:idLaporan — id pengguna diambil server dari sesi
export const upvote = (idLaporan) =>
  request(`/api/upvote/${encodeURIComponent(idLaporan)}`, { method: "POST" });
