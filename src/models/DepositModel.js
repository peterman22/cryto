const mongoose = require('mongoose');


const DepositModel = mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        trim: true
    },
    walletAddress: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    plan: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model('Deposit', DepositModel);