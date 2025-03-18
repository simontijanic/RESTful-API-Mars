const mongoose = require('mongoose');

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};