const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    goal: {
        type: String,
        enum: ['no_goal', 'daily', 'weekly']
    },
    wrongCredentialsCount: {
        type: Number,
        default: 0
    },
    isActivated: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);