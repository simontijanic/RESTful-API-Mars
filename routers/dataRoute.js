const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dataController = require('../controllers/dataController');
const authController = require('../controllers/authController');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(auth.protect); // All routes below need authentication
router.post('/data', dataController.createData);
router.get('/data/:date', dataController.getDataByDate);

// Admin only routes
router.get('/user/:email', auth.requireRole('admin'), dataController.getDataByEmail);

module.exports = router;