const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        default: 'General'
    },
    userId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Category", categorySchema);