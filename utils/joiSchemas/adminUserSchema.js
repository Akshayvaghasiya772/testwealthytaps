const joi = require("joi");

exports.addAdminUser = joi.object({
    firstName: joi.string().required().messages({
        'string.base': 'First Name should be text.',
        'string.empty': 'First Name cannot be empty.',
        'any.required': 'First Name is a required.',
    }),
    lastName: joi.string().messages({
        'string.base': 'Last Name should be text.',
        'string.empty': 'Last Name cannot be empty.',
        'any.required': 'Last Name is a required.',
    }),
    phone: joi.string().messages({
        'string.base': 'Mobile number should be text.',
        'string.empty': 'Mobile number cannot be empty.',
        'any.required': 'Mobile number is a required.',
    }),
    password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be an empty field',
        'string.pattern.base': 'Password must be at least 8 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character',
        'any.required': 'Password is a required field',
    }),
    email: joi.string().email().required().messages({
        'string.base': 'Email should be text.',
        'string.empty': 'Email cannot be empty.',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is a required.',
    }),
    roleIds: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)).required().messages({
        'string.base': 'Role should be text.',
        'string.empty': 'Role cannot be empty.',
        'any.required': 'Role is a required.',
    }),
}).unknown(false);

exports.updateAdminUser = joi.object({
    firstName: joi.string().required().messages({
        'string.base': 'First Name should be text.',
        'string.empty': 'First Name cannot be empty.',
        'any.required': 'First Name is a required.',
    }),
    lastName: joi.string().messages({
        'string.base': 'Last Name should be text.',
        'string.empty': 'Last Name cannot be empty.',
        'any.required': 'Last Name is a required.',
    }),
    phone: joi.string().messages({
        'string.base': 'Mobile number should be text.',
        'string.empty': 'Mobile number cannot be empty.',
        'any.required': 'Mobile number is a required.',
    }),
    password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be an empty field',
        'string.pattern.base': 'Password must be at least 8 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character',
        'any.required': 'Password is a required field',
    }),
    email: joi.string().email().messages({
        'string.base': 'Email should be text.',
        'string.empty': 'Email cannot be empty.',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is a required.',
    }),
}).unknown(false);