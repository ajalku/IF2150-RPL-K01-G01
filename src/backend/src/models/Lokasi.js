class Lokasi {
    #latitude;
    #longitude;
    #alamat;

    constructor({ latitude, longitude, alamat }) {
        this.#latitude = latitude;
        this.#longitude = longitude;
        this.#alamat = alamat ?? null;
    }

    getKoordinat() {
        return { latitude: this.#latitude, longitude: this.#longitude };
    }

    getAlamat() {
        return this.#alamat;
    }

    // Membuat Lokasi dari input mentah (string dari form / query).
    // Mengembalikan null jika koordinat kosong, bukan angka, atau di luar rentang.
    static dariInput(latitude, longitude, alamat = null) {
        const lat = Lokasi.#keAngka(latitude);
        const lon = Lokasi.#keAngka(longitude);
        if (lat === null || lon === null) return null;
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

        const teksAlamat = typeof alamat === "string" && alamat.trim() !== ""
            ? alamat.trim().slice(0, 500)
            : null;
        return new Lokasi({ latitude: lat, longitude: lon, alamat: teksAlamat });
    }

    static #keAngka(nilai) {
        if (typeof nilai === "number") return Number.isFinite(nilai) ? nilai : null;
        if (typeof nilai !== "string" || nilai.trim() === "") return null;
        const angka = Number(nilai);
        return Number.isFinite(angka) ? angka : null;
    }

    // Dipanggil dari dalam transaksi Laporan.simpan() (memakai client yang sama)
    static async simpan(client, idLaporan, lokasi) {
        const { latitude, longitude } = lokasi.getKoordinat();
        await client.query(
            `INSERT INTO lokasi (id_laporan, latitude, longitude, alamat)
             VALUES ($1, $2, $3, $4)`,
            [idLaporan, latitude, longitude, lokasi.getAlamat()]
        );
    }
}

module.exports = Lokasi;
