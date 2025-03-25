const { validationResult } = require('express-validator');
const Data = require('../models/dataModel');
const responseUtil = require('../utils/responseUtil');

exports.createData = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseUtil.validation(res, errors);
        }

        const { email, date, content } = req.body;
        let parsedContent;

        try {
            parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        } catch (error) {
            return responseUtil.error(res, 'Invalid JSON content', 400);
        }
        
        const data = new Data({
            email,
            date: new Date(date),
            content: parsedContent
        });
        
        await data.save();
        return responseUtil.success(res, data, 'Data created', 201);

    } catch (error) {
        return responseUtil.error(res, error.message);
    }
};

exports.getDataByDate = async (req, res) => {
    try {
        const data = await Data.find({
            date: new Date(req.params.date)
        });
        return responseUtil.success(res, data);
    } catch (error) {
        return responseUtil.error(res, error.message);
    }
};

exports.getDataByEmail = async (req, res) => {
    try {
        const data = await Data.find({
            email: req.params.email
        });
        return responseUtil.success(res, data);
    } catch (error) {
        return responseUtil.error(res, error.message);
    }
}