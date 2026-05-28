/**
 * Operational (expected) API error.
 * Distinguishes user-facing errors from unexpected programmer errors.
 */
class AppError extends Error {
  /**
   * @param {string} message   Human-readable error message
   * @param {number} statusCode HTTP status code (default 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
