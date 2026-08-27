// Standalone Vercel serverless function — NOT part of the main Express app (api/index.js).
// Background workload: deletes ActivityLog entries older than 30 days. Intended to be hit
// periodically (Vercel Cron, or manually) rather than as part of any user-facing request.
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  action: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

async function connect() {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) return;
  await mongoose.connect(process.env.MONGO_URI);
}

module.exports = async (req, res) => {
  try {
    await connect();
    const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);

    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const result = await ActivityLog.deleteMany({ createdAt: { $lt: cutoff } });

    return res.status(200).json({
      status: 'ok',
      deletedCount: result.deletedCount,
      cutoff: cutoff.toISOString(),
      ranAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
