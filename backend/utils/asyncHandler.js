/**
 * Wraps an async function so that any thrown errors are forwarded
 * to Express's next(err) — no try/catch needed in controllers.
 *
 * @param {Function} fn  Async controller function
 * @returns {Function}   Express middleware
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
