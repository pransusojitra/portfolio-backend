const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendUnauthorized, sendForbidden } = require('../utils/apiResponse');

/**
 * Verify Bearer JWT and attach req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendUnauthorized(res, 'Access denied — no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return sendUnauthorized(res, 'User belonging to this token no longer exists');
    }
    next();
  } catch (err) {
    return sendUnauthorized(res, 'Token is invalid or expired');
  }
});

/**
 * Restrict access to admin users only.
 * Must be used AFTER protect middleware.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return sendForbidden(res, 'Access denied — admin privileges required');
};

module.exports = { protect, adminOnly };
