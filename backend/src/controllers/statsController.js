const prisma = require('../lib/prisma');
const ActivityLog = require('../models/ActivityLog');

async function getStats(req, res, next) {
  try {
    const [totalUsers, totalProducts, totalCategories, inventoryAgg] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.aggregate({ _sum: { stock: true } }),
    ]);

    let recentActivityCount = 0;
    try {
      recentActivityCount = await ActivityLog.countDocuments();
    } catch (e) {
      console.warn('Mongo stats unavailable:', e.message);
    }

    return res.json({
      totalUsers,
      totalProducts,
      totalCategories,
      totalStockUnits: inventoryAgg._sum.stock || 0,
      totalActivityLogs: recentActivityCount,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };