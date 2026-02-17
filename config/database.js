const mongoose = require('mongoose');

// Build MongoDB connection string from environment variables while avoiding
// exposing credentials in logs. Prefer providing a full MONGODB_URI in production.
const {
  MONGODB_URI,
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_HOST = 'localhost:27017',
  MONGODB_DB = 'all-data',
  MONGODB_OPTIONS = '',
  MONGODB_USE_SRV,
} = process.env;

let mongoUri = MONGODB_URI;

if (!mongoUri) {
  // In production we must require an explicit MONGODB_URI to avoid accidental
  // connections to localhost. In development it's acceptable to fall back.
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: MONGODB_URI is not set in production environment. Aborting.');
    process.exit(1);
  }

  // If user/pass provided, include them safely (URL-encoded)
  if (MONGODB_USER && MONGODB_PASS) {
    const user = encodeURIComponent(MONGODB_USER);
    const pass = encodeURIComponent(MONGODB_PASS);
    const prefix = MONGODB_USE_SRV === 'true' ? 'mongodb+srv' : 'mongodb';
    mongoUri = `${prefix}://${user}:${pass}@${MONGODB_HOST}/${MONGODB_DB}${MONGODB_OPTIONS ? '?' + MONGODB_OPTIONS : ''}`;
  } else {
    mongoUri = `mongodb://${MONGODB_HOST}/${MONGODB_DB}${MONGODB_OPTIONS ? '?' + MONGODB_OPTIONS : ''}`;
  }
}

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) || 10,
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS, 10) || 5000,
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS, 10) || 45000,
};

mongoose
  .connect(mongoUri, connectOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    // Avoid printing the full connection string which may contain secrets
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
  });

module.exports = mongoose;
