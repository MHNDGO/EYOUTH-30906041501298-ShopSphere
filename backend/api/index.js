// Vercel serverless entry point. Vercel treats any file under /api as a serverless
// function; exporting the Express app lets it handle every route itself.
// Mongo connects once per cold start (connectMongo() is now idempotent on warm invocations).
const app = require('../src/app');
const connectMongo = require('../src/lib/mongo');

connectMongo();

module.exports = app;
