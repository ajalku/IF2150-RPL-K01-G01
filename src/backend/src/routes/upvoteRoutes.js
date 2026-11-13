const express = require("express");
const UpvoteController = require("../controllers/UpvoteController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:idLaporan", requireAuth, UpvoteController.prosesUpvote);

module.exports = router;
