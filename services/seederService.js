const { roleCode } = require("../constants/systemConst");
const Permission = require("../model/permission");
const Role = require("../model/role");
const Roleauth = require("../model/roleauth");
const Setting = require("../model/setting");

async function seedRoles() {
  try {
    const rolesArr = require("../seeder/roleArr.json");
    await Promise.all(
      rolesArr.map(async (item) => {
        const roleFound = await Role.findOne({ code: item.code });
        if (!roleFound) {
          await Role.create(item);
        }
      })
    );
  } catch (error) {
    logger.error("Error - seedRoles", error);
    throw new Error(error.message ?? error);
  }
}

async function seedPermission(routeEndpoints) {
  try {
    await Promise.all(
      routeEndpoints.map(async (item) => {
        // console.log('routeEndpoints: ', routeEndpoints);
        // console.log('item: ', item);
        if (item.descriptor[0]) {
          const permitObj = {
            uri: item.path,
            method: item.methods[0],
            description: item.descriptor[0],
            module: item.descriptor[0].split(".")[0],
          };
          const permit = await Permission.findOne({
            description: permitObj.description,
          });
          if (!permit) {
            await Permission.create(permitObj);
          }
        }
      })
    );
  } catch (error) {
    logger.error("Error - seedPermission", error);
    throw new Error(error.message ?? error);
  }
}

async function assignPermission() {
  try {
    const adminRole = await Promise.resolve(
      Role.findOne({ code: roleCode.admin })
    );
    // const permissionArr = await Permission.find();
    const permissionArr = await Permission.find({ uri: { $regex: "^/admin" } });
    const roleAuthArr = [];
    permissionArr.map((permit) => {
      roleAuthArr.push({
        roleId: adminRole._id,
        permissionId: permit._id,
        description: permit.description,
        uri: permit.uri,
      });
    });
    await Roleauth.deleteMany({ roleId: adminRole._id });
    Promise.resolve(Roleauth.insertMany(roleAuthArr));
  } catch (error) {
    logger.error("Error - assignPermission", error);
    throw new Error(error.message ?? error);
  }
}

async function assignSubAdminPermission() {
  try {
    // Load the SubAdmin permissions from the JSON file
    const subAdminlist = require("../seeder/subAdminPermit.json");
    const subAdminPermit = subAdminlist[0].SUB_ADMIN_PERMIT;
    const subAdminRole = await Role.findOne({ code: "SUB_ADMIN" });
    if (!subAdminRole) throw new Error("SubAdmin role not found.");
    const permissionArr = await Permission.find({
      uri: { $regex: "^/admin" },
    });
    const roleAuthArr = [];
    permissionArr.forEach((permit) => {
      if (subAdminPermit.includes(permit.description)) {
        roleAuthArr.push({
          roleId: subAdminRole._id,
          permissionId: permit._id,
          description: permit.description,
          uri: permit.uri,
        });
      }
    });
    await Roleauth.deleteMany({ roleId: subAdminRole._id });
    Promise.resolve(Roleauth.insertMany(roleAuthArr));
  } catch (error) {
    logger.error("Error - assignSubAdminPermission", error);
    throw new Error(error.message ?? error);
  }
}

async function seedUser() {
  try {
    const userArr = require("../seeder/userArr.json");
    Promise.all(
      userArr.map(async (userObj) => {
        const role = await Role.findOne({ code: userObj.roleCode });
        const userExists = await Publisher.findOne({ email: userObj.email });
        if (!userExists && role) {
          userObj.roleIds = [role._id];
          Promise.resolve(Publisher.create(userObj));
        }
      })
    );
  } catch (error) {
    logger.error("Error - seedUser", error);
    throw new Error(error.message ?? error);
  }
}

async function seedSettings() {
  try {
    const settingsFilePath = require("../seeder/setting.json");
    await Promise.all(
      settingsFilePath.map(async (item) => {
        const settingExists = await Setting.findOne({ name: item.name });
        if (!settingExists) {
          await Setting.create(item);
        }
      })
    );
  } catch (error) {
    logger.error("Error - seedSettings", error);
    throw new Error(error.message ?? error);
  }
}

const seedData = async (routeEndpoints) => {
  try {
    await seedRoles();
    await seedPermission(routeEndpoints);
    await assignPermission();
    // await assignSubAdminPermission()
    // await seedUser();
    await seedSettings();
    console.log("Seed DB Completed!!!");
  } catch (error) {
    logger.error("Error - seedData", error);
    throw new Error(error.message ?? error);
  }
};

module.exports = {
  seedData,
};
