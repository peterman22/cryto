const joi = require('joi');


const newWithdrawalSchema = joi.object({
    id: joi.string().required().trim().regex(/^ref_/),
    amount: joi.number().required(),
    currency: joi.string().optional().trim(),
    walletAddress: joi.string().optional().trim().min(8),
    bankName: joi.string().optional().trim().allow(''),
    bankAccName: joi.string().optional().trim().allow(''),
    bankAccNumber: joi.number().optional(),
    status: joi.string().optional().trim().allow(''),
});

module.exports = {
    newWithdrawalSchema
}