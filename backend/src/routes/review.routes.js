const express = require('express');
const { listReviews, createReview } = require('../controllers/reviewController');
const requireAuth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.get('/:productId/reviews', listReviews);
router.post('/:productId/reviews', requireAuth, createReview);

module.exports = router;
