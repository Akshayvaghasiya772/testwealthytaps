const { CRUDMessages } = require("../constants/messages");
const { catchAsync } = require("../services/commonService");
const { upsertSetting, getSettingsService, getSettingByStoreIdService, listSettingService } = require("../services/settingService");

const upsertSettingController = catchAsync(async (req, res) => {
  const { storeId, name, data, type } = req.body;
  const setting = await upsertSetting({ storeId, name, data, type });

  if (setting) {
    res.message = CRUDMessages.UPDATE_SUCCESS("setting");
    return respBuilder.successResponse(setting, res);
  }
});

const getSettingController = catchAsync(async (req, res) => {
  const { name, storeId } = req.body;  // Get both storeId and name from the request body
  const result = await getSettingsService({ name, storeId });
  if (result) {
    res.message = CRUDMessages.FETCHONE_SUCCESS;
    return respBuilder.successResponse(result, res);
  }
});


const getSettingByStoreIdController = catchAsync(async (req, res) => {
  const { name } = req.params;
  if (!name) {
    throw new Error("Name is required!!!")
  }
  const query = req.body.query || {};
  const options = req.body.options || {};
  query.name = name;

  const settingData = await getSettingByStoreIdService({ query, options });
  if (settingData) {
    res.message = CRUDMessages.FETCHONE_SUCCESS("setting");
    return respBuilder.successResponse(settingData, res);
  }
});

const listSettingController = catchAsync(async (req, res) => {
  const query = req.body.query || {};
  const options = req.body.options || {};
  const settingData = await listSettingService({ query, options });
  if (settingData) {
    res.message = CRUDMessages.FETCHONE_SUCCESS("setting");
    return respBuilder.successResponse(settingData, res);
  }
})
module.exports = { upsertSettingController, getSettingController, getSettingByStoreIdController, listSettingController }