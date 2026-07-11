const prisma = require('../lib/prisma');
const Review = require('../models/Review');
const ActivityLog = require('../models/ActivityLog');

async function getStats(req, res, next) {
  try {
    const [totalUsers, totalProducts, totalCategories, inventoryAgg] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.aggregate({ _sum: { stock: true } }),
    ]);

    let totalReviews = 0;
    let avgRatingResult = [];
    let recentActivityCount = 0;
    try {
      totalReviews = await Review.countDocuments();
      avgRatingResult = await Review.aggregate([
        { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        { $sort: { avgRating: -1 } },
        { $limit: 5 },
      ]);
      recentActivityCount = await ActivityLog.countDocuments();
    } catch (e) {
      console.warn('Mongo stats unavailable:', e.message);
    }

    return res.json({
      totalUsers,
      totalProducts,
      totalCategories,
      totalStockUnits: inventoryAgg._sum.stock || 0,
      totalReviews,
      topRatedProducts: avgRatingResult,
      totalActivityLogs: recentActivityCount,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
