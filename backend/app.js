const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');

const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sendNotFound } = require('./utils/apiResponse');

const app = express();

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS
app.use(
  cors({
    origin: 'https://portfolio-sigma-teal-39.vercel.app',
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mongo Sanitize
app.use(mongoSanitize());

// Logger
app.use(morgan('dev'));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiter
app.use('/api', apiLimiter);

// Health Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio API Running',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

// 404
app.use((req, res) => {
  sendNotFound(res, `Route ${req.originalUrl} not found`);
});

// Error Handler
app.use(errorHandler);

module.exports = app;