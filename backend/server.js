const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const ensureDefaultAdmin = require('./utils/ensureDefaultAdmin');

const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    await connectDB();
    await ensureDefaultAdmin();

    const server = app.listen(PORT, () => {
      console.log('');
      console.log('Portfolio Backend API');
      console.log(`Mode : ${NODE_ENV}`);
      console.log(`Port : ${PORT}`);
      console.log(`Server Running On Port ${PORT}`);
      console.log('');
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.error(`Stop the existing process, or start this app with another port: $env:PORT=5001; node server.js`);
        process.exit(1);
      }

      console.error(`Server error: ${err.message}`);
      process.exit(1);
    });

    const gracefulShutdown = (signal) => {
      console.log(`\n[${signal}] Shutting down...`);
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled promise rejection:', err.message);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught exception:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
