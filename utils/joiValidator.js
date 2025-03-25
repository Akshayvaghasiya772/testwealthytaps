const joiValidate = (validationSchema) => {
    return async function (req, res, next) {
        try {
            await validationSchema.validateAsync(req.body);
            next();
        } catch (error) {
            if(error.isJoi) return respBuilder.inValidParam(error.message, res);
            return respBuilder.failureResponse(error.message, res);
        }
    }
}

module.exports = joiValidate;