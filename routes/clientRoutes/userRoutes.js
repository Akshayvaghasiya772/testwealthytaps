const express = require("express");
const { authenticator } = require("../../services/passportAuth");
const { updateUserController, delProController, getOwnProfileController } = require("../../controller/userController");
const joiValidate = require("../../utils/joiValidator");
const { updateUserProfile } = require("../../utils/joiSchemas/userSchema");

const router = express.Router();

router.get('/get-profile', authenticator, getOwnProfileController);
router.post('/update-profile', authenticator, joiValidate(updateUserProfile), updateUserController);
router.post('/delete-profile', authenticator, delProController);

module.exports = router;