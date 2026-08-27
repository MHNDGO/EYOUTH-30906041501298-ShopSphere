const mongoose = require('mongoose');

async function connectMongo() {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected (review-service)');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

module.exports = connectMongo;
