const express=require("express")
const router=express.Router();

router.use('/admin',require('./adminRoutes/index'))
router.use('/client',require('./clientRoutes/index'))
router.use('/common',require('./commonRoutes/commonRoutes'))
module.exports=router;