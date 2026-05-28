const mongoose = require('mongoose');

const getMongoUri = () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is missing. Add it in your server environment variables.');
  }

  if (uri.includes('<db_password>')) {
    throw new Error('MONGO_URI still contains <db_password>. Replace it with the real MongoDB Atlas database user password.');
  }

  if (/mongodb(?:\+srv)?:\/\/[^:]+:=/.test(uri)) {
    throw new Error('MONGO_URI has an extra "=" before the password. Use username:password, not username:=password.');
  }

  return uri;
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(getMongoUri(), {
      serverSelectionTimeoutMS: 10_000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    let message = error.message;

    if (/bad auth|authentication failed/i.test(error.message)) {
      message = 'MongoDB authentication failed. Check the Atlas database username/password in MONGO_URI.';
    }

    if (/querySrv|ENOTFOUND|ETIMEOUT|ECONNREFUSED|network/i.test(error.message)) {
      message = `${message}. Also check Atlas Network Access: add your server IP address, or 0.0.0.0/0 for testing.`;
    }

    console.error(`MongoDB connection error: ${message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
