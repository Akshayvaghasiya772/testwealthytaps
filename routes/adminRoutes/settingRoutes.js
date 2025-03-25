const express = require("express");
const { authenticator } = require("../../services/passportAuth");
const { upsertSettingController, getSettingController, getSettingByStoreIdController, listSettingController } = require("../../controller/settingController");
const router = express.Router();

router.post('/upsert', authenticator, upsertSettingController).descriptor('setting.upsert_setting')
router.post('/get', getSettingController).descriptor('setting.get_setting')
router.post('/:storeId', getSettingByStoreIdController).descriptor('setting.getbyid_setting')
router.post('/list', authenticator, listSettingController).descriptor('setting.list_setting')

module.exports = router;    