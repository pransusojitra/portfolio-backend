const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const {
  sendSuccess,
  sendCreated,
  sendError,
  sendUnauthorized,
} = require('../utils/apiResponse');

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Public — creates a new user account.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 'Email is already registered', 400);
  }

  // Only allow admin creation in development or with a secret header
  const assignedRole =
    role === 'admin' && process.env.ALLOW_ADMIN_REGISTER === 'true' ? 'admin' : 'user';

  const user = await User.create({ name, email, password, role: assignedRole });
  const token = generateToken(user._id);

  return sendCreated(
    res,
    {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
    'Account created successfully'
  );
});

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Public — authenticates user and returns JWT.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const defaultAdminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const loginEmail =
    email && email.includes('@')
      ? email.toLowerCase()
      : email === defaultAdminUsername
        ? defaultAdminEmail
        : null;

  if (!loginEmail) {
    return sendUnauthorized(res, 'Invalid email or password');
  }

  const user = await User.findOne({ email: loginEmail }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return sendUnauthorized(res, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  return sendSuccess(
    res,
    {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
    'Login successful'
  );
});

// ─── Get current user ─────────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 * Protected — returns the authenticated user's profile.
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return sendSuccess(res, user, 'User profile fetched successfully');
});

// ─── Update profile ───────────────────────────────────────────────────────────

/**
 * PUT /api/auth/me
 * Protected — updates name and/or avatar.
 */
const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.file) updates.avatar = `/uploads/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, user, 'Profile updated successfully');
});

// ─── Change password ──────────────────────────────────────────────────────────

/**
 * PUT /api/auth/change-password
 * Protected — verifies current password then sets new one.
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    return sendUnauthorized(res, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);
  return sendSuccess(res, { token }, 'Password changed successfully');
});

module.exports = { register, login, getMe, updateProfile, changePassword };
