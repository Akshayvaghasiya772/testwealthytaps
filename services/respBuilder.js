const { RESPONSE_CODE } = require("../constants/apiResponseConst");
const { success, unAuthenticated, unAuthorized, validationError, badRequest } = require("../constants/httpRespCode");

exports.successResponse = (data, res) => {
    return res.status(success).json({
        code: RESPONSE_CODE.SUCCESS,
        message: res.message,
        data: data || []
    })
}; 

exports.unAuthenticated = (res) => {
    return res.status(unAuthenticated).json({
        code: RESPONSE_CODE.UNAUTHENTICATED,
        message: res.message,
        data: []
    })
}

exports.unAuthorized = (res) => {
    return res.status(unAuthorized).json({
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: res.message,
        data: []
    })
}

exports.wrongPassword = (res) => {
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: {},
    });
};

exports.failureResponse = (data, res) => {
    res.message = data.message ? data.message : data;
    return res.status(validationError).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
    });
};

exports.badRequest = (data, res) => {
    return res.status(badRequest).json({
        code: RESPONSE_CODE.ERROR,
        message: res.message,
        data: data,
    });
};

exports.inValidParam = (message, res) => {
    message = message.replace(/"/g, "");
    res.message = message;
    return res.status(validationError).json({
      code: RESPONSE_CODE.ERROR,
      message: res.message,
      data: {},
    });
  };