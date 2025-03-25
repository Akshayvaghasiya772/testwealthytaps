const express = require("express");
const { authenticator } = require("../../services/passportAuth");
const { adminLoginController, adminForgotpassController, adminResendOtpController, adminVerifyOtpController, adminResetPassController, adminChangePassController } = require("../../controller/adminAuthController");
const router = express.Router();

router.post('/login', adminLoginController);
router.get('/forgot-password/:email', adminForgotpassController);
router.get('/resend-otp/:email', adminResendOtpController);
router.get('/verify-otp/:otp', adminVerifyOtpController);
router.post('/reset-password', authenticator, verifyPermission, adminResetPassController).descriptor("authentication.reset-password");
router.post('/change-password', authenticator, verifyPermission, adminChangePassController).descriptor("authentication.change-password");
// router.post('/logout',authenticator,logoutController)


module.exports = router;