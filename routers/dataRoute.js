const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const authController = require('../controllers/authController');
const { validateData } = require('../utils/validateData');
const { protect, restrictTo } = require('../middleware/auth');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protecta data routes
router.post('/data', protect, validateData, dataController.createData);
router.get('/data/date/:date', protect, dataController.getDataByDate);
router.get('/data/user/:email', protect, restrictTo('admin', 'superadmin'), dataController.getDataByEmail);

module.exports = router;