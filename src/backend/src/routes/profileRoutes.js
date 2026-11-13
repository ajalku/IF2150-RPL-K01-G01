const express = require("express");
const router = express.Router();

const PenggunaController = require("../controllers/PenggunaController");
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", PenggunaController.getProfile);
router.put("/", PenggunaController.ubahProfil);
router.put("/password", PenggunaController.changePassword);
router.delete("/", PenggunaController.hapusAkun);

module.exports = router;