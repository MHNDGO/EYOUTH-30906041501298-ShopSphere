const express = require('express');
const { listReviews, createReview } = require('../controllers/reviewController');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.get('/:productId', listReviews);
router.post('/:productId', requireAuth, createReview);

module.exports = router;
