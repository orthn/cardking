const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        default: 'General',
    },
    cardCount: {
        type: Number,
        required: true,
        default: 0,
    },
    userId: {
        type: String,
        required: true,
    },
    cards: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Card',
        default: [],
    },
});

module.exports = mongoose.model('Category', categorySchema);
