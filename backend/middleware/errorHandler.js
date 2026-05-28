const AppError = require('../utils/AppError');

/**
 * Centralised error handler — the last middleware in the chain.
 * Converts AppErrors and well-known Mongoose/JWT errors into clean JSON
 * responses; everything else falls back to a generic 500.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // --- Mongoose bad ObjectId ---
  if (err.name === 'CastError') {
    error = new AppError(`Resource not found with id: ${err.value}`, 404);
  }

  // --- Mongoose duplicate key ---
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`Duplicate field value: ${field} already exists`, 400);
  }

  // --- Mongoose validation error ---
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join(', '), 400);
  }

  // --- JWT errors ---
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token — please log in again', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired — please log in again', 401);
  }

  // Development: include full stack trace
  const isDev = process.env.NODE_ENV === 'development';

  return res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
