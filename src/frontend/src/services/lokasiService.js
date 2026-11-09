import { request } from "./apiClient.js";

export const geocode = (alamat) =>
  request(`/api/lokasi/geocode?${new URLSearchParams({ alamat })}`);

export const laporanTerdekat = (latitude, longitude, radius = 5) =>
  request(`/api/lokasi/terdekat?${new URLSearchParams({ latitude, longitude, radius })}`);
