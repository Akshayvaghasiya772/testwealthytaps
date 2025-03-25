const joi = require("joi");

exports.partialUpdate = joi.object({
    isActive: joi.boolean().required().messages({
        'boolean.base': 'isActive must be boolean.',
        'any.required': 'isActive is a required.',
    }),
})