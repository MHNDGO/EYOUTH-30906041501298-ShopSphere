# Structured Logging — ShopSphere

Every request and error is logged as one JSON line, carrying `timestamp` and `level`
(`info`/`warn`/`error`), via `requestLogger`/`errorHandler` in each service
(`backend/src/middleware/requestLogger.js`, `review-service/src/middleware/errorHandler.js`).

**Where these logs are read in production:** Vercel Dashboard → the relevant project
(shopsphere-backend / shopsphere-frontend / shop-sphere-review) → **Logs** tab (Runtime
Logs), which streams stdout from every serverless function invocation in real time and
is searchable by path, status code, and time range. The same logs are also retrievable
via the Vercel CLI with `vercel logs <deployment-url>`.
