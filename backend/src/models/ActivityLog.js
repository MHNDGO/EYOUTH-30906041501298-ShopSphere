const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  action: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
