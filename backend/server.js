const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const ensureDefaultAdmin = require('./utils/ensureDefaultAdmin');

const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Create default admin
    await ensureDefaultAdmin();

    // Start Server
    app.listen(PORT, () => {
      console.log('');
      console.log('Portfolio Backend API');
      console.log(`Mode : ${NODE_ENV}`);
      console.log(`Port : ${PORT}`);
      console.log(`Server Running Successfully`);
      console.log('');
    });

  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();