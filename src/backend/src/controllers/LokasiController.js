const Laporan = require("../models/Laporan");
const Lokasi = require("../models/Lokasi");
const MapAPIService = require("../services/MapAPIService");

const RADIUS_DEFAULT_KM = 5;
const RADIUS_MAKS_KM = 50;
const KM_PER_DERAJAT = 111.32;

const keRadian = derajat => derajat * Math.PI / 180;

class LokasiController {
    // Rumus Haversine (Algo-040). Hasil dalam kilometer.
    static #hitungJarak(a, b) {
        const lat1 = keRadian(a.latitude);
        const lat2 = keRadian(b.latitude);
        const deltaLat = lat2 - lat1;
        const deltaLon = keRadian(b.longitude - a.longitude);

        const h = Math.sin(deltaLat / 2) ** 2
                + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
        return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    }

    // Lokasi pengguna dikirim oleh browser (Geolocation API) lewat query string:
    // ?latitude=-6.9&longitude=107.6   -> null jika tidak ada / tidak valid
    static #ambilLokasiPengguna(req) {
        const lokasi = Lokasi.dariInput(req.query?.latitude, req.query?.longitude);
        return lokasi ? lokasi.getKoordinat() : null;
    }

    // GET /api/lokasi/geocode?alamat=Jl. Asia Afrika Bandung   (Algo-039)
    static async ambilLokasiLaporan(req, res) {
        try {
            const alamat = typeof req.query?.alamat === "string" ? req.query.alamat.trim() : "";
            if (alamat === "") {
                return res.status(400).json({ message: "Alamat wajib diisi" });
            }
            const hasil = await MapAPIService.geocode(alamat);
            if (hasil === null) {
                return res.status(404).json({ message: "Alamat tidak ditemukan" });
            }
            return res.status(200).json(hasil);
        } catch (err) {
            console.error("Geocode error:", err.message);
            return res.status(502).json({ message: "Layanan peta tidak dapat dihubungi" });
        }
    }

    // GET /api/lokasi/terdekat?latitude=&longitude=&radius=5   (Algo-041, UC03)
    static async cariLaporanTerdekat(req, res) {
        try {
            const lokasiPengguna = LokasiController.#ambilLokasiPengguna(req);
            if (lokasiPengguna === null) {
                return res.status(400).json({
                    message: "Lokasi pengguna belum tersedia. Aktifkan izin lokasi atau kirim latitude & longitude yang valid.",
                });
            }

            const radius = req.query.radius === undefined ? RADIUS_DEFAULT_KM : Number(req.query.radius);
            if (!Number.isFinite(radius) || radius <= 0 || radius > RADIUS_MAKS_KM) {
                return res.status(400).json({ message: `Radius harus antara 0 dan ${RADIUS_MAKS_KM} km` });
            }

            // Saring kasar dengan kotak koordinat di SQL, supaya tidak memuat seluruh tabel
            const dLat = radius / KM_PER_DERAJAT;
            const dLon = radius / (KM_PER_DERAJAT * Math.max(Math.cos(keRadian(lokasiPengguna.latitude)), 0.01));
            const kandidat = await Laporan.getDaftarLaporan(
                { idPengguna: req.session.idPengguna, role: req.session.role },
                {
                    limit: null,
                    bbox: {
                        minLat: lokasiPengguna.latitude - dLat,
                        maxLat: lokasiPengguna.latitude + dLat,
                        minLon: lokasiPengguna.longitude - dLon,
                        maxLon: lokasiPengguna.longitude + dLon,
                    },
                }
            );

            // Jarak sebenarnya (Haversine), buang yang di luar radius, urutkan terdekat dulu
            const laporan = kandidat
                .map(l => ({ ...l, jarakKm: Number(LokasiController.#hitungJarak(lokasiPengguna, l.lokasi).toFixed(3)) }))
                .filter(l => l.jarakKm <= radius)
                .sort((a, b) => a.jarakKm - b.jarakKm);

            return res.status(200).json({ lokasiPengguna, radiusKm: radius, laporan });
        } catch (err) {
            console.error("Laporan terdekat error:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
}

module.exports = LokasiController;
