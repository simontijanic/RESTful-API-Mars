const { body } = require('express-validator');

exports.validateData = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Must be a valid email')
        .matches(/@afk\.no$/)
        .withMessage('Must be an AFK email address'),
    body('date')
        .isISO8601()
        .withMessage('Must be a valid date (YYYY-MM-DD)')
        .custom(value => {
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .withMessage('Invalid date format'),
    body('content')
        .custom((value) => {
            if (typeof value === 'object' && value !== null) {
                return true;
            }
            try {
                JSON.parse(value);
                return true;
            } catch (e) {
                throw new Error('Content must be valid JSON');
            }
        })
        .withMessage('Content must be valid JSON')
];
