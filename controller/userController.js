const { userMessages, authMessages, CRUDMessages } = require("../constants/messages");
const { registerService } = require("../services/authService");
const { updateUser, deleteProfile, upsertProfilePic, exportUserService, getOneUser, listUserService } = require("../services/userService");
const moment = require('moment-timezone');

const addUserController = catchAsync(async (req, res) => {
    let body = req.body;
    const result = await registerService({ body });
    if (result) {
        res.message = authMessages.REGISTRATION_SUCCESS;
        return respBuilder.successResponse(result, res)
    }
})

const getUserProfileController = catchAsync(async (req, res) => {
    const { password, otp, otpExpireOn, authToken, __v, createdAt, updatedAt, ...userObj } = req.user;
    if (userObj) {
        res.message = userMessages.GET_PROFILE_SUCCESS;
        return respBuilder.successResponse(userObj, res);
    }
});

const getUserController = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const result = await getOneUser({ userId });
    if (result) {
        res.message = userMessages.GET_PROFILE_SUCCESS;
        return respBuilder.successResponse(result, res)
    }
})

const listUserController = catchAsync(async (req, res) => {
    const body = req.body;
    const result = await listUserService({ body });
    if (result) {
        res.message = CRUDMessages.LIST_SUCCESS("users");
        return respBuilder.successResponse(result, res)
    }
})

const updateUserController = catchAsync(async (req, res) => {
    const user = req.user;
    const body = req.body;
    const result = await updateUser({ user, body });
    if (result) {
        res.message = userMessages.UPDATE_PROFILE_SUCCESS;
        return respBuilder.successResponse(result, res);
    }
});

const delProController = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await deleteProfile(user);
    if (result) {
        res.message = userMessages.DELETE_PROFILE_SUCCESS;
        return respBuilder.successResponse(result, res);
    }
});

const getOwnProfileController = catchAsync(async (req, res) => {
    const { password, otp, otpExpireOn, cards, authToken, __v, roleIds, createdAt, updatedAt, ...userObj } = req.user;
    if (userObj) {
        res.message = userMessages.GET_PROFILE_SUCCESS;
        return respBuilder.successResponse(userObj, res);
    }
})

module.exports = {
    addUserController,
    getUserProfileController,
    updateUserController,
    delProController,
    getUserController,
    listUserController,
    getOwnProfileController
}