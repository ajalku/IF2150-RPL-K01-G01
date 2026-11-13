const express = require("express");
const TutorialController = require("../controllers/TutorialController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, TutorialController.startTutorial);
router.post("/skip", requireAuth, TutorialController.skipTutorial);
router.post("/selesai", requireAuth, TutorialController.finishTutorial);

module.exports = router;
