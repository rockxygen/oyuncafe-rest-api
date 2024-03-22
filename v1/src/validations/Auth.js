const Joi = require("joi");

const loginValidation = Joi.object({
    username: Joi.string().required().min(3),
    password: Joi.string().required().min(5),
});

const registerValidation = Joi.object({
    username: Joi.string().required().min(3),
    password: Joi.string().required().min(6).max(11).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email().required(),
    gender: Joi.string()
});

module.exports = {
    loginValidation,
    registerValidation
}