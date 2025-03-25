const { roleCode } = require("../constants/systemConst");
const Role = require("../model/role");
const Roleauth = require("../model/roleauth");

const roleListService = async ({ body }) => {
  try {
    return Role.find() ?? [];
  } catch (error) {
    logger.error("Error - roleListService", error);
    throw new Error(error.message ?? error);
  }
};

const updateRoleService = async ({ body, id }) => {
  try {
    const existingRole = await Role.findOne({
      code: body.code,
      _id: { $ne: id },
    });
    if (existingRole) throw new Error("Role already exists.");
    Promise.resolve(Role.updateOne({ _id: id }, { $set: body }));
    return true;
  } catch (error) {
    logger.error("Error - updateRoleService", error);
    throw new Error(error.message ?? error);
  }
};

const addRoleService = async ({ body }) => {
  try {
    return await Role.create(body);
  } catch (error) {
    logger.error("Error - addRoleService", error);
    throw new Error(error.message ?? error);
  }
};

const softDeleteRoleService = async ({ roleId }) => {
  try {
    const role = await Role.findOne({ _id: roleId });
    if (!role) {
      throw new Error("Role does not exist.");
    }
    if (role.code == roleCode.admin) {
      throw new Error("Admin role can not be deleted.");
    }
    await Role.updateOne(
      { code: role.code },
      { $set: { deletedAt: Date.now() } }
    ).then(async () => {
      Promise.resolve(Roleauth.deleteMany({ roleId: role._id }));
    });
  } catch (error) {
    logger.error("Error - softDeleteRoleService", error);
    throw new Error(error.message ?? error);
  }
};

module.exports = {
  roleListService,
  updateRoleService,
  addRoleService,
  softDeleteRoleService,
};
