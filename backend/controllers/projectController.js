const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendError,
} = require('../utils/apiResponse');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseTechnologies = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return raw.split(',').map((s) => s.trim()); }
  }
  return [];
};

const deleteUploadedFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../uploads', filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// ─── GET /api/projects ────────────────────────────────────────────────────────

const getProjects = asyncHandler(async (req, res) => {
  const page     = Math.max(parseInt(req.query.page)  || 1, 1);
  const limit    = Math.min(parseInt(req.query.limit) || 9, 50);
  const skip     = (page - 1) * limit;

  const filter = {};

  // Category filter
  if (req.query.category && req.query.category !== 'all') {
    filter.category = req.query.category;
  }
  // Status filter
  if (req.query.status) filter.status = req.query.status;
  // Featured filter
  if (req.query.featured === 'true') filter.featured = true;
  // Technology filter
  if (req.query.tech) {
    filter.technologies = { $in: [new RegExp(req.query.tech, 'i')] };
  }
  // Full-text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Sorting
  const sortOptions = {
    newest:  { createdAt: -1 },
    oldest:  { createdAt: 1 },
    az:      { title: 1 },
    za:      { title: -1 },
    popular: { views: -1 },
    order:   { order: 1 },
  };
  const sort = sortOptions[req.query.sort] || { createdAt: -1 };

  const [projects, total] = await Promise.all([
    Project.find(filter).sort(sort).skip(skip).limit(limit).populate('createdBy', 'name email'),
    Project.countDocuments(filter),
  ]);

  return sendSuccess(res, projects, 'Projects fetched successfully', 200, {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  });
});

// ─── GET /api/projects/:id ────────────────────────────────────────────────────

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('createdBy', 'name email');
  if (!project) return sendNotFound(res, 'Project not found');

  // Increment view count (fire-and-forget)
  Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

  return sendSuccess(res, project, 'Project fetched successfully');
});

// ─── POST /api/projects ───────────────────────────────────────────────────────

const createProject = asyncHandler(async (req, res) => {
  const {
    title, description, shortDescription,
    technologies, githubUrl, liveDemoUrl,
    category, status, featured, order,
  } = req.body;

  // Build images array from uploaded files
  const images = (req.files || []).map((file, idx) => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    isPrimary: idx === 0,
  }));

  const project = await Project.create({
    title,
    description,
    shortDescription,
    technologies: parseTechnologies(technologies),
    images,
    githubUrl,
    liveDemoUrl,
    category,
    status,
    featured: featured === 'true' || featured === true,
    order: parseInt(order) || 0,
    createdBy: req.user._id,
  });

  return sendCreated(res, project, 'Project created successfully');
});

// ─── PUT /api/projects/:id ────────────────────────────────────────────────────

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return sendNotFound(res, 'Project not found');

  const {
    title, description, shortDescription,
    technologies, githubUrl, liveDemoUrl,
    category, status, featured, order,
    removeImages,  // JSON array of filenames to remove
  } = req.body;

  // Handle image removals
  let currentImages = [...project.images];
  if (removeImages) {
    const toRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
    toRemove.forEach((filename) => {
      deleteUploadedFile(filename);
      currentImages = currentImages.filter((img) => img.filename !== filename);
    });
  }

  // Append newly uploaded images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file, idx) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      isPrimary: currentImages.length === 0 && idx === 0,
    }));
    currentImages = [...currentImages, ...newImages];
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      ...(title && { title }),
      ...(description && { description }),
      ...(shortDescription !== undefined && { shortDescription }),
      ...(technologies && { technologies: parseTechnologies(technologies) }),
      ...(githubUrl !== undefined && { githubUrl }),
      ...(liveDemoUrl !== undefined && { liveDemoUrl }),
      ...(category && { category }),
      ...(status && { status }),
      ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
      ...(order !== undefined && { order: parseInt(order) || 0 }),
      images: currentImages,
    },
    { new: true, runValidators: true }
  );

  return sendSuccess(res, updatedProject, 'Project updated successfully');
});

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return sendNotFound(res, 'Project not found');

  // Delete all associated uploaded images
  project.images.forEach((img) => deleteUploadedFile(img.filename));

  await project.deleteOne();
  return sendSuccess(res, null, 'Project deleted successfully');
});

// ─── GET /api/projects/featured ───────────────────────────────────────────────

const getFeaturedProjects = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  const projects = await Project.find({ featured: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit);
  return sendSuccess(res, projects, 'Featured projects fetched successfully');
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
};
