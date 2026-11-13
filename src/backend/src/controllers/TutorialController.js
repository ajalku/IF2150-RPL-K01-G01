const Tutorial = require("../models/Tutorial");

// C21 - TutorialController
// nextTutorial() tidak ada di server: langkah saatIni dipegang TutorialView (client),
// jadi "Lanjut" cukup diproses di browser tanpa permintaan jaringan.
class TutorialController {
    // Algo-047. Rute: GET /api/tutorial
    // Selalu mengembalikan isi langkah supaya tombol "Mulai Tutorial" bisa dipakai ulang.
    static async startTutorial(req, res) {
        try {
            const sudahLihat = await Tutorial.sudahLihat(req.session.idPengguna);
            const langkah = Tutorial.getDaftarLangkah();
            return res.status(200).json({
                sudahLihat,
                langkahSaatIni: 1,
                totalLangkah: new Tutorial().getTotalLangkah(),
                langkah,
            });
        } catch (err) {
            console.error("Tutorial start error:", err);
            return res.status(500).json({ message: "Tutorial gagal dimuat." });
        }
    }

    // Algo-049. Rute: POST /api/tutorial/skip
    // Menyimpan status juga (menyimpang dari DPPL) agar tutorial tidak muncul lagi setiap login.
    static async skipTutorial(req, res) {
        try {
            await Tutorial.tandaiSudahLihat(req.session.idPengguna);
            return res.status(200).json({ message: "Tutorial dilewati." });
        } catch (err) {
            console.error("Tutorial skip error:", err);
            return res.status(500).json({ message: "Tutorial gagal ditutup." });
        }
    }

    // Algo-050. Rute: POST /api/tutorial/selesai  body: { langkahSaatIni }
    static async finishTutorial(req, res) {
        try {
            const { langkahSaatIni } = req.body ?? {};
            const total = new Tutorial().getTotalLangkah();
            if (langkahSaatIni !== total) {
                return res.status(400).json({ message: "Tutorial belum sampai langkah terakhir." });
            }
            const tersimpan = await Tutorial.tandaiSudahLihat(req.session.idPengguna);
            if (!tersimpan) {
                return res.status(500).json({ message: "Status tutorial gagal disimpan." });
            }
            return res.status(200).json({ message: "Tutorial selesai." });
        } catch (err) {
            console.error("Tutorial finish error:", err);
            return res.status(500).json({ message: "Status tutorial gagal disimpan." });
        }
    }
}

module.exports = TutorialController;
