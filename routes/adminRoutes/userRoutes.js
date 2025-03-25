const express = require("express");
const { authenticator } = require("../../services/passportAuth");
const { updateUserController, addUserController, getUserProfileController, getUserController, listUserController } = require("../../controller/userController");
const { addAdminUser, updateAdminUser } = require("../../utils/joiSchemas/adminUserSchema");
const joiValidate = require("../../utils/joiValidator");
const router = express.Router();

router.post('/add-user', authenticator, verifyPermission, joiValidate(addAdminUser), addUserController).descriptor("user.adduser");
router.get('/get-profile', authenticator, getUserProfileController);
router.post('/update-profile', authenticator, verifyPermission, joiValidate(updateAdminUser), updateUserController).descriptor("user.update");
router.post('/list', authenticator, verifyPermission, listUserController).descriptor("user.list");
router.get('/:id', authenticator, verifyPermission, getUserController).descriptor("user.get");

module.exports = router;