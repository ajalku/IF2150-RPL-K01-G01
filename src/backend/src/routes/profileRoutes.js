const express = require("express");
const router = express.Router();

const PenggunaController = require("../controllers/PenggunaController");
const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", PenggunaController.getProfile);
router.put("/", PenggunaController.updateProfile);
router.put("/password", PenggunaController.changePassword);

module.exports = router;