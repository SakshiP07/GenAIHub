function notFound(req, res, next) {
  if (req.originalUrl === "/favicon.ico") {
    return res.status(204).end();
  }

  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

module.exports = notFound;
