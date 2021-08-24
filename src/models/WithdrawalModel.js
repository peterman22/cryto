const mongoose = require('mongoose');


const WithdrawalModel = mongoose.Schema({
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
    user: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: false,
    },
    bankAccName: {
        type: String,
        required: false,
    },
    bankAccNumber: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Withdrawal', WithdrawalModel);