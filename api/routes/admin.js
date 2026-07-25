const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

router.get('/stats', requireAuth, requireAdmin, adminController.getStats);

module.exports = router;
