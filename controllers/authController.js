const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { email, password, password2 } = req.body;
        if(!email || !password || !password2){ return res.status(400).json({
            status: 'error', message: 'Email og passord må fylles ut'
            });
        }
        if (password !== password2) { return res.status(400).json({
                status: 'error',
                message: 'Passwords matcher ikke'
            });
        }

        const user = await User.create({email, password});

        res.status(201).json({
            token: createToken(user._id)
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){ return res.status(400).json({
            status: 'error', message: 'Email og passord må fylles ut'
            });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            token: createToken(user._id)
        });
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};