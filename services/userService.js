const { RESPONSE_OBJECT } = require("../constants/apiResponseConst");
const User = require("../model/user");
const { fetchAllDocs } = require("./dbService");

const updateUser = async ({ user, body }) => {
    try {
        const { password, email, authToken, loginToken, phone, otp, ...props } = body;
        return await User.findOneAndUpdate(
            { email: user.email },
            { $set: props },
            { new: true, projection: RESPONSE_OBJECT.USER.PROJECTION_OBJ }
        );
    } catch (err) {
        logger.error(err);
        throw new Error(`Error - update user service: ${err.message}`);
    }
};

const deleteProfile = async (user) => {
    try {
        const { email } = user;
        Promise.resolve(User.updateOne({ email: email }, { $set: { deletedAt: Date.now(), loginToken: null } })).catch(err => logger.error('Error- delete profile service: ', err))
        return true;
    } catch (error) {
        logger.error(error);
        throw new Error('Error - delete user service: ', error);
    }
}

const getOneUser = async ({ userId }) => {
    try {
        return await User.findOne({ _id: userId });
    } catch (error) {
        logger.error(error);
        throw new Error('Error - get user service: ', error);
    }
}

const listUserService = async ({ body }) => {
    try {
        return await fetchAllDocs({ model: User, query: body.query, options: body.options });
    } catch (error) {
        logger.error(error);
        throw new Error('Error - list user service: ', error);
    }
}

module.exports = {
    updateUser, deleteProfile, getOneUser, listUserService
}