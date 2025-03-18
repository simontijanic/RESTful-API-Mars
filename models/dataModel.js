const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.endsWith(process.env.EMAIL_PATTERN);
            },
            message: 'Email must be an AFK email address'
        }
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Data', dataSchema);