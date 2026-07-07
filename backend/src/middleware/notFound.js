const AppError = require('../utils/appError');

const notFound = (req, res, next) => {
  // Silently ignore favicon requests made automatically by browsers
  if (req.originalUrl === '/favicon.ico') {
    return res.status(204).end();
  }
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

module.exports = notFound;
