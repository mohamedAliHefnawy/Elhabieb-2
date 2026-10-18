const express = require("express");
const router = express.Router();
const Settings = require("../controllers/settingsController");

router.get("/", Settings.GetSettings);
router.post("/editSettings", Settings.EditSettings);
router.post("/editImages", Settings.EditImages);

module.exports = router;
