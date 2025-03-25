const { roleCode } = require("../constants/systemConst");
const Role = require("../model/role");
const Setting = require("../model/setting");
const { fetchAllDocs } = require("./dbService");

const upsertSetting = async ({ storeId, name, data, type }) => {
  try {
    let query;
    if (type === 1) {
      query = { type: 1, deletedAt: { $exists: false } };
    } else if (type === 2) {
      query = { storeId, type: 2, deletedAt: { $exists: false } };
    }
    const existingSetting = await Setting.findOne(query);
    const updateData = {
      name,
      data,
      type,
    };
    // Perform the update or upsert
    const updatedSetting = await Setting.findOneAndUpdate(query, updateData, {
      new: true,
      upsert: true,
    });
    // Check if the `otpPrefix` field was updated
    if (
      existingSetting &&
      existingSetting.data?.otpPrefix &&
      existingSetting.data.otpPrefix !== data.otpPrefix
    ) {
      // Fetch roles for admin and sub-admin
      const adminRoles = await Role.find({
        code: { $in: [roleCode.admin, roleCode.subAdmin] },
      });
      const adminRoleIds = adminRoles.map((role) => role._id);
      await Publisher.updateMany(
        { roleIds: { $in: adminRoleIds } },
        { $set: { loginToken: [] } }
      );
    }
    return updatedSetting;
  } catch (error) {
    logger.error("Error - upsertSetting", error);
    throw new Error(error.message ?? error);
  }
};

const getSettingsService = async ({ name, storeId }) => {
  try {
    const query = { name };
    if (storeId) {
      query.storeId = storeId;
    }
    return await Setting.findOne(query);
  } catch (error) {
    logger.error("Error - getSettingsService", error);
    throw new Error(error.message ?? error);
  }
};

const getSettingByStoreIdService = async ({ query, options }) => {
  try {
    return await fetchAllDocs({ model: Setting, query, options });
  } catch (error) {
    logger.error("Error - getSettingByStoreIdService", error);
    throw new Error(error.message ?? error);
  }
};

const listSettingService = async ({ query, options }) => {
  try {
    return await fetchAllDocs({ model: Setting, query, options });
  } catch (error) {
    logger.error("Error - listSettingService", error);
    throw new Error(error.message ?? error);
  }
};
module.exports = {
  upsertSetting,
  getSettingsService,
  getSettingByStoreIdService,
  listSettingService,
};
