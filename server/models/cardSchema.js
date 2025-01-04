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
                    return Array.isArray(v) && v.length === 2 && v.includes('True') && v.includes('False');
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
                    return v === 'True' || v === 'False';
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
    category: {
        type: String,
        default: 'General', // Default category if none is provided
        required: true,
    },
    efactor: { // easiness factor of a card
        type: Number,
        default: 2.5, // easy = 2.5 --> hard = 1.3, always start with easy classification
        required: true
    },
    interval: {
        type: Number,
        default: 0.0,
        required: true
    },
    successfulReview: {
        type: Number,
        default: 0,
        required:true
    },
    nextReview: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model("Card", cardSchema);