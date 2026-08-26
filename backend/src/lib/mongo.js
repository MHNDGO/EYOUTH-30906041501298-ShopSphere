const mongoose = require('mongoose');

async function connectMongo() {
  // readyState 1 = connected, 2 = connecting — skip reconnecting on warm serverless invocations
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

module.exports = connectMongo;
