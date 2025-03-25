const express = require("express")
const router = express.Router();

router.use('/auth', require('./adminAuthRoutes'))
router.use('/user', require('./userRoutes'))
router.use('/setting',require('./settingRoutes'))
module.exports = router;