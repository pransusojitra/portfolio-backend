const express = require('express');
const router = express.Router();

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
} = require('../controllers/projectController');

const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { projectValidation } = require('../validations/projectValidation');

// Public routes
router.get('/',          getProjects);
router.get('/featured',  getFeaturedProjects);
router.get('/:id',       getProjectById);

// Admin-only routes
router.post(
  '/',
  protect, adminOnly,
  upload.array('images', 10),
  projectValidation, validate,
  createProject
);

router.put(
  '/:id',
  protect, adminOnly,
  upload.array('images', 10),
  projectValidation, validate,
  updateProject
);

router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;
