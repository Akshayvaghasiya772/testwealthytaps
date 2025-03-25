const express = require('express');
const { authenticator } = require('../../services/passportAuth');
const joiValidate = require('../../utils/joiValidator');
const { addRole, updateRole } = require('../../utils/joiSchemas/roleSchema');
const router = express.Router();

router.post('/list', authenticator, verifyPermission, roleListController).descriptor("roles.list_role");
router.post('/updateRole/:id', authenticator, verifyPermission, joiValidate(updateRole), updateRoleController).descriptor("roles.update_role");
router.post('/create', authenticator, verifyPermission, joiValidate(addRole), addRoleController).descriptor("roles.create_role");
router.delete('/soft-delete/:id', authenticator, verifyPermission, softDeleteRoleController).descriptor("roles.soft_delete_role");

module.exports = router;