function log(level, message, meta = {}) {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...meta }));
}

function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    log(level, 'request completed', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  log('error', err.message || 'Unhandled error', { method: req.method, path: req.originalUrl, status, stack: err.stack });
  res.status(status).json({ message: err.message || 'Internal server error' });
}

module.exports = { errorHandler, requestLogger };
