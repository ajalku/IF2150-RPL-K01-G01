const express = require("express");
const PenggunaController = require("../controllers/PenggunaController");
const { requireAuth } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", PenggunaController.register);
router.post("/login", PenggunaController.login);
router.get("/me", requireAuth, PenggunaController.me);
router.post("/logout", PenggunaController.logout);

module.exports = router;