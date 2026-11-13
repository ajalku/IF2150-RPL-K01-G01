const express = require("express");
const HomepageController = require("../controllers/HomepageController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, HomepageController.loadHomepage);

module.exports = router;
