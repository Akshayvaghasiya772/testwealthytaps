const RESPONSE_CODE = {
    SUCCESS: "SUCCESS",
    LOGIN: "LOGIN",
    OTP: "OTP_VERIFIED",
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
    ERROR: "ERROR",
    ALERTS: "ALERTS",
    UNAUTHENTICATED: "UNAUTHENTICATED",
    UNAUTHORIZED: "UNAUTHORIZED",
};

const RESPONSE_OBJECT = {
    USER: {
        PROJECTION_OBJ: { "password": 0, "__v": 0, "createdAt": 0, "updatedAt": 0, "otpExpireOn": 0, "authToken": 0, "otp": 0, "authOtpTimer": 0, "loginOtpTimer": 0, "authOtp": 0, "forgotOtpTimer": 0 , "tempProfileUpdate":0}
    }
}

module.exports = {
    RESPONSE_CODE,
    RESPONSE_OBJECT
}                                                                                    