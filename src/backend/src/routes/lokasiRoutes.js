const express = require("express");
const LokasiController = require("../controllers/LokasiController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/geocode", LokasiController.ambilLokasiLaporan);
router.get("/terdekat", LokasiController.cariLaporanTerdekat);

module.exports = router;
