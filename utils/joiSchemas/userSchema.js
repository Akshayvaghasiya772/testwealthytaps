const joi = require("joi");

exports.userReg = joi.object({
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
    dob: joi.date(),
    password: joi.string().min(8).required().messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be an empty field',
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is a required field',
    }),
    email: joi.string().email().required().messages({
        'string.base': 'email should be text.',
        'string.empty': 'Email cannot be empty.',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is a required.',
    }),
    address:joi.array()
    .items(joi.object({
        country:joi.string(),
        address:joi.string(),
        city:joi.string(),
        state:joi.string(),
        postalCode:joi.string(),
        isDefault:joi.boolean()
    }))
}).unknown(false);

exports.updateUserProfile = joi.object({
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
    dob: joi.date(),
}).unknown(true);