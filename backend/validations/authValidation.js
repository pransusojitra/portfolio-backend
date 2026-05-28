const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email or username is required')
    .customSanitizer((value) => (value && value.includes('@') ? value.toLowerCase() : value))
    .custom((value) => {
      if (value.includes('@') && !/^\S+@\S+\.\S+$/.test(value)) {
        throw new Error('Please enter a valid email');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/\d/).withMessage('New password must contain at least one number'),
];

module.exports = { registerValidation, loginValidation, changePasswordValidation };
