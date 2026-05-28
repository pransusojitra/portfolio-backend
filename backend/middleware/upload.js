const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');

// ─── Storage ─────────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

// ─── File filter ─────────────────────────────────────────────────────────────

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (jpeg, jpg, png, gif, webp) are allowed', 400), false);
  }
};

// ─── Multer instance ─────────────────────────────────────────────────────────

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 10,                  // max 10 files per request
  },
});

module.exports = upload;
