const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

router.post('/track', telemetryController.track);
router.get('/verify', telemetryController.verify);

module.exports = router;
