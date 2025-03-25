const express = require("express");
const { getSettingController,  } = require("../../controller/commonController");
const router = express.Router();

router.get('/get/:name',getSettingController)

module.exports = router;
