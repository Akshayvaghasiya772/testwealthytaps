const dbCon = require("../config/dbConfig");
const { RESPONSE_OBJECT } = require("../constants/apiResponseConst");
const { JWT_CONST } = require("../constants/authConst");
const { emailBody, emailSub } = require("../constants/emailConst");
const { authMessages, userMessages } = require("../constants/messages");
const User = require("../model/user");
const { compareBHash, createBHash } = require("./bcryptService");
const { sendOtpViaEmail, sendWelcomeEmail } = require("./emailService");
const { signJwtToken, verifyJwtToken } = require("./jwtService");
const logger = require("./logger");
const moment = require("moment-timezone")
const ejs = require('ejs')
const path = require('path')
const API_URL = process.env.API_URL;
async function loginService({ body }) {
    try {
        const user = await User.findOne({ email: body.email });
        if (!user) {
            throw new Error(userMessages.USER_NOT_FOUND);
        }
        const isPasswordValid = await compareBHash({
            password: body.password, hash: user.password
        });
        if (!isPasswordValid) {
            throw new Error(authMessages.WRONG_MOBILE_PASSWORD);
        } else {
            const token = await signJwtToken({ email: body.email, expireIn: JWT_CONST.LOGIN_EXP_TIME });
            const userObj = await User.findOneAndUpdate({ email: body.email }, { $set: { loginToken: token } }, { projection: RESPONSE_OBJECT.USER.PROJECTION_OBJ, new: true })
            return {
                ...userObj._doc,
                token: token
            };
        }
    } catch (error) {
        logger.error('Error - Login Service: ', error);
        throw new Error(error.message ? error.message : error);
    }
};


async function registerService({ body }) {
    try {
        const userExists = await User.findOne({ email: body.email });
        if (userExists) {
            throw new Error(userMessages.USER_ALREADY_EXIST);
        }

        let userObj = { ...body };
        const user = await User.create(userObj).then(doc => doc).catch(error => {
            logger.error("Error - Register service: ", error);
            throw error;
        });
        const token = await signJwtToken({ email: body.email, expireIn: JWT_CONST.LOGIN_EXP_TIME });

        return token;
    } catch (error) {
        logger.error('Error - Register service: ', error);
        throw new Error(error.message ?? error);
    }
}

module.exports = {
    registerService,
};


// async function forgotPassword({ email }) {
//     try {
//         const user = await User.findOne({ email: email });
//         if (!user) {
//             throw new Error(userMessages.USER_NOT_FOUND);
//         }
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         Promise.resolve(sendOtpViaEmail({ email, body: emailBody.forgotPassOtp(otp), sub: emailSub.otp })).catch(err => logger.error("Error - send otp via email: ", err));
//         const token = await signJwtToken({ email: user.email, expireIn: JWT_CONST.LOGIN_EXP_TIME });
//         const otpExpireOn = moment().utc().add(2, 'minutes').toDate();
//         Promise.resolve(User.updateOne({ email: email }, { $set: { authToken: token, otp: otp, otpExpireOn: otpExpireOn } })).catch(err => logger.error("Error - forgot password update user: ", err));;
//         return { token: token };
//     } catch (error) {
//         logger.error('Error - forgot password service: ', error);
//         throw new Error(error.message ?? error)
//     }
// }

async function forgotPassword({ email }) {
    try {

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error(userMessages.USER_NOT_FOUND);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Render EJS Template for OTP email
        const html = await ejs.renderFile(path.join(__dirname, "../views/otp.ejs"), {
            otp: otp,
            API_URL: API_URL,  // If you need to provide a URL for assets like logo
        });

        // Send the OTP via email
        Promise.resolve(
            sendOtpViaEmail({
                email,
                body: '', // Body can be empty if HTML is provided
                html: html, // Send rendered HTML as the email body
                sub: emailSub.otp,
            })
        ).catch(err => logger.error("Error - send otp via email: ", err));

        const token = await signJwtToken({ email: user.email, expireIn: JWT_CONST.AUTH_EXT_TIME });
        const otpExpireOn = moment().utc().add(2, 'minutes').toDate();

        // Update the user with OTP and authToken
        Promise.resolve(
            User.updateOne(
                { email: email },
                { $set: { authToken: token, authOtp: otp, otpExpireOn: otpExpireOn } }
            )
        ).catch(err => logger.error("Error - forgot password update user: ", err));

        return { token: token };
    } catch (error) {
        logger.error('Error - forgot password service: ', error);
        throw new Error(error.message ?? error);
    }
}

// async function resendOtp({ email, authToken }) {
//     try {
//         const user = await User.findOne({ email: email });
//         if (!authToken || user.authToken !== authToken) {
//             throw new Error(userMessages.USER_UNAUTHORISED);
//         }
//         let otp = Math.floor(100000 + Math.random() * 900000).toString();
//         Promise.resolve(sendOtpViaEmail({ email, body: emailBody.forgotPassOtp(otp), sub: emailSub.otp })).catch(err => logger.error("Error - send otp via email: ", err));
//         const token = await signJwtToken({ email: email, expireIn: JWT_CONST.LOGIN_EXP_TIME });
//         const otpExpireOn = moment().utc().add(2, 'minutes').toDate();
//         Promise.resolve(User.updateOne({ email: email }, { $set: { authToken: token, otp: otp, otpExpireOn: otpExpireOn } })).catch(err => logger.error("Error - resend otp user: ", err));;
//         return { token: token };
//     } catch (error) {
//         logger.error('Error - resend otp service: ', error);
//         throw new Error(error.message ?? error)
//     }
// };


async function resendOtp({ email, authToken }) {
    try {
        // Find the user by email
        const user = await User.findOne({ email: email });

        // Check if the provided authToken matches the user's token
        if (!authToken || user.authToken !== authToken) {
            throw new Error(userMessages.USER_UNAUTHORISED);
        }

        // Generate a new OTP
        let otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Render EJS Template for OTP email
        const html = await ejs.renderFile(path.join(__dirname, "../views/otp.ejs"), {
            otp: otp,
            API_URL: API_URL,  // URL for assets like logo
        });

        // Send the OTP via email with rendered HTML
        Promise.resolve(
            sendOtpViaEmail({
                email,
                body: '', // Body can be empty if HTML is provided
                html: html, // Send the rendered HTML as the email body
                sub: emailSub.otp,
            })
        ).catch(err => logger.error("Error - send otp via email: ", err));

        // Generate a new JWT token for the user
        const token = await signJwtToken({ email: email, expireIn: JWT_CONST.AUTH_EXT_TIME });

        // Set OTP expiration time to 2 minutes from now
        const otpExpireOn = moment().utc().add(2, 'minutes').toDate();

        // Update the user with the new OTP and authToken in the database
        Promise.resolve(
            User.updateOne(
                { email: email },
                { $set: { authToken: token, authOtp: otp, otpExpireOn: otpExpireOn } }
            )
        ).catch(err => logger.error("Error - resend otp user: ", err));

        // Return the new token
        return { token: token };
    } catch (error) {
        // Log and throw any error
        logger.error('Error - resend otp service: ', error);
        throw new Error(error.message ?? error);
    }
};


async function verifyOtp({ otp, authToken }) {
    try {
        const { email } = await verifyJwtToken(authToken);
        const user = await User.findOne({ email: email });
        if (!user || user.authToken !== authToken) {
            throw new Error(userMessages.USER_UNAUTHORISED);
        }
        if (user.otpExpireOn < moment().utc().toDate()) {
            throw new Error(authMessages.OTP_EXPIRED);
        }
        if (user.authOtp !== otp) {
            throw new Error(authMessages.OTP_INVALID);
        }

        const token = await signJwtToken({ email: user.email, expireIn: JWT_CONST.LOGIN_EXP_TIME });
        const userObj = await User.findOneAndUpdate({ email: user.email }, { $set: { authToken: null, loginToken: token, authOtp: null } }, { projection: RESPONSE_OBJECT.USER.PROJECTION_OBJ, new: true });
        return { token: token, ...userObj._doc };
    } catch (error) {
        logger.error('Error - verify otp service: ', error);
        throw new Error(error.message ?? error)
    }
}



async function resetPassword({ user, body }) {
    try {
        const isPasswordMatch = await compareBHash({ password: body.password, hash: user.password });
        if (isPasswordMatch) {
            throw new Error(authMessages.SELECT_NEW_PASSWORD);
        }
        const hashedPassword = await createBHash(body.password);
        Promise.resolve(User.updateOne({ email: user.email }, { $set: { password: hashedPassword } })).catch(error => logger.error('Error- reset password service: ', error))
        return true;
    } catch (error) {
        logger.error('Error - reset password service: ', error);
        throw new Error(error.message ?? error)
    }
}

async function changePassword({ user, body }) {
    try {
        const isPasswordMatch = await compareBHash({ password: body.oldPassword, hash: user.password });
        if (!isPasswordMatch) {
            throw new Error(authMessages.OLD_PASS_WRONG);
        }
        const hashedPassword = await createBHash(body.newPassword);
        Promise.resolve(User.updateOne({ email: user.email }, { $set: { password: hashedPassword } })).catch(error => logger.error('Error- change password service: ', error))
        return true;
    } catch (error) {
        logger.error('Error - change password service: ', error);
        throw new Error(error.message ?? error)
    }
}

module.exports = {
    loginService, registerService, resendOtp, verifyOtp, forgotPassword, resetPassword, changePassword
}