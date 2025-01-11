const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    cardCount: {
        type: Number,
        default: 0,
    },
    completedQuizzes: {
        type: Number,
        default: 0,
    },
    successRate: {
        type: Number,
    },
})

module.exports = mongoose.model('Statistic', statisticSchema);