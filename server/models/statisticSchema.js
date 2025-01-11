const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    completedQuizzes: {
        type: Number,
        default: 0,
    },
    streak: {
        type: Number,
    },
    lastQuizDate: {
        type: Date,
    },
    successRate: {
        type: Number,
    },
})

module.exports = mongoose.model('Statistic', statisticSchema);