// Structured logging: every request emits one JSON line with a timestamp and a severity level.
// On Vercel, stdout from serverless functions is captured automatically and readable in
// Project -> Deployments -> [deployment] -> Runtime Logs (also streamable via `vercel logs`).
function log(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    log(level, 'request completed', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
    });
  });
  next();
}

module.exports = { requestLogger, log };
