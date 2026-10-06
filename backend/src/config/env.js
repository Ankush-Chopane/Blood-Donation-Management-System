const requiredEnv = ['JWT_SECRET'];

const validateEnv = () => {
  const missing = requiredEnv.filter((name) => !process.env[name]);

  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    missing.push('MONGODB_URI');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const getAllowedOrigins = () => {
  const rawOrigins = process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173';
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
};

module.exports = {
  validateEnv,
  getAllowedOrigins
};
