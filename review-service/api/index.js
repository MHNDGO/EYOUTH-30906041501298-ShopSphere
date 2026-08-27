const app = require('../src/app');
const connectMongo = require('../src/lib/mongo');

connectMongo();

module.exports = app;
