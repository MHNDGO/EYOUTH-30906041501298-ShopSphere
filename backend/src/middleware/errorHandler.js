const { log } = require('./requestLogger');

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  log('error', err.message || 'Unhandled error', {
    method: req.method,
    path: req.originalUrl,
    status,
    stack: err.stack,
  });
  res.status(status).json({ message: err.message || 'Internal server error' });
}

module.exports = errorHandler;
