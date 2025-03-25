const { authMessages } = require("../constants/messages");
const { loginService, registerService, resendOtp, verifyOtp, resetPassword, forgotPassword, changePassword } = require("../services/authService");
const Role = require('../model/role');
const { roleCode } = require("../constants/systemConst");

const loginController = catchAsync(async (req, res) => {
    const body = req.body;
    const result = await loginService({ body });
    if (result) {
        res.message = authMessages.LOGIN_SUCCESS
        return respBuilder.successResponse(result, res)
    }
})

const registerController = catchAsync(async (req, res) => {
    let body = req.body;
    const customerRole = await Role.findOne({code: roleCode.user})
    body.roleIds = [customerRole._id];
    const result = await registerService({ body });
    if (result) {
        res.message = authMessages.REGISTRATION_SUCCESS;
        return respBuilder.successResponse(result, res)
    }
})

const resendOtpController = catchAsync(async (req, res) => {
    const email = req.params.email;
    const { authorization } = req.headers;
    const authToken = authorization?.split(' ')[1];
    const result = await resendOtp({ email, authToken });
    if (result) {
        res.message = authMessages.OTP_SENT;
        return respBuilder.successResponse(result, res);
    }
})

const verifyOtpController = catchAsync(async (req, res) => {
    const { authorization } = req.headers;
    const authToken = authorization.split(' ')[1];
    const otp = req.params.otp;
    const result = await verifyOtp({ otp, authToken });
    if (result) {
        res.message = authMessages.OTP_VERIFIED;
        return respBuilder.successResponse(result, res);
    }
})

const forgotpassController = catchAsync(async (req, res) => {
    const email = req.params.email;
    const result = await forgotPassword({ email });
    if (result) {
        res.message = authMessages.OTP_SENT;
        return respBuilder.successResponse(result, res);
    }
})

const resetPassController = catchAsync(async (req, res) => {
    const user = req.user;
    const body = req.body;
    const result = await resetPassword({ user, body });
    if (result) {
        res.message = authMessages.RESET_PASS_SUCCESS;
        return respBuilder.successResponse(result, res);
    }
})

const changePassController = catchAsync(async (req, res) => {
    const user = req.user;
    const body = req.body;
    const result = await changePassword({ user, body });
    if (result) {
        res.message = authMessages.RESET_PASS_SUCCESS;
        return respBuilder.successResponse(result, res);
    }
})

module.exports = {
    loginController,
    registerController,
    resendOtpController,
    verifyOtpController,
    forgotpassController,
    resetPassController,
    changePassController
}