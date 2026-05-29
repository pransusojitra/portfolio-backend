const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sendNotFound } = require('./utils/apiResponse');

const app = express();

//
// FIXED CORS
//

const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

//
// SECURITY MIDDLEWARE
//

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

//
// APPLY CORS
//

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//
// SANITIZE
//

app.use(mongoSanitize());

//
// BODY PARSER
//

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//
// LOGGER
//

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

//
// STATIC FILES
//

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//
// RATE LIMITER
//

app.use('/api', apiLimiter);

//
// HEALTH ROUTE
//

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

//
// API ROUTES
//

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);

//
// 404
//

app.use((req, res) => {
  sendNotFound(res, `Route ${req.originalUrl} not found`);
});

//
// ERROR HANDLER
//

app.use(errorHandler);

module.exports = app;