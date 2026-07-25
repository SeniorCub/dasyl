const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

router.post('/track', telemetryController.track);

module.exports = router;
