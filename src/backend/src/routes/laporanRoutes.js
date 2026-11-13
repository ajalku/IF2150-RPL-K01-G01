const express = require("express");
const LaporanController = require("../controllers/LaporanController");
const TanggapanController = require("../controllers/TanggapanController");
const { requireAuth } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { uploadFoto } = require("../middleware/uploadMiddleware");

const router = express.Router();

// Semua endpoint laporan wajib login
router.use(requireAuth);

router.post("/", uploadFoto, LaporanController.buat);
router.get("/", LaporanController.daftar);
router.get("/ringkasan", LaporanController.ringkasan);
router.get("/saya", LaporanController.saya);              // harus di atas "/:idLaporan"
router.get("/ditangani", authorizeRoles("admin"), LaporanController.ditangani);
router.get("/:idLaporan", LaporanController.detail);
router.get("/:idLaporan/foto", LaporanController.foto);

router.post("/:idLaporan/tanggapan", authorizeRoles("admin"), TanggapanController.simpan);
router.patch("/:idLaporan/status", authorizeRoles("admin"), LaporanController.updateStatus);
router.patch("/:idLaporan/pemeriksaan", authorizeRoles("admin"), LaporanController.periksa);
router.post("/:idLaporan/konfirmasi-ulang", LaporanController.konfirmasiUlang);
router.delete("/:idLaporan", LaporanController.hapus);

module.exports = router;
