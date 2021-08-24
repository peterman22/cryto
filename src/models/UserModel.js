const mongoose = require('mongoose');


const UserModel = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    pass: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: Date,
    image: {
        type: String
    },
    // Array of deposit IDs
    deposits: [{ type: String }],
    // Array of withdrawal IDs
    withdrawals: [{ type: String }],
    profits: {
        type: Number,
        required: true,
    },
    logins: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserModel);