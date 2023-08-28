const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accessToken: {

        type: String,
        required: true
    },
    isValid: {

        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

const resetToken = mongoose.model('resetToken', resetTokenSchema);

module.exports = resetToken;