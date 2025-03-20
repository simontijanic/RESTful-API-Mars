const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const { validateData } = require('../utils/validateData');

router.post('/data', validateData, dataController.createData);
router.get('/data/date/:date', dataController.getDataByDate);
router.get('/data/user/:email', dataController.getDataByEmail);

module.exports = router;