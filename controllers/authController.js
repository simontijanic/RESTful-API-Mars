const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const responseUtil = require('../utils/responseUtil');

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            return responseUtil.validation(res, errors);
        }

        const { email, password, password2 } = req.body;
        if(!email || !password || !password2){ 
            return responseUtil.error(res, 'Email og passord må fylles ut', 400);
        }
        if (password !== password2) { 
            return responseUtil.error(res, 'Passwords matcher ikke', 400);
        }

        const user = await User.create({email, password});
        return responseUtil.success(res, user, 'User created', 201);

    } catch (error) {
        return responseUtil.error(res, error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){ 
            return responseUtil.error(res, 'Email og passord må fylles ut', 400);
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return responseUtil.error(res, 'Invalid credentials', 401);
        }

        const token = createToken(user._id);
        return responseUtil.success(res, { token }, 'Login successful');
        
    } catch (error) {
        return responseUtil.error(res, error.message);
    }
};