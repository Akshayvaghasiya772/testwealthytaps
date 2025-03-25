const path = require("path");
const { API_URL } = require("./dbConst");
const ejs = require('ejs')

const emailSub = {
    otp: "One time password",
};

// const emailBody = {
//     forgotPassOtp: (otp) => {
//         return `Enter the following OTP ${otp} for verification of your email.`
//     }
// }

const emailBody = {
    forgotPassOtp: async (otp) => {
        const html = await ejs.renderFile(path.join(__dirname, "../views/otp.ejs"), {
            otp: otp,
            API_URL: API_URL
        });

        return html;
    },
    sendPassword: async (password) => {
        const html = await ejs.renderFile(path.join(__dirname, "../views/password.ejs"), {
            password: password,
            API_URL: API_URL
        });
        return html;
    }
};

module.exports = {
    emailSub, emailBody
}