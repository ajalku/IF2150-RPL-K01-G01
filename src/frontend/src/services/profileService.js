import { request, jsonBody } from "./apiClient.js";

export const getProfil = () => request("/api/profile");

export const perbaruiProfil = (data) =>
  request("/api/profile", jsonBody("PUT", data));

export const ubahKataSandi = (data) =>
  request("/api/profile/password", jsonBody("PUT", data));

export const hapusAkun = () =>
  request("/api/profile", { method: "DELETE" });
