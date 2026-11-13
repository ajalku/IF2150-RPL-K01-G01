const Laporan = require("../models/Laporan");
const Upvote = require("../models/Upvote");

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// C19 - UpvoteController
class UpvoteController {
    // Algo-042
    static async sudahUpvote(idPengguna, idLaporan) {
        return Upvote.sudahUpvote(idPengguna, idLaporan);
    }

    // Algo-043. Rute: POST /api/upvote/:idLaporan (idPengguna diambil dari session, bukan dari body)
    static async prosesUpvote(req, res) {
        try {
            const idPengguna = req.session?.idPengguna;
            const role = req.session?.role;
            const { idLaporan } = req.params;

            if (!UUID.test(idLaporan ?? "")) {
                return res.status(400).json({ message: "ID laporan tidak valid." });
            }
            if (role === "admin") {
                return res.status(403).json({ message: "Admin tidak dapat memberikan upvote." });
            }

            // Sekaligus memeriksa laporan ada dan boleh dilihat pengguna ini
            const laporan = await Laporan.getDetailLaporan(idLaporan, { idPengguna, role });
            if (!laporan) {
                return res.status(404).json({ message: "Laporan tidak ditemukan." });
            }
            if (laporan.milikSaya) {
                return res.status(403).json({ message: "Anda tidak dapat mendukung laporan milik sendiri." });
            }

            if (await UpvoteController.sudahUpvote(idPengguna, idLaporan)) {
                return res.status(409).json({ message: "Anda sudah mendukung laporan ini." });
            }

            const berhasil = await Upvote.upvote(idPengguna, idLaporan);
            if (!berhasil) {
                return res.status(409).json({ message: "Anda sudah mendukung laporan ini." });
            }

            const jumlahUpvote = await Laporan.getJumlahUpvote(idLaporan);
            return res.status(201).json({
                message: "Upvote berhasil.",
                sudahUpvote: true,
                jumlahUpvote,
            });
        } catch (err) {
            console.error("Upvote error:", err);
            return res.status(500).json({ message: "Upvote gagal diproses. Coba lagi." });
        }
    }
}

module.exports = UpvoteController;
