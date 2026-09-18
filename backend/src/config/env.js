const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/grocery_delivery_db',
  jwtSecret: process.env.JWT_SECRET || 'grocery_secret_super_key_2026_secure_token',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  useMemoryDbFallback: process.env.USE_MEMORY_DB_FALLBACK !== 'false',
};

module.exports = config;
