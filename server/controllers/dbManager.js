const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Atlas connected.');
    } catch (err) {
        console.log("Mongo URI:", process.env.MONGO_URI);
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the app if unable to connect
    }
};

module.exports = connectDB;