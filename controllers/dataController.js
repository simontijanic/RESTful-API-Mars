const { validationResult } = require('express-validator');
const Data = require('../models/dataModel');

exports.createData = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { email, date, content } = req.body;
        let parsedContent;

        try {
            parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid JSON content'
            });
        }
        
        const data = new Data({
            email,
            date: new Date(date),
            content: parsedContent
        });
        
        await data.save();

        res.status(201).json({
            status: 'success',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.getDataByDate = async (req, res) => {
    try {
        const data = await Data.find({
            date: new Date(req.params.date)
        });
        res.json({
            status: 'success',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.getDataByEmail = async (req, res) => {
    try {
        const data = await Data.find({
            email: req.params.email
        });
        res.json({
            status: 'success',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}