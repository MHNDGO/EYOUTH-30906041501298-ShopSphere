const express = require('express');
const { listCategories, createCategory } = require('../controllers/categoryController');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

router.get('/', listCategories);
router.post('/', requireAuth, requireRole('ADMIN'), createCategory);

module.exports = router;
