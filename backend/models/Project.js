const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
    },
    images: [
      {
        url: String,
        filename: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    githubUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    liveDemoUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [60, 'Category cannot exceed 60 characters'],
      default: 'fullstack',
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned'],
      default: 'completed',
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Full-text search index
ProjectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
