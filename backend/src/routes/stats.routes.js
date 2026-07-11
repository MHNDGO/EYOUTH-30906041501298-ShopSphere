const express = require('express');
const { getStats } = require('../controllers/statsController');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

router.get('/', requireAuth, requireRole('ADMIN'), getStats);

module.exports = router;
