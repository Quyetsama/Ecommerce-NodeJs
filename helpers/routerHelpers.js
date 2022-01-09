const Joi = require('joi')

const validateParam = (schema, name) => {
    return (req, res, next) => {
        // console.log('params', req.params[name])
        const validatorResult = schema.validate({param: req.params[name]})
        // console.log('validator result', validatorResult)

        if(validatorResult.error) {
            return res.status(400).json(validatorResult.error)
        }
        else {  
            if(!req.value) req.value = {}
            if(!req.value['params']) req.value.params = {}
            req.value.params[name] = req.params[name]
            next()
        }
    }
}


const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)

        if(validatorResult.error) {
            return res.status(400).json({
                success: false,
                message: validatorResult.error.details[0].message
            })
        }
        else {  
            if(!req.value) req.value = {}
            req.value.body = validatorResult.value
            next()
        }
    }
}

const customMessage = (field) => (
    {
        'string.base': `${ field } phải là dạng kí tự`,
        'string.min': `${ field } phải từ {#limit} đến 32 kí tự`,
        'string.max': `${ field } phải từ 6 đến {#limit} kí tự`,
        'string.empty': `${ field } không được bỏ trống`,
        'string.email': `${ field } không đúng định dạng`,
        'any.required': `${ field } là bắt buộc`
    }
)

const schemas = {
    authSignUpSchema: Joi.object().keys({
        fullName: Joi.string().min(3).required().messages(customMessage('fullName')),
        email: Joi.string().email().required().messages(customMessage('email')),
        password: Joi.string().min(6).max(32).required().messages(customMessage('password'))
    }),

    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required().messages(customMessage('email')),
        password: Joi.string().min(6).max(32).required().messages(customMessage('password'))
    }),

    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    userSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required()
    }),

    categorySchema: Joi.object().keys({
        name: Joi.string().min(2).required().messages(customMessage('name')),
        image: Joi.string().min(10).required().messages(customMessage('image'))
    }),

    // productSchema: Joi.object().keys({
    //     name: Joi.string().min(2).required().messages(customMessage('name')),
    //     image: Joi.array().required().messages(customMessage('image'))
    // })
}


module.exports = {
    validateParam,
    validateBody,
    schemas
}