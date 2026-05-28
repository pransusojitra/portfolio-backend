const { body } = require('express-validator');

const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 }).withMessage('Phone number cannot exceed 30 characters')
    .matches(/^[0-9+\-()\s.]+$/).withMessage('Please enter a valid phone number'),

  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
];

module.exports = { contactValidation };
