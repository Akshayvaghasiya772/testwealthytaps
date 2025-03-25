const authMessages = {
    TOO_MANY_ATTEMPTS: "Too many incorrect password attempts. Please use 'Forgot Password'",
    LOGIN_SUCCESS: "Login Successful.",
    WRONG_MOBILE_PASSWORD: "Email or password is wrong.",
    REGISTRATION_SUCCESS: "Registration successful.",
    OTP_SENT: "OTP sent successfully.",
    OTP_VERIFIED: "OTP verified successfully.",
    OTP_INVALID: "OTP Entered is not valid.",
    OTP_EXPIRED: "OTP is expired. Please use 'Resend OTP' button to regenerate OTP.",
    OTP_LIMIT:"You can only resend the OTP 4 times within 24 hours.",
    OTP_PREFIX:"OTP prefix setting is missing",
    RESET_PASS_SUCCESS: "Password reset successful.",
    SELECT_NEW_PASSWORD: "Password must not be same as previous one.",
    OLD_PASS_WRONG: "Old password is wrong.",
    CREATE_PASSWORD:"password created  successfully.",
    INVALID_TYPE:"Type is Invalid",
    FILE_UPLOAD:"File Upload Successfully.",
    LOGOUT_SUCCESS:"Logout Successfully.",
    INVALID_ROLE:"invalid role",
    DEVICE_ID_REQUIRED:"Please provide device id."
}

const userMessages = {
    USER_NOT_FOUND: "User does not exist.",
    USER_ALREADY_EXIST: "User already exists.",
    USER_UNAUTHORISED: "User is unauthorized to perform this action.",
    USER_NOT_PERMITTED: "User is not permitted to perform this action.",
    USER_NOT_VERIFIED:"User is not verified",
    GET_PROFILE_SUCCESS: "Fetched user profile successfully.",
    UPDATE_PROFILE_SUCCESS: "User profile updated successfully.",
    DELETE_PROFILE_SUCCESS: "User profile deleted successfully.",
    ADD_PROFILEPIC_SUCCESS: "Profile picture updated successfully."
}

const CRUDMessages = {
    FETCHONE_SUCCESS: module => `${module} fetched successfully.`,
    LIST_SUCCESS: module => `List of ${module} fetched successfully.`,
    CREATE_SUCCESS: module => `New ${module} added successfully.`,
    UPDATE_SUCCESS: module => `${module} updated successfully.`,
    UPDATE_FAILED: module => `${module} update failed.`,
    DELETE_SUCCESS: module => `${module} deleted successfully.`,
    ACTION_SUCCESS: `Action performed successfully.`
}

const fileUploadMessages = {
    INVALID_FILE_SIZE: module => `File ${module} size is too large.`
}

module.exports = {
    authMessages,
    userMessages,
    CRUDMessages,
    fileUploadMessages,
}