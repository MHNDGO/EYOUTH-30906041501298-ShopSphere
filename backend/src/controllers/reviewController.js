const Review = require('../models/Review');
const ActivityLog = require('../models/ActivityLog');

async function listReviews(req, res, next) {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    const review = await Review.create({
      productId: req.params.productId,
      userId: req.user.id,
      userName: req.user.email,
      rating,
      comment: comment || '',
    });

    await ActivityLog.create({
      userId: req.user.id,
      action: 'CREATE_REVIEW',
      meta: { productId: req.params.productId, rating },
    });

    return res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

module.exports = { listReviews, createReview };
