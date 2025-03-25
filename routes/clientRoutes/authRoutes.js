const express = require("express");
const { loginController, registerController, resendOtpController, verifyOtpController, forgotpassController, resetPassController, changePassController } = require("../../controller/authController");
const { authenticator } = require("../../services/passportAuth");
const joiValidate = require("../../utils/joiValidator");
const { userReg } = require("../../utils/joiSchemas/userSchema");
const router = express.Router();

router.post('/login', loginController);
router.post('/register', joiValidate(userReg), registerController);
router.get('/forgot-password/:email', forgotpassController);
router.get('/resend-otp/:email', resendOtpController);
router.get('/verify-otp/:otp', verifyOtpController);
router.post('/reset-password', authenticator, resetPassController);
router.post('/change-password', authenticator, changePassController);

module.exports = router;