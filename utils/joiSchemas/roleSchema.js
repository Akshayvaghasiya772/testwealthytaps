const joi = require('joi');

exports.addRole = joi.object({
    name: joi.string().required().messages({
        'string.base': 'Name should be text.',
        'string.empty': 'Name cannot be empty.',
        'any.required': 'Name is a required.',
    }),
    weight: joi.string().required().messages({
        'string.base': 'Weight should be text.',
        'string.empty': 'Weight cannot be empty.',
        'any.required': 'Weight is a required.',
    }),
    code: joi.string().required().messages({
        'string.base': 'Code should be text.',
        'string.empty': 'Code cannot be empty.',
        'any.required': 'Code is a required.',
    })
}).unknown(false);

exports.updateRole = joi.object({
    name: joi.string().required().messages({
        'string.base': 'Name should be text.',
        'string.empty': 'Name cannot be empty.',
        'any.required': 'Name is a required.',
    }),
    weight: joi.string().required().messages({
        'string.base': 'Weight should be text.',
        'string.empty': 'Weight cannot be empty.',
        'any.required': 'Weight is a required.',
    }),
    code: joi.string().required().messages({
        'string.base': 'Code should be text.',
        'string.empty': 'Code cannot be empty.',
        'any.required': 'Code is a required.',
    })
}).unknown(false);