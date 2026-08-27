// Reviews no longer run in this application. This controller is a thin REST proxy to the
// independently deployed review-service — see Task 3.1/3.2.
const axios = require('axios');

const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'http://localhost:5002';

async function listReviews(req, res, next) {
  try {
    const { data } = await axios.get(`${REVIEW_SERVICE_URL}/api/reviews/${req.params.productId}`);
    return res.json(data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const { data } = await axios.post(
      `${REVIEW_SERVICE_URL}/api/reviews/${req.params.productId}`,
      req.body,
      { headers: { Authorization: req.headers.authorization } }
    );
    return res.status(201).json(data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    next(err);
  }
}

module.exports = { listReviews, createReview };
