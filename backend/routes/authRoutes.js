const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} = require('../validations/authValidation');

// Public routes
router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login',    authLimiter, loginValidation,    validate, login);

// Protected routes
router.get('/me',                protect, getMe);
router.put('/me',                protect, upload.single('avatar'), updateProfile);
router.put('/change-password',   protect, changePasswordValidation, validate, changePassword);

module.exports = router;
