const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['true_false', 'single_choice', 'multiple_choice'],
        required: true,
    },
    answers: {
        type: [String], // An array of possible answers
        validate: {
            validator: function (v) {
                if (this.type === 'true_false') {
                    return Array.isArray(v) && v.length === 2 && v.includes('true') && v.includes('false');
                }
                if (this.type === 'single_choice') {
                    return Array.isArray(v) && v.length > 0;
                }
                if (this.type === 'multiple_choice') {
                    return Array.isArray(v) && v.length > 1;
                }
                return true;
            },
            message: 'Answers are invalid for the specified card type.',
        },
        required: true,
    },
    correctAnswer: {
        type: mongoose.Schema.Types.Mixed, // Flexible to store string or array
        required: true,
        validate: {
            validator: function (v) {
                if (this.type === 'true_false') {
                    return v === 'true' || v === 'false';
                }
                if (this.type === 'single_choice') {
                    return typeof v === 'string' && this.answers.includes(v);
                }
                if (this.type === 'multiple_choice') {
                    return Array.isArray(v) && v.every(ans => this.answers.includes(ans));
                }
                return true;
            },
            message: 'Correct answer is invalid for the specified card type.',
        },
    },
});

module.exports = mongoose.model("Card", cardSchema);