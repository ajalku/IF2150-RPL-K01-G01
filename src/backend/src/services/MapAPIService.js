const MapAPI = require("../config/mapApi");

// Kelas MapAPIService (C23): mengatur request ke API peta dan memproses responsenya.
class MapAPIService {
    // Alamat -> koordinat.
    //  - mengembalikan { latitude, longitude, alamat } jika ditemukan
    //  - mengembalikan null jika alamat tidak ditemukan
    //  - melempar error jika layanan tidak bisa dihubungi (timeout / HTTP error)
    static async geocode(alamat) {
        const url = new URL("/search", MapAPI.baseURL);
        const params = {
            q: alamat,
            format: "jsonv2",
            limit: "1",
            countrycodes: MapAPI.negara,
        };
        if (MapAPI.apiKey) params.key = MapAPI.apiKey;
        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url, {
            headers: { "User-Agent": MapAPI.userAgent, Accept: "application/json" },
            signal: AbortSignal.timeout(MapAPI.timeoutMs),
        });
        if (!response.ok) {
            throw new Error(`Layanan geocoding membalas HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) return null;

        const latitude = Number(data[0].lat);
        const longitude = Number(data[0].lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

        return { latitude, longitude, alamat: data[0].display_name ?? alamat };
    }
}

module.exports = MapAPIService;
