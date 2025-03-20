exports.success = (res, data = null, message = '', statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data
    });
};

exports.error = (res, message = 'Internal server error', statusCode = 500) => {
    return res.status(statusCode).json({
        status: 'error',
        message
    });
};

exports.validation = (res, errors) => {
    return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: errors.array()
    });
};
