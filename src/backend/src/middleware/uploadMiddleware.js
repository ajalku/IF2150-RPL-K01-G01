const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Foto disimpan di Local File System: <root proyek>/uploads/laporan/
const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads");
const UPLOAD_DIR = path.join(UPLOAD_ROOT, "laporan");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const UKURAN_MAKS_MB = 5;
const EKSTENSI = { "image/jpeg": ".jpg", "image/png": ".png" };

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, UPLOAD_DIR),
        // Nama file dibuat acak oleh server; nama dari pengguna tidak dipakai
        filename: (req, file, cb) => cb(null, crypto.randomUUID() + EKSTENSI[file.mimetype]),
    }),
    limits: { fileSize: UKURAN_MAKS_MB * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        if (!EKSTENSI[file.mimetype]) {
            const err = new Error("Format foto harus JPG, JPEG, atau PNG");
            err.code = "FORMAT_FOTO";
            return cb(err);
        }
        cb(null, true);
    },
});

// Field form bernama "foto". Error upload diubah menjadi respons 400 yang ramah.
function uploadFoto(req, res, next) {
    upload.single("foto")(req, res, err => {
        if (!err) return next();
        if (err.code === "FORMAT_FOTO") {
            return res.status(400).json({ message: err.message });
        }
        if (err instanceof multer.MulterError) {
            const message = err.code === "LIMIT_FILE_SIZE"
                ? `Ukuran foto maksimal ${UKURAN_MAKS_MB} MB`
                : "Upload foto gagal";
            return res.status(400).json({ message });
        }
        return next(err);
    });
}

async function hapusFileFoto(namaFile) {
    if (!namaFile) return;
    try {
        await fs.promises.unlink(path.join(UPLOAD_DIR, path.basename(namaFile)));
    } catch (err) {
        if (err.code !== "ENOENT") console.error("Gagal menghapus file foto:", err.message);
    }
}

module.exports = { uploadFoto, hapusFileFoto, UPLOAD_ROOT, UPLOAD_DIR };
