const joi = require('joi');


const newDepositSchema = joi.object({
    id: joi.string().required().trim().regex(/^ref_/),
    amount: joi.number().required(),
    currency: joi.string().required().trim(),
    walletAddress: joi.string().required().trim().min(8),
    plan: joi.number().required()
});

module.exports = {
    newDepositSchema
}