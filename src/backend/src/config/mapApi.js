// Kelas MapAPI (C22): konfigurasi layanan peta/geocoding eksternal.
// Default memakai Nominatim (OpenStreetMap) yang tidak butuh API key.
module.exports = {
    baseURL: process.env.MAP_API_BASE_URL || "https://nominatim.openstreetmap.org",
    apiKey: process.env.MAP_API_KEY || null,
    // Nominatim mewajibkan User-Agent yang mengidentifikasi aplikasi Anda
    userAgent: process.env.MAP_API_USER_AGENT || "RAWAT-backend/1.0 (isi-email-kontak@contoh.id)",
    negara: process.env.MAP_API_COUNTRY || "id",
    timeoutMs: 5000,
};
