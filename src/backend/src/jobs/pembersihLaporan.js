const Laporan = require("../models/Laporan");
const { hapusFileFoto } = require("../middleware/uploadMiddleware");

// Menghapus laporan TIDAK_VALID yang batas waktu 2 minggunya sudah lewat
// (beserta file fotonya), lalu mengulang tiap `intervalMs`.
async function bersihkan() {
    const daftarFoto = await Laporan.hapusSemuaKadaluarsa();
    await Promise.all(daftarFoto.map(hapusFileFoto));
}

function mulaiPembersihLaporan(intervalMs = 60 * 60 * 1000) {
    const jalankan = () => bersihkan().catch(err =>
        console.error("Pembersihan laporan kedaluwarsa gagal:", err.message));

    jalankan();
    const timer = setInterval(jalankan, intervalMs);
    timer.unref(); // jangan menahan proses saat server dimatikan
}

module.exports = { mulaiPembersihLaporan, bersihkan };
