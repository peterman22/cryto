const joi = require('joi');

const newUserSchema = joi.object({
    firstname: joi.string().required().trim().min(2).required(),
    middlename: joi.string().allow('').trim().optional(),
    lastname: joi.string().required().trim().min(2).required(),
    email: joi.string().required().trim().email().required(),
    password: joi.string().required().trim().min(6).required(),
});

const existingUserSchema = joi.object({
    email: joi.string().required().trim().email().required(),
    password: joi.string().required().trim().min(6).required(),
});

const updateProfileImageSchema = joi.object({
    email: joi.string().required().trim().email().required(),
    image: joi.string().required().trim().uri()
});


module.exports = {
    newUserSchema,
    existingUserSchema,
    updateProfileImageSchema,
}