const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));
Joi.objectId = require('joi-objectid')(Joi)
const {
    name,
    surname,
    email,
    password,
    messageTo,
    forbiddenSymbol
} = require('../../helpers/showMessages');

const setValidationObject = (req, res, next) => {
    if(req.originalUrl === '/api/user/sign-up' && req.method === 'POST'){
        req.schema = Joi.object({
            name: Joi.string()
                .pattern(/^(?=.{3,16}$)+[a-zA-Z]+([a-zA-Z])*$/)
                .rule({ message: name }),
            surname: Joi.string()
                .pattern(/^(?=.{3,20}$)+[a-zA-Z]+([a-zA-Z])*$/)
                .rule({ message: surname }),
            email: Joi.string()
                .pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
                .rule({ message: email }),
            password: Joi.string()
                .pattern(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/)
                .rule({ message: password }),
            confirm: Joi.any().valid(Joi.ref('password')).required(),
        })
    }else if(req.path === '/api/user/sign-in' && req.method === 'POST'){
        req.schema = Joi.object({
            email: Joi.string()
                .pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
                .rule({ message: email }).required(),
            password: Joi.string()
                .pattern(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/)
                .rule({ message: password })
                .required()
        })
    }else if (req.originalUrl === '/api/message' && req.method === 'POST'){
        req.schema = Joi.object({
            message: Joi.string().pattern(/^[0-9a-zA-Z!@#$%^&*(),.?":{}<> ]{1,150}$/)
                .rule({ message: forbiddenSymbol })
                .required(),
            byProduct: Joi.objectId().rule({ message: messageTo })
        })
    }else if (req.originalUrl === '/api/product' && req.method === 'POST'){
        req.schema = Joi.object({
            name: Joi.string()
                .pattern(/^(?=.{3,16}$)+[a-zA-Z]+([a-zA-Z ])*$/)
                .rule({ message: name }),
            price: Joi.number().required(),
            dateRelease: Joi.date().format('YYYY-MM-DD').utc()
        })
    }else if (req.originalUrl.indexOf('/api/product') === 0 && req.method === 'PATCH'){
        req.schema = Joi.object({
            name: Joi.string()
                .pattern(/^(?=.{3,16}$)+[a-zA-Z]+([a-zA-Z])*$/)
                .rule({message: name}),
            price: Joi.number(),
            dateRelease: Joi.date().format('YYYY-MM-DD').utc()
        })
    }
    next()
}
module.exports = {
    setValidationObject
}