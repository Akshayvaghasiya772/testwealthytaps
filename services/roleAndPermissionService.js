const Permission = require("../model/permission");
const Role = require("../model/role");
const Roleauth = require("../model/roleauth");
const User = require("../model/user");

const checkPermission = async (req) => {
  try {
    if (req.route.hasOwnProperty("o")) {
      const permission = await Permission.findOne({
        description: req.route["o"],
      });
      if (!permission) {
        return true;
      }
      if (!req.roleId) {
        throw new Error("Please provide role ids in request object.");
      }
      let roleAuthOObj = await Roleauth.findOne({
        permissionId: permission._id,
        roleId: req.roleId,
      });
      return roleAuthOObj ?? null;
    } else {
      return true;
    }
  } catch (error) {
    logger.error("Error - checkPermission", error);
    throw new Error(error.message ?? error);
  }
};

const updatePermissionService = async ({ roleId, permissionIds }) => {
  try {
    let role = await Role.findOne({ _id: roleId });
    if (role) {
      await Roleauth.deleteMany({
        roleId: role._id,
      });
      if (permissionIds.length) {
        await Promise.all(
          _.map(permissionIds, async (permit) => {
            let permission = await Permission.findOne({ _id: permit });
            if (permission) {
              let data = {
                roleId: adminRole._id,
                permissionId: permit._id,
                description: permit.description,
                uri: permit.uri,
              };
              const roleAuthExist = await Roleauth.findOne(data);
              if (!roleAuthExist) {
                await Promise.resolve(Roleauth.create(data));
              }
            }
          })
        );
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error("Error - updatePermissionService", error);
    throw new Error(error.message ?? error);
  }
};

const permissionListService = async ({ body }) => {
  try {
    return Permission.find() ?? [];
  } catch (error) {
    logger.error("Error - permissionListService", error);
    throw new Error(error.message ?? error);
  }
};

const getRolePermitService = async ({ roleId }) => {
  try {
    let permissions = await Permission.find().lean();

    const allPermissions = await Promise.all(
      _.map(permissions, async (permit) => {
        const roleAuthObj = await Roleauth.findOne({
          roleId: roleId,
          permissionId: permit._id,
        });

        if (!roleAuthObj) return null; // Exclude permissions without authorization

        const routeName = permit.description.includes(".")
          ? permit.description.split(".")[1]
          : null;

        let obj = {
          ..._.pick(permit, ["_id", "description", "uri", "module"]),
          selected: !!roleAuthObj,
          routeName,
        };

        return obj;
      })
    );

    // Filter out null values and handle undefined modules
    const validPermissions = allPermissions.filter(Boolean);

    return _.groupBy(validPermissions, (item) => item.module || "others");
  } catch (error) {
    logger.error("Error - getRolePermitService", error);
    throw new Error(error.message ?? error);
  }
};

const getUserPermitService = async ({ userId }) => {
  try {
    let user = await Publisher.findOne({ _id: userId });
    if (user) {
      const roles = await Role.find({ _id: { $in: user.roleIds } });
      const roleAuthArr = await Roleauth.find({
        roleId: { $in: roles.map((role) => role._id) },
      }).select("permissionId");
      const permissionIds = roleAuthArr.map((permit) => permit.permissionId);
      let permissions = await Permission.find({
        _id: { $in: permissionIds },
      }).select(["description", "module"]);
      permissions = _.groupBy(permissions, "module");
      const rolePermits = {};
      Object.keys(permissions).forEach((objKey) => {
        rolePermits[objKey] = permissions[objKey].map(
          (obj) => obj.description.split(".")[1]
        );
      });
      rolePermits.roles = roles.map((role) => role.code);
      return rolePermits;
    }
  } catch (error) {
    logger.error("Error - getUserPermitService", error);
    throw new Error(error.message ?? error);
  }
};

module.exports = {
  checkPermission,
  updatePermissionService,
  permissionListService,
  getRolePermitService,
  getUserPermitService,
};
