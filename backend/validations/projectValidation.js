const { body } = require('express-validator');

const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Project description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),

  body('technologies')
    .notEmpty().withMessage('At least one technology is required')
    .custom((val) => {
      // Accept both JSON string array and comma-separated string
      let arr = val;
      if (typeof val === 'string') {
        try { arr = JSON.parse(val); } catch { arr = val.split(',').map((s) => s.trim()); }
      }
      if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Technologies must be a non-empty array');
      }
      return true;
    }),

  body('githubUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('GitHub URL must be a valid URL'),

  body('liveDemoUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Live demo URL must be a valid URL'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 60 }).withMessage('Category cannot exceed 60 characters'),

  body('status')
    .optional()
    .isIn(['completed', 'in-progress', 'planned'])
    .withMessage('Invalid status'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be true or false'),
];

module.exports = { projectValidation };
