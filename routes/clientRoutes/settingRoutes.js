const express = require("express");
const { upsertSettingController, getSettingByStoreIdController } = require("../../controller/settingController");
const { authenticator } = require("../../services/passportAuth");
const router = express.Router();

router.post('/upsert',authenticator,upsertSettingController)
router.post('/:name', getSettingByStoreIdController);
module.exports = router;