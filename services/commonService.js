const { RESPONSE_CODE } = require("../constants/apiResponseConst");
const responseCode = require("../constants/httpRespCode");
const { userMessages } = require("../constants/messages");
const Role = require("../model/role");
const moment = require("moment-timezone");
const {
  checkPermission,
} = require("./roleAndPermissionService");
const Setting = require("../model/setting");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log(err);
    logger.error(err.message);
    res.status(responseCode.validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: err.message,
    });
  });
};

const verifyPermission = async (req, res, next) => {
  try {
    const result = await checkPermission(req);
    if (result) {
      next();
    } else {
      res.message = userMessages.USER_NOT_PERMITTED;
      return respBuilder.unAuthenticated(res);
    }
  } catch (error) {
    logger.error("Error - verify permission: ", error);
    throw new Error(error.message ?? error);
  }
};

const publisherVerfityPermission = async (req, res, next) => {
  try {
    const result = await checkPublisherPermission(req);
    if (result) {
      next();
    } else {
      res.message = userMessages.USER_NOT_PERMITTED;
      return respBuilder.unAuthorized(res);
    }
  } catch (error) {
    logger.error("Error - publisherVerfityPermission", error);
    throw new Error(error.message ?? error);
  }
};

const getFilterQuery = async ({ query }) => {
  try {
    if (query.search && query.search !== "") {
      query["$or"] = query.searchColumns.map((column) => {
        return {
          [column]: {
            $regex: query?.search
              .replace(/[-[\]{}()*+?.,\\/^$|#]/g, "\\$&")
              .trim(),
            $options: "i",
          },
        };
      });
    }
    delete query.search;
    delete query.searchColumns;
    return query;
  } catch (error) {
    logger.error("Error - getFilterQuery: ", error);
    throw new Error(error.message ?? error);
  }
};

const getRoleIdByCode = async (roleCode) => {
  const role = await Role.findOne({ code: roleCode });
  if (!role) {
    throw new Error(`Role ${roleCode} not found.`);
  }
  return role._id;
};

const generateRandomPassword = (length = 9) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password;
};

module.exports = {
  catchAsync,
  getFilterQuery,
  verifyPermission,
  getRoleIdByCode,
  publisherVerfityPermission,
  generateRandomPassword,
  generateRandomPassword
};
